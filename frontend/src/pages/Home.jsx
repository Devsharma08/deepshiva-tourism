import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./navigation";
import CardsSection from "./CardSection";
import Map from "./Map";
import TravelDestination from "./TravelDestination";
import Activities from "./Activities";
import CommunityEvents from "./CommunityEvents";
import Collage from "./Collage";
import Footer from "./Footer";
import ChatbotButton from "../components/ChatbotButton";
import FeaturesSection from "../components/FeaturesSection";
import MonthlyVideoHero from "../components/MonthlyVideoHero";

function Home() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [immediateCursor, setImmediateCursor] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isInTargetSection, setIsInTargetSection] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [orbPositions, setOrbPositions] = useState([
    { x: 0, y: 0, vx: 0, vy: 0 }, // orb 1 - orange
    { x: 0, y: 0, vx: 0, vy: 0 }, // orb 2 - amber
    { x: 0, y: 0, vx: 0, vy: 0 }, // orb 3 - light orange
    { x: 0, y: 0, vx: 0, vy: 0 }, // orb 4 - dark orange
    { x: 0, y: 0, vx: 0, vy: 0 }  // orb 5 - dark amber
  ]);

  const targetPosition = React.useRef({ x: 50, y: 50 });
  const currentPosition = React.useRef({ x: 50, y: 50 });
  const animationId = React.useRef();
  const lastScrollY = React.useRef(0);
  const lastScrollTime = React.useRef(Date.now());
  const journeySection = React.useRef(null);
  const featuresSection = React.useRef(null);

  useEffect(() => {
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleDelay) return;
      lastTime = now;

      const percentagePosition = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      };

      const pixelPosition = {
        x: e.clientX,
        y: e.clientY
      };

      targetPosition.current = percentagePosition;

      // Check if cursor is in target sections
      let inTargetSection = false;
      
      if (journeySection.current) {
        const rect = journeySection.current.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && 
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          inTargetSection = true;
        }
      }
      
      if (!inTargetSection && featuresSection.current) {
        const rect = featuresSection.current.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && 
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          inTargetSection = true;
        }
      }

      setIsInTargetSection(inTargetSection);

      // Update immediate cursor position for hover orb (pixel-based for precision)
      if (inTargetSection) {
        setImmediateCursor(pixelPosition);
      }
    };

    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      const timeDelta = now - lastScrollTime.current;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Calculate scroll velocity (pixels per millisecond)
      const velocity = Math.abs(scrollDelta) / Math.max(timeDelta, 1);
      setScrollVelocity(velocity);

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = now;

      // Decay velocity over time
      setTimeout(() => {
        setScrollVelocity(prev => prev * 0.9);
      }, 100);
    };

    const animate = () => {
      // Smooth interpolation with delay for mouse
      const lerp = (start, end, factor) => start + (end - start) * factor;

      currentPosition.current.x = lerp(currentPosition.current.x, targetPosition.current.x, 0.08);
      currentPosition.current.y = lerp(currentPosition.current.y, targetPosition.current.y, 0.08);

      setMousePosition({
        x: currentPosition.current.x,
        y: currentPosition.current.y
      });

      // Animate floating orbs with physics
      setOrbPositions(prev => prev.map((orb, index) => {
        const time = Date.now() * 0.001;
        const gravity = scrollVelocity > 0.5 ? scrollVelocity * 2 : 0;
        const isFloating = scrollVelocity < 0.3;

        let newVx = orb.vx;
        let newVy = orb.vy;

        if (gravity > 0) {
          // Apply gravity when scrolling fast
          newVy += gravity * 0.1;
          newVx *= 0.95; // Reduce horizontal movement during scroll
        } else if (isFloating) {
          // Continuous floating motion with different patterns for each orb
          const floatForceY = Math.sin(time * (0.8 + index * 0.2) + index * 2) * 0.08;
          const floatForceX = Math.cos(time * (0.6 + index * 0.15) + index * 3) * 0.06;

          // Add floating forces
          newVy += floatForceY;
          newVx += floatForceX;

          // Gentle damping to prevent runaway motion
          newVx *= 0.992;
          newVy *= 0.992;
        } else {
          // Medium damping during transition
          newVx *= 0.985;
          newVy *= 0.985;
        }

        // Update positions
        let newX = orb.x + newVx;
        let newY = orb.y + newVy;

        // Soft boundary constraints with bounce
        if (newX > 25) { newX = 25; newVx = -Math.abs(newVx) * 0.6; }
        if (newX < -25) { newX = -25; newVx = Math.abs(newVx) * 0.6; }
        if (newY > 20) { newY = 20; newVy = -Math.abs(newVy) * 0.6; }
        if (newY < -20) { newY = -20; newVy = Math.abs(newVy) * 0.6; }

        // Add small random nudge to prevent complete stillness
        if (Math.abs(newVx) < 0.001 && Math.abs(newVy) < 0.001 && isFloating) {
          newVx += (Math.random() - 0.5) * 0.01;
          newVy += (Math.random() - 0.5) * 0.01;
        }

        return {
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      }));

      animationId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    animationId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <>
      {/* navigation bar */}
      <Navigation />

      {/* Monthly Video Hero Section */}
      <MonthlyVideoHero />

      {/* Elegant Transition Section */}
      <div className="relative h-40 bg-gradient-to-b from-black/20 via-transparent to-transparent overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-8 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-60 animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-12 right-1/3 w-1 h-1 bg-amber-500 rounded-full animate-bounce opacity-40 animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-6 left-2/3 w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-16 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-bounce opacity-30 animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-10 left-1/2 w-1 h-1 bg-orange-500 rounded-full animate-bounce opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute left-1/2 top-2/6 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center animate-bounce">
            <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-pulse"></div>
            </div>
            <svg className="w-4 h-4 text-orange-400 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Curved separator with gradient */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20 text-gray-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(249 250 251)" />
              <stop offset="50%" stopColor="rgb(255 247 237)" />
              <stop offset="100%" stopColor="rgb(254 243 199)" />
            </linearGradient>
          </defs>
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="url(#waveGradient)"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="url(#waveGradient)"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="url(#waveGradient)"
          ></path>
        </svg>
      </div>

      {/* information section */}
      <section
        ref={journeySection}
        className="flex flex-col justify-center gap-y-2 py-4 pb-0 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Physics-based floating orbs */}
        <div
          className="absolute w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl will-change-transform transition-opacity duration-300"
          style={{
            top: `${20 + orbPositions[0].y}%`,
            left: `${10 + orbPositions[0].x}%`,
            opacity: scrollVelocity > 0.5 ? 0.4 : 0.25,
            transform: `scale(${scrollVelocity > 0.5 ? 0.9 : 1})`
          }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl will-change-transform transition-opacity duration-300"
          style={{
            bottom: `${20 + orbPositions[1].y}%`,
            right: `${10 + orbPositions[1].x}%`,
            opacity: scrollVelocity > 0.5 ? 0.45 : 0.25,
            transform: `scale(${scrollVelocity > 0.5 ? 0.85 : 1})`
          }}
        ></div>
        <div
          className="absolute w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl will-change-transform transition-opacity duration-300"
          style={{
            top: `${50 + orbPositions[2].y}%`,
            left: `${50 + orbPositions[2].x}%`,
            transform: `translate(-50%, -50%) scale(${scrollVelocity > 0.5 ? 0.8 : 1})`,
            opacity: scrollVelocity > 0.5 ? 0.5 : 0.3
          }}
        ></div>

        {/* Additional darker floating orbs */}
        <div
          className="absolute w-60 h-60 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl will-change-transform transition-opacity duration-300"
          style={{
            top: `${30 + orbPositions[3].y}%`,
            right: `${25 + orbPositions[3].x}%`,
            opacity: scrollVelocity > 0.5 ? 0.35 : 0.2,
            transform: `scale(${scrollVelocity > 0.5 ? 0.85 : 1})`
          }}
        ></div>
        <div
          className="absolute w-50 h-50 bg-amber-700 rounded-full mix-blend-multiply filter blur-xl will-change-transform transition-opacity duration-300"
          style={{
            bottom: `${35 + orbPositions[4].y}%`,
            left: `${30 + orbPositions[4].x}%`,
            opacity: scrollVelocity > 0.5 ? 0.4 : 0.22,
            transform: `scale(${scrollVelocity > 0.5 ? 0.9 : 1})`
          }}
        ></div>

        {/* Mouse-following orb - only in target sections */}
        {isInTargetSection && (
          <div
            className="fixed w-40 h-40 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mix-blend-multiply filter blur-2xl pointer-events-none will-change-transform z-10"
            style={{
              top: `${immediateCursor.y}px`,
              left: `${immediateCursor.x}px`,
              transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
              opacity: isHovering ? 0.6 : 0.4,
              transition: 'opacity 0.3s ease, transform 0.3s ease'
            }}
          />
        )}


        {/* text */}
        <div className="text-center px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            AI-Powered Travel Intelligence
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Your Journey
            <span className="block bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent animate-gradient-x">
              Starts Here
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Transform wanderlust into unforgettable adventures. Our intelligent platform crafts
            <span className="font-semibold text-orange-600"> personalized journeys </span>
            that match your dreams, budget, and style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <button 
              onClick={() => navigate('/chat')}
              className="group bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="flex items-center gap-3">
                Plan My Adventure
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button 
              onClick={() => navigate('/chat')}
              className="group bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 border-2 border-gray-200 hover:border-orange-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Your Journey
              </span>
            </button>
          </div>

          <div className="flex justify-center items-center gap-8 mt-12 text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>24/7 support</span>
            </div>
          </div>
        </div>

        {/* cards and navigation */}
        <div className="w-full relative z-10">
          <CardsSection />
        </div>
      </section>

      {/* Features section */}
      <FeaturesSection ref={featuresSection} />


      {/* travel destination */}
      <section className="min-h-screen w-full">
        <TravelDestination />
      </section>
      {/* all activities section  */}
      <section className="min-h-screen w-full">
        <Activities />
      </section>
      {/* community and events */}
      <section className="min-h-screen w-full">
        <CommunityEvents />
      </section>
      <section className="min-h-screen w-full">
        <Collage />
      </section>
      <section className="h-[400px] w-full">
        <Footer />
      </section>

      {/* Floating chatbot button */}
      <ChatbotButton />
    </>
  );
}

export default Home;
