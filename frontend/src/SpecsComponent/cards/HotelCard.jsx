import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const HotelCard = ({ data, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative h-72 w-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-100 bg-white"
    >
      <img src={data.image} alt={data.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className="bg-yellow-400/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
                <Star className="w-3 h-3 fill-current" /> {data.rating}
            </div>
            <div className="text-white text-right">
                <span className="block text-2xl font-bold text-sky-400 drop-shadow-md">${data.price}</span>
            </div>
        </div>

        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{data.name}</h3>
            <p className="text-gray-300 text-sm flex items-center gap-1 mb-3">
                <MapPin className="w-3 h-3 text-sky-400" /> {data.location}
            </p>
            
            <button className="w-full py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors">
                View Details <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;