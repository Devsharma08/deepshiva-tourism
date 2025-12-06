import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  Wind, 
  Droplets, 
  Search, 
  MapPin, 
  Calendar, 
  ChevronRight,
  Thermometer
} from 'lucide-react';

// --- Mock Data Utilities ---

const CONDITIONS = [
  { type: 'Sunny', icon: Sun, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-orange-500/20' },
  { type: 'Cloudy', icon: Cloud, color: 'text-gray-300', bg: 'from-gray-500/20 to-slate-500/20' },
  { type: 'Rainy', icon: CloudRain, color: 'text-blue-400', bg: 'from-blue-600/20 to-cyan-600/20' },
  { type: 'Stormy', icon: CloudLightning, color: 'text-purple-400', bg: 'from-purple-600/20 to-indigo-600/20' },
  { type: 'Snowy', icon: Snowflake, color: 'text-cyan-200', bg: 'from-cyan-300/20 to-blue-300/20' },
  { type: 'Windy', icon: Wind, color: 'text-teal-300', bg: 'from-teal-500/20 to-emerald-500/20' },
];

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    days.push({
      name: i === 0 ? 'Today' : dayNames[nextDate.getDay()],
      date: nextDate.getDate(),
      fullDate: nextDate.toLocaleDateString(),
    });
  }
  return days;
};

// Simulate an API call
const fetchWeatherData = async (region) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const days = getNext7Days();
      const forecast = days.map((day) => {
        const condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
        const baseTemp = 15 + Math.random() * 15; // Random temp between 15-30
        const max = Math.round(baseTemp + Math.random() * 5);
        const min = Math.round(baseTemp - Math.random() * 5);
        
        return {
          ...day,
          condition,
          max,
          min,
          humidity: Math.floor(Math.random() * 50) + 30,
        };
      });
      resolve(forecast);
    }, 1500); // 1.5s simulated network delay
  });
};

// --- Components ---

const WeatherIcon = ({ condition, className = "w-6 h-6" }) => {
  const Icon = condition.icon;
  return <Icon className={`${condition.color} ${className}`} />;
};

const ForecastCard = ({ day, index }) => {
  // Calculate height of the "bar" based on temp to make it visual
  const tempRangeHeight = Math.min((day.max - day.min) * 4, 40); 
  
  return (
    <div 
      className={`
        group relative flex-shrink-0 w-32 h-64 p-4 rounded-3xl 
        backdrop-blur-xl bg-white/5 border border-white/10 
        hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-2
        transition-all duration-300 ease-out flex flex-col items-center justify-between
        overflow-hidden
      `}
      style={{ animationDelay: `${index * 100}ms` }} 
    >
      {/* Background Gradient based on weather */}
      <div className={`absolute inset-0 bg-gradient-to-br ${day.condition.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Date Header */}
      <div className="z-10 text-center">
        <p className="text-xs font-medium text-cyan-300/80 uppercase tracking-widest">{day.name}</p>
        <p className="text-white font-bold text-lg">{day.date}</p>
      </div>

      {/* Icon */}
      <div className="z-10 my-2 relative">
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full transform scale-150 opacity-0 group-hover:opacity-50 transition-opacity" />
        <WeatherIcon condition={day.condition} className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
      </div>

      {/* Temperature Visuals */}
      <div className="z-10 w-full flex flex-col items-center space-y-2">
        
        {/* Max Temp */}
        <div className="flex items-center gap-1">
           <span className="text-white font-bold text-xl">{day.max}°</span>
        </div>

        {/* Visual Bar representation */}
        <div className="w-1.5 rounded-full bg-slate-700/50 relative overflow-hidden" style={{ height: '50px' }}>
          <div 
            className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-cyan-500 to-purple-500"
            style={{ height: `${(day.max / 40) * 100}%` }}
          />
        </div>

        {/* Min Temp */}
        <div className="text-slate-400 text-sm font-medium">{day.min}°</div>
      </div>
    </div>
  );
};

export default function App() {
  const [region, setRegion] = useState('Tokyo');
  const [inputValue, setInputValue] = useState('Tokyo');
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when region changes
  useEffect(() => {
    setLoading(true);
    fetchWeatherData(region).then((data) => {
      setForecast(data);
      setLoading(false);
    });
  }, [region]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setRegion(inputValue);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-[20%] right-[20%] w-64 h-64 bg-blue-600/10 rounded-full blur-[96px]" />
      </div>

      {/* Main Dashboard Container */}
      <div className="relative z-10 w-full max-w-5xl backdrop-blur-3xl bg-slate-900/60 border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Title & Location */}
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold tracking-[0.2em] uppercase mb-1">
                <MapPin className="w-4 h-4" />
                <span>Selected Region</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
               {loading ? <span className="animate-pulse bg-white/10 text-transparent rounded">Region</span> : region}
             </h1>
             <p className="text-slate-400 mt-1 flex items-center gap-2">
               <Calendar className="w-4 h-4" />
               Next 7 Days Forecast
             </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative group w-full md:w-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-slate-900 rounded-full px-4 py-3 min-w-[280px]">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter city..." 
                className="bg-transparent border-none outline-none text-white ml-3 placeholder-slate-500 w-full font-medium"
              />
              <button type="submit" className="ml-2 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-slate-300 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12">
          
          {/* Loading State */}
          {loading && (
            <div className="h-64 w-full flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
          )}

          {/* Forecast Grid */}
          {!loading && (
            <div className="relative">
              {/* Decorative Label */}
              <div className="absolute -top-6 left-0 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                // DATA_VISUALIZATION_MODE: ACTIVE
              </div>

              {/* Horizontal Scroll Container */}
              <div className="flex overflow-x-auto pb-6 pt-2 gap-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                {forecast.map((day, index) => (
                  <div key={index} className="snap-start animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <ForecastCard day={day} index={index} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Stats (Just for looks) */}
          {!loading && (
            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                 <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <Droplets className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Avg Humidity</p>
                    <p className="text-white font-bold text-lg">42%</p>
                 </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                 <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                    <Thermometer className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">High Index</p>
                    <p className="text-white font-bold text-lg">High</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(6, 182, 212, 0.2);
          border-radius: 20px;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}