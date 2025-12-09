import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Auto-zoom to fit Route
function MapBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

const InteractiveMap = ({ destCoords }) => {
    const [userLoc, setUserLoc] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [error, setError] = useState(null);

    // 1. Get User Location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => setError("Location access denied. Enable GPS to see route.")
            );
        } else {
            setError("Geolocation not supported.");
        }
    }, []);

    // 2. Fetch Route from Backend (OSRM)
    useEffect(() => {
        if (userLoc && destCoords) {
            fetch('http://localhost:5000/api/route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userLocation: userLoc, 
                    destLocation: { lat: destCoords.latitude, lng: destCoords.longitude } 
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.geometry && data.geometry.coordinates) {
                    // OSRM returns [Lng, Lat], Leaflet needs [Lat, Lng]
                    const decodedPath = data.geometry.coordinates.map(c => [c[1], c[0]]);
                    setRouteData({ ...data, path: decodedPath });
                }
            })
            .catch(err => console.error("Route Error:", err));
        }
    }, [userLoc, destCoords]);

    if (!destCoords) return <div className="map-error">Invalid Destination Coordinates</div>;

    // Bounds logic
    const bounds = userLoc 
        ? [[userLoc.lat, userLoc.lng], [destCoords.latitude, destCoords.longitude]]
        : [[destCoords.latitude, destCoords.longitude]];

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer 
                center={[destCoords.latitude, destCoords.longitude]} 
                zoom={13} 
                style={{ height: '400px', width: '100%', zIndex: 1 }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                
                <Marker position={[destCoords.latitude, destCoords.longitude]}>
                    <Popup>🏁 Destination Hotel</Popup>
                </Marker>

                {userLoc && (
                    <Marker position={[userLoc.lat, userLoc.lng]}>
                        <Popup>📍 You are here</Popup>
                    </Marker>
                )}

                {routeData?.path && (
                    <Polyline positions={routeData.path} color="#2563eb" weight={6} opacity={0.8} />
                )}

                <MapBounds bounds={bounds} />
            </MapContainer>

            {/* FLOATING INFO CARD */}
            {routeData && (
                <div style={{
                    position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                    background: 'rgba(255, 255, 255, 0.95)', padding: '15px', borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 999,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backdropFilter: 'blur(5px)', border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Estimated Time</div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>{routeData.duration} min</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                         <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Distance</div>
                         <div style={{ fontSize: '18px', fontWeight: '600', color: '#2563eb' }}>{routeData.distance} km</div>
                    </div>
                </div>
            )}
            
            {error && <div style={{position:'absolute', top:10, left:10, background:'red', color:'white', padding:5, zIndex:999}}>{error}</div>}
        </div>
    );
};

export default InteractiveMap;