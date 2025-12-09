const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({
  origin:'http://localhost:5173',
  secure:true
}
));
app.use(express.json());

const LLM_URL = 'https://jayceon-crumblier-unmeaningly.ngrok-free.dev';

// 1. Explore the API documentation
app.get('/api/explore', async (req, res) => {
  try {
    console.log('🔍 Exploring API...');
    
    // First, check what's at the root
    const rootResponse = await axios.get(LLM_URL, {
      headers: { 'ngrok-skip-browser-warning': '69420' }
    });
    console.log('Root response:', rootResponse.status, typeof rootResponse.data);
    
    // Check common endpoints
    const endpoints = [
      '/',
      '/docs',
      '/redoc',
      '/openapi.json',
      '/swagger.json',
      '/api',
      '/v1',
      '/health',
      '/status',
      '/ping'
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${LLM_URL}${endpoint}`, {
          headers: { 'ngrok-skip-browser-warning': '69420' },
          timeout: 5000
        });
        
        results.push({
          endpoint: endpoint,
          status: response.status,
          contentType: response.headers['content-type'],
          data_type: typeof response.data,
          data_sample: typeof response.data === 'string' ? 
            response.data.substring(0, 200) : 
            'Object/JSON'
        });
        
      } catch (err) {
        results.push({
          endpoint: endpoint,
          status: err.response?.status || 'Error',
          error: err.message
        });
      }
    }
    
    // Try POST to /docs to see if it's interactive
    try {
      const docsPost = await axios.post(`${LLM_URL}/docs`, {}, {
        headers: { 'ngrok-skip-browser-warning': '69420' }
      });
      results.push({
        endpoint: 'POST /docs',
        status: docsPost.status,
        note: 'POST allowed on docs endpoint'
      });
    } catch (err) {
      // Ignore
    }
    
    res.json({ exploration: results });
    
  } catch (error) {
    console.error('Exploration error:', error.message);
    res.json({ error: error.message });
  }
});

// 2. Try to find the actual chat endpoint
app.post('/api/find-endpoint', async (req, res) => {
  const testMessage = "Hello";
  
  // Common patterns for LLM APIs
  const attempts = [
    // Pattern 1: Direct chat
    { method: 'POST', path: '/chat', data: { message: testMessage } },
    { method: 'POST', path: '/api/chat', data: { message: testMessage } },
    { method: 'POST', path: '/v1/chat', data: { message: testMessage } },
    
    // Pattern 2: OpenAI style
    { method: 'POST', path: '/v1/chat/completions', data: { 
      messages: [{ role: "user", content: testMessage }] 
    }},
    
    // Pattern 3: Simple completion
    { method: 'POST', path: '/complete', data: { prompt: testMessage } },
    { method: 'POST', path: '/api/complete', data: { prompt: testMessage } },
    { method: 'POST', path: '/v1/completions', data: { prompt: testMessage } },
    
    // Pattern 4: Generate
    { method: 'POST', path: '/generate', data: { prompt: testMessage } },
    { method: 'POST', path: '/api/generate', data: { prompt: testMessage } },
    
    // Pattern 5: Raw text
    { method: 'POST', path: '/', data: testMessage },
    
    // Pattern 6: Query
    { method: 'POST', path: '/query', data: { query: testMessage } },
    { method: 'POST', path: '/api/query', data: { query: testMessage } },
    
    // Pattern 7: Ask
    { method: 'POST', path: '/ask', data: { question: testMessage } },
  ];
  
  const results = [];
  
  for (const attempt of attempts) {
    try {
      console.log(`Trying ${attempt.method} ${attempt.path}...`);
      
      const config = {
        method: attempt.method.toLowerCase(),
        url: `${LLM_URL}${attempt.path}`,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        timeout: 8000
      };
      
      if (attempt.method === 'POST') {
        config.data = attempt.data;
      }
      
      const response = await axios(config);
      
      results.push({
        endpoint: `${attempt.method} ${attempt.path}`,
        status: response.status,
        success: true,
        response: response.data,
        headers: response.headers
      });
      
      console.log(`✅ ${attempt.path} - Status: ${response.status}`);
      
    } catch (error) {
      results.push({
        endpoint: `${attempt.method} ${attempt.path}`,
        success: false,
        error: error.message,
        status: error.response?.status
      });
      console.log(`❌ ${attempt.path} - ${error.message}`);
    }
  }
  
  res.json({ attempts: results });
});

// 3. WORKING CHAT ENDPOINT (with discovered endpoint)
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.json({ reply: "Please send a message", type: "fallback" });
  }
  
  console.log('💬 Chat:', message);
  
  // Based on common API patterns found in exploration
  const endpointCandidates = [
    // Try these in order
    {
      name: 'chat',
      url: `${LLM_URL}/chat`,
      data: { message: message }
    },
    {
      name: 'api_chat',
      url: `${LLM_URL}/api/chat`,
      data: { message: message }
    },
    {
      name: 'completions',
      url: `${LLM_URL}/v1/completions`,
      data: { prompt: `Travel question: ${message}` }
    },
    {
      name: 'generate',
      url: `${LLM_URL}/generate`,
      data: { prompt: `As a travel expert: ${message}` }
    }
  ];
  
  for (const candidate of endpointCandidates) {
    try {
      console.log(`Trying ${candidate.name} endpoint...`);
      
      const response = await axios.post(candidate.url, candidate.data, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        timeout: 15000
      });
      
      console.log(`✅ ${candidate.name} worked! Status: ${response.status}`);
      
      // Parse response based on common formats
      let reply;
      const data = response.data;
      
      if (typeof data === 'string') {
        reply = data;
      } else if (data.response) {
        reply = data.response;
      } else if (data.message) {
        reply = data.message;
      } else if (data.answer) {
        reply = data.answer;
      } else if (data.text) {
        reply = data.text;
      } else if (data.generated_text) {
        reply = data.generated_text;
      } else if (data.choices && data.choices[0]) {
        reply = data.choices[0].text || data.choices[0].message?.content;
      } else if (data.result) {
        reply = data.result;
      } else {
        reply = JSON.stringify(data, null, 2);
      }
      
      return res.json({
        reply: reply || "I received an empty response.",
        type: "llm",
        endpoint: candidate.name,
        raw: data
      });
      
    } catch (error) {
      console.log(`❌ ${candidate.name} failed:`, error.message);
      continue;
    }
  }
  
  // FALLBACK: If no endpoint works
  console.log('All endpoints failed, using fallback');
  
  const travelKnowledge = {
    "nainital": "Nainital is a beautiful hill station in Uttarakhand, India, known for its lakes and mountains. Best visited March-June or September-November.",
    "beach": "Top beaches: Goa for parties, Maldives for luxury, Thailand for islands, Hawaii for surfing.",
    "europe": "Europe trip planning: 2 weeks for highlights, Eurail pass for travel, book accommodations early.",
    "budget": "Budget tips: Travel offseason, use local transport, eat street food, stay in hostels.",
    "hello": "Hello! I'm your travel assistant. Ask me about destinations, planning, or tips!",
    "weather": "Check weather 2 weeks before travel. Pack layers for changing conditions."
  };
  
  const lowerMsg = message.toLowerCase();
  let reply = "I'm a travel assistant! Ask me about destinations, itineraries, or travel tips.";
  
  for (const [key, response] of Object.entries(travelKnowledge)) {
    if (lowerMsg.includes(key)) {
      reply = response;
      break;
    }
  }
  
  res.json({
    reply: reply,
    type: "fallback",
    note: "Using local knowledge base"
  });
});

// 4. Test the docs endpoint directly
app.get('/api/check-docs', async (req, res) => {
  try {
    console.log('Checking /docs endpoint...');
    
    // Get the docs page HTML
    const docsResponse = await axios.get(`${LLM_URL}/docs`, {
      headers: { 'ngrok-skip-browser-warning': '69420' }
    });
    
    const html = docsResponse.data;
    
    // Try to extract API information from HTML
    const endpoints = [];
    
    // Look for common patterns in Swagger UI
    if (typeof html === 'string') {
      // Look for API paths in the HTML
      const pathMatches = html.match(/["'](\/[\w\/-]+)["']/g) || [];
      paths = [...new Set(pathMatches.map(p => p.replace(/["']/g, '')))];
      
      // Look for OpenAPI spec URL
      const specMatch = html.match(/["'](\/openapi\.json)["']/) || 
                       html.match(/["'](\/swagger\.json)["']/);
      
      endpoints.push({
        type: 'extracted_from_html',
        paths: paths.slice(0, 10), // First 10 unique paths
        openapi_spec: specMatch ? specMatch[1] : null
      });
    }
    
    res.json({
      docs_status: 'available',
      content_type: docsResponse.headers['content-type'],
      content_length: html.length,
      endpoints: endpoints
    });
    
  } catch (error) {
    res.json({ 
      docs_status: 'error', 
      error: error.message 
    });
  }
});

// 5. Simple GET endpoint test
app.get('/api/test-get', async (req, res) => {
  try {
    // Try GET endpoints that might return API info
    const endpoints = [
      '/',
      '/api',
      '/v1',
      '/docs',
      '/openapi.json',
      '/swagger.json',
      '/health',
      '/info',
      '/metadata'
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${LLM_URL}${endpoint}`, {
          headers: { 'ngrok-skip-browser-warning': '69420' },
          timeout: 5000
        });
        
        results.push({
          endpoint: endpoint,
          status: response.status,
          headers: response.headers,
          data: typeof response.data === 'object' ? 
            response.data : 
            response.data.substring(0, 500)
        });
        
      } catch (err) {
        results.push({
          endpoint: endpoint,
          error: err.message,
          status: err.response?.status
        });
      }
    }
    
    res.json({ get_tests: results });
    
  } catch (error) {
    res.json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n🔍 To find the correct LLM endpoint:`);
  console.log(`1. GET http://localhost:${PORT}/api/explore`);
  console.log(`2. POST http://localhost:${PORT}/api/find-endpoint`);
  console.log(`3. GET http://localhost:${PORT}/api/check-docs`);
  console.log(`\n💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
});