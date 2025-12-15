import React, { useState, useEffect, useRef } from "react";
import { FaUsers } from "react-icons/fa";
import { TfiArrowTopRight } from "react-icons/tfi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function CommunityEvents() {
  // Add CSS animations for orbs
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes orbMoveLBRT {
        0% {
          transform: translate(0, 0) scale(0.5);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translate(calc(100vw + 40px), calc(-100vh - 40px)) scale(1.2);
          opacity: 0;
        }
      }
      
      @keyframes orbMoveLTRB {
        0% {
          transform: translate(0, 0) scale(0.3);
          opacity: 0;
        }
        15% {
          opacity: 1;
        }
        85% {
          opacity: 1;
        }
        100% {
          transform: translate(calc(100vw + 40px), calc(100vh + 40px)) scale(1.5);
          opacity: 0;
        }
      }
      
      @keyframes orbMoveRBLT {
        0% {
          transform: translate(0, 0) scale(0.4);
          opacity: 0;
        }
        12% {
          opacity: 1;
        }
        88% {
          opacity: 1;
        }
        100% {
          transform: translate(calc(-100vw - 40px), calc(-100vh - 40px)) scale(1.3);
          opacity: 0;
        }
      }
      
      @keyframes orbMoveRTLB {
        0% {
          transform: translate(0, 0) scale(0.6);
          opacity: 0;
        }
        8% {
          opacity: 1;
        }
        92% {
          opacity: 1;
        }
        100% {
          transform: translate(calc(-100vw - 40px), calc(100vh + 40px)) scale(1.1);
          opacity: 0;
        }
      }
      
      @keyframes starFall {
        0% {
          transform: translateY(-20px) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(calc(100vh + 50px)) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes starRotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
      @keyframes starTwinkle {
        0% {
          opacity: 0.4;
          filter: brightness(0.8);
        }
        100% {
          opacity: 1;
          filter: brightness(1.2);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Events state - now fetched from API
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/events?limit=15');
        const data = await res.json();

        // Transform API data to match card format
        const transformedEvents = (data.events || []).map((event, index) => {
          const startDate = new Date(event.date);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + (event.duration?.includes('day') ? parseInt(event.duration) : 1));

          return {
            id: event.id || index + 1,
            title: event.title,
            img: event.image,
            category: event.category,
            city: event.city,
            venue: event.venue,
            price: event.price,
            isFree: event.isFree,
            start: {
              month: startDate.toLocaleString('en', { month: 'short' }),
              day: startDate.getDate().toString()
            },
            end: {
              month: endDate.toLocaleString('en', { month: 'short' }),
              day: endDate.getDate().toString()
            }
          };
        });

        setEvents(transformedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to empty array on error
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const [page, setPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const perPage = 3;
  const textRef = useRef(null);

  const nextPage = () =>
    setPage((prev) => (prev + 1) % Math.ceil(events.length / perPage));
  const prevPage = () =>
    setPage((prev) =>
      prev === 0 ? Math.ceil(events.length / perPage) - 1 : prev - 1
    );

  useEffect(() => {
    const handleScroll = () => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;

        // Enhanced scroll progress calculation with smoother easing
        if (elementTop < windowHeight && elementTop + elementHeight > 0) {
          const rawProgress = (windowHeight - elementTop) / (windowHeight + elementHeight);
          // Apply easing function for smoother animation
          const easedProgress = Math.max(0, Math.min(1, rawProgress * 1.2 - 0.1));
          const smoothProgress = easedProgress * easedProgress * (3 - 2 * easedProgress); // Smoothstep function

          textRef.current.style.setProperty('--scroll-progress', smoothProgress);
          textRef.current.style.setProperty('--raw-progress', rawProgress);

          // Add subtle scale and rotation effects
          const scale = 1 + (smoothProgress * 0.05);
          const rotation = smoothProgress * 2;
          textRef.current.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-transparent py-20 px-8">
      {/* Top bar */}
      <div className="flex items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-100">
          <FaUsers className="text-amber-700 text-xl mr-3" />
          <span className="uppercase font-semibold tracking-wider text-gray-700 text-sm">
            Community
          </span>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-200 to-transparent ml-6"></div>
      </div>

      {/* Heading */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 max-w-7xl mx-auto gap-6">
        <div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl uppercase font-black tracking-tight text-gray-900 leading-none">
            Upcoming
            <span className="block text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">
              Events
            </span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg font-medium max-w-md">
            Discover amazing community gatherings and cultural experiences
          </p>
        </div>

      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto relative">
        {/* Golden Star Rain Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${-20 + Math.random() * 120}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear'
              }}
            >
              <div
                className="relative"
                style={{
                  animation: `starFall ${4 + Math.random() * 6}s linear infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              >
                {/* Star shape using CSS */}
                <div
                  className="relative bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 opacity-60"
                  style={{
                    width: `${4 + Math.random() * 6}px`,
                    height: `${4 + Math.random() * 6}px`,
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))',
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `starRotate ${2 + Math.random() * 3}s linear infinite, starTwinkle ${1 + Math.random() * 2}s ease-in-out infinite alternate`
                  }}
                />
                {/* Inner glow */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-amber-300 opacity-80"
                  style={{
                    width: `${2 + Math.random() * 3}px`,
                    height: `${2 + Math.random() * 3}px`,
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 relative z-10">
          {events.slice(page * perPage, page * perPage + perPage).map((event, index) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="relative rounded-3xl overflow-hidden shadow-xl group bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Event Image */}
              <div className="relative overflow-hidden">
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-80 object-cover transform transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Dates */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg flex items-center space-x-3 text-gray-800 border border-white/20">
                <div className="text-center">
                  <div className="text-xs uppercase font-bold text-amber-700 tracking-wider">
                    {event.start?.month}
                  </div>
                  <div className="text-xl font-black text-gray-900">{event.start?.day}</div>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-amber-200 to-amber-400"></div>
                <div className="text-center">
                  <div className="text-xs uppercase font-bold text-amber-700 tracking-wider">
                    {event.end?.month}
                  </div>
                  <div className="text-xl font-black text-gray-900">{event.end?.day}</div>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-6">
                <div className="bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between rounded-2xl shadow-lg border border-white/20 group-hover:bg-white transition-all duration-300">
                  <div className="flex-1">
                    <div className="text-xs uppercase font-bold text-amber-700 tracking-wider mb-1">
                      {event.category || 'Event'}
                    </div>
                    <h3 className="text-gray-900 font-black text-lg uppercase leading-tight tracking-wide line-clamp-1">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-100 text-gray-600 p-3 rounded-xl shadow hover:bg-gray-200 transition-all duration-200 transform hover:scale-110"
                        title="Open Source"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    <button className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-3 rounded-xl shadow-lg hover:from-amber-800 hover:to-amber-900 transition-all duration-200 transform hover:scale-110 hover:rotate-12">
                      <TfiArrowTopRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-16 gap-4 max-w-7xl mx-auto">
        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-2">
          <button
            onClick={prevPage}
            className="p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <IoChevronBack size={20} className="text-gray-700" />
          </button>
          <div className="px-6 py-2">
            <span className="text-sm font-semibold text-gray-600">
              {page + 1} of {Math.ceil(events.length / perPage)}
            </span>
          </div>
          <button
            onClick={nextPage}
            className="p-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 text-white hover:from-amber-800 hover:to-amber-900 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <IoChevronForward size={20} />
          </button>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform animate-[scaleIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={selectedEvent.img}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Category Badge */}
              {selectedEvent.category && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wide">
                  {selectedEvent.category}
                </div>
              )}

              {/* Date Badge */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-xs uppercase font-bold text-amber-700">{selectedEvent.start?.month}</div>
                  <div className="text-xl font-black text-gray-900">{selectedEvent.start?.day}</div>
                </div>
                <div className="w-px h-8 bg-amber-300"></div>
                <div className="text-center">
                  <div className="text-xs uppercase font-bold text-amber-700">{selectedEvent.end?.month}</div>
                  <div className="text-xl font-black text-gray-900">{selectedEvent.end?.day}</div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-wide">
                {selectedEvent.title}
              </h2>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                {selectedEvent.city && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Location</div>
                      <div className="font-semibold text-gray-900">{selectedEvent.city}{selectedEvent.venue && ` • ${selectedEvent.venue}`}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Price</div>
                    <div className={`font-bold text-lg ${selectedEvent.isFree ? 'text-green-600' : 'text-gray-900'}`}>
                      {selectedEvent.isFree ? 'Free Entry' : `₹${selectedEvent.price}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {selectedEvent.url && (
                  <a
                    href={selectedEvent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-center hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>Visit Event Page</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uttarakhand Tourism Text Section */}
      <div className="relative py-32 overflow-hidden">
        {/* Infinite Cross Orbs Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Left bottom to right top orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`orb-lb-rt-${i}`}
              className="absolute w-3 h-3 bg-gradient-to-br from-amber-400/60 to-orange-500/40 rounded-full blur-sm"
              style={{
                left: '-20px',
                bottom: '-20px',
                animation: `orbMoveLBRT ${6 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 1.2}s`,
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)'
              }}
            />
          ))}

          {/* Left top to right bottom orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`orb-lt-rb-${i}`}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400/70 to-amber-500/50 rounded-full blur-sm"
              style={{
                left: '-20px',
                top: '-20px',
                animation: `orbMoveLTRB ${5 + i * 0.4}s linear infinite`,
                animationDelay: `${i * 1.0}s`,
                boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)'
              }}
            />
          ))}

          {/* Right bottom to left top orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`orb-rb-lt-${i}`}
              className="absolute w-2.5 h-2.5 bg-gradient-to-br from-orange-400/65 to-red-500/45 rounded-full blur-sm"
              style={{
                right: '-20px',
                bottom: '-20px',
                animation: `orbMoveRBLT ${5.5 + i * 0.6}s linear infinite`,
                animationDelay: `${i * 1.1}s`,
                boxShadow: '0 0 9px rgba(234, 88, 12, 0.4)'
              }}
            />
          ))}

          {/* Right top to left bottom orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`orb-rt-lb-${i}`}
              className="absolute w-2 h-2 bg-gradient-to-br from-amber-300/75 to-yellow-500/55 rounded-full blur-sm"
              style={{
                right: '-20px',
                top: '-20px',
                animation: `orbMoveRTLB ${6.5 + i * 0.3}s linear infinite`,
                animationDelay: `${i * 0.9}s`,
                boxShadow: '0 0 7px rgba(245, 158, 11, 0.5)'
              }}
            />
          ))}

          {/* Additional smaller orbs for density */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`orb-small-lb-rt-${i}`}
              className="absolute w-1 h-1 bg-gradient-to-br from-orange-300/80 to-red-400/60 rounded-full"
              style={{
                left: '-10px',
                bottom: '-10px',
                animation: `orbMoveLBRT ${7 + i * 0.4}s linear infinite`,
                animationDelay: `${i * 1.8}s`,
                boxShadow: '0 0 4px rgba(234, 88, 12, 0.3)'
              }}
            />
          ))}

          {[...Array(4)].map((_, i) => (
            <div
              key={`orb-small-lt-rb-${i}`}
              className="absolute w-1 h-1 bg-gradient-to-br from-amber-300/80 to-yellow-400/60 rounded-full"
              style={{
                left: '-10px',
                top: '-10px',
                animation: `orbMoveLTRB ${6.5 + i * 0.7}s linear infinite`,
                animationDelay: `${i * 1.4}s`,
                boxShadow: '0 0 3px rgba(245, 158, 11, 0.4)'
              }}
            />
          ))}

          {[...Array(4)].map((_, i) => (
            <div
              key={`orb-small-rb-lt-${i}`}
              className="absolute w-1 h-1 bg-gradient-to-br from-red-300/75 to-orange-400/65 rounded-full"
              style={{
                right: '-10px',
                bottom: '-10px',
                animation: `orbMoveRBLT ${7.5 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 1.6}s`,
                boxShadow: '0 0 4px rgba(220, 38, 38, 0.3)'
              }}
            />
          ))}

          {[...Array(4)].map((_, i) => (
            <div
              key={`orb-small-rt-lb-${i}`}
              className="absolute w-1 h-1 bg-gradient-to-br from-yellow-300/85 to-amber-400/65 rounded-full"
              style={{
                right: '-10px',
                top: '-10px',
                animation: `orbMoveRTLB ${6 + i * 0.8}s linear infinite`,
                animationDelay: `${i * 1.3}s`,
                boxShadow: '0 0 3px rgba(251, 191, 36, 0.4)'
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-8">
          <div
            ref={textRef}
            className="text-center relative transition-all duration-500 ease-out"
            style={{
              '--scroll-progress': '0',
              '--raw-progress': '0'
            }}
          >
            {/* Animated background glow */}
            <div
              className="absolute inset-0 -z-10 transition-all duration-700"
              style={{
                background: `radial-gradient(ellipse at center, 
                  rgba(245, 158, 11, ${0.1 * parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0')}) 0%, 
                  rgba(234, 88, 12, ${0.05 * parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0')}) 50%, 
                  transparent 70%
                )`,
                filter: `blur(${20 - (parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') * 10)}px)`,
                transform: `scale(${1 + parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') * 0.3})`
              }}
            />

            <h3
              className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tight leading-none relative"
              style={{
                background: `linear-gradient(135deg, 
                  #fbbf24 0%, 
                  #f59e0b calc(var(--scroll-progress) * 25%), 
                  #ea580c calc(var(--scroll-progress) * 50%), 
                  #dc2626 calc(var(--scroll-progress) * 75%), 
                  #b91c1c calc(var(--scroll-progress) * 100%), 
                  transparent calc(var(--scroll-progress) * 100%), 
                  transparent 100%
                )`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextStroke: '2px #1f2937',
                color: 'transparent',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textShadow: `0 0 ${20 * parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0')}px rgba(245, 158, 11, 0.3)`,
                filter: `drop-shadow(0 ${4 * parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0')}px ${8 * parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0')}px rgba(0, 0, 0, 0.1))`
              }}
            >
              Step into Uttarakhand's living history—where ancient traditions and modern spirit create unforgettable cultural journeys
            </h3>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-0 animate-pulse"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    opacity: parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') * 0.6,
                    animationDelay: `${i * 0.2}s`,
                    transform: `translateY(${-10 * parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0')}px)`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 -z-20">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl transition-all duration-1000"
            style={{
              transform: `scale(${1 + parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') * 0.5}) rotate(${parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') * 45}deg)`
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-orange-200/30 to-red-300/20 rounded-full blur-3xl transition-all duration-1000"
            style={{
              transform: `scale(${1 + parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') * 0.3}) rotate(${-parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') * 30}deg)`
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-yellow-200/40 to-amber-300/30 rounded-full blur-2xl transition-all duration-700"
            style={{
              transform: `translate(-50%, -50%) scale(${0.5 + parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') * 1.5})`
            }}
          />
        </div>

        {/* Animated border lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"
          style={{ opacity: parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') }} />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"
          style={{ opacity: parseFloat(textRef.current?.style.getPropertyValue('--scroll-progress') || '0') }} />
      </div>
    </div>
  );
}

export default CommunityEvents;
