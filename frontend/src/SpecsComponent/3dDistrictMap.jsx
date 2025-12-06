import { useState,useEffect } from "react";

const District3DMap = ({ stateName }) => {
  const [geoData, setGeoData] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [error, setError] = useState(false);

  const DISTRICT_URLS = {
  "Maharashtra": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Maharashtra.json",
  "Karnataka": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Karnataka.json",
  "West Bengal": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/West%20Bengal.json",
  "J & K": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Jammu%20and%20Kashmir.json",
  "Delhi": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Delhi.json",
  "Odisha": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Odisha.json",
  "Tamil Nadu": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Tamil%20Nadu.json",
  "Uttar Pradesh": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Uttar%20Pradesh.json",
  "Rajasthan": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Rajasthan.json",
  "Gujarat": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Gujarat.json",
  "Kerala": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Kerala.json",
  "Punjab": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Punjab.json",
  "Haryana": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Haryana.json",
  "Assam": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Assam.json"
};
    const styles = {
  app: { width: "100%", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" },
  
  // Home Map
  homeContainer: { 
    width: "100%", 
    height: "100vh", 
    background: "radial-gradient(circle at 50% 50%, #2b32b2, #1488cc)",
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    overflow: "hidden" 
  },
  homeHeader: { 
    position: "absolute", 
    top: "40px", 
    textAlign: "center", 
    zIndex: 10, 
    color: "#fff" 
  },
  homeTitle: { 
    fontSize: "5rem", 
    margin: 0, 
    fontWeight: "800", 
    letterSpacing: "12px", 
    textShadow: "0 6px 15px rgba(0,0,0,0.4)",
    animation: "fadeInDown 0.8s ease"
  },
  homeSubtitle: { 
    fontSize: "1.2rem", 
    color: "#e0e0e0", 
    textTransform: "uppercase", 
    letterSpacing: "5px",
    animation: "fadeIn 1s ease 0.3s both"
  },
  homeMapWrapper: {
    width: "100%", 
    height: "90%",
    transform: "perspective(1500px) rotateX(28deg)",
    display: "flex", 
    justifyContent: "center",
    animation: "mapRise 1s ease 0.5s both"
  },
  mapSvg: { width: "100%", height: "100%", overflow: "visible" },

  // State Page
  statePage: { width: "100%", minHeight: "100vh", background: "#f8f9fa" },
  
  // Hero
  hero: { position: "relative", height: "75vh", width: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
  heroBg: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    backgroundSize: "cover", 
    backgroundPosition: "center",
    animation: "zoomIn 1.5s ease"
  },
  heroOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))" },
  backBtn: { 
    position: "absolute", 
    top: 35, 
    left: 35, 
    zIndex: 20, 
    background: "rgba(255,255,255,0.15)", 
    border: "1px solid rgba(255,255,255,0.3)", 
    color: "white", 
    padding: "12px 24px", 
    borderRadius: "50px", 
    cursor: "pointer", 
    backdropFilter: "blur(10px)",
    fontWeight: 600,
    fontSize: "1rem"
  },
  heroContent: { 
    position: "relative", 
    zIndex: 10, 
    textAlign: "center", 
    color: "white", 
    maxWidth: "900px", 
    padding: "30px",
    animation: "fadeInUp 1s ease 0.3s both"
  },
  heroTag: { 
    fontSize: "1rem", 
    letterSpacing: "4px", 
    textTransform: "uppercase", 
    background: "rgba(255,255,255,0.2)", 
    padding: "8px 20px", 
    borderRadius: "30px", 
    backdropFilter: "blur(10px)",
    display: "inline-block"
  },
  heroTitle: { 
    fontSize: "5.5rem", 
    margin: "20px 0", 
    fontWeight: "800", 
    textShadow: "0 10px 30px rgba(0,0,0,0.4)",
    letterSpacing: "2px"
  },
  heroDesc: { fontSize: "1.3rem", lineHeight: "1.8", opacity: 0.95, maxWidth: "700px", margin: "0 auto" },

  // Stats
  statsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
    gap: "25px", 
    padding: "50px 10%", 
    marginTop: "-80px", 
    position: "relative", 
    zIndex: 20 
  },
  statCard: { 
    padding: "30px", 
    borderRadius: "24px", 
    textAlign: "center", 
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid rgba(255,255,255,0.8)"
  },
  statIcon: { fontSize: "2.5rem", marginBottom: "15px", display: "block" },
  statValue: { margin: "0", fontSize: "2rem", color: "#222", fontWeight: "700" },
  statLabel: { margin: "8px 0 0", color: "#555", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px" },

  // Destination Rail
  railWrapper: { padding: "60px 0 40px", marginLeft: "10%", width: "90%", overflow: "hidden" },
  railHeading: { fontSize: "2.5rem", marginBottom: "30px", color: "#222", fontWeight: "700" },
  rail: {
    display: "flex",
    gap: "30px",
    overflowX: "auto",
    paddingBottom: "40px",
    paddingRight: "20px",
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
  },
  railCard: {
    minWidth: "300px",
    height: "380px",
    borderRadius: "24px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#fff",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
    scrollSnapAlign: "start",
    cursor: "pointer"
  },
  railImgWrap: { width: "100%", height: "100%", position: "relative", overflow: "hidden" },
  railImg: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" },
  railOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "60%",
    background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)"
  },
  railContent: { position: "absolute", bottom: "25px", left: "25px", zIndex: 10, color: "white" },
  railTitle: { fontSize: "1.6rem", margin: "0 0 8px", fontWeight: "700", textShadow: "0 2px 8px rgba(0,0,0,0.6)" },
  railSubtitle: { fontSize: "0.95rem", margin: 0, opacity: 0.95, fontWeight: "300", letterSpacing: "1.5px" },

  // District Maps
  districtSection: { padding: "60px 10%", background: "#fff" },
  district3DSection: { padding: "60px 10% 100px", background: "#f8f9fa" },
  sectionHeading: { 
    fontSize: "2.5rem", 
    marginBottom: "40px", 
    color: "#222", 
    borderLeft: "6px solid #3b82f6", 
    paddingLeft: "20px",
    fontWeight: "700"
  },
  mapFrame: { 
    height: "550px", 
    borderRadius: "24px", 
    overflow: "hidden", 
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)", 
    border: "1px solid #e5e7eb",
    position: "relative"
  },
  map3DFrame: {
    height: "650px",
    width: "100%",
    transform: "perspective(1200px) rotateX(22deg)",
    borderRadius: "30px",
    background: "radial-gradient(#ffffff, #f3f4f6)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
    border: "2px solid #fff",
    overflow: "hidden"
  }}

  useEffect(() => {

    const fetchData = async () => {
      setGeoData(null);
      setError(false);

      const url = DISTRICT_URLS[stateName];
      if (!url) {
        setError(true);
        return;
      }

      try {
        const res = await fetch(url);
        if (res.ok) {
          setGeoData(await res.json());
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      }
    };

    fetchData();
  }, [stateName]);

  if (error) return null;
  if (!geoData) return <div style={styles.mapMsg}>Loading 3D visualization...</div>;

  return (
    <div style={styles.district3DSection}>
      <h3 style={styles.sectionHeading}>3D District View</h3>
      
      <div style={styles.map3DFrame}>
        <ComposableMap
          projection="geoMercator"
          style={styles.mapSvg}
        >
          <ZoomableGroup center={[0,0]} zoom={1}>
            <Geographies geography={geoData}>
              {({ geographies }) => 
                geographies.map((geo) => {
                  const name = geo.properties.dtname || geo.properties.district || geo.properties.NAME_2 || "District";
                  const isHovered = hovered === geo.rsmKey;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHovered(geo.rsmKey)}
                      onMouseLeave={() => setHovered(null)}
                      fill={isHovered ? "#fff" : getColorByName(name, COLORS.district)}
                      stroke="#fff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" }
                      }}
                      className={isHovered ? "district-3d-hover" : "district-3d"}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <style>{`
        .district-3d {
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          cursor: pointer;
        }
        .district-3d-hover {
          filter: drop-shadow(0 18px 15px rgba(0,0,0,0.5));
          transform: translateY(-8px);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default District3DMap;