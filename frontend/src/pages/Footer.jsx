import React from "react";
import { 
  Compass, 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Smartphone,
  Apple,
  Heart,
  Sparkles,
  Send,
  Mountain,
  Waves,
  TreePine,
  Camera,
  Users,
  Star,
  Calendar,
  Shield,
  Headphones,
  Globe
} from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { name: "YouTube", icon: <Youtube className="w-5 h-5" />, href: "#" }
  ];

  const indianDestinations = [
    { name: "Rajasthan", icon: <Mountain className="w-4 h-4" /> },
    { name: "Kerala", icon: <Waves className="w-4 h-4" /> },
    { name: "Ladakh", icon: <Mountain className="w-4 h-4" /> },
    { name: "Goa", icon: <Waves className="w-4 h-4" /> },
    { name: "Himachal Pradesh", icon: <TreePine className="w-4 h-4" /> },
    { name: "Rishikesh", icon: <Mountain className="w-4 h-4" /> },
    { name: "Tamil Nadu", icon: <Globe className="w-4 h-4" /> }
  ];

  const services = [
    { name: "AI Trip Planning", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Personalized Itineraries", icon: <Calendar className="w-4 h-4" /> },
    { name: "Budget Optimization", icon: <Star className="w-4 h-4" /> },
    { name: "Local Experiences", icon: <Users className="w-4 h-4" /> },
    { name: "Photography Tours", icon: <Camera className="w-4 h-4" /> },
    { name: "Adventure Planning", icon: <Mountain className="w-4 h-4" /> },
    { name: "24/7 AI Support", icon: <Headphones className="w-4 h-4" /> }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Newsletter Section */}
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
              Get AI-curated travel insights, exclusive destination guides, and personalized recommendations delivered to your inbox
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

      {/* Main Footer Content */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Compass className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  TravelAI
                </h3>
              </div>
              
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                Your intelligent travel companion for exploring incredible India. 
                Discover hidden gems, craft perfect itineraries, and create 
                unforgettable memories with AI-powered recommendations.
              </p>
              
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center group hover:text-amber-400 transition-colors">
                  <MapPin className="w-5 h-5 mr-3 text-orange-400" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex items-center group hover:text-amber-400 transition-colors">
                  <Mail className="w-5 h-5 mr-3 text-orange-400" />
                  <span>hello@travelai.in</span>
                </div>
                <div className="flex items-center group hover:text-amber-400 transition-colors">
                  <Phone className="w-5 h-5 mr-3 text-orange-400" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Indian Destinations */}
            <div>
              <h4 className="text-xl font-bold mb-8 text-amber-400 flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                Incredible India
              </h4>
              <ul className="space-y-4 text-gray-300">
                {indianDestinations.map((destination, index) => (
                  <li key={index}>
                    <a href="#" className="flex items-center gap-3 hover:text-amber-400 transition-colors group">
                      <span className="text-orange-400 group-hover:text-amber-400 transition-colors">
                        {destination.icon}
                      </span>
                      {destination.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Services */}
            <div>
              <h4 className="text-xl font-bold mb-8 text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI-Powered Services
              </h4>
              <ul className="space-y-4 text-gray-300">
                {services.map((service, index) => (
                  <li key={index}>
                    <a href="#" className="flex items-center gap-3 hover:text-amber-400 transition-colors group">
                      <span className="text-orange-400 group-hover:text-amber-400 transition-colors">
                        {service.icon}
                      </span>
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-xl font-bold mb-8 text-amber-400 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Company
              </h4>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  About TravelAI
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  How AI Works
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Travel Blog
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Success Stories
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Travel Partners
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Help Center
                </a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Contact Support
                </a></li>
              </ul>
            </div>
          </div>

          {/* Social Media & Apps */}
          <div className="border-t border-gray-700 mt-16 pt-12">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              
              {/* Social Links */}
              <div className="flex items-center space-x-8">
                <span className="text-gray-400 font-medium">Connect with us:</span>
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

              {/* App Downloads */}
              <div className="flex items-center space-x-6">
                <span className="text-gray-400 font-medium">Get the app:</span>
                <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 border border-gray-700 hover:border-gray-600">
                  <Apple className="w-5 h-5 text-gray-300" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-semibold text-white">App Store</div>
                  </div>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 border border-gray-700 hover:border-gray-600">
                  <Smartphone className="w-5 h-5 text-gray-300" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-sm font-semibold text-white">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-gray-400">
              
              {/* Copyright & Credit */}
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  © 2025 TravelAI. All rights reserved.
                </p>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-lg border border-gray-600">
                  <span>Handcrafted by</span>
                  <span className="text-amber-400 font-semibold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                   Dikshant
                  </span>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex items-center space-x-8">
                <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  Terms of Service
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}