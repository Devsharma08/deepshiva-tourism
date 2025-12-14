import React, { useState } from 'react';
import {
  HiOutlineLightBulb,
  HiOutlineMapPin,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineXMark
} from 'react-icons/hi2';
import {
  Sparkles,
  Calendar,
  DollarSign,
  Globe,
  MapPin,
  Lightbulb,
  MessageCircle,
  BookOpen,
  Languages,
  Navigation
} from 'lucide-react';

function CardsSection() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Add CSS to hide scrollbar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const openModal = (card) => {
    setSelectedCard(card);
    setIsOpening(true);
    // Trigger opening animation after DOM update
    setTimeout(() => {
      setIsModalOpen(true);
      setIsOpening(false);
    }, 10);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedCard(null);
      setIsModalOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCard]);

  // Detailed features for each card
  const cardFeatures = {
    "Intelligent Planning": [
      {
        icon: Sparkles,
        title: "AI-Powered Destination Matching",
        description: "Get personalized Uttarakhand destination recommendations based on your spiritual interests, adventure level, and budget. Discover hidden gems in Devbhoomi."
      },
      {
        icon: Calendar,
        title: "Interactive Uttarakhand Map",
        description: "Explore districts with hover transitions, click for detailed information about each region including famous spots, cultural significance, and travel routes."
      },
      {
        icon: DollarSign,
        title: "Char Dham Yatra Planner",
        description: "Complete portal for Badrinath, Kedarnath, Gangotri, Yamunotri with registration process, helicopter bookings, and real-time weather updates."
      },
      {
        icon: Globe,
        title: "Theme-Based Circuits",
        description: "Curated spiritual journeys, adventure trails, nature escapes, and yoga retreats specifically designed for Uttarakhand's unique offerings."
      }
    ],
    "Curated Discoveries": [
      {
        icon: MapPin,
        title: "In-Depth Destination Explorer",
        description: "Rich profiles for each Uttarakhand destination with history, significance, attractions, and detailed travel information including how to reach and best time to visit."
      },
      {
        icon: Sparkles,
        title: "Interactive Trekking Guide",
        description: "Detailed trek maps with difficulty levels, elevation profiles, campsites, and options to book registered local guides and porters for safe adventures."
      },
      {
        icon: Lightbulb,
        title: "Local Experiences Marketplace",
        description: "Connect with verified local guides for authentic village tours, cooking classes, craft workshops, and unique cultural experiences in Devbhoomi."
      },
      {
        icon: Globe,
        title: "Live Temple Streams",
        description: "Experience live 'Darshan' and Aarti streams from major temples like Kedarnath and Har Ki Pauri, perfect for planning or virtual visits."
      }
    ],
    "Always Available": [
      {
        icon: MessageCircle,
        title: "AI Travel Companion",
        description: "24/7 intelligent chatbot trained on Uttarakhand data, answering queries about weather, road conditions, temple timings, and local customs instantly."
      },
      {
        icon: BookOpen,
        title: "Mythology Storyteller",
        description: "Learn fascinating stories behind sacred places - from King Bhagirath's legend at Gangotri to the significance of each Char Dham temple."
      },
      {
        icon: Languages,
        title: "Local Language Guide",
        description: "Learn essential Garhwali and Kumaoni phrases, local etiquette, and cultural do's and don'ts for respectful and authentic interactions."
      },
      {
        icon: Navigation,
        title: "Real-Time Yatra Assistant",
        description: "Live updates on weather conditions, road status, temple darshan timings, and emergency contacts for safe pilgrimage experiences."
      }
    ]
  };

  const cards = [
    {
      title: "Intelligent Planning",
      description: "Transform your travel dreams into detailed, actionable itineraries that adapt to your preferences and budget",
      icon: HiOutlineLightBulb,
      bg: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60",
      stats: "10M+ itineraries created",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Curated Discoveries",
      description: "Uncover authentic experiences and local treasures that match your unique travel style and interests",
      icon: HiOutlineMapPin,
      bg: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop&q=60",
      stats: "50K+ hidden gems",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Always Available",
      description: "Your personal travel companion ready to assist with real-time guidance, tips, and instant problem-solving",
      icon: HiOutlineChatBubbleLeftEllipsis,
      bg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=60",
      stats: "24/7 instant support",
      color: "from-purple-500 to-indigo-600"
    },
  ];

  return (
    <section className="w-full mb-0">
      {/* Section header */}
      <div className="text-center mb-2 px-6">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          How We Transform Your Travel
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Three powerful ways our platform elevates every aspect of your journey
        </p>
      </div>



      {/* Modal for detailed features */}
      {selectedCard && (
        <div
          className={`fixed inset-0 bg-gray-900/30 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-hidden transition-all duration-300 ${isClosing ? 'opacity-0' : isModalOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={closeModal}
        >
          <div
            className={`bg-gray-100/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-300/30 relative transition-all duration-300 ease-out ${isClosing
              ? 'scale-95 opacity-0 translate-y-4'
              : isModalOpen
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-95 opacity-0 translate-y-4'
              }`}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close button - floating */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 z-10 group shadow-lg"
            >
              <HiOutlineXMark className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>

            {/* Modal Header */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedCard.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <selectedCard.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCard.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-2 text-sm">
                    {selectedCard.description}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
                    <div className={`w-1.5 h-1.5 bg-gradient-to-r ${selectedCard.color} rounded-full`}></div>
                    <span className="text-xs font-medium text-gray-700">{selectedCard.stats}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div
              className="px-6 pb-6 overflow-y-auto max-h-[calc(80vh-10rem)] hide-scrollbar"
              style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* Internet Explorer 10+ */
              }}
            >
              <div className="space-y-3">
                {cardFeatures[selectedCard.title]?.map((feature, idx) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className={`group p-4 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-all duration-300 border border-gray-300/30 hover:border-gray-400/40 hover:shadow-lg transform ${isClosing
                        ? 'translate-y-2 opacity-0'
                        : isModalOpen
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-4 opacity-0'
                        }`}
                      style={{
                        transitionDelay: isClosing ? '0ms' : isModalOpen ? `${idx * 50}ms` : '0ms'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                          <FeatureIcon className={`w-5 h-5 text-gray-700`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 text-base">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Call to Action */}
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-100/70 to-amber-100/70 backdrop-blur-sm rounded-xl border border-orange-300/40">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Ready to explore Devbhoomi?
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    Begin your journey through the sacred lands of Uttarakhand
                  </p>
                  <button className={`bg-gradient-to-r ${selectedCard.color} text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 text-sm`}>
                    Start Your Journey
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section >
  );
}

export default CardsSection;
