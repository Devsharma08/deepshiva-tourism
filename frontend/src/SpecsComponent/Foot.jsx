import React, { useEffect, useState } from 'react';
import { 
  Utensils, Plane, Train, Shield, Phone, 
  TrendingUp, Users, Landmark, Award, ArrowRight, MapPin
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getStateStats } from '../Data/TourismData';

const RegionalDashboard = () => {
  const { stateName } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (stateName) {
      const stateStats = getStateStats(stateName);
      setData(stateStats);
    }
  }, [stateName]);

  if (!data) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-slate-400 font-medium bg-slate-50">
        Loading regional data for {stateName || '...'}
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* Wrapper to match sibling width (1200px) */}
      <div className="max-w-[1200px] px-2 py-12 font-sans">

        {/* --- HEADER (Matched to Previous Sibling Style) --- */}
        <div className="flex items-center gap-5 mb-10">
          <div className="h-16 w-1 bg-blue-600 rounded-full"></div> {/* The Blue Accent Bar */}
          <div>
            <h2 className="text-3xl md:text-[31px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
              Regional Overview
            </h2>
            <p className="text-slate-500 font-medium mt-1 text-sm md:text-base tracking-wide uppercase">
              Key insights & Logistics for <span className="text-blue-600">{stateName}</span>
            </p>
          </div>
        </div>

        {/* --- SECTION 1: REGIONAL ACHIEVEMENTS --- */}
        <div className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {data.achievements?.map((stat, idx) => (
              // Card: White with Soft Shadow
              <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  {/* Icon Container - Light Tint */}
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={22} />
                  </div>
                  {/* Decorative blob (Subtle in Light Mode) */}
                  <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 ${stat.bg.replace('bg-', 'bg-')}-500`} />
                </div>
                <div className="text-3xl font-extrabold text-slate-800 tracking-tight font-cinzel">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 2: LOGISTICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Culinary Card */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full hover:border-orange-200 transition-colors">
            {/* Header */}
            <div className="bg-orange-50/50 p-5 border-b border-orange-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-orange-500">
                <Utensils size={18} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg font-cinzel">Culinary Heritage</h3>
            </div>
            
            {/* List */}
            <div className="p-5 space-y-3 overflow-y-auto max-h-[350px] custom-scrollbar">
              {data.food?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-700">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="mt-auto p-4 border-t border-slate-50 bg-slate-50/50 text-center">
               <button className="text-xs text-orange-600 font-bold uppercase tracking-wider hover:text-orange-700 flex items-center justify-center gap-1 mx-auto transition-colors">
                 View Food Guide <ArrowRight size={12} />
               </button>
            </div>
          </div>

          {/* 2. Connectivity Card */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full hover:border-blue-200 transition-colors">
            <div className="bg-blue-50/50 p-5 border-b border-blue-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500">
                <Plane size={18} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg font-cinzel">Connectivity</h3>
            </div>

            <div className="p-6 flex flex-col gap-8 relative">
               {/* Vertical Connector Line - Light Grey */}
               <div className="absolute left-[47px] top-10 bottom-10 w-0.5 bg-slate-100" />

               {/* Airport */}
               <div className="relative flex items-start gap-5 z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center shadow-sm text-blue-500 shrink-0">
                     <Plane size={16} />
                  </div>
                  <div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Major Airport</div>
                     <div className="text-sm font-bold text-slate-700 leading-tight">{data.transport?.airport}</div>
                  </div>
               </div>

               {/* Rail */}
               <div className="relative flex items-start gap-5 z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shadow-sm text-indigo-500 shrink-0">
                     <Train size={16} />
                  </div>
                  <div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Railway Junction</div>
                     <div className="text-sm font-bold text-slate-700 leading-tight">{data.transport?.rail}</div>
                  </div>
               </div>
               
               {/* Road */}
               <div className="relative flex items-start gap-5 z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm text-slate-500 shrink-0">
                     <MapPin size={16} />
                  </div>
                  <div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Highway Access</div>
                     <div className="text-sm font-bold text-slate-700 leading-tight">{data.transport?.road}</div>
                  </div>
               </div>
            </div>
          </div>

          {/* 3. Emergency Card */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full hover:border-red-200 transition-colors">
            <div className="bg-red-50/50 p-5 border-b border-red-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-red-500">
                <Shield size={18} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg font-cinzel">Emergency SOS</h3>
            </div>

            <div className="p-5 grid grid-cols-1 gap-3">
               {/* Police */}
               <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-red-50 hover:border-red-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                     <div className="p-1.5 bg-white rounded-lg text-red-500 shadow-sm"><Shield size={16}/></div>
                     <span className="font-bold text-slate-600 text-sm">Police</span>
                  </div>
                  <span className="text-lg font-black text-slate-800 group-hover:text-red-600 transition-colors">{data.safety?.police}</span>
               </div>

               {/* Medical */}
               <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-green-50 hover:border-green-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                     <div className="p-1.5 bg-white rounded-lg text-green-500 shadow-sm"><Users size={16}/></div>
                     <span className="font-bold text-slate-600 text-sm">Ambulance</span>
                  </div>
                  <span className="text-lg font-black text-slate-800 group-hover:text-green-600 transition-colors">{data.safety?.ambulance}</span>
               </div>

               {/* Helpline */}
               <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                     <div className="p-1.5 bg-white rounded-lg text-blue-500 shadow-sm"><Phone size={16}/></div>
                     <span className="font-bold text-slate-600 text-sm">Helpline</span>
                  </div>
                  <span className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">{data.safety?.touristHelpline}</span>
               </div>
            </div>
            
            <div className="mt-auto px-6 py-4 bg-slate-50/50 text-center border-t border-slate-50">
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                 Tap numbers to dial
               </p>
            </div>
          </div>

        </div>

        {/* Global Styles for Fonts and Scrollbar */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@300;400;500;600;700&display=swap');

          .font-cinzel { font-family: 'Cinzel', serif; }
          
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}</style>
      </div>
    </div>
  );
};

export default RegionalDashboard;