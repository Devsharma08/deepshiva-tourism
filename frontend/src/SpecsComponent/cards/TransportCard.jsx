import React from 'react';
import { Bus, Train, Clock, ArrowRight } from 'lucide-react';

const TransportCard = ({ data, type, onSelect, isSelected }) => (
  <div 
    onClick={() => onSelect(data)}
    className={`bg-white rounded-2xl p-5 cursor-pointer transition-all border ${isSelected ? 'border-sky-500 shadow-lg' : 'border-slate-100 hover:shadow-md'}`}
  >
    <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${type === 'train' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                {type === 'train' ? <Train className="w-6 h-6"/> : <Bus className="w-6 h-6"/>}
            </div>
            <div>
                <h3 className="font-bold text-slate-800">{data.operator}</h3>
                <p className="text-xs text-slate-400">{data.category} • {data.number}</p>
            </div>
        </div>
        <span className="text-xl font-bold text-sky-600">${data.price}</span>
    </div>

    <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
        <div className="text-center">
            <p className="font-bold text-lg">{data.departureTime}</p>
            <p className="text-xs text-slate-400">{data.origin}</p>
        </div>
        
        <div className="flex flex-col items-center gap-1 px-4">
            <span className="text-xs text-slate-400">{data.duration}</span>
            <div className="w-20 h-[1px] bg-slate-300 relative">
                <div className="absolute -top-1 right-0 w-2 h-2 bg-slate-300 rounded-full" />
            </div>
        </div>

        <div className="text-center">
            <p className="font-bold text-lg">{data.arrivalTime}</p>
            <p className="text-xs text-slate-400">{data.destination}</p>
        </div>
    </div>
  </div>
);

export default TransportCard;