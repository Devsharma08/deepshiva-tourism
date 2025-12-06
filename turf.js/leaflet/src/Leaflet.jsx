import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// 3D and Enhanced Tile Layers
const TILE_LAYERS = {
  osm3d: {
    name: "🗺️ 3D Buildings",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '© OpenStreetMap'
  },
  satellite3d: {
    name: "🛰️ Satellite 3D",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '© Esri'
  },
  topo3d: {
    name: "🏔️ Topographic 3D",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", 
    attribution: '© OpenTopoMap'
  },
  dark3d: {
    name: "🌙 Dark 3D",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '© CartoDB'
  }
};

// Geofence coordinates for Ranikhet
const FENCE_COORDS = [
  [29.642, 79.426], [29.643, 79.427], [29.644, 79.428], [29.645, 79.429],
  [29.646, 79.428], [29.645, 79.427], [29.644, 79.426], [29.642, 79.426]
];

// Real Location Tracker Component
function RealLocationTracker({ onLocationUpdate, onFenceChange }) {
  const map = useMap();
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const prevInsideState = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const success = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const newLocation = [latitude, longitude];
      
      setLocation(newLocation);
      setAccuracy(accuracy);
      
      // Update parent component
      onLocationUpdate(newLocation, accuracy);
      
      // Fly to location (only first time or if far away)
      if (!location || distance(location, newLocation) > 0.1) {
        map.flyTo(newLocation, 18, { duration: 2 });
      }

      // Geofence check
      const isInside = checkIfInsideFence(newLocation);
      
      // Trigger fence events
      if (prevInsideState.current !== null && prevInsideState.current !== isInside) {
        onFenceChange(isInside ? "ENTER" : "EXIT", newLocation);
      }
      prevInsideState.current = isInside;
    };

    const error = (err) => {
      console.error("Location error:", err);
      onLocationUpdate(null, null, err.message);
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(success, error, options);
    
    // Watch for updates
    const watchId = navigator.geolocation.watchPosition(success, error, options);

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, onLocationUpdate, onFenceChange]);

  return location ? (
    <Marker position={location}>
      <Popup>
        <div style={{ textAlign: "center" }}>
          <strong>📍 Your Current Location</strong>
          <br />
          Lat: {location[0].toFixed(6)}
          <br />
          Lng: {location[1].toFixed(6)}
          <br />
          Accuracy: {accuracy ? `${Math.round(accuracy)}m` : 'Unknown'}
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// Helper functions
function distance(loc1, loc2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = loc1[0] * Math.PI/180;
  const φ2 = loc2[0] * Math.PI/180;
  const Δφ = (loc2[0]-loc1[0]) * Math.PI/180;
  const Δλ = (loc2[1]-loc1[1]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function checkIfInsideFence(location) {
  // Simple rectangular check for demo
  const [lat, lng] = location;
  return lat >= 29.642 && lat <= 29.646 && lng >= 79.426 && lng <= 79.429;
}

// Map Controls Component
function MapControls({ onStyleChange, currentStyle }) {
  return (
    <div style={{
      position: "absolute",
      top: "80px",
      right: "10px",
      zIndex: 1000,
      background: "rgba(255,255,255,0.95)",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      minWidth: "200px"
    }}>
      <h4 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>🗺️ Map Style</h4>
      {Object.entries(TILE_LAYERS).map(([key, layer]) => (
        <div key={key} style={{ marginBottom: "8px" }}>
          <button
            onClick={() => onStyleChange(key)}
            style={{
              width: "100%",
              padding: "10px",
              background: currentStyle === key ? "#3498db" : "#ecf0f1",
              color: currentStyle === key ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              textAlign: "left",
              transition: "all 0.3s ease"
            }}
          >
            {layer.name}
          </button>
        </div>
      ))}
    </div>
  );
}

// Location Status Component
function LocationStatus({ location, accuracy, fenceStatus, isTracking }) {
  return (
    <div style={{
      position: "absolute",
      top: "80px",
      left: "10px",
      zIndex: 1000,
      background: "rgba(255,255,255,0.95)",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      minWidth: "250px"
    }}>
      <h4 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>📍 Location Status</h4>
      
      {isTracking ? (
        <>
          <div style={{ marginBottom: "10px" }}>
            <strong>Status:</strong> 
            <span style={{ 
              color: fenceStatus === "INSIDE" ? "#27ae60" : "#e74c3c",
              fontWeight: "bold",
              marginLeft: "8px"
            }}>
              {fenceStatus === "INSIDE" ? "🎉 INSIDE FENCE" : "🚪 OUTSIDE FENCE"}
            </span>
          </div>
          
          {location && (
            <>
              <div style={{ fontSize: "12px", marginBottom: "5px" }}>
                <strong>Latitude:</strong> {location[0].toFixed(6)}
              </div>
              <div style={{ fontSize: "12px", marginBottom: "5px" }}>
                <strong>Longitude:</strong> {location[1].toFixed(6)}
              </div>
              {accuracy && (
                <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                  <strong>Accuracy:</strong> ±{Math.round(accuracy)} meters
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div style={{ color: "#e74c3c", textAlign: "center" }}>
          🔄 Acquiring location...
        </div>
      )}
    </div>
  );
}

// Main Component
export default function RealTime3DGeofence() {
  const [mapStyle, setMapStyle] = useState("satellite3d");
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [fenceStatus, setFenceStatus] = useState("OUTSIDE");
  const [events, setEvents] = useState([]);
  const [isTracking, setIsTracking] = useState(false);

  const handleLocationUpdate = (location, accuracy, error) => {
    if (error) {
      console.error("Location error:", error);
      setIsTracking(false);
      return;
    }

    setUserLocation(location);
    setLocationAccuracy(accuracy);
    setIsTracking(true);
  };

  const handleFenceChange = (type, location) => {
    const newStatus = type === "ENTER" ? "INSIDE" : "OUTSIDE";
    setFenceStatus(newStatus);
    
    // Add to event log
    setEvents(prev => [...prev, {
      id: Date.now(),
      type,
      time: new Date().toLocaleTimeString(),
      location: `${location[0].toFixed(6)}, ${location[1].toFixed(6)}`,
      status: newStatus
    }].slice(-10)); // Keep last 10 events
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ 
        padding: "15px", 
        background: "#2c3e50",
        color: "white",
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>🏔️ Real-Time 3D Geofencing</div>
        <div style={{ fontSize: "14px", opacity: 0.8 }}>
          {isTracking ? "📍 Live Tracking" : "🔍 Acquiring Location..."}
        </div>
      </div>

      {/* Map Container */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer 
          center={[29.644, 79.427]} 
          zoom={17}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            url={TILE_LAYERS[mapStyle].url}
            attribution={TILE_LAYERS[mapStyle].attribution}
          />
          
          {/* Geofence Area */}
          <Polygon
            positions={FENCE_COORDS}
            pathOptions={{
              color: "#e74c3c",
              fillColor: "#e74c3c",
              fillOpacity: 0.3,
              weight: 3
            }}
          />
          
          {/* Real Location Tracking */}
          <RealLocationTracker 
            onLocationUpdate={handleLocationUpdate}
            onFenceChange={handleFenceChange}
          />
        </MapContainer>

        {/* UI Controls */}
        <MapControls onStyleChange={setMapStyle} currentStyle={mapStyle} />
        
        {/* Location Status */}
        <LocationStatus 
          location={userLocation}
          accuracy={locationAccuracy}
          fenceStatus={fenceStatus}
          isTracking={isTracking}
        />
      </div>

      {/* Events Panel */}
      <div style={{ 
        padding: "15px", 
        background: "#ecf0f1",
        maxHeight: "150px",
        overflowY: "auto",
        borderTop: "3px solid #bdc3c7"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "10px" 
        }}>
          <strong style={{ color: "#2c3e50" }}>📋 Geofence Events</strong>
          <button 
            onClick={() => setEvents([])}
            style={{
              padding: "5px 10px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Clear
          </button>
        </div>
        
        {events.length === 0 ? (
          <div style={{ color: "#7f8c8d", fontStyle: "italic", textAlign: "center" }}>
            No fence crossing events yet...
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} style={{
              padding: "8px",
              margin: "5px 0",
              background: event.type === "ENTER" ? "#d4edda" : "#f8d7da",
              borderRadius: "6px",
              fontSize: "12px",
              borderLeft: `4px solid ${event.type === "ENTER" ? "#28a745" : "#dc3545"}`
            }}>
              <span style={{ fontWeight: "bold" }}>
                {event.type === "ENTER" ? "🎉 ENTERED" : "🚪 EXITED"}
              </span>
              <span style={{ margin: "0 10px", color: "#6c757d" }}>•</span>
              {event.time}
              <span style={{ margin: "0 10px", color: "#6c757d" }}>•</span>
              {event.location}
            </div>
          ))
        )}
      </div>
    </div>
  );
}