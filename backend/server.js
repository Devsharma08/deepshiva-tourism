require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Amadeus = require('amadeus');
const { createApi } = require('unsplash-js');
const axios = require('axios'); // Required for OSRM

const app = express();
app.use(cors());
app.use(express.json());

// Initialize APIs
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: require('node-fetch')
});

// --- HELPER: Dynamic Image Fetcher ---
const imageCache = new Map();
const getDynamicImage = async (query) => {
  if (imageCache.has(query)) return imageCache.get(query);
  try {
    const result = await unsplash.search.getPhotos({
      query: `${query} travel landscape`,
      perPage: 1,
      orientation: 'landscape'
    });
    if (result.response?.results?.length > 0) {
      const url = result.response.results[0].urls.regular;
      imageCache.set(query, url);
      return url;
    }
  } catch (error) {
    console.error('Unsplash Error:', error.message);
  }
  return null; // Return null if no image, UI should handle placeholder
};

// --- API 1: REAL-TIME HOTEL SEARCH ---
// --- HELPER: Common City Mappings ---
const CITY_TO_CODE = {
    'DELHI': 'DEL',
    'NEW DELHI': 'DEL',
    'MUMBAI': 'BOM',
    'BOMBAY': 'BOM',
    'BANGALORE': 'BLR',
    'BENGALURU': 'BLR',
    'CHENNAI': 'MAA',
    'MADRAS': 'MAA',
    'KOLKATA': 'CCU',
    'CALCUTTA': 'CCU',
    'HYDERABAD': 'HYD',
    'GOA': 'GOI',
    'JAIPUR': 'JAI',
    'PUNE': 'PNQ',
    'AHMEDABAD': 'AMD'
};
// --- API 2: HOTEL SEARCH (ROBUST MERGE STRATEGY) ---
app.get('/api/hotels/search', async (req, res) => {
  try {
    let { cityCode } = req.query;

    // 1. Validation & Auto-Correction
    if (!cityCode) return res.status(400).json({ error: 'City required' });
    cityCode = cityCode.toUpperCase().trim();
    if (CITY_TO_CODE[cityCode]) cityCode = CITY_TO_CODE[cityCode];
    if (cityCode.length !== 3) return res.status(400).json({ error: 'Invalid City Code' });

    console.log(`🏨 Step 1: Finding hotels in city: ${cityCode}`);

    // STEP 1: Get Basic Hotel Details (Reference Data)
    const hotelListResponse = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode
    });

    if (!hotelListResponse.data || hotelListResponse.data.length === 0) {
        return res.json({ hotels: [] });
    }

    // Limit to 10 hotels for performance
    const rawHotels = hotelListResponse.data.slice(0, 10);
    const hotelIds = rawHotels.map(h => h.hotelId);

    console.log(`🏨 Step 2: Checking availability for ${hotelIds.length} hotels...`);

    // STEP 2: Try to get Prices (Shopping Data)
    let offerMap = new Map();
    try {
        const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: hotelIds.join(','),
            adults: '1'
        });
        
        // Map offers by Hotel ID for easy lookup
        if (offersResponse.data) {
            offersResponse.data.forEach(offer => {
                offerMap.set(offer.hotel.hotelId, offer);
            });
        }
    } catch (err) {
        console.warn("⚠️ Price fetch failed (likely no availability in Test Tier). Showing basic details.");
    }

    // STEP 3: MERGE Data (Basic + Price)
    const processedHotels = await Promise.all(rawHotels.map(async (baseHotel) => {
        const offer = offerMap.get(baseHotel.hotelId);
        
        // Get Image
        let image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
        try { image = await getDynamicImage(baseHotel.name); } catch(e) {}

        // Construct Final Object
        return {
            id: baseHotel.hotelId,
            name: baseHotel.name,
            location: {
                lat: baseHotel.geoCode.latitude,
                lng: baseHotel.geoCode.longitude,
                address: baseHotel.address?.countryCode || 'Address unavailable'
            },
            rating: baseHotel.rating || 'N/A',
            // If offer exists, show price. If not, show "Sold Out" or "N/A"
            price: offer?.offers?.[0]?.price?.total || null, 
            currency: offer?.offers?.[0]?.price?.currency || 'INR',
            available: !!offer, // Boolean flag for UI
            image: image
        };
    }));

    console.log(`✅ Rendering ${processedHotels.length} hotels (Available: ${offerMap.size})`);
    res.json({ hotels: processedHotels });

  } catch (error) {
    console.error("❌ HOTEL API ERROR:", error.message);
    res.json({ hotels: [] });
  }
});

// --- API 2: FLIGHT SEARCH ---
app.get('/api/flights/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    
    const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: '1',
        max: 10
    });

    // Fetch destination image
    const destImage = await getDynamicImage(destination);

    const flights = response.data.map(flight => {
        const segment = flight.itineraries[0].segments[0];
        const lastSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
        
        return {
            id: flight.id,
            airlineCode: segment.carrierCode,
            flightNumber: `${segment.carrierCode} ${segment.number}`,
            departure: {
                iata: segment.departure.iataCode,
                at: segment.departure.at
            },
            arrival: {
                iata: lastSegment.arrival.iataCode,
                at: lastSegment.arrival.at
            },
            duration: flight.itineraries[0].duration.replace('PT', ''),
            price: flight.price.total,
            currency: flight.price.currency,
            // We pass the full raw object for the "Confirm" step if needed
            rawOffer: JSON.stringify(flight) 
        };
    });

    res.json({ flights, destinationImage: destImage });
  } catch (error) {
    console.error('Flight Search Error:', error);
    res.status(500).json({ error: 'Flight data unavailable' });
  }
});

// --- API 3: FLIGHT PRICING (DETAILS) ---
// Note: Amadeus Pricing requires POSTing the flight offer found in search
app.post('/api/flights/confirm', async (req, res) => {
    try {
        const { flightOffer } = req.body; // Expects the raw offer object from search
        
        const response = await amadeus.shopping.flightOffers.pricing.post({
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [JSON.parse(flightOffer)]
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Could not confirm flight price' });
    }
});

// --- API 4: OSRM ROUTING (Interactive Map) ---
app.post('/api/route', async (req, res) => {
    try {
        // Format: { userLocation: {lat, lng}, destLocation: {lat, lng} }
        const { userLocation, destLocation } = req.body;
        
        if(!userLocation || !destLocation) return res.status(400).send('Coords required');

        // OSRM expects: longitude,latitude;longitude,latitude
        const coordinates = `${userLocation.lng},${userLocation.lat};${destLocation.lng},${destLocation.lat}`;
        
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
        
        const response = await axios.get(osrmUrl);
        
        if (response.data.code !== 'Ok') throw new Error('Route not found');

        const route = response.data.routes[0];
        
        res.json({
            duration: Math.round(route.duration / 60), // Seconds to Minutes
            distance: (route.distance / 1000).toFixed(1), // Meters to KM
            geometry: route.geometry // GeoJSON LineString
        });

    } catch (error) {
        console.error('OSRM Error:', error.message);
        res.status(500).json({ error: 'Routing failed' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));