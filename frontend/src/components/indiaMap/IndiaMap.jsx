import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { STATE_DATA } from "../../Data/TourismData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin, Mountain, Waves, TreePine, Compass, ChevronDown, ChevronUp,
  Sun, Landmark, Users, ArrowLeft, Calendar, Globe, Sparkles
} from "lucide-react";

// --- DATA CONSTANTS ---
const INDIA_MAP_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

const NAME_FIXES = {
  "Orissa": "Odisha", "Uttaranchal": "Uttarakhand", "Pondicherry": "Puducherry",
  "NCT of Delhi": "Delhi", "Jammu and Kashmir": "J & K"
};

const DEFAULT_STATE_DATA = {
  tagline: "Explore the Unexplored",
  description: "Discover the hidden gems of this beautiful region. From rich cultural heritage to stunning landscapes, this state offers a unique glimpse into the diversity of India.",
  image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1920&auto=format&fit=crop",
  stats: { visitors: "N/A", climate: "Varied", bestTime: "Year Round" },
  destinations: []
};

// Regional Data - Official Zonal Classification of India
const REGIONS_DATA = {
  north: {
    name: "North India",
    tagline: "Land of Himalayas & Heritage",
    icon: Mountain,
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop",
    states: ["Jammu & Kashmir", "Himachal Pradesh", "Punjab", "Haryana", "Delhi", "Uttarakhand", "Rajasthan", "Uttar Pradesh", "Chandigarh"],
    shortDesc: "Home to the majestic Himalayas and seat of ancient empires. From the spiritual waters of Ganga in Varanasi to the golden forts of Rajasthan, North India is where civilizations flourished.",
    fullDesc: "North India is the cradle of Indian civilization, home to the Indo-Gangetic plains where the Indus Valley Civilization thrived over 5,000 years ago. The region witnessed the rise and fall of great empires - the Mauryas, Guptas, Mughals, and the Delhi Sultanate. Today, it houses iconic monuments like the Taj Mahal, Red Fort, and ancient temples of Varanasi. The Himalayan states offer breathtaking landscapes, from the flower valleys of Uttarakhand to the Buddhist monasteries of Ladakh. Rajasthan's Thar Desert presents a stark contrast with its golden sand dunes and magnificent Rajput forts. The cuisine ranges from the rich Mughlai biryanis of Lucknow to the street chaats of Delhi.",
    specialties: ["Himalayan Treks", "Mughal Architecture", "Spiritual Tourism", "Desert Safaris", "Adventure Sports"]
  },
  south: {
    name: "South India",
    tagline: "Temples, Beaches & Backwaters",
    icon: Sun,
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop",
    states: ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Puducherry", "Lakshadweep"],
    shortDesc: "Where Dravidian culture flourishes amid ancient temples and serene backwaters. From the IT hubs of Bangalore to God's Own Country Kerala, the South blends tradition with modernity.",
    fullDesc: "South India is the guardian of Dravidian culture, with a heritage spanning over 2,000 years. The region boasts some of India's oldest and most magnificent temple architecture - from the towering gopurams of Meenakshi Temple to the intricate carvings of Hampi. Kerala's backwaters offer a unique ecosystem of palm-fringed canals, while Tamil Nadu's temples are UNESCO World Heritage sites. The Western Ghats, a biodiversity hotspot, run through the region offering pristine hill stations like Ooty and Munnar. Karnataka houses ancient sites of Mysore and Badami, while Andhra Pradesh and Telangana showcase the Kakatiya and Chola architectural marvels. The cuisine is distinctive - rice-based, with coconut, tamarind, and curry leaves defining the flavors.",
    specialties: ["Temple Architecture", "Backwater Cruises", "Ayurveda & Wellness", "Classical Dance", "Coffee Plantations"]
  },
  east: {
    name: "East India",
    tagline: "Where Culture Meets Nature",
    icon: Waves,
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop",
    states: ["Bihar", "Jharkhand", "Odisha", "West Bengal", "Andaman & Nicobar"],
    shortDesc: "The land where Buddhism was born and Bengal Renaissance flourished. From the ancient universities of Nalanda to the pristine beaches of Andaman, East India is culturally rich.",
    fullDesc: "East India is where Indian history began to be written. Bihar was home to Nalanda and Vikramshila, the world's earliest universities that attracted scholars from across Asia. It was here, in Bodh Gaya, that Buddha attained enlightenment. West Bengal nurtured the Bengal Renaissance that shaped modern Indian thought - from Rabindranath Tagore to Satyajit Ray. Kolkata still retains its colonial grandeur with the Victoria Memorial and Howrah Bridge. Odisha's Konark Sun Temple and Jagannath Puri are architectural marvels. The Sundarbans, the largest mangrove forest, is home to the Royal Bengal Tiger. The Andaman Islands offer pristine coral reefs and a dark history at Cellular Jail.",
    specialties: ["Buddhist Pilgrimage", "Colonial Heritage", "Tribal Culture", "Beach Tourism", "Literary Tourism"]
  },
  west: {
    name: "West India",
    tagline: "Commerce, Caves & Coastline",
    icon: Landmark,
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop",
    states: ["Goa", "Gujarat", "Maharashtra", "Dadra & Nagar Haveli", "Daman & Diu"],
    shortDesc: "India's commercial heart with ancient rock-cut caves and vibrant beaches. From Mumbai's film industry to Goa's Portuguese heritage, the West is diverse and dynamic.",
    fullDesc: "West India is the powerhouse of the Indian economy, with Mumbai serving as the financial and entertainment capital. The region has a rich history - the Ajanta and Ellora caves date back to the 2nd century BCE, showcasing Buddhist, Hindu, and Jain art. Gujarat was home to the Indus Valley sites of Lothal and Dholavira, and later the Solanki dynasty that built magnificent stepwells. Maharashtra's forts tell tales of the Maratha Empire. Goa, with its Portuguese colonial past, offers a unique blend of Indian and European cultures. The Konkan coastline provides stunning beaches and fresh seafood. The region is also the birthplace of Mahatma Gandhi, whose Sabarmati Ashram remains a pilgrimage site for freedom lovers.",
    specialties: ["Rock-Cut Caves", "Beach Holidays", "Bollywood Tours", "Wine Tourism", "Trading Heritage"]
  },
  central: {
    name: "Central India",
    tagline: "Heart of Incredible India",
    icon: Globe,
    color: "from-amber-400 to-yellow-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    image: "https://images.unsplash.com/photo-1590766940554-634e4be5a2c0?w=800&auto=format&fit=crop",
    states: ["Madhya Pradesh", "Chhattisgarh"],
    shortDesc: "The true heart of India with tiger reserves and ancient temples. Khajuraho's erotic sculptures and Sanchi's stupas reveal centuries of artistic and spiritual evolution.",
    fullDesc: "Central India, particularly Madhya Pradesh, is called the 'Heart of India' for good reason - it touches more states than any other. This region preserves India's natural heritage with tiger reserves at Kanha, Bandhavgarh, and Pench. Khajuraho's UNESCO-listed temples showcase medieval Indian art at its finest. Sanchi Stupa, commissioned by Emperor Ashoka, is one of the oldest stone structures in India. The tribal cultures of Chhattisgarh offer a glimpse into India's indigenous heritage. Gwalior Fort, Mandu's ruins, and Orchha's Bundela architecture dot the landscape. The region also houses the unique Buddhist site of Bhimbetka rock shelters, with paintings dating back 30,000 years.",
    specialties: ["Tiger Safaris", "Temple Art", "Tribal Heritage", "Rock Art", "Historic Forts"]
  },
  northeast: {
    name: "Northeast India",
    tagline: "Seven Sisters & Beyond",
    icon: TreePine,
    color: "from-teal-400 to-green-500",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop",
    states: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"],
    shortDesc: "India's untouched frontier where misty mountains meet vibrant tribal cultures. From Kaziranga's rhinos to living root bridges, the Northeast is nature at its most spectacular.",
    fullDesc: "Northeast India is a world apart - the 'Seven Sisters' and Sikkim offer landscapes and cultures found nowhere else in India. Assam's Kaziranga National Park is home to the world's largest population of one-horned rhinoceroses. Meghalaya, the 'abode of clouds,' has living root bridges created by the Khasi tribe and the wettest place on Earth. Arunachal Pradesh, the 'Land of the Rising Sun,' houses ancient Tawang Monastery. Sikkim blends Tibetan Buddhism with Himalayan beauty. Nagaland's Hornbill Festival celebrates the region's diverse tribal cultures. The region shares borders with Bhutan, China, Myanmar, and Bangladesh, making it a cultural melting pot. Its cuisine features fermented bamboo, smoked meats, and fiery chilies.",
    specialties: ["Wildlife Safaris", "Tribal Festivals", "Living Root Bridges", "Buddhist Monasteries", "Tea Gardens"]
  }
};

// India overview content
const INDIA_OVERVIEW = {
  title: "Incredible India",
  subtitle: "A Land of Timeless Wonders",
  intro: "India is a land where ancient traditions blend seamlessly with modern aspirations. With 5,000 years of continuous civilization, 22 official languages, and countless dialects, India is not just a country—it's a living museum of human heritage.",
  history: "From the Indus Valley Civilization (3300-1300 BCE) to the magnificent Mughal Empire, from the freedom struggle against British rule to becoming the world's largest democracy, India's history is a tapestry of triumphs and transformations. The country that gave the world yoga, zero, and the decimal system continues to be a cradle of innovation and spirituality.",
  geography: "Spanning from the Himalayan peaks in the north to the tropical shores in the south, India's geography is as diverse as its culture. The Thar Desert, Western Ghats, Deccan Plateau, and Indo-Gangetic Plains each offer unique ecosystems and experiences."
};

// State to Region mapping
const STATE_TO_REGION = {};
Object.entries(REGIONS_DATA).forEach(([regionKey, region]) => {
  region.states.forEach(state => {
    STATE_TO_REGION[state] = regionKey;
  });
});

// Color mapping for regions
const getRegionColor = (stateName) => {
  const regionKey = STATE_TO_REGION[stateName];
  const colorMap = {
    north: "#60A5FA",    // blue
    south: "#FB923C",    // orange  
    east: "#4ADE80",     // green
    west: "#C084FC",     // purple
    central: "#FBBF24",  // amber
    northeast: "#2DD4BF" // teal
  };
  return colorMap[regionKey] || "#94A3B8";
};

// --- Region Card Component ---
const RegionCard = ({ regionKey, region, onStateClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const Icon = region.icon;

  return (
    <div className={`${region.bgColor} ${region.borderColor} border-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300`}>
      {/* Header with Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={region.image}
          alt={region.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${region.color} opacity-60`} />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-5 h-5" />
            <h3 className="text-xl font-bold">{region.name}</h3>
          </div>
          <p className="text-sm opacity-90">{region.tagline}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Description */}
        <div ref={contentRef}>
          <p className="text-gray-700 text-sm leading-relaxed">
            {isExpanded ? region.fullDesc : region.shortDesc}
          </p>
        </div>

        {/* Read More Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Read More <ChevronDown className="w-4 h-4" /></>
          )}
        </button>

        {/* Specialties */}
        <div className="mt-4 flex flex-wrap gap-2">
          {region.specialties.slice(0, 3).map((specialty, i) => (
            <span key={i} className="text-xs bg-white/80 px-2 py-1 rounded-full text-gray-600 border">
              {specialty}
            </span>
          ))}
        </div>

        {/* States */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Explore States</p>
          <div className="flex flex-wrap gap-1">
            {region.states.slice(0, 5).map((state, i) => (
              <button
                key={i}
                onClick={() => onStateClick(state)}
                className="text-xs bg-white hover:bg-amber-100 px-2 py-1 rounded border border-gray-200 hover:border-amber-300 transition-colors"
              >
                {state}
              </button>
            ))}
            {region.states.length > 5 && (
              <span className="text-xs text-gray-400 px-2 py-1">+{region.states.length - 5} more</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- State Details Page ---
const StateDetailsPage = ({ stateName, onBack }) => {
  const data = STATE_DATA[stateName] || DEFAULT_STATE_DATA;
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      const cleanName = stateName === "J & K" ? "Jammu and Kashmir" : stateName;
      const urls = [
        `https://raw.githubusercontent.com/yuvraj-k/indian-map-geojson/master/district/${cleanName.toLowerCase().replace(/ /g, "-")}.json`,
        `https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States/${cleanName.replace(/ /g, "_")}.json`
      ];
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            setGeoData(json);
            break;
          }
        } catch (e) { }
      }
    };
    fetchDistricts();
  }, [stateName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">
      {/* Hero */}
      <div
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${data.image})` }}
      >
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </button>
        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-amber-300 font-medium mb-2">{data.tagline}</p>
          <h1 className="text-5xl font-bold">{stateName}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border-r">
              <div className="text-2xl mb-1">✈️</div>
              <div className="text-sm text-gray-500">Yearly Visitors</div>
              <div className="font-bold text-gray-800">{data.stats.visitors}</div>
            </div>
            <div className="text-center p-4 border-r">
              <div className="text-2xl mb-1">☀️</div>
              <div className="text-sm text-gray-500">Climate</div>
              <div className="font-bold text-gray-800">{data.stats.climate}</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-1">📅</div>
              <div className="text-sm text-gray-500">Best Time</div>
              <div className="font-bold text-gray-800">{data.stats.bestTime}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            About {stateName}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">{data.description}</p>
        </div>

        {/* Destinations */}
        {data.destinations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-amber-500" />
              Top Destinations
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {data.destinations.map((dest, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img src={dest.img} alt={dest.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">{dest.name}</h3>
                    <p className="text-gray-600 text-sm">{dest.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* District Map */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-amber-500" />
            Explore Districts
          </h2>
          <div className="h-[400px] rounded-xl overflow-hidden border-2 border-amber-200">
            {geoData ? (
              <MapContainer center={[20, 78]} zoom={6} style={{ height: "100%", width: "100%", background: "#FEF3C7" }}>
                <GeoJSON
                  data={geoData}
                  style={() => ({ fillColor: "#F59E0B", color: "#92400E", weight: 1, fillOpacity: 0.6 })}
                  onEachFeature={(feature, layer) => {
                    layer.bindTooltip(feature.properties.dtname || feature.properties.district, { direction: "center" });
                    layer.on('mouseover', function () { this.setStyle({ fillColor: "#D97706", fillOpacity: 0.8 }) });
                    layer.on('mouseout', function () { this.setStyle({ fillColor: "#F59E0B", fillOpacity: 0.6 }) });
                  }}
                />
                <FitBounds geoData={geoData} />
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-amber-600">
                <Compass className="w-8 h-8 animate-spin mr-3" />
                Loading map...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to fit map bounds
const FitBounds = ({ geoData }) => {
  const map = useMap();
  useEffect(() => {
    if (geoData) {
      const layer = L.geoJSON(geoData);
      map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }
  }, [geoData, map]);
  return null;
};

// --- MAIN COMPONENT ---
const IndiaTourism = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const regionsRef = useRef(null);

  const handleStateClick = (stateName) => {
    setSelectedState(stateName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToRegions = () => {
    regionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (selectedState) {
    return <StateDetailsPage stateName={selectedState} onBack={() => setSelectedState(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center pt-12 pb-8 px-6">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Compass className="w-4 h-4" />
            Interactive Map
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">India</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {INDIA_OVERVIEW.intro}
          </p>
        </div>

        {/* 3D Map */}
        <div className="flex-1 relative px-4">
          <div
            className="w-full h-[70vh] mx-auto"
            style={{
              transform: "perspective(1200px) rotateX(15deg)",
              transformOrigin: "center center"
            }}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1000, center: [83, 23] }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={INDIA_MAP_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const rawName = geo.properties.NAME_1 || geo.properties.st_nm || "Unknown";
                    const stateName = NAME_FIXES[rawName] || rawName;
                    const isHovered = hoveredRegion === geo.rsmKey;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleStateClick(stateName)}
                        onMouseEnter={() => setHoveredRegion(geo.rsmKey)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        fill={isHovered ? "#FFF" : getRegionColor(stateName)}
                        stroke="#FFF"
                        strokeWidth={0.8}
                        className="state-shape cursor-pointer"
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none" },
                          pressed: { outline: "none" }
                        }}
                        data-tooltip-id="map-tooltip"
                        data-tooltip-content={`Explore ${stateName}`}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
          <ReactTooltip
            id="map-tooltip"
            style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "8px",
              padding: "8px 16px"
            }}
          />
        </div>

        {/* Scroll Prompt */}
        <div className="text-center pb-8">
          <button
            onClick={scrollToRegions}
            className="inline-flex flex-col items-center text-amber-600 hover:text-amber-700 transition-colors"
          >
            <span className="text-sm font-medium mb-2">Explore Regions</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </section>

      {/* India Overview Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{INDIA_OVERVIEW.title}</h2>
            <p className="text-xl text-amber-600 font-medium">{INDIA_OVERVIEW.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-500" />
                Rich History
              </h3>
              <p className="text-gray-600 leading-relaxed">{INDIA_OVERVIEW.history}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Mountain className="w-5 h-5 text-green-500" />
                Diverse Geography
              </h3>
              <p className="text-gray-600 leading-relaxed">{INDIA_OVERVIEW.geography}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section ref={regionsRef} className="py-16 px-6 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Globe className="w-4 h-4" />
              Regional Guide
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover India's Regions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              India is divided into distinct geographical and cultural zones, each with its own unique character, traditions, and attractions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(REGIONS_DATA).map(([key, region]) => (
              <RegionCard
                key={key}
                regionKey={key}
                region={region}
                onStateClick={handleStateClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CSS for map animations */}
      <style>{`
        .state-shape { 
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); 
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15)); 
        }
        .state-shape:hover { 
          transform: translateY(-8px); 
          filter: drop-shadow(0 15px 20px rgba(0,0,0,0.25)); 
        }
      `}</style>
    </div>
  );
};

export default IndiaTourism;