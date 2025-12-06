import { useState, useEffect, useRef, useCallback } from "react";
import "./MonthlyVideoHero.css";

// Utility function to add start time to ImageKit video URL
const addStartTimeToImageKitUrl = (url, startTime) => {
  if (!startTime || startTime <= 0) return url;

  // Try multiple approaches for ImageKit start time
  // Method 1: Query parameter
  if (url.includes('?')) {
    return url + `&start=${startTime}`;
  } else {
    return url + `?start=${startTime}`;
  }
};

const MonthlyVideoHero = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMonthNavHovered, setIsMonthNavHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextMonthIndex, setNextMonthIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isLocationHovered, setIsLocationHovered] = useState(false);


  // Monthly video data - Complete 12-month Indian destinations
  const monthlyVideos = [
    {
      month: "January",
      location: "India: Auli, Uttarakhand",
      videoSrc: "https://imagekit.io/player/embed/zd04b5mivn/VID_20251022_170425.mp4?controls=false&autoplay=true&loop=true&background=%23000000&updatedAt=1761132960715&thumbnail=https%3A%2F%2Fik.imagekit.io%2Fzd04b5mivn%2FVID_20251022_170425.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1761132960715&updatedAt=1761132960715",
      isImageKit: true,
      description: "Beautiful winter landscapes and scenic views",
      detailedInfo: {
        altitude: "2,800m above sea level",
        bestTime: "December to March",
        activities: ["Skiing", "Cable Car Rides", "Trekking", "Snow Sports"],
        highlights: ["Asia's longest cable car", "Panoramic Himalayan views", "Artificial lake", "Oak and coniferous forests"],
        temperature: "-2°C to 8°C"
      }
    },
    {
      month: "February",
      location: "India: Nainital, Uttarakhand",
      videoSrc: "https://imagekit.io/player/embed/zd04b5mivn/NAINITAL%20_%20Cinematic%20Video%20_%204k(1080P_HD).mp4?controls=false&autoplay=true&loop=true&background=%23000000&updatedAt=1761130827099&thumbnail=https%3A%2F%2Fik.imagekit.io%2Fzd04b5mivn%2FNAINITAL%2520_%2520Cinematic%2520Video%2520_%25204k%281080P_HD%29.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1761130827099&updatedAt=1761130827099",
      isImageKit: true,
      description: "Serene lakes and charming hill station vibes",
      detailedInfo: {
        altitude: "2,084m above sea level",
        bestTime: "March to June, September to November",
        activities: ["Boating", "Mall Road Shopping", "Ropeway", "Nature Walks"],
        highlights: ["Naini Lake", "Snow View Point", "Naina Devi Temple", "Governor's House"],
        temperature: "10°C to 27°C"
      }
    },
    {
      month: "March",
      location: "India: Jim Corbett National Park",
      videoSrc: "/jim.mp4",
      isImageKit: false,
      description: "Wildlife adventures in India's oldest national park",
      detailedInfo: {
        altitude: "400m to 1,210m above sea level",
        bestTime: "November to June",
        activities: ["Tiger Safari", "Elephant Safari", "Bird Watching", "River Rafting"],
        highlights: ["Bengal Tigers", "Asian Elephants", "600+ bird species", "Ramganga River"],
        temperature: "5°C to 30°C"
      }
    },
    {
      month: "April",
      location: "India: Darjeeling, West Bengal",
      videoSrc: "/VID_20251024_150341.mp4",
      isImageKit: false,
      description: "Tea gardens and Himalayan sunrise views",
      detailedInfo: {
        altitude: "2,050m above sea level",
        bestTime: "April to June, September to December",
        activities: ["Toy Train Ride", "Tea Garden Tours", "Sunrise at Tiger Hill", "Monastery Visits"],
        highlights: ["Kanchenjunga views", "Darjeeling Tea", "UNESCO Heritage Railway", "Peace Pagoda"],
        temperature: "5°C to 25°C"
      }
    },
    {
      month: "May",
      location: "India: Tungnath, Uttarakhand",
      videoSrc: "https://imagekit.io/player/embed/zd04b5mivn/Tungnath%20_%20Chandrashila_%20A%20Cinematic%20Journey%20by%20Himalayan%20Monk(1080P_60FPS).mp4?controls=false&autoplay=true&loop=true&background=%23000000&updatedAt=1761130830534&thumbnail=https%3A%2F%2Fik.imagekit.io%2Fzd04b5mivn%2FTungnath%2520_%2520Chandrashila_%2520A%2520Cinematic%2520Journey%2520by%2520Himalayan%2520Monk%281080P_60FPS%29.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1761130830534&updatedAt=1761130830534",
      isImageKit: true,
      description: "World's highest Shiva temple and panoramic peaks",
      detailedInfo: {
        altitude: "3,680m above sea level",
        bestTime: "May to October",
        activities: ["Temple Pilgrimage", "Trekking", "Photography", "Meditation"],
        highlights: ["Highest Shiva temple", "360° Himalayan views", "Chandrashila Peak", "Rhododendron forests"],
        temperature: "0°C to 15°C"
      }
    },
    {
      month: "June",
      location: "India: Leh–Ladakh",
      videoSrc: "https://imagekit.io/player/embed/zd04b5mivn/EXPLORE%20LADAKH%20_%20CINEMATIC%20VIDEO%20IN%204K%20_%20GO%20PRO(1080P_60FPS).mp4?controls=false&autoplay=true&loop=true&background=%23000000&updatedAt=1761129098622&thumbnail=https%3A%2F%2Fik.imagekit.io%2Fzd04b5mivn%2FEXPLORE%2520LADAKH%2520_%2520CINEMATIC%2520VIDEO%2520IN%25204K%2520_%2520GO%2520PRO%281080P_60FPS%29.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1761129098622&updatedAt=1761129098622",
      isImageKit: true,
      description: "Experience the breathtaking landscapes of Ladakh",
      detailedInfo: {
        altitude: "3,500m above sea level",
        bestTime: "June to September",
        activities: ["Motorcycle Tours", "Monastery Visits", "Camping", "River Rafting"],
        highlights: ["Pangong Lake", "Nubra Valley", "Magnetic Hill", "Ancient Monasteries"],
        temperature: "15°C to 30°C"
      }
    },
    {
      month: "July",
      location: "India: Valley of Flowers, Uttarakhand",
      videoSrc: "/VID_20251024_154536.mp4",
      isImageKit: false,
      description: "UNESCO World Heritage site with alpine flowers",
      detailedInfo: {
        altitude: "3,658m above sea level",
        bestTime: "July to September",
        activities: ["Flower Trekking", "Photography", "Nature Walks", "Camping"],
        highlights: ["Alpine Flowers", "Himalayan Meadows", "Pushpawati River", "Rare Flora Species"],
        temperature: "5°C to 20°C"
      }
    },
    {
      month: "August",
      location: "India: Spiti Valley, Himachal Pradesh",
      videoSrc: "/spiti.mp4",
      isImageKit: false,
      description: "Cold desert landscapes and ancient monasteries",
      detailedInfo: {
        altitude: "3,800m above sea level",
        bestTime: "June to September",
        activities: ["Monastery Tours", "Fossil Hunting", "Stargazing", "Village Homestays"],
        highlights: ["Key Monastery", "Chandratal Lake", "Pin Valley", "Ancient Fossils"],
        temperature: "5°C to 25°C"
      }
    },
    {
      month: "September",
      location: "India: Kedarnath, Uttarakhand",
      videoSrc: "https://imagekit.io/player/embed/zd04b5mivn/VID_20251022_163331.mp4?controls=false&autoplay=true&loop=true&background=%23000000&updatedAt=1761131128828&thumbnail=https%3A%2F%2Fik.imagekit.io%2Fzd04b5mivn%2FVID_20251022_163331.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1761131128828&updatedAt=1761131128828",
      isImageKit: true,
      description: "Sacred pilgrimage to Lord Shiva's abode",
      detailedInfo: {
        altitude: "3,583m above sea level",
        bestTime: "May to June, September to October",
        activities: ["Temple Pilgrimage", "Helicopter Rides", "Trekking", "Spiritual Retreats"],
        highlights: ["Kedarnath Temple", "Mandakini River", "Vasuki Tal", "Chorabari Glacier"],
        temperature: "0°C to 18°C"
      }
    },
    {
      month: "October",
      location: "India: Badrinath, Uttarakhand",
      videoSrc: "https://imagekit.io/player/embed/zd04b5mivn/4K%20_%20Cinematic%20Drone%20shots%20of%20Badrinath%20_%20Rare%20Shots%20of%20Badrinath(1080P_HD).mp4?controls=false&autoplay=true&loop=true&background=%23000000&updatedAt=1761130823350&thumbnail=https%3A%2F%2Fik.imagekit.io%2Fzd04b5mivn%2F4K%2520_%2520Cinematic%2520Drone%2520shots%2520of%2520Badrinath%2520_%2520Rare%2520Shots%2520of%2520Badrinath%281080P_HD%29.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1761130823350&updatedAt=1761130823350",
      isImageKit: true,
      description: "Divine temple nestled in the Himalayas",
      detailedInfo: {
        altitude: "3,133m above sea level",
        bestTime: "May to June, September to October",
        activities: ["Temple Darshan", "Hot Springs", "Valley of Flowers Trek", "Mana Village Visit"],
        highlights: ["Badrinath Temple", "Tapt Kund", "Brahma Kapal", "Neelkanth Peak"],
        temperature: "7°C to 18°C"
      }
    },
    {
      month: "November",
      location: "India: Haridwar, Uttarakhand",
      videoSrc: "/VID_20251024_155913.mp4",
      isImageKit: false,
      description: "Sacred gateway to the Himalayas and holy Ganges",
      detailedInfo: {
        altitude: "314m above sea level",
        bestTime: "October to March",
        activities: ["Ganga Aarti", "Temple Visits", "Holy Dip", "Spiritual Tours"],
        highlights: ["Har Ki Pauri", "Ganga Aarti Ceremony", "Mansa Devi Temple", "Chandi Devi Temple"],
        temperature: "8°C to 30°C"
      }
    },
    {
      month: "December",
      location: "India: Goa",
      videoSrc: "/goa.mp4",
      isImageKit: false,
      description: "Sun, sand, and vibrant coastal culture",
      detailedInfo: {
        altitude: "Sea level",
        bestTime: "November to February",
        activities: ["Beach Relaxation", "Water Sports", "Nightlife", "Portuguese Heritage Tours"],
        highlights: ["Baga Beach", "Old Goa Churches", "Dudhsagar Falls", "Spice Plantations"],
        temperature: "20°C to 32°C"
      }
    }
  ];

  const INTERVAL_DURATION = 20000; // 20 seconds

  const handleMonthTransition = useCallback((newIndex) => {
    if (newIndex === currentMonthIndex || isTransitioning) return;

    setIsTransitioning(true);
    setNextMonthIndex(newIndex);

    // Start fade out
    setTimeout(() => {
      // Change to new month after fade out
      setCurrentMonthIndex(newIndex);
      setProgress(0);

      // Start fade in after a brief moment
      setTimeout(() => {
        setIsTransitioning(false);
        setNextMonthIndex(null);
      }, 100);
    }, 1000); // 1 second fade out
  }, [currentMonthIndex, isTransitioning]);

  useEffect(() => {
    let interval;
    let progressInterval;

    if (isPlaying && !isTransitioning) {
      // Progress bar update every 100ms
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + (100 / (INTERVAL_DURATION / 100));
        });
      }, 100);

      // Month change every 20 seconds
      interval = setInterval(() => {
        const nextIndex = (currentMonthIndex + 1) % monthlyVideos.length;
        handleMonthTransition(nextIndex);
      }, INTERVAL_DURATION);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isPlaying, currentMonthIndex, isTransitioning, monthlyVideos.length, handleMonthTransition]);

  const handleMonthClick = (index) => {
    handleMonthTransition(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // For regular MP4 videos, we can control playback
    // ImageKit iframe videos are controlled by their own players
    if (videoRef.current && !currentVideo.isImageKit) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // Scale movement
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsVideoHovered(true);
  };

  const handleMouseLeave = () => {
    setIsVideoHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const currentVideo = monthlyVideos[currentMonthIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden video-hero-main"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Video with Fade Transition */}
      <div className={`video-transition-container ${isTransitioning ? 'transitioning' : ''}`}>
        {currentVideo.isImageKit ? (
          <div
            className="imagekit-container"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              transition: isVideoHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
            }}
          >
            <iframe
              key={`imagekit-${currentMonthIndex}-${currentVideo.startTime || 0}`}
              className="absolute inset-0 w-full h-full object-cover youtube-iframe"
              src={addStartTimeToImageKitUrl(currentVideo.videoSrc, currentVideo.startTime)}
              title="ImageKit video player"
              style={{ border: 'none' }}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              onLoad={() => {
                // Try to communicate with ImageKit player to set start time
                if (currentVideo.startTime && currentVideo.startTime > 0) {
                  setTimeout(() => {
                    try {
                      const iframe = document.querySelector(`iframe[title="ImageKit video player"]`);
                      if (iframe && iframe.contentWindow) {
                        // Try to send a message to the iframe to seek to start time
                        iframe.contentWindow.postMessage({
                          type: 'seek',
                          time: currentVideo.startTime
                        }, '*');
                      }
                    } catch (error) {
                      console.log('Could not communicate with ImageKit player:', error);
                    }
                  }, 1000);
                }
              }}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) ${currentMonthIndex === 3 ? 'scale(1.15)' : 'scale(1)'}`,
              transition: isVideoHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
            }}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={currentVideo.videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Dark overlay with transition effect */}
      <div className={`absolute inset-0 bg-black/30 transition-opacity duration-1000 ${isTransitioning ? 'opacity-50' : 'opacity-30'}`}></div>



      {/* Bottom Left Controls */}
      <div className="absolute bottom-8 left-8 z-20 text-white bottom-left-controls">
        {/* Month navigation */}
        <div
          className="flex items-center gap-2 mb-4 month-navigation"
          onMouseEnter={() => setIsMonthNavHovered(true)}
          onMouseLeave={() => setIsMonthNavHovered(false)}
        >
          <button
            onClick={() => handleMonthClick((currentMonthIndex - 1 + monthlyVideos.length) % monthlyVideos.length)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className={`flex gap-1 transition-all duration-300 ${isMonthNavHovered ? 'gap-2' : 'gap-1'}`}>
            {monthlyVideos.map((video, index) => (
              <button
                key={index}
                onClick={() => handleMonthClick(index)}
                className={`transition-all duration-300 text-xs font-semibold month-button ${isMonthNavHovered
                  ? 'px-2 py-1'
                  : index === currentMonthIndex
                    ? 'px-2 py-1'
                    : 'px-1 py-1'
                  } ${index === currentMonthIndex
                    ? "text-white border-b-2 border-white"
                    : "text-white/70 hover:text-white"
                  }`}
              >
                {isMonthNavHovered || index === currentMonthIndex
                  ? video.month
                  : video.month.substring(0, 3)
                }
              </button>
            ))}
          </div>

          <button
            onClick={() => handleMonthClick((currentMonthIndex + 1) % monthlyVideos.length)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Location info */}
        <div className="relative mb-4">
          <div
            className={`transition-opacity duration-500 cursor-pointer ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
            onMouseEnter={() => setIsLocationHovered(true)}
            onMouseLeave={() => setIsLocationHovered(false)}
          >
            <p className="text-lg font-medium mb-1 hover:text-orange-300 transition-colors duration-300">
              {currentVideo.location}
            </p>
            <p className="text-sm text-white/80">{currentVideo.description}</p>
          </div>

          {/* Detailed hover card */}
          <div className={`absolute left-0 bottom-full mb-4 w-64 bg-gray-500/40 backdrop-blur-lg rounded-2xl p-4 border border-gray-400/30 shadow-2xl location-hover-card transition-all duration-200 ${isLocationHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{currentVideo.location}</h3>
                  <p className="text-white/90 text-xs">{currentVideo.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-orange-300 font-semibold mb-0.5">Altitude</p>
                    <p className="text-white/80">{currentVideo.detailedInfo.altitude}</p>
                  </div>
                  <div>
                    <p className="text-orange-300 font-semibold mb-0.5">Temperature</p>
                    <p className="text-white/80">{currentVideo.detailedInfo.temperature}</p>
                  </div>
                </div>

                <div>
                  <p className="text-orange-300 font-semibold mb-1.5 text-xs">Activities</p>
                  <div className="flex flex-wrap gap-1">
                    {currentVideo.detailedInfo.activities.slice(0, 3).map((activity, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-white/15 rounded-full text-xs text-white/90"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-orange-300 font-semibold mb-1.5 text-xs">Highlights</p>
                  <ul className="space-y-0.5">
                    {currentVideo.detailedInfo.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="text-white/80 text-xs flex items-center">
                        <span className="w-1 h-1 bg-orange-300 rounded-full mr-2 flex-shrink-0"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
        </div>

        {/* Progress bar and controls */}
        <div className="flex items-center gap-3 w-80 progress-container">
          <button
            onClick={togglePlayPause}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 bg-white/30 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <span className="text-xs font-medium min-w-[40px]">
            {Math.ceil((100 - progress) * (INTERVAL_DURATION / 100) / 1000)}s
          </span>
        </div>
      </div>


    </div>
  );
};

export default MonthlyVideoHero;