import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import * as topojson from "topojson-client"; 
import { getMapFromDB, saveMapToDB, logActivity } from "../utils/ContextManager";

// --- PERMANENT SOURCE: HIGHCHARTS CDN ---
// This is an enterprise-grade link that will not break.
const INDIA_TOPO_URL = "https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json";

const PASTEL_COLORS = [
  "#A7C7E7", "#FDFD96", "#77DD77", "#FF6961", "#B39EB5", 
  "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"
];

// Names in Highcharts might differ slightly, this maps them to your standards
const NAME_FIXES = {
  "Orissa": "Odisha",
  "Uttaranchal": "Uttarakhand",
  "NCT of Delhi": "Delhi",
  "Andaman and Nicobar": "Andaman & Nicobar Islands",
  "Jammu and Kashmir": "J & K",
  "Laccadives": "Lakshadweep"
};

const India3D = () => {
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        // Unique cache key for Highcharts version
        const cachedMap = await getMapFromDB('india_states_highcharts_v1');
        
        if (cachedMap) {
          setGeoData(cachedMap);
        } else {
          console.log("Fetching map from Highcharts CDN...");
          const res = await fetch(INDIA_TOPO_URL);
          
          if (!res.ok) throw new Error(`Failed to load map: ${res.status}`);
          
          const topology = await res.json();
          
          // --- SMART LAYER DETECTION ---
          // Highcharts uses standard TopoJSON but keys vary (e.g., 'default', 'in-all').
          // This line grabs the first available map layer automatically.
          const layerKey = Object.keys(topology.objects)[0]; 
          const geojson = topojson.feature(topology, topology.objects[layerKey]);
          
          await saveMapToDB('india_states_highcharts_v1', geojson);
          setGeoData(geojson);
        }
      } catch (error) {
        console.error("Map Load Error:", error);
      }
    };
    loadMapData();
  }, []);

  const getStateColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
  };

  if (!geoData) return <div style={styles.loading}>Loading Map Data...</div>;

  return (
    <div style={styles.pageContainer}>
      
      {/* Stats Header - Top Right */}
      <div style={styles.statsHeader}>
         <div style={styles.statItem}>
            <span style={styles.statNumber}>36</span>
            <span style={styles.statLabel}>STATES & UTs</span>
         </div>
      </div>

      <div style={styles.mapContainer}>
        <ComposableMap
          projection="geoMercator"
          // Center [78, 22] keeps Lakshadweep visible on the left
          projectionConfig={{ scale: 1000, center: [78, 22] }}
          style={styles.svgMap}
        >
          <defs>
             <filter id="ocean-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur" />
                <feFlood floodColor="#0099ff" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
                <feMerge>
                   <feMergeNode in="coloredBlur" />
                   <feMergeNode in="SourceGraphic" />
                </feMerge>
             </filter>
          </defs>

          <g filter="url(#ocean-glow)">
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const props = geo.properties;
                  
                  // Highcharts often uses 'name' or 'hc-key'. We prioritize 'name'.
                  const rawName = props.name || props["hc-key"] || "Unknown";
                  const stateName = NAME_FIXES[rawName] || rawName;
                  const isHovered = hoveredRegion === geo.rsmKey;

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
                      
                      fill={isHovered ? "#FFFFFF" : getStateColor(stateName)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      className="state-path"
                      transform={isHovered ? "translate(0, -5)" : "translate(0, 0)"}
                      
                      data-tooltip-id="india-tooltip"
                      data-tooltip-content={stateName}
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
                backgroundColor: "#1e293b", 
                color: "#fff", 
                padding: "8px 12px",
                borderRadius: "8px",
                fontWeight: "600",
                zIndex: 1000
            }} 
        />
      </div>

      <style>{`
        .state-path { 
            transition: all 0.3s ease-out; 
            cursor: pointer; 
            outline: none; 
        }
        .state-path:hover { 
            opacity: 1; 
            z-index: 999; 
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.8));
        }
      `}</style>
    </div>
  );
};

const styles = {
  pageContainer: {
    width: "100%", height: "100vh",
    background: "radial-gradient(circle at center, #001f3f, #001220)", 
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    overflow: "hidden", fontFamily: "'Inter', sans-serif", position: "relative"
  },
  
  // Card Positioned Top Right
  statsHeader: {
    position: "absolute", 
    top: "30px", 
    right: "30px", 
    zIndex: 50,
    background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
    padding: "10px 25px", borderRadius: "30px",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center" },
  statNumber: { fontSize: "1.5rem", fontWeight: "800", color: "#fff" },
  statLabel: { fontSize: "0.7rem", fontWeight: "600", color: "#94a3b8", letterSpacing: "1px" },

  mapContainer: {
    width: "100%", height: "100%",
    transform: "perspective(1000px) rotateX(10deg) scale(0.9)", 
    display: "flex", justifyContent: "center", alignItems: "center"
  },
  svgMap: { width: "100%", height: "100%", overflow: "visible" },
  loading: { color: "#94a3b8", fontSize: "1.2rem", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
};

export default India3D;