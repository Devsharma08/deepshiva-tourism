import React, { useState } from 'react';
import LocationCard from './LocationCard';

// Searchable destinations database (simulating Google Places)
const searchableDestinations = [
    {
        id: 'search_001',
        name: 'Red Fort',
        category: 'landmark',
        thumbnail: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400',
        duration: 150,
        coordinates: { lat: 28.6562, lng: 77.2410 },
        openingHours: '09:30 - 16:30',
        description: 'A historic fort in the city of Delhi, served as the main residence of the Mughal Emperors.',
        ticketPrice: '₹35 (Indian) / ₹500 (Foreign)'
    },
    {
        id: 'search_002',
        name: 'India Gate',
        category: 'landmark',
        thumbnail: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=400',
        duration: 60,
        coordinates: { lat: 28.6129, lng: 77.2295 },
        openingHours: '24 Hours',
        description: 'A war memorial located astride the Rajpath, dedicated to soldiers who died in World War I.',
        ticketPrice: 'Free'
    },
    {
        id: 'search_003',
        name: 'Humayun\'s Tomb',
        category: 'landmark',
        thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
        duration: 90,
        coordinates: { lat: 28.5933, lng: 77.2507 },
        openingHours: '06:00 - 18:00',
        description: 'The tomb of the Mughal Emperor Humayun, a UNESCO World Heritage Site.',
        ticketPrice: '₹35 (Indian) / ₹550 (Foreign)'
    },
    {
        id: 'search_004',
        name: 'Qutub Minar',
        category: 'landmark',
        thumbnail: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
        duration: 90,
        coordinates: { lat: 28.5245, lng: 77.1855 },
        openingHours: '07:00 - 17:00',
        description: 'A minaret and victory tower that forms part of the Qutb complex, a UNESCO World Heritage Site.',
        ticketPrice: '₹35 (Indian) / ₹550 (Foreign)'
    },
    {
        id: 'search_005',
        name: 'Lotus Temple',
        category: 'landmark',
        thumbnail: 'https://images.unsplash.com/photo-1575999502951-4ab25fb1c8c9?w=400',
        duration: 60,
        coordinates: { lat: 28.5535, lng: 77.2588 },
        openingHours: '09:00 - 17:00 (Closed Monday)',
        description: 'A Bahá\'í House of Worship notable for its flower-like shape, surrounded by gardens.',
        ticketPrice: 'Free'
    },
    {
        id: 'search_006',
        name: 'Chandni Chowk',
        category: 'shopping',
        thumbnail: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400',
        duration: 180,
        coordinates: { lat: 28.6506, lng: 77.2301 },
        openingHours: '09:00 - 21:00',
        description: 'One of the oldest and busiest markets in Old Delhi, known for street food and wholesale goods.',
        ticketPrice: 'Free'
    },
    {
        id: 'search_007',
        name: 'National Museum',
        category: 'museum',
        thumbnail: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400',
        duration: 120,
        coordinates: { lat: 28.6117, lng: 77.2196 },
        openingHours: '10:00 - 18:00 (Closed Monday)',
        description: 'One of the largest museums in India, housing a collection of over 200,000 works of art.',
        ticketPrice: '₹20 (Indian) / ₹650 (Foreign)'
    },
    {
        id: 'search_008',
        name: 'Lodhi Garden',
        category: 'park',
        thumbnail: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=400',
        duration: 90,
        coordinates: { lat: 28.5932, lng: 77.2200 },
        openingHours: '06:00 - 20:00',
        description: 'A city park spread over 90 acres, containing works of architecture from the 15th century.',
        ticketPrice: 'Free'
    }
];

function DestinationPanel({
    destinations,
    onAddToSchedule,
    onDestinationClick,
    onDestinationHover,
    onOptimize,
    isOptimizing,
    tripDays,
    onAddNewDestination
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [draggedItem, setDraggedItem] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [activeTab, setActiveTab] = useState('unscheduled');

    // Filter destinations based on search
    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Search results from database
    const searchResults = searchQuery.length > 1
        ? searchableDestinations.filter(dest =>
            !destinations.some(d => d.id === dest.id) &&
            (dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : [];

    const handleDragStart = (e, destination) => {
        setDraggedItem(destination);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(destination));
        // Add drag image styling
        const dragImage = e.target.cloneNode(true);
        dragImage.style.opacity = '0.8';
        dragImage.style.transform = 'rotate(3deg)';
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleAddFromSearch = (destination) => {
        const newDest = {
            ...destination,
            priority: 'optional',
            scheduledDay: null,
            scheduledTime: null,
            website: null,
            hasConflict: false,
            conflictReason: null
        };
        if (onAddNewDestination) {
            onAddNewDestination(newDest);
        }
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const categoryColors = {
        landmark: 'bg-orange-100 text-orange-700 border-orange-200',
        museum: 'bg-blue-100 text-blue-700 border-blue-200',
        park: 'bg-green-100 text-green-700 border-green-200',
        restaurant: 'bg-red-100 text-red-700 border-red-200',
        shopping: 'bg-purple-100 text-purple-700 border-purple-200',
        hotel: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        temple: 'bg-amber-100 text-amber-700 border-amber-200',
        beach: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };

    const categoryIcons = {
        landmark: '🏛️',
        museum: '🏛️',
        park: '🌳',
        restaurant: '🍽️',
        shopping: '🛍️',
        hotel: '🏨',
        temple: '🛕',
        beach: '🏖️'
    };

    return (
        <div className="w-[30%] min-w-[320px] max-w-[400px] h-full flex flex-col bg-white/70 backdrop-blur-md border-r border-gray-200/50 shadow-xl">
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-white to-orange-50/30">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-sm">
                                📍
                            </span>
                            Destinations
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {destinations.length} {destinations.length === 1 ? 'place' : 'places'} to visit
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200 shadow-sm">
                            ✨ Drafting Board
                        </span>
                    </div>
                </div>

                {/* Search Bar with Autocomplete */}
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchResults(e.target.value.length > 1);
                        }}
                        onFocus={() => setShowSearchResults(searchQuery.length > 1)}
                        placeholder="Search or add new destination..."
                        className="w-full pl-10 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setShowSearchResults(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-64 overflow-y-auto z-50">
                            <div className="p-2 border-b border-gray-100 bg-gray-50">
                                <span className="text-xs font-medium text-gray-500">Add from suggestions</span>
                            </div>
                            {searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleAddFromSearch(result)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
                                >
                                    <img
                                        src={result.thumbnail}
                                        alt={result.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">{result.name}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[result.category]}`}>
                                                {categoryIcons[result.category]} {result.category}
                                            </span>
                                            <span className="text-xs text-gray-400">{Math.floor(result.duration / 60)}h {result.duration % 60}m</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Filter Pills */}
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                    {['All', 'Must-Visit', 'Optional'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeTab === filter.toLowerCase().replace('-', '')
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                                }`}
                            onClick={() => setActiveTab(filter.toLowerCase().replace('-', ''))}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Destinations List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {filteredDestinations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <span className="text-4xl">🎯</span>
                        </div>
                        <p className="text-gray-600 font-semibold text-lg">All Set!</p>
                        <p className="text-sm text-gray-400 mt-2 max-w-[200px]">
                            {searchQuery
                                ? 'No matches found. Try searching above to add new destinations.'
                                : 'All destinations are scheduled. Great job!'}
                        </p>
                        {!searchQuery && (
                            <button className="mt-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
                                + Add More Places
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Stats Bar */}
                        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4 border border-blue-100">
                            <div className="flex-1">
                                <div className="text-xs text-blue-600 font-medium">Est. Total Time</div>
                                <div className="text-lg font-bold text-blue-900">
                                    {Math.floor(filteredDestinations.reduce((acc, d) => acc + d.duration, 0) / 60)}h {filteredDestinations.reduce((acc, d) => acc + d.duration, 0) % 60}m
                                </div>
                            </div>
                            <div className="w-px h-8 bg-blue-200" />
                            <div className="flex-1">
                                <div className="text-xs text-blue-600 font-medium">Must-Visit</div>
                                <div className="text-lg font-bold text-blue-900">
                                    {filteredDestinations.filter(d => d.priority === 'must-visit').length}
                                </div>
                            </div>
                        </div>

                        {filteredDestinations.map((destination, index) => (
                            <div
                                key={destination.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, destination)}
                                onDragEnd={handleDragEnd}
                                onMouseEnter={() => onDestinationHover(destination)}
                                onMouseLeave={() => onDestinationHover(null)}
                                className={`cursor-grab active:cursor-grabbing transition-all duration-200 transform ${draggedItem?.id === destination.id
                                    ? 'opacity-50 scale-95 rotate-2'
                                    : 'hover:scale-[1.02]'
                                    }`}
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                            >
                                <LocationCard
                                    destination={destination}
                                    categoryColors={categoryColors}
                                    categoryIcons={categoryIcons}
                                    onClick={() => onDestinationClick(destination)}
                                    onQuickAdd={(day) => onAddToSchedule(destination.id, day)}
                                    tripDays={tripDays}
                                    showQuickAdd
                                />
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-white to-orange-50/30 space-y-3">
                {/* Optimize Button */}
                <button
                    onClick={onOptimize}
                    disabled={isOptimizing || destinations.length === 0}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${isOptimizing || destinations.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5'
                        }`}
                >
                    {isOptimizing ? (
                        <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>AI is optimizing your route...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Auto-Arrange All</span>
                            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">AI</span>
                        </>
                    )}
                </button>

                <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Optimizes based on location, timing & opening hours
                </p>
            </div>
        </div>
    );
}

export default DestinationPanel;
