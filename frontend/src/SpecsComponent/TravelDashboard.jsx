// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//     Building, Plane, MapPin, Search, ArrowRight, Star, 
//     Wifi, Coffee, Utensils, Luggage, Navigation, ShieldCheck 
// } from 'lucide-react';
// import {MapComponent} from './MapComponent';

// // --- AUTOCOMPLETE COMPONENT ---
// const AutoInput = ({ icon: Icon, placeholder, value, onChange, onSelect, type = 'city' }) => {
//     const [suggestions, setSuggestions] = useState([]);
//     const [show, setShow] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(async () => {
//             if (value.length > 2 && show) {
//                 try {
//                     const endpoint = type === 'airport' ? '/api/airports' : '/api/suggestions';
//                     const param = type === 'airport' ? 'keyword' : 'query';
//                     const res = await axios.get(`http://localhost:5000${endpoint}?${param}=${value}`);
//                     setSuggestions(type === 'airport' ? res.data.airports : res.data.suggestions);
//                 } catch (e) {
//                     console.warn("Backend unavailable");
//                 }
//             }
//         }, 400);
//         return () => clearTimeout(timer);
//     }, [value, show, type]);

//     return (
//         <div className="relative w-full z-50">
//             {Icon && <Icon className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />}
//             <input
//                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                 placeholder={placeholder}
//                 value={value}
//                 onChange={(e) => { onChange(e.target.value); setShow(true); }}
//                 onFocus={() => setShow(true)}
//                 onBlur={() => setTimeout(() => setShow(false), 200)}
//             />
//             {show && suggestions.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-[100]">
//                     {suggestions.map((item, idx) => (
//                         <div key={idx} className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50"
//                              onClick={() => { onSelect(type === 'airport' ? item.iata : item.name); setShow(false); }}>
//                             <div className="font-bold text-slate-700 text-sm">{type === 'airport' ? `${item.city} (${item.iata})` : item.name}</div>
//                             <div className="text-xs text-slate-400 truncate">{type === 'airport' ? item.name : item.subtitle}</div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- MAIN DASHBOARD ---
// const TravelDashboard = () => {
//     const [activeTab, setActiveTab] = useState('hotels');
//     const [hotels, setHotels] = useState([]);
//     const [flights, setFlights] = useState([]);
//     const [loading, setLoading] = useState(false);
    
//     // Selection State
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [userLoc, setUserLoc] = useState(null);
//     const [routeInfo, setRouteInfo] = useState(null);

//     // Inputs
//     const [hotelCity, setHotelCity] = useState('');
//     const [flightData, setFlightData] = useState({ origin: '', dest: '', date: '2025-01-22' });

//     // 1. Get User Location
//     useEffect(() => {
//         if ("geolocation" in navigator) {
//             navigator.geolocation.getCurrentPosition(
//                 (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//                 () => console.warn("No GPS")
//             );
//         }
//     }, []);

//     // 2. Fetch Route logic
//     useEffect(() => {
//         if (selectedItem && userLoc && activeTab === 'hotels') {
//             const dest = { lat: selectedItem.location.lat, lng: selectedItem.location.lng };
//             axios.post('http://localhost:5000/api/route', { userLocation: userLoc, destLocation: dest })
//                 .then(res => setRouteInfo(res.data))
//                 .catch(() => setRouteInfo(null));
//         } else {
//             setRouteInfo(null);
//         }
//     }, [selectedItem, userLoc, activeTab]);

//     // 3. CRASH FIX: Clear selection when switching tabs
//     useEffect(() => {
//         setSelectedItem(null);
//         setRouteInfo(null);
//     }, [activeTab]);

//     const handleSearch = async () => {
//         setLoading(true); setSelectedItem(null);
//         try {
//             if (activeTab === 'hotels') {
//                 const res = await axios.get(`http://localhost:5000/api/hotels/search?city=${hotelCity}`);
//                 setHotels(res.data.hotels);
//             } else {
//                 const res = await axios.get(`http://localhost:5000/api/flights/search`, { params: { ...flightData } });
//                 setFlights(res.data.flights);
//             }
//         } catch (e) { 
//             console.error("Connection Error", e); 
//             alert("Ensure Backend (node server.js) is running!");
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="flex flex-row h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
            
//             {/* --- LEFT PANEL --- */}
//             <div className="w-2/5 flex flex-col border-r border-slate-200 bg-white shadow-xl z-20 h-full">
//                 <div className="p-6 pb-4 bg-white z-30 shadow-sm">
//                     <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Travel<span className="text-blue-600">Sync</span></h1>
                    
//                     <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
//                         {['hotels', 'flights'].map(tab => (
//                             <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>
//                                 {tab === 'hotels' ? <Building size={16} className="inline mr-2"/> : <Plane size={16} className="inline mr-2"/>} {tab}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="space-y-3">
//                         {activeTab === 'hotels' ? (
//                             <>
//                                 <AutoInput icon={MapPin} placeholder="Enter City..." value={hotelCity} onChange={setHotelCity} onSelect={setHotelCity} />
//                                 <button onClick={handleSearch} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Find Stays</button>
//                             </>
//                         ) : (
//                             <>
//                                 <div className="flex gap-2">
//                                     <AutoInput type="airport" placeholder="From (DEL)" value={flightData.origin} onChange={e=>setFlightData({...flightData, origin:e})} onSelect={e=>setFlightData({...flightData, origin:e})} />
//                                     <AutoInput type="airport" placeholder="To (BOM)" value={flightData.dest} onChange={e=>setFlightData({...flightData, dest:e})} onSelect={e=>setFlightData({...flightData, dest:e})} />
//                                 </div>
//                                 <input type="date" className="w-full p-3 border rounded-xl" value={flightData.date} onChange={e=>setFlightData({...flightData, date:e.target.value})} />
//                                 <button onClick={handleSearch} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Find Flights</button>
//                             </>
//                         )}
//                     </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
//                     {loading && <div className="text-center py-10 text-slate-400">Searching...</div>}
                    
//                     {!loading && activeTab === 'hotels' && hotels.map(h => (
//                         <div key={h.id} onClick={() => setSelectedItem(h)} className={`p-3 flex gap-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedItem?.id === h.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-100'}`}>
//                             <img src={h.image} className="w-24 h-24 rounded-lg object-cover bg-slate-200"/>
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-slate-800 line-clamp-1">{h.name}</h3>
//                                 <div className="text-xs text-slate-500 mb-2">{h.location.address}</div>
//                                 <div className="flex justify-between items-end">
//                                     <div className="flex gap-1 text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded"><Star size={12}/> {h.rating}</div>
//                                     <div className="text-lg font-black text-blue-600">₹{h.price.toLocaleString()}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}

//                     {!loading && activeTab === 'flights' && flights.map(f => (
//                         <div key={f.id} onClick={() => setSelectedItem(f)} className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedItem?.id === f.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-100'}`}>
//                             <div className="flex justify-between mb-2">
//                                 <span className="font-bold text-sm text-slate-600">{f.airline}</span>
//                                 <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{f.duration}</span>
//                             </div>
//                             <div className="flex justify-between items-center text-lg font-black text-slate-800">
//                                 <span>{f.departure?.iataCode}</span>
//                                 <div className="flex-1 px-4 flex flex-col items-center"><div className="w-full h-[1px] bg-slate-300"></div></div>
//                                 <span>{f.arrival?.iataCode}</span>
//                             </div>
//                             <div className="text-right mt-2 text-blue-600 font-black text-xl">₹{f.totalPrice.toLocaleString()}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* --- RIGHT PANEL --- */}
//             <div className="w-3/5 h-full bg-white relative flex flex-col">
//                 {selectedItem ? (
//                     <>
//                         {/* TOP SECTION */}
//                         <div className="h-[45%] w-full relative border-b border-slate-200">
//                             {activeTab === 'hotels' ? (
//                                 <>
//                                     <MapComponent 
//                                         userLocation={userLoc} 
//                                         destCoords={selectedItem.location}
//                                         routeData={routeInfo}
//                                     />
//                                     {routeInfo && (
//                                         <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg z-[400] border border-white/50">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="bg-blue-600 text-white p-2 rounded-full"><Navigation size={18}/></div>
//                                                 <div>
//                                                     <div className="text-xs font-bold text-slate-400 uppercase">Est. Time</div>
//                                                     <div className="text-xl font-black text-slate-800">{routeInfo.duration} min</div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </>
//                             ) : (
//                                 <div className="h-full bg-gradient-to-br from-blue-600 to-indigo-800 flex flex-col items-center justify-center text-white">
//                                     <Plane size={64} className="mb-4 opacity-50"/>
//                                     {/* SAFE GUARD ADDED HERE */}
//                                     <div className="text-5xl font-black">{selectedItem?.airline}</div>
//                                     <div className="text-lg opacity-80 mt-2">Flight {selectedItem?.flightNumber}</div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* BOTTOM SECTION */}
//                         <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
//                             {activeTab === 'hotels' ? (
//                                 <>
//                                     <div className="flex justify-between items-start mb-6">
//                                         <div>
//                                             <h1 className="text-3xl font-black text-slate-900 mb-2">{selectedItem.name}</h1>
//                                             <div className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={16}/> {selectedItem.location.address}</div>
//                                         </div>
//                                         <div className="text-right">
//                                             <div className="text-sm text-slate-400 font-bold uppercase">Total</div>
//                                             <div className="text-4xl font-black text-blue-600">₹{selectedItem.price?.toLocaleString()}</div>
//                                         </div>
//                                     </div>

//                                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
//                                         <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Star className="text-yellow-500 fill-yellow-500"/> Amenities</h3>
//                                         <div className="grid grid-cols-2 gap-4">
//                                             {selectedItem.amenities?.map((am, i) => (
//                                                 <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl font-bold text-slate-600 text-sm">
//                                                     <ShieldCheck size={18} className="text-blue-500"/> {am}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <button className="w-full py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-transform">Confirm Booking</button>
//                                 </>
//                             ) : (
//                                 // FLIGHT DETAILS (SAFE GUARDED)
//                                 <>
//                                     <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-6">
//                                         <div className="flex justify-between items-center mb-10">
//                                             <div className="text-center">
//                                                 {/* SAFE GUARDED ACCESS */}
//                                                 <div className="text-5xl font-black text-slate-800">{selectedItem?.departure?.iataCode}</div>
//                                                 <div className="text-lg font-bold text-slate-400 mt-1">{selectedItem?.departure?.at?.split('T')[1]?.slice(0,5)}</div>
//                                             </div>
//                                             <div className="flex-1 flex flex-col items-center px-8">
//                                                 <div className="text-sm font-bold text-slate-400 mb-2">{selectedItem?.duration}</div>
//                                                 <div className="w-full h-1 bg-slate-200 relative rounded-full">
//                                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-slate-200">
//                                                         <Plane size={20} className="text-blue-500 rotate-90"/>
//                                                     </div>
//                                                 </div>
//                                                 <div className="text-sm font-bold text-green-600 mt-3">{selectedItem?.segments === 1 ? 'Direct Flight' : '1 Stopover'}</div>
//                                             </div>
//                                             <div className="text-center">
//                                                 <div className="text-5xl font-black text-slate-800">{selectedItem?.arrival?.iataCode}</div>
//                                                 <div className="text-lg font-bold text-slate-400 mt-1">{selectedItem?.arrival?.at?.split('T')[1]?.slice(0,5)}</div>
//                                             </div>
//                                         </div>
                                        
//                                         <div className="grid grid-cols-3 gap-6 border-t border-slate-100 pt-6">
//                                             <div><div className="text-xs uppercase font-bold text-slate-400">Class</div><div className="font-bold text-lg">Economy</div></div>
//                                             <div><div className="text-xs uppercase font-bold text-slate-400">Aircraft</div><div className="font-bold text-lg">Airbus {selectedItem?.aircraft}</div></div>
//                                             <div className="text-right"><div className="text-xs uppercase font-bold text-slate-400">Total Price</div><div className="font-black text-blue-600 text-2xl">₹{selectedItem?.totalPrice?.toLocaleString()}</div></div>
//                                         </div>
//                                     </div>
//                                     <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Proceed to Payment</button>
//                                 </>
//                             )}
//                         </div>
//                     </>
//                 ) : (
//                     <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
//                         <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
//                             <Search size={40} className="opacity-20"/>
//                         </div>
//                         <h2 className="text-xl font-bold text-slate-600">Start Exploring</h2>
//                         <p>Select a Hotel or Flight to view details.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TravelDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Building, Plane, MapPin, Search, ArrowRight, Star, 
    Wifi, Coffee, Utensils, Luggage, Navigation, ShieldCheck, AlertCircle, Filter 
} from 'lucide-react';
import {MapComponent} from './MapComponent';

// ==========================================
// 1. AUTOINPUT COMPONENT (FIXED)
// ==========================================
const AutoInput = ({ icon: Icon, placeholder, value, onChange, onSelect, type = 'city' }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [show, setShow] = useState(false);

    // Fetch suggestions when user types
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
        <div className="relative w-full z-50">
            {Icon && <Icon className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />}
            <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={placeholder}
                value={value}
                onChange={(e) => { 
                    onChange(e.target.value); 
                    setShow(true); 
                }}
                onFocus={() => setShow(true)}
                // Delay hiding to allow clicks, though onMouseDown handles the click priority
                onBlur={() => setTimeout(() => setShow(false), 200)}
            />
            
            {show && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-[100]">
                    {suggestions.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50"
                            // FIX: Use onMouseDown instead of onClick. 
                            // onMouseDown fires BEFORE onBlur, ensuring the value updates.
                            onMouseDown={(e) => { 
                                e.preventDefault(); // Prevent input blur immediately
                                const val = type === 'airport' ? item.iata : item.name;
                                onSelect(val); 
                                setShow(false); 
                            }}
                        >
                            <div className="font-bold text-slate-700 text-sm">
                                {type === 'airport' ? `${item.city} (${item.iata})` : item.name}
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                                {type === 'airport' ? item.name : item.subtitle}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 2. MAIN DASHBOARD
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

    // 1. GPS
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setUserLoc({ lat: 28.6139, lng: 77.2090 }) // Fallback
            );
        } else setUserLoc({ lat: 28.6139, lng: 77.2090 });
    }, []);

    // 2. Routing Logic
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

    // 3. Reset Logic on Tab Switch
    useEffect(() => {
        setSelectedItem(null);
        setErrorMsg(null);
        setHotels([]);
        setFlights([]);
        setPage(1);
        setFilter('recommended');
    }, [activeTab]);

    // 4. Search Handler
    const handleSearch = async (isNewSearch = true) => {
        if (isNewSearch) { setPage(1); setHotels([]); setFlights([]); setSearchPerformed(true); }
        setLoading(true); setSelectedItem(null); setErrorMsg(null);

        try {
            if (activeTab === 'hotels') {
                if(!hotelCity) throw new Error("Please enter a city");
                const res = await axios.get(`http://localhost:5000/api/hotels/search`, {
                    params: { city: hotelCity, page: isNewSearch ? 1 : page + 1 }
                });
                setHotels(prev => isNewSearch ? res.data.hotels : [...prev, ...res.data.hotels]);
                if (!isNewSearch) setPage(p => p + 1);
            } else {
                if(!flightData.origin || !flightData.destination) throw new Error("Please select airports");
                const res = await axios.get(`http://localhost:5000/api/flights/search`, { params: { ...flightData } });
                setFlights(res.data.flights || []);
            }
        } catch (e) { 
            console.error(e);
            setErrorMsg(e.message || "Connection Failed");
        }
        setLoading(false);
    };

    // 5. Filter Logic
    const getSortedData = () => {
        let data = activeTab === 'hotels' ? [...hotels] : [...flights];
        
        // Remove items with missing critical data to prevent crashes
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

    return (
        <div className="flex flex-row h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
            
            {/* --- LEFT PANEL: FILTERS & LIST --- */}
            <div className="w-2/5 flex flex-col border-r border-slate-200 bg-white shadow-xl z-20 h-full">
                <div className="p-6 pb-2 bg-white z-30 shadow-sm">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Travel<span className="text-blue-600">Sync</span></h1>
                    
                    {/* TABS */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                        {['hotels', 'flights'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>
                                {tab === 'hotels' ? <Building size={16} className="inline mr-2"/> : <Plane size={16} className="inline mr-2"/>} {tab}
                            </button>
                        ))}
                    </div>

                    {/* INPUTS */}
                    <div className="space-y-3">
                        {activeTab === 'hotels' ? (
                            <>
                                <AutoInput 
                                    icon={MapPin} 
                                    placeholder="Enter City (e.g. Goa)" 
                                    value={hotelCity} 
                                    onChange={setHotelCity} 
                                    onSelect={setHotelCity} // Using onMouseDown inside component
                                />
                                <button onClick={() => handleSearch(true)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Find Stays</button>
                            </>
                        ) : (
                            <>
                                <div className="flex gap-2">
                                    <AutoInput 
                                        type="airport" 
                                        placeholder="From (DEL)" 
                                        value={flightData.origin} 
                                        onChange={(val) => setFlightData({...flightData, origin: val})} 
                                        onSelect={(val) => setFlightData({...flightData, origin: val})} 
                                    />
                                    <AutoInput 
                                        type="airport" 
                                        placeholder="To (BOM)" 
                                        value={flightData.destination} 
                                        onChange={(val) => setFlightData({...flightData, destination: val})} 
                                        onSelect={(val) => setFlightData({...flightData, destination: val})} 
                                    />
                                </div>
                                <input type="date" className="w-full p-3 border rounded-xl" value={flightData.date} onChange={e=>setFlightData({...flightData, date:e.target.value})} />
                                <button onClick={() => handleSearch(true)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Find Flights</button>
                            </>
                        )}
                    </div>

                    {/* FILTERS */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex items-center text-slate-400 mr-1"><Filter size={14}/></div>
                        {[
                            { id: 'recommended', label: 'Recommended' },
                            { id: 'price_low', label: 'Price: Low' },
                            { id: 'price_high', label: 'Price: High' },
                            { id: 'rating', label: 'Top Rated' }
                        ].map(f => (
                            <button 
                                key={f.id} 
                                onClick={() => setFilter(f.id)}
                                className={`px-3 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-colors ${filter === f.id ? 'bg-black text-white border-black' : 'border-slate-200 text-slate-600 hover:border-blue-500'}`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RESULTS LIST */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {loading && <div className="text-center py-20 animate-pulse text-slate-400 font-bold">Fetching live data...</div>}
                    
                    {!loading && errorMsg && <div className="text-center py-10 text-red-500 font-bold flex flex-col items-center"><AlertCircle className="mb-2"/>{errorMsg}</div>}

                    {!loading && !errorMsg && searchPerformed && displayData.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <Search size={40} className="mx-auto mb-2 opacity-20"/>
                            <p>No results found.</p>
                        </div>
                    )}
                    
                    {/* HOTEL CARDS */}
                    {!loading && activeTab === 'hotels' && displayData.map(h => (
                        <div key={h.id} onClick={() => setSelectedItem(h)} className={`p-3 flex gap-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedItem?.id === h.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-100'}`}>
                            <img src={h.image} className="w-24 h-24 rounded-lg object-cover bg-slate-200"/>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 line-clamp-1">{h.name}</h3>
                                <div className="text-xs text-slate-500 mb-2">{h.location.address}</div>
                                <div className="flex justify-between items-end">
                                    <div className="flex gap-1 text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded"><Star size={12}/> {h.rating}</div>
                                    <div className="text-lg font-black text-blue-600">₹{h.price?.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* FLIGHT CARDS */}
                    {!loading && activeTab === 'flights' && displayData.map(f => (
                        <div key={f.id} onClick={() => setSelectedItem(f)} className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedItem?.id === f.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-100'}`}>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-sm text-slate-600">{f.airline}</span>
                                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{f.duration}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-black text-slate-800">
                                <span>{f.departure?.iataCode}</span>
                                <div className="flex-1 px-4 flex flex-col items-center"><div className="w-full h-[1px] bg-slate-300"></div></div>
                                <span>{f.arrival?.iataCode}</span>
                            </div>
                            <div className="text-right mt-2 text-blue-600 font-black text-xl">₹{f.totalPrice?.toLocaleString()}</div>
                        </div>
                    ))}

                    {/* PAGINATION BUTTON */}
                    {!loading && activeTab === 'hotels' && displayData.length > 0 && (
                        <button onClick={() => handleSearch(false)} className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-500 font-bold hover:bg-slate-50">
                            Load More Results
                        </button>
                    )}
                </div>
            </div>

            {/* --- RIGHT PANEL: DETAILS & MAP --- */}
            <div className="w-3/5 h-full bg-white relative flex flex-col">
                {selectedItem ? (
                    <div className="flex flex-col h-full overflow-y-auto">
                        
                        {/* HERO SECTION */}
                        {activeTab === 'hotels' ? (
                            <div className="h-64 relative flex-shrink-0 w-full">
                                <img src={selectedItem.image} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6 text-white">
                                    <h1 className="text-4xl font-black">{selectedItem.name}</h1>
                                    <div className="flex items-center gap-2 text-sm opacity-90"><MapPin size={16}/> {selectedItem.location.address}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                                <div className="text-center">
                                    <div className="text-sm font-bold opacity-70 uppercase tracking-widest mb-2">Flight Selected</div>
                                    <div className="text-5xl font-black">{selectedItem.airline}</div>
                                </div>
                            </div>
                        )}

                        {/* DETAILS CONTENT */}
                        <div className="p-8 pb-0">
                            {activeTab === 'hotels' ? (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Available Now</div>
                                        <div className="text-4xl font-black text-blue-600">₹{selectedItem.price?.toLocaleString()}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {selectedItem.amenities?.map((am, i) => (
                                            <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl font-bold text-slate-600 text-xs">
                                                <ShieldCheck size={16} className="text-blue-500"/> {am}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-black text-slate-800">{selectedItem.departure?.iataCode}</div>
                                            <div className="text-lg text-slate-400 font-bold">{selectedItem.departure?.at?.split('T')[1]?.slice(0,5)}</div>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center px-8">
                                            <div className="text-sm font-bold text-slate-400 mb-2">{selectedItem.duration}</div>
                                            <div className="w-full h-1 bg-slate-200 relative rounded-full">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-slate-200">
                                                    <Plane size={20} className="text-blue-500 rotate-90"/>
                                                </div>
                                            </div>
                                            <div className="text-green-600 font-bold text-xs mt-2">{selectedItem.segments === 1 ? 'Non-stop' : '1 Stop'}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-5xl font-black text-slate-800">{selectedItem.arrival?.iataCode}</div>
                                            <div className="text-lg text-slate-400 font-bold">{selectedItem.arrival?.at?.split('T')[1]?.slice(0,5)}</div>
                                        </div>
                                    </div>
                                    <div className="text-right"><div className="text-xs uppercase font-bold text-slate-400">Total</div><div className="font-black text-blue-600 text-2xl">₹{selectedItem.totalPrice?.toLocaleString()}</div></div>
                                </div>
                            )}
                        </div>

                        {/* MAP (Only for Hotels with valid coords) */}
                        {activeTab === 'hotels' && selectedItem.location?.lat && (
                            <div className="p-8 pt-0">
                                <h3 className="font-bold text-slate-900 mb-4">Location & Route</h3>
                                <div className="h-64 w-full bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
                                    <MapComponent 
                                        userLocation={userLoc} 
                                        destCoords={selectedItem.location}
                                        routeData={routeInfo}
                                    />
                                    {routeInfo && (
                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm border border-white/50 text-xs font-bold text-slate-700">
                                            🚗 {routeInfo.duration} min • {routeInfo.distance} km
                                        </div>
                                    )}
                                </div>
                                <button className="w-full mt-6 py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-transform">
                                    Confirm Booking
                                </button>
                            </div>
                        )}
                         
                        {/* FLIGHT BOOK BUTTON */}
                        {activeTab === 'flights' && (
                            <div className="p-8 pt-0">
                                <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
                                    Book Flight Ticket
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                            <Search size={40} className="opacity-20"/>
                        </div>
                        <h2 className="text-xl font-bold text-slate-600">Start Exploring</h2>
                        <p>Select a result to view full details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelDashboard;