import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import InteractiveMap from '../SpecsComponent/MapComponent';
import '../index.css'; 

const API_URL = 'http://localhost:5000/api';

// --- HELPER: Format Currency to Indian Rupee ---
const formatINR = (amount, currencyCode) => {
    if (!amount) return null;
    
    // If API returns USD/EUR, we can just show the symbol for now
    // But since you asked for Rupees specifically:
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currencyCode === 'INR' ? 'INR' : currencyCode || 'INR',
        maximumFractionDigits: 0
    });
    
    return formatter.format(amount);
};

// --- COMPONENTS ---
const LoadingSpinner = () => (
    <div className="loader-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '15px', color: '#64748b', fontWeight: 500 }}>Fetching live data...</p>
    </div>
);

const EmptyState = ({ title, message }) => (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: '#fff', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
        <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔍</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{title}</h3>
        <p style={{ margin: 0 }}>{message}</p>
    </div>
);

// --- FLIGHT SEARCH ---
const FlightSearch = () => {
    // 1. STATE PERSISTENCE: Check sessionStorage on load
    const savedState = JSON.parse(sessionStorage.getItem('flightState')) || {
        flights: [],
        params: { origin: 'DEL', destination: 'BOM', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
        searched: false
    };

    const [searchParams, setSearchParams] = useState(savedState.params);
    const [flights, setFlights] = useState(savedState.flights);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(savedState.searched);

    // Save to sessionStorage whenever flights change
    useEffect(() => {
        sessionStorage.setItem('flightState', JSON.stringify({ flights, params: searchParams, searched }));
    }, [flights, searchParams, searched]);

    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const query = new URLSearchParams(searchParams).toString();
            const res = await fetch(`${API_URL}/flights/search?${query}`);
            const data = await res.json();
            setFlights(data.flights || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in">
            <div className="header-section">
                <h2 className="section-title">✈️ Search Flights</h2>
                <p className="subtitle">Find the best deals for domestic and international travel.</p>
            </div>

            <div className="search-box">
                <div className="form-group">
                    <label>From</label>
                    <input className="form-input" value={searchParams.origin} onChange={e => setSearchParams({...searchParams, origin: e.target.value.toUpperCase()})} placeholder="DEL" />
                </div>
                <div className="form-group">
                    <label>To</label>
                    <input className="form-input" value={searchParams.destination} onChange={e => setSearchParams({...searchParams, destination: e.target.value.toUpperCase()})} placeholder="BOM" />
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input type="date" className="form-input" value={searchParams.date} onChange={e => setSearchParams({...searchParams, date: e.target.value})} />
                </div>
                <button className="btn-primary" onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Find Flights'}
                </button>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && searched && flights.length === 0 && (
                <EmptyState title="No Flights Found" message="Try changing your dates or airports (e.g., DEL to BOM)." />
            )}

            <div className="grid-auto">
                {flights.map((flight) => (
                    <div key={flight.id} className="card flight-card">
                        <div className="card-body">
                            <div className="flight-header">
                                <span className="badge airline-badge">{flight.airlineCode}</span>
                                <span className="price-tag">{formatINR(flight.price, flight.currency)}</span>
                            </div>
                            <div className="flight-route">
                                <div>
                                    <div className="city-code">{flight.origin}</div>
                                    <div className="time">{flight.departure?.at?.split('T')[1]?.substring(0,5)}</div>
                                </div>
                                <div className="route-line">
                                    <span className="duration">{flight.duration}</span>
                                    <div className="line"></div>
                                    <span className="flight-num">{flight.flightNumber}</span>
                                </div>
                                <div>
                                    <div className="city-code">{flight.destination}</div>
                                    <div className="time">{flight.arrival?.at?.split('T')[1]?.substring(0,5)}</div>
                                </div>
                            </div>
                            <button className="btn-secondary full-width">Select Flight</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- HOTEL SEARCH ---
const HotelSearch = () => {
    // 1. STATE PERSISTENCE
    const savedState = JSON.parse(sessionStorage.getItem('hotelState')) || {
        hotels: [],
        city: 'DEL',
        searched: false
    };

    const [city, setCity] = useState(savedState.city);
    const [hotels, setHotels] = useState(savedState.hotels);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(savedState.searched);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem('hotelState', JSON.stringify({ hotels, city, searched }));
    }, [hotels, city, searched]);

    const searchHotels = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`${API_URL}/hotels/search?cityCode=${city}`);
            const data = await res.json();
            setHotels(data.hotels || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in">
             <div className="header-section">
                <h2 className="section-title">🏨 Search Hotels</h2>
                <p className="subtitle">Luxury stays and budget accommodations across India.</p>
            </div>

            <div className="search-box">
                <div className="form-group" style={{ flex: 2 }}>
                    <label>Destination City</label>
                    <input 
                        className="form-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)} // User can type "Delhi" now
                        placeholder="Enter City Name (e.g. Delhi, Mumbai)"
                        onKeyDown={(e) => e.key === 'Enter' && searchHotels()}
                    />
                </div>
                <button className="btn-primary" onClick={searchHotels} disabled={loading}>
                    {loading ? 'Searching...' : 'Find Hotels'}
                </button>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && searched && hotels.length === 0 && (
                <EmptyState title="No Hotels Found" message={`We couldn't find any hotels in "${city}". Try "DEL" or "BOM".`} />
            )}

            <div className="grid-auto">
                {hotels.map((hotel) => (
                    <div 
                        key={hotel.id} 
                        className="card hotel-card" 
                        onClick={() => navigate(`/hotels/${hotel.id}`, { state: { hotel } })}
                    >
                        <div className="card-image-container">
                            <img src={hotel.image} alt={hotel.name} className="card-img" />
                            {hotel.rating && <span className="rating-badge">⭐ {hotel.rating}</span>}
                        </div>
                        <div className="card-body">
                            <h4 className="card-title">{hotel.name}</h4>
                            <p className="card-location">📍 {hotel.location.address}</p>
                            
                            <div className="card-footer">
                                {hotel.price ? (
                                    <div className="price-container">
                                        <span className="price-label">Starts from</span>
                                        <span className="price-value">{formatINR(hotel.price, hotel.currency)}</span>
                                    </div>
                                ) : (
                                    <span className="sold-out-badge">See Availability</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- HOTEL DETAILS ---
const HotelDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => { window.scrollTo(0, 0); }, []);

    if (!state?.hotel) return (
        <div className="container">
            <EmptyState title="No Selection" message="Please go back and select a hotel first." />
            <button className="btn-secondary" onClick={() => navigate('/hotels')}>Back to Search</button>
        </div>
    );

    const { hotel } = state;

    return (
        <div className="container fade-in">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back to Results</button>
            
            <div className="details-grid">
                {/* Left Content */}
                <div className="details-content">
                    <h1 className="details-title">{hotel.name}</h1>
                    <p className="details-address">📍 {hotel.location.address}</p>
                    
                    <img src={hotel.image} className="details-hero-img" alt={hotel.name} />
                    
                    <div className="info-card">
                        <h3>About this Property</h3>
                        <p>Experience world-class service at {hotel.name}. This property is rated <strong>{hotel.rating}/5</strong> stars and offers premium amenities for business and leisure travelers.</p>
                        
                        <div className="amenities-list">
                            {['Free WiFi', 'Room Service', 'Air Conditioning', 'Restaurant', '24h Front Desk'].map(tag => (
                                <span key={tag} className="amenity-tag">✓ {tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="details-sidebar">
                    <div className="sidebar-card map-card">
                        <h3>🚗 Travel & Location</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>
                            Route calculated from your current location.
                        </p>
                        <InteractiveMap destCoords={{ latitude: hotel.location.lat, longitude: hotel.location.lng }} />
                    </div>

                    <div className="sidebar-card booking-card">
                        <div className="price-row">
                            {hotel.price ? (
                                <>
                                    <span className="big-price">{formatINR(hotel.price, hotel.currency)}</span>
                                    <span className="per-night">/ night</span>
                                </>
                            ) : (
                                <span className="big-price" style={{ color: '#ef4444' }}>Check Availability</span>
                            )}
                        </div>
                        
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '10px 0' }}>
                            Includes taxes & fees. Free cancellation options available.
                        </p>

                        <button className="btn-primary full-width">
                            {hotel.price ? 'Book Now' : 'Check Dates'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- APP LAYOUT ---
export default function App() {
    return (
        <>
            <div className="app">
                <nav className="navbar">
                    <div className="container nav-content">
                        <a href="/" className="brand">
                            <span style={{ fontSize: '24px' }}>🇮🇳</span> 
                            TravelIndia
                        </a>
                        <div className="nav-links">
                            <a href="/hotels" className="nav-link">Hotels</a>
                            <a href="/flights" className="nav-link">Flights</a>
                        </div>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<HotelSearch />} />
                    <Route path="/hotels" element={<HotelSearch />} />
                    <Route path="/hotels/:id" element={<HotelDetails />} />
                    <Route path="/flights" element={<FlightSearch />} />
                </Routes>
            </div>
        </>
    );
}