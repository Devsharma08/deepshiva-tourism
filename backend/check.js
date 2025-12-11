// debug_models.js
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function getModels() {
  console.log("🔍 Querying Google API directly...");
  
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.error) {
        console.error("❌ API Error:", data.error.message);
        return;
    }

    if (!data.models) {
        console.error("❌ No models returned. Check your API Key.");
        return;
    }

    console.log("\n✅ AVAILABLE MODELS (Copy one of these names):");
    console.log("---------------------------------------------");
    data.models.forEach(model => {
        // We only want models that support 'generateContent'
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
            console.log(`Model Name: ${model.name.replace('models/', '')}`);
        }
    });
    console.log("---------------------------------------------");

  } catch (error) {
    console.error("Network Error:", error);
  }
}

getModels();