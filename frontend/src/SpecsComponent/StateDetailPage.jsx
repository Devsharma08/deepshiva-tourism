import React, { useState, useEffect } from 'react';
import { BookOpen, MapPin, ChevronDown, Loader2, Thermometer, Users, Building2, Wind } from 'lucide-react';
import { cachedFetch } from '../utils/ContextManager';

const DynamicStateCard = ({ data }) => {
  const safeData = data || {
    name: "Unknown State",
    regions: [],
    stats: { weather: "N/A", population: "N/A", capital: "N/A" }
  };

  const [selectedEntity, setSelectedEntity] = useState(safeData.name);
  const [wikiText, setWikiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- Wikipedia Disambiguation Mapping (All 36 States/UTs + Regions) ---
  const WIKI_DISAMBIGUATION = {
    // --- States ---
    'Arunachal Pradesh': 'Arunachal Pradesh',
    'Delhi': 'Delhi',
    'Lakshadweep': 'Lakshadweep',
    'Andaman and Nicobar Islands': 'Andaman and Nicobar Islands',
    'Andaman and Nicobar': 'Andaman and Nicobar Islands',
    'Andaman & Nicobar': 'Andaman and Nicobar Islands',
    'Dadra & Nagar Haveli and Daman & Diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'Chandigarh': 'Chandigarh',
    'Puducherry': 'Puducherry',
    'Ladakh': 'Ladakh',
    'J & K': 'Jammu and Kashmir',
    'Jammu and Kashmir': 'Jammu and Kashmir',
    'Telangana': 'Telangana',

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

    // --- Telangana regions ---
    'Hyderabad': 'Hyderabad',
    'Warangal': 'Warangal',
    'Ramoji Film City': 'Ramoji Film City',
    'Golconda': 'Golconda',
    'Charminar': 'Charminar',

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

  // --- API Fetch with Caching ---
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const wikiTitle = WIKI_DISAMBIGUATION[selectedEntity] || selectedEntity;
        const cacheKey = `wiki_${wikiTitle.replace(/\s/g, '_')}`;
        const endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(wikiTitle)}`;

        let result;
        try {
          result = await cachedFetch(endpoint, { cacheTTL: 24 * 60 * 60 * 1000, cacheKey });
        } catch {
          result = null;
        }

        if (result) {
          let pages = result.query.pages;
          let pageId = Object.keys(pages)[0];

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
            } catch { /* ignore */ }
          }

          if (pages[pageId] && pages[pageId].extract) {
            setWikiText(pages[pageId].extract);
          } else {
            setWikiText("Historical records are currently unavailable for this region. Please check back later.");
          }
        } else {
          setWikiText("Unable to connect. Content available when online.");
        }
      } catch (error) {
        setWikiText("Unable to load information. Please try again.");
      }
      setLoading(false);
    };

    fetchHistory();
  }, [selectedEntity]);

  useEffect(() => {
    setIsExpanded(false);
  }, [selectedEntity]);

  return (
    <div className="flex w-full items-center justify-center p-2 font-sans text-slate-800">
      {/* Main Card - Orange Theme */}
      <div className="relative z-10 w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 shadow-[0_20px_50px_-15px_rgba(251,146,60,0.15)] border border-orange-100/50 transition-all duration-300">

        {/* Header Section */}
        <div className="p-6 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-1.5 rounded-full border border-orange-200/50">
              📍 Explorer
            </span>
          </div>

          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent tracking-tight mb-5">
            {safeData.name}
          </h1>

          {/* Region Selector - Orange Theme */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <MapPin className="text-orange-500" size={18} />
            </div>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white/80 border border-orange-200 py-3.5 pl-11 pr-10 text-sm font-semibold text-slate-700 shadow-sm transition-all cursor-pointer hover:border-orange-400 hover:bg-white hover:shadow-md focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
            >
              <option value={safeData.name}>🏛️ Overview: {safeData.name}</option>
              {safeData.regions.map((region, index) => (
                <option key={index} value={region}>
                  📜 History: {region}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-hover:text-orange-500 transition-colors">
              <ChevronDown size={18} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-3">
          <div className="relative rounded-2xl bg-white/60 backdrop-blur-sm border border-orange-100/50 p-4">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-orange-500">
                <Loader2 className="animate-spin" size={28} />
                <span className="text-xs font-medium opacity-70">Accessing Archives...</span>
              </div>
            ) : (
              <div className="relative transition-all duration-500 ease-in-out">
                <div
                  className={`
                    text-sm leading-relaxed text-slate-600 text-justify transition-all duration-500
                    ${isExpanded ? 'max-h-64 overflow-y-auto pr-2 custom-scrollbar' : 'max-h-24 overflow-hidden'}
                  `}
                >
                  {wikiText}
                </div>

                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                )}
              </div>
            )}

            {/* Read More Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-2.5 text-sm font-bold text-orange-700 transition-all hover:from-orange-100 hover:to-amber-100 hover:shadow-md active:scale-95 border border-orange-200/50"
              >
                <span>{isExpanded ? 'Show Less' : 'Read Full History'}</span>
                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}>
                  <ChevronDown size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar - Orange Theme */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fff7ed;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #fb923c, #f59e0b);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ea580c, #d97706);
        }
      `}</style>
    </div>
  );
};

const WikiStateCard = ({ exampleData }) => {
  return <DynamicStateCard data={exampleData} />;
};

export default WikiStateCard;