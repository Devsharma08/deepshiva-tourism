// High-Quality Mock Activities Data for Indian Regions
// Organized by category with location-specific experiences

const ACTIVITY_CATEGORIES = {
    adventure: { name: 'Adventure', icon: 'FaHiking', color: '#f59e0b' },
    water: { name: 'Water Sports', icon: 'FaWater', color: '#0ea5e9' },
    wellness: { name: 'Wellness', icon: 'FaSpa', color: '#10b981' },
    food: { name: 'Food Tours', icon: 'FaUtensils', color: '#ef4444' },
    camping: { name: 'Camping', icon: 'FaCampground', color: '#8b5cf6' }
};

const ACTIVITIES_DATA = {
    adventure: [
        // Himachal Pradesh
        {
            id: 'adv-1',
            title: 'Rohtang Pass Trek',
            subtitle: 'Conquer the mighty Himalayas',
            description: 'Experience the thrill of trekking through snow-capped mountains with breathtaking views of the Pir Panjal range.',
            img: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
            location: { city: 'Manali', state: 'Himachal Pradesh', coordinates: { lat: 32.3522, lng: 77.1777 } },
            duration: '2 days',
            price: 4500,
            rating: 4.8,
            reviews: 234,
            difficulty: 'Moderate',
            bestSeason: 'May - October',
            includes: ['Guide', 'Meals', 'Permits', 'Equipment']
        },
        {
            id: 'adv-2',
            title: 'Paragliding in Bir Billing',
            subtitle: 'Soar like an eagle',
            description: 'Fly over the beautiful Kangra Valley from the paragliding capital of India.',
            img: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80',
            location: { city: 'Bir', state: 'Himachal Pradesh', coordinates: { lat: 32.0466, lng: 76.7191 } },
            duration: '30 mins flight',
            price: 3500,
            rating: 4.9,
            reviews: 567,
            difficulty: 'Easy',
            bestSeason: 'March - June, Sept - Nov',
            includes: ['Pilot', 'Equipment', 'GoPro Video', 'Certificate']
        },
        // Uttarakhand
        {
            id: 'adv-3',
            title: 'Valley of Flowers Trek',
            subtitle: 'UNESCO World Heritage Site',
            description: 'Walk through meadows of rare Himalayan flowers in this enchanting national park.',
            img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
            location: { city: 'Joshimath', state: 'Uttarakhand', coordinates: { lat: 30.5563, lng: 79.5667 } },
            duration: '6 days',
            price: 15000,
            rating: 4.9,
            reviews: 189,
            difficulty: 'Moderate',
            bestSeason: 'July - September',
            includes: ['Guide', 'Tents', 'Meals', 'Permits']
        },
        {
            id: 'adv-4',
            title: 'Rishikesh River Rafting',
            subtitle: 'White water adventure',
            description: 'Navigate through Grade III & IV rapids on the holy Ganges river.',
            img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
            location: { city: 'Rishikesh', state: 'Uttarakhand', coordinates: { lat: 30.0869, lng: 78.2676 } },
            duration: '3-4 hours',
            price: 1800,
            rating: 4.7,
            reviews: 890,
            difficulty: 'Moderate to Hard',
            bestSeason: 'Sept - June',
            includes: ['Equipment', 'Instructor', 'Transport', 'Snacks']
        },
        // Rajasthan
        {
            id: 'adv-5',
            title: 'Desert Safari Jaisalmer',
            subtitle: 'Golden sands await',
            description: 'Camel safari through the Thar Desert with overnight camping under stars.',
            img: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=800&q=80',
            location: { city: 'Jaisalmer', state: 'Rajasthan', coordinates: { lat: 26.9157, lng: 70.9083 } },
            duration: '2 days',
            price: 6500,
            rating: 4.6,
            reviews: 445,
            difficulty: 'Easy',
            bestSeason: 'October - March',
            includes: ['Camel Ride', 'Tent Stay', 'Cultural Show', 'Meals']
        },
        // Ladakh
        {
            id: 'adv-6',
            title: 'Khardung La Bike Expedition',
            subtitle: 'World\'s highest motorable road',
            description: 'Ride through the legendary mountain passes of Ladakh on Royal Enfield.',
            img: 'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=800&q=80',
            location: { city: 'Leh', state: 'Ladakh', coordinates: { lat: 34.1526, lng: 77.5771 } },
            duration: '7 days',
            price: 35000,
            rating: 4.9,
            reviews: 312,
            difficulty: 'Hard',
            bestSeason: 'June - September',
            includes: ['Bike Rental', 'Fuel', 'Accommodation', 'Mechanic Support']
        }
    ],
    water: [
        // Goa
        {
            id: 'wat-1',
            title: 'Scuba Diving Grande Island',
            subtitle: 'Explore underwater paradise',
            description: 'Discover vibrant coral reefs and tropical fish in the Arabian Sea.',
            img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
            location: { city: 'South Goa', state: 'Goa', coordinates: { lat: 15.3576, lng: 73.8279 } },
            duration: '4 hours',
            price: 4500,
            rating: 4.8,
            reviews: 678,
            difficulty: 'Easy (Beginners welcome)',
            bestSeason: 'October - May',
            includes: ['Equipment', 'Instructor', 'Boat Ride', 'Photos']
        },
        {
            id: 'wat-2',
            title: 'Jet Ski Adventure Calangute',
            subtitle: 'Speed on the waves',
            description: 'Feel the adrenaline rush as you zip across the Goan waters.',
            img: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=800&q=80',
            location: { city: 'Calangute', state: 'Goa', coordinates: { lat: 15.5449, lng: 73.7551 } },
            duration: '15 mins',
            price: 800,
            rating: 4.5,
            reviews: 1245,
            difficulty: 'Easy',
            bestSeason: 'October - May',
            includes: ['Life Jacket', 'Instructor', 'Fuel']
        },
        // Andaman
        {
            id: 'wat-3',
            title: 'Sea Walking Havelock',
            subtitle: 'Walk on the ocean floor',
            description: 'Experience the magical underwater world without swimming skills.',
            img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
            location: { city: 'Havelock Island', state: 'Andaman & Nicobar', coordinates: { lat: 12.0263, lng: 92.9876 } },
            duration: '45 mins',
            price: 3500,
            rating: 4.7,
            reviews: 234,
            difficulty: 'Easy (Non-swimmers welcome)',
            bestSeason: 'October - May',
            includes: ['Helmet', 'Underwater Photos', 'Guide']
        },
        // Kerala
        {
            id: 'wat-4',
            title: 'Alleppey Houseboat Cruise',
            subtitle: 'Floating through backwaters',
            description: 'Cruise through the serene Kerala backwaters on a traditional kettuvallam.',
            img: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80',
            location: { city: 'Alleppey', state: 'Kerala', coordinates: { lat: 9.4981, lng: 76.3388 } },
            duration: 'Overnight stay',
            price: 12000,
            rating: 4.8,
            reviews: 567,
            difficulty: 'Easy',
            bestSeason: 'August - March',
            includes: ['Private Boat', 'Captain', 'Chef', 'All Meals']
        },
        // Karnataka
        {
            id: 'wat-5',
            title: 'Surfing Lessons Mangalore',
            subtitle: 'Catch your first wave',
            description: 'Learn surfing on the pristine beaches of Karnataka coast.',
            img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
            location: { city: 'Mulki', state: 'Karnataka', coordinates: { lat: 13.0929, lng: 74.7905 } },
            duration: '2 hours',
            price: 1500,
            rating: 4.6,
            reviews: 189,
            difficulty: 'Easy to Moderate',
            bestSeason: 'September - May',
            includes: ['Board', 'Instructor', 'Rash Guard']
        },
        // Lakshadweep
        {
            id: 'wat-6',
            title: 'Snorkeling Lakshadweep',
            subtitle: 'Crystal clear lagoons',
            description: 'Snorkel in the pristine turquoise waters with colorful marine life.',
            img: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&q=80',
            location: { city: 'Kavaratti', state: 'Lakshadweep', coordinates: { lat: 10.5593, lng: 72.6358 } },
            duration: '2 hours',
            price: 2500,
            rating: 4.9,
            reviews: 145,
            difficulty: 'Easy',
            bestSeason: 'October - May',
            includes: ['Gear', 'Guide', 'Boat Transfer']
        }
    ],
    wellness: [
        // Kerala
        {
            id: 'wel-1',
            title: 'Ayurveda Retreat Kovalam',
            subtitle: 'Ancient healing traditions',
            description: 'Experience authentic Panchakarma treatment at a traditional wellness center.',
            img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
            location: { city: 'Kovalam', state: 'Kerala', coordinates: { lat: 8.3988, lng: 76.9820 } },
            duration: '7 days',
            price: 45000,
            rating: 4.9,
            reviews: 123,
            difficulty: 'Relaxing',
            bestSeason: 'June - March',
            includes: ['Accommodation', 'Treatments', 'Ayurvedic Meals', 'Yoga']
        },
        {
            id: 'wel-2',
            title: 'Yoga Teacher Training Varkala',
            subtitle: 'Transform your practice',
            description: '200-hour certified yoga course overlooking the Arabian Sea cliffs.',
            img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
            location: { city: 'Varkala', state: 'Kerala', coordinates: { lat: 8.7379, lng: 76.7163 } },
            duration: '28 days',
            price: 120000,
            rating: 4.8,
            reviews: 89,
            difficulty: 'Moderate',
            bestSeason: 'October - March',
            includes: ['Certification', 'Accommodation', 'Vegetarian Meals', 'Materials']
        },
        // Rishikesh
        {
            id: 'wel-3',
            title: 'Ganga Aarti & Meditation',
            subtitle: 'Spiritual awakening',
            description: 'Experience the divine evening ceremony and guided meditation by the Ganges.',
            img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
            location: { city: 'Rishikesh', state: 'Uttarakhand', coordinates: { lat: 30.0869, lng: 78.2676 } },
            duration: '3 hours',
            price: 500,
            rating: 4.9,
            reviews: 456,
            difficulty: 'Easy',
            bestSeason: 'Year round',
            includes: ['Guide', 'Boat Ride', 'Flower Offerings']
        },
        // Varanasi
        {
            id: 'wel-4',
            title: 'Sunrise Yoga at Ghats',
            subtitle: 'Sacred morning practice',
            description: 'Practice yoga as the sun rises over the ancient ghats of Varanasi.',
            img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
            location: { city: 'Varanasi', state: 'Uttar Pradesh', coordinates: { lat: 25.3176, lng: 83.0064 } },
            duration: '2 hours',
            price: 800,
            rating: 4.7,
            reviews: 234,
            difficulty: 'Easy',
            bestSeason: 'October - March',
            includes: ['Mat', 'Instructor', 'Chai']
        },
        // Dharamsala
        {
            id: 'wel-5',
            title: 'Buddhist Meditation Course',
            subtitle: 'Learn from Buddhist monks',
            description: 'Silent meditation retreat in the foothills of Himalayas near Dalai Lama temple.',
            img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80',
            location: { city: 'McLeod Ganj', state: 'Himachal Pradesh', coordinates: { lat: 32.2427, lng: 76.3193 } },
            duration: '10 days',
            price: 25000,
            rating: 4.9,
            reviews: 78,
            difficulty: 'Moderate (requires discipline)',
            bestSeason: 'March - June, September - November',
            includes: ['Accommodation', 'Meals', 'Teachings', 'Materials']
        },
        // Pondicherry
        {
            id: 'wel-6',
            title: 'Auroville Spiritual Tour',
            subtitle: 'City of Dawn experience',
            description: 'Visit the Matrimandir and explore the international spiritual community.',
            img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
            location: { city: 'Auroville', state: 'Tamil Nadu', coordinates: { lat: 12.0074, lng: 79.8103 } },
            duration: '1 day',
            price: 1500,
            rating: 4.6,
            reviews: 345,
            difficulty: 'Easy',
            bestSeason: 'Year round',
            includes: ['Guide', 'Entry Passes', 'Transport']
        }
    ],
    food: [
        // Delhi
        {
            id: 'food-1',
            title: 'Old Delhi Street Food Walk',
            subtitle: 'Taste the heritage',
            description: 'Explore the legendary lanes of Chandni Chowk with a local food expert.',
            img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
            location: { city: 'Delhi', state: 'Delhi', coordinates: { lat: 28.6559, lng: 77.2273 } },
            duration: '4 hours',
            price: 1800,
            rating: 4.9,
            reviews: 567,
            difficulty: 'Easy',
            bestSeason: 'October - March',
            includes: ['6+ Food Stops', 'Guide', 'Water', 'Antacid (just in case!)']
        },
        // Mumbai
        {
            id: 'food-2',
            title: 'Mumbai Street Food Safari',
            subtitle: 'From Vada Pav to Pav Bhaji',
            description: 'Experience the iconic street foods that fuel India\'s financial capital.',
            img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
            location: { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 18.9750, lng: 72.8258 } },
            duration: '3 hours',
            price: 1500,
            rating: 4.8,
            reviews: 445,
            difficulty: 'Easy',
            bestSeason: 'Year round',
            includes: ['5+ Food Stops', 'Local Guide', 'All Tastings']
        },
        // Kolkata
        {
            id: 'food-3',
            title: 'Bengali Cuisine Experience',
            subtitle: 'Sweets, fish & more',
            description: 'Discover authentic Bengali dishes from Kosha Mangsho to Rosogolla.',
            img: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&q=80',
            location: { city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } },
            duration: '4 hours',
            price: 2000,
            rating: 4.7,
            reviews: 234,
            difficulty: 'Easy',
            bestSeason: 'October - February',
            includes: ['Home Cooked Meal', 'Market Visit', 'Sweet Shop Tour']
        },
        // Lucknow
        {
            id: 'food-4',
            title: 'Awadhi Cuisine Trail',
            subtitle: 'City of Nawabs flavors',
            description: 'Taste the legendary kebabs and biryanis of Lucknow\'s Nawabi kitchens.',
            img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
            location: { city: 'Lucknow', state: 'Uttar Pradesh', coordinates: { lat: 26.8467, lng: 80.9462 } },
            duration: '5 hours',
            price: 2500,
            rating: 4.9,
            reviews: 189,
            difficulty: 'Easy',
            bestSeason: 'October - March',
            includes: ['Tunday Kebabs', 'Biryani', 'Kulfi', 'Heritage Walk']
        },
        // Jaipur
        {
            id: 'food-5',
            title: 'Royal Rajasthani Thali',
            subtitle: 'Feast like a Maharaja',
            description: 'Experience an elaborate traditional thali with 25+ items in a heritage haveli.',
            img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80',
            location: { city: 'Jaipur', state: 'Rajasthan', coordinates: { lat: 26.9124, lng: 75.7873 } },
            duration: '2 hours',
            price: 1200,
            rating: 4.8,
            reviews: 567,
            difficulty: 'Easy',
            bestSeason: 'October - March',
            includes: ['Full Thali', 'Welcome Drink', 'Desserts']
        },
        // Hyderabad
        {
            id: 'food-6',
            title: 'Hyderabadi Biryani Quest',
            subtitle: 'The ultimate Biryani tour',
            description: 'Compare the best biryanis from Paradise to hidden local gems.',
            img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
            location: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.3850, lng: 78.4867 } },
            duration: '4 hours',
            price: 1800,
            rating: 4.9,
            reviews: 678,
            difficulty: 'Easy (bring appetite!)',
            bestSeason: 'Year round',
            includes: ['3 Biryani Tastings', 'Irani Chai', 'Desserts', 'Guide']
        }
    ],
    camping: [
        // Uttarakhand
        {
            id: 'camp-1',
            title: 'Chopta Stargazing Camp',
            subtitle: 'Mini Switzerland of India',
            description: 'Camp in alpine meadows with views of Chandrashila peak and pristine night skies.',
            img: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=80',
            location: { city: 'Chopta', state: 'Uttarakhand', coordinates: { lat: 30.4405, lng: 79.1848 } },
            duration: '2 nights',
            price: 5500,
            rating: 4.8,
            reviews: 234,
            difficulty: 'Moderate',
            bestSeason: 'April - June, Sept - Nov',
            includes: ['Tent', 'Sleeping Bag', 'Meals', 'Bonfire', 'Trek to Tungnath']
        },
        {
            id: 'camp-2',
            title: 'Rishikesh Riverside Camp',
            subtitle: 'Adventure by the Ganges',
            description: 'Beach camping with rafting, cliff jumping and bonfire by the holy river.',
            img: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=800&q=80',
            location: { city: 'Rishikesh', state: 'Uttarakhand', coordinates: { lat: 30.1369, lng: 78.3101 } },
            duration: '1 night',
            price: 2500,
            rating: 4.7,
            reviews: 890,
            difficulty: 'Easy',
            bestSeason: 'September - May',
            includes: ['Tent', 'Meals', 'Rafting', 'Bonfire', 'Music']
        },
        // Himachal
        {
            id: 'camp-3',
            title: 'Spiti Valley Camping',
            subtitle: 'The Middle Land adventure',
            description: 'Camp in the cold desert with ancient monasteries and dramatic landscapes.',
            img: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800&q=80',
            location: { city: 'Kaza', state: 'Himachal Pradesh', coordinates: { lat: 32.2276, lng: 78.0700 } },
            duration: '3 nights',
            price: 12000,
            rating: 4.9,
            reviews: 156,
            difficulty: 'Moderate (high altitude)',
            bestSeason: 'June - September',
            includes: ['Camping Gear', 'All Meals', 'Local Guide', 'Monastery Visits']
        },
        // Meghalaya
        {
            id: 'camp-4',
            title: 'Living Root Bridge Camp',
            subtitle: 'Nature\'s engineering marvel',
            description: 'Camp near the famous living root bridges in the wettest place on Earth.',
            img: 'https://images.unsplash.com/photo-1533587851505-d119e13f2fcd?w=800&q=80',
            location: { city: 'Cherrapunji', state: 'Meghalaya', coordinates: { lat: 25.2799, lng: 91.7299 } },
            duration: '2 nights',
            price: 6500,
            rating: 4.8,
            reviews: 123,
            difficulty: 'Moderate',
            bestSeason: 'October - April',
            includes: ['Tent', 'Guide', 'Bridge Treks', 'Local Meals']
        },
        // Kerala
        {
            id: 'camp-5',
            title: 'Wayanad Treehouse Stay',
            subtitle: 'Sleep among the trees',
            description: 'Unique treehouse experience in the misty Western Ghats with wildlife.',
            img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
            location: { city: 'Wayanad', state: 'Kerala', coordinates: { lat: 11.6854, lng: 76.1320 } },
            duration: '1 night',
            price: 8000,
            rating: 4.7,
            reviews: 234,
            difficulty: 'Easy',
            bestSeason: 'September - May',
            includes: ['Treehouse Stay', 'Meals', 'Nature Walk', 'Campfire']
        },
        // Rajasthan
        {
            id: 'camp-6',
            title: 'Desert Luxury Camp Pushkar',
            subtitle: 'Glamping under desert stars',
            description: 'Premium tents with modern amenities in the Thar Desert during camel fair.',
            img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
            location: { city: 'Pushkar', state: 'Rajasthan', coordinates: { lat: 26.4897, lng: 74.5511 } },
            duration: '2 nights',
            price: 15000,
            rating: 4.9,
            reviews: 178,
            difficulty: 'Easy',
            bestSeason: 'October - February',
            includes: ['Luxury Tent', 'All Meals', 'Cultural Show', 'Camel Safari']
        }
    ]
};

// Get all activities
function getAllActivities() {
    const all = [];
    Object.entries(ACTIVITIES_DATA).forEach(([category, activities]) => {
        activities.forEach(activity => {
            all.push({ ...activity, category });
        });
    });
    return all;
}

// Get activities by category
function getActivitiesByCategory(category) {
    return ACTIVITIES_DATA[category] || [];
}

// Get activities by state/region
function getActivitiesByRegion(state) {
    const all = getAllActivities();
    const searchTerm = state.toLowerCase();
    return all.filter(activity =>
        activity.location.state.toLowerCase().includes(searchTerm) ||
        activity.location.city.toLowerCase().includes(searchTerm)
    );
}

// Search activities
function searchActivities(query, category = null) {
    let activities = category ? getActivitiesByCategory(category) : getAllActivities();

    if (!query) return activities;

    const searchTerm = query.toLowerCase();
    return activities.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm) ||
        activity.subtitle.toLowerCase().includes(searchTerm) ||
        activity.location.city.toLowerCase().includes(searchTerm) ||
        activity.location.state.toLowerCase().includes(searchTerm)
    );
}

module.exports = {
    ACTIVITY_CATEGORIES,
    ACTIVITIES_DATA,
    getAllActivities,
    getActivitiesByCategory,
    getActivitiesByRegion,
    searchActivities
};
