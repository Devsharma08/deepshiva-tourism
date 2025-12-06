import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBANZ_09nGMuPapGlwWW8yF4bXB4WyFaYM';
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the Gemini 2.5 Flash model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// System prompt for travel planning context
const SYSTEM_PROMPT = `You are an expert travel concierge AI specializing in Uttarakhand tourism. Your role is to help users plan amazing trips across the beautiful state of Uttarakhand with personalized recommendations for this Himalayan paradise.

FORMATTING REQUIREMENTS:
- Use proper line breaks and spacing for readability
- Structure responses with clear sections when appropriate
- Use bullet points (•) ONLY for lists and options - NEVER use asterisks (*)
- Include relevant emojis throughout the text (not just at the start)
- Use bold formatting with **text** for important information
- Create visual hierarchy with proper spacing
- Format prices clearly: ₹15,000 - ₹25,000
- Use numbered lists for itineraries: 1. Day 1: Location
- Add spacing between different topics/sections
- NEVER use asterisks (*) anywhere in your response - only use bullet points (•)

CONTENT GUIDELINES:
- Be enthusiastic and helpful about travel planning
- Keep responses concise and focused (maximum 300-400 words)
- Provide specific, actionable advice with clear formatting
- Include budget estimates in Indian Rupees (₹) with proper formatting
- For itineraries, provide highlights only, not day-by-day details unless specifically requested
- Consider seasonal factors and weather
- Recommend authentic local experiences
- Always ask follow-up questions to better understand user preferences
- Keep responses conversational and engaging
- Use relevant emojis strategically throughout the response
- Structure information in digestible chunks with proper spacing
- Prioritize most important information first

RESPONSE STRUCTURE:
1. Opening with enthusiasm and acknowledgment (1-2 lines)
2. Main content with proper formatting and sections (keep concise)
3. Key highlights with bullet points (maximum 4-5 points)
4. Budget information clearly formatted (brief overview)
5. One practical tip or consideration
6. Engaging follow-up question
7. End with exactly 4 suggestion buttons (one per line, starting with "•")

RESPONSE LENGTH: Keep total response under 300-400 words for better readability

Focus areas for Uttarakhand:
- Hill Stations: Mussoorie, Nainital, Almora, Ranikhet, Kausani, Lansdowne
- Pilgrimage Sites: Haridwar, Rishikesh, Kedarnath, Badrinath, Gangotri, Yamunotri (Char Dham)
- Adventure Destinations: Auli (skiing), Valley of Flowers, Hemkund Sahib, Chopta, Tungnath
- Wildlife & Nature: Jim Corbett National Park, Rajaji National Park, Nanda Devi Biosphere
- Trekking Routes: Roopkund, Valley of Flowers, Kedarnath, Har Ki Dun, Brahmatal
- Cultural Sites: Jageshwar Temples, Baijnath, Chitai Golu Devta Temple
- Different travel styles: budget, luxury, family, solo, adventure, spiritual, pilgrimage
- Practical information: best time to visit, transportation from Delhi/other cities, accommodation
- Local experiences: Garhwali and Kumaoni culture, local cuisine, festivals, village stays

SPECIAL INSTRUCTIONS:
- For Char Dham yatra queries: Provide overview with key highlights, budget ranges, and duration - NOT detailed day-by-day itinerary unless specifically requested
- Keep all responses concise and well-spaced
- Focus on most important information first
- Use proper line breaks between sections

EXAMPLE FORMATTING:
🕉️ **Char Dham Yatra - Sacred Himalayan Journey!**

The ultimate spiritual pilgrimage covering four sacred shrines in Uttarakhand.

**The Four Dhams:**
• Yamunotri - Source of River Yamuna
• Gangotri - Origin of River Ganga  
• Kedarnath - Lord Shiva's abode (16km trek)
• Badrinath - Lord Vishnu's temple

**Duration & Budget:**
• **Standard Yatra:** 10-12 days, ₹25,000-40,000
• **Helicopter Package:** 5-6 days, ₹1,20,000+

**Best Time:** May-June & September-October 🌤️

**Important:** Register online and book accommodation in advance during peak season.

What type of Char Dham experience would you prefer?

• Budget yatra by road
• Helicopter package
• Detailed itinerary
• Registration help`;

export const generateTravelResponse = async (userMessage, conversationHistory = []) => {
  try {
    console.log('Generating response for:', userMessage);

    // Build conversation context
    const context = conversationHistory.length > 0
      ? conversationHistory.map(msg => `${msg.type}: ${msg.content}`).join('\n') + '\n'
      : '';

    const prompt = `${SYSTEM_PROMPT}

Previous conversation:
${context}

User: ${userMessage}

Please provide a beautifully formatted travel planning response following the formatting requirements above. Keep it concise (under 400 words) and end with exactly 4 suggestion buttons, each on a new line starting with "•".`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();
    console.log('Gemini response received:', text);

    // Clean up and format the response
    text = formatResponse(text);

    // Extract suggestions from the response
    const { content, suggestions } = extractSuggestions(text, userMessage);

    return {
      content: content,
      suggestions: suggestions
    };

  } catch (error) {
    console.error('Detailed error generating response:', error);

    // Fallback response with beautiful formatting
    return {
      content: `🌟 **I'm here to help you explore Uttarakhand - Devbhoomi!**

I'm having a brief connection issue, but don't worry - I'm still excited to help you discover the incredible beauty of Uttarakhand! 

**Let me know what interests you:**
• 🏔️ Hill stations like Mussoorie & Nainital
• 🕉️ Char Dham pilgrimage journey
• 🥾 Adventure trekking and skiing
• 🐅 Wildlife safaris in Jim Corbett

What type of Uttarakhand experience are you dreaming of? ✨`,
      suggestions: ["Hill stations", "Char Dham yatra", "Adventure trekking", "Jim Corbett safari"]
    };
  }
};

// Helper function to format the response text
const formatResponse = (text) => {
  // First, normalize line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Replace any asterisk bullet points with proper bullet points (but preserve bold formatting)
  text = text.replace(/^\s*\*\s+/gm, '• ');
  text = text.replace(/([.!?])\s*\*\s+/g, '$1\n\n• ');

  // Ensure proper spacing around bold headers
  text = text.replace(/(\*\*[^*]+\*\*)/g, '\n\n$1\n');

  // Ensure bullet points are on new lines with proper spacing
  text = text.replace(/([.!?])\s*(•)/g, '$1\n\n$2');
  text = text.replace(/^(•.+)$/gm, '\n$1');

  // Add spacing before numbered lists
  text = text.replace(/([.!?])\s*(\d+\.)/g, '$1\n\n$2');

  // Ensure sections are properly separated
  text = text.replace(/(\*\*[^*]+\*\*)\n([^•\d\n])/g, '$1\n\n$2');

  // Clean up multiple consecutive newlines (max 2)
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  text = text.trim();

  return text;
};

// Helper function to extract suggestions from response
const extractSuggestions = (text, userMessage) => {
  const lines = text.split('\n');
  const suggestions = [];
  let content = text;

  // Look for suggestion lines starting with •
  const suggestionLines = [];
  let suggestionStartIndex = -1;

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.startsWith('•') && line.length > 2) {
      suggestionLines.unshift(line.substring(1).trim());
      if (suggestionStartIndex === -1) {
        suggestionStartIndex = i;
      }
    } else if (suggestionLines.length > 0) {
      break; // Stop if we hit a non-suggestion line after finding suggestions
    }
  }

  // Remove suggestion lines from content if found
  if (suggestionStartIndex > -1 && suggestionLines.length > 0) {
    content = lines.slice(0, suggestionStartIndex).join('\n').trim();
    suggestions.push(...suggestionLines.slice(0, 4));
  }

  // If no suggestions found in the expected format, provide contextual defaults
  if (suggestions.length === 0) {
    const lowerText = text.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();

    if (lowerText.includes('mussoorie') || lowerMessage.includes('mussoorie')) {
      suggestions.push("Mussoorie attractions", "Cable car rides", "Mall Road shopping", "Kempty Falls visit");
    } else if (lowerText.includes('nainital') || lowerMessage.includes('nainital')) {
      suggestions.push("Naini Lake boating", "Snow View Point", "Naina Devi Temple", "Mall Road walk");
    } else if (lowerText.includes('rishikesh') || lowerMessage.includes('rishikesh')) {
      suggestions.push("River rafting", "Yoga ashrams", "Laxman Jhula", "Evening Ganga aarti");
    } else if (lowerText.includes('haridwar') || lowerMessage.includes('haridwar')) {
      suggestions.push("Har Ki Pauri aarti", "Mansa Devi Temple", "Chandi Devi Temple", "Ganges bathing");
    } else if (lowerText.includes('char dham') || lowerMessage.includes('pilgrimage')) {
      suggestions.push("Kedarnath yatra", "Badrinath darshan", "Gangotri visit", "Yamunotri trip");
    } else if (lowerText.includes('jim corbett') || lowerMessage.includes('wildlife')) {
      suggestions.push("Tiger safari", "Elephant safari", "Bird watching", "Nature walks");
    } else if (lowerText.includes('auli') || lowerMessage.includes('skiing')) {
      suggestions.push("Skiing packages", "Cable car ride", "Auli trek", "Winter sports");
    } else if (lowerText.includes('trek') || lowerMessage.includes('adventure')) {
      suggestions.push("Valley of Flowers", "Roopkund trek", "Chopta Tungnath", "Har Ki Dun");
    } else if (lowerText.includes('budget') || lowerMessage.includes('budget')) {
      suggestions.push("₹8,000-15,000", "₹15,000-30,000", "Budget homestays", "Local transport");
    } else if (lowerMessage.includes('family')) {
      suggestions.push("Family hill stations", "Kid-friendly places", "Safe destinations", "Family activities");
    } else {
      suggestions.push("Hill stations", "Char Dham yatra", "Adventure treks", "Best time to visit");
    }
  }

  return {
    content: content,
    suggestions: suggestions.slice(0, 4)
  };
};