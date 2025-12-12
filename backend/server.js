// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const Amadeus = require('amadeus');
// const axios = require('axios'); // Used for Unsplash AND OSRM

// const app = express();
// app.use(cors());
// app.use(express.json());

// // --- CONFIGURATION ---
// const PORT = 5000;
// const AMADEUS_ID = process.env.AMADEUS_CLIENT_ID;
// const AMADEUS_SECRET = process.env.AMADEUS_CLIENT_SECRET;
// const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// if (!AMADEUS_ID || !AMADEUS_SECRET || !UNSPLASH_KEY) {
//     console.error("❌ CRITICAL: Missing API Keys in .env file");
// }

// // Initialize Amadeus
// const amadeus = new Amadeus({
//   clientId: AMADEUS_ID,
//   clientSecret: AMADEUS_SECRET,
//   logLevel: 'silent'
// });

// // --- HELPER: Dynamic Image Fetcher (Axios Version) ---
// const imageCache = new Map();

// const getDynamicImage = async (query) => {
//   if (imageCache.has(query)) return imageCache.get(query);

//   // Fallback if no Unsplash key
//   if (!UNSPLASH_KEY) return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800';

//   try {
//     // Direct call to Unsplash API via Axios (Bypasses library issues)
//     const response = await axios.get('https://api.unsplash.com/search/photos', {
//       params: { 
//         query: `${query} travel landmark`, 
//         per_page: 1, 
//         orientation: 'landscape' 
//       },
//       headers: { 
//         Authorization: `Client-ID ${UNSPLASH_KEY}` 
//       }
//     });

//     if (response.data.results && response.data.results.length > 0) {
//       const url = response.data.results[0].urls.regular;
//       imageCache.set(query, url);
//       return url;
//     }
//   } catch (error) {
//     // Log error but don't crash - return fallback
//     console.error(`📸 Unsplash Error for ${query}:`, error.response?.status || error.message);
//   }

//   return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800';
// };

// // --- HELPER: Common City Mappings ---
// const CITY_TO_CODE = {
//     'DELHI': 'DEL', 'NEW DELHI': 'DEL',
//     'MUMBAI': 'BOM', 'BOMBAY': 'BOM',
//     'BANGALORE': 'BLR', 'BENGALURU': 'BLR',
//     'CHENNAI': 'MAA', 'MADRAS': 'MAA',
//     'KOLKATA': 'CCU', 'CALCUTTA': 'CCU',
//     'HYDERABAD': 'HYD',
//     'GOA': 'GOI',
//     'JAIPUR': 'JAI',
//     'PUNE': 'PNQ',
//     'AHMEDABAD': 'AMD'
// };

// // --- API 1: HOTEL SEARCH ---
// app.get('/api/hotels/search', async (req, res) => {
//   try {
//     let { cityCode } = req.query;

//     if (!cityCode) return res.status(400).json({ error: 'City required' });
//     cityCode = cityCode.toUpperCase().trim();
//     if (CITY_TO_CODE[cityCode]) cityCode = CITY_TO_CODE[cityCode];
    
//     if (cityCode.length !== 3) {
//          return res.status(400).json({ error: 'Please enter a valid City Code (e.g. DEL)' });
//     }

//     console.log(`🏨 Step 1: Finding hotels in city: ${cityCode}`);

//     // STRATEGY: Try Reference Data first. If that fails/empty, we can't do much in Test Tier without Coordinates.
//     // In production, you'd use a Geocoding API to turn "DEL" into Lat/Long.
//     // For now, we will use the standard "By City" call but handle errors gracefully.

//     let rawHotels = [];
//     try {
//         const hotelListResponse = await amadeus.referenceData.locations.hotels.byCity.get({
//             cityCode: cityCode
//         });
//         if (hotelListResponse.data) {
//             rawHotels = hotelListResponse.data.slice(0, 8); // Limit to 8
//         }
//     } catch (error) {
//         console.warn("⚠️ Step 1 (Reference Data) failed:", error.response?.result?.errors?.[0]?.detail || error.message);
//         // If Step 1 fails, we return empty immediately because we need Hotel IDs for Step 2
//         return res.json({ hotels: [] });
//     }

//     if (rawHotels.length === 0) {
//         console.log("No hotels found in Step 1.");
//         return res.json({ hotels: [] });
//     }

//     const hotelIds = rawHotels.map(h => h.hotelId);
//     console.log(`🏨 Step 2: Checking availability for ${hotelIds.length} hotels...`);

//     // STEP 2: Get Prices (Shopping Data)
//     let offerMap = new Map();
//     try {
//         const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
//             hotelIds: hotelIds.join(','),
//             adults: '1'
//         });
        
//         if (offersResponse.data) {
//             offersResponse.data.forEach(offer => {
//                 offerMap.set(offer.hotel.hotelId, offer);
//             });
//         }
//     } catch (err) {
//         // Log but CONTINUE. We want to show the hotels even if prices fail.
//         console.warn("⚠️ Price fetch warning (Test Tier Limit):", err.message);
//     }

//     // STEP 3: MERGE Data
//     const processedHotels = await Promise.all(rawHotels.map(async (baseHotel) => {
//         const offer = offerMap.get(baseHotel.hotelId);
//         let image = await getDynamicImage(baseHotel.name);

//         return {
//             id: baseHotel.hotelId,
//             name: baseHotel.name,
//             location: {
//                 lat: baseHotel.geoCode?.latitude || 0,
//                 lng: baseHotel.geoCode?.longitude || 0,
//                 address: baseHotel.address?.countryCode || 'India'
//             },
//             rating: baseHotel.rating || '4.0',
//             price: offer?.offers?.[0]?.price?.total || null, 
//             currency: offer?.offers?.[0]?.price?.currency || 'INR',
//             image: image
//         };
//     }));

//     console.log(`✅ Returned ${processedHotels.length} hotels`);
//     res.json({ hotels: processedHotels });

//   } catch (error) {
//     console.error("❌ HOTEL API CRITICAL ERROR:", error.message);
//     // Return empty array so frontend doesn't break
//     res.json({ hotels: [] });
//   }
// });

// // --- API 2: FLIGHT SEARCH (Detailed) ---
// app.get('/api/flights/search', async (req, res) => {
//   try {
//     const { origin, destination, date } = req.query;
//     console.log(`✈️ Searching flights: ${origin} -> ${destination} on ${date}`);
    
//     const response = await amadeus.shopping.flightOffersSearch.get({
//         originLocationCode: origin,
//         destinationLocationCode: destination,
//         departureDate: date,
//         adults: '1',
//         max: 10
//     });

//     // console.log(response);
    

//     if (!response.data) return res.json({ flights: [] });

//     // Extract Dictionaries (Crucial for Airline Names)
//     const dictionaries = response.result.dictionaries || {};

//     const flights = response.data.map(flight => {
//         const itinerary = flight.itineraries[0];
//         const segments = itinerary.segments;
        
//         // Process every segment
//         const processedSegments = segments.map(seg => {
//             return {
//                 id: seg.id,
//                 departure: seg.departure,
//                 arrival: seg.arrival,
//                 carrierCode: seg.carrierCode,
//                 carrierName: dictionaries.carriers?.[seg.carrierCode] || seg.carrierCode,
//                 flightNumber: seg.number,
//                 aircraftCode: seg.aircraft.code,
//                 aircraftName: dictionaries.aircraft?.[seg.aircraft.code] || seg.aircraft.code,
//                 duration: seg.duration.replace('PT', '').toLowerCase()
//             };
//         });

//         return {
//             id: flight.id,
//             totalPrice: flight.price.total,
//             currency: flight.price.currency,
//             basePrice: flight.price.base,
//             segments: processedSegments,
//             totalDuration: itinerary.duration.replace('PT', '').toLowerCase(),
//             baggage: flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags || { quantity: 0 },
//             cabin: flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
//             rawOffer: flight 
//         };
//     });

//     res.json({ flights });
//   } catch (error) {
//     console.error('Flight Search Error:', error.response?.result?.errors || error.message);
//     res.status(500).json({ error: 'Flight data unavailable' });
//   }
// });

// // --- API 3: OSRM ROUTING ---
// app.post('/api/route', async (req, res) => {
//     try {
//         const { userLocation, destLocation } = req.body;
//         if(!userLocation || !destLocation) return res.status(400).send('Coords required');

//         const coordinates = `${userLocation.lng},${userLocation.lat};${destLocation.lng},${destLocation.lat}`;
//         const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
        
//         const response = await axios.get(osrmUrl);
        
//         if (response.data.code !== 'Ok') throw new Error('Route not found');

//         const route = response.data.routes[0];
        
//         res.json({
//             duration: Math.round(route.duration / 60), 
//             distance: (route.distance / 1000).toFixed(1), 
//             geometry: route.geometry 
//         });

//     } catch (error) {
//         console.error('OSRM Error:', error.message);
//         res.status(500).json({ error: 'Routing failed' });
//     }
// });

// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const Amadeus = require('amadeus');
// const axios = require('axios');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // --- CONFIGURATION ---
// const PORT = 5000;
// const AMADEUS_ID = process.env.AMADEUS_CLIENT_ID;
// const AMADEUS_SECRET = process.env.AMADEUS_CLIENT_SECRET;
// const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
// const LOCATIONIQ_KEY = process.env.LOCATIONIQ_KEY;

// if (!AMADEUS_ID || !LOCATIONIQ_KEY) {
//     console.error("❌ CRITICAL: Missing API Keys in .env file");
// }

// // Initialize Amadeus
// const amadeus = new Amadeus({
//   clientId: AMADEUS_ID,
//   clientSecret: AMADEUS_SECRET,
//   logLevel: 'silent'
// });

// // --- HELPER 1: Dynamic Image Fetcher ---
// const imageCache = new Map();
// const getDynamicImage = async (query) => {
//   if (imageCache.has(query)) return imageCache.get(query);
//   // Default fallback if Unsplash key is missing or fails
//   const fallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  
//   if (!UNSPLASH_KEY) return fallback;

//   try {
//     const response = await axios.get('https://api.unsplash.com/search/photos', {
//       params: { query: `${query} hotel resort`, per_page: 1, orientation: 'landscape' },
//       headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
//     });
//     if (response.data.results && response.data.results.length > 0) {
//       const url = response.data.results[0].urls.regular;
//       imageCache.set(query, url);
//       return url;
//     }
//   } catch (error) {
//     // console.warn("Unsplash Limit Hit or Error");
//   }
//   return fallback;
// };

// // --- HELPER 2: Price Generators ---
// const getFakePrice = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     const price = (Math.abs(hash) % 8000) + 2000; 
//     return Math.ceil(price / 50) * 50; 
// };

// const getFakeRating = (str) => {
//     const val = (str.length % 15) + 35; 
//     return (val / 10).toFixed(1); 
// };


// // --- API 1: AIRPORT AUTOCOMPLETE (NEW - Fixes the 3-letter code issue) ---
// app.get('/api/airports', async (req, res) => {
//     try {
//         const { keyword } = req.query;
//         if (!keyword || keyword.length < 2) return res.json({ airports: [] });

//         const response = await amadeus.referenceData.locations.get({
//             keyword: keyword,
//             subType: 'AIRPORT', // Strictly airports
//             'page[limit]': 5
//         });

//         const airports = response.data.map(loc => ({
//             name: loc.name,
//             iata: loc.iataCode, // This is what we need (e.g., DEL)
//             city: loc.address.cityName,
//             country: loc.address.countryName
//         }));

//         res.json({ airports });
//     } catch (error) {
//         console.error("Airport API Error:", error.message);
//         res.json({ airports: [] });
//     }
// });


// // --- API 2: FLIGHT SEARCH (Updated Validation) ---
// app.get('/api/flights/search', async (req, res) => {
//     try {
//         const { origin, destination, date } = req.query;
        
//         // Validation: Amadeus crashes if codes aren't 3 letters
//         if (!origin || !destination || origin.length !== 3 || destination.length !== 3) {
//             console.error(`❌ Invalid Codes: Origin=${origin}, Dest=${destination}`);
//             return res.status(400).json({ error: 'Origin and Destination must be 3-letter IATA codes (e.g., DEL, BOM)' });
//         }

//         console.log(`✈️ Searching flights: ${origin} -> ${destination}`);

//         const response = await amadeus.shopping.flightOffersSearch.get({
//             originLocationCode: origin,
//             destinationLocationCode: destination,
//             departureDate: date,
//             adults: '1',
//             max: 10
//         });

//         if (!response.data) return res.json({ flights: [] });

//         const dictionaries = response.result.dictionaries || {};
//         const flights = response.data.map(flight => {
//             const segment = flight.itineraries[0].segments[0];
//             return {
//                 id: flight.id,
//                 totalPrice: parseFloat(flight.price.total),
//                 currency: flight.price.currency,
//                 airline: dictionaries.carriers?.[segment.carrierCode] || segment.carrierCode,
//                 flightNumber: segment.carrierCode + segment.number,
//                 departure: segment.departure,
//                 arrival: segment.arrival,
//                 duration: flight.itineraries[0].duration.replace('PT', '').toLowerCase()
//             };
//         });

//         res.json({ flights });
//     } catch (error) {
//         console.error('✈️ Flight API Error:', error.response?.result?.errors?.[0]?.detail || error.message);
//         res.status(500).json({ error: 'Flight search failed' });
//     }
// });


// // --- API 3: HOTEL SEARCH (Fixed 429 Errors + Pagination) ---
// app.get('/api/hotels/search', async (req, res) => {
//   try {
//     const { city, page = 1 } = req.query;
//     if (!city) return res.status(400).json({ error: 'City required' });

//     console.log(`🏨 Searching hotels in: ${city}`);

//     // Step A: Nominatim (Geocoding)
//     const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
//     // FIX: User-Agent is REQUIRED by Nominatim to avoid blocks
//     const geoRes = await axios.get(geoUrl, { headers: { 'User-Agent': 'TravelApp_Student_Project/1.0' } });

//     if (!geoRes.data || geoRes.data.length === 0) return res.json({ hotels: [] });

//     const { lat, lon, osm_id } = geoRes.data[0];
//     const areaId = osm_id + 3600000000; 

//     // Step B: Overpass API
//     // FIX: Optimized Query (Only Nodes) to prevent 504 Timeouts
//     const overpassQuery = `
//       [out:json][timeout:15];
//       area(${areaId})->.searchArea;
//       node["tourism"="hotel"](area.searchArea);
//       out body 30; 
//     `;
//     // Note: "out body 30" limits result at source to prevent huge payloads causing crashes

//     const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
//     const hotelRes = await axios.get(overpassUrl);
//     const rawData = hotelRes.data.elements || [];

//     // Step C: Processing & Pagination
//     // 1. Filter valid hotels
//     const validHotels = rawData.filter(h => h.tags && h.tags.name);

//     // 2. Pagination Logic (Slice the array)
//     const LIMIT = 10;
//     const startIndex = (page - 1) * LIMIT;
//     const paginatedItems = validHotels.slice(startIndex, startIndex + LIMIT);

//     // 3. Enhance with Images/Price
//     const processedHotels = await Promise.all(paginatedItems.map(async (h) => {
//         const name = h.tags.name;
//         const image = await getDynamicImage(name); 

//         return {
//           id: h.id,
//           name: name,
//           location: {
//             lat: h.lat || lat, 
//             lng: h.lon || lon,
//             address: h.tags['addr:street'] || city
//           },
//           rating: getFakeRating(name),
//           price: getFakePrice(name + city),
//           currency: 'INR',
//           image: image
//         };
//       })
//     );

//     console.log(`✅ Found ${processedHotels.length} hotels (Page ${page})`);
//     res.json({ hotels: processedHotels, total: validHotels.length });

//   } catch (error) {
//     console.error("❌ Hotel Search Error:", error.message);
//     // If Overpass fails, return empty list instead of crashing
//     res.json({ hotels: [] });
//   }
// });


// // --- API 4: REAL ROUTING (LocationIQ) ---
// app.post('/api/route', async (req, res) => {
//     try {
//         const { userLocation, destLocation } = req.body;
//         if(!userLocation || !destLocation) return res.status(400).send('Coords required');

//         const coordsString = `${userLocation.lng},${userLocation.lat};${destLocation.lng},${destLocation.lat}`;
//         console.log("🚗 Fetching route...");
        
//         const response = await axios.get(`https://us1.locationiq.com/v1/directions/driving/${coordsString}`, {
//             params: {
//                 key: LOCATIONIQ_KEY,
//                 overview: 'full',
//                 geometries: 'geojson',
//                 steps: false
//             }
//         });

//         if (response.data.code !== 'Ok') throw new Error('Route not found');

//         const route = response.data.routes[0];
//         res.json({
//             duration: Math.round(route.duration / 60), 
//             distance: (route.distance / 1000).toFixed(1), 
//             geometry: route.geometry 
//         });

//     } catch (error) {
//         console.error('❌ Routing Error:', error.message);
//         res.status(500).json({ error: 'Routing failed' });
//     }
// });

// // --- API 5: HOTEL AUTOCOMPLETE (For "Stays" Tab) ---
// app.get('/api/suggestions', async (req, res) => {
//     try {
//         const { query } = req.query;
//         if (!query || query.length < 3) return res.json({ suggestions: [] });

//         const response = await axios.get('https://api.locationiq.com/v1/autocomplete.php', {
//             params: {
//                 key: LOCATIONIQ_KEY,
//                 q: query,
//                 limit: 5,
//                 countrycodes: 'in', 
//                 format: 'json'
//             }
//         });

//         const suggestions = response.data.map(item => ({
//             name: item.display_place,
//             subtitle: item.display_address,
//             location: { lat: item.lat, lng: item.lon }
//         }));

//         res.json({ suggestions });
//     } catch (error) {
//         res.json({ suggestions: [] });
//     }
// });

// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const Amadeus = require('amadeus');
// const axios = require('axios');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = 5000;
// const AMADEUS_ID = process.env.AMADEUS_CLIENT_ID;
// const AMADEUS_SECRET = process.env.AMADEUS_CLIENT_SECRET;
// const LOCATIONIQ_KEY = process.env.LOCATIONIQ_KEY;

// const amadeus = new Amadeus({
//   clientId: AMADEUS_ID,
//   clientSecret: AMADEUS_SECRET,
//   logLevel: 'silent'
// });

// // --- HELPER: Mock Data Generators ---
// const getAmenities = () => ['Free Wifi', 'Swimming Pool', 'Spa', 'Parking', 'Restaurant', 'Gym', 'Bar', 'Room Service'].sort(() => 0.5 - Math.random()).slice(0, 5);
// const getFakePrice = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     return (Math.abs(hash) % 8000) + 2000; 
// };

// // --- API 1: FLIGHT SEARCH (Fixed: INR Conversion) ---
// app.get('/api/flights/search', async (req, res) => {
//     try {
//         const { origin, destination, date } = req.query;
//         if (!origin || !destination) return res.json({ flights: [] });

//         const response = await amadeus.shopping.flightOffersSearch.get({
//             originLocationCode: origin,
//             destinationLocationCode: destination,
//             departureDate: date,
//             adults: '1',
//             max: 10
//         });

//         if (!response.data) return res.json({ flights: [] });

//         const dictionaries = response.result.dictionaries || {};
//         const flights = response.data.map(flight => {
//             const segment = flight.itineraries[0].segments[0];
            
//             // CURRENCY CONVERSION LOGIC
//             let price = parseFloat(flight.price.total);
//             const currency = flight.price.currency;
//             if (currency === 'EUR') price *= 90; // Approx EUR to INR
//             else if (currency === 'USD') price *= 84; // Approx USD to INR
            
//             return {
//                 id: flight.id,
//                 totalPrice: Math.round(price), // Rounded INR
//                 currency: 'INR',
//                 airline: dictionaries.carriers?.[segment.carrierCode] || segment.carrierCode,
//                 flightNumber: segment.carrierCode + segment.number,
//                 aircraft: dictionaries.aircraft?.[segment.aircraft.code] || segment.aircraft.code,
//                 departure: segment.departure,
//                 arrival: segment.arrival,
//                 duration: flight.itineraries[0].duration.replace('PT', '').toLowerCase(),
//                 segments: flight.itineraries[0].segments.length,
//                 seatsAvailable: flight.numberOfBookableSeats || Math.floor(Math.random() * 50) + 1
//             };
//         });
//         res.json({ flights });
//     } catch (error) {
//         console.error("Flight Error:", error.response?.result?.errors || error.message);
//         res.json({ flights: [] }); // Return empty array on error instead of crashing
//     }
// });

// // --- API 2: HOTEL SEARCH ---
// app.get('/api/hotels/search', async (req, res) => {
//     try {
//         const { city } = req.query;
//         if (!city) return res.json({ hotels: [] });

//         const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, { headers: { 'User-Agent': 'TravelApp/1.0' } });
//         if (!geoRes.data.length) return res.json({ hotels: [] });
        
//         const { osm_id, lat, lon } = geoRes.data[0];
//         const areaId = osm_id + 3600000000;

//         const overpassQuery = `[out:json][timeout:25];area(${areaId})->.searchArea;node["tourism"="hotel"](area.searchArea);out body 20;`;
//         const hotelRes = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        
//         const hotels = (hotelRes.data.elements || []).filter(h => h.tags.name).map(h => ({
//             id: h.id,
//             name: h.tags.name,
//             location: { lat: h.lat, lng: h.lon, address: h.tags['addr:street'] || city },
//             price: getFakePrice(h.tags.name),
//             rating: (Math.random() * 1.5 + 3.5).toFixed(1),
//             amenities: getAmenities(),
//             image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
//         }));
//         res.json({ hotels });
//     } catch (error) {
//         res.json({ hotels: [] });
//     }
// });

// // --- API 3: ROUTING ---
// app.post('/api/route', async (req, res) => {
//     try {
//         const { userLocation, destLocation } = req.body;
//         const coords = `${userLocation.lng},${userLocation.lat};${destLocation.lng},${destLocation.lat}`;
//         const url = `http://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
//         const response = await axios.get(url);
//         if (response.data.code !== 'Ok') throw new Error('No route');
        
//         const route = response.data.routes[0];
//         res.json({
//             duration: Math.round(route.duration / 60),
//             distance: (route.distance / 1000).toFixed(1),
//             geometry: route.geometry 
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Route failed' });
//     }
// });

// // --- API 4: AUTOCOMPLETE ---
// app.get('/api/suggestions', async (req, res) => {
//     try {
//         const { query } = req.query;
//         const response = await axios.get('https://api.locationiq.com/v1/autocomplete.php', {
//             params: { key: LOCATIONIQ_KEY, q: query, limit: 5, countrycodes: 'in', format: 'json' }
//         });
//         res.json({ suggestions: response.data.map(i => ({ name: i.display_place, subtitle: i.display_address })) });
//     } catch (e) { res.json({ suggestions: [] }); }
// });

// app.get('/api/airports', async (req, res) => {
//     try {
//         const { keyword } = req.query;
//         const response = await amadeus.referenceData.locations.get({ keyword, subType: 'AIRPORT', 'page[limit]': 5 });
//         res.json({ airports: response.data.map(i => ({ name: i.name, iata: i.iataCode, city: i.address.cityName })) });
//     } catch (e) { res.json({ airports: [] }); }
// });

// app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Amadeus = require('amadeus');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const AMADEUS_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const LOCATIONIQ_KEY = process.env.LOCATIONIQ_KEY;

// Init Amadeus (Mock or Real)
let amadeus;
if (!AMADEUS_ID || !AMADEUS_SECRET) {
    console.warn("⚠️ Amadeus Keys Missing. Using Mock Data.");
    amadeus = { shopping: { flightOffersSearch: { get: () => Promise.resolve({ data: [] }) } } };
} else {
    amadeus = new Amadeus({ clientId: AMADEUS_ID, clientSecret: AMADEUS_SECRET, logLevel: 'silent' });
}

// --- HELPERS ---
const getAmenities = () => ['Free Wifi', 'Swimming Pool', 'Spa', 'Parking', 'Restaurant', 'Gym', 'Bar'].sort(() => 0.5 - Math.random()).slice(0, 5);
const getFakePrice = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return (Math.abs(hash) % 8000) + 2000; 
};

// --- API 1: FLIGHT SEARCH (Strict Deduplication) ---
app.get('/api/flights/search', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        if (!origin || !destination) return res.json({ flights: [] });

        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: date,
            adults: '1',
            max: 20
        });

        if (!response.data) return res.json({ flights: [] });

        const dictionaries = response.result.dictionaries || {};
        const uniqueFlights = new Map();

        response.data.forEach(offer => {
            const segment = offer.itineraries[0].segments[0];
            const flightNum = segment.carrierCode + segment.number;
            
            // Convert Price
            let price = parseFloat(offer.price.total);
            if (offer.price.currency === 'EUR') price *= 90;
            if (offer.price.currency === 'USD') price *= 84;
            price = Math.round(price);

            // DEDUPLICATION LOGIC:
            // Key is just the Flight Number (AI101). 
            // If we have seen AI101 before, only overwrite if this new offer is CHEAPER.
            if (!uniqueFlights.has(flightNum) || price < uniqueFlights.get(flightNum).totalPrice) {
                uniqueFlights.set(flightNum, {
                    id: offer.id,
                    totalPrice: price,
                    currency: 'INR',
                    airline: dictionaries.carriers?.[segment.carrierCode] || segment.carrierCode,
                    flightNumber: flightNum,
                    aircraft: dictionaries.aircraft?.[segment.aircraft.code] || segment.aircraft.code,
                    departure: segment.departure,
                    arrival: segment.arrival,
                    duration: offer.itineraries[0].duration.replace('PT', '').toLowerCase(),
                    segments: offer.itineraries[0].segments.length,
                    seatsAvailable: offer.numberOfBookableSeats || 9
                });
            }
        });

        res.json({ flights: Array.from(uniqueFlights.values()) });

    } catch (error) {
        console.error("Flight Error");
        res.json({ flights: [] });
    }
});

// --- API 2: HOTEL SEARCH (Paginated) ---
app.get('/api/hotels/search', async (req, res) => {
    try {
        const { city, page = 1 } = req.query;
        if (!city) return res.json({ hotels: [] });

        const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, { headers: { 'User-Agent': 'TravelApp/1.0' } });
        if (!geoRes.data.length) return res.json({ hotels: [] });
        
        const { lat, lon } = geoRes.data[0];
        const radius = 25000; // 25km Radius
        
        // Optimized Overpass Query
        const overpassQuery = `[out:json][timeout:25];(node["tourism"="hotel"](around:${radius},${lat},${lon}););out body 50;`;
        const hotelRes = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        
        const allHotels = (hotelRes.data.elements || [])
            .filter(h => h.tags && h.tags.name)
            .map(h => ({
                id: h.id,
                name: h.tags.name,
                location: { lat: h.lat || lat, lng: h.lon || lon, address: h.tags['addr:street'] || city },
                price: getFakePrice(h.tags.name),
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                amenities: getAmenities(),
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
            }));

        // Manual Pagination
        const LIMIT = 10;
        const start = (page - 1) * LIMIT;
        res.json({ hotels: allHotels.slice(start, start + LIMIT) });

    } catch (error) {
        res.json({ hotels: [] });
    }
});

// --- API 3: ROUTING (Safe) ---
app.post('/api/route', async (req, res) => {
    try {
        const { userLocation, destLocation } = req.body;
        if (!userLocation?.lat || !destLocation?.lat) return res.json(null);

        const coords = `${userLocation.lng},${userLocation.lat};${destLocation.lng},${destLocation.lat}`;
        const url = `http://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
        
        const response = await axios.get(url, { timeout: 3000 });
        if (response.data.code !== 'Ok') throw new Error('No route');
        
        const route = response.data.routes[0];
        res.json({
            duration: Math.round(route.duration / 60),
            distance: (route.distance / 1000).toFixed(1),
            geometry: route.geometry 
        });
    } catch (error) {
        res.json(null);
    }
});

// --- API 4 & 5 (Autocomplete) ---
app.get('/api/airports', async (req, res) => {
    try {
        const { keyword } = req.query;
        const response = await amadeus.referenceData.locations.get({ keyword, subType: 'AIRPORT', 'page[limit]': 5 });
        res.json({ airports: response.data.map(i => ({ name: i.name, iata: i.iataCode, city: i.address.cityName })) });
    } catch (e) { res.json({ airports: [] }); }
});

app.get('/api/suggestions', async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get('https://api.locationiq.com/v1/autocomplete.php', {
            params: { key: LOCATIONIQ_KEY, q: query, limit: 5, countrycodes: 'in', format: 'json' }
        });
        res.json({ suggestions: response.data.map(i => ({ name: i.display_place, subtitle: i.display_address })) });
    } catch (e) { res.json({ suggestions: [] }); }
});

app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));