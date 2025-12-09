import React, { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

const ResultsPage = ({ flightResults }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <div className="min-h-screen bg-travel-white text-travel-text p-8">
      
      {/* 1. The Header with Filters */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Select your Journey</h1>
        <div className="flex gap-4">
            <button className="px-4 py-2 bg-white shadow-soft rounded-full hover:bg-gray-50">Cheapest</button>
            <button className="px-4 py-2 bg-white shadow-soft rounded-full hover:bg-gray-50">Fastest</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Flight List (Left Side) */}
        <div className="col-span-2 space-y-6">
          {flightResults.map((flight) => (
            <div 
              key={flight.id}
              onClick={() => setSelectedFlight(flight)}
              className={`p-6 bg-white rounded-2xl shadow-soft cursor-pointer transition-all border-2 ${selectedFlight?.id === flight.id ? 'border-travel-blue' : 'border-transparent'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                   {/* DYNAMIC IMAGE from Unsplash */}
                   <img src={flight.destinationImage} alt="Dest" className="w-24 h-24 rounded-xl object-cover" />
                   <div>
                      <h3 className="text-xl font-bold">{flight.itineraries[0].duration.replace('PT', '')}</h3>
                      <p className="text-gray-400">Direct Flight • {flight.validatingAirlineCodes[0]}</p>
                   </div>
                </div>
                <div className="text-right">
                   <span className="text-2xl font-bold text-travel-blue">€{flight.price.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. The "Navigator" Panel (Right Side - Map & Time) */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-soft h-fit sticky top-10">
          <h2 className="text-xl font-semibold mb-4">Journey Path</h2>
          
          {/* GOOGLE MAP INTEGRATION */}
          <div className="h-64 rounded-xl overflow-hidden mb-4">
             {selectedFlight ? (
                <MapComponent 
                   origin={selectedFlight.itineraries[0].segments[0].departure.iataCode} 
                   destination={selectedFlight.itineraries[0].segments[0].arrival.iataCode} 
                />
             ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">Select a flight to see path</div>
             )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
                <span>Estimated Time</span>
                <span className="font-bold">{selectedFlight ? selectedFlight.itineraries[0].duration.replace('PT', '').toLowerCase() : '--'}</span>
            </div>
            <button className="w-full py-4 bg-travel-blue text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
                Proceed to Book
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Map Component
const MapComponent = ({ origin, destination }) => {
  // Logic to convert IATA codes (LHR) to Lat/Lng using a helper function or API
  // Then render <GoogleMap> with <Polyline>
  return <div>[Google Map Visualizing Route from {origin} to {destination}]</div>
}

export default ResultsPage;