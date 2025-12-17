import React, { useState, useEffect, useCallback, useRef } from 'react';
import LocationCard from './LocationCard';
import { searchPlaces, CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/overpassService';

function DestinationPanel({
    destinations,
    onAddToSchedule,
    onDestinationClick,
    onDestinationHover,
    onOptimize,
    isOptimizing,
    tripDays,
    onAddNewDestination,
    searchLocation = { lat: 27.1767, lon: 78.0081 }, // Default to Agra
    isLoading = false,
    loadError = null
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [draggedItem, setDraggedItem] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [activeTab, setActiveTab] = useState('unscheduled');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const searchTimeoutRef = useRef(null);

    // Filter destinations based on search
    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Debounced API search using Overpass
    const performSearch = useCallback(async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            // Overpass API searchPlaces returns already transformed results
            const results = await searchPlaces(
                query,
                searchLocation.lat,
                searchLocation.lon,
                50000, // 50km radius
                15     // Max results
            );

            // Filter out places already in destinations
            const filteredResults = results.filter(
                result => !destinations.some(d => d.id === result.id || d.name === result.name)
            );

            setSearchResults(filteredResults);
        } catch (error) {
            console.error('Search error:', error);
            setSearchError('Failed to search places. Please try again.');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchLocation, destinations]);

    // Handle search input with debouncing (longer delay to avoid rate limits)
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Only search with 3+ characters and after longer debounce
        if (searchQuery.length > 2) {
            searchTimeoutRef.current = setTimeout(() => {
                performSearch(searchQuery);
            }, 1500); // 1.5s debounce to avoid rate limits
        } else {
            setSearchResults([]);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, performSearch]);

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
                            setShowSearchResults(e.target.value.length > 2);
                        }}
                        onFocus={() => setShowSearchResults(searchQuery.length > 2)}
                        placeholder="Search or add new destination (3+ chars)..."
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
                    {showSearchResults && (isSearching || searchResults.length > 0 || searchError) && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                            <div className="p-2 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50/30 flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">
                                    {isSearching ? '🔍 Searching...' : `Found ${searchResults.length} places`}
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    OpenStreetMap
                                </span>
                            </div>

                            {/* Loading Spinner */}
                            {isSearching && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                        <span className="text-sm text-gray-500">Finding attractions...</span>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {searchError && !isSearching && (
                                <div className="p-4 text-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-xl">⚠️</span>
                                    </div>
                                    <p className="text-sm text-red-600">{searchError}</p>
                                    <button
                                        onClick={() => performSearch(searchQuery)}
                                        className="mt-2 text-xs text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            {/* Results List */}
                            {!isSearching && !searchError && searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleAddFromSearch(result)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 transition-colors text-left border-b border-gray-50 last:border-b-0 group"
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={result.thumbnail}
                                            alt={result.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">{result.name}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[result.category] || 'bg-gray-100 text-gray-700'}`}>
                                                {categoryIcons[result.category] || '📍'} {result.category}
                                            </span>
                                            {result.rating > 0 && (
                                                <span className="text-xs text-amber-600 flex items-center gap-0.5">
                                                    ★ {result.rating}
                                                </span>
                                            )}
                                        </div>
                                        {result.description && (
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{result.description}</p>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                        <svg className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                </button>
                            ))}

                            {/* No Results */}
                            {!isSearching && !searchError && searchResults.length === 0 && searchQuery.length > 1 && (
                                <div className="p-6 text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-xl">🔍</span>
                                    </div>
                                    <p className="text-sm text-gray-600">No places found for "{searchQuery}"</p>
                                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                                </div>
                            )}
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
                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-600 font-semibold text-lg">Loading Attractions...</p>
                        <p className="text-sm text-gray-400 mt-2 max-w-[220px]">
                            Fetching real-time data from OpenStreetMap
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Powered by Overpass API
                        </div>
                    </div>
                ) : loadError ? (
                    /* Error State */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <p className="text-gray-600 font-semibold text-lg">Unable to Load Places</p>
                        <p className="text-sm text-red-500 mt-2 max-w-[220px]">
                            {loadError}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                        >
                            🔄 Retry
                        </button>
                    </div>
                ) : filteredDestinations.length === 0 ? (
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
