import React from "react";
import { Link, useLocation } from "react-router-dom";
import { preloadRoute } from "../utils/preloadRoutes";
import {
  Compass,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Youtube,
  Heart,
  Sparkles,
  Send,
  Map,
  MessageSquare,
  Calendar,
  User,
  Home,
  Plane,
  Hotel,
  Globe,
  Shield
} from "lucide-react";

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const socialLinks = [
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { name: "YouTube", icon: <Youtube className="w-5 h-5" />, href: "#" }
  ];

  const quickLinks = [
    { name: "Home", icon: <Home className="w-4 h-4" />, path: "/" },
    { name: "Explore Map", icon: <Map className="w-4 h-4" />, path: "/map" },
    { name: "AI Travel Buddy", icon: <MessageSquare className="w-4 h-4" />, path: "/chat" },
    { name: "Plan Itinerary", icon: <Calendar className="w-4 h-4" />, path: "/itinerary" },
    { name: "My Profile", icon: <User className="w-4 h-4" />, path: "/profile" }
  ];

  const travelLinks = [
    { name: "Search Flights", icon: <Plane className="w-4 h-4" />, path: "/flights" },
    { name: "Find Hotels", icon: <Hotel className="w-4 h-4" />, path: "/hotels" },
    { name: "Destinations", icon: <Globe className="w-4 h-4" />, path: "/destinations" },
    { name: "Activities", icon: <Sparkles className="w-4 h-4" />, path: "/activities" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Newsletter Section - Only show on home page */}
      {isHomePage && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Send className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">
                Never Miss Your Next Adventure
              </h3>
              <p className="text-orange-100 mb-8 max-w-2xl mx-auto text-lg">
                Get AI-curated travel insights, exclusive destination guides, and personalized recommendations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/95 backdrop-blur-sm"
                  />
                </div>
                <button className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Compass className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  DeepShiva
                </h3>
              </div>

              <p className="text-gray-400 mb-6 leading-relaxed">
                Your intelligent travel companion for exploring incredible India.
                Discover hidden gems and create unforgettable memories with AI-powered recommendations.
              </p>

              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>India</span>
                </div>
                <div className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>support@deepshiva.travel</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-amber-400 flex items-center gap-2">
                <Compass className="w-5 h-5" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors group"
                      onMouseEnter={() => preloadRoute(link.path)}
                    >
                      <span className="text-orange-400 group-hover:text-amber-400 transition-colors">
                        {link.icon}
                      </span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travel Services */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-amber-400 flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Travel Services
              </h4>
              <ul className="space-y-3">
                {travelLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors group"
                      onMouseEnter={() => preloadRoute(link.path)}
                    >
                      <span className="text-orange-400 group-hover:text-amber-400 transition-colors">
                        {link.icon}
                      </span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-amber-400 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Connect With Us
              </h4>
              <div className="flex gap-3 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 rounded-xl transition-all duration-300 transform hover:scale-110 group"
                    title={social.name}
                  >
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
              <p className="text-gray-500 text-sm">
                Follow us for travel inspiration, tips, and exclusive deals!
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">

              {/* Copyright & Credit */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  © 2025 DeepShiva. All rights reserved.
                </p>
                <div className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-lg border border-gray-700">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Made with love by</span>
                  <span className="font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Team DDRS
                  </span>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}