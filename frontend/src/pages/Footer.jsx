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
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
    </footer>
  );
}