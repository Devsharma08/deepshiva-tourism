/**
 * Wikimedia Commons API Service
 * Fetches context-accurate images for Indian tourism destinations
 * Replaces Unsplash with free, high-quality Wikimedia Commons images
 */

// Cache for storing fetched images
const imageCache = new Map();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Wikimedia Commons API base URL
const WIKI_API_BASE = 'https://commons.wikimedia.org/w/api.php';

/**
 * Build search terms for better accuracy
 * Adds contextual keywords to improve search results for Indian locations
 */
const buildSearchQuery = (keyword, context = '') => {
    const cleanKeyword = keyword.trim();
    let searchTerms = cleanKeyword;

    // Add context modifiers for better accuracy
    const contextModifiers = {
        state: `${cleanKeyword} India state`,
        city: `${cleanKeyword} India city`,
        temple: `${cleanKeyword} temple India`,
        monument: `${cleanKeyword} monument India`,
        palace: `${cleanKeyword} palace India`,
        food: `${cleanKeyword} Indian cuisine`,
        hotel: `${cleanKeyword} hotel India`,
        beach: `${cleanKeyword} beach India`,
        mountain: `${cleanKeyword} mountain India Himalayas`,
        activity: `${cleanKeyword} tourism India`,
        wildlife: `${cleanKeyword} wildlife India`,
        default: `${cleanKeyword} India tourism`
    };

    return contextModifiers[context] || contextModifiers.default;
};

/**
 * Fetch images from Wikimedia Commons API
 * @param {string} query - Search query
 * @param {number} limit - Number of images to fetch (max 10 for performance)
 * @returns {Promise<Array>} Array of image objects with url, title, and metadata
 */
async function fetchWikimediaImages(query, limit = 5) {
    const cacheKey = `${query}_${limit}`;

    // Check cache first
    const cached = imageCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return cached.data;
    }

    try {
        const params = new URLSearchParams({
            action: 'query',
            generator: 'search',
            gsrsearch: query,
            gsrnamespace: '6', // File namespace
            gsrlimit: Math.min(limit, 10).toString(),
            prop: 'imageinfo',
            iiprop: 'url|dimensions|mime',
            iiurlwidth: '800', // Request thumbnail at 800px width
            format: 'json',
            origin: '*' // Enable CORS
        });

        console.log(`🔍 Wikimedia search: "${query}"`);

        const response = await fetch(`${WIKI_API_BASE}?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Wikimedia API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.query || !data.query.pages) {
            console.log('⚠️ No results from Wikimedia');
            return [];
        }

        const pages = Object.values(data.query.pages);
        console.log(`📄 Found ${pages.length} pages from Wikimedia`);

        // Process and filter images - skip SVGs only
        const images = pages
            .filter(page => {
                const imageInfo = page.imageinfo?.[0];
                if (!imageInfo) {
                    return false;
                }
                // Accept any image format, just skip SVGs
                const title = page.title.toLowerCase();
                if (title.endsWith('.svg')) return false;
                return true;
            })
            .map(page => {
                const imageInfo = page.imageinfo[0];
                return {
                    url: imageInfo.thumburl || imageInfo.url,
                    fullUrl: imageInfo.url,
                    title: page.title.replace('File:', ''),
                    width: imageInfo.thumbwidth || imageInfo.width,
                    height: imageInfo.thumbheight || imageInfo.height,
                    source: 'Wikimedia Commons'
                };
            })
            .slice(0, limit);

        console.log(`✅ Returning ${images.length} images`);

        // Cache the results
        imageCache.set(cacheKey, {
            data: images,
            timestamp: Date.now()
        });

        return images;
    } catch (error) {
        console.error('❌ Wikimedia API fetch error:', error);
        return [];
    }
}

/**
 * Get a single image URL for a location/topic
 * @param {string} keyword - Location or topic name
 * @param {string} context - Context type: 'state', 'city', 'temple', 'food', etc.
 * @param {string} fallbackUrl - Fallback URL if no image found
 * @returns {Promise<string>} Image URL
 */
async function getImageUrl(keyword, context = 'default', fallbackUrl = null) {
    if (!keyword) return fallbackUrl;

    const query = buildSearchQuery(keyword, context);
    const images = await fetchWikimediaImages(query, 1);

    if (images.length > 0) {
        return images[0].url;
    }

    // Try a simpler search if context-specific search fails
    if (context !== 'default') {
        const simpleImages = await fetchWikimediaImages(`${keyword} India`, 1);
        if (simpleImages.length > 0) {
            return simpleImages[0].url;
        }
    }

    return fallbackUrl || getPlaceholderImage(keyword);
}

/**
 * Get multiple images for a location/topic
 * @param {string} keyword - Location or topic name
 * @param {string} context - Context type
 * @param {number} count - Number of images needed
 * @returns {Promise<Array>} Array of image URLs
 */
async function getMultipleImages(keyword, context = 'default', count = 3) {
    if (!keyword) return [];

    const query = buildSearchQuery(keyword, context);
    const images = await fetchWikimediaImages(query, count);

    return images.map(img => img.url);
}

/**
 * Get images for a gallery (with full metadata)
 * @param {string} keyword - Location or topic name
 * @param {string} context - Context type
 * @param {number} count - Number of images
 * @returns {Promise<Array>} Array of image objects with metadata
 */
async function getGalleryImages(keyword, context = 'default', count = 6) {
    if (!keyword) return [];

    const query = buildSearchQuery(keyword, context);
    return await fetchWikimediaImages(query, count);
}

/**
 * Generate a placeholder image URL
 * Uses a gradient placeholder with text
 */
function getPlaceholderImage(text = 'Image') {
    // SVG placeholder with gradient background
    const encodedText = encodeURIComponent(text.substring(0, 20));
    return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" 
        text-anchor="middle" dominant-baseline="middle" opacity="0.8">${text}</text>
    </svg>
  `)}`;
}

/**
 * Preload images for a list of locations
 * Useful for preloading state/city images on page load
 * @param {Array} locations - Array of location objects with name and context
 */
async function preloadLocationImages(locations) {
    const promises = locations.map(loc =>
        getImageUrl(loc.name, loc.context || 'default')
    );
    return Promise.allSettled(promises);
}

/**
 * India-specific image mappings for common searches
 * Provides better search queries for commonly requested images
 */
const INDIA_IMAGE_MAPPINGS = {
    // States
    'Rajasthan': 'Rajasthan India desert palace Jaipur',
    'Kerala': 'Kerala backwaters houseboat India',
    'Goa': 'Goa beach India tourism',
    'Himachal Pradesh': 'Himachal Pradesh mountains Manali',
    'Uttarakhand': 'Uttarakhand Rishikesh Himalaya mountains',
    'Tamil Nadu': 'Tamil Nadu temple Meenakshi',
    'Karnataka': 'Karnataka Hampi ruins heritage',
    'Maharashtra': 'Maharashtra Mumbai Gateway India',
    'Gujarat': 'Gujarat Rann Kutch white desert',
    'West Bengal': 'Kolkata Victoria Memorial Bengal',
    'Ladakh': 'Ladakh Pangong Lake mountains',
    'Uttar Pradesh': 'Uttar Pradesh Taj Mahal Varanasi',
    'Jammu and Kashmir': 'Kashmir Dal Lake Srinagar',
    'Punjab': 'Punjab Golden Temple Amritsar',
    'Odisha': 'Odisha Konark Sun Temple',
    'Andhra Pradesh': 'Andhra Pradesh Tirupati temple',
    'Telangana': 'Hyderabad Charminar Telangana',
    'Madhya Pradesh': 'Madhya Pradesh Khajuraho temple',
    'Bihar': 'Bihar Bodh Gaya Mahabodhi Temple',
    'Assam': 'Assam Kaziranga rhino wildlife',
    'Meghalaya': 'Meghalaya living root bridge Cherrapunji',
    'Sikkim': 'Sikkim monastery Kanchenjunga',
    'Arunachal Pradesh': 'Arunachal Pradesh Tawang monastery',
    'Nagaland': 'Nagaland Hornbill Festival',
    'Manipur': 'Manipur Loktak Lake floating island',
    'Tripura': 'Tripura Neermahal palace',
    'Mizoram': 'Mizoram Aizawl hills',
    'Chhattisgarh': 'Chhattisgarh Chitrakote Falls',
    'Jharkhand': 'Jharkhand Ranchi Falls',

    // Popular destinations
    'Taj Mahal': 'Taj Mahal Agra sunrise',
    'Jaipur': 'Jaipur Hawa Mahal Pink City',
    'Varanasi': 'Varanasi Ganga ghat aarti',
    'Udaipur': 'Udaipur Lake Palace Rajasthan',
    'Munnar': 'Munnar tea plantations Kerala',
    'Darjeeling': 'Darjeeling tea garden Himalayas',
    'Rishikesh': 'Rishikesh Ganga Lakshman Jhula',
    'Agra': 'Agra Fort Yamuna Mughal',
    'Khajuraho': 'Khajuraho temple sculptures',
    'Hampi': 'Hampi ruins Vijayanagara Karnataka',
    'Jaisalmer': 'Jaisalmer fort golden city desert',
    'Alleppey': 'Alleppey Kerala backwaters houseboat',
    'Manali': 'Manali snow mountains Himachal',
    'Shimla': 'Shimla Mall Road colonial India',
    'Mussoorie': 'Mussoorie queen hills Uttarakhand',
    'Nainital': 'Nainital lake Uttarakhand',
    'Kedarnath': 'Kedarnath temple Uttarakhand Himalayas',
    'Badrinath': 'Badrinath temple Uttarakhand',
    'Haridwar': 'Haridwar Ganga aarti',
    'Pangong Tso': 'Pangong Lake Ladakh blue',
    'Nubra Valley': 'Nubra Valley Ladakh sand dunes',
    'Dal Lake': 'Dal Lake Srinagar houseboat',
    'Gulmarg': 'Gulmarg skiing snow Kashmir',
    'Ooty': 'Ooty Nilgiri hills tea',
    'Kodaikanal': 'Kodaikanal Tamil Nadu hills',
    'Coorg': 'Coorg coffee plantation Karnataka',
    'Mysore': 'Mysore Palace Karnataka',
    'Ajanta': 'Ajanta Caves Maharashtra',
    'Ellora': 'Ellora Caves Maharashtra',
    'Konark': 'Konark Sun Temple Odisha',
    'Puri': 'Puri Jagannath Temple beach',
    'Guwahati': 'Guwahati Kamakhya Temple Assam',
    'Shillong': 'Shillong Meghalaya Scotland East',

    // Food items
    'Dal Baati Churma': 'Dal Bati Churma Rajasthani food',
    'Laal Maas': 'Laal Maas Rajasthan mutton curry',
    'Tunday Kabab': 'Tunday Kebab Lucknow food',
    'Banarasi Paan': 'Paan betel leaf India',
    'Wazwan': 'Wazwan Kashmir feast food',
    'Kahwa': 'Kahwa Kashmir tea saffron',
    'Thukpa': 'Thukpa Tibetan noodle soup',
    'Momos': 'Momos dumpling Indian food',
    'Dham': 'Dham Himachali food feast',
    'Sadhya': 'Sadhya Kerala banana leaf',
    'Fish Molee': 'Fish Moilee Kerala curry',
    'Aloo ke Gutke': 'Aloo Gutke Uttarakhand potato',
    'Chole Bhature': 'Chole Bhature Delhi food',
    'Poha Jalebi': 'Poha Jalebi Indore breakfast',
    'Hyderabadi Biryani': 'Hyderabadi Biryani food',
    'Dosa': 'Dosa South Indian food',
    'Idli': 'Idli Sambar breakfast',
    'Vada Pav': 'Vada Pav Mumbai street food',
    'Pav Bhaji': 'Pav Bhaji Mumbai food',
};

/**
 * Get optimized image for known Indian locations
 * Uses predefined search queries for better accuracy
 */
async function getIndiaLocationImage(locationName, fallbackContext = 'default') {
    const optimizedQuery = INDIA_IMAGE_MAPPINGS[locationName];

    if (optimizedQuery) {
        const images = await fetchWikimediaImages(optimizedQuery, 1);
        if (images.length > 0) {
            return images[0].url;
        }
    }

    // Fall back to standard search
    return getImageUrl(locationName, fallbackContext);
}

/**
 * Clear image cache
 * Call this periodically or when needed to refresh images
 */
function clearImageCache() {
    imageCache.clear();
}

/**
 * Get cache stats for debugging
 */
function getCacheStats() {
    return {
        size: imageCache.size,
        entries: Array.from(imageCache.keys())
    };
}

// Export all functions
export {
    getImageUrl,
    getMultipleImages,
    getGalleryImages,
    getIndiaLocationImage,
    preloadLocationImages,
    getPlaceholderImage,
    clearImageCache,
    getCacheStats,
    fetchWikimediaImages,
    INDIA_IMAGE_MAPPINGS
};

// Default export for convenience
export default {
    getImageUrl,
    getMultipleImages,
    getGalleryImages,
    getIndiaLocationImage,
    preloadLocationImages,
    getPlaceholderImage
};
