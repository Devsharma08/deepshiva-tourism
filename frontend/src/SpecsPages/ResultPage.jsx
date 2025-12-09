import React, { useState } from 'react';
import MapComponent from '../SpecsComponent/MapComponent'; // Importing the Leaflet Map we built
import { Clock, Plane, MapPin, Star, ArrowRight } from 'lucide-react'; // Icons

const ResultsPage = ({ flightResults = [] }) => {
  // State for the currently selected flight card
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  // State for Trip Statistics (Duration/Distance) from the Map Component
  const [tripStats, setTripStats] = useState({ duration: null, distance: null });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 p-4 md:p-8 font-sans">
      
      {/* --- 1. Header Section --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Select your Journey</h1>
          <p className="text-slate-500 mt-1">Found {flightResults.length} flights matching your criteria</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-3">
          <button className="px-5 py-2 bg-white text-slate-700 border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 hover:shadow-md transition-all font-medium text-sm">
            Cheapest
          </button>
          <button className="px-5 py-2 bg-white text-slate-700 border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 hover:shadow-md transition-all font-medium text-sm">
            Fastest
          </button>
          <button className="px-5 py-2 bg-white text-slate-700 border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 hover:shadow-md transition-all font-medium text-sm">
            Best Rated
          </button>
        </div>
      </div>

      {/* --- 2. Main Content Grid --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Flight List --- */}
        <div className="col-span-2 space-y-6">
          {flightResults.length > 0 ? (
            flightResults.map((flight) => (
              <div 
                key={flight.id}
                onClick={() => {
                  setSelectedFlight(flight);
                  // Reset stats when changing flights so the user knows it's recalculating
                  setTripStats({ duration: null, distance: null });
                }}
                className={`
                  group relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-300
                  ${selectedFlight?.id === flight.id 
                    ? 'ring-2 ring-sky-500 shadow-xl shadow-sky-100 transform scale-[1.01]' 
                    : 'border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200'
                  }
                `}
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Dynamic Destination Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden relative">
                     <img 
                       src={flight.destinationImage || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80"} 
                       alt="Destination" 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                     />
                     <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/> 4.8
                     </div>
                  </div>

                  {/* Flight Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                          <Plane className="w-4 h-4" />
                          <span>{flight.airlineName || "Airline"} • Direct</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {flight.departureTime} <span className="text-slate-300 mx-2">→</span> {flight.arrivalTime}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="block text-2xl font-bold text-sky-600">€{flight.price}</span>
                        <span className="text-xs text-slate-400">per person</span>
                      </div>
                    </div>

                    {/* Footer of Card */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span>{flight.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-sky-400" />
                        <span>{flight.originCode} to {flight.destinationCode}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400">No flights found for your search.</p>
             </div>
          )}
        </div>

        {/* --- Right Column: The "Smart" Panel (Sticky) --- */}
        <div className="col-span-1 h-fit sticky top-8">
           <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-100 border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-500" /> Journey Preview
            </h2>
            
            {/* --- MAP CONTAINER --- */}
            <div className="h-64 bg-slate-100 rounded-xl overflow-hidden mb-6 relative border border-slate-200">
                {selectedFlight ? (
                  <MapComponent 
                      originCity={selectedFlight.originCityName || "London"}  // e.g. "London"
                      destinationCity={selectedFlight.destinationCityName || "Paris"} // e.g. "Paris"
                      onRouteDataLoaded={setTripStats} 
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                     <MapPin className="w-8 h-8 mb-2 opacity-50" />
                     <span className="text-sm">Select a flight to view map</span>
                  </div>
                )}
            </div>

            {/* --- TRIP STATS --- */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Est. Travel Time</span>
                  <span className="font-bold text-slate-800">
                      {tripStats.duration 
                          ? `${Math.floor(tripStats.duration / 60)}h ${tripStats.duration % 60}m` 
                          : '--'}
                  </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Distance</span>
                  <span className="font-bold text-slate-800">
                      {tripStats.distance ? `${tripStats.distance} km` : '--'}
                  </span>
              </div>
              <div className="flex justify-between items-center pb-3">
                  <span className="text-slate-500 text-sm">Transport Mode</span>
                  <span className="font-bold text-slate-800 text-sm bg-sky-50 text-sky-600 px-2 py-1 rounded-md">
                     Flight + Public Transit
                  </span>
              </div>

              {/* ACTION BUTTON */}
              <button 
                disabled={!selectedFlight}
                className={`
                   w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg
                   ${selectedFlight 
                      ? 'bg-sky-500 text-white shadow-sky-200 hover:bg-sky-600 hover:shadow-sky-300 cursor-pointer' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}
                `}
              >
                 {selectedFlight ? 'Proceed to Book' : 'Choose a Flight'}
                 {selectedFlight && <ArrowRight className="w-5 h-5" />}
              </button>
              
              <p className="text-center text-xs text-slate-400 mt-2">
                 Free cancellation within 24 hours of booking.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsPage;