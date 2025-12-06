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

function AlertSystem({ alerts, onClearAlert }) {
  if (alerts.length === 0) return null;
  return (
    <div className="alert-system">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert-toast ${alert.type} ${alert.priority || ''}`}>
          <div className="alert-content">
            <div className="alert-icon">
              {alert.type === 'sos' ? '🆘' : 
               alert.type === 'risk' ? '⚠️' : 
               alert.type === 'zone' ? '🚨' : '🔔'}
            </div>
            <div className="alert-details">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-message">{alert.message}</div>
              <div className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
            <button className="alert-close" onClick={() => onClearAlert(alert.id)}>✕</button>
          </div>
          {alert.type === 'sos' && (
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

function useRiskDetection(trackers, dangerZones) {
  const calculateRiskForTracker = useCallback((tracker, zones) => {
    let riskScore = 0;
    const factors = [];
    const trackerPoint = turfPoint([tracker.lng, tracker.lat]);

    let inZone = false;
    let closestZoneDistance = Infinity;
    
    zones.forEach(zone => {
      const zonePolygon = turfPolygon(zone.turfCoords);
      if (booleanPointInPolygon(trackerPoint, zonePolygon)) {
        riskScore += zone.riskFactor || 80;
        factors.push(`Inside ${zone.name}`);
        inZone = true;
        closestZoneDistance = 0;
      } else {
        zone.coords.forEach(coord => {
          const distance = turfDistance(trackerPoint, turfPoint([coord[1], coord[0]]), { units: 'kilometers' });
          if (distance < closestZoneDistance) {
            closestZoneDistance = distance;
          }
        });
      }
    });

    if (!inZone && closestZoneDistance < 0.1) {
      riskScore += 40;
      factors.push('Near Danger Zone');
    } else if (!inZone && closestZoneDistance < 0.2) {
      riskScore += 20;
      factors.push('Approaching Danger Zone');
    }

    if (tracker.battery < 20) {
      riskScore += 25;
      factors.push('Critical Battery');
    } else if (tracker.battery < 40) {
      riskScore += 15;
      factors.push('Low Battery');
    }

    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      riskScore += 15;
      factors.push('Late Night');
    }

    const otherTourists = Object.values(trackers).filter(t => 
      t.type === 'tourist' && t.id !== tracker.id
    );
    let closestTouristDistance = Infinity;
    otherTourists.forEach(other => {
      const distance = turfDistance(
        trackerPoint,
        turfPoint([other.lng, other.lat]),
        { units: 'kilometers' }
      );
      if (distance < closestTouristDistance) {
        closestTouristDistance = distance;
      }
    });

    if (closestTouristDistance > 1) {
      riskScore += 15;
      factors.push('Isolated Location');
    }

    const status = inZone ? 'DANGER' : 
                   closestZoneDistance < 0.1 ? 'WARNING' : 
                   riskScore > 50 ? 'CAUTION' : 'Safe';

    return {
      level: Math.min(riskScore, 99),
      factors,
      inZone,
      closestTouristDistance,
      closestZoneDistance,
      status
    };
  }, []);

  return { calculateRiskForTracker };
}

function DashboardStats({ trackers, dangerZones, alerts }) {
  const stats = {
    totalTourists: Object.values(trackers).filter(t => t.type === 'tourist').length,
    highRiskTourists: Object.values(trackers).filter(t => t.riskLevel > 70).length,
    activeAlerts: alerts.filter(a => a.type === 'risk' || a.type === 'sos').length,
    dangerZones: dangerZones.length,
  };
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon tourist">👤</div>
        <div className="stat-info">
          <div className="stat-value">{stats.totalTourists}</div>
          <div className="stat-label">Total Tourists</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon risk">⚠️</div>
        <div className="stat-info">
          <div className="stat-value">{stats.highRiskTourists}</div>
          <div className="stat-label">High Risk</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon alert">🚨</div>
        <div className="stat-info">
          <div className="stat-value">{stats.activeAlerts}</div>
          <div className="stat-label">Active Alerts</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon zone">🔺</div>
        <div className="stat-info">
          <div className="stat-value">{stats.dangerZones}</div>
          <div className="stat-label">Danger Zones</div>
        </div>
      </div>
    </div>
  );
}

function TouristList({ trackers, selectedTrackerId, onTrackerSelect }) {
  const tourists = Object.values(trackers).filter(tracker => tracker.type === 'tourist')
    .sort((a, b) => b.riskLevel - a.riskLevel);

  const getRiskColor = (riskLevel) => {
    if (riskLevel > 70) return '#ef4444';
    if (riskLevel > 40) return '#f59e0b';
    return '#10b981';
  };

  const getStatusColor = (status) => {
    if (status === 'DANGER') return '#dc2626';
    if (status === 'WARNING') return '#f59e0b';
    if (status === 'CAUTION') return '#fb923c';
    return '#10b981';
  };

  return (
    <div className="tourist-list-sidebar">
      {tourists.map((tracker) => (
        <div
          key={tracker.id}
          className={`tourist-card-sidebar ${tracker.id === selectedTrackerId ? 'selected' : ''} ${
            tracker.riskLevel > 70 ? 'high-risk' : tracker.riskLevel > 40 ? 'medium-risk' : 'low-risk'
          }`}
          onClick={() => onTrackerSelect(tracker.id)}
        >
          <div className="tourist-header">
            <div className="tourist-avatar" style={{ background: getRiskColor(tracker.riskLevel) }}>
              {tracker.riskLevel > 70 ? '🚨' : '👤'}
            </div>
            <div className="tourist-info">
              <div className="tourist-name">{tracker.name}</div>
              <div className="tourist-group">{MOCK_TOURIST_INFO[tracker.infoId]?.group || 'N/A'}</div>
            </div>
            <div 
              className="risk-indicator"
              style={{ background: getRiskColor(tracker.riskLevel) }}
            >
              {tracker.riskLevel}%
            </div>
          </div>
          <div className="tourist-details">
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className="value" style={{ color: getStatusColor(tracker.status), fontWeight: 'bold' }}>
                {tracker.status}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Battery:</span>
              <span className="value">{tracker.battery.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourceManager({ trackers }) {
  const resources = Object.values(trackers).filter(t => t.type === 'ranger');
  return (
    <div className="resource-list">
      {resources.map(res => (
        <div key={res.id} className="resource-card">
          <div className="resource-icon">🛡️</div>
          <div className="resource-info">
            <div className="resource-name">{res.name}</div>
            <div className="resource-status" style={{ color: res.availability === 'On Patrol' ? '#10b981' : '#f59e0b' }}>
              {res.availability}
            </div>
          </div>
          <div className="resource-battery">
            {res.battery}% 🔋
          </div>
        </div>
      ))}
    </div>
  );
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  useEffect(() => {
    const fetchWeather = async () => {
      const [lat, lon] = MAP_CENTER;
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,weather_code',
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
          }
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
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
        <div className="weather-current">
          <div className="weather-current-icon">{weather.current.icon}</div>
          <div className="weather-current-temp">{weather.current.temp}°C</div>
          <div className="weather-current-location">New Delhi</div>
        </div>
      )}
    </div>
  );
}

function ProfileInspector({ tracker }) {
  const profile = MOCK_TOURIST_INFO[tracker.infoId];
  if (!profile) return <div className="inspector-content">No profile data for this tracker.</div>;
  
  return (
    <div className="inspector-content">
      <div className="tracker-stats">
        <h3 style={{ margin: '0 0 10px 0' }}>{profile.name}</h3>
        <div className="stat-item">
          <span>Phone:</span>
          <span>{profile.phone}</span>
        </div>
        <div className="stat-item">
          <span>Permit ID:</span>
          <span>{profile.permit}</span>
        </div>
        <div className="stat-item">
          <span>Group:</span>
          <span>{profile.group}</span>
        </div>
      </div>
      
      {profile.members.length > 0 && (
        <div className="profile-group-list">
          <h4>Group Members</h4>
          {profile.members.map(member => (
            <div key={member.id} className="profile-group-member">
              <span className="member-name">{member.name}</span>
              <span className="member-relation">{member.relation} {member.age && `(Age: ${member.age})`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PoiFinder({ selectedTracker, onRouteToPoi, persistentPois }) {
  const getClosestPois = () => {
    if (!selectedTracker || persistentPois.length === 0) return [];
    const trackerPoint = turfPoint([selectedTracker.lng, selectedTracker.lat]);
    const poisWithDistance = persistentPois.map(poi => {
      const poiPoint = turfPoint([poi.lng, poi.lat]);
      const distance = turfDistance(trackerPoint, poiPoint, { units: 'meters' });
      return { ...poi, distance };
    });
    poisWithDistance.sort((a, b) => a.distance - b.distance);
    return poisWithDistance.slice(0, 5);
  };
  const closestPois = getClosestPois();

  return (
    <div className="poi-finder">
      <h4 className="poi-finder-title">
        Nearest Utilities to <strong>{selectedTracker.name}</strong>
      </h4>
      <div className="poi-finder-list">
        {closestPois.length === 0 && <div className="empty-placeholder">No utilities found nearby.</div>}
        {closestPois.map(poi => (
          <div key={poi.id} className="poi-list-item">
            <div className="poi-icon" style={{ backgroundColor: poi.type === 'hospital' ? '#dc2626' : poi.type === 'police' ? '#2563eb' : '#14b8a6' }}>
              {poi.type === 'hospital' ? '🏥' : poi.type === 'police' ? '🚓' : '🛒'}
            </div>
            <div className="poi-details">
              <div className="poi-name">{poi.name}</div>
              <div className="poi-distance">~{(poi.distance / 1000).toFixed(2)} km away</div>
            </div>
            <button onClick={() => onRouteToPoi([poi.lat, poi.lng], poi.id)} className="btn-route">Route</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SafeRouteCreator({ onRouteCreated, isCreatingRoute, setIsCreatingRoute }) {
  const map = useMap();
  const [routePoints, setRoutePoints] = useState([]);
  
  useEffect(() => {
    if (!isCreatingRoute) {
      setRoutePoints([]);
      return;
    }

    const handleClick = (e) => {
      setRoutePoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
    };

    map.on('click', handleClick);
    map.getContainer().style.cursor = 'crosshair';

    return () => {
      map.off('click', handleClick);
      map.getContainer().style.cursor = '';
    };
  }, [map, isCreatingRoute]);

  const finishRoute = () => {
    if (routePoints.length < 2) {
      alert('Need at least 2 points to create a route');
      return;
    }
    const name = prompt('Route Name:', `Safe Route ${Math.floor(Math.random() * 1000)}`);
    if (!name) return;
    
    let length = 0;
    for(let i = 0; i < routePoints.length - 1; i++) {
      length += turfDistance(
        turfPoint([routePoints[i][1], routePoints[i][0]]), 
        turfPoint([routePoints[i+1][1], routePoints[i+1][0]]),
        { units: 'meters' }
      );
    }

    onRouteCreated({
      id: `route-${Date.now()}`, 
      name, 
      coords: routePoints, 
      difficulty: 'easy', 
      length: length,
      elevationGain: Math.random() * 50, 
      createdAt: new Date().toISOString(), 
      description: 'New safe route'
    });
    setRoutePoints([]);
    setIsCreatingRoute(false);
  };

  if (!isCreatingRoute) return null;

  return (
    <>
      <div className="map-control-panel">
        <h3>🛣️ Create Safe Route</h3>
        <p>Click on the map to add points.</p>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Points: {routePoints.length}</div>
        <div className="map-control-actions">
          <button className="btn-success" onClick={finishRoute} disabled={routePoints.length < 2}>
            Finish Route
          </button>
          <button className="btn-secondary" onClick={() => setRoutePoints(prev => prev.slice(0, -1))} disabled={routePoints.length === 0}>
            Remove Last
          </button>
          <button className="btn-danger" onClick={() => { setRoutePoints([]); setIsCreatingRoute(false); }}>
            Cancel
          </button>
        </div>
      </div>
      {routePoints.length > 0 && (
        <Polyline positions={routePoints} pathOptions={{ color: '#10b981', weight: 6, opacity: 0.8 }} />
      )}
    </>
  );
}

function DrawingControls({ onZoneCreated, isDrawing, setIsDrawing }) {
  const map = useMap();
  const [tempPoints, setTempPoints] = useState([]);

  useEffect(() => {
    if (!isDrawing) {
      setTempPoints([]);
      return;
    }

    const handleClick = (e) => {
      setTempPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
    };

    map.on('click', handleClick);
    map.getContainer().style.cursor = 'crosshair';

    return () => {
      map.off('click', handleClick);
      map.getContainer().style.cursor = '';
    };
  }, [map, isDrawing]);

  const finishDrawing = () => {
    if (tempPoints.length < 3) {
      alert('Need at least 3 points to create a danger zone');
      return;
    }
    const name = prompt('Zone Name:', `Danger Zone ${Math.floor(Math.random() * 100)}`);
    if (!name) return;
    
    const turfCoords = [[ 
      ...tempPoints.map(p => [p[1], p[0]]), 
      [tempPoints[0][1], tempPoints[0][0]] 
    ]];
    
    onZoneCreated({
      id: `dz-${Date.now()}`, 
      name, 
      coords: [...tempPoints, tempPoints[0]],
      turfCoords, 
      severity: 'high', 
      riskFactor: 80
    });
    setTempPoints([]);
    setIsDrawing(false);
  };

  if (!isDrawing) return null;
  
  return (
    <>
      <div className="map-control-panel">
        <h3>🚨 Draw Danger Zone</h3>
        <p>Click on the map to create polygon points.</p>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Points: {tempPoints.length}</div>
        <div className="map-control-actions">
          <button className="btn-warning" onClick={finishDrawing} disabled={tempPoints.length < 3}>
            Finish Zone
          </button>
          <button className="btn-secondary" onClick={() => setTempPoints(prev => prev.slice(0, -1))} disabled={tempPoints.length === 0}>
            Remove Last
          </button>
          <button className="btn-danger" onClick={() => { setTempPoints([]); setIsDrawing(false); }}>
            Cancel
          </button>
        </div>
      </div>
      {tempPoints.length > 0 && (
        <Polygon 
          positions={[...tempPoints, tempPoints[0]]} 
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2 }} 
        />
      )}
    </>
  );
}

function AiAlertRoute({ routeGeoJSON }) {
  if (!routeGeoJSON) return null;
  const leafletPath = routeGeoJSON.coordinates.map(coord => [coord[1], coord[0]]);
  return (
    <Polyline
      positions={leafletPath}
      pathOptions={{
        color: '#dc2626', 
        weight: 8, 
        opacity: 0.9,
        className: 'poi-route-path'
      }}
    />
  );
}

function MapDeselector({ onDeselect }) {
  useMapEvents({
    click: (e) => {
      if (e.originalEvent.target.classList.contains('leaflet-container')) {
        onDeselect();
      }
    },
  });
  return null;
}

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      
      .dashboard-layout {
        display: grid;
        grid-template-columns: 340px 1fr 400px;
        grid-template-rows: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #1f2937;
      }
      
      .dashboard-layout.fullscreen-map {
        grid-template-columns: 0 1fr 0;
      }
      
      .dashboard-layout.fullscreen-map .sidebar,
      .dashboard-layout.fullscreen-map .inspector {
        display: none;
      }
      
      .sidebar, .inspector {
        background: white;
        display: flex;
        flex-direction: column;
        max-height: 100vh;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 10;
      }
      
      .header {
        padding: 1.5rem;
        font-size: 1.25rem;
        font-weight: 700;
        border-bottom: 2px solid #e5e7eb;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .tab-bar { 
        display: flex; 
        border-bottom: 2px solid #e5e7eb;
        background: #f9fafb;
      }
      
      .tab-button {
        flex: 1; 
        background: none; 
        border: none; 
        padding: 1rem 0.5rem;
        font-size: 0.875rem; 
        font-weight: 600; 
        cursor: pointer; 
        color: #6b7280;
        border-bottom: 3px solid transparent; 
        transition: all 0.3s ease;
      }
      
      .tab-button:hover { 
        background: #f3f4f6; 
        color: #4b5563;
      }
      
      .tab-button.active { 
        color: #667eea; 
        border-bottom-color: #667eea;
        background: white;
      }
      
      .tab-content { 
        flex-grow: 1; 
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #d1d5db #f9fafb;
      }
      
      .tab-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .tab-content::-webkit-scrollbar-track {
        background: #f9fafb;
      }
      
      .tab-content::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
      }
      
      .tourist-list-sidebar { 
        flex-grow: 1; 
        overflow-y: auto; 
      }
      
      .tourist-card-sidebar {
        padding: 1.25rem;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer; 
        transition: all 0.3s ease;
        position: relative;
      }
      
      .tourist-card-sidebar:hover { 
        background: #f9fafb;
        transform: translateX(4px);
      }
      
      .tourist-card-sidebar.selected { 
        background: linear-gradient(135deg, #e0e7ff 0%, #e9d5ff 100%);
        border-right: 4px solid #667eea;
      }
      
      .tourist-card-sidebar.high-risk { 
        background: #fee2e2; 
        border-right: 4px solid #ef4444;
      }
      
      .tourist-card-sidebar.medium-risk { 
        background: #fef3c7; 
        border-right: 4px solid #f59e0b;
      }
      
      .tourist-header { 
        display: flex; 
        align-items: center; 
        gap: 1rem; 
        margin-bottom: 0.875rem;
      }
      
      .tourist-avatar {
        width: 48px; 
        height: 48px; 
        border-radius: 12px;
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 1.25rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      
      .tourist-info { 
        flex: 1; 
        min-width: 0;
      }
      
      .tourist-name {
        font-weight: 700; 
        font-size: 1rem; 
        color: #111827;
        margin-bottom: 0.25rem; 
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis;
      }
      
      .tourist-group { 
        font-size: 0.8rem; 
        color: #6b7280;
        font-weight: 500;
      }
      
      .risk-indicator {
        padding: 6px 12px; 
        border-radius: 24px; 
        color: white;
        font-size: 0.875rem; 
        font-weight: 700;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      
      .tourist-details { 
        display: grid; 
        gap: 0.625rem;
        background: rgba(255,255,255,0.6);
        padding: 0.75rem;
        border-radius: 8px;
      }
      
      .detail-item { 
        display: flex; 
        justify-content: space-between; 
        align-items: center;
      }
      
      .detail-item .label { 
        font-size: 0.8rem; 
        color: #6b7280;
        font-weight: 500;
      }
      
      .detail-item .value { 
        font-size: 0.875rem; 
        font-weight: 700; 
        color: #111827;
      }

      .resource-list { 
        padding: 1.25rem; 
        display: flex; 
        flex-direction: column; 
        gap: 1rem;
      }
      
      .resource-card {
        display: flex; 
        align-items: center; 
        gap: 1rem;
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        padding: 1.25rem; 
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
      }
      
      .resource-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      }
      
      .resource-icon { 
        font-size: 2rem;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      }
      
      .resource-info { 
        flex: 1;
      }
      
      .resource-name { 
        font-weight: 700; 
        font-size: 1rem;
        color: #111827;
      }
      
      .resource-status { 
        font-size: 0.875rem; 
        font-weight: 600;
        margin-top: 0.25rem;
      }
      
      .resource-battery { 
        font-size: 0.875rem; 
        color: #6b7280;
        font-weight: 600;
      }

      .weather-widget { 
        padding: 1.5rem;
      }
      
      .weather-current {
        display: flex; 
        flex-direction: column; 
        align-items: center;
        padding: 2rem 1rem;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .weather-current-icon { 
        font-size: 4rem;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
        margin-bottom: 0.5rem;
      }
      
      .weather-current-temp { 
        font-size: 3rem; 
        font-weight: 800; 
        color: #111827;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .weather-current-location { 
        font-size: 1rem; 
        color: #6b7280;
        font-weight: 600;
        margin-top: 0.5rem;
      }
      
      .map-container-wrapper { 
        height: 100vh; 
        position: relative;
        background: #1f2937;
      }
      
      .leaflet-container { 
        height: 100%; 
        width: 100%;
      }
      
      .fullscreen-toggle {
        position: absolute; 
        top: 20px; 
        right: 20px; 
        z-index: 1000;
        background: white; 
        border: none; 
        border-radius: 12px;
        padding: 12px 20px; 
        cursor: pointer; 
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        font-size: 0.875rem;
        font-weight: 700;
        display: flex; 
        align-items: center; 
        gap: 8px;
        transition: all 0.3s ease;
        color: #667eea;
      }
      
      .fullscreen-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0,0,0,0.4);
      }
      
      .inspector-content { 
        padding: 1.5rem;
      }
      
      .inspector-placeholder {
        padding: 3rem 1.5rem; 
        text-align: center; 
        color: #9ca3af;
        font-style: italic;
      }
      
      .stats-grid {
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 1rem;
        padding: 1rem;
        background: #f9fafb;
      }
      
      .stat-card {
        background: white;
        border: 2px solid #e5e7eb; 
        border-radius: 16px;
        padding: 1.25rem; 
        display: flex; 
        align-items: center; 
        gap: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        transition: all 0.3s ease;
      }
      
      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.12);
      }
      
      .stat-icon {
        width: 48px; 
        height: 48px; 
        border-radius: 14px;
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 1.5rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
      
      .stat-icon.tourist { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); }
      .stat-icon.risk { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }
      .stat-icon.alert { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); }
      .stat-icon.zone { background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%); }
      
      .stat-value { 
        font-size: 1.75rem; 
        font-weight: 800; 
        color: #111827;
        line-height: 1;
      }
      
      .stat-label { 
        font-size: 0.75rem; 
        color: #6b7280;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 0.25rem;
      }

      .tracker-stats {
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        padding: 1.25rem; 
        border-radius: 12px; 
        margin-bottom: 1.25rem;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
      }
      
      .stat-item {
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 0.875rem; 
        font-size: 0.9375rem;
      }
      
      .stat-item span:first-child { 
        color: #6b7280;
        font-weight: 600;
      }
      
      .stat-item span:last-child { 
        font-weight: 700;
        color: #111827;
      }
      
      .profile-group-list { 
        margin-top: 1.25rem;
      }
      
      .profile-group-list h4 { 
        font-size: 0.9375rem; 
        font-weight: 700; 
        color: #374151;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .profile-group-member {
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        background: white;
        padding: 0.75rem 1rem; 
        border-radius: 8px;
        font-size: 0.9375rem; 
        margin-bottom: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
      }
      
      .profile-group-member:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      }
      
      .member-name { 
        font-weight: 600;
        color: #111827;
      }
      
      .member-relation { 
        font-size: 0.8125rem; 
        color: #6b7280;
        font-weight: 500;
      }

      .inspector-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white; 
        border: none; 
        padding: 0.875rem 1.25rem;
        border-radius: 10px; 
        cursor: pointer; 
        font-size: 0.9375rem;
        width: 100%;
        transition: all 0.3s ease;
        margin-bottom: 0.75rem; 
        display: flex;
        align-items: center; 
        justify-content: center; 
        gap: 10px; 
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
      
      .inspector-button:hover { 
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
      }
      
      .inspector-button:active {
        transform: translateY(0);
      }
      
      .inspector-button:disabled { 
        background: #d1d5db;
        cursor: not-allowed;
        box-shadow: none;
      }
      
      .inspector-button.secondary { 
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
      }
      
      .inspector-button.secondary:hover { 
        box-shadow: 0 6px 16px rgba(107, 114, 128, 0.4);
      }
      
      .inspector-button.danger { 
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
      
      .inspector-button.danger:hover { 
        box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
      }
      
      .inspector-button.success { 
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      .inspector-button.success:hover { 
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
      }
      
      .poi-finder { 
        padding: 1.5rem;
      }
      
      .poi-finder-title { 
        font-size: 1.0625rem; 
        font-weight: 700; 
        margin: 0 0 1.25rem 0;
        color: #111827;
      }
      
      .poi-finder-list { 
        max-height: 400px; 
        overflow-y: auto;
      }
      
      .poi-list-item {
        display: flex; 
        align-items: center; 
        gap: 12px;
        padding: 1rem 0; 
        border-bottom: 1px solid #f3f4f6;
        transition: all 0.2s ease;
      }
      
      .poi-list-item:hover {
        background: #f9fafb;
        padding-left: 8px;
        margin-left: -8px;
        margin-right: -8px;
        padding-right: 8px;
        border-radius: 8px;
      }
      
      .poi-icon {
        width: 40px; 
        height: 40px; 
        border-radius: 50%; 
        display: flex;
        align-items: center; 
        justify-content: center; 
        color: white; 
        font-size: 1.125rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      
      .poi-details { 
        flex: 1; 
        min-width: 0;
      }
      
      .poi-name { 
        font-weight: 700; 
        font-size: 0.9375rem;
        color: #111827;
        margin-bottom: 0.25rem;
      }
      
      .poi-distance { 
        font-size: 0.8125rem; 
        color: #6b7280;
        font-weight: 500;
      }
      
      .btn-route {
        background: none; 
        border: 2px solid #667eea; 
        color: #667eea;
        padding: 6px 16px; 
        border-radius: 8px; 
        font-size: 0.8125rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .btn-route:hover {
        background: #667eea;
        color: white;
        transform: scale(1.05);
      }
      
      .empty-placeholder, .loading-placeholder { 
        text-align: center; 
        color: #9ca3af;
        font-style: italic; 
        padding: 2rem;
        font-size: 0.9375rem;
      }

      .map-control-panel {
        position: absolute; 
        top: 20px; 
        right: 20px; 
        z-index: 1000;
        background: white; 
        padding: 1.75rem; 
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2); 
        min-width: 320px;
        backdrop-filter: blur(10px);
      }
      
      .map-control-panel h3 {
        font-size: 1.25rem; 
        font-weight: 800; 
        color: #111827;
        margin: 0 0 1rem 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .map-control-panel p { 
        font-size: 0.875rem; 
        color: #6b7280;
        margin: 0 0 1.25rem 0;
        font-weight: 500;
      }
      
      .map-control-actions { 
        display: flex; 
        gap: 0.625rem; 
        flex-wrap: wrap;
      }
      
      .btn-success { 
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        padding: 0.625rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        flex: 1;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
      }
      
      .btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      }
      
      .btn-success:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      
      .btn-warning { 
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        border: none;
        padding: 0.625rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        flex: 1;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
      }
      
      .btn-warning:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
      }
      
      .btn-warning:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      
      .btn-danger { 
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border: none;
        padding: 0.625rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
      }
      
      .btn-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      }
      
      .btn-secondary { 
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        color: white;
        border: none;
        padding: 0.625rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
      }
      
      .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
      }
      
      .btn-secondary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      
      .custom-marker-icon {
        width: 36px; 
        height: 36px; 
        border-radius: 50%; 
        border: 3px solid white;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4); 
        display: flex;
        align-items: center; 
        justify-content: center; 
        font-size: 1rem;
        font-weight: bold; 
        position: relative;
      }
      
      .risk-badge {
        position: absolute; 
        top: -6px; 
        right: -6px; 
        background: #ef4444;
        color: white; 
        border-radius: 50%; 
        width: 18px; 
        height: 18px;
        font-size: 10px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid white;
      }
      
      .risk-level {
        position: absolute; 
        top: -26px; 
        left: 50%; 
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9); 
        color: white; 
        padding: 3px 8px;
        border-radius: 12px; 
        font-size: 10px; 
        font-weight: 800; 
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }
      
      .pulse-high-risk { 
        animation: pulse-high-risk 1.5s infinite;
      }
      
      .pulse-medium-risk { 
        animation: pulse-medium-risk 2s infinite;
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes pulse-high-risk {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { box-shadow: 0 0 0 18px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }
      
      @keyframes pulse-medium-risk {
        0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
        70% { box-shadow: 0 0 0 12px rgba(245, 158, 11, 0); }
        100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
      }
      
      .poi-route-path {
        stroke-dasharray: 12, 8;
        animation: marching-ants 20s linear infinite;
      }
      
      @keyframes marching-ants {
        from { stroke-dashoffset: 200; }
        to { stroke-dashoffset: 0; }
      }

      .ai-modal-backdrop {
        position: fixed; 
        inset: 0; 
        background: rgba(0,0,0,0.7);
        z-index: 5000; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.3s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .ai-modal-content {
        background: white; 
        border-radius: 20px; 
        max-width: 540px;
        width: 90%; 
        padding: 2rem; 
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease-out;
      }
      
      @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .ai-modal-header {
        font-size: 1.5rem; 
        font-weight: 800; 
        color: #111827;
        margin: 0 0 1.25rem 0; 
        display: flex; 
        align-items: center; 
        gap: 12px;
      }
      
      .ai-modal-body {
        font-size: 1rem; 
        line-height: 1.7; 
        color: #374151;
      }
      
      .ai-modal-body strong { 
        color: #111827;
        font-weight: 700;
      }
      
      .ai-modal-body .ai-message {
        background: #f9fafb; 
        border: 2px solid #e5e7eb;
        padding: 1.25rem; 
        border-radius: 12px; 
        margin-top: 1.25rem;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
      }
      
      .ai-modal-footer {
        display: flex; 
        gap: 12px; 
        justify-content: flex-end; 
        margin-top: 1.75rem;
      }
      
      .alert-system {
        position: fixed; 
        top: 20px; 
        right: 420px; 
        z-index: 9999;
        max-width: 420px; 
        display: flex; 
        flex-direction: column; 
        gap: 12px;
      }
      
      .alert-toast {
        background: white; 
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        animation: slideInRight 0.4s ease-out;
        overflow: hidden;
        border: 2px solid transparent;
      }
      
      .alert-toast.risk { 
        border-left: 6px solid #f59e0b;
        background: linear-gradient(to right, #fffbeb 0%, white 10%);
      }
      
      .alert-toast.sos { 
        border-left: 6px solid #ef4444;
        background: linear-gradient(to right, #fef2f2 0%, white 10%);
      }
      
      .alert-toast.zone { 
        border-left: 6px solid #f97316;
        background: linear-gradient(to right, #fff7ed 0%, white 10%);
      }
      
      .alert-toast.broadcast { 
        border-left: 6px solid #3b82f6;
        background: linear-gradient(to right, #eff6ff 0%, white 10%);
      }
      
      .alert-content {
        padding: 1.25rem 1.5rem; 
        display: flex;
        align-items: flex-start; 
        gap: 14px;
      }
      
      .alert-icon { 
        font-size: 1.5rem; 
        margin-top: 2px;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      }
      
      .alert-details { 
        flex: 1;
      }
      
      .alert-title {
        font-weight: 800; 
        font-size: 0.9375rem;
        margin-bottom: 6px; 
        color: #111827;
        letter-spacing: 0.3px;
      }
      
      .alert-message { 
        font-size: 0.875rem; 
        color: #4b5563;
        margin-bottom: 8px;
        line-height: 1.5;
      }
      
      .alert-time { 
        font-size: 0.75rem; 
        color: #9ca3af;
        font-weight: 600;
      }
      
      .alert-close {
        background: rgba(0,0,0,0.05); 
        border: none; 
        color: #6b7280;
        border-radius: 50%; 
        width: 28px; 
        height: 28px; 
        cursor: pointer;
        font-size: 0.875rem; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        transition: all 0.2s ease;
        font-weight: bold;
      }
      
      .alert-close:hover {
        background: rgba(0,0,0,0.1);
        transform: scale(1.1);
      }
      
      .alert-actions {
        padding: 12px 1.5rem; 
        background: #f9fafb;
        display: flex; 
        gap: 10px;
        border-top: 1px solid #e5e7eb;
      }
      
      .btn-alert-action {
        padding: 8px 16px; 
        border: none; 
        border-radius: 8px;
        font-size: 0.8125rem; 
        cursor: pointer; 
        flex: 1;
        font-weight: 700;
        transition: all 0.3s ease;
      }
      
      .btn-alert-action.primary { 
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
      }
      
      .btn-alert-action.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      }
      
      .btn-alert-action.secondary { 
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
      }
      
      .btn-alert-action.secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
      }
      
      .sidebar-footer {
        padding: 1.25rem;
        border-top: 2px solid #e5e7eb;
        background: #f9fafb;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      }
      
      .leaflet-popup-content {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 0.875rem;
        font-weight: 600;
      }
    `}</style>
  );
}

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackers(prevTrackers => {
        const newTrackers = { ...prevTrackers };
        const newAlerts = [];

        Object.keys(newTrackers).forEach(id => {
          const tracker = newTrackers[id];
          if (tracker.type === 'tourist') {
            tracker.lat += (Math.random() - 0.5) * 0.0008;
            tracker.lng += (Math.random() - 0.5) * 0.0008;
            tracker.battery = Math.max(0, tracker.battery - 0.03);
            tracker.lastUpdate = new Date().toISOString();

            const riskData = calculateRiskForTracker(tracker, dangerZones);
            tracker.riskLevel = Math.round(riskData.level);
            tracker.status = riskData.status;

            if (riskData.level > 70 && tracker.riskLevel <= 70) {
              newAlerts.push({
                id: Date.now() + Math.random(),
                trackerId: id,
                trackerName: tracker.name,
                type: 'risk',
                title: 'HIGH RISK ALERT',
                message: `${tracker.name} is at ${tracker.riskLevel}% risk - ${riskData.factors.join(', ')}`,
                timestamp: new Date().toISOString(),
                priority: 'high'
              });
            }

            if (riskData.status === 'DANGER' && !alerts.some(a => a.trackerId === id && a.type === 'sos')) {
              newAlerts.push({
                id: Date.now() + Math.random(),
                trackerId: id,
                trackerName: tracker.name,
                type: 'sos',
                title: '🚨 DANGER ZONE ENTRY',
                message: `${tracker.name} has entered a danger zone!`,
                timestamp: new Date().toISOString(),
                priority: 'critical'
              });
            }
          }
        });

        if (newAlerts.length > 0) {
          setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
        }

        return newTrackers;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [dangerZones, calculateRiskForTracker, alerts]);

  const handleTrackerSelect = (id) => {
    setSelectedTrackerId(id);
    setRightTab('inspector');
    setAiRoute(null);
    const tracker = trackers[id];
    if (tracker && mapRef.current) {
      mapRef.current.flyTo([tracker.lat, tracker.lng], 17, { duration: 1 });
    }
  };
  
  const handleMapDeselect = () => {
    setSelectedTrackerId(null);
    setAiRoute(null);
  };

  const handleZoneCreated = (newZone) => {
    setDangerZones((current) => [...current, newZone]);
    setAlerts(prev => [{
      id: Date.now(),
      type: 'zone',
      title: '🗺️ MAP UPDATE',
      message: `Danger Zone "${newZone.name}" created successfully.`,
      timestamp: new Date().toISOString(),
      priority: 'low'
    }, ...prev]);
  };

  const handleRouteCreated = (newRoute) => {
    setSafeRoutes(current => [...current, newRoute]);
    setAlerts(prev => [{
      id: Date.now(),
      type: 'zone',
      title: '🗺️ MAP UPDATE',
      message: `Safe Route "${newRoute.name}" created successfully.`,
      timestamp: new Date().toISOString(),
      priority: 'low'
    }, ...prev]);
  };

  const handleClearAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };
  
  const handleSendAiAlert = async () => {
    if (!selectedTrackerId || persistentPois.length === 0) {
      alert("No tracker selected or POIs not loaded.");
      return;
    }
    
    const tracker = trackers[selectedTrackerId];
    const trackerPoint = turfPoint([tracker.lng, tracker.lat]);

    let closestHelp = null;
    let minDistance = Infinity;
    
    persistentPois.filter(p => p.type === 'hospital' || p.type === 'police').forEach(poi => {
      const poiPoint = turfPoint([poi.lng, poi.lat]);
      const distance = turfDistance(trackerPoint, poiPoint, { units: 'kilometers' });
      if (distance < minDistance) {
        minDistance = distance;
        closestHelp = poi;
      }
    });

    if (!closestHelp) {
      alert("No nearby help (hospital or police) found.");
      return;
    }

    const [userLat, userLng] = [tracker.lat, tracker.lng];
    const [targetLat, targetLng] = [closestHelp.lat, closestHelp.lng];
    const url = `${OSRM_API_URL}/${userLng},${userLat};${targetLng},${targetLat}?steps=true&geometries=geojson&overview=full`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('OSRM API failed');
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }
      
      const route = data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMin = (route.duration / 60).toFixed(0);
      const firstStep = route.legs[0]?.steps[0]?.maneuver?.instruction || 'Head towards destination';

      const aiMessage = `
        <strong>To ${tracker.name} (via SMS/App):</strong><br/><br/>
        "⚠️ High risk detected in your area. The nearest ${closestHelp.type} is 
        <strong>${closestHelp.name}</strong>, approximately <strong>${distanceKm} km</strong> 
        away (${durationMin} min).<br/><br/>
        <strong>First Direction:</strong> ${firstStep}.<br/><br/>
        A detailed route has been sent to your device. Please proceed with caution and contact authorities if needed."
      `;
      
      setAiAlertModal({
        isOpen: true,
        message: aiMessage,
        onConfirm: () => {
          setAiRoute(route.geometry);
          setAiAlertModal({ isOpen: false, message: '', onConfirm: () => {} });
          setAlerts(prev => [{
            id: Date.now(),
            type: 'broadcast',
            title: '🤖 AI ALERT SENT',
            message: `Sent emergency directions to ${closestHelp.name} to ${tracker.name}.`,
            timestamp: new Date().toISOString(),
            priority: 'high',
            trackerId: tracker.id
          }, ...prev]);
        }
      });

    } catch (error) {
      console.error("Error in AI Alert:", error);
      alert(`Failed to generate AI alert: ${error.message}`);
    }
  };
  
  const handleSendBroadcastAlert = () => {
    const message = prompt("Enter broadcast message for all tourists:");
    if (!message) return;
    
    const alert = {
      id: Date.now(),
      type: 'broadcast',
      title: '📣 BROADCAST ALERT',
      message: message,
      timestamp: new Date().toISOString(),
      priority: 'critical'
    };
    setAlerts(prev => [alert, ...prev]);
  };
  
  const handleRouteToPoi = async (poiCoords) => {
    if (!selectedTrackerId) return;
    const tracker = trackers[selectedTrackerId];
    const [userLat, userLng] = [tracker.lat, tracker.lng];
    const [targetLat, targetLng] = poiCoords;
    const url = `${OSRM_API_URL}/${userLng},${userLat};${targetLng},${targetLat}?steps=false&geometries=geojson&overview=full`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('OSRM API failed');
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        setAiRoute(data.routes[0].geometry);
        const bounds = L.latLngBounds([userLat, userLng], poiCoords);
        if (mapRef.current) {
          mapRef.current.fitBounds(bounds, { padding: [80, 80] });
        }
      }
    } catch (error) {
      console.error('Error fetching OSRM route:', error);
      alert(`Could not calculate route: ${error.message}`);
    }
  };

  const selectedTracker = selectedTrackerId ? trackers[selectedTrackerId] : null;

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

      <div className="map-container-wrapper">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          maxZoom={19}
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
        >
          <MapDeselector onDeselect={handleMapDeselect} />
          
          <LayersControl position="topright">
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
            
            <LayersControl.Overlay checked name="🏥 Hospitals">
              <FeatureGroup>
                {persistentPois.filter(p => p.type === 'hospital').map(poi => (
                  <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={createCustomIcon(poi.type)}>
                    <Popup><strong>{poi.name}</strong><br/>Hospital</Popup>
                  </Marker>
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>
            
            <LayersControl.Overlay checked name="🚓 Police">
              <FeatureGroup>
                {persistentPois.filter(p => p.type === 'police').map(poi => (
                  <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={createCustomIcon(poi.type)}>
                    <Popup><strong>{poi.name}</strong><br/>Police Station</Popup>
                  </Marker>
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>
            
            <LayersControl.Overlay name="🛒 Shops">
              <FeatureGroup>
                {persistentPois.filter(p => p.type === 'shop').map(poi => (
                  <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={createCustomIcon(poi.type)}>
                    <Popup><strong>{poi.name}</strong><br/>Shop</Popup>
                  </Marker>
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="🚨 Danger Zones">
              <FeatureGroup>
                {dangerZones.map((zone) => (
                  <Polygon
                    key={zone.id}
                    positions={zone.coords}
                    pathOptions={{
                      color: '#ef4444', 
                      fillColor: '#ef4444', 
                      fillOpacity: 0.25, 
                      weight: 3,
                    }}
                  >
                    <Popup><strong>🚨 {zone.name}</strong><br/>Risk Factor: {zone.riskFactor}%</Popup>
                  </Polygon>
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>
            
            <LayersControl.Overlay checked name="🛣️ Safe Routes">
              <FeatureGroup>
                {safeRoutes.map((route) => (
                  <Polyline
                    key={route.id}
                    positions={route.coords}
                    pathOptions={{ 
                      color: '#10b981', 
                      weight: 5, 
                      opacity: 0.8, 
                      dashArray: '8, 12' 
                    }}
                  >
                    <Popup><strong>🛣️ {route.name}</strong><br/>Length: {(route.length / 1000).toFixed(1)} km</Popup>
                  </Polyline>
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>
          </LayersControl>
          
          <DrawingControls
            onZoneCreated={handleZoneCreated}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
          />
          
          <SafeRouteCreator
            onRouteCreated={handleRouteCreated}
            isCreatingRoute={isCreatingRoute}
            setIsCreatingRoute={setIsCreatingRoute}
          />

          {Object.entries(trackers).map(([id, tracker]) => (
            <Marker
              key={id}
              position={[tracker.lat, tracker.lng]}
              icon={createCustomIcon(tracker.type, tracker.riskLevel)}
              zIndexOffset={id === selectedTrackerId ? 1000 : 500}
              eventHandlers={{ 
                click: (e) => { 
                  L.DomEvent.stopPropagation(e); 
                  handleTrackerSelect(id); 
                } 
              }}
            >
              <Popup>
                <strong>{tracker.name}</strong> ({tracker.type})<br />
                Risk: {tracker.riskLevel}%<br/>
                Status: {tracker.status}<br/>
                Battery: {tracker.battery.toFixed(0)}%
              </Popup>
            </Marker>
          ))}
          
          <AiAlertRoute routeGeoJSON={aiRoute} />

        </MapContainer>
      </div>

      <div className="inspector">
        {selectedTracker ? (
          <>
            <div className="header">🔍 Inspector</div>
            <DashboardStats 
              trackers={trackers} 
              dangerZones={dangerZones} 
              alerts={alerts} 
            />
            <div className="tab-bar">
              <button
                className={`tab-button ${rightTab === 'inspector' ? 'active' : ''}`}
                onClick={() => setRightTab('inspector')}
              >
                Details
              </button>
              <button
                className={`tab-button ${rightTab === 'profile' ? 'active' : ''}`}
                onClick={() => setRightTab('profile')}
              >
                Profile
              </button>
              <button
                className={`tab-button ${rightTab === 'find' ? 'active' : ''}`}
                onClick={() => setRightTab('find')}
              >
                Find Nearby
              </button>
            </div>
            
            <div className="tab-content">
              {rightTab === 'inspector' && (
                <div className="inspector-content">
                  <div className="tracker-stats">
                    <h3 style={{ margin: '0 0 1rem 0' }}>{selectedTracker.name}</h3>
                    <div className="stat-item">
                      <span>Risk Level:</span>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: selectedTracker.riskLevel > 70 ? '#ef4444' : 
                               selectedTracker.riskLevel > 40 ? '#f59e0b' : '#10b981' 
                      }}>
                        {selectedTracker.riskLevel}%
                      </span>
                    </div>
                    <div className="stat-item">
                      <span>Status:</span>
                      <span style={{
                        fontWeight: 'bold',
                        color: selectedTracker.status === 'DANGER' ? '#dc2626' :
                               selectedTracker.status === 'WARNING' ? '#f59e0b' :
                               selectedTracker.status === 'CAUTION' ? '#fb923c' : '#10b981'
                      }}>
                        {selectedTracker.status}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span>Battery:</span>
                      <span>{selectedTracker.battery.toFixed(0)}%</span>
                    </div>
                    <div className="stat-item">
                      <span>Coordinates:</span>
                      <span>{selectedTracker.lat.toFixed(5)}, {selectedTracker.lng.toFixed(5)}</span>
                    </div>
                    <div className="stat-item">
                      <span>Last Update:</span>
                      <span>{new Date(selectedTracker.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="inspector-button danger" 
                    onClick={handleSendAiAlert}
                  >
                    🤖 Send AI-Powered Alert
                  </button>
                  <button 
                    className="inspector-button secondary" 
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.flyTo([selectedTracker.lat, selectedTracker.lng], 18, { duration: 1.5 });
                      }
                    }}
                  >
                    📍 Center on Map
                  </button>
                </div>
              )}
              
              {rightTab === 'profile' && (
                <ProfileInspector tracker={selectedTracker} />
              )}
              
              {rightTab === 'find' && (
                <PoiFinder 
                  selectedTracker={selectedTracker}
                  onRouteToPoi={handleRouteToPoi}
                  persistentPois={persistentPois}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="header">🔍 Inspector</div>
            <DashboardStats 
              trackers={trackers} 
              dangerZones={dangerZones} 
              alerts={alerts} 
            />
            <div className="inspector-placeholder">
              👈 Select a tracker from the map or sidebar to view details, send alerts, and find nearby utilities.
            </div>
          </>
        )}
      </div>
      
      {aiAlertModal.isOpen && (
        <div className="ai-modal-backdrop" onClick={() => setAiAlertModal({ isOpen: false, message: '', onConfirm: () => {} })}>
          <div className="ai-modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="ai-modal-header">
              🤖 AI-Generated Emergency Alert
            </h3>
            <div className="ai-modal-body">
              Confirm sending the following AI-generated message:
              <div className="ai-message" dangerouslySetInnerHTML={{ __html: aiAlertModal.message }} />
            </div>
            <div className="ai-modal-footer">
              <button 
                className="inspector-button secondary" 
                onClick={() => setAiAlertModal({ isOpen: false, message: '', onConfirm: () => {} })}
                style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
              >
                Cancel
              </button>
              <button 
                className="inspector-button success" 
                onClick={aiAlertModal.onConfirm}
                style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}