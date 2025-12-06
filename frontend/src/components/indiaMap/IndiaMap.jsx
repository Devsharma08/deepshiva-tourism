import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { STATE_DATA } from "../../Data/TourismData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- 1. ASSETS & FONTS ---
// Import Google Fonts dynamically
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// --- 2. DATA CONSTANTS ---
const INDIA_MAP_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

// MOCK DATABASE (Real Content for Key States)
// const STATE_DATA = {
//   "Rajasthan": {
//     tagline: "The Land of Kings",
//     description: "Rajasthan is a jewel in India's crown, a land where history is etched in golden sand and imposing forts. From the pink hues of Jaipur to the blue wash of Jodhpur, every corner tells a story of valor, romance, and royalty. Experience the Thar Desert, folk music, and the grandeur of Rajputana architecture.",
//     image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1920&auto=format&fit=crop",
//     stats: { visitors: "55 Million", climate: "Desert / Arid", bestTime: "Oct - Mar" },
//     destinations: [
//       { name: "Jaipur", desc: "The Pink City, home to Hawa Mahal & Amber Fort.", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop" },
//       { name: "Udaipur", desc: "City of Lakes, featuring the Lake Palace.", img: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&auto=format&fit=crop" },
//       { name: "Jaisalmer", desc: "The Golden City in the heart of the Thar Desert.", img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop" }
//     ]
//   },
//   "Kerala": {
//     tagline: "God's Own Country",
//     description: "Kerala is a tropical paradise of waving palms and wide sandy beaches. It is a narrow strip of land along the Arabian Sea, known for its backwaters, tea plantations, and ayurvedic heritage. A place to slow down and breathe.",
//     image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1920&auto=format&fit=crop",
//     stats: { visitors: "19 Million", climate: "Tropical Wet", bestTime: "Sep - Mar" },
//     destinations: [
//       { name: "Alleppey", desc: "World-famous backwaters and houseboats.", img: "https://images.unsplash.com/photo-1593693397690-362cb9666c74?w=600&auto=format&fit=crop" },
//       { name: "Munnar", desc: "Rolling hills covered in lush tea gardens.", img: "https://images.unsplash.com/photo-1596328906961-6e3427306236?w=600&auto=format&fit=crop" },
//       { name: "Varkala", desc: "Stunning cliff-side beaches and red rocks.", img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&auto=format&fit=crop" }
//     ]
//   },
//   "Goa": {
//     tagline: "Pearl of the Orient",
//     description: "Goa is India's pocket-sized paradise, blending Indian and Portuguese cultures. Famous for its sun, sand, and spices, it offers a laid-back vibe with vibrant nightlife, baroque churches, and pristine coastlines.",
//     image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1920&auto=format&fit=crop",
//     stats: { visitors: "8.5 Million", climate: "Tropical Monsoon", bestTime: "Nov - Feb" },
//     destinations: [
//       { name: "Palolem", desc: "A scenic beach lined with palm trees.", img: "https://images.unsplash.com/photo-1587923377755-6b8f15d90956?w=600&auto=format&fit=crop" },
//       { name: "Old Goa", desc: "Historic churches like Basilica of Bom Jesus.", img: "https://images.unsplash.com/photo-1590426189685-3e284a7e9447?w=600&auto=format&fit=crop" },
//       { name: "Dudhsagar", desc: "A majestic four-tiered waterfall.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop" }
//     ]
//   },
//   "Uttar Pradesh": {
//     tagline: "The Heartland of India",
//     description: "Home to the Taj Mahal and the spiritual capital Varanasi, UP is the historical and cultural engine of India. It is a land of Ganga-Jamuni tehzeeb, sacred rivers, and architectural marvels.",
//     image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1920&auto=format&fit=crop",
//     stats: { visitors: "100+ Million", climate: "Subtropical", bestTime: "Oct - Mar" },
//     destinations: [
//       { name: "Agra", desc: "Home of the Taj Mahal, a wonder of the world.", img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop" },
//       { name: "Varanasi", desc: "The oldest living city and spiritual hub.", img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop" },
//       { name: "Lucknow", desc: "The city of Nawabs and exquisite cuisine.", img: "https://images.unsplash.com/photo-1589370007204-633845eb5b0e?w=600&auto=format&fit=crop" }
//     ]
//   }
// };

const DEFAULT_STATE_DATA = {
  tagline: "Explore the Unexplored",
  description: "Discover the hidden gems of this beautiful region. From rich cultural heritage to stunning landscapes, this state offers a unique glimpse into the diversity of India.",
  image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1920&auto=format&fit=crop", // Generic India Image
  stats: { visitors: "N/A", climate: "Varied", bestTime: "Year Round" },
  destinations: []
};

const NAME_FIXES = {
  "Orissa": "Odisha", "Uttaranchal": "Uttarakhand", "Pondicherry": "Puducherry", "NCT of Delhi": "Delhi", "Jammu and Kashmir": "J & K"
};

// --- 3. PAGE COMPONENT: VINTAGE STATE DETAILS ---
const VintageStatePage = ({ stateName, onBack }) => {
  const data = STATE_DATA[stateName] || DEFAULT_STATE_DATA;
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Re-using the robust fetch logic for the district map
    const fetchDistricts = async () => {
      const cleanName = stateName === "J & K" ? "Jammu and Kashmir" : stateName;
      // Try multiple sources
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
        } catch(e) {}
      }
    };
    fetchDistricts();
  }, [stateName]);

  return (
    <div style={styles.vintageContainer}>
      {/* HERO SECTION */}
      <div style={{ ...styles.heroSection, backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${data.image})` }}>
        <button onClick={onBack} style={styles.backButton}>← Return to Map</button>
        <div style={styles.heroContent}>
          <h2 style={styles.vintageTagline}>{data.tagline}</h2>
          <h1 style={styles.vintageTitle}>{stateName}</h1>
        </div>
      </div>

      <div style={styles.paperContent}>
        {/* STATS RIBBON */}
        <div style={styles.statsRibbon}>
          <StatBox label="Yearly Visitors" value={data.stats.visitors} icon="✈️" />
          <div style={styles.statDivider}></div>
          <StatBox label="Climate" value={data.stats.climate} icon="☀️" />
          <div style={styles.statDivider}></div>
          <StatBox label="Best Time" value={data.stats.bestTime} icon="📅" />
        </div>

        {/* DESCRIPTION */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>The Story</h3>
          <p style={styles.bodyText}>{data.description}</p>
        </div>

        {/* TOP DESTINATIONS */}
        {data.destinations.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionHeader}>Top Destinations</h3>
            <div style={styles.cardGrid}>
              {data.destinations.map((dest, i) => (
                <div key={i} style={styles.destCard}>
                  <img src={dest.img} alt={dest.name} style={styles.cardImg} />
                  <div style={styles.cardInfo}>
                    <h4 style={styles.cardTitle}>{dest.name}</h4>
                    <p style={styles.cardDesc}>{dest.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERACTIVE DISTRICT MAP FRAMED */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Explore Districts</h3>
          <div style={styles.mapFrame}>
            <div style={styles.mapInner}>
              {geoData ? (
                <MapContainer center={[20, 78]} zoom={6} style={{ height: "100%", width: "100%", background: "#eaddcf" }}>
                  <GeoJSON 
                    data={geoData} 
                    style={() => ({ fillColor: "#c19a6b", color: "#5c4033", weight: 1, fillOpacity: 0.6 })} 
                    onEachFeature={(feature, layer) => {
                      layer.bindTooltip(feature.properties.dtname || feature.properties.district, { direction: "center", className: 'vintage-tooltip' });
                      layer.on('mouseover', function(){ this.setStyle({fillColor: "#8b4513", fillOpacity: 0.8}) });
                      layer.on('mouseout', function(){ this.setStyle({fillColor: "#c19a6b", fillOpacity: 0.6}) });
                    }}
                  />
                  <FitBounds geoData={geoData} />
                </MapContainer>
              ) : (
                <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#8b4513"}}>Loading Historical Map...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }) => (
  <div style={{ textAlign: "center", flex: 1 }}>
    <div style={{ fontSize: "1.5rem", marginBottom: "5px" }}>{icon}</div>
    <div style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "#555" }}>{label}</div>
    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2c3e50", fontFamily: "'Cinzel', serif" }}>{value}</div>
  </div>
);

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

// --- 4. HOME COMPONENT: 3D MAP ---
const IndiaTourism = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Pastel Color Generator
  const colors = ["#A7C7E7", "#FDFD96", "#77DD77", "#FF6961", "#B39EB5", "#FFDAC1", "#E2F0CB"];
  const getColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  if (selectedState) {
    return <VintageStatePage stateName={selectedState} onBack={() => setSelectedState(null)} />;
  }

  return (
    <div style={styles.homeContainer}>
      <div style={styles.homeHeader}>
        <h1 style={styles.homeTitle}>INDIA</h1>
        <p style={styles.homeSubtitle}>Click on a state to begin your journey</p>
      </div>

      <div style={styles.map3DWrapper}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1100, center: [83, 23] }}
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
                    onClick={() => setSelectedState(stateName)}
                    onMouseEnter={() => setHoveredRegion(geo.rsmKey)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    
                    // 3D & STYLE PROPS
                    fill={isHovered ? "#fff" : getColor(stateName)}
                    stroke="#FFF"
                    strokeWidth={0.5}
                    className="state-shape"
                    style={{ default: {outline:"none"}, hover: {outline:"none", cursor:"pointer"}, pressed: {outline:"none"} }}
                    data-tooltip-id="map-tooltip"
                    data-tooltip-content={`Explore ${stateName}`}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <ReactTooltip id="map-tooltip" style={{ background: "#222", color: "#fff", fontFamily: "'Lato', sans-serif" }} />
      </div>

      {/* Global CSS for Animations */}
      <style>{`
        .state-shape { transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2)); }
        .state-shape:hover { transform: translateY(-10px); filter: drop-shadow(0 20px 15px rgba(0,0,0,0.4)); opacity: 1; z-index: 100; }
        .vintage-tooltip { background: transparent; border: none; box-shadow: none; font-family: 'Cinzel', serif; font-weight: bold; color: #5c4033; }
      `}</style>
    </div>
  );
};

// --- 5. STYLES (INLINE CSS-IN-JS) ---
const styles = {
  // Home Styles
  homeContainer: {
    width: "100%", height: "100vh",
    background: "radial-gradient(circle at center, #1e3c72, #2a5298)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    overflow: "hidden"
  },
  homeHeader: { position: "absolute", top: 40, textAlign: "center", color: "#fff", zIndex: 10, pointerEvents: "none" },
  homeTitle: { fontFamily: "'Cinzel', serif", fontSize: "5rem", margin: 0, letterSpacing: "15px", textShadow: "0 5px 15px rgba(0,0,0,0.5)" },
  homeSubtitle: { fontFamily: "'Lato', sans-serif", fontSize: "1.2rem", letterSpacing: "3px", textTransform: "uppercase", opacity: 0.8 },
  map3DWrapper: {
    width: "100%", height: "80%",
    transform: "perspective(1200px) rotateX(25deg)",
    transition: "transform 0.5s",
  },

  // Vintage Page Styles
  vintageContainer: {
    width: "100%", height: "100vh", overflowY: "auto",
    backgroundColor: "#f4e4bc", // Parchment color
    fontFamily: "'Playfair Display', serif",
  },
  heroSection: {
    height: "60vh", backgroundSize: "cover", backgroundPosition: "center",
    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
    position: "relative", boxShadow: "inset 0 -100px 100px rgba(0,0,0,0.5)"
  },
  backButton: {
    position: "absolute", top: 20, left: 20, padding: "10px 20px",
    background: "rgba(0,0,0,0.6)", color: "#fff", border: "1px solid #fff",
    fontFamily: "'Lato', sans-serif", cursor: "pointer", textTransform: "uppercase", letterSpacing: "2px"
  },
  heroContent: { textAlign: "center", color: "#fff", textShadow: "0 4px 10px rgba(0,0,0,0.8)" },
  vintageTitle: { fontSize: "6rem", margin: 0, fontFamily: "'Cinzel', serif", letterSpacing: "5px" },
  vintageTagline: { fontSize: "1.5rem", fontStyle: "italic", fontFamily: "'Playfair Display', serif" },
  
  paperContent: {
    maxWidth: "1000px", margin: "-50px auto 50px", background: "#fff",
    padding: "40px", borderRadius: "2px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    position: "relative", border: "1px solid #d4af37" // Gold border
  },
  statsRibbon: {
    display: "flex", justifyContent: "space-between", padding: "20px 0",
    borderBottom: "2px solid #eee", marginBottom: "30px"
  },
  statDivider: { width: "1px", background: "#ddd" },
  
  section: { marginBottom: "50px" },
  sectionHeader: { 
    fontSize: "2rem", color: "#8b4513", borderBottom: "1px solid #d4af37", 
    display: "inline-block", paddingBottom: "10px", marginBottom: "20px", fontFamily: "'Cinzel', serif"
  },
  bodyText: { fontSize: "1.2rem", lineHeight: "1.8", color: "#333", fontFamily: "'Lato', sans-serif" },
  
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  destCard: { background: "#fff", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", borderRadius: "8px", overflow: "hidden", transition: "transform 0.3s" },
  cardImg: { width: "100%", height: "180px", objectFit: "cover" },
  cardInfo: { padding: "15px" },
  cardTitle: { margin: "0 0 10px", color: "#2c3e50" },
  cardDesc: { fontSize: "0.9rem", color: "#666", fontFamily: "'Lato', sans-serif" },
  
  mapFrame: {
    border: "10px solid #5c4033", borderRadius: "5px", padding: "5px", background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)", height: "400px"
  },
  mapInner: { width: "100%", height: "100%", background: "#eaddcf" }
};

export default IndiaTourism;