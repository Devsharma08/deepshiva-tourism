import { openDB } from 'idb';

// --- 1. DATABASE CONFIGURATION ---
const DB_NAME = 'TravelAI_DB';
const CHAT_STORE = 'chat_history';
const MAP_STORE = 'geo_maps';
const ACTIVITY_STORE = 'user_activities'; 

// Initialize the Database
const initDB = async () => {
  return openDB(DB_NAME, 3, { // Version bumped to 3 to trigger upgrade
    upgrade(db, oldVersion, newVersion, transaction) {
      // 1. Chat History Store
      if (!db.objectStoreNames.contains(CHAT_STORE)) {
        db.createObjectStore(CHAT_STORE, { keyPath: 'id', autoIncrement: true });
      }
      
      // 2. Map Data Store
      if (!db.objectStoreNames.contains(MAP_STORE)) {
        db.createObjectStore(MAP_STORE);
      }

      // 3. User Activity Store (New Feature)
      if (!db.objectStoreNames.contains(ACTIVITY_STORE)) {
        db.createObjectStore(ACTIVITY_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// --- 2. USER PREFERENCES ---
const getUserPreferences = () => {
  return {
    name: "Traveler",
    travelStyle: "Adventure & History",
    budget: "Mid-range",
    dietary: "Vegetarian",
    safetyConscious: true 
  };
};

// --- 3. MAP DATA CACHING ---

export const saveMapToDB = async (key, geoJsonData) => {
  const db = await initDB();
  await db.put(MAP_STORE, geoJsonData, key);
};

export const getMapFromDB = async (key) => {
  const db = await initDB();
  return await db.get(MAP_STORE, key);
};

// --- 4. ACTIVITY LOGGING (NEW) ---

// Call this function whenever a user clicks a State or District
export const logActivity = async (actionDescription) => {
  const db = await initDB();
  const activity = {
    type: 'click',
    desc: actionDescription,
    timestamp: new Date().toISOString()
  };
  await db.add(ACTIVITY_STORE, activity);
  
  // Optional: Keep only last 50 activities to save space
  const count = await db.count(ACTIVITY_STORE);
  if (count > 50) {
    const keys = await db.getAllKeys(ACTIVITY_STORE);
    await db.delete(ACTIVITY_STORE, keys[0]);
  }
  
  console.log("Logged Activity:", actionDescription);
};

// --- 5. CHAT HISTORY MANAGERS ---

export const saveMessageToHistory = async (role, text) => {
  const db = await initDB();
  const timestamp = new Date().toISOString();
  const newMessage = { role, text, timestamp };
  
  await db.add(CHAT_STORE, newMessage);
  
  const count = await db.count(CHAT_STORE);
  if (count > 50) {
    const keys = await db.getAllKeys(CHAT_STORE);
    await db.delete(CHAT_STORE, keys[0]); 
  }
  return newMessage;
};

export const getChatHistory = async () => {
  const db = await initDB();
  return await db.getAll(CHAT_STORE);
};

export const clearHistory = async () => {
  const db = await initDB();
  await db.clear(CHAT_STORE);
  await db.clear(ACTIVITY_STORE); // Clear activities too
};

// --- 6. CONTEXT PROMPT BUILDER ---
export const buildContextAwarePrompt = async (userQuery, activeState) => {
  const db = await initDB();
  const prefs = getUserPreferences();

  // A. Fetch Chat History
  const chatHistory = await db.getAll(CHAT_STORE);
  const recentChats = chatHistory.slice(-5)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join("\n");

  // B. Fetch Recent Activities (The new Context Feature)
  const activities = await db.getAll(ACTIVITY_STORE);
  const recentActivities = activities.slice(-10) // Get last 10 clicks
    .map(a => `[${new Date(a.timestamp).toLocaleTimeString()}] ${a.desc}`)
    .join("\n");

  const systemContext = `
    SYSTEM_INSTRUCTION:
    You are a witty, knowledgeable travel guide with a "National Geographic" personality.
    
    USER_PROFILE:
    - Style: ${prefs.travelStyle}
    - Budget: ${prefs.budget}
    - Dietary: ${prefs.dietary}
    
    CURRENT_VIEW:
    The user is currently looking at the map of: ${activeState || "All India"}.

    USER'S RECENT NAVIGATION PATH (Use this to infer interest):
    ${recentActivities || "No recent clicks recorded."}
    
    CONVERSATION_HISTORY:
    ${recentChats}
  `;

  return `${systemContext}\n\nUser Question: ${userQuery}`;
};