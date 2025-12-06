import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, LayersControl, FeatureGroup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Mock Turf.js functions for distance and point-in-polygon
const turfPoint = (coords) => ({ type: 'Point', coordinates: coords });
const turfPolygon = (coords) => ({ type: 'Polygon', coordinates: coords });

const booleanPointInPolygon = (point, polygon) => {
  const x = point.coordinates[0];
  const y = point.coordinates[1];
  const vs = polygon.coordinates[0];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const turfDistance = (from, to, options = {}) => {
  const R = options.units === 'meters' ? 6371000 : 6371;
  const [lon1, lat1] = from.coordinates;
  const [lon2, lat2] = to.coordinates;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const MAP_CENTER = [28.6322, 77.2190];
const MAP_ZOOM = 15;
const OSRM_API_URL = 'https://router.project-osrm.org/route/v1/driving';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Enhanced Weather Data Structure
const MOCK_WEATHER_DATA = {
  current: {
    temperature: 28,
    weatherCode: 0,
    humidity: 65,
    windSpeed: 12,
    precipitation: 0,
    feelsLike: 30
  },
  hourly: [
    { time: '12:00', temp: 28, code: 0 },
    { time: '13:00', temp: 29, code: 1 },
    { time: '14:00', temp: 30, code: 2 },
    { time: '15:00', temp: 29, code: 3 },
    { time: '16:00', temp: 28, code: 45 },
    { time: '17:00', temp: 27, code: 61 },
  ]
};

const MOCK_TOURIST_INFO = {
  't1': {
    infoId: 't1',
    name: 'Rohan Sharma',
    phone: '+91 9876543210',
    group: 'Family Group',
    permit: 'CP-102A',
    members: [
      { id: 't1-m1', name: 'Anjali Sharma', relation: 'Spouse' },
      { id: 't1-m2', name: 'Vikram Sharma', relation: 'Child', age: 8 },
    ],
  },
  't2': {
    infoId: 't2',
    name: 'Priya Patel',
    phone: '+91 9876543211',
    group: 'Solo Traveler',
    permit: 'CP-103B',
    members: [],
  },
  't3': {
    infoId: 't3',
    name: 'Amit Kumar',
    phone: '+91 9876543212',
    group: 'Student Group',
    permit: 'CP-104C',
    members: [
      { id: 't3-m1', name: 'Sonia Singh', relation: 'Friend' },
      { id: 't3-m2', name: 'Raj Verma', relation: 'Friend' },
    ],
  },
};

const MOCK_TRACKERS = {
  'tourist-1': {
    id: 'tourist-1',
    infoId: 't1',
    name: 'Rohan Sharma',
    lat: 28.6322,
    lng: 77.2190,
    status: 'Safe',
    type: 'tourist',
    battery: 85,
    lastUpdate: new Date().toISOString(),
    riskLevel: 15,
  },
  'tourist-2': {
    id: 'tourist-2',
    infoId: 't2',
    name: 'Priya Patel',
    lat: 28.6300,
    lng: 77.2180,
    status: 'Safe',
    type: 'tourist',
    battery: 72,
    lastUpdate: new Date().toISOString(),
    riskLevel: 65,
  },
  'tourist-3': {
    id: 'tourist-3',
    infoId: 't3',
    name: 'Amit Kumar',
    lat: 28.6350,
    lng: 77.2200,
    status: 'Safe',
    type: 'tourist',
    battery: 91,
    lastUpdate: new Date().toISOString(),
    riskLevel: 85,
  },
  'ranger-1': {
    id: 'ranger-1',
    name: 'Delhi Police Unit 7',
    lat: 28.631,
    lng: 77.221,
    status: 'Active',
    type: 'ranger',
    battery: 92,
    lastUpdate: new Date().toISOString(),
    riskLevel: 5,
    availability: 'On Patrol'
  },
};

const MOCK_DANGER_ZONES = [
  {
    id: 'dz-1',
    name: 'High Traffic Congestion',
    coords: [
      [28.633, 77.219], [28.634, 77.220], [28.632, 77.221], [28.631, 77.220],
    ],
    turfCoords: [[
      [77.219, 28.633], [77.220, 28.634], [77.221, 28.632], [77.220, 28.631], [77.219, 28.633],
    ]],
    severity: 'high',
    riskFactor: 80
  },
];

const MOCK_SAFE_ROUTES = [
  {
    id: 'sr-1',
    name: 'Central Park Inner Circle',
    coords: [
      [28.6328, 77.2192], [28.6325, 77.2205], [28.6315, 77.2200], [28.6318, 77.2188],
    ],
    difficulty: 'easy',
    length: 1250,
    elevationGain: 0,
    createdAt: new Date().toISOString(),
    description: 'Pedestrian-friendly walking path'
  },
];

const MOCK_POIS = [
  { id: 'poi-1', name: 'City Hospital', lat: 28.6310, lng: 77.2200, type: 'hospital' },
  { id: 'poi-2', name: 'Police Station CP', lat: 28.6335, lng: 77.2185, type: 'police' },
  { id: 'poi-3', name: 'Medical Store', lat: 28.6318, lng: 77.2195, type: 'shop' },
  { id: 'poi-4', name: 'Emergency Clinic', lat: 28.6295, lng: 77.2175, type: 'hospital' },
  { id: 'poi-5', name: 'Traffic Police Post', lat: 28.6340, lng: 77.2210, type: 'police' },
];

// Enhanced Alert System Component
function AlertSystem({ alerts, onClearAlert }) {
  const [expandedAlert, setExpandedAlert] = useState(null);

  if (alerts.length === 0) return null;

  return (
    <div className="alert-system">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={`alert-toast ${alert.type} ${alert.priority || ''} ${expandedAlert === alert.id ? 'expanded' : ''}`}
          onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
        >
          <div className="alert-content">
            <div className="alert-icon">
              {alert.type === 'sos' ? '🆘' : 
               alert.type === 'risk' ? '⚠️' : 
               alert.type === 'zone' ? '🚨' : '🔔'}
            </div>
            <div className="alert-details">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-message">
                {expandedAlert === alert.id ? alert.message : `${alert.message.substring(0, 60)}...`}
              </div>
              <div className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
            <button 
              className="alert-close" 
              onClick={(e) => {
                e.stopPropagation();
                onClearAlert(alert.id);
              }}
            >
              ✕
            </button>
          </div>
          {alert.type === 'sos' && expandedAlert === alert.id && (
            <div className="alert-actions">
              <button className="btn-alert-action primary">Dispatch Help</button>
              <button className="btn-alert-action secondary">Contact User</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Enhanced Weather Widget Component
function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '🌤️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 95) return '⛈️';
    return '☀️';
  };
  
  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear sky';
    if (code >= 1 && code <= 3) return 'Partly cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Clear';
  };
  
  useEffect(() => {
    const fetchWeather = async () => {
      const [lat, lon] = MAP_CENTER;
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation',
        hourly: 'temperature_2m,weather_code',
        forecast_days: 1,
        timezone: 'auto',
      });
      
      try {
        const res = await fetch(`${WEATHER_API_URL}?${params}`);
        if (!res.ok) throw new Error('Weather API failed');
        const data = await res.json();
        
        setWeather({ 
          current: {
            temp: Math.round(data.current.temperature_2m),
            icon: getWeatherIcon(data.current.weather_code),
            description: getWeatherDescription(data.current.weather_code),
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            precipitation: data.current.precipitation,
            feelsLike: Math.round(data.current.temperature_2m + 2)
          },
          hourly: data.hourly ? data.hourly.time.slice(0, 6).map((time, index) => ({
            time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric' }),
            temp: Math.round(data.hourly.temperature_2m[index]),
            code: data.hourly.weather_code[index]
          })) : []
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeather(MOCK_WEATHER_DATA);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="weather-widget">
      {isLoading ? (
        <div className="loading-placeholder">Loading Weather...</div>
      ) : !weather ? (
        <div className="empty-placeholder">Weather data unavailable.</div>
      ) : (
        <>
          <div className="weather-current" onClick={() => setShowDetails(!showDetails)}>
            <div className="weather-current-icon">{weather.current.icon}</div>
            <div className="weather-main">
              <div className="weather-current-temp">{weather.current.temp}°C</div>
              <div className="weather-current-desc">{weather.current.description}</div>
              <div className="weather-current-location">New Delhi</div>
            </div>
            <div className="weather-toggle">
              {showDetails ? '▲' : '▼'}
            </div>
          </div>
          
          {showDetails && (
            <div className="weather-details">
              <div className="weather-stats">
                <div className="weather-stat">
                  <span className="stat-label">Feels like</span>
                  <span className="stat-value">{weather.current.feelsLike}°C</span>
                </div>
                <div className="weather-stat">
                  <span className="stat-label">Humidity</span>
                  <span className="stat-value">{weather.current.humidity}%</span>
                </div>
                <div className="weather-stat">
                  <span className="stat-label">Wind</span>
                  <span className="stat-value">{weather.current.windSpeed} km/h</span>
                </div>
                <div className="weather-stat">
                  <span className="stat-label">Precipitation</span>
                  <span className="stat-value">{weather.current.precipitation} mm</span>
                </div>
              </div>
              
              <div className="weather-hourly">
                <h4>Today's Forecast</h4>
                <div className="hourly-list">
                  {weather.hourly.map((hour, index) => (
                    <div key={index} className="hourly-item">
                      <div className="hour-time">{hour.time}</div>
                      <div className="hour-icon">{getWeatherIcon(hour.code)}</div>
                      <div className="hour-temp">{hour.temp}°</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// New Danger Routes Manager Component
function DangerRoutesManager({ dangerZones, safeRoutes, onUpdateZone, onDeleteZone, onUpdateRoute, onDeleteRoute }) {
  const [history, setHistory] = useState([]);
  const [selectedType, setSelectedType] = useState('danger'); // 'danger' or 'safe'

  const addToHistory = (action, data) => {
    setHistory(prev => [...prev, { action, data, timestamp: new Date().toISOString() }]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const lastAction = history[history.length - 1];
    
    switch (lastAction.action) {
      case 'deleteZone':
        onUpdateZone(lastAction.data);
        break;
      case 'deleteRoute':
        onUpdateRoute(lastAction.data);
        break;
      case 'updateZone':
        onUpdateZone(lastAction.data.old);
        break;
      case 'updateRoute':
        onUpdateRoute(lastAction.data.old);
        break;
      default:
        break;
    }
    
    setHistory(prev => prev.slice(0, -1));
  };

  const handleDeleteZone = (zone) => {
    addToHistory('deleteZone', zone);
    onDeleteZone(zone.id);
  };

  const handleDeleteRoute = (route) => {
    addToHistory('deleteRoute', route);
    onDeleteRoute(route.id);
  };

  const handleUpdateZone = (zoneId, updates) => {
    const oldZone = dangerZones.find(z => z.id === zoneId);
    addToHistory('updateZone', { old: oldZone, new: { ...oldZone, ...updates } });
    onUpdateZone(zoneId, updates);
  };

  const handleUpdateRoute = (routeId, updates) => {
    const oldRoute = safeRoutes.find(r => r.id === routeId);
    addToHistory('updateRoute', { old: oldRoute, new: { ...oldRoute, ...updates } });
    onUpdateRoute(routeId, updates);
  };

  return (
    <div className="routes-manager">
      <div className="routes-header">
        <h3>🗺️ Routes & Zones Manager</h3>
        <div className="routes-controls">
          <div className="type-selector">
            <button 
              className={`type-btn ${selectedType === 'danger' ? 'active' : ''}`}
              onClick={() => setSelectedType('danger')}
            >
              🚨 Danger Zones
            </button>
            <button 
              className={`type-btn ${selectedType === 'safe' ? 'active' : ''}`}
              onClick={() => setSelectedType('safe')}
            >
              🛣️ Safe Routes
            </button>
          </div>
          <button 
            className="undo-btn"
            onClick={handleUndo}
            disabled={history.length === 0}
          >
            ↩️ Undo
          </button>
        </div>
      </div>

      <div className="routes-list">
        {selectedType === 'danger' ? (
          dangerZones.length === 0 ? (
            <div className="empty-placeholder">No danger zones configured</div>
          ) : (
            dangerZones.map(zone => (
              <DangerZoneItem 
                key={zone.id} 
                zone={zone} 
                onUpdate={handleUpdateZone}
                onDelete={handleDeleteZone}
              />
            ))
          )
        ) : (
          safeRoutes.length === 0 ? (
            <div className="empty-placeholder">No safe routes configured</div>
          ) : (
            safeRoutes.map(route => (
              <SafeRouteItem 
                key={route.id} 
                route={route} 
                onUpdate={handleUpdateRoute}
                onDelete={handleDeleteRoute}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}

function DangerZoneItem({ zone, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(zone);

  const handleSave = () => {
    onUpdate(zone.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(zone);
    setIsEditing(false);
  };

  return (
    <div className="route-item danger-zone">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            className="edit-input"
          />
          <select
            value={editData.severity}
            onChange={(e) => setEditData({...editData, severity: e.target.value})}
            className="edit-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="edit-actions">
            <button className="btn-success" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="route-info">
            <div className="route-name">{zone.name}</div>
            <div className="route-details">
              <span className={`severity-badge ${zone.severity}`}>
                {zone.severity.toUpperCase()}
              </span>
              <span className="risk-factor">Risk: {zone.riskFactor}%</span>
            </div>
          </div>
          <div className="route-actions">
            <button className="btn-edit" onClick={() => setIsEditing(true)}>✏️</button>
            <button className="btn-delete" onClick={() => onDelete(zone)}>🗑️</button>
          </div>
        </>
      )}
    </div>
  );
}

function SafeRouteItem({ route, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(route);

  const handleSave = () => {
    onUpdate(route.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(route);
    setIsEditing(false);
  };

  return (
    <div className="route-item safe-route">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            className="edit-input"
          />
          <select
            value={editData.difficulty}
            onChange={(e) => setEditData({...editData, difficulty: e.target.value})}
            className="edit-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <div className="edit-actions">
            <button className="btn-success" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="route-info">
            <div className="route-name">{route.name}</div>
            <div className="route-details">
              <span className={`difficulty-badge ${route.difficulty}`}>
                {route.difficulty.toUpperCase()}
              </span>
              <span className="route-length">{(route.length / 1000).toFixed(1)} km</span>
            </div>
          </div>
          <div className="route-actions">
            <button className="btn-edit" onClick={() => setIsEditing(true)}>✏️</button>
            <button className="btn-delete" onClick={() => onDelete(route)}>🗑️</button>
          </div>
        </>
      )}
    </div>
  );
}

// Update the existing components to use the same createCustomIcon function
const createCustomIcon = (type, riskLevel = 0) => {
  const colors = {
    tourist: riskLevel > 70 ? '#ef4444' : riskLevel > 40 ? '#f59e0b' : '#10b981',
    ranger: '#22c55e',
    hospital: '#dc2626',
    police: '#2563eb',
    shop: '#14b8a6'
  };
  const icons = {
    tourist: '👤',
    ranger: '🛡️',
    hospital: '🏥',
    police: '🚓',
    shop: '🛒'
  };
  const pulseClass = riskLevel > 70 ? 'pulse-high-risk' : riskLevel > 40 ? 'pulse-medium-risk' : '';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="custom-marker-icon ${pulseClass}" style="background: ${colors[type] || '#6b7280'}; color: white;">
        ${icons[type] || '📍'}
        ${riskLevel > 70 ? '<div class="risk-badge">⚠️</div>' : ''}
      </div>
      ${riskLevel > 40 ? `<div class="risk-level">${riskLevel}%</div>` : ''}
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

// Update the TrackingDashboard component with new state and handlers
export default function TrackingDashboard() {
  const [trackers, setTrackers] = useState(MOCK_TRACKERS);
  const [dangerZones, setDangerZones] = useState(MOCK_DANGER_ZONES);
  const [safeRoutes, setSafeRoutes] = useState(MOCK_SAFE_ROUTES);
  const [selectedTrackerId, setSelectedTrackerId] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [leftTab, setLeftTab] = useState('trackers');
  const [rightTab, setRightTab] = useState('inspector');
  const [persistentPois] = useState(MOCK_POIS);
  const [aiRoute, setAiRoute] = useState(null);
  
  const [aiAlertModal, setAiAlertModal] = useState({
    isOpen: false, 
    message: '', 
    onConfirm: () => {},
  });
  
  const mapRef = useRef();
  const { calculateRiskForTracker } = useRiskDetection(trackers, dangerZones);

  // Add new handlers for danger zones and safe routes management
  const handleUpdateZone = (zoneId, updates) => {
    setDangerZones(current => 
      current.map(zone => zone.id === zoneId ? { ...zone, ...updates } : zone)
    );
  };

  const handleDeleteZone = (zoneId) => {
    setDangerZones(current => current.filter(zone => zone.id !== zoneId));
  };

  const handleUpdateRoute = (routeId, updates) => {
    setSafeRoutes(current => 
      current.map(route => route.id === routeId ? { ...route, ...updates } : route)
    );
  };

  const handleDeleteRoute = (routeId) => {
    setSafeRoutes(current => current.filter(route => route.id !== routeId));
  };

  // ... rest of the existing useEffect and handlers remain the same

  return (
    <div className={`dashboard-layout ${isFullscreen ? 'fullscreen-map' : ''}`}>
      <GlobalStyles />
      <AlertSystem alerts={alerts} onClearAlert={handleClearAlert} />

      <button
        className="fullscreen-toggle"
        onClick={() => setIsFullscreen(!isFullscreen)}
      >
        {isFullscreen ? '📱 Exit Fullscreen' : '🖥️ Fullscreen Map'}
      </button>

      <div className="sidebar">
        <div className="header">🛰️ Command Center</div>
        <div className="tab-bar">
          <button
            className={`tab-button ${leftTab === 'trackers' ? 'active' : ''}`}
            onClick={() => setLeftTab('trackers')}
          >
            Trackers
          </button>
          <button
            className={`tab-button ${leftTab === 'resources' ? 'active' : ''}`}
            onClick={() => setLeftTab('resources')}
          >
            Resources
          </button>
          <button
            className={`tab-button ${leftTab === 'weather' ? 'active' : ''}`}
            onClick={() => setLeftTab('weather')}
          >
            Weather
          </button>
          <button
            className={`tab-button ${leftTab === 'routes' ? 'active' : ''}`}
            onClick={() => setLeftTab('routes')}
          >
            Routes
          </button>
        </div>
        
        <div className="tab-content">
          {leftTab === 'trackers' && (
            <TouristList
              trackers={trackers}
              selectedTrackerId={selectedTrackerId}
              onTrackerSelect={handleTrackerSelect}
            />
          )}
          {leftTab === 'resources' && (
            <ResourceManager trackers={trackers} />
          )}
          {leftTab === 'weather' && (
            <WeatherWidget />
          )}
          {leftTab === 'routes' && (
            <DangerRoutesManager
              dangerZones={dangerZones}
              safeRoutes={safeRoutes}
              onUpdateZone={handleUpdateZone}
              onDeleteZone={handleDeleteZone}
              onUpdateRoute={handleUpdateRoute}
              onDeleteRoute={handleDeleteRoute}
            />
          )}
        </div>
        
        <div className="sidebar-footer">
          <button
            className="inspector-button success"
            onClick={() => {
              setIsCreatingRoute(true);
              setIsDrawing(false);
            }}
            disabled={isCreatingRoute || isDrawing}
          >
            🛣️ Create Safe Route
          </button>
          <button
            className="inspector-button"
            onClick={() => {
              setIsDrawing(true);
              setIsCreatingRoute(false);
            }}
            disabled={isCreatingRoute || isDrawing}
            style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}
          >
            🎨 Draw Danger Zone
          </button>
          <button className="inspector-button danger" onClick={handleSendBroadcastAlert}>
            📣 Broadcast Alert
          </button>
        </div>
      </div>

      {/* Map and other components remain the same */}
      {/* ... */}
    </div>
  );
}

// Add these new CSS styles to the GlobalStyles component
const enhancedStyles = `
  /* Enhanced Weather Widget Styles */
  .weather-current {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .weather-current:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }

  .weather-main {
    flex: 1;
  }

  .weather-current-temp {
    font-size: 2.5rem;
    font-weight: 800;
    color: #111827;
    line-height: 1;
  }

  .weather-current-desc {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 600;
    margin: 0.25rem 0;
  }

  .weather-toggle {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .weather-details {
    margin-top: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .weather-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .weather-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 8px;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-size: 0.875rem;
    font-weight: 700;
    color: #111827;
  }

  .weather-hourly h4 {
    font-size: 0.875rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .hourly-list {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .hourly-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
  }

  .hour-time {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .hour-icon {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }

  .hour-temp {
    font-size: 0.875rem;
    font-weight: 700;
    color: #111827;
  }

  /* Routes Manager Styles */
  .routes-manager {
    padding: 1rem;
  }

  .routes-header {
    margin-bottom: 1.5rem;
  }

  .routes-header h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
  }

  .routes-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .type-selector {
    display: flex;
    background: #f3f4f6;
    border-radius: 8px;
    padding: 4px;
  }

  .type-btn {
    padding: 0.5rem 0.75rem;
    border: none;
    background: none;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .type-btn.active {
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .undo-btn {
    padding: 0.5rem 0.75rem;
    border: none;
    background: #6b7280;
    color: white;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .undo-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .undo-btn:not(:disabled):hover {
    background: #4b5563;
  }

  .routes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 400px;
    overflow-y: auto;
  }

  .route-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-left: 4px solid #e5e7eb;
  }

  .route-item.danger-zone {
    border-left-color: #ef4444;
  }

  .route-item.safe-route {
    border-left-color: #10b981;
  }

  .route-info {
    flex: 1;
  }

  .route-name {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .route-details {
    display: flex;
    gap: 0.75rem;
    font-size: 0.75rem;
  }

  .severity-badge, .difficulty-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.625rem;
    text-transform: uppercase;
  }

  .severity-badge.high {
    background: #fee2e2;
    color: #dc2626;
  }

  .severity-badge.medium {
    background: #fef3c7;
    color: #d97706;
  }

  .severity-badge.low {
    background: #dcfce7;
    color: #16a34a;
  }

  .difficulty-badge.easy {
    background: #dcfce7;
    color: #16a34a;
  }

  .difficulty-badge.medium {
    background: #fef3c7;
    color: #d97706;
  }

  .difficulty-badge.hard {
    background: #fee2e2;
    color: #dc2626;
  }

  .route-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-edit, .btn-delete {
    padding: 0.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.3s ease;
  }

  .btn-edit {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .btn-delete {
    background: #fee2e2;
    color: #dc2626;
  }

  .btn-edit:hover, .btn-delete:hover {
    transform: scale(1.1);
  }

  .edit-form {
    width: 100%;
  }

  .edit-input, .edit-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .edit-actions {
    display: flex;
    gap: 0.5rem;
  }

  /* Enhanced Alert System Styles */
  .alert-toast {
    cursor: pointer;
    transition: all 0.3s ease;
    max-height: 80px;
    overflow: hidden;
  }

  .alert-toast.expanded {
    max-height: 200px;
  }

  .alert-toast:hover {
    transform: translateX(-4px);
  }

  .alert-system {
    position: fixed;
    top: 20px;
    right: 420px;
    z-index: 9999;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .alert-content {
    padding: 1rem;
  }

  .alert-message {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .alert-actions {
    padding: 0.75rem 1rem;
  }
`;

// Update the GlobalStyles component to include enhanced styles
function GlobalStyles() {
  return (
    <style>{`
      /* Existing styles... */
      ${enhancedStyles}
    `}</style>
  );
}