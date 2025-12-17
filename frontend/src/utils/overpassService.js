/**
 * Overpass API Service
 * Fetches Points of Interest (POI) from OpenStreetMap using Overpass API
 * API Documentation: https://wiki.openstreetmap.org/wiki/Overpass_API
 */

// Multiple Overpass API endpoints for fallback and load balancing
const OVERPASS_SERVERS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter'
];

let currentServerIndex = 0;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // Minimum 2 seconds between requests

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

// Request queue to prevent concurrent requests
let requestQueue = Promise.resolve();

/**
 * Get next available server (round-robin)
 */
function getNextServer() {
    const server = OVERPASS_SERVERS[currentServerIndex];
    currentServerIndex = (currentServerIndex + 1) % OVERPASS_SERVERS.length;
    return server;
}

/**
 * Generate cache key from query
 */
function getCacheKey(query) {
    return query.replace(/\s+/g, ' ').trim();
}

/**
 * Get cached result if valid
 */
function getCached(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    cache.delete(key);
    return null;
}

/**
 * Set cache with timestamp
 */
function setCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
    // Limit cache size
    if (cache.size > 50) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
}

// Category mapping for tourist attractions
const categoryMapping = {
    // Tourism
    'tourism=attraction': 'landmark',
    'tourism=museum': 'museum',
    'tourism=gallery': 'museum',
    'tourism=artwork': 'landmark',
    'tourism=viewpoint': 'landmark',
    'tourism=zoo': 'park',
    'tourism=theme_park': 'entertainment',
    'tourism=hotel': 'hotel',
    'tourism=guest_house': 'hotel',
    'tourism=hostel': 'hotel',
    'tourism=resort': 'hotel',
    // Historic
    'historic=monument': 'landmark',
    'historic=memorial': 'landmark',
    'historic=castle': 'landmark',
    'historic=ruins': 'landmark',
    'historic=archaeological_site': 'landmark',
    'historic=fort': 'landmark',
    'historic=palace': 'landmark',
    'historic=tomb': 'landmark',
    // Amenity
    'amenity=place_of_worship': 'temple',
    'amenity=restaurant': 'restaurant',
    'amenity=cafe': 'restaurant',
    'amenity=fast_food': 'restaurant',
    'amenity=bar': 'restaurant',
    'amenity=theatre': 'entertainment',
    'amenity=cinema': 'entertainment',
    'amenity=marketplace': 'shopping',
    // Leisure
    'leisure=park': 'park',
    'leisure=garden': 'park',
    'leisure=nature_reserve': 'park',
    'leisure=beach_resort': 'beach',
    'leisure=water_park': 'entertainment',
    // Natural
    'natural=beach': 'beach',
    'natural=peak': 'adventure',
    'natural=waterfall': 'landmark',
    // Shop
    'shop=mall': 'shopping',
    'shop=supermarket': 'shopping',
    'shop=department_store': 'shopping'
};

// Category icons for display
const categoryIcons = {
    landmark: '🏛️',
    museum: '🏛️',
    park: '🌳',
    restaurant: '🍽️',
    shopping: '🛍️',
    hotel: '🏨',
    temple: '🛕',
    beach: '🏖️',
    entertainment: '🎭',
    adventure: '🏔️'
};

// Category colors for UI
const categoryColors = {
    landmark: 'bg-orange-100 text-orange-700 border-orange-200',
    museum: 'bg-blue-100 text-blue-700 border-blue-200',
    park: 'bg-green-100 text-green-700 border-green-200',
    restaurant: 'bg-red-100 text-red-700 border-red-200',
    shopping: 'bg-purple-100 text-purple-700 border-purple-200',
    hotel: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    temple: 'bg-amber-100 text-amber-700 border-amber-200',
    beach: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    entertainment: 'bg-pink-100 text-pink-700 border-pink-200',
    adventure: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

// Default thumbnail images by category
const defaultThumbnails = {
    landmark: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
    museum: 'https://images.unsplash.com/photo-1565060169194-19fabf63012c?w=400',
    park: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=400',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    shopping: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400',
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    temple: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=400',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    adventure: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'
};

/**
 * Build Overpass QL query for attractions around a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters
 * @param {string} category - Optional category filter
 * @returns {string} Overpass QL query
 */
function buildAttractionQuery(lat, lon, radius = 5000, category = null) {
    let filters;

    if (category) {
        // Category-specific queries
        const categoryQueries = {
            landmark: `
                node["tourism"="attraction"](around:${radius},${lat},${lon});
                node["historic"](around:${radius},${lat},${lon});
                way["historic"](around:${radius},${lat},${lon});
                node["tourism"="viewpoint"](around:${radius},${lat},${lon});
            `,
            museum: `
                node["tourism"="museum"](around:${radius},${lat},${lon});
                way["tourism"="museum"](around:${radius},${lat},${lon});
                node["tourism"="gallery"](around:${radius},${lat},${lon});
            `,
            temple: `
                node["amenity"="place_of_worship"](around:${radius},${lat},${lon});
                way["amenity"="place_of_worship"](around:${radius},${lat},${lon});
            `,
            restaurant: `
                node["amenity"="restaurant"](around:${radius},${lat},${lon});
                node["amenity"="cafe"](around:${radius},${lat},${lon});
                node["amenity"="fast_food"](around:${radius},${lat},${lon});
            `,
            park: `
                node["leisure"="park"](around:${radius},${lat},${lon});
                way["leisure"="park"](around:${radius},${lat},${lon});
                node["leisure"="garden"](around:${radius},${lat},${lon});
                way["leisure"="garden"](around:${radius},${lat},${lon});
            `,
            shopping: `
                node["shop"="mall"](around:${radius},${lat},${lon});
                way["shop"="mall"](around:${radius},${lat},${lon});
                node["amenity"="marketplace"](around:${radius},${lat},${lon});
            `,
            hotel: `
                node["tourism"="hotel"](around:${radius},${lat},${lon});
                way["tourism"="hotel"](around:${radius},${lat},${lon});
                node["tourism"="guest_house"](around:${radius},${lat},${lon});
            `,
            beach: `
                node["natural"="beach"](around:${radius},${lat},${lon});
                way["natural"="beach"](around:${radius},${lat},${lon});
                node["leisure"="beach_resort"](around:${radius},${lat},${lon});
            `,
            entertainment: `
                node["leisure"="water_park"](around:${radius},${lat},${lon});
                node["tourism"="theme_park"](around:${radius},${lat},${lon});
                node["amenity"="theatre"](around:${radius},${lat},${lon});
                node["amenity"="cinema"](around:${radius},${lat},${lon});
            `
        };

        filters = categoryQueries[category] || categoryQueries.landmark;
    } else {
        // General tourist attractions query
        filters = `
            node["tourism"~"attraction|museum|gallery|viewpoint"](around:${radius},${lat},${lon});
            way["tourism"~"attraction|museum|gallery"](around:${radius},${lat},${lon});
            node["historic"](around:${radius},${lat},${lon});
            way["historic"](around:${radius},${lat},${lon});
            node["amenity"="place_of_worship"][~"^(religion|denomination)$"~"."](around:${radius},${lat},${lon});
            way["amenity"="place_of_worship"][~"^(religion|denomination)$"~"."](around:${radius},${lat},${lon});
            node["leisure"="park"]["name"](around:${radius},${lat},${lon});
            way["leisure"="park"]["name"](around:${radius},${lat},${lon});
        `;
    }

    return `
        [out:json][timeout:30];
        (
            ${filters}
        );
        out body center;
    `;
}

/**
 * Build Overpass QL query for nearby places
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {string} Overpass QL query
 */
function buildNearbyQuery(lat, lon, radius = 2000) {
    return `
        [out:json][timeout:25];
        (
            node["tourism"]["name"](around:${radius},${lat},${lon});
            way["tourism"]["name"](around:${radius},${lat},${lon});
            node["historic"]["name"](around:${radius},${lat},${lon});
            way["historic"]["name"](around:${radius},${lat},${lon});
            node["amenity"="place_of_worship"]["name"](around:${radius},${lat},${lon});
            way["amenity"="place_of_worship"]["name"](around:${radius},${lat},${lon});
            node["leisure"="park"]["name"](around:${radius},${lat},${lon});
            way["leisure"="park"]["name"](around:${radius},${lat},${lon});
            node["shop"="mall"]["name"](around:${radius},${lat},${lon});
            node["amenity"="marketplace"]["name"](around:${radius},${lat},${lon});
        );
        out body center;
    `;
}

/**
 * Determine category from OSM tags
 * @param {Object} tags - OSM tags object
 * @returns {string} Category name
 */
function determineCategory(tags) {
    if (!tags) return 'landmark';

    // Check specific combinations first
    if (tags.amenity === 'place_of_worship') {
        return 'temple';
    }

    // Check tourism tags
    if (tags.tourism) {
        const tourismMapping = {
            'attraction': 'landmark',
            'museum': 'museum',
            'gallery': 'museum',
            'viewpoint': 'landmark',
            'hotel': 'hotel',
            'guest_house': 'hotel',
            'hostel': 'hotel',
            'theme_park': 'entertainment',
            'zoo': 'park'
        };
        if (tourismMapping[tags.tourism]) return tourismMapping[tags.tourism];
    }

    // Check historic tags
    if (tags.historic) {
        return 'landmark';
    }

    // Check leisure tags
    if (tags.leisure) {
        const leisureMapping = {
            'park': 'park',
            'garden': 'park',
            'nature_reserve': 'park',
            'beach_resort': 'beach',
            'water_park': 'entertainment'
        };
        if (leisureMapping[tags.leisure]) return leisureMapping[tags.leisure];
    }

    // Check natural tags
    if (tags.natural) {
        const naturalMapping = {
            'beach': 'beach',
            'peak': 'adventure',
            'waterfall': 'landmark'
        };
        if (naturalMapping[tags.natural]) return naturalMapping[tags.natural];
    }

    // Check amenity tags
    if (tags.amenity) {
        const amenityMapping = {
            'restaurant': 'restaurant',
            'cafe': 'restaurant',
            'fast_food': 'restaurant',
            'bar': 'restaurant',
            'theatre': 'entertainment',
            'cinema': 'entertainment',
            'marketplace': 'shopping'
        };
        if (amenityMapping[tags.amenity]) return amenityMapping[tags.amenity];
    }

    // Check shop tags
    if (tags.shop) {
        return 'shopping';
    }

    return 'landmark';
}

/**
 * Estimate visit duration based on category and place type
 * @param {string} category - Place category
 * @param {Object} tags - OSM tags
 * @returns {number} Duration in minutes
 */
function estimateDuration(category, tags) {
    const baseDurations = {
        landmark: 90,
        museum: 120,
        park: 60,
        restaurant: 75,
        shopping: 90,
        hotel: 0,
        temple: 45,
        beach: 180,
        entertainment: 150,
        adventure: 180
    };

    let duration = baseDurations[category] || 60;

    // Adjust based on specific tags
    if (tags?.historic === 'palace' || tags?.historic === 'castle') {
        duration = 120;
    } else if (tags?.tourism === 'museum') {
        duration = 120;
    } else if (tags?.tourism === 'theme_park' || tags?.tourism === 'zoo') {
        duration = 240;
    }

    return duration;
}

/**
 * Get priority based on tags
 * @param {Object} tags - OSM tags
 * @returns {string} 'must-visit' or 'optional'
 */
function determinePriority(tags) {
    if (!tags) return 'optional';

    // Must-visit criteria
    const highPriorityIndicators = [
        tags.tourism === 'attraction',
        tags.heritage === 'world', // UNESCO
        tags.wikidata, // Has Wikipedia article
        tags.historic === 'palace',
        tags.historic === 'castle',
        tags.historic === 'monument',
        tags['name:en'] && tags.tourism // Popular enough to have English name
    ];

    if (highPriorityIndicators.some(indicator => indicator)) {
        return 'must-visit';
    }

    return 'optional';
}

/**
 * Parse opening hours from OSM format
 * @param {string} openingHours - OSM opening_hours string
 * @returns {string} Simplified opening hours string
 */
function parseOpeningHours(openingHours) {
    if (!openingHours) return '09:00 - 18:00';

    // Simple parsing - take the first time range
    const timeMatch = openingHours.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
    if (timeMatch) {
        return `${timeMatch[1]} - ${timeMatch[2]}`;
    }

    // Check for 24/7
    if (openingHours.includes('24/7')) {
        return 'Open 24 hours';
    }

    return openingHours.length > 30 ? openingHours.substring(0, 30) + '...' : openingHours;
}

/**
 * Get Wikidata image URL if available
 * @param {string} wikidataId - Wikidata Q-ID
 * @returns {Promise<string|null>} Image URL or null
 */
async function getWikidataImage(wikidataId) {
    if (!wikidataId) return null;

    try {
        const response = await fetch(
            `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wikidataId}&property=P18&format=json&origin=*`
        );

        if (!response.ok) return null;

        const data = await response.json();
        const claims = data.claims?.P18;

        if (claims && claims.length > 0) {
            const imageName = claims[0].mainsnak?.datavalue?.value;
            if (imageName) {
                // Convert filename to Wikimedia Commons URL
                const encodedName = encodeURIComponent(imageName.replace(/ /g, '_'));
                return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodedName}?width=400`;
            }
        }
    } catch (error) {
        console.error('Error fetching Wikidata image:', error);
    }

    return null;
}

/**
 * Transform Overpass API result to our app format
 * @param {Object} element - Overpass API element
 * @param {number} index - Element index for ID generation
 * @returns {Object} Transformed place object
 */
async function transformOverpassPlace(element, index = 0) {
    const tags = element.tags || {};
    const category = determineCategory(tags);

    // Get coordinates (for ways, use center)
    const lat = element.lat || element.center?.lat;
    const lon = element.lon || element.center?.lon;

    // Try to get image from Wikidata
    let thumbnail = defaultThumbnails[category];
    if (tags.wikidata) {
        try {
            const wikidataImage = await getWikidataImage(tags.wikidata);
            if (wikidataImage) {
                thumbnail = wikidataImage;
            }
        } catch (e) {
            // Use default
        }
    }

    // Build description from tags
    let description = '';
    if (tags.description) {
        description = tags.description;
    } else if (tags['description:en']) {
        description = tags['description:en'];
    } else {
        // Build description from available info
        const parts = [];
        if (tags.historic) parts.push(`Historic ${tags.historic}`);
        if (tags.tourism && tags.tourism !== 'yes') parts.push(`Tourism: ${tags.tourism}`);
        if (tags.religion) parts.push(`Religion: ${tags.religion}`);
        if (tags.architecture) parts.push(`Architecture: ${tags.architecture}`);
        if (tags.heritage) parts.push(`Heritage: ${tags.heritage}`);

        description = parts.length > 0
            ? parts.join(' • ')
            : 'A point of interest worth visiting.';
    }

    return {
        id: `osm_${element.type}_${element.id}`,
        osmId: element.id,
        osmType: element.type,
        name: tags.name || tags['name:en'] || 'Unknown Place',
        category: category,
        thumbnail: thumbnail,
        priority: determinePriority(tags),
        scheduledDay: null,
        scheduledTime: null,
        duration: estimateDuration(category, tags),
        coordinates: {
            lat: lat,
            lng: lon
        },
        openingHours: parseOpeningHours(tags.opening_hours),
        description: description,
        ticketPrice: tags.fee === 'yes' ? 'Entry fee required' : (tags.fee || 'Contact venue'),
        website: tags.website || tags['contact:website'] || null,
        phone: tags.phone || tags['contact:phone'] || null,
        hasConflict: false,
        conflictReason: null,
        tips: [],
        wikidata: tags.wikidata,
        wikipedia: tags.wikipedia,
        address: tags['addr:full'] || (tags['addr:street'] ? `${tags['addr:street']}, ${tags['addr:city'] || ''}` : null),
        religion: tags.religion,
        cuisine: tags.cuisine,
        stars: tags.stars,
        wheelchair: tags.wheelchair
    };
}

/**
 * Execute Overpass API query with rate limiting, caching, and retries
 * @param {string} query - Overpass QL query
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @returns {Promise<Array>} Array of elements
 */
async function executeOverpassQuery(query, maxRetries = 3) {
    const cacheKey = getCacheKey(query);

    // Check cache first
    const cached = getCached(cacheKey);
    if (cached) {
        console.log('Overpass: Using cached result');
        return cached;
    }

    // Queue this request to prevent concurrent API calls
    return new Promise((resolve, reject) => {
        requestQueue = requestQueue.then(async () => {
            // Rate limiting - wait if needed
            const now = Date.now();
            const timeSinceLastRequest = now - lastRequestTime;
            if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
                const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
                console.log(`Overpass: Rate limiting, waiting ${waitTime}ms`);
                await new Promise(r => setTimeout(r, waitTime));
            }

            let lastError = null;

            // Try each server with retries
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                const server = getNextServer();

                try {
                    console.log(`Overpass: Trying ${server} (attempt ${attempt + 1}/${maxRetries})`);
                    lastRequestTime = Date.now();

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

                    const response = await fetch(server, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `data=${encodeURIComponent(query)}`,
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (response.status === 429) {
                        // Rate limited - wait longer and try another server
                        console.warn(`Overpass: Server ${server} rate limited (429), trying next server...`);
                        const backoffTime = Math.min(5000 * Math.pow(2, attempt), 30000);
                        await new Promise(r => setTimeout(r, backoffTime));
                        continue;
                    }

                    if (response.status === 504 || response.status === 503) {
                        // Server overloaded - try another
                        console.warn(`Overpass: Server ${server} overloaded (${response.status}), trying next...`);
                        await new Promise(r => setTimeout(r, 1000));
                        continue;
                    }

                    if (!response.ok) {
                        throw new Error(`Overpass API error: ${response.status}`);
                    }

                    const data = await response.json();
                    const elements = data.elements || [];

                    // Cache successful result
                    setCache(cacheKey, elements);

                    resolve(elements);
                    return;

                } catch (error) {
                    lastError = error;
                    console.warn(`Overpass: Attempt ${attempt + 1} failed:`, error.message);

                    if (error.name === 'AbortError') {
                        console.warn('Overpass: Request timed out');
                    }

                    // Wait before retry with exponential backoff
                    if (attempt < maxRetries - 1) {
                        const backoffTime = Math.min(2000 * Math.pow(2, attempt), 15000);
                        await new Promise(r => setTimeout(r, backoffTime));
                    }
                }
            }

            // All retries failed
            console.error('Overpass: All servers failed after retries');
            reject(lastError || new Error('All Overpass servers unavailable'));
        }).catch(reject);
    });
}

/**
 * Get tourist attractions around a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters (default: 5000)
 * @param {string} category - Optional category filter
 * @param {number} limit - Maximum number of results (default: 20)
 * @returns {Promise<Array>} Array of transformed places
 */
export async function getAttractions(lat, lon, radius = 5000, category = null, limit = 20) {
    try {
        const query = buildAttractionQuery(lat, lon, radius, category);
        const elements = await executeOverpassQuery(query);

        // Filter elements with names
        const namedElements = elements.filter(el => el.tags?.name);

        // Sort by popularity (presence of wikidata, wikipedia indicates popularity)
        namedElements.sort((a, b) => {
            const scoreA = (a.tags?.wikidata ? 2 : 0) + (a.tags?.wikipedia ? 1 : 0);
            const scoreB = (b.tags?.wikidata ? 2 : 0) + (b.tags?.wikipedia ? 1 : 0);
            return scoreB - scoreA;
        });

        // Transform places (with rate limiting for Wikidata)
        const places = [];
        for (let i = 0; i < Math.min(namedElements.length, limit); i++) {
            const place = await transformOverpassPlace(namedElements[i], i);
            places.push(place);

            // Small delay between Wikidata requests
            if (namedElements[i].tags?.wikidata && i < limit - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return places;
    } catch (error) {
        console.error('Error getting attractions:', error);
        throw error;
    }
}

/**
 * Get nearby places (simplified, faster query)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters (default: 2000)
 * @param {number} limit - Maximum results (default: 10)
 * @returns {Promise<Array>} Array of nearby places
 */
export async function getNearbyPlaces(lat, lon, radius = 2000, limit = 10) {
    try {
        const query = buildNearbyQuery(lat, lon, radius);
        const elements = await executeOverpassQuery(query);

        // Filter and sort
        const namedElements = elements
            .filter(el => el.tags?.name)
            .slice(0, limit);

        // Quick transform without Wikidata images
        const places = namedElements.map((el, i) => {
            const tags = el.tags || {};
            const category = determineCategory(tags);

            return {
                id: `osm_${el.type}_${el.id}`,
                name: tags.name || 'Unknown Place',
                category: category,
                coordinates: {
                    lat: el.lat || el.center?.lat,
                    lng: el.lon || el.center?.lon
                },
                thumbnail: defaultThumbnails[category]
            };
        });

        return places;
    } catch (error) {
        console.error('Error getting nearby places:', error);
        return [];
    }
}

/**
 * Search places by name in an area
 * @param {string} searchQuery - Search term
 * @param {number} lat - Center latitude
 * @param {number} lon - Center longitude
 * @param {number} radius - Search radius in meters
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Matching places
 */
export async function searchPlaces(searchQuery, lat, lon, radius = 10000, limit = 15) {
    try {
        const query = `
            [out:json][timeout:30];
            (
                node["name"~"${searchQuery}",i]["tourism"](around:${radius},${lat},${lon});
                way["name"~"${searchQuery}",i]["tourism"](around:${radius},${lat},${lon});
                node["name"~"${searchQuery}",i]["historic"](around:${radius},${lat},${lon});
                way["name"~"${searchQuery}",i]["historic"](around:${radius},${lat},${lon});
                node["name"~"${searchQuery}",i]["amenity"="place_of_worship"](around:${radius},${lat},${lon});
                way["name"~"${searchQuery}",i]["amenity"="place_of_worship"](around:${radius},${lat},${lon});
                node["name"~"${searchQuery}",i]["leisure"="park"](around:${radius},${lat},${lon});
                way["name"~"${searchQuery}",i]["leisure"="park"](around:${radius},${lat},${lon});
                node["name"~"${searchQuery}",i]["amenity"~"restaurant|cafe|marketplace"](around:${radius},${lat},${lon});
                node["name"~"${searchQuery}",i]["shop"](around:${radius},${lat},${lon});
            );
            out body center;
        `;

        const elements = await executeOverpassQuery(query);
        const namedElements = elements.filter(el => el.tags?.name).slice(0, limit);

        // Transform with limited Wikidata fetching
        const places = [];
        for (let i = 0; i < namedElements.length; i++) {
            // Only fetch Wikidata for first 5 results
            if (i < 5 && namedElements[i].tags?.wikidata) {
                const place = await transformOverpassPlace(namedElements[i], i);
                places.push(place);
                await new Promise(resolve => setTimeout(resolve, 50));
            } else {
                // Quick transform
                const el = namedElements[i];
                const tags = el.tags || {};
                const category = determineCategory(tags);

                places.push({
                    id: `osm_${el.type}_${el.id}`,
                    osmId: el.id,
                    name: tags.name || 'Unknown Place',
                    category: category,
                    thumbnail: defaultThumbnails[category],
                    priority: determinePriority(tags),
                    scheduledDay: null,
                    scheduledTime: null,
                    duration: estimateDuration(category, tags),
                    coordinates: {
                        lat: el.lat || el.center?.lat,
                        lng: el.lon || el.center?.lon
                    },
                    openingHours: parseOpeningHours(tags.opening_hours),
                    description: tags.description || 'A point of interest.',
                    ticketPrice: tags.fee || 'Contact venue',
                    website: tags.website || null,
                    hasConflict: false,
                    conflictReason: null,
                    tips: []
                });
            }
        }

        return places;
    } catch (error) {
        console.error('Error searching places:', error);
        throw error;
    }
}

/**
 * Get place details by OSM ID
 * @param {string} osmType - 'node', 'way', or 'relation'
 * @param {number} osmId - OSM ID
 * @returns {Promise<Object>} Place details
 */
export async function getPlaceDetails(osmType, osmId) {
    try {
        const query = `
            [out:json][timeout:10];
            ${osmType}(${osmId});
            out body center;
        `;

        const elements = await executeOverpassQuery(query);

        if (elements.length > 0) {
            return await transformOverpassPlace(elements[0]);
        }

        return null;
    } catch (error) {
        console.error('Error getting place details:', error);
        throw error;
    }
}

/**
 * Get attractions for a city name
 * @param {string} cityName - Name of the city
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of places
 */
export async function getAttractionsForCity(cityName, limit = 20) {
    try {
        // First, get city coordinates using Nominatim
        const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ', India')}&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'DeepShivaTourism/1.0'
                }
            }
        );

        if (!geoResponse.ok) {
            throw new Error('Failed to geocode city');
        }

        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            throw new Error(`City not found: ${cityName}`);
        }

        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);

        // Get attractions around the city
        return await getAttractions(lat, lon, 10000, null, limit);
    } catch (error) {
        console.error('Error getting attractions for city:', error);
        throw error;
    }
}

// Export utilities
export const CATEGORY_ICONS = categoryIcons;
export const CATEGORY_COLORS = categoryColors;
export const DEFAULT_THUMBNAILS = defaultThumbnails;

export default {
    getAttractions,
    getNearbyPlaces,
    searchPlaces,
    getPlaceDetails,
    getAttractionsForCity,
    CATEGORY_ICONS,
    CATEGORY_COLORS,
    DEFAULT_THUMBNAILS
};
