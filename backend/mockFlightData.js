// High-Quality Static Flight Mock Data
// Realistic Indian domestic and international flights

const AIRLINES = {
    'AI': { name: 'Air India', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Air_India_Logo.svg' },
    '6E': { name: 'IndiGo', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/IndiGo_Airlines_logo.svg' },
    'SG': { name: 'SpiceJet', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/SpiceJet_logo.svg' },
    'UK': { name: 'Vistara', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Vistara_Logo.svg' },
    'G8': { name: 'Go First', logo: null },
    'IX': { name: 'Air India Express', logo: null },
    'QP': { name: 'Akasa Air', logo: null },
    'I5': { name: 'AirAsia India', logo: null },
};

const AIRPORTS = {
    'DEL': { city: 'New Delhi', name: 'Indira Gandhi International', timezone: '+05:30' },
    'BOM': { city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj', timezone: '+05:30' },
    'BLR': { city: 'Bangalore', name: 'Kempegowda International', timezone: '+05:30' },
    'MAA': { city: 'Chennai', name: 'Chennai International', timezone: '+05:30' },
    'CCU': { city: 'Kolkata', name: 'Netaji Subhas Chandra Bose', timezone: '+05:30' },
    'HYD': { city: 'Hyderabad', name: 'Rajiv Gandhi International', timezone: '+05:30' },
    'GOI': { city: 'Goa', name: 'Manohar International', timezone: '+05:30' },
    'JAI': { city: 'Jaipur', name: 'Jaipur International', timezone: '+05:30' },
    'PNQ': { city: 'Pune', name: 'Pune Airport', timezone: '+05:30' },
    'AMD': { city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel', timezone: '+05:30' },
    'COK': { city: 'Kochi', name: 'Cochin International', timezone: '+05:30' },
    'TRV': { city: 'Thiruvananthapuram', name: 'Trivandrum International', timezone: '+05:30' },
    'LKO': { city: 'Lucknow', name: 'Chaudhary Charan Singh', timezone: '+05:30' },
    'IXC': { city: 'Chandigarh', name: 'Chandigarh Airport', timezone: '+05:30' },
    'VNS': { city: 'Varanasi', name: 'Lal Bahadur Shastri', timezone: '+05:30' },
    'GAU': { city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi', timezone: '+05:30' },
    'SXR': { city: 'Srinagar', name: 'Sheikh ul-Alam', timezone: '+05:30' },
    'IXZ': { city: 'Port Blair', name: 'Veer Savarkar', timezone: '+05:30' },
    'UDR': { city: 'Udaipur', name: 'Maharana Pratap', timezone: '+05:30' },
    'IXB': { city: 'Bagdogra', name: 'Bagdogra Airport', timezone: '+05:30' },
};

// Route templates with base prices and durations
const ROUTE_DATA = {
    // Major metro routes
    'DEL-BOM': { basePriceLow: 3500, basePriceHigh: 8500, durationMin: 120, durationMax: 145, frequency: 'high' },
    'DEL-BLR': { basePriceLow: 4000, basePriceHigh: 9500, durationMin: 150, durationMax: 180, frequency: 'high' },
    'DEL-MAA': { basePriceLow: 4500, basePriceHigh: 10000, durationMin: 165, durationMax: 195, frequency: 'high' },
    'DEL-CCU': { basePriceLow: 3800, basePriceHigh: 8000, durationMin: 125, durationMax: 150, frequency: 'high' },
    'DEL-HYD': { basePriceLow: 3500, basePriceHigh: 8500, durationMin: 130, durationMax: 160, frequency: 'high' },
    'BOM-BLR': { basePriceLow: 2800, basePriceHigh: 6500, durationMin: 90, durationMax: 110, frequency: 'high' },
    'BOM-DEL': { basePriceLow: 3500, basePriceHigh: 8500, durationMin: 120, durationMax: 145, frequency: 'high' },
    'BOM-CCU': { basePriceLow: 5500, basePriceHigh: 12000, durationMin: 150, durationMax: 180, frequency: 'medium' },
    'BOM-MAA': { basePriceLow: 3200, basePriceHigh: 7500, durationMin: 105, durationMax: 130, frequency: 'medium' },
    'BLR-DEL': { basePriceLow: 4000, basePriceHigh: 9500, durationMin: 150, durationMax: 180, frequency: 'high' },
    'BLR-BOM': { basePriceLow: 2800, basePriceHigh: 6500, durationMin: 90, durationMax: 110, frequency: 'high' },
    'BLR-CCU': { basePriceLow: 5000, basePriceHigh: 11000, durationMin: 160, durationMax: 190, frequency: 'medium' },

    // Tourist routes
    'DEL-GOI': { basePriceLow: 3500, basePriceHigh: 9000, durationMin: 140, durationMax: 165, frequency: 'high' },
    'BOM-GOI': { basePriceLow: 2200, basePriceHigh: 5500, durationMin: 60, durationMax: 80, frequency: 'high' },
    'DEL-JAI': { basePriceLow: 2500, basePriceHigh: 5500, durationMin: 55, durationMax: 70, frequency: 'medium' },
    'DEL-VNS': { basePriceLow: 3000, basePriceHigh: 6500, durationMin: 80, durationMax: 100, frequency: 'medium' },
    'DEL-SXR': { basePriceLow: 4500, basePriceHigh: 12000, durationMin: 85, durationMax: 105, frequency: 'medium' },
    'DEL-UDR': { basePriceLow: 3500, basePriceHigh: 8000, durationMin: 75, durationMax: 95, frequency: 'low' },
    'BLR-COK': { basePriceLow: 2500, basePriceHigh: 5500, durationMin: 55, durationMax: 75, frequency: 'medium' },
    'MAA-COK': { basePriceLow: 2200, basePriceHigh: 4800, durationMin: 70, durationMax: 90, frequency: 'medium' },
    'CCU-GAU': { basePriceLow: 2800, basePriceHigh: 6000, durationMin: 60, durationMax: 80, frequency: 'medium' },
    'CCU-IXB': { basePriceLow: 3200, basePriceHigh: 7000, durationMin: 55, durationMax: 75, frequency: 'low' },
    'DEL-IXZ': { basePriceLow: 8000, basePriceHigh: 18000, durationMin: 180, durationMax: 220, frequency: 'low' },
    'CCU-IXZ': { basePriceLow: 5500, basePriceHigh: 12000, durationMin: 120, durationMax: 150, frequency: 'low' },

    // Tier 2 city connections
    'DEL-AMD': { basePriceLow: 3000, basePriceHigh: 7000, durationMin: 85, durationMax: 105, frequency: 'medium' },
    'DEL-LKO': { basePriceLow: 2800, basePriceHigh: 6000, durationMin: 65, durationMax: 85, frequency: 'medium' },
    'DEL-IXC': { basePriceLow: 2500, basePriceHigh: 5500, durationMin: 55, durationMax: 70, frequency: 'medium' },
    'BOM-PNQ': { basePriceLow: 2000, basePriceHigh: 4500, durationMin: 50, durationMax: 65, frequency: 'high' },
    'BOM-AMD': { basePriceLow: 2200, basePriceHigh: 5000, durationMin: 70, durationMax: 90, frequency: 'medium' },
    'HYD-BLR': { basePriceLow: 2500, basePriceHigh: 5500, durationMin: 65, durationMax: 85, frequency: 'medium' },
    'HYD-MAA': { basePriceLow: 2200, basePriceHigh: 4800, durationMin: 60, durationMax: 80, frequency: 'medium' },
    'COK-TRV': { basePriceLow: 1800, basePriceHigh: 3800, durationMin: 40, durationMax: 55, frequency: 'low' },
};

// Time slots for realistic departures
const TIME_SLOTS = [
    { time: '05:30', period: 'early_morning', priceMultiplier: 0.85 },
    { time: '06:15', period: 'early_morning', priceMultiplier: 0.88 },
    { time: '07:00', period: 'morning', priceMultiplier: 0.95 },
    { time: '08:30', period: 'morning', priceMultiplier: 1.05 },
    { time: '09:45', period: 'morning', priceMultiplier: 1.10 },
    { time: '10:30', period: 'morning', priceMultiplier: 1.00 },
    { time: '11:15', period: 'midday', priceMultiplier: 0.92 },
    { time: '12:45', period: 'afternoon', priceMultiplier: 0.90 },
    { time: '14:00', period: 'afternoon', priceMultiplier: 0.88 },
    { time: '15:30', period: 'afternoon', priceMultiplier: 0.92 },
    { time: '17:00', period: 'evening', priceMultiplier: 1.08 },
    { time: '18:30', period: 'evening', priceMultiplier: 1.15 },
    { time: '19:45', period: 'evening', priceMultiplier: 1.12 },
    { time: '20:30', period: 'night', priceMultiplier: 1.05 },
    { time: '21:45', period: 'night', priceMultiplier: 0.95 },
    { time: '23:00', period: 'late_night', priceMultiplier: 0.82 },
];

const AIRCRAFT_TYPES = [
    { code: 'A320', name: 'Airbus A320', capacity: 180 },
    { code: 'A321', name: 'Airbus A321neo', capacity: 220 },
    { code: 'B738', name: 'Boeing 737-800', capacity: 189 },
    { code: 'B38M', name: 'Boeing 737 MAX 8', capacity: 178 },
    { code: 'AT76', name: 'ATR 72-600', capacity: 70 },
];

// Helper: Seeded random for consistent results
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Helper: Format duration
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins + 'm' : ''}`;
}

// Helper: Add minutes to time string
function addMinutesToTime(timeStr, minutes) {
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60) % 24;
    const newMins = totalMins % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// Helper: Check if next day
function isNextDay(departTime, arrivalTime) {
    const [dh] = departTime.split(':').map(Number);
    const [ah] = arrivalTime.split(':').map(Number);
    return ah < dh;
}

/**
 * Generate flights for a given route and date
 */
function generateFlights(origin, destination, date) {
    const routeKey = `${origin}-${destination}`;
    const reverseRouteKey = `${destination}-${origin}`;

    // Get route data (check both directions)
    let routeInfo = ROUTE_DATA[routeKey] || ROUTE_DATA[reverseRouteKey];

    // If no specific route exists, generate a generic one
    if (!routeInfo) {
        routeInfo = {
            basePriceLow: 3500,
            basePriceHigh: 9000,
            durationMin: 100,
            durationMax: 160,
            frequency: 'low'
        };
    }

    // Determine number of flights based on frequency
    const flightCounts = { high: 12, medium: 7, low: 4 };
    const numFlights = flightCounts[routeInfo.frequency] || 5;

    // Date-based seed for consistency
    const dateSeed = date ? new Date(date).getTime() : Date.now();
    const routeSeed = origin.charCodeAt(0) + destination.charCodeAt(0);

    const flights = [];
    const usedSlots = new Set();
    const airlineList = Object.keys(AIRLINES);

    for (let i = 0; i < numFlights; i++) {
        const seed = dateSeed + routeSeed + i * 1000;

        // Pick a time slot - use modulo to ensure we cycle through slots
        let slotIndex = Math.floor(seededRandom(seed + i + 1) * TIME_SLOTS.length);
        // Avoid duplicates by offsetting based on iteration
        slotIndex = (slotIndex + i) % TIME_SLOTS.length;

        const slot = TIME_SLOTS[slotIndex];

        // Pick airline based on route (weighted distribution)
        const airlineIndex = Math.floor(seededRandom(seed + 2) * airlineList.length);
        const carrierCode = airlineList[airlineIndex];
        const airline = AIRLINES[carrierCode];

        // Generate flight number
        const flightNum = 100 + Math.floor(seededRandom(seed + 3) * 900);

        // Calculate duration with variation
        const durationRange = routeInfo.durationMax - routeInfo.durationMin;
        const duration = Math.round(routeInfo.durationMin + seededRandom(seed + 4) * durationRange);

        // Calculate price with multipliers
        const priceRange = routeInfo.basePriceHigh - routeInfo.basePriceLow;
        let basePrice = routeInfo.basePriceLow + seededRandom(seed + 5) * priceRange;
        basePrice = basePrice * slot.priceMultiplier;

        // Day of week adjustment (weekends more expensive)
        const dateObj = date ? new Date(date) : new Date();
        const dayOfWeek = dateObj.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            basePrice *= 1.15; // 15% weekend premium
        }

        // Round to nearest 50
        const finalPrice = Math.round(basePrice / 50) * 50;

        // Pick aircraft
        const aircraftIndex = Math.floor(seededRandom(seed + 6) * AIRCRAFT_TYPES.length);
        const aircraft = AIRCRAFT_TYPES[aircraftIndex];

        // Calculate arrival time
        const arrivalTime = addMinutesToTime(slot.time, duration);

        // Seats available (random 1-45)
        const seatsAvailable = Math.max(1, Math.floor(seededRandom(seed + 7) * 45));

        flights.push({
            id: `${carrierCode}${flightNum}-${date || 'today'}`,
            flightNumber: `${carrierCode}${flightNum}`,
            airline: airline.name,
            carrierCode: carrierCode,
            aircraft: aircraft.name,
            aircraftCode: aircraft.code,
            departure: {
                iataCode: origin,
                terminal: Math.floor(seededRandom(seed + 8) * 3) + 1,
                at: `${date || new Date().toISOString().slice(0, 10)}T${slot.time}:00`
            },
            arrival: {
                iataCode: destination,
                terminal: Math.floor(seededRandom(seed + 9) * 3) + 1,
                at: `${isNextDay(slot.time, arrivalTime) ?
                    new Date(new Date(date || new Date()).getTime() + 86400000).toISOString().slice(0, 10) :
                    (date || new Date().toISOString().slice(0, 10))}T${arrivalTime}:00`
            },
            duration: formatDuration(duration),
            durationMinutes: duration,
            totalPrice: finalPrice,
            currency: 'INR',
            seatsAvailable: seatsAvailable,
            segments: 1, // Direct flight
            cabinClass: 'ECONOMY',
            refundable: seededRandom(seed + 10) > 0.7,
            mealsIncluded: seededRandom(seed + 11) > 0.5,
        });
    }

    // Sort by departure time
    flights.sort((a, b) => a.departure.at.localeCompare(b.departure.at));

    return flights;
}

/**
 * Get airport info
 */
function getAirportInfo(code) {
    return AIRPORTS[code] || { city: code, name: code, timezone: '+05:30' };
}

/**
 * Search airports by keyword
 */
function searchAirports(keyword) {
    if (!keyword || keyword.length < 2) return [];

    const searchTerm = keyword.toUpperCase();
    const results = [];

    for (const [code, info] of Object.entries(AIRPORTS)) {
        if (code.includes(searchTerm) ||
            info.city.toUpperCase().includes(searchTerm) ||
            info.name.toUpperCase().includes(searchTerm)) {
            results.push({
                iata: code,
                name: info.name,
                city: info.city,
                country: 'India'
            });
        }
    }

    return results.slice(0, 8);
}

module.exports = {
    AIRLINES,
    AIRPORTS,
    generateFlights,
    getAirportInfo,
    searchAirports
};
