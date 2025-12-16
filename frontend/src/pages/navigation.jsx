import React, { useState, useEffect } from "react";
import { FiAlignLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { preloadRoute } from "../utils/preloadRoutes";

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate avatar URL
  const avatarUrl = userProfile?.avatar_url ||
    (user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.display_name || user.email}` : null);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Main navigation */}
      <nav
        className={`flex items-center justify-between px-6 py-3 text-sm font-Archivo transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-gray-900/20 backdrop-blur-md"
          }`}
      >
        {/* Left menu items */}
        <div className="flex items-center gap-6">
          {/* Hamburger Icon */}
          <button className={`text-xl hover:text-amber-700 ${scrolled ? "text-gray-700" : "text-white"
            }`}>
            <FiAlignLeft />
          </button>

          {/* Logo */}
          <Link to="/" className="w-20 h-10">
            <img
              src="/icon.png"
              className="w-full h-full object-contain"
              alt="logo"
            />
          </Link>

          {/* Links */}
          <div
            className={`flex gap-6 font-medium tracking-widest ${scrolled ? "text-gray-700" : "text-white"
              }`}
          >
            <a href="#destinations" className="hover:text-amber-700">
              Destinations
            </a>
            <a href="#features" className="hover:text-amber-700">
              AI Features
            </a>
            <a href="#activities" className="hover:text-amber-700">
              Activities
            </a>
            <Link to={'/booking'} className="hover:text-amber-700" onMouseEnter={() => preloadRoute('/booking')}>
              Accommodation and Flight
            </Link>
            <a href="#plan-trip" className="hover:text-amber-700">
              Plan Your Trip
            </a>
          </div>
        </div>

        {/* Right-side - Profile */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/profile')}
              onMouseEnter={() => preloadRoute('/profile')}
              className="flex items-center gap-2 group"
            >
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-orange-200 hover:border-orange-400 transition-all shadow-md hover:shadow-lg object-cover"
              />
            </button>
          ) : (
            <Link
              to="/auth"
              className={`px-4 py-2 rounded-full font-medium transition-all ${scrolled
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              onMouseEnter={() => preloadRoute('/auth')}
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
