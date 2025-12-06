const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin:'http://localhost:5173'
}));
app.use(express.json());

// --- API Key and Model Initialization ---
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- Rate Limiting Setup ---
const requestQueue = [];
let isProcessing = false;
const REQUEST_DELAY = 30000; // 30 seconds between requests

const rateLimitedRequest = async (fn, ...args) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ fn, args, resolve, reject });
    if (!isProcessing) {
      processQueue();
    }
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

// --- System Prompts ---
const systemPrompt = `
You are 'Treveor', a friendly, expert local guide for all of India.
Your role: Help users plan trips, share cultural stories, and provide practical travel advice for any state or city in India.

KEY RESPONSE RULES:
1. Be conversational and engaging - use emojis occasionally 🌟
2. Provide practical, actionable advice
3. Share interesting cultural insights and stories
4. Keep responses concise but informative
5. Be enthusiastic about Indian travel and culture
6. Use a warm, welcoming tone

EXAMPLES:
User: "How to get from Delhi to Goa?"
You: "🚗 The best way from Delhi to Goa is by direct flight (approx 2.5 hours)! ✈️ You can also take the Rajdhani Express train for a scenic journey through the heart of India. 🚆"

User: "Tell me about Kerala"
You: "🌴 Kerala, God's Own Country! Famous for its serene backwaters, Ayurvedic treatments, and delicious cuisine. The houseboat stays in Alleppey are absolutely magical! 🛶 Don't miss the Kathakali dance performances! 💃"

User: "Best time to visit Rajasthan?"
You: "🏜️ Rajasthan is best visited from October to March when the weather is pleasant! The desert festivals and palace tours are incredible during this time. 🌅 Avoid summer (Apr-Jun) as temperatures can soar above 40°C! 🔥"
`;

// --- Fixed Quick Questions ---
const FIXED_QUESTIONS = [
  "Best places to visit in India?",
  "Local food to try in Rajasthan"
];

// --- Mock Responses for Testing ---
const MOCK_RESPONSES = {
  "hello": "Namaste! 🙏 I'm Treveor, your friendly India travel guide. I can help you plan trips, share stories, and provide travel advice across this incredible country! Where would you like to explore today? 🌄🇮🇳",
  "hi": "Hello! 👋 Welcome to Treveor! I specialize in Indian travel - from the Himalayas to the backwaters of Kerala. How can I assist with your Indian adventure? 🗺️",
  "weather": "India's weather varies greatly! 🌤️\n• North: Cold winters, hot summers\n• South: Tropical climate year-round\n• Best travel seasons: October to March for most regions\n• Monsoon (Jun-Sep): Heavy rains but lush greenery! 🌧️",
  "places": "🌟 Top Indian Destinations:\n• Rajasthan: Palaces & deserts 🏜️\n• Kerala: Backwaters & beaches 🌴\n• Goa: Beaches & Portuguese heritage 🏖️\n• Himachal: Mountains & adventure 🏔️\n• Tamil Nadu: Temples & culture 🛕\n• Varanasi: Spiritual experiences 🕉️",
  "food": "🍛 Must-try Indian foods:\n• North: Butter Chicken, Naan, Chole Bhature\n• South: Dosa, Idli, Sambar\n• West: Vada Pav, Dhokla, Pav Bhaji\n• East: Momos, Rasgulla, Fish Curry\n• Street Food: Pani Puri, Chaat, Samosa 🌶️"
};

// --- Endpoints ---

// Quick Questions Endpoint
app.get("/quick-questions", (req, res) => {
  res.json({ questions: FIXED_QUESTIONS });
});

// Streaming Chat Endpoint
app.post("/chat-stream", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    console.log("📨 User message:", userMessage);

    // Set headers for Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    let fullResponse = "";

    // Check for mock responses first (reduces API calls)
    const lowerMessage = userMessage.toLowerCase();
    let mockResponse = null;
    
    for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        mockResponse = response;
        break;
      }
    }

    if (mockResponse) {
      // Use mock response (no API call)
      console.log("🎭 Using mock response");
      fullResponse = mockResponse;
      
      // Stream mock response character by character
      for (const char of fullResponse) {
        res.write(`data: ${JSON.stringify({ text: char })}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } else {
      // Use AI with rate limiting
      try {
        const result = await rateLimitedRequest(
          model.generateContentStream.bind(model),
          [systemPrompt, userMessage]
        );
        
        for await (const chunk of result.stream) {
          if (chunk && chunk.text) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            
            // Stream each character with typing effect
            for (const char of chunkText) {
              res.write(`data: ${JSON.stringify({ text: char })}\n\n`);
              await new Promise(resolve => setTimeout(resolve, 5));
            }
          }
        }
      } catch (aiError) {
        console.error("AI Error:", aiError.message);
        const errorText = "I'm currently experiencing high demand. Please try again in a moment! ⏳";
        for (const char of errorText) {
          res.write(`data: ${JSON.stringify({ text: char })}\n\n`);
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        fullResponse = errorText;
      }
    }

    // Generate follow-up questions
    try {
      let followUps;
      
      if (mockResponse) {
        // Use mock follow-ups for mock responses
        followUps = [
          "What's the best season to visit North India?",
          "Can you suggest a 2-week itinerary?",
          "What are the visa requirements for India?"
        ];
      } else {
        // Generate AI follow-ups with rate limiting
        const followUpResult = await rateLimitedRequest(
          model.generateContent.bind(model),
          `Based on this conversation, suggest 3 relevant follow-up questions about Indian travel:
User: "${userMessage.replace(/"/g, "'")}"
Assistant: "${fullResponse.replace(/"/g, "'")}"

Respond ONLY with a valid JSON array of 3 strings: ["Question 1?", "Question 2?", "Question 3?"]`
        );
        
        const followUpResponse = await followUpResult.response;
        const followUpText = followUpResponse.text();
        const followUpMatch = followUpText.match(/\[.*\]/s);
        
        followUps = followUpMatch ? JSON.parse(followUpMatch[0]) : [
          "What's the best season to visit?",
          "Can you suggest accommodation options?",
          "What are the local customs I should know?"
        ];
      }
      
      res.write(`data: ${JSON.stringify({ followUps: followUps })}\n\n`);
      
    } catch (e) {
      console.error("Follow-up generation error:", e.message);
      // Use generic follow-ups
      const genericFollowUps = [
        "What's the best season to visit?",
        "Can you suggest accommodation options?",
        "What are the local customs I should know?"
      ];
      res.write(`data: ${JSON.stringify({ followUps: genericFollowUps })}\n\n`);
    }

    res.write(`data: [END_OF_STREAM]\n\n`);
    res.end();

  } catch (error) {
    console.error("❌ Error in /chat-stream endpoint:", error.message);
    
    let errorMessage = "Sorry, I'm temporarily unavailable. Please try again soon! 🔄";
    if (error.message.includes('429') || error.message.includes('quota')) {
      errorMessage = 'I need a quick break! ⏳ Please wait 30 seconds and try again.';
    } else if (error.message.includes('API key')) {
      errorMessage = 'Authentication issue. Please check the service configuration. 🔐';
    }

    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/event-stream' });
    }
    
    // Stream error message character by character
    for (const char of errorMessage) {
      res.write(`data: ${JSON.stringify({ text: char })}\n\n`);
    }
    res.write(`data: [END_OF_STREAM]\n\n`);
    res.end();
  }
});

// Audio Processing Endpoint (for future voice features)
app.post("/process-audio", async (req, res) => {
  try {
    const { audioData } = req.body;
    
    if (!audioData) {
      return res.status(400).json({ error: "Audio data is required" });
    }

    // Mock implementation - in production, integrate with Google Speech-to-Text
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ 
      text: "Hello! I heard your voice message. How can I help with your India travel plans?",
      success: true 
    });

  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).json({ error: "Audio processing failed" });
  }
});

// Health check with queue status
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Treveor AI server is running",
    queueLength: requestQueue.length,
    isProcessing: isProcessing,
    features: ["chat-stream", "quick-questions", "audio-processing", "rate-limiting"]
  });
});

// Queue status endpoint
app.get("/queue-status", (req, res) => {
  res.json({
    queueLength: requestQueue.length,
    isProcessing: isProcessing,
    estimatedWaitTime: requestQueue.length * (REQUEST_DELAY / 1000) + " seconds"
  });
});

app.listen(port, () => {
  console.log(`✅ Treveor AI server running at http://localhost:${port}`);
  console.log(`🎤 Audio features: READY`);
  console.log(`⏰ Rate limiting: 1 request every ${REQUEST_DELAY/1000} seconds`);
  console.log(`🌟 Mock responses: ACTIVE (reduces API calls)`);
  console.log(`🇮🇳 Focus: Incredible India travel guide`);
});