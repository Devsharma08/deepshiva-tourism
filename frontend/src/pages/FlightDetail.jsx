import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plane, Clock, MapPin, Shield, CheckCircle, Users, 
  Wifi, Coffee, Tv, Luggage, ArrowLeft, Share2, 
  Download, Calendar, Navigation, Zap, Battery
} from 'lucide-react';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [addOns, setAddOns] = useState({
    extraBaggage: false,
    priorityBoarding: false,
    meal: false,
    wifi: false
  });

  useEffect(() => {
    // Fetch flight details
    const fetchFlightDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/flights/${id}`);
        const data = await response.json();
        setFlight(data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Flight not found</p>
          <button
            onClick={() => navigate('/flights')}
            className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg"
          >
            Search Flights
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    let total = flight.price * passengerCount;
    if (addOns.extraBaggage) total += 50;
    if (addOns.priorityBoarding) total += 30;
    if (addOns.meal) total += 25;
    if (addOns.wifi) total += 20;
    return total;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Results
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {flight.origin} → {flight.destination}
              </h1>
              <div className="flex items-center gap-4 text-slate-600">
                <span className="flex items-center gap-1">
                  <Plane className="w-4 h-4" />
                  {flight.operator} • {flight.flightNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {flight.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {passengerCount} Passenger{passengerCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
                <Share2 className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
                <Download className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Flight Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Flight Timeline */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Flight Details</h2>
              
              <div className="space-y-6">
                {/* Departure */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{flight.departureTime}</div>
                      <div className="text-slate-600">{flight.origin}</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{flight.duration}</div>
                    <div className="text-sm text-slate-500">Non-stop</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">{flight.arrivalTime}</div>
                    <div className="text-slate-600">{flight.destination}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Aircraft Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1">Aircraft</div>
                    <div className="font-bold">{flight.aircraft}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1">Cabin Class</div>
                    <div className="font-bold">{flight.cabin}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Selection */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Select Seats</h2>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-slate-700">Cabin Layout</div>
                  <div className="text-sm text-slate-500">
                    Selected: {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                {/* Simplified Seat Map */}
                <div className="bg-slate-100 rounded-xl p-6">
                  <div className="text-center mb-4 text-slate-600">Business Class</div>
                  
                  {[...Array(6)].map((_, row) => (
                    <div key={row} className="flex justify-center gap-8 mb-6">
                      {['A', 'B', '', 'C', 'D'].map((seat, idx) => (
                        seat ? (
                          <button
                            key={`${row}${seat}`}
                            onClick={() => {
                              const seatId = `${row + 1}${seat}`;
                              setSelectedSeats(prev =>
                                prev.includes(seatId)
                                  ? prev.filter(s => s !== seatId)
                                  : [...prev, seatId]
                              );
                            }}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              selectedSeats.includes(`${row + 1}${seat}`)
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white hover:bg-slate-200'
                            }`}
                          >
                            {row + 1}{seat}
                          </button>
                        ) : (
                          <div key={idx} className="w-12" />
                        )
                      ))}
                    </div>
                  ))}
                  
                  <div className="text-center mt-4 text-slate-600">Economy Class</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Passengers</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                      className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold">{passengerCount}</span>
                    <button
                      onClick={() => setPassengerCount(passengerCount + 1)}
                      className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                  Save Selection
                </button>
              </div>
            </div>

            {/* Add-ons */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Add-ons</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: 'extraBaggage', label: 'Extra Baggage', price: 50, icon: Luggage },
                  { id: 'priorityBoarding', label: 'Priority Boarding', price: 30, icon: Zap },
                  { id: 'meal', label: 'Gourmet Meal', price: 25, icon: Coffee },
                  { id: 'wifi', label: 'In-flight WiFi', price: 20, icon: Wifi }
                ].map((addon) => {
                  const Icon = addon.icon;
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        addOns[addon.id]
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addOns[addon.id]}
                          onChange={(e) =>
                            setAddOns({ ...addOns, [addon.id]: e.target.checked })
                          }
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                        <Icon className="w-5 h-5 text-slate-600" />
                        <div>
                          <div className="font-bold">{addon.label}</div>
                          <div className="text-sm text-slate-500">${addon.price}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold">${addon.price}</div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="glass-effect rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Price Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Flight × {passengerCount}</span>
                  <span className="font-bold">${(flight.price * passengerCount).toFixed(2)}</span>
                </div>
                
                {addOns.extraBaggage && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Extra Baggage</span>
                    <span>$50.00</span>
                  </div>
                )}
                
                {addOns.priorityBoarding && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Priority Boarding</span>
                    <span>$30.00</span>
                  </div>
                )}
                
                {addOns.meal && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gourmet Meal</span>
                    <span>$25.00</span>
                  </div>
                )}
                
                {addOns.wifi && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">In-flight WiFi</span>
                    <span>$20.00</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-2xl text-indigo-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Safety Badges */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="font-bold">Safe Travel Guarantee</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-bold">Flexible Cancellation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="w-5 h-5 text-amber-500" />
                  <span className="font-bold">Carbon Offset Included</span>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-[1.02]">
                Complete Booking
              </button>
              
              <p className="text-center text-sm text-slate-500 mt-3">
                You won't be charged until confirmation
              </p>
            </div>

            {/* Travel Tips */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Travel Tips</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Check-in opens 24 hours before departure
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Arrive at airport 3 hours before international flights
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Mobile boarding pass available
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Free cabin baggage allowance: 7kg
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;