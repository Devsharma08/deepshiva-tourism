import React, { useState, useEffect } from "react";
import { FiAlignLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

function Navigation() {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Main navigation */}
      <nav
        className={`flex items-center justify-between px-6 py-3 text-sm font-Archivo transition-all duration-300 ${
          scrolled 
            ? "bg-white/90 backdrop-blur-md shadow-md" 
            : "bg-gray-900/20 backdrop-blur-md"
        }`}
      >
        {/* Left menu items */}
        <div className="flex items-center gap-6">
          {/* Hamburger Icon */}
          <button className={`text-xl hover:text-amber-700 ${
            scrolled ? "text-gray-700" : "text-white"
          }`}>
            <FiAlignLeft />
          </button>

          {/* Logo */}
          <div className="w-20 h-10">
            <img
              src="/icon.png"
              className="w-full h-full object-contain"
              alt="logo"
            />
          </div>

          {/* Links */}
          <div
            className={`flex gap-6 font-medium tracking-widest ${
              scrolled ? "text-gray-700" : "text-white"
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
            <Link to={'/booking'} className="hover:text-amber-700">
              Accommodation and Flight
            </Link>
            <a href="#plan-trip" className="hover:text-amber-700">
              Plan Your Trip
            </a>
          </div>
        </div>

        {/* Right-side icons */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
