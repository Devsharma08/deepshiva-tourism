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
  Sun, Cloud, CloudRain, CloudLightning, Snowflake, Wind, AlertCircle, Activity
} from "lucide-react";
import { getStateData, getStateDesc } from "../Data/TourismData";
import DestinationRail from "../SpecsComponent/DestinationRail";
import State3DMap from "../SpecsComponent/State3dMap";
import { FashionProgressBar } from "../assets/ScrollingEffect";
import NewsCarousel from "../SpecsComponent/NewsComponent";
import WikiStateCard from "../SpecsComponent/StateDetailPage.jsx";
import RegionalDashboard from "../SpecsComponent/Foot.jsx";
import { cachedFetch } from "../utils/ContextManager";

// --- CONFIG ---
const API_URL = "http://localhost:5000/api/destinations"; // Corrected Port
const WEATHER_KEY = "bd5e378503939ddaee76f12ad7a97608";

// --- WIKIMEDIA SERVICE IMPORT ---
import { getIndiaLocationImage, getImageUrl, getPlaceholderImage } from '../utils/wikimediaService';

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
  if (['Rain', 'Drizzle'].includes(main)) return CONDITIONS[2];
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

  // AQI STATE
  const [aqi, setAqi] = useState(null);
  const [aqiLoading, setAqiLoading] = useState(true);

  // LIVE DATA STATES
  const [realDestinations, setRealDestinations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [impactLoading, setImpactLoading] = useState(true);

  // DYNAMIC IMAGE STATES (WIKIMEDIA)
  const [heroImageUrl, setHeroImageUrl] = useState(null);
  const [destinationImages, setDestinationImages] = useState({});

  useEffect(() => window.scrollTo(0, 0), [stateName]);

  // FETCH DYNAMIC IMAGES FROM WIKIMEDIA
  useEffect(() => {
    const fetchDynamicImages = async () => {
      if (!stateName) return;

      try {
        // Fetch hero image for the state
        const heroImg = await getIndiaLocationImage(stateName, 'state');
        if (heroImg) {
          setHeroImageUrl(heroImg);
        } else {
          // Use placeholder if Wikimedia fails
          setHeroImageUrl(getPlaceholderImage(stateName));
        }

        // Fetch images for destinations in realDestinations
        if (realDestinations.length > 0) {
          const imagePromises = realDestinations.map(async (dest, index) => {
            const img = await getImageUrl(dest.name, 'city');
            return { id: dest.id, img };
          });

          const results = await Promise.allSettled(imagePromises);
          const newImages = {};
          results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value.img) {
              newImages[result.value.id] = result.value.img;
            }
          });
          setDestinationImages(newImages);
        }
      } catch (error) {
        console.log('Error fetching Wikimedia images:', error);
        setHeroImageUrl(getPlaceholderImage(stateName));
      }
    };

    fetchDynamicImages();
  }, [stateName, realDestinations]);

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

        // Fetch AQI separately even when weather is cached
        console.log('🔵 [AQI] Starting fetch for:', stateName);
        try {
          const aqiCacheKey = `aqi_${stateName}_${new Date().getDate()}`;
          const cachedAqi = localStorage.getItem(aqiCacheKey);

          if (cachedAqi) {
            const parsed = JSON.parse(cachedAqi);
            console.log('🔵 [AQI] Found cache:', parsed);
            if (parsed.value && parsed.label !== '—') {
              setAqi(parsed);
              setAqiLoading(false);
              return;
            }
          }

          console.log('🔵 [AQI] Fetching from backend...');
          const aqiRes = await fetch(`http://localhost:5000/api/aqi?state=${encodeURIComponent(stateName)}`);
          console.log('🔵 [AQI] Response status:', aqiRes.status);
          if (aqiRes.ok) {
            const aqiData = await aqiRes.json();
            console.log('🔵 [AQI] Got data:', aqiData);
            setAqi(aqiData);
            localStorage.setItem(aqiCacheKey, JSON.stringify(aqiData));
          } else {
            console.log('🔵 [AQI] Response not OK');
            setAqi({ value: null, label: '—', color: '#94a3b8' });
          }
        } catch (aqiErr) {
          console.warn('🔴 [AQI] Fetch failed:', aqiErr);
          setAqi({ value: null, label: '—', color: '#94a3b8' });
        }
        setAqiLoading(false);
      } else {
        try {
          let queryName = stateName;
          // State name to city mapping for weather API
          const stateToCity = {
            "J & K": "Srinagar",
            "Odisha": "Bhubaneswar",
            "Arunachal Pradesh": "Itanagar",
            "Telangana": "Hyderabad",
            "Dadra & Nagar Haveli and Daman & Diu": "Silvassa",
            "Lakshadweep": "Kavaratti",
            "Chandigarh": "Chandigarh",
            "Ladakh": "Leh"
          };
          if (stateToCity[stateName]) queryName = stateToCity[stateName];
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

            // Fetch AQI from backend (uses Open-Meteo API)
            try {
              const aqiCacheKey = `aqi_${stateName}_${new Date().getDate()}`;
              const cachedAqi = localStorage.getItem(aqiCacheKey);

              // Only use cache if it has valid data (not a failed request)
              if (cachedAqi) {
                const parsed = JSON.parse(cachedAqi);
                if (parsed.value && parsed.label !== '—') {
                  setAqi(parsed);
                  setAqiLoading(false);
                  return; // Use valid cache
                }
              }

              // Fetch fresh data from backend
              const aqiRes = await fetch(`http://localhost:5000/api/aqi?state=${encodeURIComponent(stateName)}`);
              if (aqiRes.ok) {
                const aqiData = await aqiRes.json();
                setAqi(aqiData);
                localStorage.setItem(aqiCacheKey, JSON.stringify(aqiData));
              } else {
                setAqi({ value: null, label: '—', color: '#94a3b8' });
              }
            } catch (aqiErr) {
              console.warn('AQI fetch failed:', aqiErr);
              setAqi({ value: null, label: '—', color: '#94a3b8' });
            }
            setAqiLoading(false);
          }
        } catch (e) {
          console.warn("Weather API Limit:", e);
          // Fallback Mock for weather
          setForecast([{ name: 'Today', date: new Date().getDate(), max: 30, min: 22, condition: CONDITIONS[0] }]);

          // STILL fetch AQI even if weather fails!
          console.log('🔵 [AQI] Weather failed, but still fetching AQI for:', stateName);
          try {
            const aqiCacheKey = `aqi_${stateName}_${new Date().getDate()}`;
            const cachedAqi = localStorage.getItem(aqiCacheKey);

            if (cachedAqi) {
              const parsed = JSON.parse(cachedAqi);
              if (parsed.value && parsed.label !== '—') {
                console.log('🔵 [AQI] Using cached:', parsed);
                setAqi(parsed);
                setAqiLoading(false);
                setWeatherLoading(false);
                return;
              }
            }

            console.log('🔵 [AQI] Fetching from backend...');
            const aqiRes = await fetch(`http://localhost:5000/api/aqi?state=${encodeURIComponent(stateName)}`);
            if (aqiRes.ok) {
              const aqiData = await aqiRes.json();
              console.log('🔵 [AQI] Got data:', aqiData);
              setAqi(aqiData);
              localStorage.setItem(aqiCacheKey, JSON.stringify(aqiData));
            } else {
              setAqi({ value: null, label: '—', color: '#94a3b8' });
            }
          } catch (aqiErr) {
            console.warn('🔴 [AQI] Fetch failed:', aqiErr);
            setAqi({ value: null, label: '—', color: '#94a3b8' });
          }
          setAqiLoading(false);
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

  // 2. LIVE DATA SYNC (with caching)
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const allData = await cachedFetch(API_URL, {
          cacheTTL: 60 * 60 * 1000, // 1 hour
          cacheKey: 'all_destinations'
        });

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
    const dLat = (dest.latitude - userLocation.lat) * (Math.PI / 180);
    const dLon = (dest.longitude - userLocation.lng) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(userLocation.lat * (Math.PI / 180)) * Math.cos(dest.latitude * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
        <div style={{
          ...styles.heroBg,
          backgroundImage: heroImageUrl
            ? `url(${heroImageUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }} />
        <div style={styles.heroOverlay} />
        <button onClick={() => navigate('/map')} style={styles.backBtn}><ArrowLeft size={20} /> Back</button>

        <div style={styles.heroContent}>
          <span style={styles.tagline}>{data.tagline?.toUpperCase() || "INCREDIBLE INDIA"}</span>
          <h1 style={styles.title}>{data.name}</h1>
          <div style={styles.statsRow}>
            <StatBadge icon={<Thermometer size={16} />} label={data.stats.weather} />
            {/* AQI Badge - Always Visible */}
            <div style={{
              ...styles.statBadge,
              background: aqi?.color ? `linear-gradient(135deg, ${aqi.color}20, ${aqi.color}10)` : 'rgba(148,163,184,0.1)',
              borderColor: aqi?.color ? `${aqi.color}40` : 'rgba(148,163,184,0.3)'
            }}>
              <Activity size={16} color={aqi?.color || '#94a3b8'} />
              <span>AQI: <strong style={{ color: aqi?.color || '#94a3b8' }}>
                {aqiLoading ? 'Loading...' : (aqi?.label || '—')}
              </strong></span>
            </div>
            <StatBadge icon={<Calendar size={16} />} label={data.stats.bestTime} />
            <StatBadge icon={<MapPin size={16} />} label={`${realDestinations.length || data.destinations.length} Hotspots`} />
          </div>

          <div style={styles.weatherStrip}>
            <div style={styles.weatherStripHeader}>
              <div style={styles.weatherLabel}>FORECAST</div>
              <div style={styles.weatherLoc}><MapPin size={12} /> {stateName}</div>
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
          <h2 style={styles.sectionTitle}>🌱 Sustainable Planner</h2>
          <p style={styles.sectionSubtitle}>Compare live crowd levels and carbon impact for smarter travel choices.</p>

          <div style={styles.plannerGrid}>

            {/* LIST */}
            <div style={styles.plannerList}>
              {impactLoading ? (
                // Skeleton Loading Animation
                <>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      ...styles.placeCard,
                      height: '280px',
                      minWidth: '280px',
                      flexShrink: 0,
                      background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }}>
                      <div style={{ height: '140px', borderRadius: '16px 16px 0 0', background: '#e2e8f0' }} />
                      <div style={{ padding: '16px' }}>
                        <div style={{ height: '20px', width: '70%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '12px' }} />
                        <div style={{ height: '16px', width: '50%', background: '#e2e8f0', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </>
              ) : realDestinations.length === 0 ? (
                // Improved Empty State with Fallback 
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '24px',
                  border: '2px dashed #e2e8f0'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                  <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '8px' }}>
                    Live Data Temporarily Unavailable
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
                    We're working on fetching real-time crowd and carbon data for {stateName}.
                    Check back soon or explore the region info above!
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    🔄 Retry
                  </button>
                </div>
              ) :
                realDestinations.map(place => (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    style={{
                      ...styles.placeCard,
                      borderColor: selectedPlace?.id === place.id ? '#3b82f6' : '#e2e8f0',
                      backgroundColor: selectedPlace?.id === place.id ? '#eff6ff' : 'white',
                      transform: selectedPlace?.id === place.id ? 'translateY(-4px)' : 'translateY(0)',
                      boxShadow: selectedPlace?.id === place.id
                        ? '0 12px 30px -8px rgba(59, 130, 246, 0.25)'
                        : '0 4px 15px rgba(0,0,0,0.05)',
                      height: '280px',
                      minWidth: '280px',
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Destination Image */}
                    <div style={{
                      height: '140px',
                      minHeight: '140px',
                      borderRadius: '16px 16px 0 0',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: destinationImages[place.id]
                          ? `url(${destinationImages[place.id]}) center/cover no-repeat`
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        transition: 'transform 0.4s ease'
                      }}>
                        {!destinationImages[place.id] && (
                          <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1rem',
                            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}>
                            {place.name}
                          </div>
                        )}
                      </div>
                      {/* Type Badge on Image */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        fontSize: '0.65rem',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)',
                        color: '#475569',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {place.description || 'Place'}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{
                      padding: '16px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        fontWeight: '700',
                        color: '#0f172a',
                        fontSize: '1rem',
                        marginBottom: '12px',
                        lineHeight: '1.3'
                      }}>
                        {place.name}
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: place.carbon_intensity_factor > 1.2 ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                          padding: '6px 10px',
                          borderRadius: '20px'
                        }}>
                          <Leaf size={14} color={place.carbon_intensity_factor > 1.2 ? '#f59e0b' : '#22c55e'} />
                          <span style={{ fontWeight: '600' }}>{place.carbon_intensity_factor}x</span>
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          color: place.cached_footfall > 30000 ? '#ef4444' : '#22c55e',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Users size={14} />
                          {place.cached_footfall > 1000 ? (place.cached_footfall / 1000).toFixed(1) + 'k' : place.cached_footfall}
                        </div>
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
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedPlace.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Trip Analysis</span>
                  </div>

                  <div style={styles.calcGrid}>
                    <div style={styles.calcMetric}>
                      <Navigation size={20} color="#3b82f6" />
                      <div style={styles.metricVal}>{userLocation ? metrics.dist : "?"} <span style={{ fontSize: '0.9rem' }}>km</span></div>
                      <div style={styles.metricLabel}>Distance</div>
                    </div>
                    <div style={{ ...styles.calcMetric, border: metrics.carbon > 200 ? '1px solid #fecaca' : '1px solid #bbf7d0', background: metrics.carbon > 200 ? '#fef2f2' : '#f0fdf4' }}>
                      <Leaf size={20} color={metrics.carbon > 200 ? '#ef4444' : '#22c55e'} />
                      <div style={{ ...styles.metricVal, color: metrics.carbon > 200 ? '#ef4444' : '#15803d' }}>
                        {userLocation ? metrics.carbon : "?"} <span style={{ fontSize: '0.9rem' }}>kg</span>
                      </div>
                      <div style={styles.metricLabel}>CO₂ Cost</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px', fontWeight: '600' }}>
                      <span>Crowd Density</span>
                      <span>{selectedPlace.cached_footfall.toLocaleString()} / {selectedPlace.base_footfall?.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min((selectedPlace.cached_footfall / (selectedPlace.base_footfall || 10000)) * 100, 100)}%`,
                        background: selectedPlace.cached_footfall > 30000 ? '#ef4444' : '#3b82f6'
                      }} />
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
                      {Math.round((selectedPlace.cached_footfall / (selectedPlace.base_footfall || 10000)) * 100)}% Capacity Full
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', padding: '12px', background: metrics.carbon > 300 ? '#fff1f2' : '#f0fdf4', borderRadius: '8px', fontSize: '0.85rem', borderLeft: metrics.carbon > 300 ? '4px solid #f43f5e' : '4px solid #22c55e' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <AlertCircle size={16} style={{ marginTop: 2 }} />
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
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '10px' }}>
                  <MapPin size={40} color="#e2e8f0" />
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

        <div style={{ width: "100%", overflow: "hidden", marginTop: '40px' }}><NewsCarousel /></div>
        <RegionalDashboard />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        body { margin: 0; background: #f8fafc; }
        
        /* Levitating 3D Map */
        .levitating-map { 
          width: 100%; 
          height: 100%; 
          animation: levitate 6s ease-in-out infinite; 
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15)); 
        }
        @keyframes levitate { 
          0% { transform: translateY(0px) rotateX(5deg); } 
          50% { transform: translateY(-25px) rotateX(0deg); } 
          100% { transform: translateY(0px) rotateX(5deg); } 
        }
        
        /* Weather Track Scrollbar */
        .weather-track::-webkit-scrollbar { height: 4px; }
        .weather-track::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); borderRadius: 4px; }
        
        /* Premium Card Hover Effects */
        .place-card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.3);
        }
        
        /* Shimmer Loading Effect */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        /* Floating Particles Animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
        }
        
        /* Pulse Glow Effect */
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 20px 10px rgba(59, 130, 246, 0.1); }
        }
        
        /* Gradient Animation for Hero */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Fade In Up Animation */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Scale In Animation */
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .scale-in {
          animation: scaleIn 0.4s ease-out forwards;
        }
        
        /* Hero Image Parallax */
        .parallax-hero {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        
        /* Glassmorphism Effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Card Image Zoom on Hover */
        .card-image-zoom {
          transition: transform 0.5s ease;
        }
        .card-image-zoom:hover {
          transform: scale(1.1);
        }
        
        /* Breathing Effect for Icons */
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        /* Text Gradient Animation */
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
        }
        
        /* Smooth Reveal */
        .reveal-animation {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }
        .reveal-animation:nth-child(1) { animation-delay: 0.1s; }
        .reveal-animation:nth-child(2) { animation-delay: 0.2s; }
        .reveal-animation:nth-child(3) { animation-delay: 0.3s; }
        .reveal-animation:nth-child(4) { animation-delay: 0.4s; }
        
        /* Premium Button Hover */
        .premium-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .premium-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .premium-btn:hover::before {
          left: 100%;
        }
        
        /* Neon Glow Effect */
        .neon-glow {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #5a67d8, #6b46a1); }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatBadge = ({ icon, label }) => (<div style={styles.statBadge}>{icon} <span>{label}</span></div>);
const WeatherCard = ({ day, index }) => {
  const Icon = day.condition?.icon || Cloud;
  return (
    <div style={{ ...styles.weatherCard, animationDelay: `${index * 80}ms` }}>
      <div style={styles.wcHeader}><div style={styles.wcDay}>{day.name}</div><div style={styles.wcDate}>{day.date}</div></div>
      <div style={styles.wcIconWrapper}><Icon size={24} color={day.condition?.color || '#fff'} /></div>
      <div style={styles.wcFooter}><div style={styles.wcTemp}>{day.max}°</div><div style={styles.wcMinTemp}>{day.min}°</div></div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  // Page wrapper with subtle gradient background
  pageWrapper: {
    fontFamily: "'Inter', sans-serif",
    color: "#1e293b",
    background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)",
    minHeight: "100vh",
    overflowX: "hidden"
  },

  // Hero Section - Premium Full-Screen Experience
  heroSection: {
    height: "auto",
    minHeight: "95vh",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    padding: "0 5% 100px",
    clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
    marginBottom: "-80px"
  },
  heroBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    zIndex: 0,
    transition: "opacity 0.5s ease"
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.5) 40%, rgba(15, 23, 42, 0.95) 100%)",
    zIndex: 1
  },
  heroContent: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "120px"
  },

  // Back Button - Glassmorphism Style
  backBtn: {
    position: "absolute",
    top: 30,
    left: 30,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    padding: "12px 24px",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
  },

  // Tagline - Premium Badge
  tagline: {
    color: "#fbbf24",
    letterSpacing: "5px",
    fontSize: "0.85rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.1) 100%)",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(251,191,36,0.3)",
    display: "inline-block",
    textTransform: "uppercase"
  },

  // Title - Grand Typography
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: "clamp(3.5rem, 8vw, 6rem)",
    color: "white",
    margin: "20px 0 30px",
    textShadow: "0 4px 20px rgba(0,0,0,0.4), 0 10px 50px rgba(0,0,0,0.3)",
    lineHeight: 1,
    letterSpacing: "-2px",
    fontWeight: "700"
  },

  // Stats Row
  statsRow: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "40px"
  },
  statBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding: "12px 20px",
    borderRadius: "50px",
    color: "white",
    fontSize: "0.9rem",
    fontWeight: "500",
    border: "1px solid rgba(255,255,255,0.15)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  },

  // Weather Strip - Premium Glassmorphism
  weatherStrip: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    padding: "24px 30px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
  },
  weatherStripHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: "14px"
  },
  weatherLabel: {
    fontSize: "0.75rem",
    color: "#fbbf24",
    letterSpacing: "3px",
    fontWeight: "800",
    textTransform: "uppercase"
  },
  weatherLoc: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.6)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontWeight: "600"
  },
  weatherStripTrack: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    paddingBottom: "4px",
    scrollSnapType: "x mandatory"
  },
  weatherLoading: {
    color: "rgba(255,255,255,0.7)",
    display: "flex",
    gap: "10px",
    fontSize: "0.9rem",
    padding: "20px"
  },
  weatherCard: {
    flexShrink: 0,
    width: "75px",
    height: "130px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 8px",
    scrollSnapAlign: "start",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.3s ease",
    cursor: "default"
  },
  wcHeader: { textAlign: "center" },
  wcDay: { fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" },
  wcDate: { fontSize: "1rem", fontWeight: "700", color: "white" },
  wcIconWrapper: { display: "flex", alignItems: "center", justifyContent: "center" },
  wcFooter: { textAlign: "center" },
  wcTemp: { fontSize: "1rem", fontWeight: "700", color: "white" },
  wcMinTemp: { fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontWeight: "500" },

  // Content Container
  contentContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 20px 120px",
    position: "relative",
    zIndex: 5
  },

  // Split Layout
  splitLayout: {
    display: "flex",
    flexDirection: "row",
    gap: "50px",
    marginTop: "40px",
    alignItems: "stretch",
    flexWrap: "wrap"
  },

  // Floating Map Container with 3D Effect
  floatingMapContainer: {
    flex: "1.5",
    minHeight: "550px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    perspective: "1000px",
    background: "linear-gradient(180deg, rgba(99,102,241,0.05) 0%, transparent 100%)",
    borderRadius: "32px",
    padding: "20px"
  },
  mapPedestalShadow: {
    width: "70%",
    height: "50px",
    background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)",
    borderRadius: "50%",
    transform: "rotateX(60deg) translateY(60px)",
    filter: "blur(15px)",
    zIndex: -1
  },

  // Bento Box - Premium Card Style
  bentoBox: {
    background: "white",
    borderRadius: "28px",
    padding: "35px",
    boxShadow: "0 25px 60px -15px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.03)",
    border: "1px solid rgba(226,232,240,0.8)",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.4s ease"
  },
  bioBox: {
    flex: "1",
    minWidth: "320px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "450px"
  },

  // Section Styling
  sectionSpacer: {
    marginTop: "80px"
  },
  sectionTitle: {
    fontSize: "2.5rem",
    fontFamily: "'Cinzel', serif",
    color: "#0f172a",
    marginBottom: "12px",
    fontWeight: "600",
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  sectionSubtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    marginBottom: "35px",
    fontWeight: "400",
    lineHeight: "1.6"
  },

  // Planner Grid - Modern Layout
  plannerGrid: {
    display: "flex",
    gap: "35px",
    flexWrap: "wrap"
  },
  plannerList: {
    flex: "2",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "15px",
  },

  // Place Card - Premium Design
  placeCard: {
    padding: "0",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "white",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
    overflow: "hidden"
  },

  // Planner Calculator - Sticky Sidebar
  plannerCalculator: {
    flex: "1",
    minWidth: "340px",
    background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(226,232,240,0.6)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)",
    height: "fit-content",
    position: "sticky",
    top: "30px"
  },
  calcHeader: {
    borderBottom: "2px solid #f1f5f9",
    paddingBottom: "18px",
    marginBottom: "24px"
  },
  calcGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px"
  },
  calcMetric: {
    padding: "20px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    border: "1px solid rgba(226,232,240,0.5)",
    transition: "all 0.3s ease"
  },
  metricVal: {
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px"
  },
  metricLabel: {
    fontSize: "0.7rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontWeight: "600"
  },

  // Loading State
  loading: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)"
  }
};

export default StateDetails;