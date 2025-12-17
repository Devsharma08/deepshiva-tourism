/**
 * OpenTripMap API Service
 * Provides access to worldwide tourist attractions and facilities
 * API Documentation: https://opentripmap.io/docs
 */

const API_KEY = '5ae2e3f221c38a28845f05b64362e0058281eced91bdc5e3ca12a51c';
const BASE_URL = 'https://api.opentripmap.com/0.1';

// Category mapping from OpenTripMap to our app categories
const categoryMapping = {
    'architecture': 'landmark',
    'historic': 'landmark',
    'cultural': 'museum',
    'museums': 'museum',
    'theatres_and_entertainments': 'entertainment',
    'amusements': 'entertainment',
    'natural': 'park',
    'beaches': 'beach',
    'religion': 'temple',
    'shops': 'shopping',
    'foods': 'restaurant',
    'accomodations': 'hotel',
    'sport': 'adventure',
    'other': 'landmark'
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
    adventure: '🏃'
};

/**
 * Get geoname (location data) by name
 * @param {string} name - Location name to search
 * @param {string} lang - Language code (default: 'en')
 * @returns {Promise<Object>} Location data with coordinates
 */
export async function getGeoname(name, lang = 'en') {
    try {
        const response = await fetch(
            `${BASE_URL}/${lang}/places/geoname?name=${encodeURIComponent(name)}&apikey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching geoname:', error);
        throw error;
    }
}

/**
 * Get places within a radius of coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters (default: 5000m = 5km)
 * @param {string} kinds - Types of places to search (comma-separated)
 * @param {string} lang - Language code
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of places
 */
export async function getPlacesRadius(lat, lon, radius = 5000, kinds = '', lang = 'en', limit = 20) {
    try {
        let url = `${BASE_URL}/${lang}/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&apikey=${API_KEY}&limit=${limit}&rate=2`;

        if (kinds) {
            url += `&kinds=${kinds}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.features || [];
    } catch (error) {
        console.error('Error fetching places by radius:', error);
        throw error;
    }
}

/**
 * Get places within a bounding box
 * @param {number} lonMin - Minimum longitude
 * @param {number} lonMax - Maximum longitude
 * @param {number} latMin - Minimum latitude
 * @param {number} latMax - Maximum latitude
 * @param {string} kinds - Types of places to search
 * @param {string} lang - Language code
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of places
 */
export async function getPlacesBBox(lonMin, lonMax, latMin, latMax, kinds = '', lang = 'en', limit = 50) {
    try {
        let url = `${BASE_URL}/${lang}/places/bbox?lon_min=${lonMin}&lon_max=${lonMax}&lat_min=${latMin}&lat_max=${latMax}&apikey=${API_KEY}&limit=${limit}`;

        if (kinds) {
            url += `&kinds=${kinds}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.features || [];
    } catch (error) {
        console.error('Error fetching places by bbox:', error);
        throw error;
    }
}

/**
 * Get detailed information about a specific place
 * @param {string} xid - Place identifier
 * @param {string} lang - Language code
 * @returns {Promise<Object>} Place details
 */
export async function getPlaceDetails(xid, lang = 'en') {
    try {
        const response = await fetch(
            `${BASE_URL}/${lang}/places/xid/${xid}?apikey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
    }
}

/**
 * Search places by text (uses autosuggest endpoint)
 * @param {string} query - Search query
 * @param {number} lat - Reference latitude (for relevance sorting)
 * @param {number} lon - Reference longitude
 * @param {number} radius - Search radius in meters
 * @param {string} lang - Language code
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Matching places
 */
export async function searchPlaces(query, lat = 20.5937, lon = 78.9629, radius = 50000, lang = 'en', limit = 10) {
    try {
        const response = await fetch(
            `${BASE_URL}/${lang}/places/autosuggest?name=${encodeURIComponent(query)}&lon=${lon}&lat=${lat}&radius=${radius}&apikey=${API_KEY}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.features || [];
    } catch (error) {
        console.error('Error searching places:', error);
        throw error;
    }
}

/**
 * Transform OpenTripMap place to our app format
 * @param {Object} place - OpenTripMap place object
 * @param {Object} details - Optional detailed place info
 * @returns {Object} Transformed place object
 */
export function transformPlace(place, details = null) {
    const props = place.properties || place;
    const geometry = place.geometry || {};
    const coords = geometry.coordinates || [props.lon || 0, props.lat || 0];

    // Determine category from kinds
    let category = 'landmark';
    const kinds = props.kinds || '';
    for (const [apiKind, appCategory] of Object.entries(categoryMapping)) {
        if (kinds.includes(apiKind)) {
            category = appCategory;
            break;
        }
    }

    // Generate thumbnail from Wikimedia if available, or use placeholder
    let thumbnail = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400';
    if (details?.preview?.source) {
        thumbnail = details.preview.source;
    } else if (details?.image) {
        thumbnail = details.image;
    }

    // Estimate duration based on category
    const durationByCategory = {
        landmark: 90,
        museum: 120,
        park: 60,
        restaurant: 90,
        shopping: 120,
        hotel: 0,
        temple: 60,
        beach: 180,
        entertainment: 120,
        adventure: 180
    };

    return {
        id: `otm_${props.xid || props.osm || Date.now()}`,
        xid: props.xid,
        name: props.name || 'Unknown Place',
        category: category,
        thumbnail: thumbnail,
        priority: props.rate >= 3 ? 'must-visit' : 'optional',
        scheduledDay: null,
        scheduledTime: null,
        duration: durationByCategory[category] || 60,
        coordinates: {
            lat: coords[1] || props.lat,
            lng: coords[0] || props.lon
        },
        openingHours: details?.opening_hours || '09:00 - 18:00',
        description: details?.wikipedia_extracts?.text ||
            details?.info?.descr ||
            props.kinds?.split(',').slice(0, 3).join(', ') ||
            'A point of interest worth visiting.',
        ticketPrice: details?.fee || 'Contact venue for pricing',
        website: details?.url || details?.wikipedia || null,
        hasConflict: false,
        conflictReason: null,
        tips: [],
        rating: props.rate || 0,
        wikidata: props.wikidata,
        osmId: props.osm
    };
}

/**
 * Get places for a city/location with enriched details
 * @param {string} locationName - City or location name
 * @param {string} kinds - Types of places (default: interesting places)
 * @param {number} limit - Maximum number of places
 * @returns {Promise<Array>} Array of transformed places
 */
export async function getPlacesForLocation(locationName, kinds = 'interesting_places', limit = 15) {
    try {
        // First, get the location coordinates
        const geoData = await getGeoname(locationName);

        if (!geoData || !geoData.lat || !geoData.lon) {
            console.warn('Could not find location:', locationName);
            return [];
        }

        // Get places within radius of the location
        const places = await getPlacesRadius(
            geoData.lat,
            geoData.lon,
            10000, // 10km radius
            kinds,
            'en',
            limit
        );

        // Fetch details for top places (rate limiting - only first 5)
        const enrichedPlaces = await Promise.all(
            places.slice(0, 10).map(async (place, index) => {
                // Add small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, index * 100));

                try {
                    const details = await getPlaceDetails(place.properties.xid);
                    return transformPlace(place, details);
                } catch (error) {
                    return transformPlace(place);
                }
            })
        );

        // Transform remaining places without details
        const remainingPlaces = places.slice(10).map(place => transformPlace(place));

        return [...enrichedPlaces, ...remainingPlaces];
    } catch (error) {
        console.error('Error getting places for location:', error);
        throw error;
    }
}

/**
 * Get nearby suggestions based on coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Radius in meters
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Nearby places
 */
export async function getNearbyPlaces(lat, lon, radius = 2000, limit = 5) {
    try {
        const places = await getPlacesRadius(lat, lon, radius, 'interesting_places', 'en', limit);
        return places.map(place => transformPlace(place));
    } catch (error) {
        console.error('Error getting nearby places:', error);
        return [];
    }
}

/**
 * Get popular tourist categories for India
 */
export const INDIA_CATEGORIES = {
    heritage: 'historic,architecture,cultural,museums',
    temples: 'religion',
    nature: 'natural,beaches',
    adventure: 'sport,amusements',
    shopping: 'shops,foods',
    all: 'interesting_places'
};

/**
 * Quick search for Indian cities
 */
export const POPULAR_INDIAN_CITIES = [
    { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Agra', lat: 27.1767, lon: 78.0081 },
    { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    { name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
    { name: 'Goa', lat: 15.2993, lon: 74.1240 },
    { name: 'Kerala', lat: 10.8505, lon: 76.2711 },
    { name: 'Udaipur', lat: 24.5854, lon: 73.7125 },
    { name: 'Rishikesh', lat: 30.0869, lon: 78.2676 },
    { name: 'Ladakh', lat: 34.1526, lon: 77.5771 }
];

export default {
    getGeoname,
    getPlacesRadius,
    getPlacesBBox,
    getPlaceDetails,
    searchPlaces,
    transformPlace,
    getPlacesForLocation,
    getNearbyPlaces,
    INDIA_CATEGORIES,
    POPULAR_INDIAN_CITIES,
    categoryMapping,
    categoryIcons
};
