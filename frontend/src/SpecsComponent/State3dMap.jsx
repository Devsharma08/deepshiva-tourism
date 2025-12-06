import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from "react-tooltip"; 
import { getMapFromDB, saveMapToDB, logActivity } from "../utils/ContextManager";

// --- ICONS (SVG) ---
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

const MASTER_MAP_URL = "https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson";
const COLORS = ["#FFB7B2", "#B5EAD7", "#E2F0CB", "#FFDAC1", "#C7CEEA", "#FDFD96", "#FF9AA2", "#E0BBE4"];

const State3DMap = ({ stateName }) => {
  const [geoData, setGeoData] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing...");
  const [mapCenter, setMapCenter] = useState([80, 23]);
  const [mapZoom, setMapZoom] = useState(1); // Control Zoom State
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Note State
  const [userNote, setUserNote] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [tempNoteText, setTempNoteText] = useState("");

  // --- ZOOM HANDLERS ---
  const handleZoomIn = (e) => {
    e.stopPropagation();
    setMapZoom((prev) => Math.min(prev + 0.5, 4)); // Max zoom 4x
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setMapZoom((prev) => Math.max(prev - 0.5, 0.5)); // Min zoom 0.5x
  };

  const calculateCentroid = (features) => {
    if (!features || features.length === 0) return [80, 23];
    let totalLat = 0, totalLon = 0, points = 0;
    features.forEach(feature => {
      const geometry = feature.geometry;
      if (!geometry) return;
      const coords = geometry.type === "MultiPolygon" ? geometry.coordinates.flat(2) : geometry.coordinates.flat(1);
      coords.forEach(coord => { totalLon += coord[0]; totalLat += coord[1]; points++; });
    });
    return points > 0 ? [totalLon / points, totalLat / points] : [80, 23];
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAndFilterMap = async () => {
      setLoading(true);
      setStatus("Loading Data...");
      setSelectedRegion(null);
      
      const cleanName = stateName.trim().toLowerCase();
      const dbKey = `state_map_${cleanName}`; 
      const savedNote = localStorage.getItem(`note_${cleanName}`);
      if (savedNote) setUserNote(savedNote);

      try {
        const cachedState = await getMapFromDB(dbKey);
        if (cachedState && isMounted) {
          setGeoData(cachedState);
          setMapCenter(calculateCentroid(cachedState.features));
          setMapZoom(4); 
          setLoading(false);
          return;
        }
      } catch (e) { console.warn("DB access failed"); }

      try {
        let masterData = await getMapFromDB('india_master_geohacker');
        if (!masterData) {
          const res = await fetch(MASTER_MAP_URL);
          if (!res.ok) throw new Error("Network Error");
          masterData = await res.json();
          await saveMapToDB('india_master_geohacker', masterData);
        }

        if (masterData && masterData.features) {
          const stateFeatures = masterData.features.filter(feature => {
            const propName = (feature.properties.ST_NM || feature.properties.statename || "").toLowerCase();
            return propName === cleanName || cleanName.includes(propName) || propName.includes(cleanName);
          });

          if (stateFeatures.length > 0) {
            const filteredGeoJSON = { type: "FeatureCollection", features: stateFeatures };
            if (isMounted) {
              setGeoData(filteredGeoJSON);
              setMapCenter(calculateCentroid(stateFeatures));
              setMapZoom(4);
              await saveMapToDB(dbKey, filteredGeoJSON); 
            }
          } else {
             if(isMounted) setStatus(`No data found for ${stateName}`);
          }
        }
      } catch (e) {
        if (isMounted) { setStatus("Map Error"); setLoading(false); }
      }
      if (isMounted) setLoading(false);
    };
    fetchAndFilterMap();
    return () => { isMounted = false; };
  }, [stateName]);

  const handleSaveNote = () => {
    const cleanName = stateName.trim().toLowerCase();
    localStorage.setItem(`note_${cleanName}`, tempNoteText);
    setUserNote(tempNoteText);
    setShowNoteModal(false);
  };

  const getColor = (index) => COLORS[index % COLORS.length];

  return (
    <div style={styles.container}>
      
      {/* 3D Map Container */}
      <div style={styles.mapFrame} onClick={() => { setSelectedRegion(null); setShowNoteModal(false); }}>
        
        {/* --- CONTROLS LAYER --- */}
        
        {/* 1. Note Icon (Top Right) */}
        <div style={styles.noteIconWrapper}>
             <NoteIcon 
               filled={userNote.length > 0} 
               onClick={(e) => {
                 e.stopPropagation();
                 setTempNoteText(userNote);
                 setShowNoteModal(true);
               }} 
             />
        </div>

        {/* 2. Zoom Controls (Bottom Right) */}
        <div style={styles.zoomControls}>
          <ZoomIcon type="plus" onClick={handleZoomIn} />
          <ZoomIcon type="minus" onClick={handleZoomOut} />
        </div>

        {/* Note Modal */}
        {showNoteModal && (
          <div style={styles.noteModal} onClick={(e) => e.stopPropagation()}>
            <h4 style={styles.modalTitle}>Note for {stateName}</h4>
            <textarea 
              style={styles.textArea} 
              value={tempNoteText} 
              onChange={(e) => setTempNoteText(e.target.value)}
              placeholder="Add your travel notes..."
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSaveNote}>Save</button>
            </div>
          </div>
        )}

        {loading ? (
           <div style={styles.loading}><div className="spinner"></div><p>{status}</p></div>
        ) : geoData ? (
          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ scale: 1200 }} 
            style={styles.svgMap}
          >
             {/* LOCKED ZOOM: 
                - minZoom and maxZoom match the current 'mapZoom' state.
                - filterZoomEvent={() => false} disables the scroll wheel.
             */}
            <ZoomableGroup 
              center={mapCenter} 
              zoom={mapZoom} 
              minZoom={mapZoom} 
              maxZoom={mapZoom}
              filterZoomEvent={() => false} // <--- Disables Scroll Zoom
            > 
              <Geographies geography={geoData}>
                {({ geographies }) => 
                   geographies.map((geo, index) => {
                    const name = geo.properties.dtname || geo.properties.district || geo.properties.NAME_2 || "District";
                    const isHovered = hovered === geo.rsmKey;
                    const isSelected = selectedRegion && selectedRegion.name === name;
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        data-tooltip-id="district-tooltip"
                        data-tooltip-content={name}
                        onMouseEnter={() => { setHovered(geo.rsmKey); }}
                        onMouseLeave={() => { setHovered(null); }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await logActivity(`Clicked ${name}`);
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
                        transform={isHovered || isSelected ? "translate(0, -5)" : "translate(0, 0)"}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        ) : (
          <div style={styles.loading}>Map data unavailable.</div>
        )}
        
        {/* Info Card */}
        {selectedRegion && (
          <div style={styles.infoCard} onClick={(e) => e.stopPropagation()}>
            <h4 style={styles.infoTitle}>{selectedRegion.name}</h4>
            <div style={styles.infoBody}>
              <p><strong>Code:</strong> {selectedRegion.properties.dt_code || "N/A"}</p>
            </div>
            <button style={styles.closeBtn} onClick={() => setSelectedRegion(null)}>Close</button>
          </div>
        )}
      </div>

      <Tooltip 
        id="district-tooltip" 
        place="top"
        style={{ zIndex: 9999, backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px", fontWeight: "bold" }} 
      />

      <style>{`
        .district-shape { transition: all 0.3s ease; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3)); cursor: pointer; }
        .district-shape:hover { filter: drop-shadow(0 15px 10px rgba(0,0,0,0.4)); opacity: 1; z-index: 100; }
        .spinner { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles = {
  container: { position: "relative", height: "100%", width: "100%" }, 
  
  // NOTE: background is now TRANSPARENT to blend with the parent page's levitation effect
  mapFrame: {
    height: "100%", width: "100%",
    transform: "perspective(1000px) rotateX(10deg)", 
    borderRadius: "20px",
    background: "transparent", 
    overflow: "hidden", position: "relative",
    // Removed border/shadow to look like it's floating freely
  },
  
  svgMap: { width: "100%", height: "100%", overflow: "visible", cursor: "default" },
  loading: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#64748b" },
  
  noteIconWrapper: {
    position: "absolute", top: "15px", right: "15px",
    zIndex: 1100, display: "flex", alignItems: "center", gap: "10px"
  },
  
  // NEW: Zoom Controls Styling
  zoomControls: {
    position: "absolute", bottom: "30px", right: "20px",
    zIndex: 1100, display: "flex", flexDirection: "column", gap: "8px",
    background: "rgba(255,255,255,0.8)", backdropFilter: "blur(5px)",
    padding: "6px", borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  zoomBtn: {
    width: "36px", height: "36px", 
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "white", border: "1px solid #e2e8f0", 
    borderRadius: "8px", cursor: "pointer", color: "#475569",
    transition: "all 0.2s active"
  },

  noteModal: {
    position: "absolute", top: "50px", right: "15px", width: "220px",
    background: "#fff", padding: "15px", borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)", zIndex: 1200, animation: "fadeIn 0.2s ease"
  },
  modalTitle: { margin: "0 0 10px", fontSize: "0.9rem", color: "#333" },
  textArea: { width: "100%", height: "80px", marginBottom: "10px", padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.85rem", resize: "none" },
  modalActions: { display: "flex", justifyContent: "space-between", gap: "10px" },
  saveBtn: { flex: 1, padding: "6px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" },
  cancelBtn: { flex: 1, padding: "6px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" },

  infoCard: {
    position: "absolute", bottom: "20px", left: "20px",
    background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)",
    padding: "15px", borderRadius: "12px", width: "200px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    border: "1px solid rgba(255,255,255,0.5)",
    zIndex: 1001
  },
  infoTitle: { margin: "0 0 5px 0", color: "#1e293b", fontSize: "1rem" },
  infoBody: { fontSize: "0.85rem", color: "#475569" },
  closeBtn: { marginTop: "8px", width: "100%", padding: "5px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }
};

export default State3DMap;