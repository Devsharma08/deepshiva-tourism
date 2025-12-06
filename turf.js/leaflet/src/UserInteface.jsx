import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  LayersControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  point as turfPoint,
  polygon as turfPolygon,
  booleanPointInPolygon,
  distance as turfDistance,
} from "@turf/turf";

// --- CONSTANTS ---
const MAP_CENTER = [28.7041, 77.1025];
const MAP_ZOOM = 14;
const YOUR_START_LOCATION = [28.7041, 77.1025];
const OSRM_API_URL = 'https://router.project-osrm.org/route/v1/driving';

// --- MOCK DATA ---
const MOCK_PROFILE = {
  name: 'Rohan Sharma',
  phone: '+91 98XXXXXX99',
  trekPermit: 'TK-405-A',
  groupSize: 2,
  emergencyContact: '+91 99XXXXXX88',
  bloodGroup: 'O+',
};

const MOCK_DANGER_ZONES = [
  {
    id: 'dz-1',
    name: 'Construction Zone',
    coords: [
      [28.708, 77.105], [28.709, 77.108], [28.706, 77.110], [28.703, 77.107],
    ],
    turfCoords: [[
      [77.105, 28.708], [77.108, 28.709], [77.110, 28.706], [77.107, 28.703], [77.105, 28.708],
    ]],
    severity: 'high',
    description: 'Active construction site with heavy machinery.',
  },
];

// Static POI data - won't change on re-renders
const STATIC_POIS = [
  { id: 1, name: 'Delhi Central Mall', coords: [28.7061, 77.1070], type: 'supermarket', icon: '🏪' },
  { id: 2, name: 'Spice Restaurant', coords: [28.7050, 77.1030], type: 'restaurant', icon: '🍽️' },
  { id: 3, name: 'Metro Supermarket', coords: [28.7020, 77.1000], type: 'supermarket', icon: '🏪' },
  { id: 4, name: 'City Police Station', coords: [28.7080, 77.1050], type: 'police', icon: '🚓' },
  { id: 5, name: 'Central Park', coords: [28.7000, 77.1080], type: 'park', icon: '🌳' },
  { id: 6, name: 'Star Cafe', coords: [28.7030, 77.1040], type: 'cafe', icon: '☕' },
  { id: 7, name: 'Medicare Hospital', coords: [28.7070, 77.1020], type: 'hospital', icon: '🏥' },
  { id: 8, name: 'Quick Pharmacy', coords: [28.7045, 77.1060], type: 'pharmacy', icon: '💊' },
];

// --- CUSTOM HOOKS ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- ICON CREATION ---
const createUserIcon = () => L.divIcon({
  html: `<div class="user-location-pulse"></div><div class="user-location-dot"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const createPoiIcon = (type, customIcon = '📍') => {
  const icons = {
    hotel: '🏨', 
    shop: '🛍️', 
    police: '🚓', 
    restaurant: '🍽️', 
    washroom: '🚻', 
    park: '🌳', 
    hospital: '🏥', 
    pharmacy: '💊',
    supermarket: '🏪',
    cafe: '☕',
    bank: '🏦',
    atm: '💳',
    unknown: '📍'
  };
  const colors = {
    hotel: '#0077b6', 
    shop: '#00b4d8', 
    police: '#e63946', 
    restaurant: '#f3722c', 
    washroom: '#7f8c8d', 
    park: '#27ae60', 
    hospital: '#e74c3c', 
    pharmacy: '#9b59b6',
    supermarket: '#f39c12',
    cafe: '#d35400',
    bank: '#16a085',
    atm: '#2980b9',
    unknown: '#777'
  };
  
  return L.divIcon({
    html: `<div class="poi-icon" style="background-color: ${colors[type] || '#777'}">
      ${customIcon || icons[type] || '📍'}
    </div>`,
    className: 'poi-icon-container',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const createRouteIcon = (type = 'start') => {
  const icons = {
    start: '📍',
    end: '🎯',
    via: '⚡'
  };
  
  const colors = {
    start: '#10b981',
    end: '#ef4444',
    via: '#3b82f6'
  };
  
  return L.divIcon({
    html: `<div class="route-marker" style="background-color: ${colors[type]}">
      ${icons[type]}
    </div>`,
    className: 'route-marker-container',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

// --- STYLES COMPONENT ---
function GlobalStyles() {
  return (
    <style>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      .dashboard-layout {
        display: grid;
        grid-template-rows: 1fr auto;
        height: 100vh;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #f8fafc;
      }
      
      .map-section {
        position: relative;
        height: 60vh;
        background: #e2e8f0;
      }
      
      .info-section {
        height: 40vh;
        background: white;
        border-top: 1px solid #e2e8f0;
        overflow-y: auto;
      }
      
      .info-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        padding: 1.5rem;
        height: 100%;
      }
      
      .leaflet-container { 
        height: 100%; 
        width: 100%; 
        font-family: inherit;
      }
      
      .widget {
        background: white;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .widget-header {
        padding: 1.25rem 1.5rem;
        font-size: 1.125rem;
        font-weight: 600;
        border-bottom: 1px solid #f1f5f9;
        color: #1e293b;
        display: flex;
        align-items: center;
        justify-content: between;
      }
      
      .widget-content { 
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
      }
      
      .search-container {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 1000;
        background: white;
        padding: 0.75rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        display: flex;
        gap: 0.5rem;
        align-items: center;
        min-width: 300px;
      }
      
      .search-input {
        flex: 1;
        padding: 0.5rem 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.875rem;
        background: #f8fafc;
        transition: all 0.2s ease;
      }
      
      .search-input:focus {
        outline: none;
        border-color: #3b82f6;
        background: white;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
      }
      
      .search-button {
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      
      .search-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
      
      .sos-button-container {
        position: absolute; 
        bottom: 2rem; 
        left: 50%;
        transform: translateX(-50%); 
        z-index: 1000;
      }
      
      .sos-button {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white; 
        border: none; 
        border-radius: 50%;
        width: 80px; 
        height: 80px; 
        font-size: 1.25rem; 
        font-weight: 700;
        cursor: pointer; 
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        animation: pulse-red 2s infinite; 
        border: 4px solid rgba(255,255,255,0.9);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .sos-button:hover {
        transform: translateX(-50%) scale(1.1);
        box-shadow: 0 12px 30px rgba(239, 68, 68, 0.6);
      }
      
      @keyframes pulse-red {
        0% { box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4); }
        50% { box-shadow: 0 8px 35px rgba(239, 68, 68, 0.8); }
        100% { box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4); }
      }
      
      .user-location-dot {
        width: 20px; 
        height: 20px; 
        background: #3b82f6; 
        border-radius: 50%;
        border: 3px solid white; 
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
      }
      
      .user-location-pulse {
        width: 20px; 
        height: 20px; 
        border-radius: 50%; 
        background: #3b82f6;
        opacity: 0.4; 
        animation: pulse-blue 2s infinite; 
        position: absolute;
      }
      
      @keyframes pulse-blue {
        0% { transform: scale(1); opacity: 0.4; }
        100% { transform: scale(3); opacity: 0; }
      }
      
      .services-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .service-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      
      .service-item:hover {
        background: #f1f5f9;
        transform: translateX(4px);
      }
      
      .service-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        min-width: 0;
      }
      
      .service-icon { 
        font-size: 1.5rem; 
        flex-shrink: 0;
      }
      
      .service-details {
        flex: 1;
        min-width: 0;
      }
      
      .service-name {
        font-weight: 600;
        font-size: 0.95rem;
        color: #1e293b;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .service-distance {
        font-size: 0.875rem;
        color: #64748b;
      }
      
      .directions-button {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        white-space: nowrap;
      }
      
      .directions-button:hover { 
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        font-size: 0.9rem;
        color: #64748b;
      }
      
      .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid #f1f5f9;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 0.75rem;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .directions-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      
      .directions-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e293b;
      }
      
      .directions-summary {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      
      .directions-stats {
        display: flex;
        justify-content: space-around;
        font-size: 1.125rem;
        font-weight: 600;
      }
      
      .directions-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 200px;
        overflow-y: auto;
      }
      
      .direction-step {
        padding: 1rem;
        border-bottom: 1px solid #f1f5f9;
        font-size: 0.9rem;
        line-height: 1.5;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
      }
      
      .direction-step:last-child {
        border-bottom: none;
      }
      
      .step-icon {
        font-size: 1rem;
        margin-top: 0.125rem;
        flex-shrink: 0;
      }
      
      .step-content {
        flex: 1;
      }
      
      .step-distance {
        color: #64748b;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      
      .clear-route-button {
        background: none;
        border: 1px solid #e2e8f0;
        color: #64748b;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s ease;
      }
      
      .clear-route-button:hover {
        background: #f8fafc;
        color: #475569;
      }
      
      .route-marker-container {
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      
      .route-marker {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
      }
      
      .risk-card {
        background: linear-gradient(135deg, #fff3cd, #ffeaa7);
        border: 1px solid #ffecb5;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
      }
      
      .risk-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }
      
      .risk-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: #856404;
      }
      
      .risk-percentage {
        font-size: 1.5rem;
        font-weight: 700;
        color: #e74c3c;
        text-align: center;
        margin: 0.5rem 0;
      }
      
      .risk-suggestion {
        background: white;
        padding: 0.75rem;
        border-radius: 8px;
        border-left: 4px solid #3498db;
        font-size: 0.875rem;
        line-height: 1.4;
      }
      
      .weather-grid {
        display: grid;
        gap: 1rem;
      }
      
      .weather-item {
        display: grid;
        grid-template-columns: 60px 1fr auto;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
      }
      
      .weather-day { 
        font-weight: 600; 
        color: #1e293b;
      }
      
      .weather-icon { 
        font-size: 1.75rem; 
        text-align: center;
      }
      
      .weather-desc { 
        color: #64748b; 
        font-size: 0.875rem;
      }
      
      .weather-temp { 
        font-weight: 600; 
        text-align: right;
        color: #1e293b;
      }
      
      .weather-temp .low { 
        color: #64748b; 
        margin-left: 0.25rem;
      }
      
      .hourly-forecast {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
      }
      
      .hourly-item {
        flex: 1;
        text-align: center;
        padding: 0.75rem 0.5rem;
        background: #f8fafc;
        border-radius: 8px;
      }
      
      .hourly-time { 
        font-weight: 600; 
        color: #475569; 
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }
      
      .hourly-icon { 
        font-size: 1.5rem; 
        margin: 0.5rem 0;
      }
      
      .hourly-temp { 
        font-weight: 700; 
        color: #1e293b;
      }
      
      .tabs-container {
        display: flex;
        border-bottom: 1px solid #e2e8f0;
        margin: -1.5rem -1.5rem 1.5rem -1.5rem;
        padding: 0 1.5rem;
        background: #f8fafc;
      }
      
      .tab {
        padding: 1rem 1.25rem;
        margin-bottom: -1px;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 500;
        color: #64748b;
        transition: all 0.2s ease;
        position: relative;
      }
      
      .tab.active {
        color: #3b82f6;
        border-bottom-color: #3b82f6;
        background: white;
      }
      
      .click-hint {
        position: absolute;
        bottom: 7rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 1000;
        animation: fadeInOut 3s ease-in-out;
      }
      
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      
      .modal-backdrop {
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%;
        background: rgba(0,0,0,0.6); 
        z-index: 3000; 
        display: flex;
        align-items: center; 
        justify-content: center;
        padding: 1rem;
        backdrop-filter: blur(4px);
      }
      
      .modal-content {
        background: white; 
        border-radius: 16px; 
        padding: 2rem;
        width: 100%; 
        max-width: 480px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        animation: modal-appear 0.3s ease-out;
      }
      
      @keyframes modal-appear {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>
  );
}

// --- MAP COMPONENTS ---
function UserMovement({ setUserPos, setDangerAlert }) {
  const map = useMap();
  const turfZonesRef = useRef(
    MOCK_DANGER_ZONES.map(zone => ({
      ...zone,
      polygon: turfPolygon(zone.turfCoords),
    }))
  );
  const userMarkerRef = useRef(null);
  const lastPositionRef = useRef(YOUR_START_LOCATION);

  useEffect(() => {
    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(YOUR_START_LOCATION, {
        icon: createUserIcon(),
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup('<b>Your Current Location</b><br/>Real-time tracking active.');
    }

    const interval = setInterval(() => {
      const moveDistance = 0.00001; // Very minimal movement
      const angle = Math.random() * Math.PI * 2;
      
      const newPos = [
        lastPositionRef.current[0] + Math.cos(angle) * moveDistance,
        lastPositionRef.current[1] + Math.sin(angle) * moveDistance,
      ];
      
      lastPositionRef.current = newPos;
      
      userMarkerRef.current.setLatLng(newPos);
      setUserPos(newPos);

      const userPoint = turfPoint([newPos[1], newPos[0]]);
      let inDanger = false;
      for (const zone of turfZonesRef.current) {
        if (booleanPointInPolygon(userPoint, zone.polygon)) {
          setDangerAlert(zone);
          inDanger = true;
          break;
        }
      }
    }, 10000); // Very infrequent updates (10 seconds)

    return () => clearInterval(interval);
  }, [map, setUserPos, setDangerAlert]);

  return null;
}

function DirectionsPolyline({ routeGeometry, isSelected = true }) {
  if (!routeGeometry) return null;
  
  const leafletPath = routeGeometry.coordinates.map(coord => [coord[1], coord[0]]);
  
  return (
    <Polyline
      positions={leafletPath}
      pathOptions={{
        color: isSelected ? '#3b82f6' : '#94a3b8', 
        weight: isSelected ? 6 : 4,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: isSelected ? null : '5, 5',
      }}
    />
  );
}

function MapController({ route, userPos, searchResult }) {
  const map = useMap();
  
  useEffect(() => {
    if (route && route.geometry) {
      const bounds = L.geoJSON(route.geometry).getBounds();
      map.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 2,
        easeLinearity: 0.25
      });
    } else if (searchResult) {
      map.flyTo(searchResult, 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [route, userPos, searchResult, map]);
  
  return null;
}

// --- RISK DETECTION CARD ---
function RiskDetectionCard({ userPos, weatherData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateRisk = useCallback(() => {
    let riskScore = 0;
    
    // Calculate distance to danger zones
    MOCK_DANGER_ZONES.forEach(zone => {
      const userPoint = turfPoint([userPos[1], userPos[0]]);
      const zoneCenter = turfPoint([
        (zone.turfCoords[0][0][0] + zone.turfCoords[0][2][0]) / 2,
        (zone.turfCoords[0][0][1] + zone.turfCoords[0][2][1]) / 2
      ]);
      const distance = turfDistance(userPoint, zoneCenter, { units: 'kilometers' });
      
      if (distance < 0.5) riskScore += 40;
      else if (distance < 1) riskScore += 20;
    });
    
    // Time factor
    const hour = new Date().getHours();
    if (hour < 6 || hour > 20) riskScore += 25;
    
    return {
      percentage: Math.min(riskScore, 95),
      suggestion: riskScore > 50 
        ? "High risk area detected. Stay alert and avoid danger zones."
        : riskScore > 25
        ? "Moderate risk. Be cautious of nearby danger zones."
        : "Low risk area. Continue with normal precautions."
    };
  }, [userPos]);

  const riskData = calculateRisk();

  return (
    <div className="risk-card">
      <div className="risk-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="risk-title">
          <span>⚠️</span>
          Safety Risk Assessment
        </div>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </div>
      
      <div className="risk-percentage">
        {riskData.percentage}% Risk
      </div>
      
      {isExpanded && (
        <div className="risk-suggestion">
          {riskData.suggestion}
        </div>
      )}
    </div>
  );
}

// --- WEATHER WIDGET ---
function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hourly');

  useEffect(() => {
    const fetchWeather = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWeather = {
        hourly: Array.from({ length: 5 }, (_, i) => ({
          time: new Date(Date.now() + i * 3600000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            hour12: true 
          }),
          temp: Math.floor(Math.random() * 10) + 28,
          icon: ['☀️', '🌤️', '🌥️', '☁️', '🌦️'][i % 5],
        })),
        daily: Array.from({ length: 3 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 1);
          return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            icon: ['☀️', '🌤️', '🌦️'][i % 3],
            desc: ['Clear', 'Partly Cloudy', 'Light Rain'][i % 3],
            high: Math.floor(Math.random() * 10) + 32,
            low: Math.floor(Math.random() * 10) + 25,
          };
        }),
      };
      
      setWeatherData(mockWeather);
      setIsLoading(false);
    };
    
    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <div className="widget">
        <div className="widget-header">Weather Forecast</div>
        <div className="widget-content">
          <div className="loading-spinner">
            <div className="spinner"></div>Loading weather...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget">
      <div className="widget-header">Weather Forecast</div>
      <div className="widget-content">
        <div className="tabs-container">
          <div 
            className={`tab ${activeTab === 'hourly' ? 'active' : ''}`}
            onClick={() => setActiveTab('hourly')}
          >
            Next 5 Hours
          </div>
          <div 
            className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            3-Day Forecast
          </div>
        </div>
        
        {activeTab === 'hourly' && (
          <div className="hourly-forecast">
            {weatherData.hourly.map((hour, index) => (
              <div key={index} className="hourly-item">
                <div className="hourly-time">{hour.time}</div>
                <div className="hourly-icon">{hour.icon}</div>
                <div className="hourly-temp">{hour.temp}°</div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'daily' && (
          <div className="weather-grid">
            {weatherData.daily.map((day, index) => (
              <div key={index} className="weather-item">
                <div className="weather-day">{day.day}</div>
                <div className="weather-icon">{day.icon}</div>
                <div className="weather-desc">{day.desc}</div>
                <div className="weather-temp">
                  {day.high}°<span className="low">/{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- SERVICES WIDGET ---
function ServicesWidget({ userPos, onGetDirections }) {
  // Calculate distances once and keep them stable
  const nearbyPOIs = useMemo(() => {
    return STATIC_POIS.map(poi => ({
      ...poi,
      distance: turfDistance(
        turfPoint([userPos[1], userPos[0]]),
        turfPoint([poi.coords[1], poi.coords[0]]),
        { units: 'kilometers' }
      )
    })).sort((a, b) => a.distance - b.distance).slice(0, 2); // Only show 2 results
  }, [userPos]);

  const categorizedServices = useMemo(() => {
    const categories = {
      shops: { title: '🛍️ Nearby Services', items: [] }
    };

    nearbyPOIs.forEach(poi => {
      categories.shops.items.push(poi);
    });

    return Object.values(categories).filter(category => category.items.length > 0);
  }, [nearbyPOIs]);

  return (
    <div className="widget">
      <div className="widget-header">Nearby Services</div>
      <div className="widget-content">
        {categorizedServices.map(category => (
          <div key={category.title} className="services-section">
            <div className="services-list">
              {category.items.map(poi => (
                <div key={poi.id} className="service-item">
                  <div className="service-info">
                    <span className="service-icon">{poi.icon}</span>
                    <div className="service-details">
                      <div className="service-name">{poi.name}</div>
                      <div className="service-distance">
                        {poi.distance.toFixed(1)} km away
                      </div>
                    </div>
                  </div>
                  <button 
                    className="directions-button"
                    onClick={() => onGetDirections(poi.coords, poi.name)}
                  >
                    Directions
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- DIRECTIONS WIDGET ---
function DirectionsWidget({ route, onClear }) {
  if (!route) return null;

  const { distance, duration, legs } = route;
  const steps = legs[0].steps;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDistance = (meters) => {
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <div className="directions-header">
          <span className="directions-title">Route Directions</span>
          <button className="clear-route-button" onClick={onClear}>
            Clear Route
          </button>
        </div>
      </div>
      <div className="widget-content">
        <div className="directions-summary">
          <div className="directions-stats">
            <div>{formatDistance(distance)}</div>
            <div>{formatDuration(duration)}</div>
          </div>
        </div>
        <ol className="directions-list">
          {steps.map((step, index) => (
            <li key={index} className="direction-step">
              <span className="step-icon">📍</span>
              <div className="step-content">
                {step.maneuver.instruction}
                <div className="step-distance">
                  {formatDistance(step.distance)}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD COMPONENT ---
export default function TouristDashboard() {
  const [onlineUsers, setOnlineUsers] = useState(142);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(null);
  const [userPos, setUserPos] = useState(YOUR_START_LOCATION);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [isRouting, setIsRouting] = useState(false);
  const [destination, setDestination] = useState(null);
  const [showClickHint, setShowClickHint] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  
  const mapRef = useRef();

  // Simulate online user count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(users => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(120, users + change);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      const mockWeather = {
        hourly: Array.from({ length: 5 }, (_, i) => ({
          temp: Math.floor(Math.random() * 10) + 28,
        }))
      };
      setWeatherData(mockWeather);
    };
    fetchWeather();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Simple search implementation - can be enhanced with geocoding API
    const foundPOI = STATIC_POIS.find(poi => 
      poi.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundPOI) {
      setSearchResult(foundPOI.coords);
    } else {
      // If no local POI found, simulate searching at a nearby location
      const randomOffset = () => (Math.random() - 0.5) * 0.01;
      const newCoords = [userPos[0] + randomOffset(), userPos[1] + randomOffset()];
      setSearchResult(newCoords);
    }
  };

  const handleGetDirections = async (coords, name) => {
    if (isRouting) return;
    
    setIsRouting(true);
    setRoutes([]);
    setDestination({ coords, name });
    
    try {
      // Use actual OSRM API
      const [startLng, startLat] = [userPos[1], userPos[0]];
      const [endLng, endLat] = [coords[1], coords[0]];
      
      const response = await fetch(
        `${OSRM_API_URL}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`
      );
      
      if (!response.ok) throw new Error('OSRM API failed');
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRoutes([route]);
        setSelectedRoute(0);
        setShowClickHint(true);
        setTimeout(() => setShowClickHint(false), 3000);
      } else {
        throw new Error('No route found');
      }
      
    } catch (error) {
      console.error("OSRM Error:", error);
      // Fallback to mock route
      const mockRoute = {
        distance: turfDistance(
          turfPoint([userPos[1], userPos[0]]),
          turfPoint([coords[1], coords[0]]),
          { units: 'meters' }
        ),
        duration: 1800,
        geometry: {
          type: "LineString",
          coordinates: [
            [userPos[1], userPos[0]],
            [coords[1] - 0.001, coords[0] + 0.001],
            [coords[1], coords[0]]
          ]
        },
        legs: [{
          steps: [
            {
              distance: 500,
              maneuver: { instruction: "Head northeast on Main Road" }
            },
            {
              distance: 800,
              maneuver: { instruction: "Turn right at the intersection" }
            },
            {
              distance: 600,
              maneuver: { instruction: "Arrive at your destination" }
            }
          ]
        }]
      };
      
      setRoutes([mockRoute]);
      setSelectedRoute(0);
    } finally {
      setIsRouting(false);
    }
  };

  const handleClearRoute = () => {
    setRoutes([]);
    setDestination(null);
    setSelectedRoute(0);
    setSearchResult(null);
    setSearchQuery('');
  };

  const sendSOS = useCallback(() => {
    console.log("SOS Signal Sent!", { location: userPos });
    alert("🚨 SOS Signal Sent to Emergency Services!");
    setSosModalOpen(false);
  }, [userPos]);

  const currentRoute = routes[selectedRoute];

  return (
    <div className="dashboard-layout">
      <GlobalStyles />

      {/* MAP SECTION */}
      <div className="map-section">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          maxZoom={22}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <LayersControl position="topleft">
            <LayersControl.BaseLayer checked name="🗺️ Street Map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="🛰️ Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles © Esri"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          
          <UserMovement 
            setUserPos={setUserPos} 
            setDangerAlert={setDangerAlert} 
          />
          
          <MapController route={currentRoute} userPos={userPos} searchResult={searchResult} />
          
          {/* Danger Zones */}
          {MOCK_DANGER_ZONES.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coords}
              pathOptions={{
                color: zone.severity === 'high' ? '#ef4444' : '#f59e0b',
                fillColor: zone.severity === 'high' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.25,
                weight: 3,
              }}
            >
              <Popup>
                <div>
                  <h3>🚨 {zone.name}</h3>
                  <p><strong>Severity:</strong> {zone.severity}</p>
                  <p>{zone.description}</p>
                </div>
              </Popup>
            </Polygon>
          ))}
          
          {/* Route Visualization */}
          {routes.map((route, index) => (
            <DirectionsPolyline 
              key={index}
              routeGeometry={route.geometry}
              isSelected={index === selectedRoute}
            />
          ))}
          
          {/* Start and Destination Markers */}
          {currentRoute && (
            <>
              <Marker
                position={userPos}
                icon={createRouteIcon('start')}
              >
                <Popup>Your Location</Popup>
              </Marker>
              <Marker
                position={destination.coords}
                icon={createRouteIcon('end')}
              >
                <Popup>Destination: {destination.name}</Popup>
              </Marker>
            </>
          )}
          
          {/* POI Markers with Icons */}
          {STATIC_POIS.map((poi) => (
            <Marker
              key={poi.id}
              position={poi.coords}
              icon={createPoiIcon(poi.type, poi.icon)}
            >
              <Popup>
                <div>
                  <h3>{poi.name}</h3>
                  <p>Type: {poi.type}</p>
                  <button 
                    className="directions-button"
                    onClick={() => handleGetDirections(poi.coords, poi.name)}
                  >
                    Get Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Search Box */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            🔍
          </button>
        </div>

        {/* Click Hint */}
        {showClickHint && (
          <div className="click-hint">
            💡 Route calculated successfully!
          </div>
        )}

        <div className="sos-button-container">
          <button 
            className="sos-button"
            onClick={() => setSosModalOpen(true)}
          >
            SOS
          </button>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="info-section">
        <div className="info-content">
          <div>
            <RiskDetectionCard userPos={userPos} weatherData={weatherData} />
            <ServicesWidget 
              userPos={userPos}
              onGetDirections={handleGetDirections}
            />
          </div>
          <div>
            {currentRoute ? (
              <DirectionsWidget 
                route={currentRoute} 
                onClear={handleClearRoute} 
              />
            ) : (
              <WeatherWidget />
            )}
          </div>
        </div>
      </div>
      
      {/* MODALS */}
      {profileModalOpen && (
        <div className="modal-backdrop" onClick={() => setProfileModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-header">👤 My Profile & Details</h3>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <span>Name:</span> <span style={{ fontWeight: '600' }}>{MOCK_PROFILE.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <span>Phone:</span> <span style={{ fontWeight: '600' }}>{MOCK_PROFILE.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <span>Emergency Contact:</span> <span style={{ fontWeight: '600' }}>{MOCK_PROFILE.emergencyContact}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-button modal-button-secondary"
                onClick={() => setProfileModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {sosModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-header">🚨 Emergency SOS</h3>
            <div className="modal-body">
              <p><strong>Are you sure you want to send an emergency SOS?</strong></p>
              <p>This will immediately alert emergency services and nearby authorities.</p>
              <p style={{ marginTop: '1rem', color: '#ef4444', fontWeight: '600' }}>
                Only use this for genuine emergencies!
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-button modal-button-secondary"
                onClick={() => setSosModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button modal-button-primary"
                onClick={sendSOS}
              >
                Send SOS Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {dangerAlert && (
        <div className="modal-backdrop">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-header" style={{ color: '#ef4444' }}>🚨 DANGER ZONE ALERT</h3>
            <div className="modal-body">
              <p>You have entered a known danger zone:</p>
              <p style={{ fontWeight: '600', fontSize: '1.1rem', margin: '1rem 0' }}>
                {dangerAlert.name}
              </p>
              <p style={{ color: '#ef4444', fontWeight: '600' }}>
                Severity: {dangerAlert.severity.toUpperCase()}
              </p>
              <p>{dangerAlert.description}</p>
              <p style={{ marginTop: '1rem' }}>
                <strong>Please exit this area immediately and move to a safe location.</strong>
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-button modal-button-primary"
                onClick={() => setDangerAlert(null)}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}