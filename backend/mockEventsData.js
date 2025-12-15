// Mock Community Events Data for Indian Cities
// Includes cultural events, festivals, meetups, workshops

const EVENTS_DATA = [
    // Delhi Events
    {
        id: 'evt-1',
        title: 'Delhi Photography Walk',
        subtitle: 'Capture the heritage of Old Delhi',
        description: 'Join fellow photographers to explore and capture the hidden beauty of Chandni Chowk and its historic lanes.',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
        category: 'Photography',
        city: 'Delhi',
        venue: 'Chandni Chowk Metro Station',
        date: getUpcomingDate(3),
        time: '6:00 AM',
        duration: '4 hours',
        price: 500,
        isFree: false,
        organizer: 'Delhi Photo Club',
        attendees: 45,
        maxAttendees: 50,
        tags: ['photography', 'heritage', 'walking tour']
    },
    {
        id: 'evt-2',
        title: 'Startup Networking Night',
        subtitle: 'Connect with Delhi NCR entrepreneurs',
        description: 'Monthly meetup for founders, investors, and startup enthusiasts. Pitch sessions and networking.',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
        category: 'Networking',
        city: 'Gurugram',
        venue: 'WeWork, Cyber Hub',
        date: getUpcomingDate(7),
        time: '6:30 PM',
        duration: '3 hours',
        price: 0,
        isFree: true,
        organizer: 'Startup Delhi',
        attendees: 120,
        maxAttendees: 150,
        tags: ['startup', 'networking', 'business']
    },
    // Mumbai Events
    {
        id: 'evt-3',
        title: 'Sunrise Yoga at Marine Drive',
        subtitle: 'Start your day with ocean breeze',
        description: 'Free community yoga session every Sunday morning with certified instructors facing the Arabian Sea.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        category: 'Wellness',
        city: 'Mumbai',
        venue: 'Marine Drive, Nariman Point',
        date: getUpcomingDate(2),
        time: '6:00 AM',
        duration: '1.5 hours',
        price: 0,
        isFree: true,
        organizer: 'Mumbai Yogis',
        attendees: 78,
        maxAttendees: 100,
        tags: ['yoga', 'fitness', 'free', 'community']
    },
    {
        id: 'evt-4',
        title: 'Bollywood Music Night',
        subtitle: 'Live Bollywood classics',
        description: 'Experience live performances of timeless Bollywood songs with a full orchestra at this magical evening.',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        category: 'Music',
        city: 'Mumbai',
        venue: 'NCPA, Nariman Point',
        date: getUpcomingDate(14),
        time: '7:00 PM',
        duration: '3 hours',
        price: 1500,
        isFree: false,
        organizer: 'NCPA Mumbai',
        attendees: 450,
        maxAttendees: 500,
        tags: ['music', 'bollywood', 'concert', 'live']
    },
    // Bangalore Events
    {
        id: 'evt-5',
        title: 'Tech Meetup: AI & ML',
        subtitle: 'Explore the future of AI',
        description: 'Deep dive into latest AI/ML trends with talks from Google, Microsoft, and startup leaders.',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        category: 'Technology',
        city: 'Bangalore',
        venue: 'Microsoft Office, Koramangala',
        date: getUpcomingDate(10),
        time: '5:00 PM',
        duration: '4 hours',
        price: 200,
        isFree: false,
        organizer: 'Bangalore Tech Community',
        attendees: 180,
        maxAttendees: 200,
        tags: ['tech', 'AI', 'machine learning', 'meetup']
    },
    {
        id: 'evt-6',
        title: 'Cubbon Park Run',
        subtitle: 'Weekly community 5K run',
        description: 'Join hundreds of runners every Saturday morning for a fun community run through the green heart of Bangalore.',
        image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
        category: 'Sports',
        city: 'Bangalore',
        venue: 'Cubbon Park, Main Gate',
        date: getUpcomingDate(1),
        time: '6:00 AM',
        duration: '1 hour',
        price: 0,
        isFree: true,
        organizer: 'Bangalore Runners',
        attendees: 234,
        maxAttendees: 500,
        tags: ['running', 'fitness', 'community', 'free']
    },
    // Jaipur Events
    {
        id: 'evt-7',
        title: 'Jaipur Literature Festival Preview',
        subtitle: 'Author meet & greet',
        description: 'Exclusive preview event with renowned authors ahead of the annual Jaipur Literature Festival.',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
        category: 'Literature',
        city: 'Jaipur',
        venue: 'Diggi Palace',
        date: getUpcomingDate(21),
        time: '4:00 PM',
        duration: '3 hours',
        price: 800,
        isFree: false,
        organizer: 'JLF Team',
        attendees: 150,
        maxAttendees: 200,
        tags: ['books', 'authors', 'literature', 'culture']
    },
    {
        id: 'evt-8',
        title: 'Traditional Block Printing Workshop',
        subtitle: 'Learn the ancient art',
        description: 'Hands-on workshop to learn traditional Rajasthani block printing techniques with local artisans.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        category: 'Art & Craft',
        city: 'Jaipur',
        venue: 'Anokhi Museum, Amber',
        date: getUpcomingDate(5),
        time: '10:00 AM',
        duration: '4 hours',
        price: 1200,
        isFree: false,
        organizer: 'Anokhi Trust',
        attendees: 18,
        maxAttendees: 20,
        tags: ['craft', 'art', 'traditional', 'workshop']
    },
    // Kolkata Events
    {
        id: 'evt-9',
        title: 'Durga Puja Pandal Hopping',
        subtitle: 'Guided heritage tour',
        description: 'Visit the most iconic and artistic Durga Puja pandals with a cultural guide explaining the traditions.',
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80',
        category: 'Festival',
        city: 'Kolkata',
        venue: 'Md. Ali Park, Starting Point',
        date: getUpcomingDate(60),
        time: '5:00 PM',
        duration: '5 hours',
        price: 600,
        isFree: false,
        organizer: 'Kolkata Heritage Walks',
        attendees: 35,
        maxAttendees: 40,
        tags: ['festival', 'durga puja', 'culture', 'heritage']
    },
    // Goa Events
    {
        id: 'evt-10',
        title: 'Beach Cleanup Drive',
        subtitle: 'Save our beaches',
        description: 'Join volunteers to clean Anjuna Beach and learn about marine conservation. Breakfast provided!',
        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80',
        category: 'Environment',
        city: 'Goa',
        venue: 'Anjuna Beach, South End',
        date: getUpcomingDate(4),
        time: '7:00 AM',
        duration: '3 hours',
        price: 0,
        isFree: true,
        organizer: 'Goa Goes Green',
        attendees: 45,
        maxAttendees: 100,
        tags: ['environment', 'volunteer', 'beach', 'community']
    },
    {
        id: 'evt-11',
        title: 'Full Moon Party Palolem',
        subtitle: 'Dance under the stars',
        description: 'Monthly full moon beach party with international DJs, fire dancers, and tribal beats.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        category: 'Party',
        city: 'Goa',
        venue: 'Silent Noise Club, Palolem',
        date: getUpcomingDate(12),
        time: '9:00 PM',
        duration: '6 hours',
        price: 1000,
        isFree: false,
        organizer: 'Silent Noise',
        attendees: 280,
        maxAttendees: 400,
        tags: ['party', 'music', 'beach', 'nightlife']
    },
    // Hyderabad Events
    {
        id: 'evt-12',
        title: 'Biryani Cook-Off Competition',
        subtitle: 'Who makes the best biryani?',
        description: 'Amateur cooks compete to create the best Hyderabadi biryani. Entry free for spectators, tasting included!',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
        category: 'Food',
        city: 'Hyderabad',
        venue: 'Shilparamam, Hitec City',
        date: getUpcomingDate(15),
        time: '11:00 AM',
        duration: '5 hours',
        price: 300,
        isFree: false,
        organizer: 'Hyderabad Foodies',
        attendees: 200,
        maxAttendees: 300,
        tags: ['food', 'biryani', 'competition', 'cooking']
    },
    // Chennai Events
    {
        id: 'evt-13',
        title: 'Classical Bharatanatyam Performance',
        subtitle: 'Celebrate Indian dance',
        description: 'Witness a stunning Bharatanatyam recital by renowned dancers at this cultural evening.',
        image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80',
        category: 'Dance',
        city: 'Chennai',
        venue: 'Music Academy, T Nagar',
        date: getUpcomingDate(8),
        time: '6:30 PM',
        duration: '2.5 hours',
        price: 500,
        isFree: false,
        organizer: 'Chennai Cultural Academy',
        attendees: 320,
        maxAttendees: 400,
        tags: ['dance', 'classical', 'culture', 'bharatanatyam']
    },
    // Kerala Events
    {
        id: 'evt-14',
        title: 'Backwater Kayaking Meetup',
        subtitle: 'Paddle through paradise',
        description: 'Group kayaking expedition through the scenic Alleppey backwaters. All skill levels welcome.',
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80',
        category: 'Adventure',
        city: 'Alleppey',
        venue: 'Lake Canoe Station',
        date: getUpcomingDate(6),
        time: '6:30 AM',
        duration: '4 hours',
        price: 1500,
        isFree: false,
        organizer: 'Kerala Adventure Club',
        attendees: 22,
        maxAttendees: 30,
        tags: ['adventure', 'kayaking', 'nature', 'backwaters']
    },
    // Rishikesh Events  
    {
        id: 'evt-15',
        title: 'International Yoga Festival',
        subtitle: 'Global yoga gathering',
        description: 'Week-long yoga festival with workshops, meditation, and teachings from international yoga masters.',
        image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
        category: 'Wellness',
        city: 'Rishikesh',
        venue: 'Parmarth Niketan Ashram',
        date: getUpcomingDate(45),
        time: '5:00 AM',
        duration: '7 days',
        price: 15000,
        isFree: false,
        organizer: 'Parmarth Niketan',
        attendees: 850,
        maxAttendees: 1000,
        tags: ['yoga', 'festival', 'meditation', 'wellness']
    }
];

// Helper function to generate upcoming dates
function getUpcomingDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

// Get all events
function getAllEvents() {
    return EVENTS_DATA.map(event => ({
        ...event,
        date: getUpcomingDate(parseInt(event.date?.split('-')[2]) || Math.floor(Math.random() * 30) + 1)
    }));
}

// Get events by city
function getEventsByCity(city) {
    const searchTerm = city.toLowerCase();
    return EVENTS_DATA.filter(event =>
        event.city.toLowerCase().includes(searchTerm)
    );
}

// Get events by category
function getEventsByCategory(category) {
    const searchTerm = category.toLowerCase();
    return EVENTS_DATA.filter(event =>
        event.category.toLowerCase().includes(searchTerm)
    );
}

// Search events
function searchEvents(query, city = null, category = null) {
    let events = [...EVENTS_DATA];

    if (city) {
        events = events.filter(e => e.city.toLowerCase().includes(city.toLowerCase()));
    }

    if (category) {
        events = events.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (query) {
        const searchTerm = query.toLowerCase();
        events = events.filter(event =>
            event.title.toLowerCase().includes(searchTerm) ||
            event.subtitle.toLowerCase().includes(searchTerm) ||
            event.tags.some(tag => tag.includes(searchTerm))
        );
    }

    // Update dates to be in the future
    return events.map((event, index) => ({
        ...event,
        date: getUpcomingDate((index + 1) * 3)
    }));
}

// Get event categories
function getEventCategories() {
    const categories = [...new Set(EVENTS_DATA.map(e => e.category))];
    return categories;
}

// Get cities with events
function getCitiesWithEvents() {
    const cities = [...new Set(EVENTS_DATA.map(e => e.city))];
    return cities;
}

module.exports = {
    EVENTS_DATA,
    getAllEvents,
    getEventsByCity,
    getEventsByCategory,
    searchEvents,
    getEventCategories,
    getCitiesWithEvents
};
