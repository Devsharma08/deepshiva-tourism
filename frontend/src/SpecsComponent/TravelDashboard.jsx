import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Building, Plane, MapPin, Search, Star,
    Navigation, ShieldCheck, AlertCircle, Filter,
    Calendar, Users, Sparkles, ArrowRight, Clock,
    Wifi, Coffee, Car, Waves, Dumbbell, Wind,
    ChevronLeft, Heart, Share2, X, CheckCircle,
    TrendingUp, Award, Globe, Palmtree, CreditCard,
    Phone, Mail, User, Check
} from 'lucide-react';
import { MapComponent } from './MapComponent';
import { cachedFetch } from '../utils/ContextManager';

// ==========================================
// BOOKING MODAL COMPONENT
// ==========================================
const BookingModal = ({ isOpen, onClose, item, type }) => {
    const [step, setStep] = useState(1); // 1=details, 2=payment, 3=success
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        paymentMethod: 'upi'
    });
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !item) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            setIsProcessing(true);
            // Simulate payment processing
            setTimeout(() => {
                setIsProcessing(false);
                setStep(3);
            }, 2000);
        }
    };

    const handleClose = () => {
        setStep(1);
        setFormData({ fullName: '', email: '', phone: '', paymentMethod: 'upi' });
        onClose();
    };

    const isHotel = type === 'hotel';
    const primaryColor = isHotel ? 'orange' : 'blue';
    const price = isHotel ? item.price : item.totalPrice;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r ${isHotel ? 'from-orange-500 to-amber-500' : 'from-blue-500 to-indigo-600'}`}>
                    <button onClick={handleClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-white">
                        {step === 3 ? 'Booking Confirmed!' : `Book ${isHotel ? item.name : `Flight ${item.flightNumber}`}`}
                    </h2>
                    <p className="text-white/80 mt-1">
                        {step === 1 && 'Enter traveler details'}
                        {step === 2 && 'Select payment method'}
                        {step === 3 && 'Your booking is confirmed'}
                    </p>
                </div>

                {/* Progress Steps */}
                {step < 3 && (
                    <div className="flex items-center justify-center gap-2 py-4 border-b">
                        {[1, 2].map(s => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s
                                    ? `bg-${primaryColor}-500 text-white`
                                    : 'bg-gray-100 text-gray-400'}`}>
                                    {step > s ? <Check className="w-4 h-4" /> : s}
                                </div>
                                {s < 2 && <div className={`w-12 h-1 rounded ${step > s ? `bg-${primaryColor}-500` : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 outline-none"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 outline-none"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 outline-none"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                            <button type="submit" className={`w-full py-4 mt-4 rounded-xl font-bold text-white bg-gradient-to-r ${isHotel ? 'from-orange-500 to-amber-500' : 'from-blue-500 to-indigo-600'} hover:scale-[1.02] transition-transform`}>
                                Continue to Payment
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total Amount</span>
                                    <span className="font-bold text-xl text-gray-800">₹{price?.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'upi', label: 'UPI / Google Pay / PhonePe', icon: '📱' },
                                    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                                    { id: 'netbanking', label: 'Net Banking', icon: '🏦' }
                                ].map(method => (
                                    <label key={method.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === method.id
                                        ? `border-${primaryColor}-500 bg-${primaryColor}-50`
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={formData.paymentMethod === method.id}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl">{method.icon}</span>
                                        <span className="font-semibold text-gray-700">{method.label}</span>
                                        {formData.paymentMethod === method.id && (
                                            <CheckCircle className={`w-5 h-5 ml-auto text-${primaryColor}-500`} />
                                        )}
                                    </label>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full py-4 mt-4 rounded-xl font-bold text-white bg-gradient-to-r ${isHotel ? 'from-orange-500 to-amber-500' : 'from-blue-500 to-indigo-600'} hover:scale-[1.02] transition-transform disabled:opacity-70 flex items-center justify-center gap-2`}
                            >
                                {isProcessing ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                                ) : (
                                    <>Pay ₹{price?.toLocaleString()}</>
                                )}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isHotel ? 'bg-green-100' : 'bg-green-100'}`}>
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Successful!</h3>
                            <p className="text-gray-500 mb-6">Confirmation sent to {formData.email}</p>

                            <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Booking ID</span>
                                    <span className="font-mono font-bold">#DS{Date.now().toString().slice(-8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">{isHotel ? 'Hotel' : 'Flight'}</span>
                                    <span className="font-semibold">{isHotel ? item.name : item.flightNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Amount Paid</span>
                                    <span className="font-bold text-green-600">₹{price?.toLocaleString()}</span>
                                </div>
                            </div>

                            <button onClick={handleClose} className="w-full py-4 rounded-xl font-bold text-white bg-gray-800 hover:bg-gray-900">
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// AUTOINPUT COMPONENT - Fixed Dropdown
// ==========================================
const AutoInput = ({ icon: Icon, placeholder, value, onChange, onSelect, type = 'city' }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = React.useRef(null);

    // Fetch suggestions when value changes
    useEffect(() => {
        if (!value || value.length < 2 || !showDropdown) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const endpoint = type === 'airport' ? '/api/airports' : '/api/suggestions';
                const param = type === 'airport' ? 'keyword' : 'query';
                const url = `http://localhost:5000${endpoint}?${param}=${encodeURIComponent(value)}`;

                console.log('🔍 Fetching suggestions:', url);

                const res = await axios.get(url, { timeout: 5000 });
                const results = type === 'airport' ? res.data?.airports : res.data?.suggestions;

                console.log('📋 Results:', results);

                if (Array.isArray(results)) {
                    const validResults = results.filter(item =>
                        item && (type === 'airport' ? item.iata : item.name)
                    );
                    setSuggestions(validResults);
                } else {
                    setSuggestions([]);
                }
            } catch (e) {
                console.error('❌ Fetch error:', e.message);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [value, showDropdown, type]);

    const handleSelect = (item) => {
        const val = type === 'airport' ? item.iata : item.name;
        onSelect(val);
        setSuggestions([]);
        setShowDropdown(false);
    };

    const isAirport = type === 'airport';
    const accentColor = isAirport ? 'blue' : 'orange';

    return (
        <div className="relative w-full" style={{ zIndex: isFocused ? 9999 : 1 }}>
            {/* Input Field */}
            <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${isFocused
                ? `ring-2 ring-${accentColor}-400 shadow-lg`
                : 'ring-1 ring-gray-200 hover:ring-gray-300'
                }`}>
                {Icon && (
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isFocused ? `text-${accentColor}-500` : 'text-gray-400'
                        }`}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                <input
                    ref={inputRef}
                    className="w-full pl-12 pr-4 py-4 bg-white font-semibold text-gray-700 placeholder:text-gray-400 outline-none"
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        setShowDropdown(true);
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        // Delay hiding to allow click on suggestion
                        setTimeout(() => setShowDropdown(false), 250);
                    }}
                />
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Dropdown - Positioned absolutely with high z-index */}
            {showDropdown && suggestions.length > 0 && (
                <div
                    className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-64 overflow-y-auto"
                    style={{
                        zIndex: 99999,
                        top: '100%',
                        position: 'absolute'
                    }}
                >
                    {suggestions.map((item, idx) => (
                        <div
                            key={item.iata || item.name || idx}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSelect(item);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAirport
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-orange-100 text-orange-600'
                                    }`}>
                                    {isAirport ? <Plane className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-gray-800 text-sm truncate">
                                        {isAirport
                                            ? `${item.city || 'Unknown'} (${item.iata || ''})`
                                            : item.name || 'Unknown'
                                        }
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {isAirport ? item.name : item.subtitle || ''}
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

                {/* Image Section - Fixed height and centering */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={hotel.image}
                        alt={hotel.name}
                        className={`w-full h-full object-cover object-center transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'
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
// FLIGHT CARD COMPONENT - Premium Design with Images
// ==========================================

// City to Unsplash image mapping for unique card backgrounds
const CITY_IMAGES = {
    'DEL': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', // Delhi
    'BOM': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80', // Mumbai
    'BLR': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80', // Bangalore
    'MAA': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', // Chennai
    'CCU': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80', // Kolkata
    'HYD': 'https://images.unsplash.com/photo-1572445271230-a78d4d184ab6?w=800&q=80', // Hyderabad
    'GOI': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', // Goa
    'JAI': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', // Jaipur
    'AMD': 'https://images.unsplash.com/photo-1609766934950-329a0e89bd0d?w=800&q=80', // Ahmedabad
    'COK': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', // Kochi
    'VNS': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', // Varanasi
    'UDR': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', // Udaipur
    'SXR': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80', // Srinagar
    'PNQ': 'https://images.unsplash.com/photo-1580477371194-4a7d48e10d0b?w=800&q=80', // Pune
    'DEFAULT': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' // Airplane
};

const FlightCard = ({ flight, isSelected, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Get image based on destination city
    const destCode = flight.arrival?.iataCode || 'DEFAULT';
    const cardImage = CITY_IMAGES[destCode] || CITY_IMAGES['DEFAULT'];

    // Format time for display
    const formatTime = (isoString) => {
        if (!isoString) return '--:--';
        return isoString.split('T')[1]?.slice(0, 5) || '--:--';
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group cursor-pointer transition-all duration-500 ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
        >
            <div className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 ${isSelected
                ? 'border-blue-400 shadow-2xl shadow-blue-500/20'
                : 'border-white/50 shadow-lg shadow-gray-200/50 hover:border-blue-200 hover:shadow-xl'
                }`}>

                {/* Destination Image Header */}
                <div className="relative h-32 overflow-hidden">
                    <img
                        src={cardImage}
                        alt={destCode}
                        className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Airline Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Plane className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-bold text-sm text-gray-800">{flight.airline}</span>
                    </div>

                    {/* Flight Number Badge */}
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <span className="text-xs font-bold text-white">{flight.flightNumber}</span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-700">{flight.duration}</span>
                    </div>
                </div>

                {/* Route Details */}
                <div className="p-5 bg-white">
                    {/* Time and Airport Row */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Departure */}
                        <div className="text-left">
                            <div className="text-2xl font-black text-gray-800">{formatTime(flight.departure?.at)}</div>
                            <div className="text-lg font-bold text-blue-600">{flight.departure?.iataCode}</div>
                        </div>

                        {/* Flight Path */}
                        <div className="flex-1 mx-4 relative py-2">
                            <div className="h-0.5 bg-gradient-to-r from-blue-300 via-blue-500 to-indigo-300 rounded-full" />
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full border-2 border-blue-300 shadow">
                                <Plane className={`w-4 h-4 text-blue-500 rotate-90 transition-transform duration-500 ${isHovered ? 'translate-x-1' : ''}`} />
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${flight.segments === 1 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {flight.segments === 1 ? 'Non-stop' : '1 Stop'}
                                </span>
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-right">
                            <div className="text-2xl font-black text-gray-800">{formatTime(flight.arrival?.at)}</div>
                            <div className="text-lg font-bold text-blue-600">{flight.arrival?.iataCode}</div>
                        </div>
                    </div>

                    {/* Footer with Amenities and Price */}
                    <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-100">
                        <div className="flex gap-3">
                            {flight.mealsIncluded && (
                                <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                    <Coffee className="w-3.5 h-3.5" />
                                    <span className="text-xs">Meals</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                <Wifi className="w-3.5 h-3.5" />
                                <span className="text-xs">WiFi</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase tracking-wide">from</div>
                            <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                ₹{flight.totalPrice?.toLocaleString()}
                            </div>
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

    // Booking Modal State
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingItem, setBookingItem] = useState(null);

    // Inputs
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const [hotelCity, setHotelCity] = useState('');
    const [flightData, setFlightData] = useState({ origin: '', destination: '', date: getTodayDate() });

    // Open booking modal
    const handleBookNow = (item) => {
        setBookingItem(item);
        setIsBookingOpen(true);
    };

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
                                    <div className="flex flex-row gap-3 w-full">
                                        <div className="flex-1">
                                            <AutoInput
                                                type="airport"
                                                icon={Plane}
                                                placeholder="From (DEL)"
                                                value={flightData.origin}
                                                onChange={(val) => setFlightData({ ...flightData, origin: val })}
                                                onSelect={(val) => setFlightData({ ...flightData, origin: val })}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <AutoInput
                                                type="airport"
                                                icon={MapPin}
                                                placeholder="To (BOM)"
                                                value={flightData.destination}
                                                onChange={(val) => setFlightData({ ...flightData, destination: val })}
                                                onSelect={(val) => setFlightData({ ...flightData, destination: val })}
                                            />
                                        </div>
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
                                    <button
                                        onClick={() => handleBookNow(selectedItem)}
                                        className="w-full py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
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
                                    <button
                                        onClick={() => handleBookNow(selectedItem)}
                                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
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

            {/* Booking Modal */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                item={bookingItem}
                type={activeTab === 'hotels' ? 'hotel' : 'flight'}
            />
        </div>
    );
};

export default TravelDashboard;