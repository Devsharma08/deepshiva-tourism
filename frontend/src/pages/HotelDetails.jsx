import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Wifi, Coffee, Car, Waves, Dumbbell,
  Umbrella, Tv, Wind, Users, Calendar, Clock, Shield,
  Heart, Share2, Navigation, CheckCircle, X, ChevronLeft, ChevronRight
} from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setCheckIn(today.toISOString().split('T')[0]);
    setCheckOut(tomorrow.toISOString().split('T')[0]);
    
    // Fetch hotel details
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
        const data = await response.json();
        setHotel(data);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Hotel not found</p>
          <button
            onClick={() => navigate('/hotels')}
            className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg"
          >
            Search Hotels
          </button>
        </div>
      </div>
    );
  }

  const calculateNights = () => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return hotel.price * nights * rooms;
  };

  const amenities = [
    { icon: Wifi, label: 'Free WiFi', color: 'text-blue-500' },
    { icon: Coffee, label: 'Breakfast', color: 'text-amber-500' },
    { icon: Car, label: 'Parking', color: 'text-emerald-500' },
    { icon: Waves, label: 'Pool', color: 'text-cyan-500' },
    { icon: Dumbbell, label: 'Gym', color: 'text-purple-500' },
    { icon: Umbrella, label: 'Beach Access', color: 'text-orange-500' },
    { icon: Tv, label: 'Entertainment', color: 'text-pink-500' },
    { icon: Wind, label: 'AC', color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Results
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-4 text-slate-600 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {hotel.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {hotel.rating} • {hotel.reviews} reviews
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {hotel.awards}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setLiked(!liked)}
                className={`p-3 rounded-full ${liked ? 'bg-red-50' : 'bg-slate-100'} hover:bg-slate-200`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
              </button>
              <button className="p-3 rounded-full bg-slate-100 hover:bg-slate-200">
                <Share2 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2">
              <div className="relative h-96 md:h-full rounded-2xl overflow-hidden">
                <img
                  src={hotel.images[selectedImage]}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedImage((selectedImage - 1 + hotel.images.length) % hotel.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImage((selectedImage + 1) % hotel.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {hotel.images.slice(1, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index + 1)}
                className={`relative h-48 rounded-xl overflow-hidden ${
                  selectedImage === index + 1 ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${hotel.name} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                {selectedImage === index + 1 && (
                  <div className="absolute inset-0 bg-indigo-500/20" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About this property</h2>
              <p className="text-slate-700 leading-relaxed mb-6">{hotel.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.slice(0, 8).map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Icon className={`w-5 h-5 ${amenity.color}`} />
                      <span className="text-sm font-medium">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rooms */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Available Rooms</h2>
              
              <div className="space-y-4">
                {[
                  { type: 'Deluxe King Room', size: '45 m²', view: 'City View', price: hotel.price },
                  { type: 'Executive Suite', size: '75 m²', view: 'Ocean View', price: hotel.price * 1.5 },
                  { type: 'Presidential Suite', size: '120 m²', view: 'Panoramic View', price: hotel.price * 2 }
                ].map((room, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-slate-200 rounded-xl hover:border-indigo-300">
                    <div className="md:w-48 h-48 rounded-lg overflow-hidden">
                      <img
                        src={hotel.images[index % hotel.images.length]}
                        alt={room.type}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{room.type}</h3>
                          <div className="flex gap-4 text-sm text-slate-600 mt-1">
                            <span>Size: {room.size}</span>
                            <span>View: {room.view}</span>
                            <span>Sleeps: 2 adults</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">${room.price}</div>
                          <div className="text-sm text-slate-500">per night</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['Free cancellation', 'Breakfast included', 'Mobile key', '24/7 room service'].map((feature, i) => (
                          <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <button className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                        Select Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Location</h2>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 text-slate-700 mb-2">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium">{hotel.location}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500">Airport</div>
                    <div className="font-bold">15 min drive</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500">City Center</div>
                    <div className="font-bold">5 min walk</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500">Beach</div>
                    <div className="font-bold">10 min walk</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500">Shopping</div>
                    <div className="font-bold">3 min walk</div>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">Interactive Map</p>
                  <p className="text-sm text-slate-500">Showing location of {hotel.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Booking Widget */}
            <div className="glass-effect rounded-2xl p-6 sticky top-24">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">${hotel.price}</div>
                  <div className="text-slate-500">per night • includes taxes</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{hotel.rating}</span>
                  </div>
                  <div className="text-sm text-slate-500">{hotel.reviews} reviews</div>
                </div>
              </div>

              {/* Dates */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Guests
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold">{guests}</span>
                      <button
                        onClick={() => setGuests(guests + 1)}
                        className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Rooms
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold">{rooms}</span>
                      <button
                        onClick={() => setRooms(rooms + 1)}
                        className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="mb-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      ${hotel.price} × {calculateNights()} nights × {rooms} room{rooms > 1 ? 's' : ''}
                    </span>
                    <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service fee</span>
                    <span>$45.00</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Taxes</span>
                    <span>$32.50</span>
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-2xl text-indigo-600">
                        ${(calculateTotal() + 45 + 32.5).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-sm text-slate-500 mb-4">
                  Price includes all fees and taxes
                </div>
              </div>

              {/* Safety Features */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="font-bold">Enhanced cleaning</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-bold">Free cancellation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="font-bold">24/7 support</span>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-[1.02]">
                Reserve Now
              </button>
              
              <p className="text-center text-sm text-slate-500 mt-3">
                You can cancel for free within 24 hours
              </p>
            </div>

            {/* Sustainability */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Sustainability</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Environmental Score</span>
                    <span className="font-bold text-emerald-600">{hotel.sustainabilityScore}/100</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${hotel.sustainabilityScore}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-sm text-slate-600">
                  This property has implemented:
                </div>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Energy-efficient lighting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Water conservation systems
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Waste recycling program
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Local sourcing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;