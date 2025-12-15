// ============================================================================
// ULTIMATE TRAVEL AI SERVER - TEAM DDRS
// Combines ALL APIs: server.js + serve2.js + server1.js
// Features: LLM, Gemini, Streaming, Flights, Hotels, Activities, Events, Maps
// ============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ============================================================================
// CONFIGURATION
// ============================================================================

// LLM Configuration
const LLM_URL = process.env.LLM_API_URL || 'https://jayceon-crumblier-unmeaningly.ngrok-free.dev';
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const geminiModel = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" });
const chatModelPro = genAI?.getGenerativeModel({ model: "gemini-2.5-pro" });
const embeddingModel = genAI?.getGenerativeModel({ model: "text-embedding-004" });

// Supabase
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

// External API Keys
const LOCATIONIQ_KEY = process.env.LOCATIONIQ_KEY;
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "bd5e378503939ddaee76f12ad7a97608";
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

// Amadeus (Flight API)
let amadeus;
try {
  const Amadeus = require('amadeus');
  if (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
    amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
      logLevel: 'silent'
    });
  }
} catch (e) {
  console.warn("⚠️ Amadeus SDK not available, using mock data");
}

// ============================================================================
// IN-MEMORY STORAGE
// ============================================================================

const chatHistory = new Map();
const userPreferences = new Map();
let cachedLLMEndpoint = null;

// ============================================================================
// RATE LIMITING
// ============================================================================

const requestQueue = [];
let isProcessing = false;
const REQUEST_DELAY = 2000;

const rateLimitedRequest = async (fn, ...args) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ fn, args, resolve, reject });
    if (!isProcessing) processQueue();
  });
};

const processQueue = async () => {
  if (requestQueue.length === 0 || isProcessing) return;
  isProcessing = true;
  const { fn, args, resolve, reject } = requestQueue.shift();

  try {
    const result = await fn(...args);
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, REQUEST_DELAY);
  }
};

// ============================================================================
// SYSTEM PROMPTS & MOCK DATA
// ============================================================================

const SYSTEM_PROMPT = `
You are 'Treveor', a friendly, expert local guide for all of India.
Your role: Help users plan trips, share cultural stories, and provide practical travel advice.

KEY RESPONSE RULES:
1. Be conversational and engaging - use emojis occasionally 🌟
2. Provide practical, actionable advice
3. Share interesting cultural insights and stories
4. Keep responses concise but informative (max 200 words)
5. Be enthusiastic about Indian travel and culture
6. Use a warm, welcoming tone

Format your responses with proper line breaks for readability.
`;

const MOCK_RESPONSES = {
  "hello": "Namaste! 🙏 I'm Treveor, your friendly India travel guide. I can help you plan trips, share stories, and provide travel advice across this incredible country! Where would you like to explore today? 🌄🇮🇳",
  "hi": "Hello! 👋 Welcome to Treveor! I specialize in Indian travel - from the Himalayas to the backwaters of Kerala. How can I assist with your Indian adventure? 🗺️",
  "weather": "India's weather varies greatly! 🌤️\n• North: Cold winters, hot summers\n• South: Tropical climate year-round\n• Best travel seasons: October to March for most regions\n• Monsoon (Jun-Sep): Heavy rains but lush greenery! 🌧️",
  "places": "🌟 Top Indian Destinations:\n• Rajasthan: Palaces & deserts 🏜️\n• Kerala: Backwaters & beaches 🌴\n• Goa: Beaches & Portuguese heritage 🏖️\n• Himachal: Mountains & adventure 🏔️\n• Tamil Nadu: Temples & culture 🛕\n• Varanasi: Spiritual experiences 🕉️",
  "food": "🍛 Must-try Indian foods:\n• North: Butter Chicken, Naan, Chole Bhature\n• South: Dosa, Idli, Sambar\n• West: Vada Pav, Dhokla, Pav Bhaji\n• East: Momos, Rasgulla, Fish Curry\n• Street Food: Pani Puri, Chaat, Samosa 🌶️",
  "budget": "💰 Budget Travel Tips:\n• Best time: Off-season (monsoon)\n• Stay: Hostels (₹300-800/night)\n• Transport: Trains & buses\n• Food: Street food & local dhabas\n• Daily budget: ₹1500-3000/day possible!"
};

const FIXED_QUESTIONS = [
  "Best places to visit in India?",
  "Local food to try in Rajasthan",
  "How to plan a Kerala trip?",
  "Budget travel tips for India"
];

// Indian Airports Database
const INDIAN_AIRPORTS = [
  { name: "Indira Gandhi International Airport", iata: "DEL", city: "New Delhi" },
  { name: "Chhatrapati Shivaji Maharaj International Airport", iata: "BOM", city: "Mumbai" },
  { name: "Kempegowda International Airport", iata: "BLR", city: "Bengaluru" },
  { name: "Rajiv Gandhi International Airport", iata: "HYD", city: "Hyderabad" },
  { name: "Chennai International Airport", iata: "MAA", city: "Chennai" },
  { name: "Netaji Subhas Chandra Bose International Airport", iata: "CCU", city: "Kolkata" },
  { name: "Cochin International Airport", iata: "COK", city: "Kochi" },
  { name: "Sardar Vallabhbhai Patel International Airport", iata: "AMD", city: "Ahmedabad" },
  { name: "Goa International Airport", iata: "GOI", city: "Goa" },
  { name: "Pune Airport", iata: "PNQ", city: "Pune" },
  { name: "Jaipur International Airport", iata: "JAI", city: "Jaipur" },
  { name: "Lucknow Airport", iata: "LKO", city: "Lucknow" },
  { name: "Trivandrum International Airport", iata: "TRV", city: "Thiruvananthapuram" },
  { name: "Biju Patnaik International Airport", iata: "BBI", city: "Bhubaneswar" },
  { name: "Lal Bahadur Shastri International Airport", iata: "VNS", city: "Varanasi" },
  { name: "Sri Guru Ram Dass Jee International Airport", iata: "ATQ", city: "Amritsar" },
  { name: "Mangalore International Airport", iata: "IXE", city: "Mangalore" },
  { name: "Coimbatore International Airport", iata: "CJB", city: "Coimbatore" },
  { name: "Visakhapatnam Airport", iata: "VTZ", city: "Visakhapatnam" },
  { name: "Bagdogra Airport", iata: "IXB", city: "Siliguri" },
  { name: "Srinagar Airport", iata: "SXR", city: "Srinagar" },
  { name: "Udaipur Airport", iata: "UDR", city: "Udaipur" },
  { name: "Patna Airport", iata: "PAT", city: "Patna" },
  { name: "Chandigarh Airport", iata: "IXC", city: "Chandigarh" },
  { name: "Ranchi Airport", iata: "IXR", city: "Ranchi" },
  { name: "Guwahati Airport", iata: "GAU", city: "Guwahati" },
  { name: "Nagpur Airport", iata: "NAG", city: "Nagpur" },
  { name: "Indore Airport", iata: "IDR", city: "Indore" },
  { name: "Raipur Airport", iata: "RPR", city: "Raipur" }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// --- Utility Helpers ---
const getAmenities = () => ['Free Wifi', 'Swimming Pool', 'Spa', 'Parking', 'Restaurant', 'Gym', 'Bar'].sort(() => 0.5 - Math.random()).slice(0, 5);

const getFakePrice = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return (Math.abs(hash) % 8000) + 2000;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// --- LLM Helper Functions ---
async function callLocalLLM(message, options = {}) {
  const { temperature = 0.7, max_tokens = 1024 } = options;

  const endpoints = cachedLLMEndpoint ? [cachedLLMEndpoint] : [
    { url: `${LLM_URL}/chat`, data: { message, temperature, max_tokens } },
    { url: `${LLM_URL}/api/chat`, data: { message, temperature, max_tokens } },
    { url: `${LLM_URL}/v1/completions`, data: { prompt: message, temperature, max_tokens } },
    { url: `${LLM_URL}/generate`, data: { prompt: message, temperature, max_tokens } },
    {
      url: `${LLM_URL}/v1/chat/completions`, data: {
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: message }],
        temperature, max_tokens
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🔗 Trying LLM: ${endpoint.url}`);
      const response = await axios.post(endpoint.url, endpoint.data, {
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '69420' },
        timeout: 15000
      });

      if (!cachedLLMEndpoint) {
        cachedLLMEndpoint = endpoint;
        console.log(`✅ Cached LLM endpoint: ${endpoint.url}`);
      }

      const data = response.data;
      let reply;
      if (typeof data === 'string') reply = data;
      else if (data.response) reply = data.response;
      else if (data.message) reply = data.message;
      else if (data.text) reply = data.text;
      else if (data.generated_text) reply = data.generated_text;
      else if (data.choices?.[0]) reply = data.choices[0].text || data.choices[0].message?.content;
      else if (data.result) reply = data.result;
      else reply = JSON.stringify(data);

      return { success: true, reply, source: 'local_llm' };
    } catch (error) {
      console.log(`❌ LLM endpoint failed: ${endpoint.url}`);
    }
  }
  return { success: false };
}

async function callGemini(message, options = {}) {
  if (!geminiModel) return { success: false };

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;
    const result = await rateLimitedRequest(geminiModel.generateContent.bind(geminiModel), prompt);
    const response = await result.response;
    return { success: true, reply: response.text(), source: 'gemini' };
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
    return { success: false, error: error.message };
  }
}

async function streamGemini(message, res, options = {}) {
  if (!geminiModel) return { success: false };

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;
    const result = await rateLimitedRequest(geminiModel.generateContentStream.bind(geminiModel), prompt);

    let fullResponse = '';
    for await (const chunk of result.stream) {
      if (chunk?.text) {
        const text = chunk.text();
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    return { success: true, fullResponse };
  } catch (error) {
    console.error('❌ Gemini stream error:', error.message);
    return { success: false, error: error.message };
  }
}

// --- Weather Helper ---
async function getWeather(location) {
  if (!WEATHER_API_KEY || !location || location === 'Unknown') return null;
  try {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${WEATHER_API_KEY}`);
    return res.data.main ? `${res.data.weather[0].description}, ${Math.round(res.data.main.temp)}°C` : null;
  } catch (e) { return null; }
}

async function getWeatherMultiplier(lat, lng) {
  try {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`);
    const weatherId = res.data.weather[0].id;
    const tempC = res.data.main.temp - 273.15;
    let mult = 1.0;
    if (weatherId >= 200 && weatherId < 600) mult = 0.3;
    else if (weatherId >= 600 && weatherId < 700) mult = 0.5;
    if (tempC > 42) mult *= 0.4;
    if (weatherId === 800 && tempC > 20 && tempC < 30) mult *= 1.1;
    return mult;
  } catch (error) { return 1.0; }
}

// --- Vector Search (Supabase) ---
async function findSimilarPlaces(query) {
  if (!supabase || !embeddingModel) return '';
  try {
    const result = await embeddingModel.embedContent(query);
    const { data, error } = await supabase.rpc('match_poi', {
      query_embedding: result.embedding.values,
      match_threshold: 0.4,
      match_count: 3
    });
    if (error || !data?.length) return '';
    return data.map(p => `- ${p.name} (${p.category}): ${p.description}`).join('\n');
  } catch (e) { return ''; }
}

// --- User Management (Supabase) ---
async function ensureUserExists(userId) {
  if (!supabase) return;
  const { data } = await supabase.from('user_preferences').select('id').eq('user_id', userId).single();
  if (!data) {
    console.log(`✨ New User Detected (${userId}). Initializing profile...`);
    await supabase.from('user_preferences').insert({ user_id: userId, budget_tier: 'Mid', interest_weights: {} });
    await supabase.from('trip_context').insert({ user_id: userId, trip_mode: 'Solo', current_location: 'Unknown', last_suggested_poi: null });
  }
}

async function analyzeAndUpdateContext(userId, message, lastSuggestion) {
  if (!supabase || !chatModelPro) return;
  try {
    const prompt = `Analyze User Message: "${message}"\nContext: Last suggested place was "${lastSuggestion || 'None'}".\nTask: Extract updates (Budget, Trip Mode). Detect INTEREST scores.\nReturn JSON ONLY: { "budget": "Low/Mid/High", "trip_mode": "Solo/Family", "rejected": boolean, "interest_updates": { "tag": score } }`;

    const result = await chatModelPro.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const updates = JSON.parse(text);

    if (updates.budget) await supabase.from('user_preferences').update({ budget_tier: updates.budget }).eq('user_id', userId);
    if (updates.trip_mode) await supabase.from('trip_context').update({ trip_mode: updates.trip_mode }).eq('user_id', userId);

    if (updates.interest_updates) {
      const { data } = await supabase.from('user_preferences').select('interest_weights').eq('user_id', userId).single();
      let currentWeights = data?.interest_weights || {};
      for (const [tag, score] of Object.entries(updates.interest_updates)) {
        let newScore = (currentWeights[tag] || 0) + score;
        currentWeights[tag] = Math.max(-100, Math.min(100, newScore));
      }
      await supabase.from('user_preferences').update({ interest_weights: currentWeights }).eq('user_id', userId);
    }

    if (updates.rejected && lastSuggestion) {
      await supabase.from('interaction_log').insert({ user_id: userId, suggested_poi_name: lastSuggestion, user_action: 'Rejected' });
    }
  } catch (e) { console.error("Analyst Error:", e.message); }
}

// --- Chat History ---
function getChatHistoryForUser(userId) {
  return chatHistory.get(userId) || [];
}

function saveChatMessage(userId, role, text) {
  if (!chatHistory.has(userId)) chatHistory.set(userId, []);
  const history = chatHistory.get(userId);
  history.push({ role, text, timestamp: new Date().toISOString() });
  if (history.length > 20) history.shift();
}

async function generateFollowUps(message, response) {
  if (!geminiModel) return ["What's the best season to visit?", "Can you suggest accommodation?", "Local customs to know?"];
  try {
    const prompt = `Based on this conversation, suggest 3 short follow-up questions about Indian travel:\nUser: "${message.slice(0, 100)}"\nResponse: "${response.slice(0, 200)}"\nReturn ONLY a JSON array: ["Q1?", "Q2?", "Q3?"]`;
    const result = await rateLimitedRequest(geminiModel.generateContent.bind(geminiModel), prompt);
    const text = (await result.response).text();
    const match = text.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : null;
  } catch (e) { return null; }
}

// --- Footfall Calculation ---
const getTimeMultiplier = (hour, type) => {
  if (['Monument', 'Park', 'Zoo', 'City'].includes(type)) {
    if (hour >= 11 && hour <= 16) return 1.0;
    if (hour >= 9 && hour < 11) return 0.7;
    if (hour > 16 && hour <= 18) return 0.6;
    if (hour >= 19 || hour < 8) return 0.1;
    return 0.4;
  }
  if (type === 'Spiritual') {
    if (hour >= 6 && hour <= 10) return 1.0;
    if (hour >= 18 && hour <= 20) return 1.2;
    if (hour > 12 && hour < 16) return 0.4;
    return 0.1;
  }
  if (type === 'Beach') {
    if (hour >= 16 && hour <= 19) return 1.5;
    if (hour >= 11 && hour < 16) return 0.3;
    if (hour >= 7 && hour < 11) return 0.6;
    return 0.1;
  }
  if (type === 'Hill Station') {
    if (hour >= 10 && hour <= 17) return 1.0;
    return 0.2;
  }
  return 0.5;
};

const calculateLiveFootfall = async (baseCapacity, lat, lng, type) => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = istTime.getHours();
  const day = istTime.getDay();

  const timeFactor = getTimeMultiplier(hour, type);
  const weekFactor = (day === 0 || day === 6 || day === 5) ? 1.4 : 0.9;
  const weatherFactor = await getWeatherMultiplier(lat, lng);
  const noise = 0.9 + Math.random() * 0.2;

  let total = Math.floor(baseCapacity * timeFactor * weekFactor * weatherFactor * noise);
  if (total < 50) total = (hour > 1 && hour < 5) ? 0 : 50;
  return total;
};

// ============================================================================
// API ENDPOINTS - CHAT & AI
// ============================================================================

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'TEAM DDRS Ultimate Travel AI Server',
    features: ['local-llm', 'gemini-fallback', 'streaming', 'flights', 'hotels', 'activities', 'events', 'destinations', 'personalization'],
    queueLength: requestQueue.length,
    isProcessing,
    llmStatus: cachedLLMEndpoint ? 'connected' : 'discovering',
    supabaseStatus: supabase ? 'connected' : 'not configured'
  });
});

// --- Quick Questions ---
app.get('/quick-questions', (req, res) => {
  res.json({ questions: FIXED_QUESTIONS });
});

// --- Queue Status ---
app.get('/queue-status', (req, res) => {
  res.json({ queueLength: requestQueue.length, isProcessing, estimatedWaitTime: `${requestQueue.length * (REQUEST_DELAY / 1000)} seconds` });
});

// --- Chat History ---
app.get('/api/chat/history', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  const history = getChatHistoryForUser(userId);
  res.json(history.map(msg => ({ role: msg.role === 'user' ? 'user' : 'ai', text: msg.text, timestamp: msg.timestamp })));
});

// --- Main Chat Endpoint (JSON) ---
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId = 'anonymous', temperature = 0.7, max_tokens = 1024 } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    console.log(`💬 [${userId}] ${message.slice(0, 50)}...`);
    saveChatMessage(userId, 'user', message);

    // Check mock responses first
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        saveChatMessage(userId, 'assistant', response);
        return res.json({ reply: response, source: 'mock', suggestions: FIXED_QUESTIONS.slice(0, 3) });
      }
    }

    // Get context
    const [weather, similarPlaces] = await Promise.all([
      getWeather(req.body.location),
      message.length > 4 ? findSimilarPlaces(message) : Promise.resolve('')
    ]);

    let enhancedMessage = message;
    if (weather) enhancedMessage += `\n[Context: Weather is ${weather}]`;
    if (similarPlaces) enhancedMessage += `\n[Related places:\n${similarPlaces}]`;

    // Try LLM -> Gemini -> Fallback
    let result = await callLocalLLM(enhancedMessage, { temperature, max_tokens });
    if (!result.success) result = await callGemini(enhancedMessage, { temperature, max_tokens });
    if (!result.success) result = { success: true, reply: "I'm your travel assistant! Ask about India. 🇮🇳", source: 'fallback' };

    saveChatMessage(userId, 'assistant', result.reply);
    const followUps = await generateFollowUps(message, result.reply);

    res.json({ reply: result.reply, source: result.source, suggestions: followUps || FIXED_QUESTIONS.slice(0, 3) });
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ error: 'Internal server error', reply: "Please try again! 🔄" });
  }
});

// --- Streaming Chat (SSE) ---
app.post('/chat-stream', async (req, res) => {
  try {
    const { message, userId = 'anonymous', temperature = 0.7, max_tokens = 1024 } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    console.log(`📨 [Stream] ${message.slice(0, 50)}...`);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    saveChatMessage(userId, 'user', message);
    let fullResponse = '';

    // Check mock responses
    const lowerMessage = message.toLowerCase();
    let mockResponse = null;
    for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
      if (lowerMessage.includes(key)) { mockResponse = response; break; }
    }

    if (mockResponse) {
      fullResponse = mockResponse;
      for (const char of fullResponse) {
        res.write(`data: ${JSON.stringify({ text: char })}\n\n`);
        await new Promise(r => setTimeout(r, 10));
      }
    } else {
      const llmResult = await callLocalLLM(message, { temperature, max_tokens });
      if (llmResult.success) {
        fullResponse = llmResult.reply;
        for (const char of fullResponse) {
          res.write(`data: ${JSON.stringify({ text: char })}\n\n`);
          await new Promise(r => setTimeout(r, 5));
        }
      } else {
        const streamResult = await streamGemini(message, res, { temperature, max_tokens });
        if (streamResult.success) fullResponse = streamResult.fullResponse;
        else {
          const errorText = "I'm experiencing high demand. Please try again! ⏳";
          for (const char of errorText) res.write(`data: ${JSON.stringify({ text: char })}\n\n`);
          fullResponse = errorText;
        }
      }
    }

    saveChatMessage(userId, 'assistant', fullResponse);
    const followUps = await generateFollowUps(message, fullResponse) || FIXED_QUESTIONS.slice(0, 3);
    res.write(`data: ${JSON.stringify({ followUps })}\n\n`);
    res.write('data: [END_OF_STREAM]\n\n');
    res.end();
  } catch (error) {
    console.error('❌ Stream error:', error);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/event-stream' });
    res.write(`data: ${JSON.stringify({ text: "Sorry, please try again! 🔄" })}\n\n`);
    res.write('data: [END_OF_STREAM]\n\n');
    res.end();
  }
});

// --- Audio Processing ---
app.post('/process-audio', async (req, res) => {
  try {
    const { audioData, mimeType } = req.body;
    if (!audioData) return res.status(400).json({ success: false, error: 'Audio data is required', text: null });

    console.log(`🎤 Received audio: ${audioData.length} chars, type: ${mimeType || 'unknown'}`);
    if (audioData.length < 100) return res.status(400).json({ success: false, error: 'Recording too short', text: null });

    await new Promise(resolve => setTimeout(resolve, 800));

    const mockResponses = [
      "Tell me about Rajasthan",
      "What's the weather in Goa?",
      "Suggest a Kerala itinerary",
      "Best street food in Delhi",
      "How to reach Ladakh?"
    ];

    res.json({
      success: true,
      text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      note: "Mock transcription - integrate Google Speech-to-Text for production"
    });
  } catch (error) {
    console.error('❌ Audio error:', error);
    res.status(500).json({ success: false, error: 'Audio processing failed', text: null });
  }
});

// ============================================================================
// API ENDPOINTS - TRAVEL DATA
// ============================================================================

// --- Flight Search ---
let generateFlights, searchAirports;
try {
  const mockFlightData = require('./mockFlightData');
  generateFlights = mockFlightData.generateFlights;
  searchAirports = mockFlightData.searchAirports;
} catch (e) {
  generateFlights = (origin, dest, date) => [];
  searchAirports = (keyword) => [];
}

app.get('/api/flights/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    console.log(`✈️ Flight search: ${origin} -> ${destination} on ${date}`);

    if (!origin || !destination) return res.json({ flights: [], error: 'Please provide origin and destination' });

    const flights = generateFlights(origin.toUpperCase().trim(), destination.toUpperCase().trim(), date || new Date().toISOString().split('T')[0]);
    console.log(`✅ Generated ${flights.length} flights`);

    res.json({ flights, route: { origin: origin.toUpperCase(), destination: destination.toUpperCase() }, count: flights.length });
  } catch (error) {
    console.error('❌ Flight error:', error.message);
    res.json({ flights: [], error: error.message });
  }
});

// --- Airport Search ---
app.get('/api/airports', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword || keyword.length < 2) return res.json({ airports: [] });

    const searchTerm = keyword.toLowerCase();
    const matched = INDIAN_AIRPORTS.filter(a =>
      a.city.toLowerCase().includes(searchTerm) ||
      a.name.toLowerCase().includes(searchTerm) ||
      a.iata.toLowerCase().includes(searchTerm)
    ).slice(0, 7);

    console.log(`✅ Found ${matched.length} airports for "${keyword}"`);
    res.json({ airports: matched });
  } catch (e) {
    res.json({ airports: [] });
  }
});

// --- Hotel Search ---
let generateHotels;
try {
  const mockHotelData = require('./mockHotelData');
  generateHotels = mockHotelData.generateHotels;
} catch (e) {
  generateHotels = () => [];
}

app.get('/api/hotels/search', async (req, res) => {
  try {
    const { city, page = 1 } = req.query;
    if (!city) return res.json({ hotels: [] });

    console.log(`🏨 Searching hotels in: ${city}`);

    // Try Overpass API first
    try {
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'TravelApp/1.0' }, timeout: 5000
      });

      if (geoRes.data.length > 0) {
        const { lat, lon } = geoRes.data[0];
        const overpassQuery = `[out:json][timeout:25];(node["tourism"="hotel"](around:25000,${lat},${lon}););out body 50;`;
        const hotelRes = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`, { timeout: 20000 });

        const hotels = (hotelRes.data.elements || []).filter(h => h.tags?.name).map(h => ({
          id: h.id,
          name: h.tags.name,
          location: { lat: h.lat, lng: h.lon, address: h.tags['addr:street'] || city },
          price: getFakePrice(h.tags.name),
          rating: (Math.random() * 1.5 + 3.5).toFixed(1),
          amenities: getAmenities(),
          image: null
        }));

        if (hotels.length > 0) {
          const LIMIT = 10;
          const start = (parseInt(page) - 1) * LIMIT;
          console.log(`✅ Found ${hotels.length} hotels via Overpass`);
          return res.json({ hotels: hotels.slice(start, start + LIMIT) });
        }
      }
    } catch (e) { console.log('⚠️ Overpass failed, using mock'); }

    // Fallback to mock
    const mockHotels = generateHotels(city, parseInt(page), 10);
    res.json({ hotels: mockHotels });
  } catch (error) {
    res.json({ hotels: [] });
  }
});

// --- Activities ---
let getAllActivities, getActivitiesByCategory, getActivitiesByRegion, searchActivities, ACTIVITY_CATEGORIES;
try {
  const mockActivitiesData = require('./mockActivitiesData');
  getAllActivities = mockActivitiesData.getAllActivities;
  getActivitiesByCategory = mockActivitiesData.getActivitiesByCategory;
  getActivitiesByRegion = mockActivitiesData.getActivitiesByRegion;
  searchActivities = mockActivitiesData.searchActivities;
  ACTIVITY_CATEGORIES = mockActivitiesData.ACTIVITY_CATEGORIES;
} catch (e) {
  getAllActivities = () => [];
  getActivitiesByCategory = () => [];
  getActivitiesByRegion = () => [];
  searchActivities = () => [];
  ACTIVITY_CATEGORIES = [];
}

app.get('/api/activities', async (req, res) => {
  try {
    const { category, region, search, limit = 20 } = req.query;
    let activities;

    if (search) activities = searchActivities(search, category);
    else if (category && region) activities = getActivitiesByCategory(category).filter(a => a.location.state.toLowerCase().includes(region.toLowerCase()) || a.location.city.toLowerCase().includes(region.toLowerCase()));
    else if (category) activities = getActivitiesByCategory(category);
    else if (region) activities = getActivitiesByRegion(region);
    else activities = getAllActivities();

    res.json({ activities: activities.slice(0, parseInt(limit)), categories: ACTIVITY_CATEGORIES, count: activities.length });
  } catch (error) {
    res.json({ activities: [], error: error.message });
  }
});

app.get('/api/activities/categories', (req, res) => {
  res.json({ categories: ACTIVITY_CATEGORIES });
});

// --- Events ---
let searchEvents, getEventCategories, getCitiesWithEvents;
try {
  const mockEventsData = require('./mockEventsData');
  searchEvents = mockEventsData.searchEvents;
  getEventCategories = mockEventsData.getEventCategories;
  getCitiesWithEvents = mockEventsData.getCitiesWithEvents;
} catch (e) {
  searchEvents = () => [];
  getEventCategories = () => [];
  getCitiesWithEvents = () => [];
}

app.get('/api/events', async (req, res) => {
  try {
    const { city, category, search, limit = 20 } = req.query;
    let events = searchEvents(search, city, category);
    res.json({ events: events.slice(0, parseInt(limit)), source: 'mock', categories: getEventCategories(), cities: getCitiesWithEvents(), count: events.length });
  } catch (error) {
    res.json({ events: [], error: error.message });
  }
});

app.get('/api/events/categories', (req, res) => {
  res.json({ categories: getEventCategories(), cities: getCitiesWithEvents() });
});

// --- Routing (OSRM) ---
app.post('/api/route', async (req, res) => {
  try {
    const { userLocation, destLocation } = req.body;
    if (!userLocation?.lat || !destLocation?.lat) return res.json(null);

    const coords = `${userLocation.lng},${userLocation.lat};${destLocation.lng},${destLocation.lat}`;
    const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`, { timeout: 3000 });

    if (response.data.code !== 'Ok') throw new Error('No route');
    const route = response.data.routes[0];
    res.json({ duration: Math.round(route.duration / 60), distance: (route.distance / 1000).toFixed(1), geometry: route.geometry });
  } catch (error) {
    res.json(null);
  }
});

// --- Location Suggestions ---
app.get('/api/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    if (!LOCATIONIQ_KEY) return res.json({ suggestions: [] });

    const response = await axios.get('https://api.locationiq.com/v1/autocomplete.php', {
      params: { key: LOCATIONIQ_KEY, q: query, limit: 5, countrycodes: 'in', format: 'json' }
    });
    res.json({ suggestions: response.data.map(i => ({ name: i.display_place, subtitle: i.display_address })) });
  } catch (e) {
    res.json({ suggestions: [] });
  }
});

// --- Destinations (Supabase) ---
app.get('/api/destinations', async (req, res) => {
  if (!supabase) return res.json([]);
  const { data, error } = await supabase.from('destinations').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// --- State Stats ---
app.get('/api/state-stats', async (req, res) => {
  if (!supabase) return res.json({});
  const { data, error } = await supabase.from('destinations').select('state, cached_footfall, carbon_intensity_factor');
  if (error) return res.status(500).json({ error: error.message });

  const stateMap = {};
  data.forEach(item => {
    const stateName = item.state?.trim() || "Unknown";
    if (!stateMap[stateName]) stateMap[stateName] = { footfall: 0, maxCarbon: 0 };
    stateMap[stateName].footfall += item.cached_footfall;
    stateMap[stateName].maxCarbon = Math.max(stateMap[stateName].maxCarbon, item.carbon_intensity_factor);
  });

  const finalStats = {};
  for (const [state, stats] of Object.entries(stateMap)) {
    finalStats[state] = { footfall: stats.footfall, carbon_factor: parseFloat(stats.maxCarbon.toFixed(1)) };
  }
  res.json(finalStats);
});

// --- Trip Impact Calculator ---
app.post('/api/calculate-impact', async (req, res) => {
  if (!supabase) return res.status(400).json({ error: "Supabase not configured" });

  const { userLat, userLng, destinationId } = req.body;
  if (!userLat || !userLng || !destinationId) return res.status(400).json({ error: "Missing data" });

  const { data: dest, error } = await supabase.from('destinations').select('*').eq('id', destinationId).single();
  if (error || !dest) return res.status(404).json({ error: "Not found" });

  const distanceKm = calculateDistance(userLat, userLng, dest.latitude, dest.longitude);
  const finalCarbon = Math.round((distanceKm * 0.12) * dest.carbon_intensity_factor);

  res.json({ destination: dest.name, distance_km: distanceKm, carbon_kg: finalCarbon, live_footfall: dest.cached_footfall });
});

// --- Wikimedia Images ---
let wikimediaService;
try {
  wikimediaService = require('./wikimediaService');
} catch (e) {
  wikimediaService = null;
}

app.get('/api/images/search', async (req, res) => {
  if (!wikimediaService) return res.json({ success: false, error: 'Wikimedia service not available' });

  try {
    const { keyword, context = 'default', count = 1 } = req.query;
    if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

    if (parseInt(count) === 1) {
      const imageUrl = await wikimediaService.getImageUrl(keyword, context);
      return res.json({ success: true, image: imageUrl, source: 'Wikimedia Commons' });
    } else {
      const images = await wikimediaService.getMultipleImages(keyword, context, parseInt(count));
      return res.json({ success: true, images, count: images.length, source: 'Wikimedia Commons' });
    }
  } catch (error) {
    res.json({ success: false, error: error.message, images: [] });
  }
});

app.get('/api/images/location', async (req, res) => {
  if (!wikimediaService) return res.json({ success: false, error: 'Wikimedia service not available' });

  try {
    const { name, fallbackContext = 'default' } = req.query;
    if (!name) return res.status(400).json({ error: 'Location name is required' });
    const imageUrl = await wikimediaService.getIndiaLocationImage(name, fallbackContext);
    res.json({ success: true, location: name, image: imageUrl, source: 'Wikimedia Commons' });
  } catch (error) {
    res.json({ success: false, error: error.message, image: null });
  }
});

app.post('/api/images/batch', async (req, res) => {
  if (!wikimediaService) return res.json({ success: false, error: 'Wikimedia service not available' });

  try {
    const { locations, context = 'default' } = req.body;
    if (!locations || !Array.isArray(locations)) return res.status(400).json({ error: 'Locations array is required' });
    const results = await wikimediaService.batchFetchImages(locations, context);
    res.json({ success: true, images: results, count: Object.keys(results).length, source: 'Wikimedia Commons' });
  } catch (error) {
    res.json({ success: false, error: error.message, images: {} });
  }
});

// --- LLM Status ---
app.get('/api/llm-status', async (req, res) => {
  try {
    await axios.get(LLM_URL, { headers: { 'ngrok-skip-browser-warning': '69420' }, timeout: 5000 });
    res.json({ status: 'online', url: LLM_URL, cached: !!cachedLLMEndpoint });
  } catch {
    res.json({ status: 'offline', fallback: genAI ? 'gemini' : 'mock' });
  }
});

// --- Clear Cache ---
app.post('/api/clear-cache', (req, res) => {
  cachedLLMEndpoint = null;
  chatHistory.clear();
  res.json({ success: true, message: 'Cache cleared' });
});

// ============================================================================
// BACKGROUND TASKS (CRON)
// ============================================================================

if (supabase) {
  cron.schedule('0 * * * *', async () => {
    console.log(`\n[${new Date().toLocaleTimeString()}] 📡 Syncing Virtual Sensors...`);
    const { data: locations } = await supabase.from('destinations').select('*');

    if (locations) {
      for (const loc of locations) {
        const type = loc.description || 'Monument';
        const baseCapacity = loc.base_footfall || 5000;
        const newFootfall = await calculateLiveFootfall(baseCapacity, loc.latitude, loc.longitude, type);
        await supabase.from('destinations').update({ cached_footfall: newFootfall, last_updated: new Date() }).eq('id', loc.id);
        await new Promise(r => setTimeout(r, 200));
      }
    }
    console.log("✅ All Regions Updated.");
  });
}

// ============================================================================
// AQI API - GOI CPCB (data.gov.in)
// ============================================================================

// State capital mapping for AQI queries
const STATE_AQI_CITIES = {
  'Arunachal Pradesh': 'Itanagar',
  'Andhra Pradesh': 'Visakhapatnam',
  'Assam': 'Guwahati',
  'Bihar': 'Patna',
  'Chhattisgarh': 'Raipur',
  'Delhi': 'Delhi',
  'Goa': 'Panaji',
  'Gujarat': 'Ahmedabad',
  'Haryana': 'Gurugram',
  'Himachal Pradesh': 'Shimla',
  'Jharkhand': 'Ranchi',
  'Karnataka': 'Bengaluru',
  'Kerala': 'Thiruvananthapuram',
  'Madhya Pradesh': 'Bhopal',
  'Maharashtra': 'Mumbai',
  'Manipur': 'Imphal',
  'Meghalaya': 'Shillong',
  'Mizoram': 'Aizawl',
  'Nagaland': 'Kohima',
  'Odisha': 'Bhubaneswar',
  'Punjab': 'Amritsar',
  'Rajasthan': 'Jaipur',
  'Sikkim': 'Gangtok',
  'Tamil Nadu': 'Chennai',
  'Telangana': 'Hyderabad',
  'Tripura': 'Agartala',
  'Uttar Pradesh': 'Lucknow',
  'Uttarakhand': 'Dehradun',
  'West Bengal': 'Kolkata',
  'J & K': 'Srinagar',
  'Ladakh': 'Leh',
  'Andaman and Nicobar Islands': 'Port Blair',
  'Chandigarh': 'Chandigarh',
  'Puducherry': 'Puducherry',
  'Lakshadweep': 'Kavaratti',
};

// AQI categories based on CPCB standards
const getAQICategory = (aqi) => {
  if (!aqi || aqi === 'NA') return { label: '—', color: '#94a3b8', level: 0 };
  const value = parseInt(aqi);
  if (value <= 50) return { label: 'Good', color: '#22c55e', level: 1 };
  if (value <= 100) return { label: 'Satisfactory', color: '#84cc16', level: 2 };
  if (value <= 200) return { label: 'Moderate', color: '#eab308', level: 3 };
  if (value <= 300) return { label: 'Poor', color: '#f97316', level: 4 };
  if (value <= 400) return { label: 'Very Poor', color: '#ef4444', level: 5 };
  return { label: 'Severe', color: '#991b1b', level: 6 };
};

// In-memory cache for AQI data (1 hour TTL)
const aqiCache = new Map();
const AQI_CACHE_TTL = 60 * 60 * 1000; // 1 hour

app.get('/api/aqi', async (req, res) => {
  try {
    const { state } = req.query;
    if (!state) return res.status(400).json({ error: 'State parameter required' });

    // Check cache first
    const cacheKey = `aqi_${state}`;
    const cached = aqiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < AQI_CACHE_TTL) {
      console.log(`📊 AQI cache hit for ${state}`);
      return res.json(cached.data);
    }

    const city = STATE_AQI_CITIES[state] || state;
    console.log(`🌫️ Fetching AQI for ${state} (city: ${city})`);

    // City coordinates for Indian states (lat, lon)
    const CITY_COORDS = {
      'Itanagar': { lat: 27.0844, lon: 93.6053 },
      'Visakhapatnam': { lat: 17.6868, lon: 83.2185 },
      'Guwahati': { lat: 26.1445, lon: 91.7362 },
      'Patna': { lat: 25.5941, lon: 85.1376 },
      'Raipur': { lat: 21.2514, lon: 81.6296 },
      'Delhi': { lat: 28.6139, lon: 77.2090 },
      'Panaji': { lat: 15.4909, lon: 73.8278 },
      'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
      'Gurugram': { lat: 28.4595, lon: 77.0266 },
      'Shimla': { lat: 31.1048, lon: 77.1734 },
      'Ranchi': { lat: 23.3441, lon: 85.3096 },
      'Bengaluru': { lat: 12.9716, lon: 77.5946 },
      'Thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
      'Bhopal': { lat: 23.2599, lon: 77.4126 },
      'Mumbai': { lat: 19.0760, lon: 72.8777 },
      'Imphal': { lat: 24.8170, lon: 93.9368 },
      'Shillong': { lat: 25.5788, lon: 91.8933 },
      'Aizawl': { lat: 23.7271, lon: 92.7176 },
      'Kohima': { lat: 25.6747, lon: 94.1100 },
      'Bhubaneswar': { lat: 20.2961, lon: 85.8245 },
      'Amritsar': { lat: 31.6340, lon: 74.8723 },
      'Jaipur': { lat: 26.9124, lon: 75.7873 },
      'Gangtok': { lat: 27.3389, lon: 88.6065 },
      'Chennai': { lat: 13.0827, lon: 80.2707 },
      'Hyderabad': { lat: 17.3850, lon: 78.4867 },
      'Agartala': { lat: 23.8315, lon: 91.2868 },
      'Lucknow': { lat: 26.8467, lon: 80.9462 },
      'Dehradun': { lat: 30.3165, lon: 78.0322 },
      'Kolkata': { lat: 22.5726, lon: 88.3639 },
      'Srinagar': { lat: 34.0837, lon: 74.7973 },
      'Leh': { lat: 34.1526, lon: 77.5771 },
      'Port Blair': { lat: 11.6234, lon: 92.7265 },
      'Chandigarh': { lat: 30.7333, lon: 76.7794 },
      'Puducherry': { lat: 11.9416, lon: 79.8083 },
      'Kavaratti': { lat: 10.5626, lon: 72.6369 },
    };

    let aqiData = null;
    const coords = CITY_COORDS[city];

    if (coords) {
      try {
        // Open-Meteo Air Quality API - FREE, NO API KEY REQUIRED
        const openMeteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=european_aqi,pm10,pm2_5`;

        const response = await axios.get(openMeteoUrl, { timeout: 10000 });

        if (response.data?.current) {
          const current = response.data.current;
          const eaqi = current.european_aqi;

          // Convert European AQI to category
          let label, color, level;
          if (eaqi <= 20) { label = 'Good'; color = '#22c55e'; level = 1; }
          else if (eaqi <= 40) { label = 'Fair'; color = '#84cc16'; level = 2; }
          else if (eaqi <= 60) { label = 'Moderate'; color = '#eab308'; level = 3; }
          else if (eaqi <= 80) { label = 'Poor'; color = '#f97316'; level = 4; }
          else if (eaqi <= 100) { label = 'Very Poor'; color = '#ef4444'; level = 5; }
          else { label = 'Severe'; color = '#991b1b'; level = 6; }

          aqiData = {
            value: eaqi,
            label,
            color,
            level,
            pm25: current.pm2_5,
            pm10: current.pm10,
            city: city,
            source: 'Open-Meteo (Free)'
          };
        }
      } catch (apiError) {
        console.warn('Open-Meteo API error:', apiError.message);
      }
    }

    // If no data, return unavailable
    if (!aqiData) {
      aqiData = {
        value: null,
        label: '—',
        color: '#94a3b8',
        city: city,
        source: 'unavailable'
      };
    }

    // Cache the result
    aqiCache.set(cacheKey, { data: aqiData, timestamp: Date.now() });

    res.json(aqiData);
  } catch (error) {
    console.error('❌ AQI error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch AQI',
      label: '—',
      color: '#94a3b8'
    });
  }
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           🚀 TEAM DDRS ULTIMATE TRAVEL AI SERVER 🚀               ║
╠══════════════════════════════════════════════════════════════════╣
║  Server:     http://localhost:${PORT}                                ║
║  LLM URL:    ${LLM_URL.slice(0, 42)}...     ║
║  Gemini:     ${genAI ? '✅ Configured' : '❌ Not configured'}                                  ║
║  Supabase:   ${supabase ? '✅ Connected' : '❌ Not configured'}                                   ║
╠══════════════════════════════════════════════════════════════════╣
║  CHAT ENDPOINTS:                                                  ║
║  • POST /api/chat           - JSON chat                           ║
║  • POST /chat-stream        - SSE streaming chat                  ║
║  • POST /process-audio      - Voice input                         ║
║  • GET  /quick-questions    - Starter questions                   ║
║  • GET  /api/chat/history   - Chat history                        ║
╠══════════════════════════════════════════════════════════════════╣
║  TRAVEL ENDPOINTS:                                                ║
║  • GET  /api/flights/search - Flight search                       ║
║  • GET  /api/airports       - Airport autocomplete                ║
║  • GET  /api/hotels/search  - Hotel search                        ║
║  • GET  /api/activities     - Activities & tours                  ║
║  • GET  /api/events         - Events & festivals                  ║
║  • GET  /api/destinations   - All destinations                    ║
║  • GET  /api/state-stats    - State statistics                    ║
║  • POST /api/route          - Navigation routing                  ║
║  • POST /api/calculate-impact - Carbon footprint                  ║
╠══════════════════════════════════════════════════════════════════╣
║  UTILITY ENDPOINTS:                                               ║
║  • GET  /health             - Server status                       ║
║  • GET  /api/llm-status     - LLM connection status               ║
║  • GET  /api/suggestions    - Location autocomplete               ║
║  • GET  /api/images/search  - Wikimedia images                    ║
╚══════════════════════════════════════════════════════════════════╝
  `);
});