import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import * as topojson from "topojson-client";
import { getMapFromDB, saveMapToDB, logActivity, cachedFetch } from "../utils/ContextManager";
import {
  MapPin, Mountain, Waves, TreePine, Compass, ChevronDown, ChevronUp,
  Sun, Landmark, Globe, Sparkles, Eye, EyeOff, Leaf, Users, Map,
  ZoomIn, ZoomOut, RotateCcw, Star, Calendar, Cloud, ArrowRight
} from "lucide-react";

// --- CONFIG ---
const API_BASE = "http://localhost:5000/api";
const INDIA_TOPO_URL = "https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json";

// --- NAME NORMALIZATION ---
const NAME_FIXES = {
  "Orissa": "Odisha", "Uttaranchal": "Uttarakhand", "NCT of Delhi": "Delhi",
  "Andaman and Nicobar": "Andaman & Nicobar", "Jammu and Kashmir": "J & K",
  "Laccadives": "Lakshadweep", "Dadra and Nagar Haveli": "Dadra & Nagar Haveli",
  "in-ld": "Lakshadweep", "in-jk": "J & K", "in-py": "Puducherry",
  "in-ar": "Arunachal Pradesh", "in-ch": "Chandigarh", "in-la": "Ladakh"
};

const PASTEL_COLORS = [
  "#FDE68A", // Warm Yellow
  "#FCA5A5", // Soft Red
  "#86EFAC", // Fresh Green
  "#93C5FD", // Sky Blue
  "#C4B5FD", // Lavender
  "#FDBA74", // Peach
  "#A5F3FC", // Cyan
  "#F9A8D4", // Pink
  "#FCD34D", // Golden
  "#6EE7B7", // Mint
  "#A78BFA", // Purple
  "#FB923C"  // Orange
];

// Regional Data with map centers for each region
const REGIONS_DATA = {
  north: {
    name: "North India",
    tagline: "Where Himalayas Touch the Sky",
    icon: Mountain,
    color: "#3B82F6",
    bgGradient: "from-blue-50 via-sky-50 to-cyan-50",
    borderColor: "border-blue-300",
    mapCenter: [77, 28],
    mapScale: 1800,
    states: ["J & K", "Ladakh", "Himachal Pradesh", "Punjab", "Haryana", "Delhi", "Chandigarh", "Uttarakhand", "Rajasthan", "Uttar Pradesh"],
    description: "North India stands as the cradle of Indian civilization, where snow-capped Himalayan peaks meet ancient temple spires. This is the land of the Taj Mahal, the spiritual Ganges, and magnificent Rajput forts that tell tales of valor and romance.",
    highlights: ["Taj Mahal - Agra", "Golden Temple - Amritsar", "Varanasi Ghats", "Jaipur Pink City", "Rishikesh Yoga Capital"],
    bestTime: "October - March",
    climate: "Alpine to Desert",
    famousFor: "Mughal Heritage, Spirituality, Adventure"
  },
  south: {
    name: "South India",
    tagline: "Land of Temples & Tranquility",
    icon: Sun,
    color: "#F97316",
    bgGradient: "from-orange-50 via-amber-50 to-yellow-50",
    borderColor: "border-orange-300",
    mapCenter: [78, 12],
    mapScale: 2200,
    states: ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Puducherry", "Lakshadweep"],
    description: "South India is a tropical paradise where ancient Dravidian temples rise majestically against backwater sunsets. From Kerala's serene houseboats to Tamil Nadu's magnificent gopurams, every corner whispers stories of a rich cultural heritage.",
    highlights: ["Kerala Backwaters", "Meenakshi Temple", "Hampi Ruins", "Mysore Palace", "Ooty Hill Station"],
    bestTime: "November - February",
    climate: "Tropical Wet",
    famousFor: "Temple Architecture, Ayurveda, Cuisine"
  },
  east: {
    name: "East India",
    tagline: "Birthplace of Enlightenment",
    icon: Waves,
    color: "#22C55E",
    bgGradient: "from-green-50 via-emerald-50 to-teal-50",
    borderColor: "border-green-300",
    mapCenter: [86, 22],
    mapScale: 2000,
    states: ["Bihar", "Jharkhand", "Odisha", "West Bengal", "Andaman & Nicobar"],
    description: "East India is where Buddha found enlightenment and Tagore penned immortal verses. The Sundarbans' mystical mangroves, Kolkata's colonial grandeur, and Odisha's ancient temples create a tapestry of nature and culture.",
    highlights: ["Bodh Gaya Temple", "Sundarbans Tiger Reserve", "Konark Sun Temple", "Victoria Memorial", "Darjeeling Tea Gardens"],
    bestTime: "October - March",
    climate: "Tropical Humid",
    famousFor: "Buddhist Heritage, Literature, Wildlife"
  },
  west: {
    name: "West India",
    tagline: "Where Dreams Meet the Sea",
    icon: Landmark,
    color: "#A855F7",
    bgGradient: "from-purple-50 via-fuchsia-50 to-pink-50",
    borderColor: "border-purple-300",
    mapCenter: [74, 19],
    mapScale: 2000,
    states: ["Goa", "Gujarat", "Maharashtra", "Dadra & Nagar Haveli", "Daman & Diu"],
    description: "West India pulses with the energy of Mumbai's dreams and Goa's golden beaches. Ancient cave temples, bustling markets, and the white desert of Rann create a vibrant mosaic of experiences.",
    highlights: ["Gateway of India", "Ajanta Ellora Caves", "Goa Beaches", "Rann of Kutch", "Elephanta Caves"],
    bestTime: "November - February",
    climate: "Semi-Arid to Coastal",
    famousFor: "Bollywood, Beaches, Ancient Caves"
  },
  central: {
    name: "Central India",
    tagline: "The Heart of Incredible India",
    icon: Globe,
    color: "#EAB308",
    bgGradient: "from-amber-50 via-yellow-50 to-orange-50",
    borderColor: "border-amber-300",
    mapCenter: [79, 23],
    mapScale: 2200,
    states: ["Madhya Pradesh", "Chhattisgarh"],
    description: "Central India beats as the nation's geographical heart, where tigers roam free in pristine forests and ancient temples showcase unmatched artistic mastery. Khajuraho's sculptures and Sanchi's stupas are testaments to India's glorious past.",
    highlights: ["Khajuraho Temples", "Sanchi Stupa", "Kanha Tiger Reserve", "Bandhavgarh National Park", "Orchha Fort"],
    bestTime: "October - March",
    climate: "Subtropical",
    famousFor: "Tiger Safaris, Temple Art, Tribal Culture"
  },
  northeast: {
    name: "Northeast India",
    tagline: "Paradise Unexplored",
    icon: TreePine,
    color: "#14B8A6",
    bgGradient: "from-teal-50 via-cyan-50 to-emerald-50",
    borderColor: "border-teal-300",
    mapCenter: [93, 26],
    mapScale: 2400,
    states: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"],
    description: "Northeast India remains India's last frontier, where living root bridges defy logic and one-horned rhinos roam misty grasslands. The Seven Sisters and Sikkim offer cultures, cuisines, and landscapes found nowhere else on Earth.",
    highlights: ["Kaziranga Rhinos", "Living Root Bridges", "Tawang Monastery", "Loktak Lake", "Hornbill Festival"],
    bestTime: "October - April",
    climate: "Subtropical Highland",
    famousFor: "Tribal Festivals, Wildlife, Tea Gardens"
  }
};

// Region Map Component - Shows ONLY that region with 3D styling
const RegionOnlyMap = ({ geoData, regionStates, regionColor, mapCenter, mapScale }) => {
  if (!geoData) return <div className="w-48 h-48 bg-gray-100 rounded-2xl animate-pulse" />;

  return (
    <div
      className="w-48 h-48 rounded-2xl overflow-hidden relative group"
      style={{
        background: `linear-gradient(135deg, ${regionColor}15 0%, ${regionColor}08 100%)`,
        border: `3px solid ${regionColor}40`,
        boxShadow: `0 8px 32px ${regionColor}25, 0 4px 12px rgba(0,0,0,0.08)`,
        transition: 'all 0.4s ease'
      }}
    >
      {/* 3D depth effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${regionColor}20 0%, transparent 50%)`
        }}
      />
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: mapScale * 0.9, center: mapCenter }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const rawName = geo.properties.name || geo.properties["hc-key"] || "";
              const stateName = NAME_FIXES[rawName] || rawName;
              const isInRegion = regionStates.includes(stateName);

              if (!isInRegion) return null;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={regionColor}
                  stroke="#FFFFFF"
                  strokeWidth={0.8}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#FFF", cursor: "pointer" }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

// Region Section Component - Map in box, text outside
const RegionSection = ({ region, geoData, onStateClick, isMapOnLeft }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = region.icon;

  return (
    <div className="py-8 border-b border-gray-100 last:border-0">
      <div className={`flex flex-col md:flex-row gap-8 items-start ${isMapOnLeft ? '' : 'md:flex-row-reverse'}`}>

        {/* Map Box - Only map is in the card */}
        <div className="flex-shrink-0 self-center md:self-start">
          <div
            className="p-4 rounded-3xl transition-all duration-300 hover:-translate-y-2"
            style={{
              background: `linear-gradient(145deg, ${region.color}08, ${region.color}03)`,
              boxShadow: `0 20px 40px ${region.color}15, 0 8px 16px rgba(0,0,0,0.05)`
            }}
          >
            <RegionOnlyMap
              geoData={geoData}
              regionStates={region.states}
              regionColor={region.color}
              mapCenter={region.mapCenter}
              mapScale={region.mapScale}
            />
          </div>
        </div>

        {/* Text Content - Outside the box */}
        <div className="flex-1 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div
                className="p-3 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${region.color}20, ${region.color}10)`,
                  boxShadow: `0 4px 12px ${region.color}20`
                }}
              >
                <Icon className="w-8 h-8" style={{ color: region.color }} />
              </div>
              <div>
                <h3
                  className="text-3xl md:text-4xl font-black tracking-tight"
                  style={{
                    background: `linear-gradient(135deg, ${region.color}, ${region.color}CC)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {region.name}
                </h3>
                <p className="text-base font-semibold text-gray-500 italic">{region.tagline}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-base">
            {isExpanded ? region.description : region.description.slice(0, 200) + "..."}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 font-bold inline-flex items-center gap-1 hover:underline transition-colors"
              style={{ color: region.color }}
            >
              {isExpanded ? <>Less <ChevronUp className="w-4 h-4" /></> : <>More <ChevronDown className="w-4 h-4" /></>}
            </button>
          </p>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm"><span className="font-semibold text-gray-700">Best:</span> {region.bestTime}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
              <Cloud className="w-4 h-4 text-gray-400" />
              <span className="text-sm"><span className="font-semibold text-gray-700">Climate:</span> {region.climate}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
              <Star className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">{region.famousFor}</span>
            </div>
          </div>

          {/* States */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" style={{ color: region.color }} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Explore States</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {region.states.map((state, i) => (
                <button
                  key={i}
                  onClick={() => onStateClick(state)}
                  className="text-sm px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  style={{
                    background: `${region.color}10`,
                    color: region.color,
                    border: `1.5px solid ${region.color}30`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = region.color;
                    e.target.style.color = '#FFF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = `${region.color}10`;
                    e.target.style.color = region.color;
                  }}
                >
                  {state} <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Top Experiences</div>
            <div className="flex flex-wrap gap-2">
              {region.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{ backgroundColor: `${region.color}12`, color: region.color }}
                >
                  ✦ {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
const India3D = () => {
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [viewMode, setViewMode] = useState("default");
  const [regionStats, setRegionStats] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [hideHotspots, setHideHotspots] = useState(false);
  const [zoom, setZoom] = useState(1);
  const regionsRef = useRef(null);

  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 3;

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const cachedMap = await getMapFromDB('india_states_v3');
        if (cachedMap) {
          setGeoData(cachedMap);
        } else {
          const res = await fetch(INDIA_TOPO_URL);
          const topology = await res.json();
          const layerKey = Object.keys(topology.objects)[0];
          const geojson = topojson.feature(topology, topology.objects[layerKey]);
          await saveMapToDB('india_states_v3', geojson);
          setGeoData(geojson);
        }
      } catch (error) { console.error("Map Error:", error); }
    };

    const loadData = async () => {
      try {
        const CACHE_TTL = 60 * 60 * 1000;
        const [stats, dests] = await Promise.all([
          cachedFetch(`${API_BASE}/state-stats`, { cacheTTL: CACHE_TTL, cacheKey: 'state_stats' }),
          cachedFetch(`${API_BASE}/destinations`, { cacheTTL: CACHE_TTL, cacheKey: 'destinations_list' })
        ]);
        if (stats) setRegionStats(stats);
        if (dests) setDestinations(dests);
      } catch (error) { console.error("Backend Error:", error); }
    };

    loadMapData();
    loadData();
  }, []);

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.25, MAX_ZOOM));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.25, MIN_ZOOM));
  const handleReset = () => setZoom(1);

  const getRegionStyle = (name) => {
    if (viewMode === "default") {
      let hash = 0;
      for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
      return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
    }
    const stats = regionStats[name];
    if (!stats) return "#e2e8f0";
    if (viewMode === "carbon") {
      if (stats.carbon_factor >= 1.5) return "#ef4444";
      if (stats.carbon_factor >= 1.2) return "#f59e0b";
      return "#22c55e";
    }
    if (viewMode === "footfall") {
      if (stats.footfall > 150000) return "#1e3a8a";
      if (stats.footfall > 80000) return "#1d4ed8";
      if (stats.footfall > 30000) return "#60a5fa";
      return "#93c5fd";
    }
  };

  const getMarkerColor = (footfall) => {
    if (footfall > 40000) return "#ef4444";
    if (footfall > 15000) return "#f59e0b";
    return "#22c55e";
  };

  const handleStateClick = async (stateName) => {
    await logActivity(`Viewed: ${stateName}`);
    navigate(`/map/${stateName}`);
  };

  if (!geoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Compass className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-amber-700 font-medium">Loading India Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">

      {/* Hero Section */}
      <section className="py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
              <Map className="w-4 h-4" /> Interactive Explorer
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">Incredible India</span>
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto">28 States • 8 Union Territories • Endless Adventures</p>
          </div>

          {/* Map + Filters in flex-row */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">

            {/* Filters Panel - Left (Narrower) */}
            <div className="lg:w-56 flex-shrink-0 space-y-3">
              {/* Map Filters */}
              <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-100">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Map Filters
                </h3>
                <div className="space-y-2">
                  <button onClick={() => setViewMode('default')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${viewMode === 'default' ? 'bg-amber-100 text-amber-700 font-semibold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    <Compass className="w-4 h-4" /> Explore
                  </button>
                  <button onClick={() => setViewMode('footfall')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${viewMode === 'footfall' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    <Users className="w-4 h-4" /> Crowd Heatmap
                  </button>
                  <button onClick={() => setViewMode('carbon')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${viewMode === 'carbon' ? 'bg-green-100 text-green-700 font-semibold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    <Leaf className="w-4 h-4" /> Eco Impact
                  </button>
                </div>
                <button onClick={() => setHideHotspots(!hideHotspots)} className={`mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${hideHotspots ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {hideHotspots ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {hideHotspots ? "Hotspots Hidden" : "Hide Hotspots"}
                </button>
              </div>

              {/* Zoom Controls - Button Only */}
              <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-100">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Zoom</h3>
                <div className="flex gap-2">
                  <button onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-40">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-40">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button onClick={handleReset} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">{(zoom * 100).toFixed(0)}%</p>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-100 grid grid-cols-2 gap-2 text-center">
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="text-lg font-black text-amber-600">28</div>
                  <div className="text-xs text-gray-500">States</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-2">
                  <div className="text-lg font-black text-orange-600">8</div>
                  <div className="text-xs text-gray-500">UTs</div>
                </div>
              </div>
            </div>

            {/* Map - Right (Larger) */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden h-[550px] relative">
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-orange-50/30 pointer-events-none z-10" />
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 1100 * zoom, center: [82, 22] }}
                  style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)" }}
                >
                  <Geographies geography={geoData}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const rawName = geo.properties.name || geo.properties["hc-key"] || "";
                        const stateName = NAME_FIXES[rawName] || rawName;
                        const isHovered = hoveredRegion === geo.rsmKey;
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => handleStateClick(stateName)}
                            onMouseEnter={() => setHoveredRegion(geo.rsmKey)}
                            onMouseLeave={() => setHoveredRegion(null)}
                            fill={getRegionStyle(stateName)}
                            stroke="#FFFFFF"
                            strokeWidth={isHovered ? 1.5 : 0.8}
                            className={`state-shape ${isHovered ? 'state-hovered' : ''}`}
                            data-tooltip-id="map-tooltip"
                            data-tooltip-content={`Explore ${stateName}`}
                            style={{
                              default: {
                                outline: "none",
                                transition: "all 0.3s ease",
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                              },
                              hover: {
                                outline: "none",
                                fill: "#FEF3C7",
                                stroke: "#F59E0B",
                                strokeWidth: 2,
                                filter: "drop-shadow(0 8px 16px rgba(245,158,11,0.4))",
                                cursor: "pointer"
                              },
                              pressed: {
                                outline: "none",
                                fill: "#FDE68A"
                              }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                  {!hideHotspots && destinations.map((place) => (
                    <Marker key={place.id} coordinates={[place.longitude, place.latitude]}>
                      <circle r={3 * zoom} fill={getMarkerColor(place.cached_footfall)} stroke="#fff" strokeWidth={1} className="cursor-pointer" />
                    </Marker>
                  ))}
                </ComposableMap>
                <Tooltip id="map-tooltip" style={{ background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "8px 12px" }} />
              </div>
            </div>
          </div>

          {/* Scroll */}
          <div className="text-center mt-6">
            <button onClick={() => regionsRef.current?.scrollIntoView({ behavior: 'smooth' })} className="text-amber-600 hover:text-amber-700 flex flex-col items-center mx-auto">
              <span className="text-sm font-medium">Explore Regions</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section ref={regionsRef} className="py-16 px-4 md:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Globe className="w-4 h-4" />
              Six Incredible Zones
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Explore India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">Diverse Regions</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">From snow-capped Himalayas to tropical backwaters, each region tells a unique story of culture, heritage, and natural beauty.</p>
          </div>

          <div className="space-y-4">
            {Object.entries(REGIONS_DATA).map(([key, region], index) => (
              <RegionSection
                key={key}
                region={region}
                geoData={geoData}
                onStateClick={handleStateClick}
                isMapOnLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .state-shape {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          transform-origin: center;
        }
        .state-shape:hover {
          transform: scale(1.08) translateY(-4px);
          filter: drop-shadow(0 16px 24px rgba(245,158,11,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.1)) !important;
        }
        .state-hovered {
          z-index: 100 !important;
        }
        /* 3D perspective effect on map container */
        .map-3d-container {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        .map-3d-container:hover {
          transform: rotateX(2deg) rotateY(-2deg);
        }
      `}</style>
    </div>
  );
};

export default India3D;