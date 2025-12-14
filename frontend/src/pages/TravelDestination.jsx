import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TfiArrowTopRight } from "react-icons/tfi";

function TravelDestination() {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const scrollLeft = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      } else {
        return cards.length - 3; // Loop to end
      }
    });
  };

  const scrollRight = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex < cards.length - 3) {
        return prevIndex + 1;
      } else {
        return 0; // Loop to beginning
      }
    });
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      scrollRight();
    }, 2000); // Auto-scroll every 2 seconds (faster)

    return () => clearInterval(interval);
  }, [currentIndex, isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const handleKeyNavigation = (e) => {
    if (e.key === 'ArrowLeft') {
      scrollLeft();
    }
    if (e.key === 'ArrowRight') {
      scrollRight();
    }
  };

  const getTransformOffset = () => {
    return -(currentIndex * 392); // 360px card + 32px gap
  };

  const cards = [
    {
      title: "Rajasthan",
      desc: "Royal forts & palaces",
      img: "https://images.pexels.com/photos/33769801/pexels-photo-33769801.jpeg",
      size: "w-[350px] h-[450px]",
      fullDesc: "Experience the grandeur of India's royal heritage with magnificent palaces, imposing forts, and vibrant cultural traditions that have stood the test of time.",
      highlights: ["Amber Fort", "City Palace", "Hawa Mahal", "Desert Safari"],
      bestTime: "October - March",
      duration: "7-10 days",
      rating: 4.8,
      gallery: [
        "https://images.unsplash.com/photo-1599661046827-dacde6976549?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Kerala",
      desc: "Backwaters & nature",
      img: "https://images.unsplash.com/photo-1756993399574-2fa126269ce7?w=600&auto=format&fit=crop&q=60",
      size: "w-[350px] h-[450px]",
      fullDesc: "Discover God's Own Country with serene backwaters, lush hill stations, pristine beaches, and rich cultural heritage that creates an unforgettable tropical paradise.",
      highlights: ["Alleppey Backwaters", "Munnar Hills", "Kochi Heritage", "Ayurvedic Spas"],
      bestTime: "September - March",
      duration: "5-8 days",
      rating: 4.9,
      gallery: [
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Ladakh",
      desc: "Mountains & monasteries",
      img: "https://images.unsplash.com/photo-1756303018960-e5279e145963?w=600&auto=format&fit=crop&q=60",
      size: "w-[350px] h-[450px]",
      fullDesc: "Journey to the roof of the world where ancient Buddhist monasteries perch on dramatic mountain landscapes, offering spiritual serenity and breathtaking vistas.",
      highlights: ["Pangong Lake", "Nubra Valley", "Hemis Monastery", "Khardung La Pass"],
      bestTime: "May - September",
      duration: "6-9 days",
      rating: 4.7,
      gallery: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Goa",
      desc: "Beaches & nightlife",
      img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
      size: "w-[350px] h-[450px]",
      fullDesc: "Experience the perfect blend of Portuguese heritage, pristine beaches, vibrant nightlife, and laid-back coastal charm in India's party capital.",
      highlights: ["Baga Beach", "Old Goa Churches", "Spice Plantations", "Night Markets"],
      bestTime: "November - February",
      duration: "4-6 days",
      rating: 4.6,
      gallery: [
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Himachal",
      desc: "Hills & adventure",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
      size: "w-[350px] h-[450px]",
      fullDesc: "Discover the majestic Himalayas with snow-capped peaks, adventure sports, colonial hill stations, and spiritual retreats in the lap of nature.",
      highlights: ["Manali", "Shimla", "Dharamshala", "Spiti Valley"],
      bestTime: "March - June, September - November",
      duration: "7-10 days",
      rating: 4.8,
      gallery: [
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Tamil Nadu",
      desc: "Temples & culture",
      img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80",
      size: "w-[350px] h-[450px]",
      fullDesc: "Explore ancient Dravidian temples, classical dance forms, rich cultural heritage, and diverse landscapes from beaches to hill stations.",
      highlights: ["Meenakshi Temple", "Mahabalipuram", "Ooty", "Kanyakumari"],
      bestTime: "November - March",
      duration: "8-12 days",
      rating: 4.7,
      gallery: [
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Rishikesh",
      desc: "Yoga & spirituality",
      img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
      size: "w-[350px] h-[450px]",
      fullDesc: "Experience the spiritual capital of the world with ancient ashrams, yoga retreats, adventure sports, and the sacred Ganges flowing through the Himalayas.",
      highlights: ["Laxman Jhula", "Beatles Ashram", "River Rafting", "Yoga Retreats"],
      bestTime: "February - May, September - November",
      duration: "3-5 days",
      rating: 4.6,
      gallery: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Auli",
      desc: "Skiing & snow peaks",
      img: "/Screenshot 2025-10-23 205916.png",
      size: "w-[350px] h-[450px]",
      fullDesc: "Discover India's premier skiing destination with pristine snow slopes, panoramic Himalayan views, and thrilling winter sports adventures.",
      highlights: ["Skiing Slopes", "Cable Car Ride", "Nanda Devi Views", "Gurso Bugyal"],
      bestTime: "December - March",
      duration: "4-6 days",
      rating: 4.5,
      gallery: [
        "/Screenshot 2025-10-23 205916.png",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Nainital",
      desc: "Lakes & hill station",
      img: "/Screenshot 2025-10-23 210030.png",
      size: "w-[350px] h-[450px]",
      fullDesc: "Escape to the charming lake city nestled in the Kumaon hills, offering serene boat rides, colonial architecture, and breathtaking mountain vistas.",
      highlights: ["Naini Lake", "Snow View Point", "Naina Devi Temple", "Mall Road"],
      bestTime: "March - June, September - November",
      duration: "3-4 days",
      rating: 4.4,
      gallery: [
        "/Screenshot 2025-10-23 210030.png",
        "https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Jim Corbett",
      desc: "Wildlife & safari",
      img: "/Screenshot 2025-10-23 210155.png",
      size: "w-[350px] h-[450px]",
      fullDesc: "Embark on thrilling wildlife safaris in India's oldest national park, home to majestic Bengal tigers, diverse flora, and pristine natural landscapes.",
      highlights: ["Tiger Safari", "Dhikala Zone", "Corbett Falls", "River Ramganga"],
      bestTime: "November - June",
      duration: "2-4 days",
      rating: 4.6,
      gallery: [
        "/Screenshot 2025-10-23 210155.png",
        "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600&auto=format&fit=crop&q=80"
      ]
    },
    {
      title: "Mussoorie",
      desc: "Queen of hills",
      img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
      size: "w-[350px] h-[450px]",
      fullDesc: "Experience the colonial charm of the Queen of Hills with scenic viewpoints, pleasant weather, historic landmarks, and stunning Doon Valley views.",
      highlights: ["Gun Hill", "Kempty Falls", "Mall Road", "Camel's Back Road"],
      bestTime: "April - June, September - November",
      duration: "3-5 days",
      rating: 4.3,
      gallery: [
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=80"
      ]
    }
  ];

  return (
    <>
      <div
        className="relative w-full min-h-screen"
        onKeyDown={handleKeyNavigation}
        tabIndex={0}
      >
        {/* Light Background Theme */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base gradient - light white/cream theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/30 to-amber-50/40" />

          {/* Secondary gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-white to-amber-100/30" />

          {/* Soft glow at top for seamless blend */}
          <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-white via-white to-transparent" />

          {/* Animated ambient orbs with light orange/amber theme */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1.5s' }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-orange-100/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />

          {/* Subtle mesh gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-100/25 via-transparent to-transparent" />

          {/* Fine grain texture overlay for premium feel */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

          {/* Top fade overlay for seamless blend with section above */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white via-white to-transparent pointer-events-none" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-32 right-1/3 w-1 h-1 bg-orange-300 rounded-full animate-bounce opacity-40"></div>
          <div className="absolute top-40 left-2/3 w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute bottom-40 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-bounce opacity-30"></div>
        </div>

        {/* Enhanced White Blur Gradient at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-60 bg-gradient-to-t from-white via-white/80 to-transparent" />

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col gap-y-10 min-h-screen py-12 px-8">
          {/* Enhanced Top Heading + Button */}
          <div className="flex items-start justify-between">
            <div className="ml-10">
              <div className="inline-flex items-center gap-2 bg-orange-100 backdrop-blur-sm text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-orange-200">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Premium Destinations
              </div>
              <h1 className="font-sans uppercase text-4xl md:text-7xl font-black tracking-wider text-gray-800 drop-shadow-sm leading-tight">
                <span className="block">Travel Like</span>
                <span className="block text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text">
                  a pro
                </span>
              </h1>
              <p className="text-gray-600 text-lg mt-4 max-w-md font-light">
                Discover India's most captivating destinations with expert-curated experiences
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/map')}
              className="group relative mt-6 mr-20 rounded-full"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-110"></div>

              {/* Button content */}
              <div className="relative px-8 py-3 bg-white rounded-full border border-orange-200 group-hover:border-orange-400 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                <span className="text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text font-semibold tracking-wide">
                  Dive In
                </span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Spacer */}
          <div className="mt-[80px]" />

          {/* Enhanced Cards Section */}
          <div className="relative pb-10">
            {/* Navigation Buttons - Always visible for loop navigation */}
            <button
              onClick={scrollLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white backdrop-blur-md text-gray-700 p-4 rounded-full shadow-xl hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110 border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white backdrop-blur-md text-gray-700 p-4 rounded-full shadow-xl hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110 border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Cards Container */}
            <div
              className="overflow-hidden w-full max-w-6xl mx-auto"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="flex items-center gap-8 pb-10 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${getTransformOffset()}px)`,
                  paddingLeft: '200px'
                }}
              >
                {cards.map((card, i) => {
                  return (
                    <div
                      key={i}
                      className={`group relative rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 ease-in-out flex-shrink-0 ${card.size} hover:-translate-y-2 hover:shadow-2xl`}
                      onClick={() => setSelectedCard(card)}
                    >

                      {/* Card Image */}
                      <div className="absolute inset-0">
                        <img
                          src={card.img}
                          alt={card.title}
                          className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
                        />
                        {/* Minimal gradient only for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>

                      {/* Card Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between transition-all duration-700">
                        <div className="flex justify-end">
                          <button className="bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-110 hover:rotate-12 border border-white/30">
                            <TfiArrowTopRight size={24} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-amber-400 text-sm transition-all duration-500">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i}>★</span>
                              ))}
                            </div>
                            <span className="text-white/80 text-sm font-medium transition-all duration-500">{card.rating}</span>
                          </div>

                          <h2 className="text-white font-black uppercase text-2xl tracking-wider drop-shadow-lg group-hover:text-amber-300 transition-all duration-500">
                            {card.title}
                          </h2>
                          <p className="text-white/90 text-sm font-medium uppercase tracking-wide transition-all duration-500">
                            {card.desc}
                          </p>

                          <div className="flex items-center gap-4 text-white/70 text-xs transition-all duration-500">
                            <span>{card.duration}</span>
                            <span>India</span>
                          </div>
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none bg-gradient-to-r from-amber-400/0 via-orange-400/0 to-amber-400/0 group-hover:from-amber-400/20 group-hover:via-orange-400/20 group-hover:to-amber-400/20" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {Array.from({ length: cards.length - 2 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`transition-all duration-500 transform hover:scale-125 ${currentIndex === i
                    ? 'w-8 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-400/50 animate-pulse'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                    }`}
                />
              ))}
            </div>

            {/* Auto-scroll indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isAutoScrolling ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span>{isAutoScrolling ? 'Auto-scrolling' : 'Paused'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={() => setSelectedCard(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-white/20 flex flex-col lg:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-6 right-6 z-10 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-110 text-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Section */}
            <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden lg:rounded-l-3xl rounded-t-3xl lg:rounded-tr-none">
              <img
                src={selectedCard.img}
                alt={selectedCard.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 flex flex-col min-h-0">
              <div className="p-8 text-white overflow-y-auto flex-1 scrollbar-hide">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="text-white/80 font-medium">{selectedCard.rating}</span>
                    </div>
                    <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text mb-2">
                      {selectedCard.title}
                    </h2>
                    <p className="text-white/80 text-lg">{selectedCard.desc}</p>
                  </div>

                  {/* Description */}
                  <p className="text-white/90 leading-relaxed">
                    {selectedCard.fullDesc}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">Best Time</span>
                      </div>
                      <p className="text-white/80">{selectedCard.bestTime}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">Duration</span>
                      </div>
                      <p className="text-white/80">{selectedCard.duration}</p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-amber-300">Top Highlights</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCard.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/80">
                          <div className="w-2 h-2 bg-amber-400 rounded-full" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gallery */}
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-amber-300">Gallery</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedCard.gallery.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                          <img
                            src={img}
                            alt={`${selectedCard.title} ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate('/chat')}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-amber-500/20 text-white px-6 py-3 rounded-xl font-medium text-sm border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-400/20 mb-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Plan Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TravelDestination;
