import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom numbered marker icon
const createNumberedIcon = (number, isHovered, isPriority) => {
    const color = isHovered ? '#ef4444' : isPriority ? '#f97316' : '#3b82f6';
    const shadowColor = isHovered ? 'rgba(239, 68, 68, 0.4)' : isPriority ? 'rgba(249, 115, 22, 0.3)' : 'rgba(59, 130, 246, 0.3)';
    const size = isHovered ? 44 : 36;

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, ${color}, ${isHovered ? '#dc2626' : isPriority ? '#d97706' : '#2563eb'});
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px ${shadowColor}, 0 0 0 3px white;
                transition: all 0.3s ease;
                ${isHovered ? 'animation: bounce 0.6s ease infinite;' : ''}
            ">
                <span style="
                    transform: rotate(45deg);
                    color: white;
                    font-weight: bold;
                    font-size: ${isHovered ? '16px' : '14px'};
                    font-family: system-ui, -apple-system, sans-serif;
                ">${number}</span>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size]
    });
};

// Unscheduled marker icon
const createUnscheduledIcon = (isHovered) => {
    return L.divIcon({
        className: 'custom-marker-unscheduled',
        html: `
            <div style="
                width: ${isHovered ? 32 : 24}px;
                height: ${isHovered ? 32 : 24}px;
                background: ${isHovered ? '#f97316' : 'white'};
                border: 3px dashed ${isHovered ? '#ea580c' : '#9ca3af'};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: all 0.2s ease;
            ">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${isHovered ? 'white' : '#9ca3af'}" stroke-width="2">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <circle cx="12" cy="11" r="3"/>
                </svg>
            </div>
        `,
        iconSize: [isHovered ? 32 : 24, isHovered ? 32 : 24],
        iconAnchor: [(isHovered ? 32 : 24) / 2, (isHovered ? 32 : 24) / 2],
        popupAnchor: [0, -(isHovered ? 16 : 12)]
    });
};

// Suggestion marker icon
const createSuggestionIcon = (isHovered) => {
    return L.divIcon({
        className: 'custom-marker-suggestion',
        html: `
            <div style="
                width: ${isHovered ? 28 : 20}px;
                height: ${isHovered ? 28 : 20}px;
                background: ${isHovered ? '#f97316' : 'rgba(156, 163, 175, 0.6)'};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                transition: all 0.2s ease;
                cursor: pointer;
            "></div>
        `,
        iconSize: [isHovered ? 28 : 20, isHovered ? 28 : 20],
        iconAnchor: [(isHovered ? 28 : 20) / 2, (isHovered ? 28 : 20) / 2]
    });
};

// Map Controls Component - Lives inside MapContainer to access map instance
function MapControls({ destinations, unscheduledDestinations, isFullscreen, onToggleFullscreen }) {
    const map = useMap();

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    const handleFitAll = useCallback(() => {
        const allDests = [...destinations, ...unscheduledDestinations];
        if (allDests.length > 0) {
            const bounds = L.latLngBounds(allDests.map(d => [d.coordinates.lat, d.coordinates.lng]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
    }, [map, destinations, unscheduledDestinations]);

    return (
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-[1000]">
            <button
                onClick={handleZoomIn}
                className="p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                title="Zoom in"
            >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
            <button
                onClick={handleZoomOut}
                className="p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                title="Zoom out"
            >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
            <button
                onClick={onToggleFullscreen}
                className={`p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all border ${isFullscreen
                    ? 'bg-orange-500 border-orange-600 hover:bg-orange-600'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
                {isFullscreen ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                )}
            </button>
        </div>
    );
}

// Map controller component to handle auto-fit on mount
function MapController({ center, zoom, destinations }) {
    const map = useMap();

    useEffect(() => {
        if (destinations.length > 0) {
            const bounds = L.latLngBounds(destinations.map(d => [d.coordinates.lat, d.coordinates.lng]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        } else if (center) {
            map.setView([center.lat, center.lng], zoom);
        }
    }, [destinations, center, zoom, map]);

    return null;
}

function MapView({
    destinations,
    unscheduledDestinations,
    nearbySuggestions,
    hoveredDestination,
    onDestinationClick,
    onAddNearby,
    transportMode
}) {
    const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
    const [showLegend, setShowLegend] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Calculate center based on all destinations
    const mapCenter = useMemo(() => {
        const allDests = [...destinations, ...unscheduledDestinations];
        if (allDests.length > 0) {
            const avgLat = allDests.reduce((acc, d) => acc + d.coordinates.lat, 0) / allDests.length;
            const avgLng = allDests.reduce((acc, d) => acc + d.coordinates.lng, 0) / allDests.length;
            return { lat: avgLat, lng: avgLng };
        }
        return { lat: 27.1751, lng: 78.0421 }; // Default to Taj Mahal
    }, [destinations, unscheduledDestinations]);

    // Get route color based on transport mode
    const getRouteColor = () => {
        switch (transportMode) {
            case 'walking': return '#22c55e';
            case 'transit': return '#3b82f6';
            case 'car': return '#a855f7';
            default: return '#f97316';
        }
    };

    // Create route polyline coordinates
    const routePositions = useMemo(() => {
        return destinations.map(d => [d.coordinates.lat, d.coordinates.lng]);
    }, [destinations]);

    // Calculate total distance
    const calculateTotalDistance = () => {
        if (destinations.length < 2) return 0;
        let total = 0;
        for (let i = 0; i < destinations.length - 1; i++) {
            const from = destinations[i].coordinates;
            const to = destinations[i + 1].coordinates;
            total += Math.sqrt(
                Math.pow((to.lat - from.lat) * 111, 2) +
                Math.pow((to.lng - from.lng) * 85, 2)
            );
        }
        return total.toFixed(1);
    };

    // Check if marker is hovered (from timeline or map)
    const isMarkerHovered = (destId) => {
        return hoveredDestination?.id === destId || hoveredMarkerId === destId;
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Handle Escape key to exit fullscreen
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isFullscreen]);

    return (
        <div className={`${isFullscreen
            ? 'fixed inset-0 z-[9999] bg-white'
            : 'w-[30%] min-w-[320px] max-w-[420px] h-full'
            } flex flex-col transition-all duration-300`}>
            {/* Panel Header */}
            <div className={`p-4 border-b border-gray-200/50 bg-gradient-to-r from-white to-green-50/30 flex-shrink-0 ${isFullscreen ? 'shadow-md' : ''}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">
                                🗺️
                            </span>
                            Route Map
                            {isFullscreen && (
                                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                    Fullscreen
                                </span>
                            )}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span>{destinations.length} stops</span>
                            {destinations.length > 1 && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <span>{calculateTotalDistance()} km total</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowLegend(!showLegend)}
                            className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow border ${showLegend ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                            title={showLegend ? 'Hide legend' : 'Show legend'}
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                        {isFullscreen && (
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                title="Exit fullscreen"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Transport Mode Indicator */}
                <div className="flex items-center gap-2 mt-3 p-2 bg-white rounded-lg border border-gray-100 text-xs">
                    <span className="text-gray-500">Route:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${transportMode === 'walking' ? 'bg-green-100 text-green-700' :
                        transportMode === 'transit' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                        {transportMode === 'walking' ? '🚶' : transportMode === 'transit' ? '🚇' : '🚗'}
                        {transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}
                    </span>
                    <span className="text-gray-400 ml-auto">OpenStreetMap</span>
                    {isFullscreen && (
                        <span className="text-gray-400">• Press ESC to exit</span>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
                <MapContainer
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    {/* OpenStreetMap Tiles */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Map Controller */}
                    <MapController
                        center={mapCenter}
                        zoom={12}
                        destinations={[...destinations, ...unscheduledDestinations]}
                    />

                    {/* Map Controls - Inside MapContainer to access map instance */}
                    <MapControls
                        destinations={destinations}
                        unscheduledDestinations={unscheduledDestinations}
                        isFullscreen={isFullscreen}
                        onToggleFullscreen={toggleFullscreen}
                    />

                    {/* Route Polyline */}
                    {routePositions.length > 1 && (
                        <>
                            {/* Shadow line */}
                            <Polyline
                                positions={routePositions}
                                pathOptions={{
                                    color: 'rgba(0,0,0,0.2)',
                                    weight: 8,
                                    lineCap: 'round',
                                    lineJoin: 'round'
                                }}
                            />
                            {/* Main route line */}
                            <Polyline
                                positions={routePositions}
                                pathOptions={{
                                    color: getRouteColor(),
                                    weight: 4,
                                    lineCap: 'round',
                                    lineJoin: 'round',
                                    dashArray: transportMode === 'walking' ? '10, 10' : null
                                }}
                            />
                        </>
                    )}

                    {/* Nearby Suggestions Markers */}
                    {nearbySuggestions.map((nearby) => (
                        <Marker
                            key={nearby.id}
                            position={[nearby.coordinates.lat, nearby.coordinates.lng]}
                            icon={createSuggestionIcon(hoveredMarkerId === nearby.id)}
                            eventHandlers={{
                                click: () => onAddNearby(nearby),
                                mouseover: () => setHoveredMarkerId(nearby.id),
                                mouseout: () => setHoveredMarkerId(null)
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -10]} permanent={false}>
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">{nearby.name}</div>
                                    <div className="text-xs text-green-600">Click to add</div>
                                </div>
                            </Tooltip>
                        </Marker>
                    ))}

                    {/* Unscheduled Destination Markers */}
                    {unscheduledDestinations.map((dest) => (
                        <Marker
                            key={dest.id}
                            position={[dest.coordinates.lat, dest.coordinates.lng]}
                            icon={createUnscheduledIcon(isMarkerHovered(dest.id))}
                            eventHandlers={{
                                mouseover: () => setHoveredMarkerId(dest.id),
                                mouseout: () => setHoveredMarkerId(null)
                            }}
                        >
                            <Popup>
                                <div className="min-w-[180px]">
                                    <div className="flex gap-2">
                                        <img
                                            src={dest.thumbnail}
                                            alt={dest.name}
                                            className="w-14 h-14 rounded-lg object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900">{dest.name}</h4>
                                            <p className="text-xs text-orange-600 font-medium">Unscheduled</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Math.floor(dest.duration / 60)}h {dest.duration % 60}m visit
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDestinationClick(dest)}
                                        className="mt-2 w-full py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Scheduled Destination Markers */}
                    {destinations.map((dest, index) => (
                        <Marker
                            key={dest.id}
                            position={[dest.coordinates.lat, dest.coordinates.lng]}
                            icon={createNumberedIcon(
                                index + 1,
                                isMarkerHovered(dest.id),
                                dest.priority === 'must-visit'
                            )}
                            eventHandlers={{
                                mouseover: () => setHoveredMarkerId(dest.id),
                                mouseout: () => setHoveredMarkerId(null)
                            }}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <div className="flex gap-3">
                                        <img
                                            src={dest.thumbnail}
                                            alt={dest.name}
                                            className="w-16 h-16 rounded-lg object-cover shadow"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm">{dest.name}</h4>
                                            <p className="text-xs text-blue-600 font-medium mt-0.5">
                                                Day {dest.scheduledDay} • {dest.scheduledTime}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Math.floor(dest.duration / 60)}h {dest.duration % 60}m
                                            </p>
                                            {dest.priority === 'must-visit' && (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-medium mt-1">
                                                    ⭐ Must Visit
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDestinationClick(dest)}
                                        className="mt-2 w-full py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Legend Overlay */}
                {showLegend && (
                    <div className={`absolute ${isFullscreen ? 'bottom-6 left-6' : 'bottom-4 left-4'} bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 z-[1000] max-w-[160px]`}>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-gray-700">Legend</h4>
                            <button
                                onClick={() => setShowLegend(false)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                            >
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-[9px] font-bold shadow">1</div>
                                <span>Must-visit</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[9px] font-bold shadow">2</div>
                                <span>Scheduled</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-400 bg-white" />
                                <span>Unscheduled</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-5 h-5 rounded-full bg-gray-400/60" />
                                <span>Suggestion</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 pt-1 border-t border-gray-100">
                                <div className="w-6 h-1 rounded-full" style={{ backgroundColor: getRouteColor() }} />
                                <span>Route</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Map Attribution */}
                <div className={`absolute ${isFullscreen ? 'bottom-6 right-6' : 'bottom-4 right-4'} text-[10px] text-gray-500 bg-white/80 px-2 py-1 rounded z-[1000]`}>
                    © OpenStreetMap
                </div>
            </div>
        </div>
    );
}

export default MapView;
