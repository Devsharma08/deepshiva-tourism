import { MapPin, Calendar, Users, Star, Compass, Camera } from 'lucide-react';

const ChatWelcome = ({ onQuickStart }) => {
  const quickStartOptions = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Hill Stations",
      description: "Mussoorie, Nainital, Almora",
      action: "Show me popular hill stations in Uttarakhand"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Char Dham Yatra",
      description: "Sacred pilgrimage journey",
      action: "Plan Char Dham yatra itinerary"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Trip",
      description: "Family-friendly destinations",
      action: "Plan a family trip to Uttarakhand hill stations"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Adventure Treks",
      description: "Valley of Flowers, Roopkund",
      action: "Show me adventure trekking options in Uttarakhand"
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Wildlife Safari",
      description: "Jim Corbett National Park",
      action: "Plan Jim Corbett National Park safari"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Spiritual Journey",
      description: "Rishikesh, Haridwar temples",
      action: "Plan spiritual journey to Rishikesh and Haridwar"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Welcome Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 rounded-3xl mb-8 shadow-xl">
          <Compass className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
          Explore Uttarakhand
          <span className="block font-semibold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            Devbhoomi
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
          Discover the Land of Gods with its majestic Himalayas, sacred temples, pristine hill stations, and thrilling adventures.
          Let's plan your perfect Uttarakhand journey.
        </p>
      </div>

      {/* Quick Start Options */}
      <div className="mb-16">
        <h2 className="text-3xl font-light text-gray-900 mb-10 text-center tracking-tight">
          How can I assist you today?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickStartOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => onQuickStart(option.action)}
              className="group p-8 bg-white rounded-3xl border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 group-hover:from-orange-100 group-hover:to-amber-100 rounded-2xl text-orange-600 transition-all duration-300 group-hover:scale-110">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 text-lg">
                    {option.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Highlight */}
      <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-3xl p-10 border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-light text-gray-900 mb-8 text-center tracking-tight">
          Expertise at your service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700 font-medium">Hill station itineraries</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700 font-medium">Char Dham yatra planning</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700 font-medium">Adventure trek guidance</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700 font-medium">Wildlife safari bookings</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700 font-medium">Local culture experiences</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700 font-medium">Seasonal travel insights</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWelcome;