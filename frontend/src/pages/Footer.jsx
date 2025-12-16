import React from "react";
import { Link } from "react-router-dom";
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
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/25">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                DeepShiva
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your AI-powered travel companion for discovering incredible India.
              Explore hidden gems, plan perfect itineraries, and create unforgettable memories.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="group p-2.5 bg-white/5 hover:bg-gradient-to-br hover:from-orange-500 hover:to-amber-500 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/25"
                  aria-label={social.name}
                >
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  >
                    <span className="p-1.5 bg-white/5 group-hover:bg-orange-500/20 rounded-lg transition-colors">
                      {link.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-400" />
              Travel Services
            </h3>
            <ul className="space-y-3">
              {travelLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  >
                    <span className="p-1.5 bg-white/5 group-hover:bg-orange-500/20 rounded-lg transition-colors">
                      {link.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-400" />
              Stay Connected
            </h3>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to get travel tips and exclusive offers!
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
                <button className="p-2.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:hello@deepshiva.com" className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@deepshiva.com</span>
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 123 456 7890</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>© 2024 DeepShiva Tourism.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> in India
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-orange-400 transition-colors flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-orange-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-orange-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}