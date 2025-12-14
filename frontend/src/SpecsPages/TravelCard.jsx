import React, { useState, useEffect, useRef } from 'react';
import {
   Plane, Hotel, Search, MapPin, Calendar, Star,
   ArrowRight, X, SlidersHorizontal, ChevronDown,
   Wifi, Coffee, Clock, ShieldCheck, IndianRupee, Loader2
} from 'lucide-react';

// --- 1. REALISTIC INDIAN DATA GENERATOR (SIMULATION ENGINE) ---
// This acts as your "Backend" to ensure data never fails and looks real.

const INDIAN_CITIES = [
   { code: 'DEL', name: 'New Delhi', airport: 'Indira Gandhi Intl' },
   { code: 'BOM', name: 'Mumbai', airport: 'Chhatrapati Shivaji' },
   { code: 'BLR', name: 'Bengaluru', airport: 'Kempegowda Intl' },
   { code: 'GOI', name: 'Goa', airport: 'Dabolim Airport' },
   { code: 'MAA', name: 'Chennai', airport: 'Chennai Intl' },
   { code: 'CCU', name: 'Kolkata', airport: 'Netaji Subhash Intl' },
   { code: 'HYD', name: 'Hyderabad', airport: 'Rajiv Gandhi Intl' },
   { code: 'JAI', name: 'Jaipur', airport: 'Jaipur Intl' },
   { code: 'COK', name: 'Kochi', airport: 'Cochin Intl' },
   { code: 'PNQ', name: 'Pune', airport: 'Pune Intl' },
];

const AIRLINES = [
   { name: 'IndiGo', code: '6E', color: 'text-blue-600' },
   { name: 'Air India', code: 'AI', color: 'text-orange-600' },
   { name: 'Vistara', code: 'UK', color: 'text-purple-700' },
   { name: 'Akasa Air', code: 'QP', color: 'text-orange-500' },
   { name: 'SpiceJet', code: 'SG', color: 'text-red-600' }
];

const HOTEL_CHAINS = ['Taj', 'Oberoi', 'ITC', 'Leela', 'Radisson Blu', 'Marriott', 'Hyatt Regency'];

// Helper to generate random Indian flights
const generateFlights = (page, filters) => {
   const data = [];
   const start = (page - 1) * 6;

   for (let i = 0; i < 6; i++) {
      const origin = filters.origin || INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
      let dest = filters.destination || INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];

      // Ensure Origin != Dest
      while (dest.code === origin.code) {
         dest = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
      }

      const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
      const price = 3000 + Math.floor(Math.random() * 8000); // ₹3000 - ₹11000

      // Generate realistic times
      const hour = Math.floor(Math.random() * 24);
      const min = Math.floor(Math.random() * 12) * 5;
      const depTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const durationMin = 90 + Math.floor(Math.random() * 180);
      const duration = `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`;

      data.push({
         id: `fl-${start + i}`,
         type: 'flight',
         operator: airline.name,
         flightNumber: `${airline.code}-${100 + Math.floor(Math.random() * 900)}`,
         originCode: origin.code,
         originCity: origin.name,
         destCode: dest.code,
         destCity: dest.name,
         price: price,
         duration: duration,
         departureTime: depTime,
         image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80', // Static reliable image
         rating: (3.5 + Math.random() * 1.5).toFixed(1)
      });
   }
   return data;
};

// Helper to generate random Indian Hotels
const generateHotels = (page, filters) => {
   const data = [];
   const start = (page - 1) * 6;
   const city = filters.destination || INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];

   for (let i = 0; i < 6; i++) {
      const chain = HOTEL_CHAINS[Math.floor(Math.random() * HOTEL_CHAINS.length)];
      const price = 4000 + Math.floor(Math.random() * 15000); // ₹4000 - ₹19000

      data.push({
         id: `ht-${start + i}`,
         type: 'hotel',
         name: `${chain} ${city.name}`,
         location: `${city.name}, India`,
         price: price,
         rating: (4.0 + Math.random()).toFixed(1),
         reviews: Math.floor(Math.random() * 2000),
         image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
         features: ['Free Wifi', 'Breakfast', 'Pool']
      });
   }
   return data;
};


// --- 2. COMPONENTS ---

const FlightCard = ({ data, onClick }) => (
   <div onClick={onClick} className="group relative h-64 w-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-slate-100 bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-90 transition-opacity group-hover:opacity-95" />
      {/* Dynamic Background Image */}
      <img src={`https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80`} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />

      <div className="absolute inset-0 p-6 flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
               {data.operator}
            </div>
            <div className="text-right">
               <span className="block text-2xl font-bold text-sky-400 flex items-center gap-1 justify-end">
                  <IndianRupee className="w-5 h-5" /> {data.price.toLocaleString('en-IN')}
               </span>
               <span className="text-xs text-slate-400">per person</span>
            </div>
         </div>

         <div>
            <div className="flex justify-between items-end mb-2">
               <div className="text-center">
                  <div className="text-3xl font-bold text-white">{data.originCode}</div>
                  <div className="text-xs text-slate-400">{data.originCity}</div>
               </div>

               <div className="flex-1 px-4 pb-2 flex flex-col items-center">
                  <div className="text-xs text-sky-400 font-bold mb-1">{data.duration}</div>
                  <div className="w-full h-[2px] bg-slate-600 relative">
                     <Plane className="w-4 h-4 text-white absolute -top-2 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Direct</div>
               </div>

               <div className="text-center">
                  <div className="text-3xl font-bold text-white">{data.destCode}</div>
                  <div className="text-xs text-slate-400">{data.destCity}</div>
               </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-4 border-t border-white/10 pt-3">
               <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Departs {data.departureTime}</span>
               <span className="ml-auto text-white font-bold flex items-center gap-1 group-hover:text-sky-400 transition-colors">Select <ArrowRight className="w-3 h-3" /></span>
            </div>
         </div>
      </div>
   </div>
);

const HotelCard = ({ data, onClick }) => (
   <div onClick={onClick} className="group relative h-80 w-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 bg-white border border-slate-200">
      <div className="h-48 overflow-hidden relative">
         <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" alt={data.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-orange-500 fill-orange-500" /> {data.rating}
         </div>
      </div>

      <div className="p-5">
         <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">{data.name}</h3>
         <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
            <MapPin className="w-3 h-3" /> {data.location}
         </p>

         <div className="flex justify-between items-end">
            <div>
               <p className="text-xs text-slate-400 line-through">₹{(data.price * 1.2).toFixed(0)}</p>
               <p className="text-xl font-bold text-slate-900 flex items-center">
                  <IndianRupee className="w-4 h-4" /> {data.price.toLocaleString('en-IN')}
               </p>
               <p className="text-[10px] text-slate-400">+ taxes</p>
            </div>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors">
               View Room
            </button>
         </div>
      </div>
   </div>
);

const DetailModal = ({ item, onClose }) => {
   if (!item) return null;
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
         <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
            <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white backdrop-blur-md transition-all"><X className="w-5 h-5" /></button>

            <div className="w-full md:w-1/2 bg-slate-100 relative h-64 md:h-auto">
               <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Detail" />
               <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h2 className="text-3xl font-bold">{item.name || item.destCity}</h2>
                  <p className="opacity-90">{item.location || `${item.originCity} to ${item.destCity}`}</p>
               </div>
            </div>

            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
               <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                     <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{item.type}</span>
                     <div className="text-right">
                        <span className="text-3xl font-bold text-slate-900 flex items-center justify-end"><IndianRupee className="w-6 h-6" /> {item.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-slate-400">Total Price</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="font-bold text-slate-800">Booking Details</h3>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <p className="text-xs text-slate-400 uppercase font-bold">Date</p>
                           <p className="font-medium text-slate-700">12 Dec, 2025</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <p className="text-xs text-slate-400 uppercase font-bold">Travelers</p>
                           <p className="font-medium text-slate-700">1 Adult</p>
                        </div>
                     </div>

                     <div className="p-4 bg-sky-50 rounded-xl text-sky-800 text-sm flex gap-3 items-start">
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        <p><b>Free Cancellation</b> available for this booking until 24 hours before check-in.</p>
                     </div>
                  </div>
               </div>

               <button className="w-full py-4 mt-6 bg-slate-900 text-white rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform flex justify-center items-center gap-2">
                  Pay Now <IndianRupee className="w-4 h-4" /> {item.price.toLocaleString('en-IN')}
               </button>
            </div>
         </div>
      </div>
   );
};

// --- 3. MAIN APP ---

const TravelApp = () => {
   const [activeTab, setActiveTab] = useState('flight');

   // Search State
   const [origin, setOrigin] = useState('');
   const [destination, setDestination] = useState('');
   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

   // Data State
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(false);
   const [page, setPage] = useState(1);
   const [selectedItem, setSelectedItem] = useState(null);

   // --- MOCK API CALL (Simulates Real Backend) ---
   const fetchData = (isNewSearch = false) => {
      setLoading(true);
      const currentPage = isNewSearch ? 1 : page;

      // Simulate Network Delay (800ms)
      setTimeout(() => {
         const filters = {
            origin: INDIAN_CITIES.find(c => c.name === origin),
            destination: INDIAN_CITIES.find(c => c.name === destination)
         };

         const newData = activeTab === 'flight'
            ? generateFlights(currentPage, filters)
            : generateHotels(currentPage, filters);

         if (isNewSearch) {
            setResults(newData);
         } else {
            setResults(prev => [...prev, ...newData]);
         }

         setPage(currentPage + 1);
         setLoading(false);
      }, 800);
   };

   // Initial Load
   useEffect(() => {
      fetchData(true);
   }, [activeTab]);

   return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">

         {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

         {/* --- HERO SECTION --- */}
         <div className="relative h-[400px] bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-black/30" />
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
               <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">
                  Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400">India.</span>
               </h1>
               <p className="text-slate-200 text-lg">Your journey through the incredible begins here.</p>
            </div>
         </div>

         {/* --- FLOATING SEARCH BAR --- */}
         <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 shadow-2xl">

               {/* TABS */}
               <div className="flex gap-4 mb-6">
                  <button onClick={() => setActiveTab('flight')} className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${activeTab === 'flight' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                     <Plane className="w-4 h-4" /> Flights
                  </button>
                  <button onClick={() => setActiveTab('hotel')} className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${activeTab === 'hotel' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                     <Hotel className="w-4 h-4" /> Hotels
                  </button>
               </div>

               {/* INPUTS GRID */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* 1. PICKUP LOCATION */}
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                     <MapPin className="w-5 h-5 text-slate-400" />
                     <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">
                           {activeTab === 'flight' ? 'From' : 'City'}
                        </label>
                        <select
                           value={origin}
                           onChange={(e) => setOrigin(e.target.value)}
                           className="w-full bg-transparent font-bold text-slate-800 outline-none text-sm appearance-none cursor-pointer"
                        >
                           <option value="">Select City</option>
                           {INDIAN_CITIES.map(c => <option key={c.code} value={c.name}>{c.name} ({c.code})</option>)}
                        </select>
                     </div>
                  </div>

                  {/* 2. DESTINATION (Only for Flight) */}
                  {activeTab === 'flight' && (
                     <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                        <Plane className="w-5 h-5 text-slate-400 rotate-90" />
                        <div className="flex-1">
                           <label className="text-[10px] font-bold text-slate-400 uppercase block">To</label>
                           <select
                              value={destination}
                              onChange={(e) => setDestination(e.target.value)}
                              className="w-full bg-transparent font-bold text-slate-800 outline-none text-sm appearance-none cursor-pointer"
                           >
                              <option value="">Anywhere</option>
                              {INDIAN_CITIES.map(c => <option key={c.code} value={c.name}>{c.name} ({c.code})</option>)}
                           </select>
                        </div>
                     </div>
                  )}

                  {/* 3. DATE */}
                  <div className={`bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 ${activeTab === 'hotel' ? 'md:col-span-2' : ''}`}>
                     <Calendar className="w-5 h-5 text-slate-400" />
                     <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Date</label>
                        <input
                           type="date"
                           value={date}
                           onChange={(e) => setDate(e.target.value)}
                           className="w-full bg-transparent font-bold text-slate-800 outline-none text-sm"
                        />
                     </div>
                  </div>

                  {/* 4. SEARCH BUTTON */}
                  <button
                     onClick={() => fetchData(true)}
                     disabled={loading}
                     className="bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-sky-200 transition-all flex items-center justify-center gap-2"
                  >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                  </button>
               </div>
            </div>
         </div>

         {/* --- RESULTS GRID --- */}
         <div className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               Best {activeTab === 'flight' ? 'Flights' : 'Hotels'} <span className="text-slate-400 text-sm font-normal ml-2">({results.length} found)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {results.map((item) => (
                  activeTab === 'flight'
                     ? <FlightCard key={item.id} data={item} onClick={() => setSelectedItem(item)} />
                     : <HotelCard key={item.id} data={item} onClick={() => setSelectedItem(item)} />
               ))}
            </div>

            {/* PAGINATION */}
            <div className="text-center mt-12">
               <button
                  onClick={() => fetchData(false)}
                  disabled={loading}
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
               >
                  {loading ? 'Loading...' : 'Load More Results'}
               </button>
            </div>
         </div>

      </div>
   );
};

export default TravelApp;