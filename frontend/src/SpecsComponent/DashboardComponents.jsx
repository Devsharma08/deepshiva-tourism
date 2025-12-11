import React, { useState } from 'react';
import { 
  Star, MapPin, Wifi, Coffee, Utensils, Plane, Luggage, 
  Clock, ShieldCheck, ChevronRight, Share2, Heart, ArrowRight 
} from 'lucide-react';

// --- HELPER: FORMAT CURRENCY ---
const formatPrice = (price) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

// --- COMPONENT 1: HOTEL CARD (List View) ---
export const HotelCard = ({ data, isSelected, onClick }) => (
  <div 
    onClick={onClick}
    className={`group relative flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer bg-white ${
      isSelected 
        ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500 bg-blue-50/50' 
        : 'border-slate-100 hover:border-blue-200 hover:shadow-md'
    }`}
  >
    {/* Image with Gradient Overlay */}
    <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
      <img src={data.image} alt={data.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-[10px] font-bold shadow-sm">
        <Star size={10} className="text-yellow-500 fill-yellow-500" /> {data.rating}
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
          {data.name}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5 font-medium">
          <MapPin size={12} className="text-blue-500" /> 
          {data.location.address.split(',')[0]}
        </div>
      </div>

      <div className="flex justify-between items-end border-t border-slate-100 pt-3 mt-2">
        <div className="flex gap-2">
          {['Wifi', 'Pool'].map((tag, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Per Night</p>
          <div className="font-black text-xl text-slate-900">{formatPrice(data.price)}</div>
        </div>
      </div>
    </div>
  </div>
);


// --- COMPONENT 2: FLIGHT CARD (List View) ---
export const FlightCard = ({ data, isSelected, onClick }) => {
  const segment = data.segments[0];
  const startTime = segment.departure.at.split('T')[1].substring(0, 5);
  const endTime = segment.arrival.at.split('T')[1].substring(0, 5);

  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer bg-white ${
        isSelected 
          ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500' 
          : 'border-slate-100 hover:border-blue-300 hover:shadow-lg'
      }`}
    >
      {/* Header: Airline & Duration */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-600">
            {segment.airline.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm">{segment.airline}</div>
            <div className="text-[10px] text-slate-400 font-mono">{segment.flightNumber}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">
          <Clock size={12} /> {data.totalDuration}
        </div>
      </div>

      {/* Flight Timeline Visual */}
      <div className="flex items-center justify-between relative px-2">
        <div className="text-center z-10">
          <div className="text-2xl font-black text-slate-900">{segment.departure.iataCode}</div>
          <div className="text-sm font-medium text-slate-500">{startTime}</div>
        </div>

        {/* Path Line */}
        <div className="flex-1 px-6 relative flex flex-col items-center">
           <div className="w-full h-[2px] bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
           <Plane size={16} className="text-blue-500 bg-white rotate-90 z-10 relative px-1 box-content" />
           <p className="text-[10px] text-slate-400 mt-4 font-medium">{data.segments.length > 1 ? '1 Stop' : 'Non-stop'}</p>
        </div>

        <div className="text-center z-10">
          <div className="text-2xl font-black text-slate-900">{segment.arrival.iataCode}</div>
          <div className="text-sm font-medium text-slate-500">{endTime}</div>
        </div>
      </div>

      {/* Footer Price */}
      <div className="mt-5 pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
         <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Economy</div>
         <div className="font-black text-xl text-blue-600">{formatPrice(data.totalPrice)}</div>
      </div>
    </div>
  );
};


// --- COMPONENT 3: DETAIL PANEL (Sophisticated Overlay) ---
export const DetailPanel = ({ item, type, onClose }) => {
  // Safe Check: If no item is selected, return nothing (prevents crashes)
  if (!item) return null;

  return (
    <div className="h-full flex flex-col bg-white relative">
      
      {/* --- HOTEL DETAIL --- */}
      {type === 'hotels' && (
        <>
          {/* Header Image Area */}
          <div className="relative h-72 flex-shrink-0 group">
            <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Hotel" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            {/* Top Action Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pt-6 bg-gradient-to-b from-black/60 to-transparent">
               <button onClick={onClose} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all">
                 <ChevronRight size={20} className="rotate-180" />
               </button>
               <div className="flex gap-2">
                 <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 hover:text-red-400 transition-all"><Heart size={18} /></button>
                 <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"><Share2 size={18} /></button>
               </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-black leading-tight mb-2 tracking-tight">{item.name}</h1>
              <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                <MapPin size={16} className="text-blue-400" /> {item.location.address}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
            
            {/* Rating & Stats */}
            <div className="flex gap-4 border-b border-slate-100 pb-6">
              <div className="flex-1 bg-slate-50 p-3 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 font-black text-slate-800 text-lg">
                  {item.rating} <Star size={14} className="fill-yellow-500 text-yellow-500" />
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Rating</div>
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-xl text-center">
                <div className="font-black text-slate-800 text-lg">Very Good</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Reviews</div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { icon: Wifi, label: 'Fast Wifi' }, { icon: Coffee, label: 'Breakfast' },
                   { icon: Utensils, label: 'Restaurant' }, { icon: Luggage, label: 'Storage' },
                   { icon: ShieldCheck, label: 'Sanitized' }
                 ].map((a, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 font-medium text-sm">
                     <a.icon size={18} className="text-blue-500" /> {a.label}
                   </div>
                 ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Nestled in the heart of the city, {item.name} blends modern luxury with traditional hospitality. Enjoy stunning views, world-class dining, and easy access to major landmarks. Perfect for both business and leisure.
              </p>
            </div>
          </div>

          {/* Sticky Booking Footer */}
          <div className="p-4 border-t border-slate-100 bg-white/80 backdrop-blur-md absolute bottom-0 w-full z-10 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Total Price</div>
              <div className="text-2xl font-black text-slate-900">{formatPrice(item.price)}</div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2">
              Book Now <ArrowRight size={18}/>
            </button>
          </div>
        </>
      )}

      {/* --- FLIGHT DETAIL --- */}
      {type === 'flights' && (
        <div className="h-full bg-slate-50 flex flex-col p-6">
           {/* Header */}
           <div className="flex justify-between items-center mb-8">
             <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100"><ChevronRight size={20} className="rotate-180"/></button>
             <h2 className="font-bold text-slate-800">Flight Details</h2>
             <button className="p-2 opacity-0"><ChevronRight size={20}/></button> {/* Spacer */}
           </div>

           {/* Boarding Pass Container */}
           <div className="bg-white w-full rounded-3xl shadow-xl shadow-slate-200 overflow-hidden relative">
             
             {/* Top Section */}
             <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
               <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                   <div className="text-white/70 text-xs font-bold uppercase mb-1">Airline</div>
                   <div className="text-xl font-bold flex items-center gap-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[10px]">{item.airline.substring(0,2)}</div>
                      {item.airline}
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-white/70 text-xs font-bold uppercase mb-1">Class</div>
                   <div className="text-lg font-bold">Economy</div>
                 </div>
               </div>

               <div className="flex justify-between items-center relative z-10">
                 <div>
                   <div className="text-4xl font-black">{item.departure.iataCode}</div>
                   <div className="text-white/70 font-medium">{item.departure.at.split('T')[1].substring(0,5)}</div>
                 </div>
                 <div className="flex-1 flex flex-col items-center px-4">
                    <Plane size={24} className="rotate-90 mb-2 text-white/80"/>
                    <div className="w-full border-t-2 border-dashed border-white/30"></div>
                    <div className="text-[10px] uppercase font-bold text-white/60 mt-2">{item.duration}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-4xl font-black">{item.arrival.iataCode}</div>
                   <div className="text-white/70 font-medium">{item.arrival.at.split('T')[1].substring(0,5)}</div>
                 </div>
               </div>
             </div>

             {/* Perforation Effect */}
             <div className="relative h-6 bg-white flex items-center justify-center">
                <div className="absolute left-0 -translate-x-1/2 w-6 h-6 bg-slate-50 rounded-full"></div>
                <div className="w-full border-b-2 border-dashed border-slate-200 mx-6"></div>
                <div className="absolute right-0 translate-x-1/2 w-6 h-6 bg-slate-50 rounded-full"></div>
             </div>

             {/* Bottom Section */}
             <div className="p-6 pt-2">
               <div className="grid grid-cols-2 gap-6 mb-6">
                 <div>
                   <div className="text-slate-400 text-xs font-bold uppercase mb-1">Date</div>
                   <div className="text-slate-800 font-bold text-lg">{item.departure.at.split('T')[0]}</div>
                 </div>
                 <div>
                   <div className="text-slate-400 text-xs font-bold uppercase mb-1">Flight No</div>
                   <div className="text-slate-800 font-bold text-lg">{item.flightNumber}</div>
                 </div>
                 <div>
                   <div className="text-slate-400 text-xs font-bold uppercase mb-1">Gate</div>
                   <div className="text-slate-800 font-bold text-lg">TBA</div>
                 </div>
                 <div>
                   <div className="text-slate-400 text-xs font-bold uppercase mb-1">Seat</div>
                   <div className="text-slate-800 font-bold text-lg">--</div>
                 </div>
               </div>
               
               <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                 <span className="text-slate-500 font-bold text-sm">Total Fare</span>
                 <span className="text-2xl font-black text-blue-600">{formatPrice(item.totalPrice)}</span>
               </div>
             </div>
           </div>
           
           <button className="w-full mt-auto py-4 bg-black text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
             Proceed to Payment <ArrowRight size={18}/>
           </button>
        </div>
      )}
    </div>
  );
};