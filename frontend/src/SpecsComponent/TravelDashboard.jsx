import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Building, Plane, MapPin, Search, Star,
    Navigation, ShieldCheck, AlertCircle, Filter,
    Calendar, Users, Sparkles, ArrowRight, Clock,
    Wifi, Coffee, Car, Waves, Dumbbell, Wind,
    ChevronLeft, Heart, Share2, X, CheckCircle,
    TrendingUp, Award, Globe, Palmtree
} from 'lucide-react';
import { MapComponent } from './MapComponent';

// ==========================================
// AUTOINPUT COMPONENT - Enhanced with Indian Theme
// ==========================================
const AutoInput = ({ icon: Icon, placeholder, value, onChange, onSelect, type = 'city' }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [show, setShow] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (value && value.length > 2 && show) {
                try {
                    const endpoint = type === 'airport' ? '/api/airports' : '/api/suggestions';
                    const param = type === 'airport' ? 'keyword' : 'query';
                    const res = await axios.get(`http://localhost:5000${endpoint}?${param}=${value}`);
                    const results = type === 'airport' ? res.data.airports : res.data.suggestions;
                    setSuggestions(Array.isArray(results) ? results : []);
                } catch (e) {
                    setSuggestions([]);
                }
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [value, show, type]);

    return (
        <div className="relative w-full z-50 group">
            <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${isFocused
                ? 'ring-2 ring-orange-400/50 shadow-lg shadow-orange-500/10'
                : 'ring-1 ring-white/20 hover:ring-orange-300/30'
                }`}>
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl" />

                {Icon && (
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused ? 'text-orange-500 scale-110' : 'text-amber-600/60'
                        }`}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                <input
                    className="relative w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm font-semibold text-gray-700 placeholder:text-gray-400 outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setShow(true);
                    }}
                    onFocus={() => { setShow(true); setIsFocused(true); }}
                    onBlur={() => { setTimeout(() => setShow(false), 200); setIsFocused(false); }}
                />
            </div>

            {show && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-orange-500/10 border border-orange-100 max-h-60 overflow-y-auto z-[100] animate-in slide-in-from-top-2 duration-200">
                    {suggestions.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 cursor-pointer border-b border-orange-50 last:border-0 transition-all duration-200 group"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                const val = type === 'airport' ? item.iata : item.name;
                                onSelect(val);
                                setShow(false);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center group-hover:from-orange-200 group-hover:to-amber-200 transition-all">
                                    {type === 'airport' ? <Plane className="w-5 h-5 text-orange-600" /> : <MapPin className="w-5 h-5 text-orange-600" />}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800 text-sm">
                                        {type === 'airport' ? `${item.city} (${item.iata})` : item.name}
                                    </div>
                                    <div className="text-xs text-gray-400 truncate">
                                        {type === 'airport' ? item.name : item.subtitle}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================
// HOTEL CARD COMPONENT - Premium Design
// ==========================================
const HotelCard = ({ hotel, isSelected, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group cursor-pointer transition-all duration-500 ${isSelected
                ? 'scale-[1.02]'
                : 'hover:scale-[1.01]'
                }`}
        >
            {/* Card Container */}
            <div className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 ${isSelected
                ? 'border-orange-400 shadow-2xl shadow-orange-500/20 bg-gradient-to-br from-orange-50 to-amber-50'
                : 'border-white/50 shadow-lg shadow-gray-200/50 bg-white hover:border-orange-200 hover:shadow-xl'
                }`}>

                {/* Image Section */}
                <div className="relative h-44 overflow-hidden">
                    <img
                        src={hotel.image}
                        alt={hotel.name}
                        className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                            }`}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-gray-800">{hotel.rating}</span>
                    </div>

                    {/* Like Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                        <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>

                    {/* Quick Info Overlay - Shows on Hover */}
                    <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}>
                        <div className="flex gap-2 flex-wrap">
                            {hotel.amenities?.slice(0, 3).map((am, i) => (
                                <span key={i} className="text-xs bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-lg font-medium">
                                    {am}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-orange-700 transition-colors">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="line-clamp-1">{hotel.location?.address}</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">per night</div>
                            <div className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                ₹{hotel.price?.toLocaleString()}
                            </div>
                        </div>
                        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${isSelected
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                            }`}>
                            {isSelected ? 'Selected' : 'View'}
                            <ArrowRight className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// FLIGHT CARD COMPONENT - Premium Design
// ==========================================
const FlightCard = ({ flight, isSelected, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group cursor-pointer transition-all duration-500 ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
        >
            <div className={`relative overflow-hidden rounded-3xl border-2 p-6 transition-all duration-500 ${isSelected
                ? 'border-blue-400 shadow-2xl shadow-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50'
                : 'border-white/50 shadow-lg shadow-gray-200/50 bg-white hover:border-blue-200 hover:shadow-xl'
                }`}>

                {/* Airline & Duration Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">{flight.airline}</div>
                            <div className="text-xs text-gray-400">{flight.flightNumber || 'Direct Flight'}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-700">{flight.duration}</span>
                    </div>
                </div>

                {/* Route Visualization */}
                <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-black text-gray-800">{flight.departure?.iataCode}</div>
                        <div className="text-sm font-bold text-gray-500">
                            {flight.departure?.at?.split('T')[1]?.slice(0, 5)}
                        </div>
                    </div>

                    <div className="flex-1 mx-6 relative">
                        <div className="h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-200 rounded-full" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border-2 border-blue-200 shadow-md">
                            <Plane className={`w-4 h-4 text-blue-500 rotate-90 transition-transform duration-700 ${isHovered ? 'translate-x-2' : ''}`} />
                        </div>
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${flight.segments === 1
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}>
                                {flight.segments === 1 ? 'Non-stop' : '1 Stop'}
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-black text-gray-800">{flight.arrival?.iataCode}</div>
                        <div className="text-sm font-bold text-gray-500">
                            {flight.arrival?.at?.split('T')[1]?.slice(0, 5)}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-end justify-between mt-8 pt-4 border-t border-gray-100">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Wifi className="w-4 h-4" />
                            <span className="text-xs">WiFi</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Coffee className="w-4 h-4" />
                            <span className="text-xs">Meals</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Starting from</div>
                        <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ₹{flight.totalPrice?.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
const TravelDashboard = () => {
    const [activeTab, setActiveTab] = useState('hotels');

    // Data & UI State
    const [hotels, setHotels] = useState([]);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // Filters & Pagination
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('recommended');

    // Selection
    const [selectedItem, setSelectedItem] = useState(null);
    const [userLoc, setUserLoc] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);

    // Inputs
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const [hotelCity, setHotelCity] = useState('');
    const [flightData, setFlightData] = useState({ origin: '', destination: '', date: getTodayDate() });

    // GPS Location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setUserLoc({ lat: 28.6139, lng: 77.2090 })
            );
        } else setUserLoc({ lat: 28.6139, lng: 77.2090 });
    }, []);

    // Routing Logic
    useEffect(() => {
        if (selectedItem?.location?.lat && userLoc && activeTab === 'hotels') {
            axios.post('http://localhost:5000/api/route', {
                userLocation: userLoc,
                destLocation: { lat: selectedItem.location.lat, lng: selectedItem.location.lng }
            })
                .then(res => setRouteInfo(res.data))
                .catch(() => setRouteInfo(null));
        } else setRouteInfo(null);
    }, [selectedItem, userLoc, activeTab]);

    // Reset on Tab Switch
    useEffect(() => {
        setSelectedItem(null);
        setErrorMsg(null);
        setHotels([]);
        setFlights([]);
        setPage(1);
        setFilter('recommended');
        setSearchPerformed(false);
    }, [activeTab]);

    // Search Handler
    const handleSearch = async (isNewSearch = true) => {
        if (isNewSearch) { setPage(1); setHotels([]); setFlights([]); setSearchPerformed(true); }
        setLoading(true); setSelectedItem(null); setErrorMsg(null);

        try {
            if (activeTab === 'hotels') {
                if (!hotelCity) throw new Error("Please enter a city name");
                const res = await axios.get(`http://localhost:5000/api/hotels/search`, {
                    params: { city: hotelCity, page: isNewSearch ? 1 : page + 1 }
                });
                setHotels(prev => isNewSearch ? res.data.hotels : [...prev, ...res.data.hotels]);
                if (!isNewSearch) setPage(p => p + 1);
            } else {
                if (!flightData.origin || !flightData.destination) throw new Error("Please select airports");
                const res = await axios.get(`http://localhost:5000/api/flights/search`, { params: { ...flightData } });
                setFlights(res.data.flights || []);
            }
        } catch (e) {
            console.error(e);
            setErrorMsg(e.message || "Unable to connect to server");
        }
        setLoading(false);
    };

    // Filter Logic
    const getSortedData = () => {
        let data = activeTab === 'hotels' ? [...hotels] : [...flights];
        data = data.filter(item => item && (activeTab === 'hotels' ? item.price : item.totalPrice));

        if (filter === 'price_low') {
            data.sort((a, b) => (activeTab === 'hotels' ? a.price - b.price : a.totalPrice - b.totalPrice));
        } else if (filter === 'price_high') {
            data.sort((a, b) => (activeTab === 'hotels' ? b.price - a.price : b.totalPrice - a.totalPrice));
        } else if (filter === 'rating' && activeTab === 'hotels') {
            data.sort((a, b) => b.rating - a.rating);
        }
        return data;
    };
    const displayData = getSortedData();

    // Amenity Icons
    const amenityIcons = {
        'WiFi': Wifi, 'Pool': Waves, 'Gym': Dumbbell, 'Parking': Car,
        'Breakfast': Coffee, 'AC': Wind, 'Default': CheckCircle
    };

    return (
        <div className="flex flex-row h-screen w-full overflow-hidden font-sans">

            {/* ==================== LEFT PANEL ==================== */}
            <div className="w-[45%] flex flex-col h-full relative">

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50" />
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
                                      radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)`
                }} />

                {/* Content - Single scrollable container for everything */}
                <div className="relative z-10 h-full overflow-y-auto">

                    {/* All content scrolls together */}
                    <div className="p-6 space-y-4">

                        {/* Logo & Title */}
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10" />
                                <Globe className="w-6 h-6 text-white relative z-10" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-gray-800">
                                    Deep<span className="text-transparent bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text">Shiva</span>
                                </h1>
                                <p className="text-xs text-gray-500 font-medium">Discover Incredible India ✨</p>
                            </div>
                        </div>

                        {/* Tab Switcher - Premium Design */}
                        <div className="relative bg-white/60 backdrop-blur-xl p-1.5 rounded-2xl shadow-lg shadow-orange-500/5 border border-white/50">
                            <div className="flex relative">
                                {/* Animated Background Pill */}
                                <div
                                    className={`absolute top-0 h-full w-1/2 rounded-xl bg-gradient-to-r transition-all duration-500 ease-out shadow-lg ${activeTab === 'hotels'
                                        ? 'left-0 from-orange-500 to-amber-500 shadow-orange-500/30'
                                        : 'left-1/2 from-blue-500 to-indigo-500 shadow-blue-500/30'
                                        }`}
                                />

                                {[
                                    { id: 'hotels', icon: Building, label: 'Hotels & Stays' },
                                    { id: 'flights', icon: Plane, label: 'Flights' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                            ? 'text-white'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Section */}
                        <div className="space-y-3">
                            {activeTab === 'hotels' ? (
                                <>
                                    <AutoInput
                                        icon={MapPin}
                                        placeholder="Where would you like to stay?"
                                        value={hotelCity}
                                        onChange={setHotelCity}
                                        onSelect={setHotelCity}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        <AutoInput
                                            type="airport"
                                            icon={Plane}
                                            placeholder="From (DEL)"
                                            value={flightData.origin}
                                            onChange={(val) => setFlightData({ ...flightData, origin: val })}
                                            onSelect={(val) => setFlightData({ ...flightData, origin: val })}
                                        />
                                        <AutoInput
                                            type="airport"
                                            icon={MapPin}
                                            placeholder="To (BOM)"
                                            value={flightData.destination}
                                            onChange={(val) => setFlightData({ ...flightData, destination: val })}
                                            onSelect={(val) => setFlightData({ ...flightData, destination: val })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                                        <input
                                            type="date"
                                            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                            value={flightData.date}
                                            onChange={e => setFlightData({ ...flightData, date: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Search Button */}
                            <button
                                onClick={() => handleSearch(true)}
                                disabled={loading}
                                className={`w-full py-3 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 ${activeTab === 'hotels'
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02]'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        <span>{activeTab === 'hotels' ? 'Find Amazing Stays' : 'Search Flights'}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Filter Pills - Scrolls with content */}
                        {displayData.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
                                <div className="flex items-center text-gray-400 mr-1">
                                    <Filter className="w-4 h-4" />
                                </div>
                                {[
                                    { id: 'recommended', label: 'Recommended', icon: Sparkles },
                                    { id: 'price_low', label: 'Price: Low', icon: TrendingUp },
                                    { id: 'price_high', label: 'Price: High', icon: TrendingUp },
                                    { id: 'rating', label: 'Top Rated', icon: Award }
                                ].map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFilter(f.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-all duration-300 ${filter === f.id
                                            ? activeTab === 'hotels'
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white/80'
                                            }`}
                                    >
                                        <f.icon className="w-3 h-3" />
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Results Section - Now part of the same scrollable container */}
                        <div className="space-y-3 pb-4">

                            {/* Loading State */}
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${activeTab === 'hotels'
                                        ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                                        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                                        }`}>
                                        <Search className="w-8 h-8 text-white animate-pulse" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700">Finding the best options...</h3>
                                    <p className="text-gray-400 text-sm">This may take a moment</p>
                                </div>
                            )}

                            {/* Error State */}
                            {!loading && errorMsg && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                        <AlertCircle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700 mb-2">Oops! Something went wrong</h3>
                                    <p className="text-red-500 text-sm">{errorMsg}</p>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !errorMsg && !searchPerformed && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${activeTab === 'hotels'
                                        ? 'bg-gradient-to-br from-orange-100 to-amber-100'
                                        : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                                        }`}>
                                        {activeTab === 'hotels'
                                            ? <Palmtree className="w-12 h-12 text-orange-400" />
                                            : <Plane className="w-12 h-12 text-blue-400" />
                                        }
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {activeTab === 'hotels' ? 'Find Your Perfect Stay' : 'Book Your Flight'}
                                    </h3>
                                    <p className="text-gray-500 max-w-xs">
                                        {activeTab === 'hotels'
                                            ? 'Search from thousands of hotels across India'
                                            : 'Compare prices and find the best deals on flights'
                                        }
                                    </p>
                                </div>
                            )}

                            {/* No Results */}
                            {!loading && !errorMsg && searchPerformed && displayData.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <Search className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700 mb-2">No results found</h3>
                                    <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                                </div>
                            )}

                            {/* Hotel Cards */}
                            {!loading && activeTab === 'hotels' && displayData.map(hotel => (
                                <HotelCard
                                    key={hotel.id}
                                    hotel={hotel}
                                    isSelected={selectedItem?.id === hotel.id}
                                    onClick={() => setSelectedItem(hotel)}
                                />
                            ))}

                            {/* Flight Cards */}
                            {!loading && activeTab === 'flights' && displayData.map(flight => (
                                <FlightCard
                                    key={flight.id}
                                    flight={flight}
                                    isSelected={selectedItem?.id === flight.id}
                                    onClick={() => setSelectedItem(flight)}
                                />
                            ))}

                            {/* Load More Button */}
                            {!loading && activeTab === 'hotels' && displayData.length > 0 && (
                                <button
                                    onClick={() => handleSearch(false)}
                                    className="w-full py-4 rounded-2xl border-2 border-dashed border-orange-200 text-orange-500 font-bold hover:bg-orange-50 hover:border-orange-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Load More Results
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== RIGHT PANEL - DETAILS ==================== */}
            <div className="w-[55%] h-full bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">

                {selectedItem ? (
                    <div className="h-full overflow-y-auto">

                        {/* HOTEL DETAILS */}
                        {activeTab === 'hotels' && (
                            <>
                                {/* Hero Image */}
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={selectedItem.image}
                                        alt={selectedItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                    {/* Back Button */}
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>

                                    {/* Action Buttons */}
                                    <div className="absolute top-6 right-6 flex gap-3">
                                        <button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                        <button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Hotel Info Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex items-center gap-1.5 bg-amber-400 px-3 py-1.5 rounded-full">
                                                <Star className="w-4 h-4 fill-white text-white" />
                                                <span className="text-sm font-bold text-white">{selectedItem.rating}</span>
                                            </div>
                                            <span className="text-white/80 text-sm">Excellent</span>
                                        </div>
                                        <h1 className="text-4xl font-black text-white mb-2">{selectedItem.name}</h1>
                                        <div className="flex items-center gap-2 text-white/90">
                                            <MapPin className="w-5 h-5" />
                                            <span>{selectedItem.location?.address}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    {/* Price Card */}
                                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 mb-8 shadow-xl shadow-orange-500/20">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-white/80 text-sm font-medium mb-1">Starting from</p>
                                                <div className="text-4xl font-black text-white">
                                                    ₹{selectedItem.price?.toLocaleString()}
                                                    <span className="text-lg font-medium text-white/80 ml-2">/ night</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                                <span className="text-white font-bold">Available</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amenities Grid */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-orange-500" />
                                            Amenities
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {selectedItem.amenities?.map((am, i) => {
                                                const IconComponent = amenityIcons[am] || amenityIcons['Default'];
                                                return (
                                                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                                                            <IconComponent className="w-5 h-5 text-orange-600" />
                                                        </div>
                                                        <span className="font-semibold text-gray-700 text-sm">{am}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Map Section */}
                                    {selectedItem.location?.lat && (
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <Navigation className="w-5 h-5 text-orange-500" />
                                                Location
                                            </h3>
                                            <div className="h-56 w-full bg-gray-200 rounded-3xl overflow-hidden relative border border-gray-200">
                                                <MapComponent
                                                    userLocation={userLoc}
                                                    destCoords={selectedItem.location}
                                                    routeData={routeInfo}
                                                />
                                                {routeInfo && (
                                                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                                                <Navigation className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400 font-medium">Distance</p>
                                                                <p className="font-bold text-gray-800">{routeInfo.duration} min • {routeInfo.distance} km</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Book Now Button */}
                                    <button className="w-full py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                        <ShieldCheck className="w-6 h-6" />
                                        Book Now • Secure Payment
                                    </button>
                                </div>
                            </>
                        )}

                        {/* FLIGHT DETAILS */}
                        {activeTab === 'flights' && (
                            <>
                                {/* Hero Section */}
                                <div className="relative h-64 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 overflow-hidden">
                                    {/* Decorative Elements */}
                                    <div className="absolute inset-0">
                                        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                        <div className="absolute bottom-0 right-10 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl" />
                                    </div>

                                    {/* Back Button */}
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>

                                    {/* Flight Info */}
                                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                <Plane className="w-7 h-7" />
                                            </div>
                                        </div>
                                        <h1 className="text-3xl font-black mb-2">{selectedItem.airline}</h1>
                                        <p className="text-white/80">Flight {selectedItem.flightNumber || 'Details'}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    {/* Flight Route Card */}
                                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="text-center">
                                                <div className="text-5xl font-black text-gray-800">{selectedItem.departure?.iataCode}</div>
                                                <div className="text-lg font-bold text-gray-400 mt-2">
                                                    {selectedItem.departure?.at?.split('T')[1]?.slice(0, 5)}
                                                </div>
                                            </div>

                                            <div className="flex-1 mx-8 relative">
                                                <div className="h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-200 rounded-full" />
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full border-2 border-blue-200 shadow-md">
                                                    <Plane className="w-6 h-6 text-blue-500 rotate-90" />
                                                </div>
                                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
                                                    <div className="text-sm font-bold text-blue-600">{selectedItem.duration}</div>
                                                    <div className={`text-xs font-bold px-3 py-1 rounded-full mt-1 ${selectedItem.segments === 1
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {selectedItem.segments === 1 ? 'Non-stop' : '1 Stop'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <div className="text-5xl font-black text-gray-800">{selectedItem.arrival?.iataCode}</div>
                                                <div className="text-lg font-bold text-gray-400 mt-2">
                                                    {selectedItem.arrival?.at?.split('T')[1]?.slice(0, 5)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Card */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 mb-8 shadow-xl shadow-blue-500/20">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-white/80 text-sm font-medium mb-1">Total Price</p>
                                                <div className="text-4xl font-black text-white">
                                                    ₹{selectedItem.totalPrice?.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                                <Users className="w-5 h-5 text-white" />
                                                <span className="text-white font-bold">1 Passenger</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Included Services */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            Included Services
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { icon: Wifi, label: 'Free WiFi' },
                                                { icon: Coffee, label: 'Complimentary Meals' },
                                                { icon: ShieldCheck, label: 'Travel Insurance' },
                                                { icon: Sparkles, label: 'Priority Check-in' }
                                            ].map((service, i) => (
                                                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                        <service.icon className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <span className="font-semibold text-gray-700 text-sm">{service.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Book Now Button */}
                                    <button className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                        <Plane className="w-6 h-6" />
                                        Book Flight • Secure Payment
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="relative mb-8">
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${activeTab === 'hotels'
                                ? 'bg-gradient-to-br from-orange-100 to-amber-100'
                                : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                                }`}>
                                {activeTab === 'hotels'
                                    ? <Building className="w-16 h-16 text-orange-300" />
                                    : <Plane className="w-16 h-16 text-blue-300" />
                                }
                            </div>
                            {/* Decorative rings */}
                            <div className={`absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow ${activeTab === 'hotels' ? 'border-orange-200' : 'border-blue-200'
                                }`} style={{ animationDuration: '20s' }} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            {activeTab === 'hotels' ? 'Select a Hotel' : 'Select a Flight'}
                        </h2>
                        <p className="text-gray-500 max-w-sm">
                            {activeTab === 'hotels'
                                ? 'Click on any hotel from the list to view detailed information, amenities, and book your stay.'
                                : 'Click on any flight from the list to view full details and book your ticket.'
                            }
                        </p>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-3 gap-4 mt-10">
                            {[
                                { icon: ShieldCheck, label: 'Secure Booking' },
                                { icon: Award, label: 'Best Prices' },
                                { icon: Globe, label: 'Pan India' }
                            ].map((feature, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeTab === 'hotels'
                                        ? 'bg-gradient-to-br from-orange-100 to-amber-100'
                                        : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                                        }`}>
                                        <feature.icon className={`w-6 h-6 ${activeTab === 'hotels' ? 'text-orange-500' : 'text-blue-500'
                                            }`} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelDashboard;