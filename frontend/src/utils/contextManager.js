import { openDB } from 'idb';

// --- 1. DATABASE CONFIGURATION ---
const DB_NAME = 'TravelAI_DB';
const CHAT_STORE = 'chat_history';
const MAP_STORE = 'geo_maps';
const ACTIVITY_STORE = 'user_activities';
const API_CACHE_STORE = 'api_cache'; // NEW: For caching API responses

// Default cache TTL in milliseconds (24 hours)
const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

// Initialize the Database
const initDB = async () => {
  return openDB(DB_NAME, 4, { // Bumped to v4 for new store
    upgrade(db, oldVersion, newVersion, transaction) {
      // 1. Chat History Store
      if (!db.objectStoreNames.contains(CHAT_STORE)) {
        db.createObjectStore(CHAT_STORE, { keyPath: 'id', autoIncrement: true });
      }

      // 2. Map Data Store
      if (!db.objectStoreNames.contains(MAP_STORE)) {
        db.createObjectStore(MAP_STORE);
      }

      // 3. User Activity Store
      if (!db.objectStoreNames.contains(ACTIVITY_STORE)) {
        db.createObjectStore(ACTIVITY_STORE, { keyPath: 'id', autoIncrement: true });
      }

      // 4. API Cache Store (NEW)
      if (!db.objectStoreNames.contains(API_CACHE_STORE)) {
        db.createObjectStore(API_CACHE_STORE);
      }
    },
  });
};

// --- 2. CACHED FETCH (PWA OFFLINE SUPPORT) ---

/**
 * Fetch with IndexedDB caching for offline support
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options + caching config
 * @param {number} options.cacheTTL - Cache time-to-live in ms (default: 24h)
 * @param {boolean} options.forceRefresh - Force fetch from network
 * @param {string} options.cacheKey - Custom cache key (default: url)
 * @returns {Promise<any>} - Parsed JSON response
 */
export const cachedFetch = async (url, options = {}) => {
  const {
    cacheTTL = DEFAULT_CACHE_TTL,
    forceRefresh = false,
    cacheKey = url,
    ...fetchOptions
  } = options;

  const db = await initDB();

  // 1. Check cache first (unless forceRefresh)
  if (!forceRefresh) {
    try {
      const cached = await db.get(API_CACHE_STORE, cacheKey);
      if (cached) {
        const isExpired = Date.now() - cached.timestamp > cacheTTL;
        if (!isExpired) {
          console.log('📦 Cache hit:', cacheKey.slice(0, 50) + '...');
          return cached.data;
        } else {
          console.log('⏰ Cache expired:', cacheKey.slice(0, 50) + '...');
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
  }

  // 2. Fetch from network
  try {
    console.log('🌐 Fetching:', url.slice(0, 50) + '...');
    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // 3. Save to cache
    try {
      await db.put(API_CACHE_STORE, {
        data,
        timestamp: Date.now(),
        url
      }, cacheKey);
      console.log('💾 Cached:', cacheKey.slice(0, 50) + '...');
    } catch (e) {
      console.warn('Cache write error:', e);
    }

    return data;
  } catch (networkError) {
    // 4. Network failed - try stale cache as fallback
    console.warn('🔴 Network error, checking stale cache...');
    try {
      const stale = await db.get(API_CACHE_STORE, cacheKey);
      if (stale) {
        console.log('♻️ Using stale cache:', cacheKey.slice(0, 50) + '...');
        return stale.data;
      }
    } catch (e) { /* ignore */ }

    throw networkError; // No cache available
  }
};

/**
 * Clear all cached API responses
 */
export const clearAPICache = async () => {
  const db = await initDB();
  await db.clear(API_CACHE_STORE);
  console.log('🗑️ API cache cleared');
};

/**
 * Get cache stats
 */
export const getCacheStats = async () => {
  const db = await initDB();
  const count = await db.count(API_CACHE_STORE);
  return { cachedAPIs: count };
};

// --- 3. USER PREFERENCES ---
const getUserPreferences = () => {
  return {
    name: "Traveler",
    travelStyle: "Adventure & History",
    budget: "Mid-range",
    dietary: "Vegetarian",
    safetyConscious: true
  };
};

// --- 4. MAP DATA CACHING ---

export const saveMapToDB = async (key, geoJsonData) => {
  const db = await initDB();
  await db.put(MAP_STORE, geoJsonData, key);
};

export const getMapFromDB = async (key) => {
  const db = await initDB();
  return await db.get(MAP_STORE, key);
};

// --- 5. ACTIVITY LOGGING ---

export const logActivity = async (actionDescription) => {
  const db = await initDB();
  const activity = {
    type: 'click',
    desc: actionDescription,
    timestamp: new Date().toISOString()
  };
  await db.add(ACTIVITY_STORE, activity);

  const count = await db.count(ACTIVITY_STORE);
  if (count > 50) {
    const keys = await db.getAllKeys(ACTIVITY_STORE);
    await db.delete(ACTIVITY_STORE, keys[0]);
  }

  console.log("Logged Activity:", actionDescription);
};

// --- 6. CHAT HISTORY MANAGERS ---

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
  await db.clear(ACTIVITY_STORE);
};

// --- 7. CONTEXT PROMPT BUILDER ---
export const buildContextAwarePrompt = async (userQuery, activeState) => {
  const db = await initDB();
  const prefs = getUserPreferences();

  const chatHistory = await db.getAll(CHAT_STORE);
  const recentChats = chatHistory.slice(-5)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join("\n");

  const activities = await db.getAll(ACTIVITY_STORE);
  const recentActivities = activities.slice(-10)
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