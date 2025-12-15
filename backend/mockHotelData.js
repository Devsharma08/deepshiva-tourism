// High-Quality Static Hotel Mock Data
// Curated hotels for major Indian cities

const HOTEL_IMAGES = {
    luxury: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    ],
    premium: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
        'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    ],
    boutique: [
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
        'https://images.unsplash.com/photo-1587213811864-46e59f6873b1?w=800&q=80',
        'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80',
        'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80',
    ],
    budget: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    ]
};

const AMENITIES_POOL = [
    'Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant',
    'Bar', 'Room Service', 'Parking', 'Airport Shuttle', 'Business Center',
    'Laundry', 'Concierge', '24/7 Reception', 'AC', 'Coffee Maker'
];

// City-wise hotel database
const HOTELS_BY_CITY = {
    'mumbai': [
        { name: 'The Taj Mahal Palace', area: 'Colaba', tier: 'luxury', basePrice: 22000, rating: 4.9 },
        { name: 'The Oberoi Mumbai', area: 'Nariman Point', tier: 'luxury', basePrice: 18500, rating: 4.8 },
        { name: 'Four Seasons Hotel Mumbai', area: 'Worli', tier: 'luxury', basePrice: 21000, rating: 4.8 },
        { name: 'Trident Nariman Point', area: 'Nariman Point', tier: 'premium', basePrice: 12500, rating: 4.6 },
        { name: 'ITC Grand Central', area: 'Parel', tier: 'premium', basePrice: 11000, rating: 4.5 },
        { name: 'The Leela Mumbai', area: 'Andheri East', tier: 'premium', basePrice: 9500, rating: 4.5 },
        { name: 'JW Marriott Mumbai Juhu', area: 'Juhu', tier: 'premium', basePrice: 13000, rating: 4.6 },
        { name: 'Novotel Mumbai Juhu Beach', area: 'Juhu', tier: 'boutique', basePrice: 7500, rating: 4.3 },
        { name: 'Hotel Marine Plaza', area: 'Marine Drive', tier: 'boutique', basePrice: 6500, rating: 4.2 },
        { name: 'FabHotel Prime Western Court', area: 'Andheri', tier: 'budget', basePrice: 2800, rating: 4.0 },
        { name: 'OYO Townhouse Mumbai Central', area: 'Mumbai Central', tier: 'budget', basePrice: 2200, rating: 3.8 },
        { name: 'Treebo Trend Blue Moon', area: 'Vile Parle', tier: 'budget', basePrice: 1900, rating: 3.7 },
    ],
    'delhi': [
        { name: 'The Imperial New Delhi', area: 'Connaught Place', tier: 'luxury', basePrice: 24000, rating: 4.9 },
        { name: 'The Lodhi', area: 'Lodhi Road', tier: 'luxury', basePrice: 28000, rating: 4.9 },
        { name: 'ITC Maurya New Delhi', area: 'Chanakyapuri', tier: 'luxury', basePrice: 19000, rating: 4.8 },
        { name: 'The Leela Palace New Delhi', area: 'Chanakyapuri', tier: 'luxury', basePrice: 26000, rating: 4.9 },
        { name: 'Taj Palace New Delhi', area: 'Sardar Patel Marg', tier: 'premium', basePrice: 15000, rating: 4.7 },
        { name: 'The Oberoi New Delhi', area: 'Dr Zakir Hussain Marg', tier: 'premium', basePrice: 17500, rating: 4.8 },
        { name: 'Andaz Delhi', area: 'Aerocity', tier: 'premium', basePrice: 12000, rating: 4.5 },
        { name: 'Pullman New Delhi Aerocity', area: 'Aerocity', tier: 'boutique', basePrice: 8500, rating: 4.3 },
        { name: 'The LaLit New Delhi', area: 'Connaught Place', tier: 'boutique', basePrice: 9000, rating: 4.4 },
        { name: 'Zostel Delhi', area: 'Paharganj', tier: 'budget', basePrice: 1500, rating: 4.1 },
        { name: 'FabHotel Sunstar Karol Bagh', area: 'Karol Bagh', tier: 'budget', basePrice: 2500, rating: 3.9 },
        { name: 'OYO Flagship Hotel Grand', area: 'Nehru Place', tier: 'budget', basePrice: 1800, rating: 3.6 },
    ],
    'goa': [
        { name: 'Taj Exotica Resort & Spa', area: 'Benaulim', tier: 'luxury', basePrice: 25000, rating: 4.9 },
        { name: 'The Leela Goa', area: 'Cavelossim', tier: 'luxury', basePrice: 22000, rating: 4.8 },
        { name: 'Grand Hyatt Goa', area: 'Bambolim', tier: 'luxury', basePrice: 18000, rating: 4.7 },
        { name: 'W Goa', area: 'Vagator', tier: 'premium', basePrice: 20000, rating: 4.7 },
        { name: 'Alila Diwa Goa', area: 'Majorda', tier: 'premium', basePrice: 14000, rating: 4.6 },
        { name: 'Park Hyatt Goa Resort and Spa', area: 'Cansaulim', tier: 'premium', basePrice: 16000, rating: 4.7 },
        { name: 'Novotel Goa Resort & Spa', area: 'Candolim', tier: 'boutique', basePrice: 8500, rating: 4.3 },
        { name: 'Cidade de Goa', area: 'Dona Paula', tier: 'boutique', basePrice: 7000, rating: 4.2 },
        { name: 'Casa Baga', area: 'Baga', tier: 'boutique', basePrice: 5500, rating: 4.1 },
        { name: 'OYO Home Calangute Beach', area: 'Calangute', tier: 'budget', basePrice: 2500, rating: 3.9 },
        { name: 'Zostel Goa Anjuna', area: 'Anjuna', tier: 'budget', basePrice: 1200, rating: 4.2 },
        { name: 'Treebo Morjim Sunset', area: 'Morjim', tier: 'budget', basePrice: 1800, rating: 3.8 },
    ],
    'jaipur': [
        { name: 'Rambagh Palace', area: 'Bhawani Singh Road', tier: 'luxury', basePrice: 35000, rating: 4.9 },
        { name: 'The Oberoi Rajvilas', area: 'Goner Road', tier: 'luxury', basePrice: 32000, rating: 4.9 },
        { name: 'Taj Jai Mahal Palace', area: 'Civil Lines', tier: 'luxury', basePrice: 18000, rating: 4.8 },
        { name: 'ITC Rajputana', area: 'Amer Road', tier: 'premium', basePrice: 12000, rating: 4.5 },
        { name: 'Fairmont Jaipur', area: 'Kukas', tier: 'premium', basePrice: 14000, rating: 4.6 },
        { name: 'Jai Mahal Palace', area: 'Civil Lines', tier: 'premium', basePrice: 11000, rating: 4.5 },
        { name: 'Samode Haveli', area: 'Gangapole', tier: 'boutique', basePrice: 8500, rating: 4.4 },
        { name: 'Alsisar Haveli', area: 'Sansar Chandra Road', tier: 'boutique', basePrice: 6500, rating: 4.3 },
        { name: 'Pearl Palace Heritage', area: 'Hathroi Fort', tier: 'budget', basePrice: 2500, rating: 4.5 },
        { name: 'Zostel Jaipur', area: 'MI Road', tier: 'budget', basePrice: 900, rating: 4.3 },
        { name: 'OYO Pink House', area: 'Bani Park', tier: 'budget', basePrice: 1500, rating: 3.7 },
    ],
    'bangalore': [
        { name: 'The Leela Palace Bengaluru', area: 'Old Airport Road', tier: 'luxury', basePrice: 22000, rating: 4.9 },
        { name: 'ITC Gardenia', area: 'Residency Road', tier: 'luxury', basePrice: 16000, rating: 4.7 },
        { name: 'The Oberoi Bengaluru', area: 'MG Road', tier: 'luxury', basePrice: 18000, rating: 4.8 },
        { name: 'Taj West End', area: 'Race Course Road', tier: 'premium', basePrice: 14000, rating: 4.7 },
        { name: 'JW Marriott Hotel Bengaluru', area: 'Lavelle Road', tier: 'premium', basePrice: 13000, rating: 4.6 },
        { name: 'Shangri-La Bengaluru', area: 'Palace Road', tier: 'premium', basePrice: 11500, rating: 4.5 },
        { name: 'Taj MG Road Bengaluru', area: 'MG Road', tier: 'boutique', basePrice: 8000, rating: 4.4 },
        { name: 'Lemon Tree Premier', area: 'Whitefield', tier: 'boutique', basePrice: 5500, rating: 4.2 },
        { name: 'FabHotel Hallmark Indiranagar', area: 'Indiranagar', tier: 'budget', basePrice: 2800, rating: 4.0 },
        { name: 'Treebo Trend Galaxy', area: 'Koramangala', tier: 'budget', basePrice: 2200, rating: 3.9 },
    ],
    'hyderabad': [
        { name: 'Taj Falaknuma Palace', area: 'Falaknuma', tier: 'luxury', basePrice: 45000, rating: 4.9 },
        { name: 'Park Hyatt Hyderabad', area: 'Banjara Hills', tier: 'luxury', basePrice: 18000, rating: 4.8 },
        { name: 'ITC Kohenur', area: 'HITEC City', tier: 'luxury', basePrice: 15000, rating: 4.7 },
        { name: 'Novotel Hyderabad Convention Centre', area: 'HITEC City', tier: 'premium', basePrice: 9500, rating: 4.4 },
        { name: 'Taj Krishna', area: 'Banjara Hills', tier: 'premium', basePrice: 11000, rating: 4.5 },
        { name: 'Trident Hyderabad', area: 'HITEC City', tier: 'premium', basePrice: 10000, rating: 4.5 },
        { name: 'The Park Hyderabad', area: 'Somajiguda', tier: 'boutique', basePrice: 7000, rating: 4.2 },
        { name: 'Lemon Tree Premier', area: 'HITEC City', tier: 'boutique', basePrice: 5500, rating: 4.1 },
        { name: 'FabHotel Jubilee Hills', area: 'Jubilee Hills', tier: 'budget', basePrice: 2500, rating: 3.9 },
        { name: 'OYO Townhouse Gachibowli', area: 'Gachibowli', tier: 'budget', basePrice: 1800, rating: 3.7 },
    ],
    'chennai': [
        { name: 'ITC Grand Chola', area: 'Guindy', tier: 'luxury', basePrice: 16000, rating: 4.8 },
        { name: 'The Leela Palace Chennai', area: 'MRC Nagar', tier: 'luxury', basePrice: 18000, rating: 4.8 },
        { name: 'Taj Coromandel', area: 'Nungambakkam', tier: 'luxury', basePrice: 14000, rating: 4.7 },
        { name: 'Park Hyatt Chennai', area: 'Velachery', tier: 'premium', basePrice: 12000, rating: 4.6 },
        { name: 'The Raintree Hotel', area: 'Anna Salai', tier: 'premium', basePrice: 8000, rating: 4.4 },
        { name: 'Novotel Chennai Chamiers Road', area: 'Alwarpet', tier: 'boutique', basePrice: 6500, rating: 4.3 },
        { name: 'Radisson Blu Hotel GRT', area: 'T-Nagar', tier: 'boutique', basePrice: 5500, rating: 4.2 },
        { name: 'FabHotel Mango Anna Nagar', area: 'Anna Nagar', tier: 'budget', basePrice: 2200, rating: 4.0 },
        { name: 'OYO Townhouse T-Nagar', area: 'T-Nagar', tier: 'budget', basePrice: 1600, rating: 3.8 },
    ],
    'kolkata': [
        { name: 'The Oberoi Grand', area: 'Chowringhee', tier: 'luxury', basePrice: 16000, rating: 4.8 },
        { name: 'ITC Royal Bengal', area: 'New Town', tier: 'luxury', basePrice: 14000, rating: 4.7 },
        { name: 'Taj Bengal', area: 'Alipore', tier: 'luxury', basePrice: 12000, rating: 4.7 },
        { name: 'JW Marriott Hotel Kolkata', area: 'New Town', tier: 'premium', basePrice: 10000, rating: 4.5 },
        { name: 'The Park Kolkata', area: 'Park Street', tier: 'premium', basePrice: 7500, rating: 4.4 },
        { name: 'Novotel Kolkata Hotel & Residences', area: 'New Town', tier: 'boutique', basePrice: 6000, rating: 4.2 },
        { name: 'Kenilworth Hotel', area: 'Little Russell Street', tier: 'boutique', basePrice: 4500, rating: 4.1 },
        { name: 'FabHotel Park Street', area: 'Park Street', tier: 'budget', basePrice: 2200, rating: 3.9 },
        { name: 'OYO Townhouse Salt Lake', area: 'Salt Lake', tier: 'budget', basePrice: 1500, rating: 3.7 },
    ],
    'udaipur': [
        { name: 'The Oberoi Udaivilas', area: 'Pichola', tier: 'luxury', basePrice: 55000, rating: 4.9 },
        { name: 'Taj Lake Palace', area: 'Lake Pichola', tier: 'luxury', basePrice: 48000, rating: 4.9 },
        { name: 'The Leela Palace Udaipur', area: 'Lake Pichola', tier: 'luxury', basePrice: 42000, rating: 4.9 },
        { name: 'Taj Fateh Prakash Palace', area: 'City Palace', tier: 'premium', basePrice: 18000, rating: 4.7 },
        { name: 'Trident Udaipur', area: 'Haridas Ji Ki Magri', tier: 'premium', basePrice: 12000, rating: 4.5 },
        { name: 'Radisson Blu Udaipur Palace Resort', area: 'Fateh Sagar Road', tier: 'boutique', basePrice: 8000, rating: 4.3 },
        { name: 'Jagat Niwas Palace', area: 'Lal Ghat', tier: 'boutique', basePrice: 4500, rating: 4.4 },
        { name: 'Zostel Udaipur', area: 'Lal Ghat', tier: 'budget', basePrice: 800, rating: 4.3 },
        { name: 'Dream Heaven Guesthouse', area: 'Gangaur Ghat', tier: 'budget', basePrice: 1200, rating: 4.2 },
    ],
    'varanasi': [
        { name: 'Taj Nadesar Palace', area: 'Nadesar', tier: 'luxury', basePrice: 28000, rating: 4.8 },
        { name: 'BrijRama Palace', area: 'Darbhanga Ghat', tier: 'luxury', basePrice: 22000, rating: 4.8 },
        { name: 'Taj Ganges Varanasi', area: 'Nadesar Palace Grounds', tier: 'premium', basePrice: 12000, rating: 4.5 },
        { name: 'Ramada Plaza JHV Varanasi', area: 'The Mall', tier: 'premium', basePrice: 8000, rating: 4.3 },
        { name: 'Suryauday Haveli', area: 'Shivala Ghat', tier: 'boutique', basePrice: 5500, rating: 4.4 },
        { name: 'Ganges View Guesthouse', area: 'Assi Ghat', tier: 'boutique', basePrice: 3500, rating: 4.3 },
        { name: 'Zostel Varanasi', area: 'Assi Ghat', tier: 'budget', basePrice: 600, rating: 4.4 },
        { name: 'Stops Hostel', area: 'Assi Ghat', tier: 'budget', basePrice: 700, rating: 4.2 },
    ],
    'kochi': [
        { name: 'Taj Malabar Resort & Spa', area: 'Willingdon Island', tier: 'luxury', basePrice: 15000, rating: 4.7 },
        { name: 'Grand Hyatt Kochi Bolgatty', area: 'Bolgatty Island', tier: 'luxury', basePrice: 12000, rating: 4.6 },
        { name: 'Crowne Plaza Kochi', area: 'NH 544', tier: 'premium', basePrice: 8000, rating: 4.4 },
        { name: 'Le Méridien Kochi', area: 'Maradu', tier: 'premium', basePrice: 9000, rating: 4.5 },
        { name: 'Forte Kochi', area: 'Fort Kochi', tier: 'boutique', basePrice: 7500, rating: 4.4 },
        { name: 'Old Harbour Hotel', area: 'Fort Kochi', tier: 'boutique', basePrice: 6000, rating: 4.5 },
        { name: 'Zostel Kochi', area: 'Fort Kochi', tier: 'budget', basePrice: 700, rating: 4.3 },
        { name: 'Happy Camper Hostel', area: 'Fort Kochi', tier: 'budget', basePrice: 600, rating: 4.2 },
    ],
    'agra': [
        { name: 'The Oberoi Amarvilas', area: 'Taj East Gate Road', tier: 'luxury', basePrice: 48000, rating: 4.9 },
        { name: 'ITC Mughal', area: 'Fatehabad Road', tier: 'luxury', basePrice: 16000, rating: 4.7 },
        { name: 'Trident Agra', area: 'Fatehabad Road', tier: 'premium', basePrice: 10000, rating: 4.5 },
        { name: 'Radisson Hotel Agra', area: 'Fatehabad Road', tier: 'premium', basePrice: 7500, rating: 4.3 },
        { name: 'Crystal Sarovar Premiere', area: 'Fatehabad Road', tier: 'boutique', basePrice: 5500, rating: 4.2 },
        { name: 'Hotel Atulyaa Taj', area: 'Taj East Gate Road', tier: 'boutique', basePrice: 4000, rating: 4.1 },
        { name: 'Zostel Agra', area: 'Taj Ganj', tier: 'budget', basePrice: 600, rating: 4.3 },
        { name: 'Hotel Sidhartha', area: 'Fatehabad Road', tier: 'budget', basePrice: 1500, rating: 3.8 },
    ],
    'ahmedabad': [
        { name: 'ITC Narmada', area: 'Vastrapur', tier: 'luxury', basePrice: 14000, rating: 4.7 },
        { name: 'Taj Skyline', area: 'Airport Road', tier: 'premium', basePrice: 9000, rating: 4.5 },
        { name: 'Hyatt Regency Ahmedabad', area: 'Ashram Road', tier: 'premium', basePrice: 8500, rating: 4.4 },
        { name: 'Novotel Ahmedabad', area: 'SG Highway', tier: 'boutique', basePrice: 6000, rating: 4.2 },
        { name: 'Lemon Tree Premier', area: 'SG Highway', tier: 'boutique', basePrice: 5000, rating: 4.1 },
        { name: 'FabHotel Prahlad Nagar', area: 'Prahlad Nagar', tier: 'budget', basePrice: 2200, rating: 3.9 },
        { name: 'Zostel Ahmedabad', area: 'SG Highway', tier: 'budget', basePrice: 700, rating: 4.2 },
    ],
    'pune': [
        { name: 'JW Marriott Hotel Pune', area: 'Senapati Bapat Road', tier: 'luxury', basePrice: 12000, rating: 4.6 },
        { name: 'The Westin Pune', area: 'Koregaon Park', tier: 'luxury', basePrice: 11000, rating: 4.5 },
        { name: 'Conrad Pune', area: 'Koregaon Park', tier: 'premium', basePrice: 10000, rating: 4.6 },
        { name: 'Hyatt Pune', area: 'Kalyani Nagar', tier: 'premium', basePrice: 8000, rating: 4.4 },
        { name: 'Novotel Pune Nagar Road', area: 'Nagar Road', tier: 'boutique', basePrice: 5500, rating: 4.2 },
        { name: 'Lemon Tree Premier City Center', area: 'City Center', tier: 'boutique', basePrice: 4500, rating: 4.1 },
        { name: 'FabHotel Koregaon Park', area: 'Koregaon Park', tier: 'budget', basePrice: 2500, rating: 4.0 },
        { name: 'Zostel Pune', area: 'Koregaon Park', tier: 'budget', basePrice: 700, rating: 4.2 },
    ],
    'srinagar': [
        { name: 'The Lalit Grand Palace Srinagar', area: 'Gupkar Road', tier: 'luxury', basePrice: 18000, rating: 4.7 },
        { name: 'Vivanta Dal View Srinagar', area: 'Kralsangri', tier: 'premium', basePrice: 12000, rating: 4.5 },
        { name: 'Houseboat Naaz Kashmir', area: 'Dal Lake', tier: 'boutique', basePrice: 8000, rating: 4.6 },
        { name: 'The Khyber Himalayan Resort', area: 'Gulmarg', tier: 'luxury', basePrice: 25000, rating: 4.8 },
        { name: 'WelcomHotel Pine-N-Peak', area: 'Pahalgam', tier: 'premium', basePrice: 9000, rating: 4.4 },
        { name: 'Hotel Grand Mumtaz', area: 'Boulevard Road', tier: 'boutique', basePrice: 5500, rating: 4.2 },
        { name: 'Zostel Srinagar', area: 'Rainawari', tier: 'budget', basePrice: 800, rating: 4.3 },
    ],
};

// City name aliases/variations
const CITY_ALIASES = {
    'new delhi': 'delhi',
    'bengaluru': 'bangalore',
    'bengaluru': 'bangalore',
    'thiruvananthapuram': 'trivandrum',
    'kochi': 'kochi',
    'cochin': 'kochi',
};

// Helper: Seeded random for consistency
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Helper: Get random amenities
function getRandomAmenities(tier, seed) {
    const baseCount = tier === 'luxury' ? 8 : tier === 'premium' ? 6 : tier === 'boutique' ? 5 : 4;
    const shuffled = [...AMENITIES_POOL].sort(() => seededRandom(seed++) - 0.5);
    return shuffled.slice(0, baseCount);
}

// Helper: Get image based on tier
function getHotelImage(tier, index) {
    const images = HOTEL_IMAGES[tier] || HOTEL_IMAGES.boutique;
    return images[index % images.length];
}

// Helper: Add price variation based on date
function getPriceWithVariation(basePrice, seed) {
    const variation = (seededRandom(seed) - 0.5) * 0.2; // ±10%
    return Math.round((basePrice * (1 + variation)) / 100) * 100;
}

/**
 * Generate hotels for a city
 */
function generateHotels(cityName, page = 1, limit = 10) {
    if (!cityName) return [];

    // Normalize city name
    const normalizedCity = cityName.toLowerCase().trim();
    const cityKey = CITY_ALIASES[normalizedCity] || normalizedCity;

    // Get hotels for this city
    const cityHotels = HOTELS_BY_CITY[cityKey];

    if (!cityHotels) {
        // If city not in database, return empty or generate generic hotels
        console.log(`City "${cityName}" not found in hotel database`);
        return [];
    }

    const dateSeed = new Date().getDate(); // Use day of month for variation

    // Transform hotel data
    const hotels = cityHotels.map((hotel, index) => {
        const seed = dateSeed + index * 100;

        return {
            id: `hotel_${cityKey}_${index + 1}`,
            name: hotel.name,
            location: {
                lat: 0, // Not needed for mock
                lng: 0,
                address: `${hotel.area}, ${cityName.charAt(0).toUpperCase() + cityName.slice(1)}`
            },
            price: getPriceWithVariation(hotel.basePrice, seed),
            rating: hotel.rating,
            tier: hotel.tier,
            amenities: getRandomAmenities(hotel.tier, seed + 1),
            image: getHotelImage(hotel.tier, index),
            currency: 'INR'
        };
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    return hotels.slice(startIndex, startIndex + limit);
}

/**
 * Search hotels (for autocomplete)
 */
function searchHotelCities(keyword) {
    if (!keyword || keyword.length < 2) return [];

    const searchTerm = keyword.toLowerCase();
    const results = [];

    for (const city of Object.keys(HOTELS_BY_CITY)) {
        if (city.includes(searchTerm)) {
            results.push({
                name: city.charAt(0).toUpperCase() + city.slice(1),
                subtitle: `${HOTELS_BY_CITY[city].length} hotels available`
            });
        }
    }

    // Also check aliases
    for (const [alias, city] of Object.entries(CITY_ALIASES)) {
        if (alias.includes(searchTerm) && !results.find(r => r.name.toLowerCase() === city)) {
            results.push({
                name: city.charAt(0).toUpperCase() + city.slice(1),
                subtitle: `${HOTELS_BY_CITY[city]?.length || 0} hotels available`
            });
        }
    }

    return results.slice(0, 5);
}

/**
 * Get all supported cities
 */
function getSupportedCities() {
    return Object.keys(HOTELS_BY_CITY).map(city => ({
        name: city.charAt(0).toUpperCase() + city.slice(1),
        hotelCount: HOTELS_BY_CITY[city].length
    }));
}

module.exports = {
    generateHotels,
    searchHotelCities,
    getSupportedCities,
    HOTELS_BY_CITY
};
