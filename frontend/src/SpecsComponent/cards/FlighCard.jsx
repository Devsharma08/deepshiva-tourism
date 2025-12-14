import React from 'react';
import { Plane, Clock, ArrowRight, MapPin } from 'lucide-react';

const FlightCard = ({ data, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative h-64 w-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* Background Image with Overlay */}
      <img src={data.image} alt="Dest" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"; }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Glass Content Container */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">

        {/* Top: Route & Badge */}
        <div className="flex justify-between items-start">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest">
            {data.operator}
          </div>
          <div className="text-white text-right">
            <span className="block text-2xl font-bold text-sky-400 drop-shadow-lg">${data.price}</span>
          </div>
        </div>

        {/* Bottom: Flight Info */}
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            {data.origin} <ArrowRight className="w-5 h-5 text-sky-400" /> {data.destination}
          </h3>

          <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-300">
            <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg backdrop-blur-sm">
              <Clock className="w-4 h-4 text-sky-400" /> {data.duration}
            </div>
            <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg backdrop-blur-sm">
              <Plane className="w-4 h-4 text-sky-400" /> Direct
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;