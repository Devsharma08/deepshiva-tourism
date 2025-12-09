import React, { useState, useEffect, useRef } from 'react';
import { Plane, Hotel, Search, MapPin, Filter,AlertTriangle, ChevronDown, SlidersHorizontal } from 'lucide-react';
import FlightCard from '../SpecsComponent/cards/FlighCard';
import LocationSearch from '../SpecsComponent/LocationSearch.jsx'
import DetailModal from '../SpecsComponent/cards/DetailModel.jsx'
import HomeDeals from '../SpecsComponent/cards/HomeDeals.jsx';
import HotelCard from '../SpecsComponent/cards/HotelCard.jsx';

// import DetailModal from '../SpecsComponent/cards/DetailModel.jsx';


const BookingPage = () => {
  // --- GLOBAL STATE ---
  const [activeTab, setActiveTab] = useState('flight'); // 'flight' | 'hotel'
  
  // --- FORM DATA ---
  const [originCode, setOriginCode] = useState('');
  const [destCode, setDestCode] = useState(''); // Used as 'City Code' for hotels
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // --- FILTERS ---
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('price_asc');

  // --- RESULT DATA ---
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- TAB SWITCH HANDLER ---
  const switchTab = (tab) => {
    setActiveTab(tab);
    setResults([]);
    setPage(1);
    setHasMore(false);
    setError(null);
    // Reset filters to defaults
    setMaxPrice(2000);
    setSortBy('price_asc');
  };

  // --- FETCH LOGIC ---
  const fetchData = async (isNewSearch = false) => {
    const currentPage = isNewSearch ? 1 : page;
    
    // VALIDATION
    if (activeTab === 'flight' && (!originCode || !destCode)) {
        setError("Please select both Origin and Destination."); return;
    }
    if (activeTab === 'hotel' && !destCode) {
        setError("Please select a city to search hotels."); return;
    }

    setLoading(true);
    setError(null);

    try {
        const queryParams = new URLSearchParams({
            origin: originCode,
            destination: destCode, // For flight this is dest, for hotel this is cityCode
            cityCode: destCode,    // Redundant but clear for hotel API
            date: date,
            maxPrice: maxPrice.toString(),
            sort: sortBy,
            page: currentPage.toString()
        });

        const endpoint = activeTab === 'flight' 
            ? `http://localhost:5000/api/flights?${queryParams}`
            : `http://localhost:5000/api/hotels?${queryParams}`;

        const res = await fetch(endpoint);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        if (isNewSearch) {
            setResults(data.data || []);
        } else {
            setResults(prev => [...prev, ...data.data]);
        }
        
        setHasMore(data.hasMore);
        setPage(currentPage + 1);

    } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data.");
    } finally {
        setLoading(false);
    }
  };

  // Re-fetch when filters change (Debounced slightly in a real app, direct here)
  useEffect(() => {
    if (results.length > 0) fetchData(true);
  }, [maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 relative">
      
      {/* --- MODAL --- */}
      {selectedItem && (
        <DetailModal 
            item={selectedItem} 
            type={activeTab} // 'flight' or 'hotel'
            onClose={() => setSelectedItem(null)} 
        />
      )}

      {/* --- HEADER --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all">
         <div className="max-w-7xl mx-auto px-6 py-4">
            
            {/* Top Row: Tabs & Inputs */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
               
               {/* 1. Tab Switcher */}
               <div className="flex bg-slate-100 p-1 rounded-full shrink-0">
                  <button 
                    onClick={() => switchTab('flight')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'flight' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     <Plane className="w-4 h-4" /> Flights
                  </button>
                  <button 
                    onClick={() => switchTab('hotel')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'hotel' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     <Hotel className="w-4 h-4" /> Hotels
                  </button>
               </div>

               {/* 2. Inputs (Conditional Rendering) */}
               <div className="flex flex-col md:flex-row gap-2 w-full">
                  {activeTab === 'flight' && (
                     <div className="flex-1">
                        <LocationSearch label="From" icon={Plane} onSelect={setOriginCode} />
                     </div>
                  )}
                  
                  <div className="flex-1">
                     <LocationSearch 
                        label={activeTab === 'flight' ? "To" : "Where do you want to stay?"} 
                        icon={MapPin} 
                        onSelect={setDestCode} 
                     />
                  </div>
                  
                  {activeTab === 'flight' && (
                      <input 
                        type="date" 
                        value={date} onChange={(e) => setDate(e.target.value)}
                        className="bg-slate-100 hover:bg-white border border-transparent focus:border-sky-500 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none transition-all"
                      />
                  )}

                  <button 
                     onClick={() => fetchData(true)}
                     disabled={loading}
                     className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-70 disabled:scale-100 whitespace-nowrap"
                  >
                     {loading ? '...' : 'Search'}
                  </button>
               </div>
            </div>

            {/* Bottom Row: Filters (Only if results exist) */}
            {results.length > 0 && (
                <div className="mt-4 flex gap-4 overflow-x-auto pb-2 items-center animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl">
                        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold uppercase text-slate-400">Max Price</span>
                        <input 
                            type="range" min="100" max="3000" step="100"
                            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-24 accent-sky-500 cursor-pointer"
                        />
                        <span className="font-bold text-sm min-w-[3rem]">${maxPrice}</span>
                    </div>

                    <div className="relative">
                        <select 
                            value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-slate-100 pl-4 pr-10 py-2 rounded-xl font-bold text-sm outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                            <option value="price_asc">Cheapest First</option>
                            <option value="price_desc">Costliest First</option>
                            {activeTab === 'flight' ? (
                                <>
                                    <option value="departure_asc">Earliest Departure</option>
                                    <option value="departure_desc">Latest Departure</option>
                                </>
                            ) : (
                                <option value="rating_desc">Highest Rated</option>
                            )}
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-6 py-8">
         
         {/* ERROR BANNER */}
         {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-pulse">
               <AlertTriangle className="w-5 h-5" /> {error}
            </div>
         )}

         {/* EMPTY STATE */}
         {!loading && results.length === 0 && !error && (
            <div className="text-center py-24 opacity-60">
               <div className="inline-block p-6 rounded-full bg-slate-100 mb-4">
                  {activeTab === 'flight' ? <Plane className="w-12 h-12 text-slate-300"/> : <Hotel className="w-12 h-12 text-slate-300"/>}
               </div>
               <h2 className="text-2xl font-bold text-slate-400">Start your search</h2>
               <p className="text-slate-400">Find the best {activeTab}s for your trip.</p>
            </div>
         )}

         {/* GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((item, index) => (
               activeTab === 'flight' ? (
                   <FlightCard 
                      key={`${item.id}-${index}`} 
                      data={item} 
                      onClick={() => setSelectedItem(item)} 
                   />
               ) : (
                   <HotelCard 
                      key={`${item.id}-${index}`} 
                      data={item} 
                      onClick={() => setSelectedItem(item)} 
                   />
               )
            ))}
            
            {/* SKELETONS */}
            {loading && [1,2,3].map(i => (
                <div key={i} className="h-72 bg-slate-200 rounded-3xl animate-pulse" />
            ))}
         </div>

         {/* LOAD MORE */}
         {hasMore && !loading && (
            <div className="text-center mt-16">
               <button 
                  onClick={() => fetchData(false)}
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center gap-2 mx-auto"
               >
                  <RefreshCw className="w-4 h-4" /> Load More {activeTab === 'flight' ? 'Flights' : 'Hotels'}
               </button>
            </div>
         )}

      </div>
    </div>
  );
};

export default BookingPage;