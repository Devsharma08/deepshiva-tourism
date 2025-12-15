/**
 * Wikimedia Commons Service for Backend
 * Provides context-accurate images for Indian tourism destinations
 * Replaces static Unsplash URLs with dynamic Wikimedia Commons images
 */

const axios = require('axios');

// Cache for storing fetched images
const imageCache = new Map();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Wikimedia Commons API base URL
const WIKI_API_BASE = 'https://commons.wikimedia.org/w/api.php';

/**
 * Build search query with context for better accuracy
 */
function buildSearchQuery(keyword, context = 'default') {
    const cleanKeyword = keyword.trim();

    const contextModifiers = {
        state: `${cleanKeyword} India state`,
        city: `${cleanKeyword} India city`,
        temple: `${cleanKeyword} temple India`,
        monument: `${cleanKeyword} monument India`,
        palace: `${cleanKeyword} palace India`,
        food: `${cleanKeyword} Indian cuisine food`,
        hotel: `${cleanKeyword} hotel India luxury`,
        beach: `${cleanKeyword} beach India coast`,
        mountain: `${cleanKeyword} mountain India Himalayas`,
        activity: `${cleanKeyword} tourism India`,
        wildlife: `${cleanKeyword} wildlife India nature`,
        adventure: `${cleanKeyword} adventure outdoor India`,
        water: `${cleanKeyword} water sports India`,
        wellness: `${cleanKeyword} wellness spa yoga India`,
        camping: `${cleanKeyword} camping outdoor India nature`,
        default: `${cleanKeyword} India tourism`
    };

    return contextModifiers[context] || contextModifiers.default;
}

/**
 * Fetch images from Wikimedia Commons API
 */
async function fetchWikimediaImages(query, limit = 5) {
    const cacheKey = `${query}_${limit}`;

    // Check cache first
    const cached = imageCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return cached.data;
    }

    try {
        const params = {
            action: 'query',
            generator: 'search',
            gsrsearch: query,
            gsrnamespace: '6',
            gsrlimit: Math.min(limit, 10).toString(),
            prop: 'imageinfo',
            iiprop: 'url|dimensions|mime',
            iiurlwidth: '800',
            format: 'json',
            origin: '*'
        };

        console.log(`🔍 Wikimedia search: "${query}"`);

        const response = await axios.get(WIKI_API_BASE, {
            params,
            timeout: 10000,
            headers: {
                'User-Agent': 'DeepShivaTourismApp/1.0 (https://github.com/deepshiva; contact@deepshiva.com)'
            }
        });

        const data = response.data;

        if (!data.query || !data.query.pages) {
            console.log('⚠️ No results from Wikimedia');
            return [];
        }

        const pages = Object.values(data.query.pages);
        console.log(`📄 Found ${pages.length} pages from Wikimedia`);

        const images = pages
            .filter(page => {
                const imageInfo = page.imageinfo?.[0];
                if (!imageInfo) {
                    console.log(`⚠️ No imageinfo for: ${page.title}`);
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
                    height: imageInfo.thumbheight || imageInfo.height
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
        console.error('❌ Wikimedia API fetch error:', error.message);
        return [];
    }
}

/**
 * Get a single image URL
 */
async function getImageUrl(keyword, context = 'default') {
    if (!keyword) return null;

    const query = buildSearchQuery(keyword, context);
    const images = await fetchWikimediaImages(query, 1);

    if (images.length > 0) {
        return images[0].url;
    }

    // Try simpler search
    if (context !== 'default') {
        const simpleImages = await fetchWikimediaImages(`${keyword} India`, 1);
        if (simpleImages.length > 0) {
            return simpleImages[0].url;
        }
    }

    return null;
}

/**
 * Get multiple images
 */
async function getMultipleImages(keyword, context = 'default', count = 3) {
    if (!keyword) return [];

    const query = buildSearchQuery(keyword, context);
    const images = await fetchWikimediaImages(query, count);

    return images.map(img => img.url);
}

/**
 * India-specific image mappings for common locations
 */
const INDIA_IMAGE_MAPPINGS = {
    // States
    'Rajasthan': 'Rajasthan India desert palace Jaipur',
    'Kerala': 'Kerala backwaters houseboat India',
    'Goa': 'Goa beach India tourism',
    'Himachal Pradesh': 'Himachal Pradesh mountains Manali',
    'Uttarakhand': 'Uttarakhand Rishikesh temple Himalayas',
    'Tamil Nadu': 'Tamil Nadu temple Meenakshi',
    'Karnataka': 'Karnataka Hampi ruins heritage',
    'Maharashtra': 'Maharashtra Mumbai Gateway India',
    'Gujarat': 'Gujarat Rann Kutch white desert',
    'West Bengal': 'Kolkata Victoria Memorial Bengal',
    'Ladakh': 'Ladakh Pangong Lake mountains',

    // Popular destinations
    'Taj Mahal': 'Taj Mahal Agra sunrise',
    'Jaipur': 'Jaipur Hawa Mahal Pink City',
    'Varanasi': 'Varanasi Ganga ghat aarti',
    'Udaipur': 'Udaipur Lake Palace Rajasthan',
    'Munnar': 'Munnar tea plantations Kerala',
    'Manali': 'Manali snow mountains Himachal',
    'Rishikesh': 'Rishikesh Ganga Lakshman Jhula yoga',
    'Leh': 'Leh Ladakh monastery mountains',
    'Darjeeling': 'Darjeeling tea garden Himalayas',
    'Alleppey': 'Alleppey Kerala backwaters houseboat',
    'Jaisalmer': 'Jaisalmer golden fort Rajasthan desert',
    'Hampi': 'Hampi ruins Vijayanagara Karnataka',
    'Agra': 'Agra Fort Yamuna Mughal',
    'Khajuraho': 'Khajuraho temple sculptures',

    // Cities
    'Delhi': 'Delhi India Gate Red Fort',
    'Mumbai': 'Mumbai Gateway India skyline',
    'Bangalore': 'Bangalore Vidhan Soudha Karnataka',
    'Chennai': 'Chennai Marina Beach temple',
    'Kolkata': 'Kolkata Victoria Memorial Howrah',
    'Hyderabad': 'Hyderabad Charminar Golconda',
    'Pune': 'Pune Shaniwar Wada Maharashtra',
    'Ahmedabad': 'Ahmedabad Sabarmati Ashram Gujarat',
    'Kochi': 'Kochi Chinese fishing nets Kerala',
    'Srinagar': 'Srinagar Dal Lake houseboat Kashmir',
};

/**
 * Get optimized image for known Indian locations
 */
async function getIndiaLocationImage(locationName, fallbackContext = 'default') {
    const optimizedQuery = INDIA_IMAGE_MAPPINGS[locationName];

    if (optimizedQuery) {
        const images = await fetchWikimediaImages(optimizedQuery, 1);
        if (images.length > 0) {
            return images[0].url;
        }
    }

    return getImageUrl(locationName, fallbackContext);
}

/**
 * Batch fetch images for multiple locations
 * Useful for populating mock data
 */
async function batchFetchImages(locations, context = 'default') {
    const results = {};

    for (const location of locations) {
        try {
            const url = await getIndiaLocationImage(location, context);
            results[location] = url;
            // Small delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            results[location] = null;
        }
    }

    return results;
}

/**
 * Clear image cache
 */
function clearImageCache() {
    imageCache.clear();
}

/**
 * Get cache stats
 */
function getCacheStats() {
    return {
        size: imageCache.size,
        entries: Array.from(imageCache.keys())
    };
}

module.exports = {
    getImageUrl,
    getMultipleImages,
    getIndiaLocationImage,
    batchFetchImages,
    fetchWikimediaImages,
    clearImageCache,
    getCacheStats,
    INDIA_IMAGE_MAPPINGS
};
