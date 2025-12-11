// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import InteractiveMap from '../SpecsComponent/MapComponent'; // Ensure this file exists in /components
// import '../App.css'; // Ensure you use the CSS provided in the previous step
// import '../index.css'; // Ensure you use the CSS provided in the previous step

// const API_URL = 'http://localhost:5000/api';

// // --- HELPER: Formatters ---
// const formatTime = (isoString) => {
//     if (!isoString) return '';
//     return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// const formatDate = (isoString) => {
//     if (!isoString) return '';
//     return new Date(isoString).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
// };

// const formatDuration = (ptString) => {
//     if (!ptString) return '';
//     // Converts "PT2H30M" or "2h30m" to "2h 30m"
//     return ptString.replace('PT', '').toLowerCase().replace('h', 'h ').replace('m', 'm');
// };

// const formatINR = (amount, currencyCode) => {
//     if (!amount) return null;
//     return new Intl.NumberFormat('en-IN', {
//         style: 'currency',
//         currency: currencyCode || 'INR',
//         maximumFractionDigits: 0
//     }).format(amount);
// };

// // --- SHARED COMPONENTS ---
// const LoadingSpinner = () => (
//     <div className="loader-container">
//         <div className="spinner"></div>
//         <p style={{ marginTop: '15px', color: '#64748b', fontWeight: 500 }}>Fetching live data...</p>
//     </div>
// );

// const EmptyState = ({ title, message }) => (
//     <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: '#fff', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
//         <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔍</div>
//         <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{title}</h3>
//         <p style={{ margin: 0 }}>{message}</p>
//     </div>
// );

// // --- COMPONENT: FLIGHT SEARCH ---
// const FlightSearch = () => {
//     // 1. STATE PERSISTENCE (SessionStorage)
//     const savedState = JSON.parse(sessionStorage.getItem('flightState')) || {
//         flights: [],
//         params: { 
//             origin: 'DEL', 
//             destination: 'BOM', 
//             date: new Date(Date.now() + 86400000).toISOString().split('T')[0] // Default to tomorrow
//         },
//         searched: false
//     };

//     const [searchParams, setSearchParams] = useState(savedState.params);
//     const [flights, setFlights] = useState(savedState.flights);
//     const [loading, setLoading] = useState(false);
//     const [searched, setSearched] = useState(savedState.searched);
//     const navigate = useNavigate();

//     // Save state on change
//     useEffect(() => {
//         sessionStorage.setItem('flightState', JSON.stringify({ flights, params: searchParams, searched }));
//     }, [flights, searchParams, searched]);

//     const handleSearch = async () => {
//         setLoading(true);
//         setSearched(true);
//         try {
//             const query = new URLSearchParams(searchParams).toString();
//             const res = await fetch(`${API_URL}/flights/search?${query}`);
//             if(!res.ok) throw new Error("API Failed");
//             const data = await res.json();
//             setFlights(data.flights || []);
//         } catch (err) {
//             console.error(err);
//             setFlights([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container fade-in">
//             <div className="header-section">
//                 <h2 className="section-title">✈️ Search Flights</h2>
//                 <p className="subtitle">Real-time fares from Amadeus</p>
//             </div>

//             <div className="search-box">
//                 <div className="form-group">
//                     <label>From</label>
//                     <input className="form-input" value={searchParams.origin} onChange={e => setSearchParams({...searchParams, origin: e.target.value.toUpperCase()})} placeholder="DEL" />
//                 </div>
//                 <div className="form-group">
//                     <label>To</label>
//                     <input className="form-input" value={searchParams.destination} onChange={e => setSearchParams({...searchParams, destination: e.target.value.toUpperCase()})} placeholder="BOM" />
//                 </div>
//                 <div className="form-group">
//                     <label>Date</label>
//                     <input type="date" className="form-input" value={searchParams.date} onChange={e => setSearchParams({...searchParams, date: e.target.value})} />
//                 </div>
//                 <button className="btn-primary" onClick={handleSearch} disabled={loading}>
//                     {loading ? 'Searching...' : 'Find Flights'}
//                 </button>
//             </div>

//             {loading && <LoadingSpinner />}

//             {!loading && searched && flights.length === 0 && (
//                 <EmptyState title="No Flights Found" message="Try changing your dates or airports." />
//             )}

//             <div className="grid-auto">
//                 {flights.map((flight) => (
//                     <div key={flight.id} className="card flight-card">
//                         <div className="card-body">
//                              <div className="flight-header">
//                                 <span className="badge" style={{background:'#e0f2fe', color:'#0369a1'}}>{flight.airlineCode}</span>
//                                 <span className="price-value" style={{fontSize:'1.2rem'}}>{formatINR(flight.totalPrice, flight.currency)}</span>
//                              </div>

//                              {/* Route Visual for First Segment */}
//                              {flight.segments && flight.segments.length > 0 && (
//                                 <div className="flight-route">
//                                     <div>
//                                         <div className="city-code">{flight.segments[0].departure.iata}</div>
//                                         <div className="time">{formatTime(flight.segments[0].departure.at)}</div>
//                                     </div>
//                                     <div className="route-line">
//                                         <span className="duration">{formatDuration(flight.totalDuration)}</span>
//                                         <div className="line"></div>
//                                         <span className="flight-num">{flight.segments.length > 1 ? `${flight.segments.length} stops` : 'Direct'}</span>
//                                     </div>
//                                     <div>
//                                         <div className="city-code">{flight.segments[flight.segments.length-1].arrival.iata}</div>
//                                         <div className="time">{formatTime(flight.segments[flight.segments.length-1].arrival.at)}</div>
//                                     </div>
//                                 </div>
//                              )}

//                              <button 
//                                 className="btn-secondary full-width" 
//                                 style={{marginTop:'15px'}}
//                                 onClick={() => navigate(`/flights/${flight.id}`, { state: { flight } })}
//                             >
//                                 View Details & Book
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// // --- COMPONENT: FLIGHT DETAILS (Detailed View) ---
// const FlightDetails = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();

//     // Scroll to top
//     useEffect(() => { window.scrollTo(0, 0); }, []);

//     if (!state?.flight) return (
//         <div className="container" style={{textAlign:'center', padding:'50px'}}>
//             <h2>No Flight Selected</h2>
//             <button className="btn-secondary" onClick={() => navigate('/flights')}>Back to Search</button>
//         </div>
//     );

//     const { flight } = state;
    
//     // Calculate Taxes (Total - Base)
//     const tax = (parseFloat(flight.totalPrice) - parseFloat(flight.basePrice)).toFixed(2);

//     return (
//         <div className="container fade-in">
//             <button className="back-btn" onClick={() => navigate(-1)}>← Back to Flights</button>
            
//             <div className="details-grid">
//                 {/* LEFT COLUMN: Itinerary */}
//                 <div className="details-content">
//                     <h1 className="details-title">Flight Details</h1>
//                     <div className="info-card">
                        
//                         {/* Loop through segments */}
//                         {flight.segments.map((segment, index) => (
//                             <div key={segment.id} className="segment-container">
//                                 {index > 0 && <div className="layover-badge" style={{background:'#fef3c7', padding:'5px', borderRadius:'4px', marginBottom:'10px', textAlign:'center', fontSize:'0.8rem', color:'#b45309'}}>Layover / Connection</div>}
                                
//                                 <div className="airline-header">
//                                     <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
//                                         <img 
//                                             src={`https://pics.avs.io/200/200/${segment.carrierCode}.png`} 
//                                             alt={segment.carrierName}
//                                             style={{width:'40px', height:'40px', borderRadius:'50%'}} 
//                                             onError={(e) => e.target.style.display = 'none'}
//                                         />
//                                         <div>
//                                             <div style={{fontWeight:'bold', fontSize:'1.1rem'}}>{segment.carrierName}</div>
//                                             <div style={{color:'#64748b', fontSize:'0.9rem'}}>
//                                                 {segment.carrierCode} {segment.flightNumber} • {segment.aircraftName}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <span className="badge" style={{background:'#e0f2fe', color:'#0369a1'}}>
//                                         {flight.cabin} Class
//                                     </span>
//                                 </div>

//                                 <div className="timeline-grid">
//                                     {/* Departure */}
//                                     <div style={{textAlign:'right'}}>
//                                         <div style={{fontSize:'1.5rem', fontWeight:'800'}}>{formatTime(segment.departure.at)}</div>
//                                         <div style={{fontWeight:'600'}}>{segment.departure.iata}</div>
//                                         <div style={{fontSize:'0.9rem', color:'#64748b'}}>{formatDate(segment.departure.at)}</div>
//                                         {segment.departure.terminal && <div style={{fontSize:'0.8rem', color:'#ea580c'}}>T-{segment.departure.terminal}</div>}
//                                     </div>

//                                     {/* Visual Line */}
//                                     <div className="timeline-visual">
//                                         <div className="dot top"></div>
//                                         <div className="line-vertical"></div>
//                                         <div className="duration-pill">{formatDuration(segment.duration)}</div>
//                                         <div className="dot bottom"></div>
//                                     </div>

//                                     {/* Arrival */}
//                                     <div>
//                                         <div style={{fontSize:'1.5rem', fontWeight:'800'}}>{formatTime(segment.arrival.at)}</div>
//                                         <div style={{fontWeight:'600'}}>{segment.arrival.iata}</div>
//                                         <div style={{fontSize:'0.9rem', color:'#64748b'}}>{formatDate(segment.arrival.at)}</div>
//                                         {segment.arrival.terminal && <div style={{fontSize:'0.8rem', color:'#ea580c'}}>T-{segment.arrival.terminal}</div>}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Baggage Info */}
//                     <div className="info-card" style={{marginTop:'20px'}}>
//                         <h3>Included Baggage</h3>
//                         <div style={{display:'flex', gap:'20px', marginTop:'15px', flexWrap:'wrap'}}>
//                             <div className="amenity-box">
//                                 <span style={{fontSize:'24px'}}>🧳</span>
//                                 <div>
//                                     <div style={{fontWeight:'bold'}}>Checked Baggage</div>
//                                     <div style={{color:'#64748b'}}>
//                                         {flight.baggage?.weight ? `${flight.baggage.weight} KG` : 
//                                          flight.baggage?.quantity ? `${flight.baggage.quantity} Piece(s)` : 'Check Policy'}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="amenity-box">
//                                 <span style={{fontSize:'24px'}}>🎒</span>
//                                 <div>
//                                     <div style={{fontWeight:'bold'}}>Cabin Baggage</div>
//                                     <div style={{color:'#64748b'}}>7 KG (Standard)</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* RIGHT COLUMN: Price */}
//                 <div className="details-sidebar">
//                     <div className="sidebar-card booking-card">
//                         <h3 style={{margin:'0 0 15px 0'}}>Price Breakdown</h3>
//                         <div className="price-row-item">
//                             <span>Base Fare</span>
//                             <span>{formatINR(flight.basePrice, flight.currency)}</span>
//                         </div>
//                         <div className="price-row-item">
//                             <span>Taxes & Fees</span>
//                             <span>{formatINR(tax, flight.currency)}</span>
//                         </div>
//                         <hr style={{borderColor:'#e2e8f0', margin:'15px 0'}} />
//                         <div className="price-row-item total">
//                             <span>Total</span>
//                             <span style={{color:'#16a34a', fontSize:'1.5rem'}}>{formatINR(flight.totalPrice, flight.currency)}</span>
//                         </div>
//                         <button className="btn-primary full-width" style={{marginTop:'20px'}}>Proceed to Pay</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- COMPONENT: HOTEL SEARCH ---
// const HotelSearch = () => {
//     const savedState = JSON.parse(sessionStorage.getItem('hotelState')) || {
//         hotels: [],
//         city: 'DEL',
//         searched: false
//     };

//     const [city, setCity] = useState(savedState.city);
//     const [hotels, setHotels] = useState(savedState.hotels);
//     const [loading, setLoading] = useState(false);
//     const [searched, setSearched] = useState(savedState.searched);
//     const navigate = useNavigate();

//     useEffect(() => {
//         sessionStorage.setItem('hotelState', JSON.stringify({ hotels, city, searched }));
//     }, [hotels, city, searched]);

//     const searchHotels = async () => {
//         setLoading(true);
//         setSearched(true);
//         try {
//             const res = await fetch(`${API_URL}/hotels/search?cityCode=${city}`);
//             const data = await res.json();
//             setHotels(data.hotels || []);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container fade-in">
//              <div className="header-section">
//                 <h2 className="section-title">🏨 Search Hotels</h2>
//                 <p className="subtitle">Luxury stays and budget accommodations across India.</p>
//             </div>

//             <div className="search-box">
//                 <div className="form-group" style={{ flex: 2 }}>
//                     <label>Destination City</label>
//                     <input 
//                         className="form-input"
//                         value={city}
//                         onChange={(e) => setCity(e.target.value)}
//                         placeholder="Enter City Name (e.g. Delhi, Mumbai)"
//                         onKeyDown={(e) => e.key === 'Enter' && searchHotels()}
//                     />
//                 </div>
//                 <button className="btn-primary" onClick={searchHotels} disabled={loading}>
//                     {loading ? 'Searching...' : 'Find Hotels'}
//                 </button>
//             </div>

//             {loading && <LoadingSpinner />}

//             {!loading && searched && hotels.length === 0 && (
//                 <EmptyState title="No Hotels Found" message={`We couldn't find any hotels in "${city}". Try "DEL" or "BOM".`} />
//             )}

//             <div className="grid-auto">
//                 {hotels.map((hotel) => (
//                     <div key={hotel.id} className="card hotel-card" onClick={() => navigate(`/hotels/${hotel.id}`, { state: { hotel } })}>
//                         <div className="card-image-container">
//                             <img src={hotel.image} alt={hotel.name} className="card-img" />
//                             {hotel.rating && <span className="rating-badge">⭐ {hotel.rating}</span>}
//                         </div>
//                         <div className="card-body">
//                             <h4 className="card-title">{hotel.name}</h4>
//                             <p className="card-location">📍 {hotel.location.address}</p>
//                             <div className="card-footer">
//                                 {hotel.price ? (
//                                     <div className="price-container">
//                                         <span className="price-label">Starts from</span>
//                                         <span className="price-value">{formatINR(hotel.price, hotel.currency)}</span>
//                                     </div>
//                                 ) : (
//                                     <span className="sold-out-badge">See Availability</span>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// // --- COMPONENT: HOTEL DETAILS ---
// const HotelDetails = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();

//     useEffect(() => { window.scrollTo(0, 0); }, []);

//     if (!state?.hotel) return (
//         <div className="container"><EmptyState title="No Selection" message="Please go back and select a hotel first." /></div>
//     );

//     const { hotel } = state;

//     return (
//         <div className="container fade-in">
//             <button className="back-btn" onClick={() => navigate(-1)}>← Back to Results</button>
//             <div className="details-grid">
//                 <div className="details-content">
//                     <h1 className="details-title">{hotel.name}</h1>
//                     <p className="details-address">📍 {hotel.location.address}</p>
//                     <img src={hotel.image} className="details-hero-img" alt={hotel.name} />
//                     <div className="info-card">
//                         <h3>About this Property</h3>
//                         <p>Experience world-class service at {hotel.name}. This property is rated <strong>{hotel.rating}/5</strong> stars.</p>
//                         <div className="amenities-list">
//                             {['Free WiFi', 'Room Service', 'Air Conditioning', 'Restaurant'].map(tag => (
//                                 <span key={tag} className="amenity-tag">✓ {tag}</span>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="details-sidebar">
//                     <div className="sidebar-card map-card">
//                         <h3>🚗 Travel & Location</h3>
//                         <div style={{height:'300px', marginTop:'15px'}}>
//                              <InteractiveMap destCoords={{ latitude: hotel.location.lat, longitude: hotel.location.lng }} />
//                         </div>
//                     </div>

//                     <div className="sidebar-card booking-card">
//                         <div className="price-row">
//                             {hotel.price ? (
//                                 <>
//                                     <span className="big-price">{formatINR(hotel.price, hotel.currency)}</span>
//                                     <span className="per-night">/ night</span>
//                                 </>
//                             ) : (
//                                 <span className="big-price" style={{ color: '#ef4444' }}>Check Availability</span>
//                             )}
//                         </div>
//                         <button className="btn-primary full-width" disabled={!hotel.price} style={{marginTop:'15px'}}>
//                             {hotel.price ? 'Book Now' : 'Check Dates'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- MAIN APP COMPONENT ---
// export default function App() {
//     return (
//         <>
//             <div className="app">
//                 <nav className="navbar">
//                     <div className="container nav-content">
//                         <a href="/" className="brand">
//                             <span style={{ fontSize: '24px' }}>🇮🇳</span> TravelIndia
//                         </a>
//                         <div className="nav-links">
//                             <a href="/hotels" className="nav-link">Hotels</a>
//                             <a href="/flights" className="nav-link">Flights</a>
//                         </div>
//                     </div>
//                 </nav>

//                 <Routes>
//                     <Route path="/" element={<HotelSearch />} />
//                     <Route path="/hotels" element={<HotelSearch />} />
//                     <Route path="/hotels/:id" element={<HotelDetails />} />
//                     <Route path="/flights" element={<FlightSearch />} />
//                     <Route path="/flights/:id" element={<FlightDetails />} />
//                 </Routes>
//             </div>
//         </>
//     );
// }

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Pages
// import Home from './pages/Home';
import TravelDashboard from '../SpecsComponent/TravelDashboard'; // <-- NEW MAIN PAGE
// import ChatPage from './pages/ChatPage';
// import India3D from './SpecsPages/India3D';       
// import StateDetails from './SpecsPages/StateDetails'; 
import { getMapFromDB, saveMapToDB} from '../utils/contextManager'

const INDIA_MAP_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

function App() {
  const [indiaGeoData, setIndiaGeoData] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const cached = await getMapFromDB('india_main');
        if (cached) {
          setIndiaGeoData(cached);
        } else {
          const res = await fetch(INDIA_MAP_URL);
          const data = await res.json();
          setIndiaGeoData(data);
          await saveMapToDB('india_main', data);
        }
      } catch (e) { console.error("Map Load Failed", e); }
    };
    initMap();
  }, []);

  return (
    <div className='w-full h-full m-0 p-0 font-sans text-slate-800 bg-slate-50'>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        
        {/* The New "Single Page" Experience */}
        <Route path="/explore" element={<TravelDashboard />} /> 
        
        {/* <Route path="/chat" element={<ChatPage />} />
        <Route path="/map" element={<India3D preLoadedData={indiaGeoData} />} />
        <Route path="/map/:stateName" element={<StateDetails />} /> */}
      </Routes>
    </div>
  );
}

export default App;