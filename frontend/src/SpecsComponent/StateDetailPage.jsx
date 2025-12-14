import React, { useState, useEffect } from 'react';
import { BookOpen, MapPin, ChevronDown, Loader2, Thermometer, Users, Building2 } from 'lucide-react';
import { cachedFetch } from '../utils/ContextManager';

const DynamicStateCard = ({ data }) => {
  // --- State ---
  // If no data is passed, use a safe default to prevent crashing
  const safeData = data || {
    name: "Unknown State",
    regions: [],
    stats: { weather: "N/A", population: "N/A", capital: "N/A" }
  };

  const [selectedEntity, setSelectedEntity] = useState(safeData.name);
  const [wikiText, setWikiText] = useState("");
  const [loading, setLoading] = useState(false);

  // Controls the expand/scroll logic
  const [isExpanded, setIsExpanded] = useState(false);

  // --- Wikipedia Disambiguation Mapping (All 36 States/UTs + Regions) ---
  const WIKI_DISAMBIGUATION = {
    // --- States (for exact matching) ---
    'Arunachal Pradesh': 'Arunachal Pradesh',
    'Delhi': 'Delhi',
    'Lakshadweep': 'Lakshadweep',
    'Andaman and Nicobar Islands': 'Andaman and Nicobar Islands',
    'Dadra & Nagar Haveli and Daman & Diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'Chandigarh': 'Chandigarh',
    'Puducherry': 'Puducherry',
    'Ladakh': 'Ladakh',
    'J & K': 'Jammu and Kashmir',

    // --- Gujarat regions ---
    'Kutch': 'Kutch district',
    'Somnath': 'Somnath temple',
    'Gir': 'Gir Forest National Park',
    'Dwarka': 'Dwarka',

    // --- Rajasthan regions ---
    'Jaipur': 'Jaipur',
    'Udaipur': 'Udaipur',
    'Jaisalmer': 'Jaisalmer',
    'Jodhpur': 'Jodhpur',
    'Pushkar': 'Pushkar',

    // --- Manipur regions ---
    'Loktak': 'Loktak Lake',
    'Moirang': 'Moirang',
    'Imphal': 'Imphal',

    // --- Chhattisgarh regions ---
    'Bastar': 'Bastar district',
    'Jagdalpur': 'Jagdalpur',
    'Chitrakote': 'Chitrakote Falls',

    // --- Meghalaya regions ---
    'Dawki': 'Dawki, India',
    'Mawlynnong': 'Mawlynnong',
    'Cherrapunji': 'Cherrapunji',
    'Shillong': 'Shillong',

    // --- Sikkim regions ---
    'Lachung': 'Lachung',
    'Pelling': 'Pelling',
    'Gangtok': 'Gangtok',
    'Nathula': 'Nathu La',

    // --- Ladakh regions ---
    'Nubra Valley': 'Nubra Valley',
    'Pangong Tso': 'Pangong Lake',
    'Pangong': 'Pangong Lake',
    'Zanskar': 'Zanskar',
    'Leh': 'Leh',
    'Khardung La': 'Khardung La',

    // --- Arunachal Pradesh regions ---
    'Ziro': 'Ziro',
    'Bomdila': 'Bomdila',
    'Tawang': 'Tawang',
    'Itanagar': 'Itanagar',

    // --- Kerala regions ---
    'Alappuzha': 'Alappuzha',
    'Alleppey': 'Alappuzha',
    'Wayanad': 'Wayanad district',
    'Munnar': 'Munnar',
    'Thekkady': 'Thekkady',

    // --- Andaman regions ---
    'Ross Island': 'Ross Island, Andaman',
    'Neil Island': 'Neil Island',
    'Havelock': 'Havelock Island',
    'Port Blair': 'Port Blair',

    // --- Uttarakhand regions ---
    'Rishikesh': 'Rishikesh',
    'Haridwar': 'Haridwar',
    'Nainital': 'Nainital',
    'Mussoorie': 'Mussoorie',

    // --- Himachal Pradesh regions ---
    'Manali': 'Manali, Himachal Pradesh',
    'Shimla': 'Shimla',
    'Kasol': 'Kasol',
    'Dharamshala': 'Dharamshala',
    'Spiti': 'Spiti Valley',

    // --- Tamil Nadu regions ---
    'Ooty': 'Ooty',
    'Kodaikanal': 'Kodaikanal',
    'Mahabalipuram': 'Mahabalipuram',
    'Rameswaram': 'Rameswaram',

    // --- Kashmir regions ---
    'Srinagar': 'Srinagar',
    'Gulmarg': 'Gulmarg',
    'Pahalgam': 'Pahalgam',
    'Dal Lake': 'Dal Lake',

    // --- Goa regions ---
    'Panjim': 'Panaji',
    'Panaji': 'Panaji',
    'Calangute': 'Calangute',
    'Old Goa': 'Old Goa',

    // --- Maharashtra regions ---
    'Lonavala': 'Lonavala',
    'Mahabaleshwar': 'Mahabaleshwar',
    'Ajanta': 'Ajanta Caves',
    'Ellora': 'Ellora Caves',
  };

  // --- API Fetch with Caching for Offline Support ---
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Get the disambiguated title or use original
        const wikiTitle = WIKI_DISAMBIGUATION[selectedEntity] || selectedEntity;
        const cacheKey = `wiki_${wikiTitle.replace(/\s/g, '_')}`;

        // Try cached fetch with 24h TTL for Wikipedia content
        const endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(wikiTitle)}`;

        let result;
        try {
          result = await cachedFetch(endpoint, { cacheTTL: 24 * 60 * 60 * 1000, cacheKey });
        } catch {
          // Network error, will use stale cache if available via cachedFetch
          result = null;
        }

        if (result) {
          let pages = result.query.pages;
          let pageId = Object.keys(pages)[0];

          // If direct search fails, try search API
          if (pageId === '-1' || !pages[pageId].extract) {
            const searchEndpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(selectedEntity + ' India')}&srlimit=1`;
            const searchCacheKey = `wiki_search_${selectedEntity.replace(/\s/g, '_')}`;

            try {
              const searchResult = await cachedFetch(searchEndpoint, { cacheTTL: 24 * 60 * 60 * 1000, cacheKey: searchCacheKey });

              if (searchResult?.query?.search?.length > 0) {
                const bestMatch = searchResult.query.search[0].title;
                const matchEndpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(bestMatch)}`;
                const matchCacheKey = `wiki_${bestMatch.replace(/\s/g, '_')}`;

                result = await cachedFetch(matchEndpoint, { cacheTTL: 24 * 60 * 60 * 1000, cacheKey: matchCacheKey });
                pages = result.query.pages;
                pageId = Object.keys(pages)[0];
              }
            } catch { /* ignore search errors */ }
          }

          if (pages[pageId] && pages[pageId].extract) {
            setWikiText(pages[pageId].extract);
          } else {
            setWikiText("Historical records are currently unavailable for this specific region.");
          }
        } else {
          setWikiText("Unable to connect. Content available when online.");
        }
      } catch (error) {
        setWikiText("Unable to connect to the knowledge archives.");
      }
      setLoading(false);
    };

    fetchHistory();
  }, [selectedEntity]);

  // Reset expansion when changing dropdown options
  useEffect(() => {
    setIsExpanded(false);
  }, [selectedEntity]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-2 font-sans text-slate-800">

      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      {/* --- Main Card --- */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-md rounded-3xl bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300">

        {/* Header Section */}
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
              Explorer
            </span>

          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
            {safeData.name}
          </h1>

          {/* IMPROVED OPTION SELECTION */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin className="text-indigo-500" size={18} />
            </div>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full appearance-none rounded-xl bg-slate-50 border border-slate-200 py-3.5 pl-10 pr-10 text-sm font-semibold text-slate-700 shadow-sm transition-all cursor-pointer hover:border-indigo-300 hover:bg-white hover:shadow-md focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
            >
              <option value={safeData.name}>Overview: {safeData.name}</option>
              {safeData.regions.map((region, index) => (
                <option key={index} value={region}>
                  History: {region}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
              <ChevronDown size={18} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-2">
          <div className="relative rounded-2xl bg-white">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-indigo-500">
                <Loader2 className="animate-spin" size={28} />
                <span className="text-xs font-medium opacity-60">Accessing Archives...</span>
              </div>
            ) : (
              <div className="relative transition-all duration-500 ease-in-out">
                {/* LOGIC: 
                   If isExpanded = true: Height 64 (256px), Overflow Auto.
                   If isExpanded = false: Height 24 (96px), Overflow Hidden.
                */}
                <div
                  className={`
                    text-sm leading-relaxed text-slate-600 text-justify transition-all duration-500
                    ${isExpanded
                      ? 'h-64 overflow-y-auto pr-2 custom-scrollbar' // Expanded
                      : 'h-24 overflow-hidden' // Collapsed
                    }
                  `}
                >
                  {wikiText}
                </div>

                {/* Fade Out Gradient (Only show when NOT expanded) */}
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
            )}

            {/* Read More Trigger */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-2 rounded-full bg-slate-50 px-5 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
              >
                <span>{isExpanded ? 'Collapse' : 'Read Full History'}</span>
                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}>
                  <ChevronDown size={16} />
                </div>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Custom Scrollbar Styles for Light Theme */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
      `}</style>
    </div>
  );
};

// --- Example Usage (Parent Component) ---
const WikiStateCard = ({ exampleData }) => {
  useEffect(() => {
    console.log("from state detail", exampleData);

  }, [])
  return <DynamicStateCard data={exampleData} />;
};

export default WikiStateCard;