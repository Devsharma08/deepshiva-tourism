// server.js - Complete Backend
// linked with main1.jsx


require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURATION ---
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// In-Memory Chat History (Session storage)
const chatHistory = new Map(); 

// --- SECTION 1: DATABASE & USER MANAGEMENT ---

// [CRITICAL] Ensures a new user works immediately without manual DB entry
async function ensureUserExists(userId) {
    const { data } = await supabase.from('user_preferences').select('id').eq('user_id', userId).single();
    
    if (!data) {
        console.log(`✨ New User Detected (${userId}). Initializing profile...`);
        // 1. Create Default Preferences
        await supabase.from('user_preferences').insert({ 
            user_id: userId, 
            budget_tier: 'Mid', 
            interest_weights: {} 
        });
        // 2. Create Default Context
        await supabase.from('trip_context').insert({ 
            user_id: userId, 
            trip_mode: 'Solo',
            current_location: 'Unknown',
            last_suggested_poi: null
        });
    }
}

// --- SECTION 2: HELPER FUNCTIONS (The Brain) ---

async function getWeather(location) {
    if (!process.env.OPENWEATHER_API_KEY || !location || location === 'Unknown') return "Weather unknown";
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
        const data = await res.json();
        return data.main ? `${data.weather[0].description}, ${Math.round(data.main.temp)}°C` : "Unknown";
    } catch (e) { return "Unknown"; }
}

async function findSimilarPlaces(query) {
    try {
        const result = await embeddingModel.embedContent(query);
        const { data, error } = await supabase.rpc('match_poi', {
            query_embedding: result.embedding.values,
            match_threshold: 0.4,
            match_count: 3
        });
        if (error || !data || data.length === 0) return "";
        return data.map(p => `- ${p.name} (${p.category}): ${p.description}`).join("\n");
    } catch (e) { return ""; }
}

async function analyzeAndUpdateContext(userId, message, lastSuggestion) {
    try {
        // Strict Rubric for Personality Analysis
        const prompt = `
        Analyze User Message: "${message}"
        Context: Last suggested place was "${lastSuggestion || 'None'}".
        
        Task:
        1. Extract generic updates (Budget, Trip Mode).
        2. Detect INTEREST scores based on this STRICT RUBRIC:
           - "I love", "My favorite" -> +50
           - "I like", "Good"        -> +20
           - "I dislike", "Bored"    -> -20
           - "I hate", "Avoid"       -> -50
        3. Did user REJECT the last suggestion?
        
        Return JSON ONLY: 
        { "budget": "Low/Mid/High", "trip_mode": "Solo/Family", "rejected": boolean, "interest_updates": { "tag": score } }
        `;
        
        const result = await chatModel.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        const updates = JSON.parse(text);

        // Update DB Context
        if (updates.budget) await supabase.from('user_preferences').update({ budget_tier: updates.budget }).eq('user_id', userId);
        if (updates.trip_mode) await supabase.from('trip_context').update({ trip_mode: updates.trip_mode }).eq('user_id', userId);
        
        // Update Interest Weights (Math)
        if (updates.interest_updates) {
            const { data } = await supabase.from('user_preferences').select('interest_weights').eq('user_id', userId).single();
            let currentWeights = data?.interest_weights || {};
            
            for (const [tag, score] of Object.entries(updates.interest_updates)) {
                let newScore = (currentWeights[tag] || 0) + score;
                currentWeights[tag] = Math.max(-100, Math.min(100, newScore)); // Cap between -100 and 100
            }
            await supabase.from('user_preferences').update({ interest_weights: currentWeights }).eq('user_id', userId);
        }

        // Log Rejection
        if (updates.rejected && lastSuggestion) {
            await supabase.from('interaction_log').insert({ user_id: userId, suggested_poi_name: lastSuggestion, user_action: 'Rejected' });
        }

    } catch (e) { console.error("Analyst Error:", e.message); }
}

// --- SECTION 3: API ENDPOINTS ---

// GET /api/chat/history?userId=...
app.get('/api/chat/history', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const history = chatHistory.get(userId) || [];
    res.json(history.map(msg => ({ sender: msg.role === 'User' ? 'user' : 'bot', text: msg.text })));
});

// POST /api/chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        if (!userId) return res.status(400).json({ error: "Missing userId" });

        // 1. Auto-Initialize User if needed
        await ensureUserExists(userId);

        // 2. Fetch Context & Weather
        const { data: ctxCheck } = await supabase.from('trip_context').select('last_suggested_poi').eq('user_id', userId).single();
        await analyzeAndUpdateContext(userId, message, ctxCheck?.last_suggested_poi);

        const { data: prefs } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single();
        const { data: ctx } = await supabase.from('trip_context').select('*').eq('user_id', userId).single();
        const weather = await getWeather(ctx?.current_location);
        
        // 3. Vector Search
        let dbMatches = "";
        if (message.length > 4) dbMatches = await findSimilarPlaces(message);

        // 4. Build Prompt
        if (!chatHistory.has(userId)) chatHistory.set(userId, []);
        const history = chatHistory.get(userId);
        
        const isPlan = message.toLowerCase().includes('plan') || message.toLowerCase().includes('itinerary');
        
        const systemPrompt = `
        You are an Advanced Travel Guide.
        USER PROFILE: Budget=${prefs?.budget_tier}, Mode=${ctx?.trip_mode}, Interests=${JSON.stringify(prefs?.interest_weights)}.
        CONTEXT: Weather=${weather}.
        KNOWLEDGE: ${dbMatches}
        HISTORY: ${history.map(e => e.role + ": " + e.text).join(" | ")}
        
        INSTRUCTION: ${isPlan ? 'Return valid JSON: { "title": "Trip Title", "stops": [{"time","activity","desc"}] }' : 'Answer conversationally. Be brief.'}
        `;

        // 5. Generate Response
        const result = await chatModel.generateContent(systemPrompt + `\nUser: "${message}"`);
        const responseText = result.response.text();

        // 6. Handle Response Types
        let replyText = responseText;
        if (isPlan) {
            try {
                const jsonStr = responseText.replace(/```json|```/g, '').trim();
                const plan = JSON.parse(jsonStr);
                replyText = `I've created a plan for you: ${plan.title}`;
                
                // Update Context with this new suggestion
                await supabase.from('trip_context').update({ last_suggested_poi: plan.title }).eq('user_id', userId);
            } catch (e) { /* Fallback to text if JSON fails */ }
        }

        history.push({ role: "User", text: message });
        history.push({ role: "Assistant", text: replyText });
        
        // Return pure text for now (Frontend handles JSON parsing if needed later)
        res.json({ reply: responseText });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});