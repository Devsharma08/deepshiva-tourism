import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from "react-tooltip"; 
import { getMapFromDB, saveMapToDB, logActivity } from "../utils/ContextManager";
import { bbox } from "topojson-client"; // Optional if available, otherwise we estimate

// --- ICONS ---
const NoteIcon = ({ filled, onClick }) => (
  <div onClick={onClick} style={{ cursor: "pointer", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? "#FFD700" : "rgba(255,255,255,0.6)"} stroke={filled ? "#B8860B" : "#333"} strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
  </div>
);

const ZoomIcon = ({ type, onClick }) => (
  <button onClick={onClick} style={styles.zoomBtn}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {type === "plus" ? (
        <>
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </>
      ) : (
        <line x1="5" y1="12" x2="19" y2="12"></line>
      )}
    </svg>
  </button>
);

// UPDATED URL: Using a reliable topojson/geojson source if needed, but keeping the user's preferred source
const MASTER_MAP_URL = "https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson";
const COLORS = ["#FFB7B2", "#B5EAD7", "#E2F0CB", "#FFDAC1", "#C7CEEA", "#FDFD96", "#FF9AA2", "#E0BBE4"];

// --- NAME NORMALIZER ---
const normalizeStateName = (name) => {
    if (!name) return "";
    const lower = name.toLowerCase().trim();
    
    const mapping = {
        "odisha": "orissa",
        "uttarakhand": "uttaranchal",
        "j & k": "jammu and kashmir",
        "jammu & kashmir": "jammu and kashmir",
        "andaman and nicobar islands": "andaman & nicobar", // adjusted for common geojson keys
        "delhi": "nct of delhi",
        "bengaluru": "karnataka", 
        "pondicherry": "puducherry",
        "chhattisgarh": "chhatisgarh" // common spelling diff
    };

    return mapping[lower] || lower;
};

const State3DMap = ({ stateName }) => {
  const [geoData, setGeoData] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing...");
  
  // Default to India center, but update dynamically
  const [mapCenter, setMapCenter] = useState([80, 23]); 
  const [mapZoom, setMapZoom] = useState(1); 
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Note State
  const [userNote, setUserNote] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [tempNoteText, setTempNoteText] = useState("");

  const handleZoomIn = (e) => { e.stopPropagation(); setMapZoom(p => Math.min(p + 0.5, 8)); };
  const handleZoomOut = (e) => { e.stopPropagation(); setMapZoom(p => Math.max(p - 0.5, 0.5)); };

  // --- CENTROID CALCULATION ---
  const calculateCentroid = (features) => {
    if (!features || features.length === 0) return [78.9629, 20.5937]; // Fallback to India Center
    let totalLat = 0, totalLon = 0, count = 0;

    features.forEach(feature => {
        const geom = feature.geometry;
        if (!geom) return;

        // Recursive coordinate flattener
        const getPoints = (coords) => {
            if (typeof coords[0] === 'number') return [coords];
            return coords.reduce((acc, val) => acc.concat(getPoints(val)), []);
        };

        const points = getPoints(geom.coordinates);
        points.forEach(pt => {
            if(pt.length === 2) { totalLon += pt[0]; totalLat += pt[1]; count++; }
        });
    });

    return count > 0 ? [totalLon / count, totalLat / count] : [78.9629, 20.5937];
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadMap = async () => {
        setLoading(true);
        setStatus("Processing Map...");
        
        const targetState = normalizeStateName(stateName);
        
        // 1. UNIQUE CACHE KEY (Added 'v2' to bust old broken caches)
        const dbKey = `state_map_v2_${targetState.replace(/\s/g, '')}`;

        // 2. Clear bad state if needed
        // localStorage.removeItem(dbKey); // Uncomment if you want to force clear via code

        // Try Loading from Cache
        try {
            const cached = await getMapFromDB(dbKey);
            if (cached && cached.features && cached.features.length > 0) {
                if (isMounted) {
                    setGeoData(cached);
                    setMapCenter(calculateCentroid(cached.features));
                    setMapZoom(4); 
                    setLoading(false);
                }
                return;
            }
        } catch(e) { console.warn("Cache miss"); }

        // Fetch Master Data
        try {
            // Check if we have master data cached
            let masterData = await getMapFromDB('india_master_geo_v2');
            if (!masterData) {
                const res = await fetch(MASTER_MAP_URL);
                if (!res.ok) throw new Error("Failed to download map");
                masterData = await res.json();
                await saveMapToDB('india_master_geo_v2', masterData);
            }

            if (!masterData || !masterData.features) throw new Error("Invalid Map Data");

            // 3. ROBUST FILTERING
            const filteredFeatures = masterData.features.filter(f => {
                const p = f.properties;
                // Check ALL common property names
                const pName = (p.ST_NM || p.NAME_1 || p.statename || p.st_nm || "").toLowerCase();
                const normalizedPName = normalizeStateName(pName);
                
                // Strict check first, then inclusion
                return normalizedPName === targetState || normalizedPName.includes(targetState);
            });

            if (filteredFeatures.length > 0) {
                const finalData = { type: "FeatureCollection", features: filteredFeatures };
                if (isMounted) {
                    setGeoData(finalData);
                    setMapCenter(calculateCentroid(filteredFeatures));
                    setMapZoom(4); // Reset Zoom on load
                    saveMapToDB(dbKey, finalData); // Save the GOOD data
                }
            } else {
                console.error("State not found in GeoJSON properties:", targetState);
                if (isMounted) setStatus(`Boundaries not found for ${stateName}`);
            }

        } catch (err) {
            console.error(err);
            if (isMounted) setStatus("Map Data Error");
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    loadMap();
    return () => { isMounted = false; };
  }, [stateName]);

  const handleSaveNote = () => {
    localStorage.setItem(`note_${stateName}`, tempNoteText);
    setUserNote(tempNoteText);
    setShowNoteModal(false);
  };

  const getColor = (i) => COLORS[i % COLORS.length];

  return (
    <div style={styles.container}>
      <div style={styles.mapFrame} onClick={() => { setSelectedRegion(null); setShowNoteModal(false); }}>
        
        {/* Controls */}
        <div style={styles.noteIconWrapper}>
             <NoteIcon filled={!!userNote} onClick={(e) => { e.stopPropagation(); setTempNoteText(userNote); setShowNoteModal(true); }} />
        </div>
        <div style={styles.zoomControls}>
          <ZoomIcon type="plus" onClick={handleZoomIn} />
          <ZoomIcon type="minus" onClick={handleZoomOut} />
        </div>

        {/* Modal */}
        {showNoteModal && (
          <div style={styles.noteModal} onClick={e => e.stopPropagation()}>
            <h4 style={styles.modalTitle}>Note for {stateName}</h4>
            <textarea style={styles.textArea} value={tempNoteText} onChange={e => setTempNoteText(e.target.value)} />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSaveNote}>Save</button>
            </div>
          </div>
        )}

        {/* Map Render */}
        {loading ? (
            <div style={styles.loading}><div className="spinner"></div>{status}</div>
        ) : geoData ? (
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1200 }} style={styles.svgMap}>
             {/* Ensure the ZoomableGroup uses the state-controlled zoom and center.
                 disablePanning is optional, but helps keep the map centered on the state.
             */}
            <ZoomableGroup 
                center={mapCenter} 
                zoom={mapZoom}
                minZoom={0.5} maxZoom={10}
                filterZoomEvent={() => false} // Disable scroll wheel
                onMoveEnd={({ coordinates, zoom }) => {
                    // Optional: Update state if you want to allow panning to persist
                    // setMapCenter(coordinates);
                    // setMapZoom(zoom);
                }}
            > 
              <Geographies geography={geoData}>
                {({ geographies }) => 
                   geographies.map((geo, index) => {
                    // Try getting district name from multiple common keys
                    const name = geo.properties.district || geo.properties.NAME_2 || geo.properties.dtname || "District";
                    const isHovered = hovered === geo.rsmKey;
                    const isSelected = selectedRegion?.name === name;
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        data-tooltip-id="district-tooltip"
                        data-tooltip-content={name}
                        onMouseEnter={() => setHovered(geo.rsmKey)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRegion({ name, properties: geo.properties });
                        }}
                        fill={isSelected ? "#3b82f6" : (isHovered ? "#fff" : getColor(index))}
                        stroke="#fff"
                        strokeWidth={0.5}
                        style={{
                            default: { outline: "none" },
                            hover: { outline: "none" },
                            pressed: { outline: "none" },
                        }}
                        className="district-shape"
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        ) : (
           <div style={styles.loading}>{status}</div>
        )}
        
        {/* Info Card */}
        {selectedRegion && (
          <div style={styles.infoCard} onClick={e => e.stopPropagation()}>
            <h4 style={styles.infoTitle}>{selectedRegion.name}</h4>
            <div style={styles.infoBody}>
                 Code: {selectedRegion.properties.dt_code || selectedRegion.properties.id || "N/A"}
            </div>
            <button style={styles.closeBtn} onClick={() => setSelectedRegion(null)}>Close</button>
          </div>
        )}
      </div>

      <Tooltip id="district-tooltip" style={{ zIndex: 9999, backgroundColor: "#1e293b" }} />

      <style>{`
        .district-shape { transition: all 0.3s ease; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3)); cursor: pointer; }
        .district-shape:hover { filter: drop-shadow(0 10px 10px rgba(0,0,0,0.2)); opacity: 1; z-index: 100; }
        .spinner { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles = {
  container: { position: "relative", height: "100%", width: "100%" }, 
  mapFrame: { height: "100%", width: "100%", transform: "perspective(1000px) rotateX(10deg)", borderRadius: "20px", background: "transparent", overflow: "hidden", position: "relative" },
  svgMap: { width: "100%", height: "100%", cursor: "default" },
  loading: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#64748b", textAlign: "center", fontWeight: "600" },
  
  noteIconWrapper: { position: "absolute", top: "15px", right: "15px", zIndex: 1100 },
  zoomControls: { position: "absolute", bottom: "30px", right: "20px", zIndex: 1100, display: "flex", flexDirection: "column", gap: "8px", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(5px)", padding: "6px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  zoomBtn: { width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", color: "#475569" },

  noteModal: { position: "absolute", top: "50px", right: "15px", width: "220px", background: "#fff", padding: "15px", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", zIndex: 1200 },
  modalTitle: { margin: "0 0 10px", fontSize: "0.9rem", color: "#333" },
  textArea: { width: "100%", height: "80px", marginBottom: "10px", padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.85rem", resize: "none" },
  modalActions: { display: "flex", justifyContent: "space-between", gap: "10px" },
  saveBtn: { flex: 1, padding: "6px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" },
  cancelBtn: { flex: 1, padding: "6px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" },

  infoCard: { position: "absolute", bottom: "20px", left: "20px", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", padding: "15px", borderRadius: "12px", width: "200px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.5)", zIndex: 1001 },
  infoTitle: { margin: "0 0 5px 0", color: "#1e293b", fontSize: "1rem" },
  infoBody: { fontSize: "0.85rem", color: "#475569" },
  closeBtn: { marginTop: "8px", width: "100%", padding: "5px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }
};

export default State3DMap;