import React from 'react';
import { X, MapPin, Clock, Star, Wifi, Coffee, Calendar, ArrowRight } from 'lucide-react';
import MapComponent from '../MapComponent.jsx' // Reuse your existing map

const DetailModal = ({ item, type, onClose }) => {
   if (!item) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
         <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200">

            {/* Close Button */}
            <button
               onClick={onClose}
               className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors"
            >
               <X className="w-6 h-6 text-slate-800" />
            </button>

            {/* --- LEFT SIDE: Visuals & Map --- */}
            <div className="w-full md:w-1/2 bg-slate-100 flex flex-col h-64 md:h-auto">
               {/* Hero Image */}
               <div className="h-1/2 w-full relative">
                  <img src={item.image} alt="Detail" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"; }} />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                     <h2 className="text-white text-2xl font-bold">{type === 'hotel' ? item.name : `Flight to ${item.destination}`}</h2>
                  </div>
               </div>

               {/* Map Container */}
               <div className="h-1/2 w-full relative border-t border-white/20">
                  <MapComponent
                     singleMarker={type === 'hotel' ? item.coords : null}
                     originCity={type === 'flight' ? item.origin : null}
                     destinationCity={type === 'flight' ? item.destination : null}
                  />
               </div>
            </div>

            {/* --- RIGHT SIDE: Details & Booking --- */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">

               <div className="flex-1 space-y-6">
                  {/* Header Info */}
                  <div className="flex justify-between items-start">
                     <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase mb-2">
                           {type === 'hotel' ? 'Hotel Stay' : 'One-way Flight'}
                        </span>
                        <h1 className="text-3xl font-bold text-slate-900">
                           {type === 'hotel' ? item.name : `${item.operator} Airlines`}
                        </h1>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                           <MapPin className="w-4 h-4" />
                           {type === 'hotel' ? item.location : `${item.origin} → ${item.destination}`}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-3xl font-bold text-sky-600">€{item.price}</p>
                        <p className="text-sm text-slate-400">total price</p>
                     </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Specific Details */}
                  {type === 'hotel' ? (
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-500 font-bold">
                           <Star className="w-5 h-5 fill-current" /> {item.rating} / 5.0 (Excellent)
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                           Experience luxury at {item.name}. Located in the heart of the city, offering breathtaking views and world-class service.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg"><Wifi className="w-4 h-4" /> Free Wifi</div>
                           <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg"><Coffee className="w-4 h-4" /> Breakfast Inc.</div>
                        </div>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="font-bold text-lg">{item.origin}</span>
                              <div className="flex-1 px-4 flex flex-col items-center">
                                 <span className="text-xs text-slate-400">{item.duration}</span>
                                 <div className="w-full h-[2px] bg-slate-300 relative my-1">
                                    <PlaneIcon className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
                                 </div>
                                 <span className="text-xs text-green-600 font-bold">Direct</span>
                              </div>
                              <span className="font-bold text-lg">{item.destination}</span>
                           </div>
                        </div>
                        <div className="flex gap-3 text-sm text-slate-500">
                           <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Leaves at 10:00 AM</span>
                           <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Refundable</span>
                        </div>
                     </div>
                  )}
               </div>

               {/* Footer Actions */}
               <div className="mt-8 pt-4 border-t border-slate-100">
                  <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                     Confirm Booking <ArrowRight className="w-5 h-5" />
                  </button>
               </div>

            </div>
         </div>
      </div>
   );
};

// Simple Plane Icon helper
const PlaneIcon = ({ className }) => (
   <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
);

export default DetailModal;