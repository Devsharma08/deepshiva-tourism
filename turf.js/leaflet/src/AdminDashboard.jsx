import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  LayersControl,
  FeatureGroup,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  point as turfPoint,
  polygon as turfPolygon,
  booleanPointInPolygon,
} from '@turf/turf';

// --- MOCK DATA & INITIAL SETUP ---
const MAP_CENTER = [29.64, 79.43];
const MAP_ZOOM = 13;

// --- 1. Combined Live Tracker & Profile Data ---
// We will use one state for trackers, combining profile and live data.
const MOCK_INITIAL_TRACKERS = {
  'tourist-1': {
    lat: 29.64,
    lng: 79.43,
    type: 'tourist',
    name: 'Rohan Sharma',
    phone: '+91 98XXXXXX99',
    permit: 'TK-405-A',
    status: 'Safe', // New field
    locationName: 'On Trail', // New field
    group: [
      { name: 'Priya Sharma', relation: 'Spouse', age: 34 },
      { name: 'Aarav Sharma', relation: 'Child', age: 8 },
    ],
  },
  'tourist-2': {
    lat: 29.65,
    lng: 79.41,
    type: 'tourist',
    name: 'Anjali Verma',
    phone: '+91 97XXXXXX88',
    permit: 'TK-405-B',
    status: 'Safe',
    locationName: 'On Trail',
    group: [{ name: 'Sameer Verma', relation: 'Spouse', age: 40 }],
  },
  'tourist-3': {
    lat: 29.63,
    lng: 79.44,
    type: 'tourist',
    name: 'David Lee',
    phone: '+1 415XXXXX77',
    permit: 'TK-406-C',
    status: 'Safe',
    locationName: 'On Trail',
    group: [{ name: 'Solo Hiker', relation: 'N/A', age: 29 }],
  },
};

// --- 2. Detailed Weather Data ---
const MOCK_WEATHER_DATA = {
  today: {
    icon: '☀️',
    temp: 22,
    desc: 'Clear and Sunny',
    feelsLike: 21,
    humidity: 45,
    wind: '10 km/h NW',
    sunrise: '6:05 AM',
    sunset: '5:45 PM',
  },
  forecast: [
    { day: 'Mon', icon: '🌤️', high: 21, low: 11 },
    { day: 'Tue', icon: '🌥️', high: 20, low: 9 },
    { day: 'Wed', icon: '🌦️', high: 19, low: 9 },
  ],
};

// --- 3. Map Layers (with Turf.js polygons) ---
// We add turfCoords for the logic, and keep coords for Leaflet rendering
const MOCK_DANGER_ZONES = [
  {
    id: 'dz-1',
    name: 'High Landslide Risk Zone',
    coords: [
      [29.645, 79.425], [29.648, 79.428], [29.646, 79.432], [29.642, 79.43]
    ],
    // Turf.js needs [lng, lat] and a closed loop [first...last]
    turfPolygon: turfPolygon([[
      [79.425, 29.645], [79.428, 29.648], [79.432, 29.646], [79.43, 29.642], [79.425, 29.645]
    ]]),
    severity: 'high',
  },
];
const MOCK_SAFE_ROUTES = [
  {
    id: 'sr-1',
    name: 'Trail to Kosi Viewpoint',
    coords: [
      [29.64, 79.43], [29.642, 79.435], [29.641, 79.438], [29.643, 79.44]
    ],
    difficulty: 'moderate',
  },
];

// --- 4. Emergency Contacts ---
const MOCK_EMERGENCY_CONTACTS = [
  { name: 'District Police', phone: '100', icon: '👮' },
  { name: 'Forest Range Office', phone: '1926', icon: '🌲' },
  { name: 'District Hospital', phone: '108', icon: '🏥' },
  { name: 'Fire & Rescue', phone: '101', icon: '🔥' },
];


// --- CUSTOM ICON FUNCTION ---
const createCustomIcon = (status) => {
  const isDanger = status !== 'Safe';
  return L.divIcon({
    html: `<div class="admin-icon-tourist ${isDanger ? 'danger' : ''}">👤</div>`,
    className: `admin-icon-base ${isDanger ? 'danger-base' : ''}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// --- STYLES COMPONENT ---
function GlobalStyles() {
  return (
    <style>{`
      /* Icons */
      .admin-icon-base {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border: 2px solid #fff;
        transition: all 0.3s ease;
      }
      .admin-icon-tourist {
        background: #3498db;
        color: white;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.3s ease;
      }
      
      /* Danger Status Icon */
      .admin-icon-base.danger-base {
        border-color: #e74c3c;
      }
      .admin-icon-tourist.danger {
        background: #e74c3c;
        animation: pulse-red-icon 1.5s infinite;
      }
      
      @keyframes pulse-red-icon {
        0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
        100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
      }

      /* Layout */
      .admin-dashboard-layout {
        display: grid;
        grid-template-columns: 300px 1fr 350px; /* 3-Column Layout */
        grid-template-rows: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #f0f2f5;
      }
      
      .sidebar, .inspector {
        background: white;
        border-right: 1px solid #e1e5e9;
        display: flex;
        flex-direction: column;
        max-height: 100vh;
      }
      .inspector {
        border-right: none;
        border-left: 1px solid #e1e5e9;
      }
      
      .sidebar-header, .inspector-header {
        padding: 1.25rem;
        font-size: 1.1rem;
        font-weight: 600;
        border-bottom: 1px solid #e1e5e9;
        color: #2c3e50;
        flex-shrink: 0;
      }
      
      .user-list {
        overflow-y: auto;
        flex-grow: 1;
      }
      
      .user-item {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #f1f3f4;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .user-item:hover {
        background: #f8f9fa;
      }
      
      .user-item.selected {
        background: #3498db;
        color: white;
      }
      .user-item.selected .user-details,
      .user-item.selected .user-status-safe {
        color: #f0f0f0;
      }
      
      /* Danger Status List Item */
      .user-item.in-danger {
        background: #fbeeee;
        border-left: 4px solid #e74c3c;
      }
      .user-item.in-danger:hover {
        background: #f8d7da;
      }
      .user-item.in-danger.selected {
        background: #e74c3c;
        color: white;
      }
      .user-item.in-danger.selected .user-details {
         color: #f0f0f0;
      }
      
      .user-name {
        font-weight: 600;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
      }
      
      .user-details {
        font-size: 0.8rem;
        color: #7f8c8d;
      }
      
      .user-status-safe {
        font-size: 0.8rem;
        font-weight: 600;
        color: #27ae60;
      }
      .user-status-danger {
        font-size: 0.8rem;
        font-weight: 600;
        color: #e74c3c;
        animation: pulse-red-text 1.5s infinite;
      }
      @keyframes pulse-red-text {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
      
      .map-container-wrapper {
        height: 100vh;
        position: relative;
      }
      
      .leaflet-container {
        height: 100%;
        width: 100%;
      }
      
      .inspector-content {
        overflow-y: auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      /* Weather Widget */
      .widget {
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #e1e5e9;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      }
      
      .widget-header {
        padding: 1rem 1.25rem;
        font-size: 1rem;
        font-weight: 600;
        border-bottom: 1px solid #e1e5e9;
        color: #34495e;
      }
      
      .widget-content {
        padding: 1.25rem;
      }
      
      .weather-today {
        text-align: center;
        border-bottom: 1px dashed #e1e5e9;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
      }
      .weather-today-icon {
        font-size: 3rem;
      }
      .weather-today-temp {
        font-size: 2.5rem;
        font-weight: 600;
        color: #2c3e50;
        margin: 0;
      }
      .weather-today-desc {
        font-size: 1rem;
        color: #555;
        margin-bottom: 1rem;
      }
      .weather-today-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        text-align: left;
        font-size: 0.85rem;
        color: #7f8c8d;
      }
      
      .weather-forecast {
        display: flex;
        justify-content: space-around;
        text-align: center;
      }
      .forecast-item {
        font-size: 0.9rem;
      }
      .forecast-day {
        font-weight: 600;
      }
      .forecast-icon {
        font-size: 1.5rem;
        margin: 0.25rem 0;
      }
      .forecast-temp .low {
        color: #7f8c8d;
      }
      
      /* Inspector Panel */
      .inspector-panel {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
      }
      
      .inspector-panel h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.5rem;
      }
      .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
        font-size: 0.9rem;
      }
      .stat-item span:first-child {
        font-weight: 500;
        color: #555;
      }
      
      /* Danger Status Inspector */
      .stat-item-danger {
        background: #f8d7da;
        color: #721c24;
        padding: 10px;
        border-radius: 4px;
        margin: 0.5rem 0;
        font-weight: 600;
      }
      .stat-item-danger span:first-child {
        color: #721c24;
      }
      
      .group-member {
        margin-top: 0.5rem;
        padding-left: 1rem;
        border-left: 3px solid #3498db;
        font-size: 0.9rem;
      }
      
      /* Emergency Contacts */
      .contacts-widget {
        flex-shrink: 0;
        border-top: 1px solid #e1e5e9;
        padding: 1rem;
      }
      .contacts-widget-header {
        font-size: 1rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      .contact-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .contact-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        text-decoration: none;
        color: #34495e;
        transition: all 0.2s ease;
      }
      .contact-item:hover {
        color: #3498db;
      }
      .contact-icon {
        font-size: 1.5rem;
      }
      .contact-details {
        line-height: 1.3;
      }
      .contact-name {
        font-weight: 500;
      }
      .contact-phone {
        font-size: 0.8rem;
        color: #7f8c8d;
      }
      
    `}</style>
  );
}

// --- Map Component to Simulate Movement & Geofencing ---
function UserMovementSimulator({ setTrackers }) {
  // Use a ref to access zones without re-triggering useEffect
  const dangerZonesRef = useRef(MOCK_DANGER_ZONES);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackers(currentTrackers => {
        const newTrackers = { ...currentTrackers };
        
        for (const id in newTrackers) {
          // 1. Simulate new position
          const newLat = newTrackers[id].lat + (Math.random() - 0.5) * 0.001;
          const newLng = newTrackers[id].lng + (Math.random() - 0.5) * 0.001;
          newTrackers[id].lat = newLat;
          newTrackers[id].lng = newLng;

          // 2. Create a Turf.js point for the new location
          const userPoint = turfPoint([newLng, newLat]);
          
          let isInsideDangerZone = false;
          let zoneName = 'On Trail';

          // 3. Check against all danger zones
          for (const zone of dangerZonesRef.current) {
            if (booleanPointInPolygon(userPoint, zone.turfPolygon)) {
              isInsideDangerZone = true;
              zoneName = zone.name;
              break; // Found a zone, no need to check others
            }
          }
          
          // 4. Update the tracker's status
          newTrackers[id].status = isInsideDangerZone ? 'In Danger Zone' : 'Safe';
          newTrackers[id].locationName = zoneName;
        }
        return newTrackers;
      });
    }, 3000); // Move every 3 seconds

    return () => clearInterval(interval);
  }, [setTrackers]);

  return null; // This component doesn't render anything
}

// --- MAIN DASHBOARD COMPONENT ---
export default function AdminDashboard() {
  const [trackers, setTrackers] = useState(MOCK_INITIAL_TRACKERS);
  const [selectedTrackerId, setSelectedTrackerId] = useState(null);
  const mapRef = useRef();

  const handleTrackerSelect = (id) => {
    setSelectedTrackerId(id);
    const tracker = trackers[id];
    if (tracker && mapRef.current) {
      mapRef.current.flyTo([tracker.lat, tracker.lng], 16, { duration: 1 });
    }
  };

  const selectedProfile = selectedTrackerId ? trackers[selectedTrackerId] : null;

  return (
    <div className="admin-dashboard-layout">
      <GlobalStyles />

      {/* --- LEFT SIDEBAR (User List & Contacts) --- */}
      <div className="sidebar">
        <div className="sidebar-header">
          Active Tourists ({Object.keys(trackers).length})
        </div>
        <div className="user-list">
          {Object.entries(trackers).map(([id, tracker]) => {
            const isDanger = tracker.status !== 'Safe';
            return (
              <div
                key={id}
                className={`user-item ${
                  id === selectedTrackerId ? 'selected' : ''
                } ${isDanger ? 'in-danger' : ''}`}
                onClick={() => handleTrackerSelect(id)}
              >
                <div className="user-name">
                  <span>{tracker.name}</span>
                  <span className={isDanger ? 'user-status-danger' : 'user-status-safe'}>
                    {tracker.status}
                  </span>
                </div>
                <div className="user-details">
                  Permit: {tracker.permit} | Group: {tracker.group.length}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Emergency Contacts Widget */}
        <div className="contacts-widget">
          <div className="contacts-widget-header">Emergency Contacts</div>
          <div className="contact-list">
            {MOCK_EMERGENCY_CONTACTS.map((contact) => (
              <a key={contact.name} href={`tel:${contact.phone}`} className="contact-item">
                <span className="contact-icon">{contact.icon}</span>
                <div className="contact-details">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-phone">{contact.phone}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        
      </div>

      {/* --- CENTER (Map) --- */}
      <div className="map-container-wrapper">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          maxZoom={22}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <UserMovementSimulator setTrackers={setTrackers} />

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
            <LayersControl.BaseLayer name="🏔️ Topographic">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution="© OpenTopoMap"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Render Danger Zones */}
          {MOCK_DANGER_ZONES.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coords}
              pathOptions={{ color: '#e74c3c', fillColor: '#e74c3c', fillOpacity: 0.3 }}
            >
              <Popup><b>🚨 {zone.name}</b><br/>Severity: {zone.severity}</Popup>
            </Polygon>
          ))}

          {/* Render Safe Routes */}
          {MOCK_SAFE_ROUTES.map((route) => (
            <Polyline
              key={route.id}
              positions={route.coords}
              pathOptions={{ color: '#27ae60', weight: 4, dashArray: '5, 8' }}
            >
              <Popup><b>🛣️ {route.name}</b><br/>Difficulty: {route.difficulty}</Popup>
            </Polyline>
          ))}

          {/* Render Trackers */}
          {Object.entries(trackers).map(([id, tracker]) => (
            <Marker
              key={id}
              position={[tracker.lat, tracker.lng]}
              icon={createCustomIcon(tracker.status)}
              eventHandlers={{
                click: () => handleTrackerSelect(id),
              }}
            >
              <Popup>
                <b>{tracker.name}</b><br/>
                Status: {tracker.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* --- RIGHT SIDEBAR (Weather & Inspector) --- */}
      <div className="inspector">
        <div className="inspector-header">Details & Weather</div>
        <div className="inspector-content">

          {/* Weather Widget */}
          <div className="widget">
            <div className="widget-header">Weather (Ranikhet)</div>
            <div className="widget-content">
              <div className="weather-today">
                <div className="weather-today-icon">{MOCK_WEATHER_DATA.today.icon}</div>
                <h2 className="weather-today-temp">{MOCK_WEATHER_DATA.today.temp}°C</h2>
                <div className="weather-today-desc">{MOCK_WEATHER_DATA.today.desc}</div>
                <div className="weather-today-details">
                  <span>Feels Like: {MOCK_WEATHER_DATA.today.feelsLike}°</span>
                  <span>Humidity: {MOCK_WEATHER_DATA.today.humidity}%</span>
                  <span>Wind: {MOCK_WEATHER_DATA.today.wind}</span>
                  <span>Sunrise: {MOCK_WEATHER_DATA.today.sunrise}</span>
                </div>
              </div>
              <div className="weather-forecast">
                {MOCK_WEATHER_DATA.forecast.map((day) => (
                  <div key={day.day} className="forecast-item">
                    <div className="forecast-day">{day.day}</div>
                    <div className="forecast-icon">{day.icon}</div>
                    <div className="forecast-temp">
                      <span>{day.high}°</span>
                      <span className="low"> / {day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inspector Panel */}
          {selectedProfile ? (
            <div className="inspector-panel">
              <h3>{selectedProfile.name}</h3>
              
              {/* Live Status Panel */}
              {selectedProfile.status !== 'Safe' && (
                <div className="stat-item stat-item-danger">
                  <span>Status:</span>
                  <span>{selectedProfile.status}</span>
                </div>
              )}
              <div className="stat-item">
                <span>Current Location:</span>
                <span>{selectedProfile.locationName}</span>
              </div>
              <div className="stat-item">
                <span>Phone:</span>
                <span>{selectedProfile.phone}</span>
              </div>
              <div className="stat-item">
                <span>Permit:</span>
                <span>{selectedProfile.permit}</span>
              </div>
              <div className="stat-item">
                <span>Group Size:</span>
                <span>{selectedProfile.group.length}</span>
              </div>
              
              <h4 style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>Group Members</h4>
              {selectedProfile.group.map((member, index) => (
                <div key={index} className="group-member">
                  <strong>{member.name}</strong> ({member.relation}, Age: {member.age})
                </div>
              ))}
            </div>
          ) : (
            <div className="inspector-panel" style={{textAlign: 'center', color: '#777'}}>
              <p>Select a tourist from the list on the left to view their details.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


