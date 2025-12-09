import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const LocationSearch = ({ label, onSelect, icon: Icon }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search to avoid spamming API
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const res = await fetch(`http://localhost:5000/api/locations?keyword=${query}`);
          const data = await res.json();
          setSuggestions(data);
          setIsOpen(true);
        } catch (err) {
          console.error(err);
        }
      }
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city) => {
    setQuery(`${city.name} (${city.iataCode})`);
    setSuggestions([]);
    setIsOpen(false);
    onSelect(city.iataCode); // Pass "LHR" back to parent
  };

  return (
    <div className="flex-1 relative group">
       <div className="bg-slate-100 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-sky-500 focus-within:bg-white transition-all">
          {Icon ? <Icon className="w-5 h-5 text-slate-400" /> : <MapPin className="w-5 h-5 text-slate-400" />}
          <div className="w-full">
            <label className="text-xs text-slate-400 block font-semibold uppercase">{label}</label>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a city..." 
              className="bg-transparent w-full outline-none font-bold text-slate-700 placeholder-slate-300" 
            />
          </div>
       </div>

       {/* Dropdown Results */}
       {isOpen && suggestions.length > 0 && (
         <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
           {suggestions.map((city) => (
             <div 
                key={city.id}
                onClick={() => handleSelect(city)}
                className="px-4 py-3 hover:bg-sky-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0"
             >
                <div>
                   <p className="font-bold text-slate-700">{city.name}</p>
                   <p className="text-xs text-slate-400">{city.address.countryName}</p>
                </div>
                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">{city.iataCode}</span>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default LocationSearch;