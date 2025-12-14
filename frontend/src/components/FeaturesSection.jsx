import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const handleChatRedirect = () => {
    navigate('/map');
  };

  // Preload India3D component when user hovers on the chakra
  const handlePreload = () => {
    import('../SpecsPages/India3D.jsx');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);



  return (
    <section ref={ref} className="pt-0 pb-32 relative overflow-hidden bg-white">
      <div ref={sectionRef} className="absolute inset-0"></div>
      {/* Tricolor Background */}
      <div className="absolute inset-0">
        <img
          src="/tricolor-brush-splash-india-independence-day-design-free-vector.jpg"
          alt="Indian Tricolor Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlays for smooth blending */}
      {/* <div className="absolute h-[80%] inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-60"></div> */}
      {/* <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div> */}

      <div class="pointer-events-none absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Content Container */}
        <div className="flex items-center justify-between min-h-[400px] pt-38">

          {/* Left Side Text */}
          <div className="flex-1 pr-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              <span
                className={`block transform transition-all duration-700 delay-100 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                  }`}
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Explore.
              </span>
              <span
                className={`block transform transition-all duration-700 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                  }`}
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Experience.
              </span>
              <span
                className={`block transform transition-all duration-700 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                  }`}
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Evolve –
              </span>
              <span
                className={`block transition-all duration-700 delay-100 hover:scale-105 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                  }`}
                style={{
                  textShadow: '3px 3px 6px rgba(234, 88, 12, 0.3)',
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transition: 'transform 0.3s ease'
                }}
              >
                India Awaits You.
              </span>
            </h2>
          </div>

          {/* Centered Ashoka Chakra */}
          <div className="flex justify-center items-center flex-shrink-0 relative">
            {/* Hand-drawn arrow and text pointing to chakra */}
            <div
              className={`absolute -top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
                }`}
            >
              {/* Casual handwritten text */}
              <span
                className="text-2xl md:text-3xl text-gray-800 whitespace-nowrap"
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontWeight: 600,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  transform: 'rotate(-3deg)'
                }}
              >
                Click here to see the magic! ✨
              </span>

              {/* Hand-drawn style arrow SVG */}
              <svg
                width="60"
                height="50"
                viewBox="0 0 60 50"
                className="mt-1 animate-bounce"
                style={{
                  filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))',
                  transform: 'rotate(5deg)'
                }}
              >
                {/* Hand-drawn curved arrow path */}
                <path
                  d="M30 5 Q25 15, 30 25 Q35 35, 30 45"
                  stroke="#000000"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: '2,4',
                    animation: 'dash 1.5s ease-in-out infinite'
                  }}
                />
                {/* Arrow head - left line */}
                <path
                  d="M22 38 L30 48"
                  stroke="#000000"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Arrow head - right line */}
                <path
                  d="M38 38 L30 48"
                  stroke="#000000"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Extra decorative swoosh */}
                <path
                  d="M20 8 Q30 2, 40 8"
                  stroke="#000000"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </div>

            <div
              onClick={handleChatRedirect}
              onMouseEnter={handlePreload}
              className={`cursor-pointer group transition-all duration-700 hover:scale-110 relative z-10 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                transition: 'all 0.7s ease 0.4s'
              }}
            >
              <div className="animate-spin-slow group-hover:rotate-180 transition-transform duration-1000 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-white to-green-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img
                  src="/pngegg.png"
                  alt="Ashoka Chakra"
                  className="w-32 h-32 object-contain relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Right Side Text */}
          <div className="flex-1 pl-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight text-right">
              <span
                className={`block transform transition-all duration-700 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                  }`}
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                From the Himalayas
              </span>
              <span
                className={`block transform transition-all duration-700 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                  }`}
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                to the Oceans –
              </span>
              <span
                className={`block transition-all duration-700 delay-100 hover:scale-105 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                  }`}
                style={{
                  textShadow: '3px 3px 6px rgba(234, 88, 12, 0.3)',
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transition: 'transform 0.3s ease'
                }}
              >
                India Beckons.
              </span>
            </h2>
          </div>

        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

export default FeaturesSection;