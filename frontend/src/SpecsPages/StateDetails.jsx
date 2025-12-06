import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Thermometer, Calendar, Shield, Train, Plane, Utensils,
  Cloud, Sun, CloudRain, CloudLightning, Snowflake, Wind, ChevronRight, ChevronDown
} from "lucide-react";
import { getStateData, getStateDesc } from "../Data/TourismData";
import DestinationRail from "../SpecsComponent/DestinationRail";
import State3DMap from "../SpecsComponent/State3dMap";
import { FashionProgressBar } from "../assets/ScrollingEffect";
import NewsCarousel from "../SpecsComponent/NewsComponent";
import WikiStateCard from "../SpecsComponent/StateDetailPage.jsx";
import RegionalDashboard from "../SpecsComponent/Foot.jsx";

// --- VISUAL ASSETS ---
const CONDITIONS = [
  { type: 'Sunny', icon: Sun, color: '#facc15', bg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(249, 115, 22, 0.2))' },
  { type: 'Cloudy', icon: Cloud, color: '#cbd5e1', bg: 'linear-gradient(135deg, rgba(100, 116, 139, 0.2), rgba(71, 85, 105, 0.2))' },
  { type: 'Rainy', icon: CloudRain, color: '#60a5fa', bg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(8, 145, 178, 0.2))' },
  { type: 'Stormy', icon: CloudLightning, color: '#c084fc', bg: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.2))' },
  { type: 'Snowy', icon: Snowflake, color: '#a5f3fc', bg: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2))' },
  { type: 'Windy', icon: Wind, color: '#5eead4', bg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(16, 185, 129, 0.2))' },
];

const mapApiToCondition = (mainWeather) => {
    switch (mainWeather) {
        case 'Clear': return CONDITIONS.find(c => c.type === 'Sunny');
        case 'Clouds': return CONDITIONS.find(c => c.type === 'Cloudy');
        case 'Rain': case 'Drizzle': return CONDITIONS.find(c => c.type === 'Rainy');
        case 'Thunderstorm': return CONDITIONS.find(c => c.type === 'Stormy');
        case 'Snow': return CONDITIONS.find(c => c.type === 'Snowy');
        default: return CONDITIONS.find(c => c.type === 'Windy');
    }
};

// --- MAIN COMPONENT ---
const StateDetails = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const data = getStateData(stateName); 
  const descData = getStateDesc(stateName);
  
  const [forecast, setForecast] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [showFullForecast, setShowFullForecast] = useState(false); 

  const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; 

  useEffect(() => window.scrollTo(0, 0), [stateName]);

  useEffect(() => {
    const fetchWeather = async () => {
        if (!stateName) return;
        setWeatherLoading(true);

        try {
            // FIX: Handle Spaces and Edge Cases
            let queryName = stateName;
            if (stateName === "J & K") queryName = "Jammu and Kashmir";
            if (stateName === "Odisha") queryName = "Bhubaneswar"; 
            if (stateName === "Andaman and Nicobar Islands") queryName = "Port Blair";

            const encodedName = encodeURIComponent(queryName);
            
            // 1. Geocoding
            const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodedName},IN&limit=1&appid=${API_KEY}`);
            const geoData = await geoRes.json();

            if (!geoData || !geoData.length) throw new Error("Location not found");
            const { lat, lon } = geoData[0];

            // 2. Forecast
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const weatherData = await weatherRes.json();

            // 3. Process Data
            const dailyData = {};
            weatherData.list.forEach((entry) => {
                const dateObj = new Date(entry.dt * 1000);
                const dayKey = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

                if (!dailyData[dayKey]) {
                    dailyData[dayKey] = {
                        name: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
                        date: dateObj.getDate(),
                        min: entry.main.temp_min,
                        max: entry.main.temp_max,
                        conditionType: entry.weather[0].main,
                    };
                } else {
                    dailyData[dayKey].min = Math.min(dailyData[dayKey].min, entry.main.temp_min);
                    dailyData[dayKey].max = Math.max(dailyData[dayKey].max, entry.main.temp_max);
                }
            });

            const processedForecast = Object.values(dailyData).map(day => ({
                ...day,
                max: Math.round(day.max),
                min: Math.round(day.min),
                condition: mapApiToCondition(day.conditionType) || CONDITIONS[1] 
            }));

            setForecast(processedForecast);
        } catch (error) {
            console.error("Weather Error:", error);
        } finally {
            setWeatherLoading(false);
        }
    };

    fetchWeather();
  }, [stateName]);

  if (!data) return <div style={styles.loading}>Region Not Found</div>;

  return (
    <div style={styles.pageWrapper}>
      
      {/* --- 1. HERO SECTION --- */}
      <div style={styles.heroSection}>
        <div style={{...styles.heroBg, backgroundImage: `url(${data.heroImage})`}} />
        <div style={styles.heroOverlay} />
        
        <button onClick={() => navigate('/map')} style={styles.backBtn}>
          <ArrowLeft size={20} /> Back
        </button>

        <div style={styles.heroContent}>
          <span style={styles.tagline}>{data.tagline?.toUpperCase() || "INCREDIBLE INDIA"}</span>
          <h1 style={styles.title}>{data.name}</h1>
          
          <div style={styles.statsRow}>
            <StatBadge icon={<Thermometer size={16}/>} label={data.stats.weather} />
            <StatBadge icon={<Calendar size={16}/>} label={data.stats.bestTime} />
            <StatBadge icon={<MapPin size={16}/>} label={`${data.destinations.length} Hotspots`} />
          </div>

          {/* --- ANIMATED WEATHER RAIL --- */}
          {/* We control the maxWidth of this wrapper to animate expansion */}
          <div 
            style={{
                ...styles.weatherRailWrapper,
                // ANIMATION LOGIC:
                maxWidth: showFullForecast ? "100%" : "360px", // 360px shows approx 3 cards
            }}
          >
              <div style={styles.weatherHeader}>
                  <div style={styles.weatherLabel}>LIVE FORECAST</div>
                  
                  {!weatherLoading && forecast.length > 3 && (
                      <button 
                        onClick={() => setShowFullForecast(!showFullForecast)}
                        style={styles.expandBtn}
                      >
                        {showFullForecast ? "Show Less" : "Extend"} 
                        {showFullForecast ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                      </button>
                  )}
              </div>

              {weatherLoading ? (
                <div style={styles.weatherLoading}><div className="spinner"></div> Connecting...</div>
              ) : (
                <div style={styles.weatherTrack}>
                  {/* Note: We map ALL forecast items, but the wrapper cuts them off visually until expanded */}
                  {forecast.map((day, i) => <WeatherCard key={i} day={day} index={i} />)}
                </div>
              )}
          </div>
        </div>
      </div>
      
      <FashionProgressBar heading={data?.name} about={data?.desc} />

      {/* --- 2. CONTENT --- */}
      <div style={styles.contentContainer}>
        <div style={styles.splitLayout}>
          <div style={{ ...styles.bentoBox, ...styles.bioBox }}>
            <WikiStateCard exampleData={descData} />
          </div>
          <div style={styles.floatingMapContainer}>
              <div className="levitating-map">
                 <State3DMap stateName={data.name} />
              </div>
              <div style={styles.mapPedestalShadow}></div>
          </div>
        </div>

        <div style={styles.sectionSpacer}>
           <DestinationRail destinations={data.destinations} />
        </div>

        <div style={{ width: "100%", overflow: "hidden" }}>
            <NewsCarousel/>
        </div>

        <RegionalDashboard/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@300;400;600&display=swap');
        body { margin: 0; background: #f8fafc; }
        
        .levitating-map { width: 100%; height: 100%; animation: levitate 6s ease-in-out infinite; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15)); }
        @keyframes levitate {
          0% { transform: translateY(0px) rotateX(5deg); }
          50% { transform: translateY(-25px) rotateX(0deg); } 
          100% { transform: translateY(0px) rotateX(5deg); }
        }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatBadge = ({ icon, label }) => (
  <div style={styles.statBadge}>{icon} <span>{label}</span></div>
);

// COMPACT WEATHER CARD
const WeatherCard = ({ day, index }) => {
  const Icon = day.condition?.icon || Cloud; 
  // Adjusted visual bar to fit smaller height
  const barHeight = Math.min((day.max / 45) * 100, 100); 
  return (
    <div className="weather-card" style={{...styles.weatherCard, animationDelay: `${index * 100}ms`}}>
      <div style={{...styles.weatherCardBg, background: day.condition?.bg || '#333'}} />
      
      {/* Date */}
      <div style={{ zIndex: 2, textAlign: 'center', marginTop: '5px' }}>
        <div style={styles.wcDay}>{day.name}</div>
        <div style={styles.wcDate}>{day.date}</div>
      </div>

      {/* Icon */}
      <div style={{ zIndex: 2 }}>
        <Icon size={20} color={day.condition?.color || '#fff'} />
      </div>

      {/* Bar & Temps */}
      <div style={{ zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginBottom: '5px' }}>
         <div style={styles.wcTemp}>{day.max}°</div>
         <div style={styles.wcBarTrack}>
             <div style={{...styles.wcBarFill, height: `${barHeight}%`, background: day.condition?.color || '#fff'}} />
         </div>
         <div style={styles.wcMinTemp}>{day.min}°</div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  pageWrapper: { fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#f1f5f9", minHeight: "100vh" },
  
  // HERO
  heroSection: { height: "auto", minHeight: "85vh", position: "relative", display: "flex", alignItems: "flex-end", padding: "0 5% 60px", clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)", marginBottom: "-50px" },
  heroBg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", zIndex: 0 },
  heroOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4))", zIndex: 1 },
  heroContent: { position: "relative", zIndex: 10, width: "100%", maxWidth: "1200px", margin: "0 auto", paddingTop: "120px" },
  backBtn: { position: "absolute", top: 30, left: 30, zIndex: 20, display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "30px", cursor: "pointer", fontWeight: "600" },
  tagline: { color: "#fbbf24", letterSpacing: "4px", fontSize: "0.9rem", fontWeight: "bold", background: "rgba(0,0,0,0.5)", padding: "5px 10px", borderRadius: "4px" },
  title: { fontFamily: "'Cinzel', serif", fontSize: "clamp(3rem, 6vw, 5rem)", color: "white", margin: "10px 0 20px", textShadow: "0 10px 30px rgba(0,0,0,0.5)", lineHeight: 1 },
  statsRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "30px" },
  statBadge: { display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", padding: "8px 16px", borderRadius: "50px", color: "white", fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.1)" },

  // --- WEATHER STYLES UPDATED ---
  weatherRailWrapper: { 
    marginTop: "20px", 
    background: "rgba(255, 255, 255, 0.03)", 
    backdropFilter: "blur(10px)", 
    borderRadius: "20px", 
    border: "1px solid rgba(255, 255, 255, 0.1)", 
    padding: "20px", 
    // ANIMATION PROPERTIES
    transition: "max-width 0.6s cubic-bezier(0.25, 1, 0.5, 1)", 
    overflow: "hidden" 
  },
  
  weatherHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", minWidth: "300px" },
  weatherLabel: { fontSize: "0.75rem", color: "#94a3b8", letterSpacing: "2px", fontWeight: "bold" },
  expandBtn: { display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "0.7rem", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", transition: "all 0.3s" },
  
  weatherTrack: { display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px", scrollSnapType: "x mandatory" },
  
  // COMPACT CARD STYLES
  weatherCard: { 
    flexShrink: 0, 
    width: "90px", // Narrower
    height: "140px", // Shorter (Reduced from 180px)
    background: "rgba(255,255,255,0.05)", 
    border: "1px solid rgba(255,255,255,0.1)", 
    borderRadius: "16px", 
    position: "relative", 
    overflow: "hidden", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: "8px 4px", 
    cursor: "pointer", 
    scrollSnapAlign: "start" 
  },
  weatherCardBg: { position: "absolute", inset: 0, opacity: 0.2, zIndex: 1 },
  
  // Adjusted text sizes for compact card
  wcDay: { fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" },
  wcDate: { fontSize: "0.9rem", fontWeight: "bold", color: "white" },
  wcTemp: { fontSize: "0.85rem", fontWeight: "bold", color: "white" },
  wcMinTemp: { fontSize: "0.7rem", color: "#64748b" },
  
  // Adjusted bar for compact card
  wcBarTrack: { width: "3px", height: "30px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", position: "relative", margin: "2px 0" },
  wcBarFill: { width: "100%", position: "absolute", bottom: 0, borderRadius: "2px", boxShadow: "0 0 10px currentColor" },

  // LAYOUT
  contentContainer: { maxWidth: "1400px", margin: "0 auto", padding: "0 20px 100px", position: "relative", zIndex: 5 },
  splitLayout: { display: "flex", flexDirection: "row", gap: "40px", marginTop: "20px", alignItems: "center", flexWrap: "wrap" },
  floatingMapContainer: { flex: "1.5", height: "550px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", perspective: "1000px" },
  mapPedestalShadow: { width: "60%", height: "40px", background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)", borderRadius: "50%", transform: "rotateX(60deg) translateY(60px)", filter: "blur(10px)", zIndex: -1 },
  bentoBox: { background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", position: "relative", overflow: "hidden" },
  bioBox: { flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "400px" },
  boxHeader: { fontSize: "1.2rem", fontWeight: "700", color: "#334155", margin: 0, fontFamily: "'Cinzel', serif" },
  boxTitleRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  bioText: { fontSize: "1.1rem", lineHeight: "1.8", color: "#64748b", margin: "20px 0" },
  climateTag: { marginTop: "auto", alignSelf: "flex-start", background: "#dbeafe", color: "#1e40af", padding: "5px 15px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" },
  logisticsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px", marginTop: "25px" },
  foodList: { display: "flex", flexDirection: "column", gap: "15px" },
  foodCard: { display: "flex", alignItems: "center", gap: "15px", padding: "10px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" },
  foodImg: { width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover" },
  foodInfo: { display: "flex", flexDirection: "column" },
  foodName: { fontWeight: "600", color: "#334155" },
  foodType: { fontSize: "0.8rem", fontWeight: "bold" },
  infoRow: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" },
  iconCircle: { width: "40px", height: "40px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" },
  infoLabel: { fontSize: "0.8rem", color: "#94a3b8", textTransform: "uppercase" },
  infoValue: { fontSize: "1rem", fontWeight: "600", color: "#334155" },
  sosGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  sosItem: { background: "#fef2f2", padding: "15px", borderRadius: "12px", textAlign: "center", border: "1px solid #fee2e2" },
  sosLabel: { display: "block", fontSize: "0.75rem", color: "#ef4444", fontWeight: "bold", textTransform: "uppercase" },
  sosNumber: { fontSize: "1.2rem", fontWeight: "800", color: "#b91c1c" },
  sectionSpacer: { marginTop: "40px" },
  loading: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }
};

export default StateDetails;