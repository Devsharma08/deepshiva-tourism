import { useState, useEffect, useRef } from "react";
import { FaHiking, FaWater, FaSpa, FaUtensils, FaCampground, FaHeart, FaPlay, FaPause } from "react-icons/fa";
import { TfiArrowTopRight } from "react-icons/tfi";

// Menu options - moved outside component to prevent re-creation
const menu = [
  { id: "adventure", label: "Adventure", icon: <FaHiking /> },
  { id: "water", label: "Water Sports", icon: <FaWater /> },
  { id: "wellness", label: "Wellness", icon: <FaSpa /> },
  { id: "food", label: "Food Tours", icon: <FaUtensils /> },
  { id: "camping", label: "Camping", icon: <FaCampground /> },
];

function Activities() {
  // Add CSS animations
  const styles = `
    @keyframes autoScrollProgress {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    
    @keyframes slideOutLeft {
      0% { transform: translateX(0) scale(1); opacity: 1; }
      100% { transform: translateX(-100%) scale(0.8); opacity: 0; }
    }
    
    @keyframes slideInRight {
      0% { transform: translateX(100%) scale(0.8); opacity: 0; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      0% { transform: translateX(0) scale(1); opacity: 1; }
      100% { transform: translateX(100%) scale(0.8); opacity: 0; }
    }
    
    @keyframes slideInLeft {
      0% { transform: translateX(-100%) scale(0.8); opacity: 0; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }
  `;

  // Inject styles
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    if (!document.head.querySelector('style[data-activities-styles]')) {
      styleSheet.setAttribute('data-activities-styles', 'true');
      document.head.appendChild(styleSheet);
    }
  }

  // Data is now fetched from API via useEffect

  const [active, setActive] = useState("adventure");
  const [cardsData, setCardsData] = useState({
    adventure: [],
    water: [],
    wellness: [],
    food: [],
    camping: []
  });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [orbsAnimated, setOrbsAnimated] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextActive, setNextActive] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const menuRef = useRef(null);
  const cardsRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const categories = ['adventure', 'water', 'wellness', 'food', 'camping'];
        const newCardsData = {};

        for (const category of categories) {
          const res = await fetch(`http://localhost:5000/api/activities?category=${category}&limit=6`);
          const data = await res.json();

          // Transform API data to match card format
          newCardsData[category] = (data.activities || []).map(activity => ({
            title: activity.title,
            subtitle: activity.subtitle,
            img: activity.img,
            price: activity.price,
            duration: activity.duration,
            location: activity.location?.city,
            rating: activity.rating
          }));
        }

        setCardsData(newCardsData);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    const menuIds = ["adventure", "water", "wellness", "food", "camping"];
    let transitionTimeoutId = null;

    const startAutoScroll = () => {
      if (!isMountedRef.current) return;

      // Reset progress animation by changing key
      setProgressKey(prev => prev + 1);

      autoScrollRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          clearInterval(autoScrollRef.current);
          return;
        }

        setActive(currentActive => {
          const currentIndex = menuIds.indexOf(currentActive);
          const nextIndex = (currentIndex + 1) % menuIds.length;
          const nextActiveId = menuIds[nextIndex];

          // Start transition animation
          setIsTransitioning(true);
          setNextActive(nextActiveId);

          // Complete transition after animation
          transitionTimeoutId = setTimeout(() => {
            if (!isMountedRef.current) return;
            setIsTransitioning(false);
            setNextActive(null);
            // Reset progress animation for next cycle
            setProgressKey(prev => prev + 1);
          }, 600); // Match animation duration

          return nextActiveId;
        });
      }, 8000); // Change every 8 seconds (slower for better viewing)
    };

    // Start auto-scroll after initial animations complete
    const timer = setTimeout(startAutoScroll, 500);

    return () => {
      clearTimeout(timer);
      if (transitionTimeoutId) {
        clearTimeout(transitionTimeoutId);
      }
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [isAutoScrolling]);

  // Handle manual menu click
  const handleMenuClick = (itemId) => {
    if (itemId === active || isTransitioning) return; // Prevent clicking during transition

    // Start transition animation
    setIsTransitioning(true);
    setNextActive(itemId);
    setIsAutoScrolling(false);

    // Clear existing auto-scroll
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }

    // Complete transition after animation
    setTimeout(() => {
      setActive(itemId);
      setIsTransitioning(false);
      setNextActive(null);
    }, 600); // Match animation duration

    // Resume auto-scroll after 8 seconds of inactivity
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 8000);
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Trigger orb animation immediately
          setOrbsAnimated(true);
        }
      });
    }, observerOptions);

    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
        }
      });
    }, observerOptions);

    const menuObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setMenuVisible(true);
        }
      });
    }, observerOptions);

    const cardsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
        }
      });
    }, observerOptions);

    if (sectionRef.current) sectionObserver.observe(sectionRef.current);
    if (headingRef.current) headingObserver.observe(headingRef.current);
    if (menuRef.current) menuObserver.observe(menuRef.current);
    if (cardsRef.current) cardsObserver.observe(cardsRef.current);

    return () => {
      sectionObserver.disconnect();
      headingObserver.disconnect();
      menuObserver.disconnect();
      cardsObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`min-h-screen w-full bg-gradient-to-br from-white via-slate-50/50 to-white transition-all duration-1000 relative overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
    >
      {/* Flowing Orbs from Top-Right to Bottom-Left */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Individual orbs flowing diagonally */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`flowing-orb-${i}`}
            className={`absolute rounded-full ${orbsAnimated ? 'opacity-100' : 'opacity-0'}`}
            style={{
              width: `${50 + (i % 4) * 20}px`,
              height: `${50 + (i % 4) * 20}px`,
              right: '-5%',
              top: '-5%',
              filter: `blur(${18 + (i % 3) * 8}px)`,
              background: i % 5 === 0
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.4) 40%, rgba(245, 158, 11, 0.1) 70%, transparent 100%)'
                : i % 5 === 1
                  ? 'radial-gradient(circle, rgba(249, 115, 22, 0.6) 0%, rgba(234, 88, 12, 0.4) 40%, rgba(234, 88, 12, 0.1) 70%, transparent 100%)'
                  : i % 5 === 2
                    ? 'radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.35) 40%, rgba(220, 38, 38, 0.1) 70%, transparent 100%)'
                    : i % 5 === 3
                      ? 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.35) 40%, rgba(37, 99, 235, 0.1) 70%, transparent 100%)'
                      : 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(126, 34, 206, 0.35) 40%, rgba(126, 34, 206, 0.1) 70%, transparent 100%)',
              animation: orbsAnimated ? `diagonalOrbFlow ${12 + (i * 2)}s linear infinite` : 'none',
              animationDelay: `${i * 1.5}s`
            }}
          />
        ))}

        {/* Smaller trailing orbs for continuity */}
        {[...Array(18)].map((_, i) => (
          <div
            key={`trailing-orb-${i}`}
            className={`absolute rounded-full ${orbsAnimated ? 'opacity-100' : 'opacity-0'}`}
            style={{
              width: `${25 + (i % 3) * 15}px`,
              height: `${25 + (i % 3) * 15}px`,
              right: '-3%',
              top: '-3%',
              filter: `blur(${12 + (i % 2) * 6}px)`,
              background: i % 4 === 0
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(245, 158, 11, 0.3) 60%, transparent 100%)'
                : i % 4 === 1
                  ? 'radial-gradient(circle, rgba(249, 115, 22, 0.7) 0%, rgba(234, 88, 12, 0.3) 60%, transparent 100%)'
                  : i % 4 === 2
                    ? 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.3) 60%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(126, 34, 206, 0.3) 60%, transparent 100%)',
              animation: orbsAnimated ? `diagonalOrbFlow ${8 + (i * 1.2)}s linear infinite` : 'none',
              animationDelay: `${0.5 + (i * 0.8)}s`
            }}
          />
        ))}

        {/* Subtle sparkle trail */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`sparkle-trail-${i}`}
            className={`absolute w-3 h-3 bg-white rounded-full ${orbsAnimated ? 'opacity-100' : 'opacity-0'}`}
            style={{
              right: '2%',
              top: '2%',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.9)',
              animation: orbsAnimated ? `diagonalSparkleFlow ${6 + (i * 0.8)}s linear infinite, twinkle ${2 + (i * 0.4)}s ease-in-out infinite` : 'none',
              animationDelay: `${0.3 + (i * 0.6)}s`
            }}
          />
        ))}

        {/* Flowing Orbs from Top-Left to Bottom-Right */}
        {/* Individual orbs flowing diagonally opposite direction */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`flowing-orb-left-${i}`}
            className={`absolute rounded-full ${orbsAnimated ? 'opacity-100' : 'opacity-0'}`}
            style={{
              width: `${45 + (i % 4) * 18}px`,
              height: `${45 + (i % 4) * 18}px`,
              left: '-5%',
              top: '-5%',
              filter: `blur(${16 + (i % 3) * 7}px)`,
              background: i % 5 === 0
                ? 'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, rgba(22, 163, 74, 0.35) 40%, rgba(22, 163, 74, 0.08) 70%, transparent 100%)'
                : i % 5 === 1
                  ? 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(5, 150, 105, 0.35) 40%, rgba(5, 150, 105, 0.08) 70%, transparent 100%)'
                  : i % 5 === 2
                    ? 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, rgba(8, 145, 178, 0.35) 40%, rgba(8, 145, 178, 0.08) 70%, transparent 100%)'
                    : i % 5 === 3
                      ? 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(147, 51, 234, 0.35) 40%, rgba(147, 51, 234, 0.08) 70%, transparent 100%)'
                      : 'radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, rgba(219, 39, 119, 0.35) 40%, rgba(219, 39, 119, 0.08) 70%, transparent 100%)',
              animation: orbsAnimated ? `diagonalOrbFlowReverse ${14 + (i * 2.2)}s linear infinite` : 'none',
              animationDelay: `${2 + (i * 1.8)}s`
            }}
          />
        ))}

        {/* Smaller trailing orbs for continuity - left to right */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`trailing-orb-left-${i}`}
            className={`absolute rounded-full ${orbsAnimated ? 'opacity-100' : 'opacity-0'}`}
            style={{
              width: `${22 + (i % 3) * 13}px`,
              height: `${22 + (i % 3) * 13}px`,
              left: '-3%',
              top: '-3%',
              filter: `blur(${10 + (i % 2) * 5}px)`,
              background: i % 4 === 0
                ? 'radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, rgba(22, 163, 74, 0.25) 60%, transparent 100%)'
                : i % 4 === 1
                  ? 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(5, 150, 105, 0.25) 60%, transparent 100%)'
                  : i % 4 === 2
                    ? 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(8, 145, 178, 0.25) 60%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(147, 51, 234, 0.25) 60%, transparent 100%)',
              animation: orbsAnimated ? `diagonalOrbFlowReverse ${9 + (i * 1.4)}s linear infinite` : 'none',
              animationDelay: `${1.2 + (i * 0.9)}s`
            }}
          />
        ))}

        {/* Subtle sparkle trail - left to right */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-trail-left-${i}`}
            className={`absolute w-2 h-2 bg-white rounded-full ${orbsAnimated ? 'opacity-100' : 'opacity-0'}`}
            style={{
              left: '2%',
              top: '2%',
              boxShadow: '0 0 12px rgba(255, 255, 255, 0.8)',
              animation: orbsAnimated ? `diagonalSparkleFlowReverse ${7 + (i * 0.9)}s linear infinite, twinkle ${2.5 + (i * 0.5)}s ease-in-out infinite` : 'none',
              animationDelay: `${1.8 + (i * 0.7)}s`
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-y-8 items-center px-6 py-16 max-w-7xl mx-auto relative z-10">
        {/* heading */}
        <div
          ref={headingRef}
          className={`flex justify-center items-center gap-8 mb-16 relative transform transition-all duration-1000 ${headingVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
        >
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-full opacity-40 animate-pulse delay-1000"></div>

          <img
            src="https://ik.imagekit.io/zd04b5mivn/Gemini_Generated_Image_oollssoollssooll.png?updatedAt=1761297541525"
            className="-rotate-6 w-28 h-36 object-cover rounded-xl shadow-xl hover:rotate-3 transition-transform duration-500 border-4 border-white"
            alt="poster-1"
          />
          <div className="text-center mx-8">
            <h1 className="flex flex-col items-center relative">
              <span className="text-6xl md:text-7xl font-black tracking-tight font-sans uppercase bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Experiences
              </span>
              <span className="text-6xl md:text-7xl font-black tracking-tight text-amber-600 font-sans uppercase relative">
                Made for you
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"></div>
              </span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg font-medium">Discover adventures tailored to your passion</p>
          </div>
          <img
            src="https://ik.imagekit.io/zd04b5mivn/Gemini_Generated_Image_hy08gqhy08gqhy08.png?updatedAt=1761297565489"
            className="rotate-6 w-28 h-36 object-cover rounded-xl shadow-xl hover:-rotate-3 transition-transform duration-500 border-4 border-white"
            alt="poster-2"
          />
        </div>

        {/* menu */}
        <div
          ref={menuRef}
          className={`relative flex flex-wrap justify-center gap-4 md:gap-8 mb-16 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transform transition-all duration-1000 ${menuVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-95'
            }`}
        >
          {/* Auto-scroll controls */}
          <div className="absolute -top-3 -right-3 flex items-center gap-2">
            <button
              onClick={() => {
                if (autoScrollRef.current) {
                  clearInterval(autoScrollRef.current);
                  autoScrollRef.current = null;
                }
                setIsAutoScrolling(!isAutoScrolling);
              }}
              className="bg-white/90 hover:bg-white text-gray-600 hover:text-amber-600 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              title={isAutoScrolling ? "Pause auto-scroll" : "Resume auto-scroll"}
            >
              {isAutoScrolling ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
            </button>
          </div>

          {/* Auto-scroll progress indicator */}
          {isAutoScrolling && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                key={progressKey}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{
                  animation: 'autoScrollProgress 8s linear forwards'
                }}
              ></div>
            </div>
          )}
          {menu.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex flex-col items-center gap-3 px-6 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 ${active === item.id
                ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg scale-105"
                : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                } ${menuVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{
                transitionDelay: menuVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className={`text-2xl transition-transform duration-300 ${active === item.id ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                {item.label}
              </span>
              {active === item.id && (
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              )}
            </button>
          ))}
        </div>

        {/* cards */}
        <div
          ref={cardsRef}
          className={`relative w-full overflow-hidden ${cardsVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'} transition-all duration-1000`}
        >
          {/* Current cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full transition-all duration-600 ease-in-out ${isTransitioning
              ? 'animate-[slideOutLeft_0.6s_ease-in-out_forwards]'
              : 'transform translate-x-0'
              }`}
          >
            {cardsData[active].slice(0, 3).map((card, i) => (
              <div
                key={`${active}-${i}`}
                className={`relative w-full max-w-sm mx-auto h-[420px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-rotate-1 ${cardsVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}
                style={{ transitionDelay: cardsVisible ? `${i * 50}ms` : '0ms' }}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'; }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <button className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110">
                      <FaHeart className="text-lg" />
                    </button>
                    <button className="bg-white/90 text-gray-800 p-3 text-lg rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 hover:rotate-45">
                      <TfiArrowTopRight />
                    </button>
                  </div>

                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <h2 className="text-white font-bold text-2xl tracking-wide drop-shadow-lg mb-2">
                        {card.title}
                      </h2>
                      <p className="text-white/90 text-sm font-medium drop-shadow-md uppercase tracking-wider">
                        {card.subtitle}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                        <span className="text-white/80 text-xs uppercase tracking-widest">Explore</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>

          {/* Next cards (sliding in) */}
          {isTransitioning && nextActive && (
            <div
              className="absolute top-0 left-0 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-[slideInRight_0.6s_ease-in-out_forwards]"
            >
              {cardsData[nextActive].slice(0, 3).map((card, i) => (
                <div
                  key={`${nextActive}-${i}`}
                  className="relative w-full max-w-sm mx-auto h-[420px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-rotate-1 translate-y-0 opacity-100 scale-100"
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <button className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110">
                        <FaHeart className="text-lg" />
                      </button>
                      <button className="bg-white/90 text-gray-800 p-3 text-lg rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 hover:rotate-45">
                        <TfiArrowTopRight />
                      </button>
                    </div>

                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <h2 className="text-white font-bold text-2xl tracking-wide drop-shadow-lg mb-2">
                          {card.title}
                        </h2>
                        <p className="text-white/90 text-sm font-medium drop-shadow-md uppercase tracking-wider">
                          {card.subtitle}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                          <span className="text-white/80 text-xs uppercase tracking-widest">Explore</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 rounded-2xl transition-all duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activities;
