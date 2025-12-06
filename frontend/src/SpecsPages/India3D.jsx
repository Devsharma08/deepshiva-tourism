import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { getMapFromDB, saveMapToDB, logActivity } from "../utils/ContextManager"; // Added logActivity

// --- CONFIGURATION ---
const INDIA_MAP_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

const PASTEL_COLORS = [
  "#A7C7E7", "#FDFD96", "#77DD77", "#FF6961", "#B39EB5", 
  "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"
];

const NAME_FIXES = {
  "Orissa": "Odisha",
  "Uttaranchal": "Uttarakhand",
  "Pondicherry": "Puducherry",
  "NCT of Delhi": "Delhi",
  "Dadra and Nagar Haveli and Daman and Diu": "Dadra & Nagar Haveli",
  "Jammu and Kashmir": "J & K"
};

const India3D = () => {
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState(null);
  const [tooltipContent, setTooltipContent] = useState("");
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // --- LOAD MAP (DB First -> Network Second) ---
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const cachedMap = await getMapFromDB('india_main');
        if (cachedMap) {
          console.log("Loaded India Map from DB");
          setGeoData(cachedMap);
        } else {
          console.log("Fetching India Map from API...");
          const res = await fetch(INDIA_MAP_URL);
          const data = await res.json();
          setGeoData(data);
          await saveMapToDB('india_main', data);
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

  if (!geoData) return <div style={styles.loading}>Loading 3D India...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>INDIA</h1>
        <p style={styles.subtitle}>Interactive Tourism Map</p>
      </div>

      <div style={styles.mapContainer}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1100, center: [83, 23] }}
          style={styles.svgMap}
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const rawName = geo.properties.NAME_1 || geo.properties.st_nm || "Unknown";
                const stateName = NAME_FIXES[rawName] || rawName;
                const isHovered = hoveredRegion === geo.rsmKey;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    
                    // --- UPDATED CLICK HANDLER WITH LOGGING ---
                    onClick={async () => {
                        await logActivity(`User viewed State: ${stateName}`); // Log to DB
                        navigate(`/map/${stateName}`); // Then Navigate
                    }}
                    
                    onMouseEnter={() => {
                      setTooltipContent(stateName);
                      setHoveredRegion(geo.rsmKey);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                      setHoveredRegion(null);
                    }}
                    
                    fill={isHovered ? "#FFF" : getStateColor(stateName)}
                    stroke="#FFF"
                    strokeWidth={0.5}
                    className="state-path"
                    transform={isHovered ? "translate(0, -15)" : "translate(0, 0)"}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={`Explore ${stateName}`}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <Tooltip id="my-tooltip" style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#000", fontWeight: "bold", borderRadius: "8px" }} />
      </div>

      <style>{`
        .state-path { transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1); filter: drop-shadow(0px 5px 5px rgba(0,0,0,0.2)); cursor: pointer; }
        .state-path:hover { filter: drop-shadow(0px 30px 20px rgba(0,0,0,0.5)); opacity: 1; z-index: 1000; }
      `}</style>
    </div>
  );
};

const styles = {
  pageContainer: {
    width: "100%", height: "100vh",
    background: "radial-gradient(circle at 50% 50%, #2b32b2, #1488cc)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    overflow: "hidden", fontFamily: "'Inter', sans-serif"
  },
  header: { position: "absolute", top: "30px", textAlign: "center", zIndex: 10, color: "#fff", pointerEvents: "none" },
  title: { fontSize: "5rem", margin: 0, fontWeight: "800", letterSpacing: "8px", textShadow: "0 4px 10px rgba(0,0,0,0.3)" },
  subtitle: { fontSize: "1.2rem", color: "#e0e0e0", textTransform: "uppercase", letterSpacing: "4px" },
  mapContainer: {
    width: "100%", height: "90%",
    transform: "perspective(1200px) rotateX(25deg)", 
    display: "flex", justifyContent: "center"
  },
  svgMap: { width: "100%", height: "100%", overflow: "visible" },
  loading: { color: "white", fontSize: "1.5rem", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
};

export default India3D;