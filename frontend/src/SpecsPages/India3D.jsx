// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// import { Tooltip } from "react-tooltip";
// import * as topojson from "topojson-client"; 
// import { getMapFromDB, saveMapToDB, logActivity } from "../utils/ContextManager";

// // --- PERMANENT SOURCE: HIGHCHARTS CDN ---
// // This is an enterprise-grade link that will not break.
// const INDIA_TOPO_URL = "https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json";

// const PASTEL_COLORS = [
//   "#A7C7E7", "#FDFD96", "#77DD77", "#FF6961", "#B39EB5", 
//   "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"
// ];

// // Names in Highcharts might differ slightly, this maps them to your standards
// const NAME_FIXES = {
//   "Orissa": "Odisha",
//   "Uttaranchal": "Uttarakhand",
//   "NCT of Delhi": "Delhi",
//   "Andaman and Nicobar": "Andaman & Nicobar Islands",
//   "Jammu and Kashmir": "J & K",
//   "Laccadives": "Lakshadweep"
// };

// const India3D = () => {
//   const navigate = useNavigate();
//   const [geoData, setGeoData] = useState(null);
//   const [hoveredRegion, setHoveredRegion] = useState(null);

//   useEffect(() => {
//     const loadMapData = async () => {
//       try {
//         // Unique cache key for Highcharts version
//         const cachedMap = await getMapFromDB('india_states_highcharts_v1');
        
//         if (cachedMap) {
//           setGeoData(cachedMap);
//         } else {
//           console.log("Fetching map from Highcharts CDN...");
//           const res = await fetch(INDIA_TOPO_URL);
          
//           if (!res.ok) throw new Error(`Failed to load map: ${res.status}`);
          
//           const topology = await res.json();
          
//           // --- SMART LAYER DETECTION ---
//           // Highcharts uses standard TopoJSON but keys vary (e.g., 'default', 'in-all').
//           // This line grabs the first available map layer automatically.
//           const layerKey = Object.keys(topology.objects)[0]; 
//           const geojson = topojson.feature(topology, topology.objects[layerKey]);
          
//           await saveMapToDB('india_states_highcharts_v1', geojson);
//           setGeoData(geojson);
//         }
//       } catch (error) {
//         console.error("Map Load Error:", error);
//       }
//     };
//     loadMapData();
//   }, []);

//   const getStateColor = (name) => {
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
//   };

//   if (!geoData) return <div style={styles.loading}>Loading Map Data...</div>;

//   return (
//     <div style={styles.pageContainer}>
      
//       {/* Stats Header - Top Right */}
//       <div style={styles.statsHeader}>
//          <div style={styles.statItem}>
//             <span style={styles.statNumber}>36</span>
//             <span style={styles.statLabel}>STATES & UTs</span>
//          </div>
//       </div>

//       <div style={styles.mapContainer}>
//         <ComposableMap
//           projection="geoMercator"
//           // Center [78, 22] keeps Lakshadweep visible on the left
//           projectionConfig={{ scale: 1000, center: [78, 22] }}
//           style={styles.svgMap}
//         >
//           <defs>
//              <filter id="ocean-glow" x="-50%" y="-50%" width="200%" height="200%">
//                 <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur" />
//                 <feFlood floodColor="#0099ff" result="color" />
//                 <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
//                 <feMerge>
//                    <feMergeNode in="coloredBlur" />
//                    <feMergeNode in="SourceGraphic" />
//                 </feMerge>
//              </filter>
//           </defs>

//           <g filter="url(#ocean-glow)">
//             <Geographies geography={geoData}>
//               {({ geographies }) =>
//                 geographies.map((geo) => {
//                   const props = geo.properties;
                  
//                   // Highcharts often uses 'name' or 'hc-key'. We prioritize 'name'.
//                   const rawName = props.name || props["hc-key"] || "Unknown";
//                   const stateName = NAME_FIXES[rawName] || rawName;
//                   const isHovered = hoveredRegion === geo.rsmKey;

//                   return (
//                     <Geography
//                       key={geo.rsmKey}
//                       geography={geo}
//                       onClick={async () => {
//                           await logActivity(`Viewed: ${stateName}`);
//                           navigate(`/map/${stateName}`);
//                       }}
//                       onMouseEnter={() => setHoveredRegion(geo.rsmKey)}
//                       onMouseLeave={() => setHoveredRegion(null)}
                      
//                       fill={isHovered ? "#FFFFFF" : getStateColor(stateName)}
//                       stroke="#FFFFFF"
//                       strokeWidth={0.5}
//                       className="state-path"
//                       transform={isHovered ? "translate(0, -5)" : "translate(0, 0)"}
                      
//                       data-tooltip-id="india-tooltip"
//                       data-tooltip-content={stateName}
//                     />
//                   );
//                 })
//               }
//             </Geographies>
//           </g>
//         </ComposableMap>
        
//         <Tooltip 
//             id="india-tooltip" 
//             style={{ 
//                 backgroundColor: "#1e293b", 
//                 color: "#fff", 
//                 padding: "8px 12px",
//                 borderRadius: "8px",
//                 fontWeight: "600",
//                 zIndex: 1000
//             }} 
//         />
//       </div>

//       <style>{`
//         .state-path { 
//             transition: all 0.3s ease-out; 
//             cursor: pointer; 
//             outline: none; 
//         }
//         .state-path:hover { 
//             opacity: 1; 
//             z-index: 999; 
//             filter: drop-shadow(0 0 10px rgba(255,255,255,0.8));
//         }
//       `}</style>
//     </div>
//   );
// };

// const styles = {
//   pageContainer: {
//     width: "100%", height: "100vh",
//     background: "radial-gradient(circle at center, #001f3f, #001220)", 
//     display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//     overflow: "hidden", fontFamily: "'Inter', sans-serif", position: "relative"
//   },
  
//   // Card Positioned Top Right
//   statsHeader: {
//     position: "absolute", 
//     top: "30px", 
//     right: "30px", 
//     zIndex: 50,
//     background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
//     padding: "10px 25px", borderRadius: "30px",
//     border: "1px solid rgba(255,255,255,0.1)"
//   },
//   statItem: { display: "flex", flexDirection: "column", alignItems: "center" },
//   statNumber: { fontSize: "1.5rem", fontWeight: "800", color: "#fff" },
//   statLabel: { fontSize: "0.7rem", fontWeight: "600", color: "#94a3b8", letterSpacing: "1px" },

//   mapContainer: {
//     width: "100%", height: "100%",
//     transform: "perspective(1000px) rotateX(10deg) scale(0.9)", 
//     display: "flex", justifyContent: "center", alignItems: "center"
//   },
//   svgMap: { width: "100%", height: "100%", overflow: "visible" },
//   loading: { color: "#94a3b8", fontSize: "1.2rem", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
// };

// export default India3D;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import * as topojson from "topojson-client"; 
import { getMapFromDB, saveMapToDB, logActivity } from "../utils/ContextManager";

// --- CONFIGURATION ---
const API_URL = "http://localhost:5000/api/state-stats"; 
const INDIA_TOPO_URL = "https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json";

// --- COLOR PALETTE ---
const PASTEL_COLORS = [
  "#A7C7E7", "#FDFD96", "#77DD77", "#FF6961", "#B39EB5", 
  "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"
];

// --- DATA NORMALIZATION (Map Key -> Database Key) ---
const NAME_FIXES = {
  "Orissa": "Odisha",
  "Uttaranchal": "Uttarakhand",
  "NCT of Delhi": "Delhi",
  "Andaman and Nicobar": "Andaman & Nicobar Islands",
  "Jammu and Kashmir": "Jammu and Kashmir", // Critical Fix
  "Laccadives": "Lakshadweep",
  "in-ld": "Lakshadweep",
  "in-jk": "Jammu and Kashmir",
  "in-py": "Puducherry"
};

// --- STATE GEOGRAPHIC CENTERS (For Distance Calc) ---
const STATE_CENTERS = {
  "Maharashtra": { lat: 19.7515, lng: 75.7139 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Kerala": { lat: 10.8505, lng: 76.2711 },
  "Rajasthan": { lat: 27.0238, lng: 74.2179 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Ladakh": { lat: 34.1526, lng: 77.5770 },
  "Goa": { lat: 15.2993, lng: 74.1240 },
  "Lakshadweep": { lat: 10.5667, lng: 72.6417 },
  "Andaman & Nicobar Islands": { lat: 11.7401, lng: 92.6586 },
  "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762 },
  "Gujarat": { lat: 22.2587, lng: 71.1924 },
  "Punjab": { lat: 31.1471, lng: 75.3412 },
  "Karnataka": { lat: 15.3173, lng: 75.7139 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
  "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
  "Telangana": { lat: 18.1124, lng: 79.0193 },
  "West Bengal": { lat: 22.9868, lng: 87.8550 },
  "Odisha": { lat: 20.9517, lng: 85.0985 },
  "Bihar": { lat: 25.0961, lng: 85.3131 },
  "Assam": { lat: 26.2006, lng: 92.9376 },
  "Sikkim": { lat: 27.5330, lng: 88.5122 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
  "Uttarakhand": { lat: 30.0668, lng: 79.0193 },
  "Meghalaya": { lat: 25.4670, lng: 91.3662 },
  "Manipur": { lat: 24.6637, lng: 93.9063 },
  "Mizoram": { lat: 23.1645, lng: 92.9376 },
  "Nagaland": { lat: 26.1584, lng: 94.5624 },
  "Tripura": { lat: 23.9408, lng: 91.9882 },
  "Arunachal Pradesh": { lat: 28.2180, lng: 94.7278 },
  "Jharkhand": { lat: 23.6102, lng: 85.2799 },
  "Chhattisgarh": { lat: 21.2787, lng: 81.8661 },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
  "Haryana": { lat: 29.0588, lng: 76.0856 },
  "Chandigarh": { lat: 30.7333, lng: 76.7794 }
};

const India3D = () => {
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [viewMode, setViewMode] = useState("default");
  const [userLocation, setUserLocation] = useState(null);
  const [regionStats, setRegionStats] = useState({});

  // --- 1. DATA LOADING ---
  useEffect(() => {
    // Load Map Topology
    const loadMapData = async () => {
      try {
        const cachedMap = await getMapFromDB('india_states_highcharts_v1');
        if (cachedMap) {
          setGeoData(cachedMap);
        } else {
          const res = await fetch(INDIA_TOPO_URL);
          if (!res.ok) throw new Error("TopoJSON fetch failed");
          const topology = await res.json();
          const layerKey = Object.keys(topology.objects)[0]; 
          const geojson = topojson.feature(topology, topology.objects[layerKey]);
          await saveMapToDB('india_states_highcharts_v1', geojson);
          setGeoData(geojson);
        }
      } catch (error) { console.error("Map Load Error:", error); }
    };

    // Load Live Stats from Node Backend
    const loadStats = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Stats API failed");
            const data = await res.json();
            setRegionStats(data);
            console.log("✅ Stats Loaded into Map:", data); 
        } catch (error) { console.error("Stats Fetch Error:", error); }
    };

    // Get User Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => console.warn("GPS Denied")
        );
    }

    loadMapData();
    loadStats();
  }, []);

  // --- 2. HELPERS ---
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lat2) return 0;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const getRegionStyle = (name) => {
    // Mode 1: Default (Pastel)
    if (viewMode === "default") {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
    }

    const stats = regionStats[name];
    
    // Fallback: Grey if no data found
    if (!stats) return "#e2e8f0"; 

    // Mode 2: Carbon Impact (Green -> Red)
    // Thresholds: 1.5+ (High/Red), 1.1+ (Med/Orange), <1.1 (Low/Green)
    if (viewMode === "carbon") {
        if (stats.carbon_factor >= 1.5) return "#ef4444"; 
        if (stats.carbon_factor >= 1.1) return "#f59e0b"; 
        return "#22c55e"; 
    }

    // Mode 3: Footfall (Light Blue -> Dark Blue)
    // Thresholds adapted to your seed data (Max ~120k)
    if (viewMode === "footfall") {
        if (stats.footfall > 80000) return "#172554"; // Massive
        if (stats.footfall > 40000) return "#1e3a8a"; // High
        if (stats.footfall > 20000) return "#3b82f6"; // Med
        if (stats.footfall > 5000) return "#93c5fd";  // Low
        return "#dbeafe"; // Very Low
    }
  };

  if (!geoData) return <div style={styles.loading}>Loading Map Visualization...</div>;

  return (
    <div style={styles.pageContainer}>
      
      {/* Header Controls */}
      <div style={styles.statsHeader}>
         <div style={styles.controlsRow}>
            <button style={viewMode === 'default' ? styles.activeBtn : styles.btn} onClick={() => setViewMode('default')}>Explore</button>
            <button style={viewMode === 'footfall' ? styles.activeBtn : styles.btn} onClick={() => setViewMode('footfall')}>Crowd Density</button>
            <button style={viewMode === 'carbon' ? styles.activeBtn : styles.btn} onClick={() => setViewMode('carbon')}>Eco Impact</button>
         </div>
      </div>

      <div style={styles.mapContainer}>
        <ComposableMap
          projection="geoMercator"
          // Center adjusted to include Lakshadweep
          projectionConfig={{ scale: 1000, center: [82, 22] }} 
          style={styles.svgMap}
        >
          <defs>
             <filter id="ocean-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur" />
                <feFlood floodColor="#0099ff" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
             </filter>
          </defs>

          <g filter="url(#ocean-glow)">
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const props = geo.properties;
                  const rawName = props.name || props["hc-key"] || "Unknown";
                  const stateName = NAME_FIXES[rawName] || rawName;
                  const isHovered = hoveredRegion === geo.rsmKey;
                  
                  const stats = regionStats[stateName];
                  const center = STATE_CENTERS[stateName];

                  // Tooltip Logic
                  let tooltipContent = stateName;
                  if (stats && viewMode !== 'default') {
                      if (viewMode === 'footfall') {
                          tooltipContent += ` | 👥 ~${stats.footfall.toLocaleString()}/day`;
                      } else if (viewMode === 'carbon') {
                          if (userLocation && center) {
                              const dist = calculateDistance(userLocation.lat, userLocation.lng, center.lat, center.lng);
                              // Formula: Distance * 0.12kg * RiskFactor
                              const carbon = Math.round((dist * 0.12) * stats.carbon_factor);
                              tooltipContent += ` | 🚗 ${dist}km | ☁️ ~${carbon} kg CO₂`;
                          } else {
                              tooltipContent += ` | Risk: ${stats.carbon_factor}x`;
                          }
                      }
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={async () => {
                          await logActivity(`Viewed: ${stateName}`);
                          navigate(`/map/${stateName}`);
                      }}
                      onMouseEnter={() => setHoveredRegion(geo.rsmKey)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      
                      fill={isHovered ? "#FFFFFF" : getRegionStyle(stateName)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      className="state-path"
                      
                      data-tooltip-id="india-tooltip"
                      data-tooltip-content={tooltipContent}
                    />
                  );
                })
              }
            </Geographies>
          </g>
        </ComposableMap>
        
        <Tooltip 
            id="india-tooltip" 
            style={{ 
                backgroundColor: "#0f172a", 
                color: "#f8fafc", 
                padding: "8px 12px",
                borderRadius: "8px", 
                zIndex: 1000 
            }} 
        />
      </div>

      <style>{`
        .state-path { transition: all 0.3s ease-out; cursor: pointer; outline: none; }
        .state-path:hover { opacity: 1; z-index: 999; filter: drop-shadow(0 0 15px rgba(255,255,255,0.6)); }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const styles = {
  pageContainer: {
    width: "100%", height: "100vh",
    background: "radial-gradient(circle at center, #001f3f, #001220)", 
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    overflow: "hidden", fontFamily: "'Inter', sans-serif", position: "relative"
  },
  statsHeader: {
    position: "absolute", top: "30px", right: "30px", zIndex: 50,
    background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
    padding: "10px", borderRadius: "30px",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  controlsRow: { display: "flex", gap: "10px" },
  btn: {
      background: "transparent", border: "none", color: "#94a3b8",
      padding: "8px 16px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600", transition: "0.2s"
  },
  activeBtn: {
      background: "rgba(255,255,255,0.15)", borderRadius: "20px", border: "none",
      color: "#fff", padding: "8px 16px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "700",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  },
  mapContainer: {
    width: "100%", height: "100%",
    transform: "perspective(1000px) rotateX(10deg) scale(0.95)", 
    display: "flex", justifyContent: "center", alignItems: "center"
  },
  svgMap: { width: "100%", height: "100%", overflow: "visible" },
  loading: { color: "#94a3b8", fontSize: "1.2rem", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
};

export default India3D;