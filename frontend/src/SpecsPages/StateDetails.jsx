// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   ArrowLeft, MapPin, Thermometer, Calendar, Shield, Train, Plane, Utensils,
//   Cloud, Sun, CloudRain, CloudLightning, Snowflake, Wind, ChevronRight
// } from "lucide-react";
// import { getStateData, getStateDesc } from "../Data/TourismData";
// import DestinationRail from "../SpecsComponent/DestinationRail";
// import State3DMap from "../SpecsComponent/State3dMap";
// import { FashionProgressBar } from "../assets/ScrollingEffect";
// import NewsCarousel from "../SpecsComponent/NewsComponent";
// import WikiStateCard from "../SpecsComponent/StateDetailPage.jsx";
// import RegionalDashboard from "../SpecsComponent/Foot.jsx";

// // --- VISUAL ASSETS ---
// const CONDITIONS = [
//   { type: 'Sunny', icon: Sun, color: '#facc15', bg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(249, 115, 22, 0.2))' },
//   { type: 'Cloudy', icon: Cloud, color: '#cbd5e1', bg: 'linear-gradient(135deg, rgba(100, 116, 139, 0.2), rgba(71, 85, 105, 0.2))' },
//   { type: 'Rainy', icon: CloudRain, color: '#60a5fa', bg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(8, 145, 178, 0.2))' },
//   { type: 'Stormy', icon: CloudLightning, color: '#c084fc', bg: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.2))' },
//   { type: 'Snowy', icon: Snowflake, color: '#a5f3fc', bg: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2))' },
//   { type: 'Windy', icon: Wind, color: '#5eead4', bg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(16, 185, 129, 0.2))' },
// ];

// const mapApiToCondition = (mainWeather) => {
//     switch (mainWeather) {
//         case 'Clear': return CONDITIONS.find(c => c.type === 'Sunny');
//         case 'Clouds': return CONDITIONS.find(c => c.type === 'Cloudy');
//         case 'Rain': case 'Drizzle': return CONDITIONS.find(c => c.type === 'Rainy');
//         case 'Thunderstorm': return CONDITIONS.find(c => c.type === 'Stormy');
//         case 'Snow': return CONDITIONS.find(c => c.type === 'Snowy');
//         default: return CONDITIONS.find(c => c.type === 'Windy');
//     }
// };

// // --- MAIN COMPONENT ---
// const StateDetails = () => {
//   const { stateName } = useParams();
//   const navigate = useNavigate();
//   const data = getStateData(stateName); 
//   const descData = getStateDesc(stateName);
  
//   const [forecast, setForecast] = useState([]);
//   const [weatherLoading, setWeatherLoading] = useState(true);

//   const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; 

//   useEffect(() => window.scrollTo(0, 0), [stateName]);

//   useEffect(() => {
//     const fetchWeather = async () => {
//         if (!stateName) return;
//         setWeatherLoading(true);

//         try {
//             let queryName = stateName;
//             if (stateName === "J & K") queryName = "Jammu and Kashmir";
//             if (stateName === "Odisha") queryName = "Bhubaneswar"; 
//             if (stateName === "Andaman and Nicobar Islands") queryName = "Port Blair";

//             const encodedName = encodeURIComponent(queryName);
            
//             // 1. Geocoding
//             const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodedName},IN&limit=1&appid=${API_KEY}`);
//             const geoData = await geoRes.json();

//             if (!geoData || !geoData.length) throw new Error("Location not found");
//             const { lat, lon } = geoData[0];

//             // 2. Forecast
//             const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
//             const weatherData = await weatherRes.json();

//             // 3. Process Data
//             const dailyData = {};
//             weatherData.list.forEach((entry) => {
//                 const dateObj = new Date(entry.dt * 1000);
//                 const dayKey = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

//                 if (!dailyData[dayKey]) {
//                     dailyData[dayKey] = {
//                         name: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
//                         date: dateObj.getDate(),
//                         min: entry.main.temp_min,
//                         max: entry.main.temp_max,
//                         conditionType: entry.weather[0].main,
//                     };
//                 } else {
//                     dailyData[dayKey].min = Math.min(dailyData[dayKey].min, entry.main.temp_min);
//                     dailyData[dayKey].max = Math.max(dailyData[dayKey].max, entry.main.temp_max);
//                 }
//             });

//             const processedForecast = Object.values(dailyData).map(day => ({
//                 ...day,
//                 max: Math.round(day.max),
//                 min: Math.round(day.min),
//                 condition: mapApiToCondition(day.conditionType) || CONDITIONS[1] 
//             }));

//             setForecast(processedForecast);
//         } catch (error) {
//             console.error("Weather Error:", error);
//         } finally {
//             setWeatherLoading(false);
//         }
//     };

//     fetchWeather();
//   }, [stateName]);

//   if (!data) return <div style={styles.loading}>Region Not Found</div>;

//   return (
//     <div style={styles.pageWrapper}>
      
//       {/* --- 1. HERO SECTION --- */}
//       <div style={styles.heroSection}>
//         <div style={{...styles.heroBg, backgroundImage: `url(${data.heroImage})`}} />
//         <div style={styles.heroOverlay} />
        
//         <button onClick={() => navigate('/map')} style={styles.backBtn}>
//           <ArrowLeft size={20} /> Back
//         </button>

//         <div style={styles.heroContent}>
//           <span style={styles.tagline}>{data.tagline?.toUpperCase() || "INCREDIBLE INDIA"}</span>
//           <h1 style={styles.title}>{data.name}</h1>
          
//           <div style={styles.statsRow}>
//             <StatBadge icon={<Thermometer size={16}/>} label={data.stats.weather} />
//             <StatBadge icon={<Calendar size={16}/>} label={data.stats.bestTime} />
//             <StatBadge icon={<MapPin size={16}/>} label={`${data.destinations.length} Hotspots`} />
//           </div>

//           {/* --- NEW WEATHER STRIP --- */}
//           <div style={styles.weatherStrip}>
//               <div style={styles.weatherStripHeader}>
//                  <div style={styles.weatherLabel}>7 DAY FORECAST</div>
//                  <div style={styles.weatherLoc}><MapPin size={12}/> {stateName}</div>
//               </div>

//               {weatherLoading ? (
//                 <div style={styles.weatherLoading}><div className="spinner"></div> Connecting...</div>
//               ) : (
//                 <div style={styles.weatherStripTrack}>
//                   {forecast.map((day, i) => <WeatherCard key={i} day={day} index={i} />)}
//                 </div>
//               )}
//           </div>
//           {/* ------------------------- */}
          
//         </div>
//       </div>
      
//       <FashionProgressBar heading={data?.name} about={data?.desc} />

//       {/* --- 2. CONTENT --- */}
//       <div style={styles.contentContainer}>
//         <div style={styles.splitLayout}>
//           <div style={{ ...styles.bentoBox, ...styles.bioBox }}>
//             <WikiStateCard exampleData={descData} />
//           </div>
//           <div style={styles.floatingMapContainer}>
//               <div className="levitating-map">
//                  <State3DMap stateName={data.name} />
//               </div>
//               <div style={styles.mapPedestalShadow}></div>
//           </div>
//         </div>

//         <div style={styles.sectionSpacer}>
//            <DestinationRail destinations={data.destinations} />
//         </div>

//         <div style={{ width: "100%", overflow: "hidden" }}>
//             <NewsCarousel/>
//         </div>

//         <RegionalDashboard/>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@300;400;600&display=swap');
//         body { margin: 0; background: #f8fafc; }
        
//         .levitating-map { width: 100%; height: 100%; animation: levitate 6s ease-in-out infinite; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15)); }
//         @keyframes levitate {
//           0% { transform: translateY(0px) rotateX(5deg); }
//           50% { transform: translateY(-25px) rotateX(0deg); } 
//           100% { transform: translateY(0px) rotateX(5deg); }
//         }
//         .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
//         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
//         /* Custom Scrollbar for the Strip */
//         .weather-track::-webkit-scrollbar { height: 6px; }
//         .weather-track::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
//         .weather-track::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
//         .weather-track::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
//       `}</style>
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---

// const StatBadge = ({ icon, label }) => (
//   <div style={styles.statBadge}>{icon} <span>{label}</span></div>
// );

// // STRIP WEATHER CARD
// const WeatherCard = ({ day, index }) => {
//   const Icon = day.condition?.icon || Cloud; 
//   // Percentage for the bar height
//   const barHeight = Math.min((day.max / 45) * 100, 100); 
  
//   return (
//     <div style={{...styles.weatherCard, padding:2, animationDelay: `${index * 80}ms`}}>
//       {/* Date */}
//       <div style={styles.wcHeader}>
//         <div style={styles.wcDay}>{day.name}</div>
//         <div style={styles.wcDate}>{day.date}</div>
//       </div>

//       {/* Icon & Visual */}
//       <div style={styles.wcIconWrapper}>
//          <Icon size={24} color={day.condition?.color || '#fff'} />
//       </div>

//       {/* Temps & Bar */}
//       <div style={styles.wcFooter}>
//          <div style={styles.wcTemp}>{day.max}°</div>
//          <div style={styles.wcBarTrack}>
//              <div style={{...styles.wcBarFill, height: `${barHeight}%`, background: day.condition?.color || '#fff'}} />
//          </div>
//          <div style={styles.wcMinTemp}>{day.min}°</div>
//       </div>
//     </div>
//   );
// };

// // --- STYLES ---
// const styles = {
//   pageWrapper: { fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#f1f5f9", minHeight: "100vh" },
  
//   // HERO
//   heroSection: { height: "auto", minHeight: "90vh", position: "relative", display: "flex", alignItems: "flex-end", padding: "0 5% 80px", clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)", marginBottom: "-50px" },
//   heroBg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", zIndex: 0 },
//   heroOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4))", zIndex: 1 },
//   heroContent: { position: "relative", zIndex: 10, width: "100%", maxWidth: "1200px", margin: "0 auto", paddingTop: "120px" },
//   backBtn: { position: "absolute", top: 30, left: 30, zIndex: 20, display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "30px", cursor: "pointer", fontWeight: "600" },
//   tagline: { color: "#fbbf24", letterSpacing: "4px", fontSize: "0.9rem", fontWeight: "bold", background: "rgba(0,0,0,0.5)", padding: "5px 10px", borderRadius: "4px" },
//   title: { fontFamily: "'Cinzel', serif", fontSize: "clamp(3rem, 6vw, 5rem)", color: "white", margin: "10px 0 20px", textShadow: "0 10px 30px rgba(0,0,0,0.5)", lineHeight: 1 },
//   statsRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "40px" },
//   statBadge: { display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", padding: "8px 16px", borderRadius: "50px", color: "white", fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.1)" },

//   // --- NEW WEATHER STRIP STYLES ---
//   weatherStrip: { 
//     width: "100%", 
//     background: "rgba(255, 255, 255, 0.08)", 
//     backdropFilter: "blur(16px)", 
//     borderRadius: "24px", 
//     border: "1px solid rgba(255, 255, 255, 0.15)", 
//     padding: "20px 25px", 
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//     boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
//   },
  
//   weatherStripHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" },
//   weatherLabel: { fontSize: "0.8rem", color: "#fbbf24", letterSpacing: "2px", fontWeight: "800" },
//   weatherLoc: { fontSize: "0.8rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "1px" },
  
//   weatherStripTrack: { 
//     display: "flex", 
//     gap: "15px", 
//     overflowX: "auto", 
//     paddingBottom: "2px", 
//     scrollSnapType: "x mandatory",
//     className: "weather-track" // referenced in style tag
//   },
  
//   weatherLoading: { color: "white", display: "flex", gap: "10px", fontSize: "0.9rem", padding: "20px" },

//   // CLEANER CARD STYLES
//   weatherCard: { 
//     flexShrink: 0, 
//     width: "85px", // Slightly wider than before
//     height: "150px", 
//     background: "rgba(0,0,0,0.2)", // Darker translucent for card
//     borderRadius: "16px", 
//     display: "flex", 
//     flexDirection: "column", 
//     alignItems: "center", 
//     justifyContent: "space-between", 
//     padding: "10px 5px", 
//     scrollSnapAlign: "start",
//     border: "1px solid rgba(255,255,255,0.05)",
//     transition: "transform 0.2s",
//     cursor: "default"
//   },
  
//   wcHeader: { textAlign: "center" },
//   wcDay: { fontSize: "0.6rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" },
//   wcDate: { fontSize: "0.9rem", fontWeight: "bold", color: "white" },
  
//   wcIconWrapper: { display: "flex", alignItems: "center", justifyContent: "center", height: "40px" },
  
//   wcFooter: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", width: "100%" },
//   wcTemp: { fontSize: "0.85rem", fontWeight: "bold", color: "white" },
//   wcMinTemp: { fontSize: "0.7rem", color: "#64748b" },
  
//   wcBarTrack: { width: "4px", height: "35px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", position: "relative", margin: "2px 0" },
//   wcBarFill: { width: "100%", position: "absolute", bottom: 0, borderRadius: "10px", boxShadow: "0 0 8px currentColor" },

//   // LAYOUT
//   contentContainer: { maxWidth: "1400px", margin: "0 auto", padding: "0 20px 100px", position: "relative", zIndex: 5 },
//   splitLayout: { display: "flex", flexDirection: "row", gap: "40px", marginTop: "20px", alignItems: "center", flexWrap: "wrap" },
//   floatingMapContainer: { flex: "1.5", height: "550px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", perspective: "1000px" },
//   mapPedestalShadow: { width: "60%", height: "40px", background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)", borderRadius: "50%", transform: "rotateX(60deg) translateY(60px)", filter: "blur(10px)", zIndex: -1 },
//   bentoBox: { background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", position: "relative", overflow: "hidden" },
//   bioBox: { flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "400px" },
//   sectionSpacer: { marginTop: "40px" },
//   loading: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }
// };

// export default StateDetails;



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   ArrowLeft, MapPin, Thermometer, Calendar, Leaf, Navigation, Users,
//   Sun, Cloud, CloudRain, CloudLightning, Snowflake, Wind
// } from "lucide-react";
// import { getStateData, getStateDesc } from "../Data/TourismData";
// import DestinationRail from "../SpecsComponent/DestinationRail";
// import State3DMap from "../SpecsComponent/State3dMap";
// import { FashionProgressBar } from "../assets/ScrollingEffect";
// import NewsCarousel from "../SpecsComponent/NewsComponent";
// import WikiStateCard from "../SpecsComponent/StateDetailPage.jsx";
// import RegionalDashboard from "../SpecsComponent/Foot.jsx";

// // CONFIG
// const API_URL = "http://localhost:5000/api/destinations";
// const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; 

// // WEATHER UTILS
// const CONDITIONS = [
//   { type: 'Sunny', icon: Sun, color: '#facc15' },
//   { type: 'Cloudy', icon: Cloud, color: '#cbd5e1' },
//   { type: 'Rainy', icon: CloudRain, color: '#60a5fa' },
//   { type: 'Stormy', icon: CloudLightning, color: '#c084fc' },
//   { type: 'Snowy', icon: Snowflake, color: '#a5f3fc' },
//   { type: 'Windy', icon: Wind, color: '#5eead4' },
// ];
// const mapApiToCondition = (main) => {
//     if (main === 'Clear') return CONDITIONS[0];
//     if (main === 'Clouds') return CONDITIONS[1];
//     if (['Rain','Drizzle'].includes(main)) return CONDITIONS[2];
//     if (main === 'Thunderstorm') return CONDITIONS[3];
//     if (main === 'Snow') return CONDITIONS[4];
//     return CONDITIONS[5];
// };

// const StateDetails = () => {
//   const { stateName } = useParams();
//   const navigate = useNavigate();
//   const data = getStateData(stateName); 
//   const descData = getStateDesc(stateName);
  
//   const [forecast, setForecast] = useState([]);
//   const [weatherLoading, setWeatherLoading] = useState(true);

//   // REAL DATA STATE
//   const [realDestinations, setRealDestinations] = useState([]);
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [impactLoading, setImpactLoading] = useState(true);

//   useEffect(() => window.scrollTo(0, 0), [stateName]);

//   // 1. WEATHER & GPS
//   useEffect(() => {
//     const initData = async () => {
//         if (!stateName) return;
//         setWeatherLoading(true);

//         try {
//             // Weather Query Mapping
//             let queryName = stateName;
//             if (stateName === "J & K") queryName = "Srinagar";
//             if (stateName === "Odisha") queryName = "Bhubaneswar"; 
//             if (stateName.includes("Andaman")) queryName = "Port Blair";
//             if (stateName.includes("Dadra")) queryName = "Silvassa";

//             const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(queryName)},IN&limit=1&appid=${API_KEY}`);
//             const geoData = await geoRes.json();

//             if (geoData?.length) {
//                 const { lat, lon } = geoData[0];
//                 const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
//                 const wData = await weatherRes.json();

//                 const daily = {};
//                 wData.list.forEach((e) => {
//                     const d = new Date(e.dt * 1000);
//                     const key = d.getDate();
//                     if (!daily[key]) {
//                         daily[key] = {
//                             name: d.toLocaleDateString('en-US', { weekday: 'short' }),
//                             date: d.getDate(),
//                             min: e.main.temp_min, max: e.main.temp_max,
//                             conditionType: e.weather[0].main
//                         };
//                     } else {
//                         daily[key].min = Math.min(daily[key].min, e.main.temp_min);
//                         daily[key].max = Math.max(daily[key].max, e.main.temp_max);
//                     }
//                 });
//                 setForecast(Object.values(daily).slice(0, 7).map(d => ({
//                     ...d, max: Math.round(d.max), min: Math.round(d.min),
//                     condition: mapApiToCondition(d.conditionType)
//                 })));
//             }
//         } catch (e) { console.error("Weather error", e); } 
//         finally { setWeatherLoading(false); }

//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//               (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
//               () => console.warn("GPS Denied")
//             );
//         }
//     };
//     initData();
//   }, [stateName]);

//   // 2. FETCH DESTINATIONS
//   useEffect(() => {
//       const fetchDestinations = async () => {
//           try {
//               const res = await fetch(API_URL);
//               const allData = await res.json();
              
//               const filtered = allData.filter(item => {
//                   const db = item.state.toLowerCase().replace(/&/g, 'and').trim();
//                   const url = stateName.toLowerCase().replace(/&/g, 'and').trim();
//                   return db === url || db.includes(url) || url.includes(db);
//               });

//               setRealDestinations(filtered);
//               if (filtered.length > 0) setSelectedPlace(filtered[0]);
//               setImpactLoading(false);
//           } catch (err) { console.error("API Error:", err); setImpactLoading(false); }
//       };
//       fetchDestinations();
//   }, [stateName]);

//   // METRICS CALC
//   const calculateMetrics = (dest) => {
//     if (!userLocation || !dest) return { dist: 0, carbon: 0 };
//     const R = 6371; 
//     const dLat = (dest.latitude - userLocation.lat) * (Math.PI/180);
//     const dLon = (dest.longitude - userLocation.lng) * (Math.PI/180);
//     const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(userLocation.lat*(Math.PI/180))*Math.cos(dest.latitude*(Math.PI/180))*Math.sin(dLon/2)*Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     const dist = Math.round(R * c);
//     const carbon = Math.round((dist * 0.12) * dest.carbon_intensity_factor);
//     return { dist, carbon };
//   };

//   const metrics = calculateMetrics(selectedPlace);

//   if (!data) return <div style={styles.loading}>Region Not Found</div>;

//   return (
//     <div style={styles.pageWrapper}>
      
//       {/* HERO */}
//       <div style={styles.heroSection}>
//         <div style={{...styles.heroBg, backgroundImage: `url(${data.heroImage})`}} />
//         <div style={styles.heroOverlay} />
//         <button onClick={() => navigate('/map')} style={styles.backBtn}><ArrowLeft size={20} /> Back</button>

//         <div style={styles.heroContent}>
//           <span style={styles.tagline}>{data.tagline?.toUpperCase() || "INCREDIBLE INDIA"}</span>
//           <h1 style={styles.title}>{data.name}</h1>
//           <div style={styles.statsRow}>
//             <StatBadge icon={<Thermometer size={16}/>} label={data.stats.weather} />
//             <StatBadge icon={<Calendar size={16}/>} label={data.stats.bestTime} />
//             <StatBadge icon={<MapPin size={16}/>} label={`${realDestinations.length || data.destinations.length} Hotspots`} />
//           </div>

//           <div style={styles.weatherStrip}>
//               <div style={styles.weatherStripHeader}>
//                  <div style={styles.weatherLabel}>FORECAST</div>
//                  <div style={styles.weatherLoc}><MapPin size={12}/> {stateName}</div>
//               </div>
//               {weatherLoading ? <div style={styles.weatherLoading}>Loading Weather...</div> : 
//                 <div style={styles.weatherStripTrack}>
//                   {forecast.map((d, i) => <WeatherCard key={i} day={d} index={i} />)}
//                 </div>
//               }
//           </div>
//         </div>
//       </div>
      
//       <FashionProgressBar heading={data?.name} about={data?.desc} />

//       <div style={styles.contentContainer}>
        
//         {/* MAP & BIO */}
//         <div style={styles.splitLayout}>
//           <div style={{ ...styles.bentoBox, ...styles.bioBox }}>
//             <WikiStateCard exampleData={descData} />
//           </div>
//           <div style={styles.floatingMapContainer}>
//               <div className="levitating-map"><State3DMap stateName={data.name} /></div>
//               <div style={styles.mapPedestalShadow}></div>
//           </div>
//         </div>

//         {/* --- SUSTAINABLE PLANNER (NEW GRID LAYOUT) --- */}
//         <div style={styles.sectionSpacer}>
//            <h2 style={styles.sectionTitle}>Sustainable Planner</h2>
//            <p style={styles.sectionSubtitle}>Compare live crowd levels and carbon impact.</p>
           
//            <div style={styles.plannerGrid}>
              
//               {/* LIST (GRID NOW) */}
//               <div style={styles.plannerList}>
//                   {impactLoading ? <div style={{padding:20}}>Loading Data...</div> : 
//                    realDestinations.length === 0 ? <div style={{padding:20}}>No live data.</div> :
//                    realDestinations.map(place => (
//                       <div 
//                         key={place.id} 
//                         onClick={() => setSelectedPlace(place)}
//                         style={{
//                             ...styles.placeCard,
//                             borderColor: selectedPlace?.id === place.id ? '#3b82f6' : '#e2e8f0',
//                             backgroundColor: selectedPlace?.id === place.id ? '#eff6ff' : 'white',
//                             transform: selectedPlace?.id === place.id ? 'scale(1.02)' : 'scale(1)'
//                         }}
//                       >
//                          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
//                              <div style={{fontWeight:'700', color:'#1e293b', fontSize:'0.9rem'}}>{place.name}</div>
//                              <div style={{fontSize:'0.75rem', padding:'2px 6px', borderRadius:'4px', background:'#f1f5f9', color:'#64748b'}}>
//                                  {place.description || 'Place'}
//                              </div>
//                          </div>
//                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
//                              <div style={{fontSize:'0.75rem', color:'#64748b', display:'flex', alignItems:'center', gap:'4px'}}>
//                                  <Leaf size={12} color={place.carbon_intensity_factor > 1.2 ? '#f59e0b' : '#22c55e'}/> 
//                                  Risk: {place.carbon_intensity_factor}x
//                              </div>
//                              <div style={{fontSize:'0.9rem', color: place.cached_footfall > 30000 ? '#ef4444' : '#22c55e', fontWeight:'700'}}>
//                                 <Users size={12} style={{display:'inline', marginRight:4}}/>
//                                 {place.cached_footfall > 1000 ? (place.cached_footfall/1000).toFixed(1)+'k' : place.cached_footfall}
//                              </div>
//                          </div>
//                       </div>
//                    ))
//                   }
//               </div>

//               {/* CALCULATOR (STICKY) */}
//               <div style={styles.plannerCalculator}>
//                   {selectedPlace ? (
//                       <>
//                         <div style={styles.calcHeader}>
//                             <h3 style={{margin:0, fontSize:'1.2rem'}}>{selectedPlace.name}</h3>
//                             <span style={{fontSize:'0.8rem', color:'#64748b'}}>Trip Analysis</span>
//                         </div>
                        
//                         <div style={styles.calcGrid}>
//                             <div style={styles.calcMetric}>
//                                 <Navigation size={20} color="#3b82f6"/>
//                                 <div style={styles.metricVal}>{userLocation ? metrics.dist : "?"} <span style={{fontSize:'0.9rem'}}>km</span></div>
//                                 <div style={styles.metricLabel}>Distance</div>
//                             </div>
//                             <div style={{...styles.calcMetric, border: metrics.carbon > 200 ? '1px solid #fecaca' : '1px solid #bbf7d0', background: metrics.carbon > 200 ? '#fef2f2' : '#f0fdf4'}}>
//                                 <Leaf size={20} color={metrics.carbon > 200 ? '#ef4444' : '#22c55e'}/>
//                                 <div style={{...styles.metricVal, color: metrics.carbon > 200 ? '#ef4444' : '#15803d'}}>
//                                     {userLocation ? metrics.carbon : "?"} <span style={{fontSize:'0.9rem'}}>kg</span>
//                                 </div>
//                                 <div style={styles.metricLabel}>CO₂ Cost</div>
//                             </div>
//                         </div>

//                         <div style={{marginTop:'20px'}}>
//                             <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.8rem', marginBottom:'5px', fontWeight:'600'}}>
//                                 <span>Crowd Density</span>
//                                 <span>{selectedPlace.cached_footfall.toLocaleString()} visitors</span>
//                             </div>
//                             <div style={{width:'100%', height:'8px', background:'#e2e8f0', borderRadius:'10px', overflow:'hidden'}}>
//                                 <div style={{
//                                     height:'100%', 
//                                     width: `${Math.min((selectedPlace.cached_footfall / 60000)*100, 100)}%`,
//                                     background: selectedPlace.cached_footfall > 40000 ? '#ef4444' : '#3b82f6'
//                                 }}/>
//                             </div>
//                         </div>

//                         <div style={{marginTop:'20px', padding:'12px', background: metrics.carbon > 300 ? '#fff1f2' : '#f0fdf4', borderRadius:'8px', fontSize:'0.85rem', borderLeft: metrics.carbon > 300 ? '4px solid #f43f5e' : '4px solid #22c55e'}}>
//                             {metrics.carbon > 300 
//                                 ? "⚠️ High Carbon Trip. Consider train travel." 
//                                 : "✅ Eco-Friendly Trip Choice."}
//                         </div>
//                       </>
//                   ) : (
//                       <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>Select a destination</div>
//                   )}
//               </div>
//            </div>
//         </div>

//         {/* VISUAL RAIL */}
//         <div style={styles.sectionSpacer}>
//            <DestinationRail destinations={data.destinations} />
//         </div>

//         <div style={{ width: "100%", overflow: "hidden", marginTop:'40px' }}><NewsCarousel/></div>
//         <RegionalDashboard/>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@300;400;600;700&display=swap');
//         body { margin: 0; background: #f8fafc; }
//         .levitating-map { width: 100%; height: 100%; animation: levitate 6s ease-in-out infinite; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15)); }
//         @keyframes levitate { 0% { transform: translateY(0px) rotateX(5deg); } 50% { transform: translateY(-25px) rotateX(0deg); } 100% { transform: translateY(0px) rotateX(5deg); } }
//         .weather-track::-webkit-scrollbar { height: 4px; }
//         .weather-track::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); borderRadius: 4px; }
//       `}</style>
//     </div>
//   );
// };

// const StatBadge = ({ icon, label }) => (<div style={styles.statBadge}>{icon} <span>{label}</span></div>);
// const WeatherCard = ({ day, index }) => {
//   const Icon = day.condition?.icon || Cloud; 
//   return (
//     <div style={{...styles.weatherCard, animationDelay: `${index * 80}ms`}}>
//       <div style={styles.wcHeader}><div style={styles.wcDay}>{day.name}</div><div style={styles.wcDate}>{day.date}</div></div>
//       <div style={styles.wcIconWrapper}><Icon size={24} color={day.condition?.color || '#fff'} /></div>
//       <div style={styles.wcFooter}><div style={styles.wcTemp}>{day.max}°</div><div style={styles.wcMinTemp}>{day.min}°</div></div>
//     </div>
//   );
// };

// const styles = {
//   pageWrapper: { fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#f1f5f9", minHeight: "100vh" },
//   heroSection: { height: "auto", minHeight: "90vh", position: "relative", display: "flex", alignItems: "flex-end", padding: "0 5% 80px", clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)", marginBottom: "-50px" },
//   heroBg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", zIndex: 0 },
//   heroOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4))", zIndex: 1 },
//   heroContent: { position: "relative", zIndex: 10, width: "100%", maxWidth: "1200px", margin: "0 auto", paddingTop: "120px" },
//   backBtn: { position: "absolute", top: 30, left: 30, zIndex: 20, display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "30px", cursor: "pointer", fontWeight: "600" },
//   tagline: { color: "#fbbf24", letterSpacing: "4px", fontSize: "0.9rem", fontWeight: "bold", background: "rgba(0,0,0,0.5)", padding: "5px 10px", borderRadius: "4px" },
//   title: { fontFamily: "'Cinzel', serif", fontSize: "clamp(3rem, 6vw, 5rem)", color: "white", margin: "10px 0 20px", textShadow: "0 10px 30px rgba(0,0,0,0.5)", lineHeight: 1 },
//   statsRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "40px" },
//   statBadge: { display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", padding: "8px 16px", borderRadius: "50px", color: "white", fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.1)" },
  
//   weatherStrip: { width: "100%", background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(16px)", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "20px 25px", display: "flex", flexDirection: "column", gap: "15px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" },
//   weatherStripHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" },
//   weatherLabel: { fontSize: "0.8rem", color: "#fbbf24", letterSpacing: "2px", fontWeight: "800" },
//   weatherLoc: { fontSize: "0.8rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "1px" },
//   weatherStripTrack: { display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "2px", scrollSnapType: "x mandatory", className: "weather-track" },
//   weatherLoading: { color: "white", display: "flex", gap: "10px", fontSize: "0.9rem", padding: "20px" },
//   weatherCard: { flexShrink: 0, width: "70px", height: "120px", background: "rgba(0,0,0,0.2)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "10px 5px", scrollSnapAlign: "start", border: "1px solid rgba(255,255,255,0.05)" },
//   wcHeader: { textAlign: "center" }, wcDay: { fontSize: "0.6rem", color: "#94a3b8", textTransform: "uppercase" }, wcDate: { fontSize: "0.9rem", fontWeight: "bold", color: "white" },
//   wcIconWrapper: { display: "flex", alignItems: "center", justifyContent: "center" },
//   wcFooter: { textAlign: "center" }, wcTemp: { fontSize: "0.85rem", fontWeight: "bold", color: "white" }, wcMinTemp: { fontSize: "0.7rem", color: "#64748b" },

//   contentContainer: { maxWidth: "1400px", margin: "0 auto", padding: "0 20px 100px", position: "relative", zIndex: 5 },
//   splitLayout: { display: "flex", flexDirection: "row", gap: "40px", marginTop: "20px", alignItems: "center", flexWrap: "wrap" },
//   floatingMapContainer: { flex: "1.5", height: "550px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", perspective: "1000px" },
//   mapPedestalShadow: { width: "60%", height: "40px", background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)", borderRadius: "50%", transform: "rotateX(60deg) translateY(60px)", filter: "blur(10px)", zIndex: -1 },
//   bentoBox: { background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", position: "relative", overflow: "hidden" },
//   bioBox: { flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "400px" },
  
//   sectionSpacer: { marginTop: "60px" },
//   sectionTitle: { fontSize: "2rem", fontFamily: "'Cinzel', serif", color: "#1e293b", marginBottom: "10px" },
//   sectionSubtitle: { fontSize: "1rem", color: "#64748b", marginBottom: "30px" },
  
//   // PLANNER GRID LAYOUT
//   plannerGrid: { display: "flex", gap: "30px", flexWrap: "wrap" },
//   plannerList: { 
//       flex: "2",
//       display: "grid", 
//       gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
//       gap: "15px",
//       maxHeight: "500px",
//       overflowY: "auto",
//       paddingRight: "5px"
//   },
//   placeCard: { padding: "15px", borderRadius: "12px", border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s", background: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" },
  
//   plannerCalculator: { 
//       flex: "1",
//       minWidth: "300px",
//       background: "white", padding: "25px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
//       height: "fit-content",
//       position: "sticky",
//       top: "20px"
//   },
//   calcHeader: { borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "20px" },
//   calcGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
//   calcMetric: { padding: "15px", borderRadius: "12px", background: "#f8fafc", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
//   metricVal: { fontSize: "1.5rem", fontWeight: "700", color: "#1e293b" },
//   metricLabel: { fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" },
//   loading: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }
// };

// export default StateDetails;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Ensure lucide-react is installed: npm install lucide-react
import { 
  ArrowLeft, MapPin, Thermometer, Calendar, Leaf, Navigation, Users,
  Sun, Cloud, CloudRain, CloudLightning, Snowflake, Wind, AlertCircle
} from "lucide-react";
import { getStateData, getStateDesc } from "../Data/TourismData";
import DestinationRail from "../SpecsComponent/DestinationRail";
import State3DMap from "../SpecsComponent/State3dMap";
import { FashionProgressBar } from "../assets/ScrollingEffect";
import NewsCarousel from "../SpecsComponent/NewsComponent";
import WikiStateCard from "../SpecsComponent/StateDetailPage.jsx";
import RegionalDashboard from "../SpecsComponent/Foot.jsx";

// --- CONFIG ---
const API_URL = "http://localhost:5000/api/destinations"; // Corrected Port
const WEATHER_KEY = "bd5e378503939ddaee76f12ad7a97608"; 

// --- UTILS ---
const CONDITIONS = [
  { type: 'Sunny', icon: Sun, color: '#facc15' },
  { type: 'Cloudy', icon: Cloud, color: '#cbd5e1' },
  { type: 'Rainy', icon: CloudRain, color: '#60a5fa' },
  { type: 'Stormy', icon: CloudLightning, color: '#c084fc' },
  { type: 'Snowy', icon: Snowflake, color: '#a5f3fc' },
  { type: 'Windy', icon: Wind, color: '#5eead4' },
];

const mapApiToCondition = (main) => {
    if (main === 'Clear') return CONDITIONS[0];
    if (main === 'Clouds') return CONDITIONS[1];
    if (['Rain','Drizzle'].includes(main)) return CONDITIONS[2];
    if (main === 'Thunderstorm') return CONDITIONS[3];
    if (main === 'Snow') return CONDITIONS[4];
    return CONDITIONS[5];
};

const StateDetails = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const data = getStateData(stateName); 
  const descData = getStateDesc(stateName);
  
  const [forecast, setForecast] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  
  // LIVE DATA STATES
  const [realDestinations, setRealDestinations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [impactLoading, setImpactLoading] = useState(true);

  useEffect(() => window.scrollTo(0, 0), [stateName]);

  // 1. WEATHER & GPS (WITH CACHING TO FIX 429)
  useEffect(() => {
    const initData = async () => {
        if (!stateName) return;
        setWeatherLoading(true);

        // CACHING STRATEGY
        const cacheKey = `weather_${stateName}_${new Date().getDate()}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            setForecast(JSON.parse(cached));
            setWeatherLoading(false);
        } else {
            try {
                let queryName = stateName;
                if (stateName === "J & K") queryName = "Srinagar";
                if (stateName === "Odisha") queryName = "Bhubaneswar"; 
                if (stateName.includes("Andaman")) queryName = "Port Blair";

                const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(queryName)},IN&limit=1&appid=${WEATHER_KEY}`);
                if (geoRes.status === 429) throw new Error("Rate Limit");
                const geoData = await geoRes.json();

                if (geoData?.length) {
                    const { lat, lon } = geoData[0];
                    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_KEY}`);
                    const wData = await weatherRes.json();

                    const daily = {};
                    wData.list.forEach((e) => {
                        const d = new Date(e.dt * 1000);
                        const key = d.getDate();
                        if (!daily[key]) {
                            daily[key] = {
                                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                                date: d.getDate(),
                                min: e.main.temp_min, max: e.main.temp_max,
                                conditionType: e.weather[0].main
                            };
                        } else {
                            daily[key].min = Math.min(daily[key].min, e.main.temp_min);
                            daily[key].max = Math.max(daily[key].max, e.main.temp_max);
                        }
                    });
                    
                    const processed = Object.values(daily).slice(0, 7).map(d => ({
                        ...d, max: Math.round(d.max), min: Math.round(d.min),
                        condition: mapApiToCondition(d.conditionType)
                    }));

                    setForecast(processed);
                    localStorage.setItem(cacheKey, JSON.stringify(processed));
                }
            } catch (e) { 
                console.warn("Weather API Limit:", e); 
                // Fallback Mock
                setForecast([{name:'Today', date:new Date().getDate(), max:30, min:22, condition:CONDITIONS[0]}]);
            } 
            finally { setWeatherLoading(false); }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
              () => console.warn("GPS Denied")
            );
        }
    };
    initData();
  }, [stateName]);

  // 2. LIVE DATA SYNC
  useEffect(() => {
      const fetchDestinations = async () => {
          try {
              const res = await fetch(API_URL);
              const allData = await res.json();
              
              const filtered = allData.filter(item => {
                  const dbState = item.state.toLowerCase().replace(/&/g, 'and').trim();
                  const urlState = stateName.toLowerCase().replace(/&/g, 'and').trim();
                  return dbState === urlState || dbState.includes(urlState) || urlState.includes(dbState);
              });

              setRealDestinations(filtered);
              if (filtered.length > 0) setSelectedPlace(filtered[0]);
              setImpactLoading(false);
          } catch (err) { console.error("Backend Error:", err); setImpactLoading(false); }
      };
      fetchDestinations();
  }, [stateName]);

  // 3. METRICS
  const calculateMetrics = (dest) => {
    if (!userLocation || !dest) return { dist: 0, carbon: 0 };
    const R = 6371; 
    const dLat = (dest.latitude - userLocation.lat) * (Math.PI/180);
    const dLon = (dest.longitude - userLocation.lng) * (Math.PI/180);
    const a = Math.sin(dLat/2)**2 + Math.cos(userLocation.lat*(Math.PI/180))*Math.cos(dest.latitude*(Math.PI/180))*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const dist = Math.round(R * c);
    const carbon = Math.round((dist * 0.12) * dest.carbon_intensity_factor);
    return { dist, carbon };
  };

  const metrics = calculateMetrics(selectedPlace);

  if (!data) return <div style={styles.loading}>Region Not Found</div>;

  return (
    <div style={styles.pageWrapper}>
      
      {/* 1. HERO */}
      <div style={styles.heroSection}>
        <div style={{...styles.heroBg, backgroundImage: `url(${data.heroImage})`}} />
        <div style={styles.heroOverlay} />
        <button onClick={() => navigate('/map')} style={styles.backBtn}><ArrowLeft size={20} /> Back</button>

        <div style={styles.heroContent}>
          <span style={styles.tagline}>{data.tagline?.toUpperCase() || "INCREDIBLE INDIA"}</span>
          <h1 style={styles.title}>{data.name}</h1>
          <div style={styles.statsRow}>
            <StatBadge icon={<Thermometer size={16}/>} label={data.stats.weather} />
            <StatBadge icon={<Calendar size={16}/>} label={data.stats.bestTime} />
            <StatBadge icon={<MapPin size={16}/>} label={`${realDestinations.length || data.destinations.length} Hotspots`} />
          </div>

          <div style={styles.weatherStrip}>
              <div style={styles.weatherStripHeader}>
                 <div style={styles.weatherLabel}>FORECAST</div>
                 <div style={styles.weatherLoc}><MapPin size={12}/> {stateName}</div>
              </div>
              {weatherLoading ? <div style={styles.weatherLoading}>Loading Weather...</div> : 
                <div style={styles.weatherStripTrack}>
                  {forecast.map((d, i) => <WeatherCard key={i} day={d} index={i} />)}
                </div>
              }
          </div>
        </div>
      </div>
      
      <FashionProgressBar heading={data?.name} about={data?.desc} />

      <div style={styles.contentContainer}>
        
        {/* 2. SPLIT LAYOUT */}
        <div style={styles.splitLayout}>
          <div style={{ ...styles.bentoBox, ...styles.bioBox }}>
            <WikiStateCard exampleData={descData} />
          </div>
          <div style={styles.floatingMapContainer}>
              <div className="levitating-map"><State3DMap stateName={data.name} /></div>
              <div style={styles.mapPedestalShadow}></div>
          </div>
        </div>

        {/* 3. SUSTAINABLE PLANNER */}
        <div style={styles.sectionSpacer}>
           <h2 style={styles.sectionTitle}>Sustainable Planner</h2>
           <p style={styles.sectionSubtitle}>Compare live crowd levels and carbon impact.</p>
           
           <div style={styles.plannerGrid}>
              
              {/* LIST */}
              <div style={styles.plannerList}>
                  {impactLoading ? <div style={{padding:20}}>Syncing Live Data...</div> : 
                   realDestinations.length === 0 ? <div style={{padding:20}}>No live data available.</div> :
                   realDestinations.map(place => (
                      <div 
                        key={place.id} 
                        onClick={() => setSelectedPlace(place)}
                        style={{
                            ...styles.placeCard,
                            borderColor: selectedPlace?.id === place.id ? '#3b82f6' : '#e2e8f0',
                            backgroundColor: selectedPlace?.id === place.id ? '#eff6ff' : 'white',
                            transform: selectedPlace?.id === place.id ? 'scale(1.02)' : 'scale(1)'
                        }}
                      >
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                             <div style={{fontWeight:'700', color:'#1e293b', fontSize:'0.9rem'}}>{place.name}</div>
                             <div style={{fontSize:'0.75rem', padding:'2px 6px', borderRadius:'4px', background:'#f1f5f9', color:'#64748b'}}>
                                 {place.description || 'Place'}
                             </div>
                         </div>
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                             <div style={{fontSize:'0.75rem', color:'#64748b', display:'flex', alignItems:'center', gap:'4px'}}>
                                 <Leaf size={12} color={place.carbon_intensity_factor > 1.2 ? '#f59e0b' : '#22c55e'}/> 
                                 Risk: {place.carbon_intensity_factor}x
                             </div>
                             <div style={{fontSize:'0.9rem', color: place.cached_footfall > 30000 ? '#ef4444' : '#22c55e', fontWeight:'700'}}>
                                <Users size={12} style={{display:'inline', marginRight:4}}/>
                                {place.cached_footfall > 1000 ? (place.cached_footfall/1000).toFixed(1)+'k' : place.cached_footfall}
                             </div>
                         </div>
                      </div>
                   ))
                  }
              </div>

              {/* CALCULATOR */}
              <div style={styles.plannerCalculator}>
                  {selectedPlace ? (
                      <>
                        <div style={styles.calcHeader}>
                            <h3 style={{margin:0, fontSize:'1.2rem'}}>{selectedPlace.name}</h3>
                            <span style={{fontSize:'0.8rem', color:'#64748b'}}>Trip Analysis</span>
                        </div>
                        
                        <div style={styles.calcGrid}>
                            <div style={styles.calcMetric}>
                                <Navigation size={20} color="#3b82f6"/>
                                <div style={styles.metricVal}>{userLocation ? metrics.dist : "?"} <span style={{fontSize:'0.9rem'}}>km</span></div>
                                <div style={styles.metricLabel}>Distance</div>
                            </div>
                            <div style={{...styles.calcMetric, border: metrics.carbon > 200 ? '1px solid #fecaca' : '1px solid #bbf7d0', background: metrics.carbon > 200 ? '#fef2f2' : '#f0fdf4'}}>
                                <Leaf size={20} color={metrics.carbon > 200 ? '#ef4444' : '#22c55e'}/>
                                <div style={{...styles.metricVal, color: metrics.carbon > 200 ? '#ef4444' : '#15803d'}}>
                                    {userLocation ? metrics.carbon : "?"} <span style={{fontSize:'0.9rem'}}>kg</span>
                                </div>
                                <div style={styles.metricLabel}>CO₂ Cost</div>
                            </div>
                        </div>

                        <div style={{marginTop:'20px'}}>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.8rem', marginBottom:'5px', fontWeight:'600'}}>
                                <span>Crowd Density</span>
                                <span>{selectedPlace.cached_footfall.toLocaleString()} / {selectedPlace.base_footfall?.toLocaleString()}</span>
                            </div>
                            <div style={{width:'100%', height:'8px', background:'#e2e8f0', borderRadius:'10px', overflow:'hidden'}}>
                                <div style={{
                                    height:'100%', 
                                    width: `${Math.min((selectedPlace.cached_footfall / (selectedPlace.base_footfall || 10000))*100, 100)}%`,
                                    background: selectedPlace.cached_footfall > 30000 ? '#ef4444' : '#3b82f6'
                                }}/>
                            </div>
                            <p style={{fontSize:'0.7rem', color:'#64748b', marginTop:'4px', textAlign:'right'}}>
                                {Math.round((selectedPlace.cached_footfall / (selectedPlace.base_footfall || 10000))*100)}% Capacity Full
                            </p>
                        </div>

                        <div style={{marginTop:'20px', padding:'12px', background: metrics.carbon > 300 ? '#fff1f2' : '#f0fdf4', borderRadius:'8px', fontSize:'0.85rem', borderLeft: metrics.carbon > 300 ? '4px solid #f43f5e' : '4px solid #22c55e'}}>
                            <div style={{display:'flex', gap:'10px', alignItems:'flex-start'}}>
                                <AlertCircle size={16} style={{marginTop:2}} />
                                <div>
                                    <strong>AI Insight: </strong> 
                                    {metrics.carbon > 300 
                                        ? "High impact. Consider train travel or off-peak hours." 
                                        : "Excellent choice! Low environmental impact."}
                                </div>
                            </div>
                        </div>
                      </>
                  ) : (
                      <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#94a3b8', gap:'10px'}}>
                          <MapPin size={40} color="#e2e8f0"/>
                          <div>Select a destination to analyze</div>
                      </div>
                  )}
              </div>
           </div>
        </div>

        {/* 4. VISUAL RAIL */}
        <div style={styles.sectionSpacer}>
           <DestinationRail destinations={data.destinations} />
        </div>

        <div style={{ width: "100%", overflow: "hidden", marginTop:'40px' }}><NewsCarousel/></div>
        <RegionalDashboard/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@300;400;600;700&display=swap');
        body { margin: 0; background: #f8fafc; }
        .levitating-map { width: 100%; height: 100%; animation: levitate 6s ease-in-out infinite; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15)); }
        @keyframes levitate { 0% { transform: translateY(0px) rotateX(5deg); } 50% { transform: translateY(-25px) rotateX(0deg); } 100% { transform: translateY(0px) rotateX(5deg); } }
        .weather-track::-webkit-scrollbar { height: 4px; }
        .weather-track::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); borderRadius: 4px; }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatBadge = ({ icon, label }) => (<div style={styles.statBadge}>{icon} <span>{label}</span></div>);
const WeatherCard = ({ day, index }) => {
  const Icon = day.condition?.icon || Cloud; 
  return (
    <div style={{...styles.weatherCard, animationDelay: `${index * 80}ms`}}>
      <div style={styles.wcHeader}><div style={styles.wcDay}>{day.name}</div><div style={styles.wcDate}>{day.date}</div></div>
      <div style={styles.wcIconWrapper}><Icon size={24} color={day.condition?.color || '#fff'} /></div>
      <div style={styles.wcFooter}><div style={styles.wcTemp}>{day.max}°</div><div style={styles.wcMinTemp}>{day.min}°</div></div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  pageWrapper: { fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#f1f5f9", minHeight: "100vh" },
  heroSection: { height: "auto", minHeight: "90vh", position: "relative", display: "flex", alignItems: "flex-end", padding: "0 5% 80px", clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)", marginBottom: "-50px" },
  heroBg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", zIndex: 0 },
  heroOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4))", zIndex: 1 },
  heroContent: { position: "relative", zIndex: 10, width: "100%", maxWidth: "1200px", margin: "0 auto", paddingTop: "120px" },
  backBtn: { position: "absolute", top: 30, left: 30, zIndex: 20, display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "30px", cursor: "pointer", fontWeight: "600" },
  tagline: { color: "#fbbf24", letterSpacing: "4px", fontSize: "0.9rem", fontWeight: "bold", background: "rgba(0,0,0,0.5)", padding: "5px 10px", borderRadius: "4px" },
  title: { fontFamily: "'Cinzel', serif", fontSize: "clamp(3rem, 6vw, 5rem)", color: "white", margin: "10px 0 20px", textShadow: "0 10px 30px rgba(0,0,0,0.5)", lineHeight: 1 },
  statsRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "40px" },
  statBadge: { display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", padding: "8px 16px", borderRadius: "50px", color: "white", fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.1)" },
  
  weatherStrip: { width: "100%", background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(16px)", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "20px 25px", display: "flex", flexDirection: "column", gap: "15px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" },
  weatherStripHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" },
  weatherLabel: { fontSize: "0.8rem", color: "#fbbf24", letterSpacing: "2px", fontWeight: "800" },
  weatherLoc: { fontSize: "0.8rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "1px" },
  weatherStripTrack: { display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "2px", scrollSnapType: "x mandatory", className: "weather-track" },
  weatherLoading: { color: "white", display: "flex", gap: "10px", fontSize: "0.9rem", padding: "20px" },
  weatherCard: { flexShrink: 0, width: "70px", height: "120px", background: "rgba(0,0,0,0.2)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "10px 5px", scrollSnapAlign: "start", border: "1px solid rgba(255,255,255,0.05)" },
  wcHeader: { textAlign: "center" }, wcDay: { fontSize: "0.6rem", color: "#94a3b8", textTransform: "uppercase" }, wcDate: { fontSize: "0.9rem", fontWeight: "bold", color: "white" },
  wcIconWrapper: { display: "flex", alignItems: "center", justifyContent: "center" },
  wcFooter: { textAlign: "center" }, wcTemp: { fontSize: "0.85rem", fontWeight: "bold", color: "white" }, wcMinTemp: { fontSize: "0.7rem", color: "#64748b" },

  contentContainer: { maxWidth: "1400px", margin: "0 auto", padding: "0 20px 100px", position: "relative", zIndex: 5 },
  splitLayout: { display: "flex", flexDirection: "row", gap: "40px", marginTop: "20px", alignItems: "center", flexWrap: "wrap" },
  floatingMapContainer: { flex: "1.5", height: "550px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", perspective: "1000px" },
  mapPedestalShadow: { width: "60%", height: "40px", background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)", borderRadius: "50%", transform: "rotateX(60deg) translateY(60px)", filter: "blur(10px)", zIndex: -1 },
  bentoBox: { background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", position: "relative", overflow: "hidden" },
  bioBox: { flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "400px" },
  
  sectionSpacer: { marginTop: "60px" },
  sectionTitle: { fontSize: "2rem", fontFamily: "'Cinzel', serif", color: "#1e293b", marginBottom: "10px" },
  sectionSubtitle: { fontSize: "1rem", color: "#64748b", marginBottom: "30px" },
  
  plannerGrid: { display: "flex", gap: "30px", flexWrap: "wrap" },
  plannerList: { 
      flex: "2",
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
      gap: "15px",
      maxHeight: "500px",
      overflowY: "auto",
      paddingRight: "5px"
  },
  placeCard: { padding: "15px", borderRadius: "12px", border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s", background: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" },
  
  plannerCalculator: { 
      flex: "1",
      minWidth: "300px",
      background: "white", padding: "25px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
      height: "fit-content",
      position: "sticky",
      top: "20px"
  },
  calcHeader: { borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "20px" },
  calcGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  calcMetric: { padding: "15px", borderRadius: "12px", background: "#f8fafc", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
  metricVal: { fontSize: "1.5rem", fontWeight: "700", color: "#1e293b" },
  metricLabel: { fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" },
  loading: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }
};

export default StateDetails;