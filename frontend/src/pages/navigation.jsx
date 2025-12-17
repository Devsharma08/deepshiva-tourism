import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "../contexts/NavigationContext";
import { preloadRoute } from "../utils/preloadRoutes";
import { Map, MessageSquare, Calendar, Plane, Home, Compass } from "lucide-react";

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();
  const { user, userProfile, isAuthenticated } = useAuth();
  const { navigateTo } = useNavigation();

  // Navigation links - only relevant ones
  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Explore Map", path: "/map", icon: Map },
    { name: "AI Travel Buddy", path: "/chat", icon: MessageSquare },
    { name: "Plan Itinerary", path: "/itinerary", icon: Calendar },
    { name: "Book Travel", path: "/booking", icon: Plane },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle navigation with animation - now uses navigateTo directly
  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigateTo(path);
  };

  // Check if link is active
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Generate avatar URL
  const avatarUrl = userProfile?.avatar_url ||
    (user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.display_name || user.email}` : null);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        {/* Main navigation */}
        <nav
          className={`flex items-center justify-between px-6 py-3 transition-all duration-500 ${scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5"
            : "bg-gray-900/30 backdrop-blur-md"
            }`}
        >
          {/* Left section - Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden text-xl p-2 rounded-xl transition-all duration-300 ${scrolled
                ? "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                : "text-white hover:bg-white/10"
                }`}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              onClick={(e) => handleNavClick(e, "/")}
              className="flex items-center gap-3 group"
            >
              <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${scrolled
                ? "bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25"
                : "bg-white/20 backdrop-blur-sm"
                }`}>
                <Compass className={`w-5 h-5 transition-transform duration-500 group-hover:rotate-45 ${scrolled ? "text-white" : "text-white"
                  }`} />
              </div>
              <span className={`text-xl font-bold tracking-tight transition-all duration-300 ${scrolled
                ? "bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
                : "text-white"
                }`}>
                DeepShiva
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    setHoveredLink(link.path);
                    preloadRoute(link.path);
                  }}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative px-4 py-2.5 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 flex items-center gap-2 group ${active
                    ? scrolled
                      ? "text-orange-600 bg-orange-50"
                      : "text-white bg-white/20"
                    : scrolled
                      ? "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <Icon className={`w-4 h-4 transition-all duration-300 ${hoveredLink === link.path ? "scale-110" : ""
                    } ${active ? "animate-pulse" : ""}`} />
                  <span>{link.name}</span>

                  {/* Active indicator */}
                  {active && (
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${scrolled ? "bg-orange-500" : "bg-white"
                      }`} />
                  )}

                  {/* Hover underline effect */}
                  <span className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-all duration-300 origin-left ${hoveredLink === link.path && !active
                    ? scrolled
                      ? "bg-orange-400 scale-x-100"
                      : "bg-white/60 scale-x-100"
                    : "scale-x-0"
                    }`} />
                </a>
              );
            })}
          </div>

          {/* Right section - Profile */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <a
                href="/profile"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => preloadRoute('/profile')}
                className="relative group"
              >
                <div className={`absolute -inset-1 rounded-full transition-all duration-300 ${scrolled
                  ? "bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100"
                  : "bg-white/20 opacity-0 group-hover:opacity-100"
                  } blur-sm`} />
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className={`relative w-10 h-10 rounded-full object-cover transition-all duration-300 group-hover:scale-105 ${scrolled
                    ? "border-2 border-orange-200 group-hover:border-orange-400 shadow-md"
                    : "border-2 border-white/30 group-hover:border-white/60"
                    }`}
                />
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </a>
            ) : (
              <a
                href="/auth"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => preloadRoute('/auth')}
                className={`relative overflow-hidden px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 group ${scrolled
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
              >
                <span className="relative z-10">Sign In</span>
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </a>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-x-0 top-[60px] transition-all duration-500 ease-out ${mobileMenuOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
          }`}>
          <div className="bg-white/95 backdrop-blur-xl shadow-xl mx-4 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 space-y-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${active
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    style={{
                      animationDelay: `${index * 75}ms`,
                      animation: mobileMenuOpen ? `slideInLeft 0.4s ease-out ${index * 75}ms both` : 'none'
                    }}
                  >
                    <div className={`p-2 rounded-lg ${active ? "bg-white/20" : "bg-orange-100"
                      }`}>
                      <Icon className={`w-5 h-5 ${active ? "text-white" : "text-orange-600"}`} />
                    </div>
                    <span>{link.name}</span>
                    {active && (
                      <span className="ml-auto">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Mobile menu footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                AI-Powered Travel Intelligence
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Global styles for animations */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default Navigation;
