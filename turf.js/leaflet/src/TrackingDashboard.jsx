// components/TrackingDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, FeatureGroup, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet'; // Add this import
import { 
  MOCK_TRACKERS, 
  MOCK_DANGER_ZONES, 
  MOCK_SAFE_ROUTES, 
  MOCK_POIS,
  MAP_CENTER,
  MAP_ZOOM 
} from './Constants.jsx';

// Import handlers - make sure the path is correct
import { 
  handleSendAiAlert, 
  handleSendBroadcastAlert, 
  handleRouteToPoi,
  handleClearRoute,
  handleQuickEmergency 
} from './handlers/TrackHandlers.jsx';

import GlobalStyles from './GlobalStyles1.jsx';

// Import components - check these paths
import AlertSystem from './AlertSystem.jsx';
import DashboardStats from './DashboardStats.jsx';
import TouristList from './TouristList.jsx';
import WeatherWidget from './WeatherWidgets.jsx'; // Fixed typo
import ResourceManager from './ResourceManager.jsx';
import ProfileInspector from './ProfileInspector.jsx';
import PoiFinder from './PoiFinder.jsx';
import MapDeselector from './MapDeselector.jsx';
import DrawingControls from './DrawingControls.jsx';
import SafeRouteCreator from './SafeRoutesCreator.jsx'; // Fixed typo
import AiAlertRoute from './AiAlertRoute.jsx';
import { createCustomIcon } from './Utils/IconUtils.jsx';
import { useRiskDetection } from './hook/UserRiskDetection.jsx'; // Fixed path

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Inspector Content Component
const InspectorContent = ({ tracker, onSendAiAlert, mapRef, onClearRoute, onQuickEmergency }) => (
  <div className="inspector-content">
    <div className="tracker-stats">
      <h3 style={{ margin: '0 0 1rem 0' }}>{tracker.name}</h3>
      <div className="stat-item">
        <span>Risk Level:</span>
        <span style={{ 
          fontWeight: 'bold', 
          color: tracker.riskLevel > 70 ? '#ef4444' : 
                 tracker.riskLevel > 40 ? '#f59e0b' : '#10b981' 
        }}>
          {tracker.riskLevel}%
        </span>
      </div>
      <div className="stat-item">
        <span>Status:</span>
        <span style={{
          fontWeight: 'bold',
          color: tracker.status === 'DANGER' ? '#dc2626' :
                 tracker.status === 'WARNING' ? '#f59e0b' :
                 tracker.status === 'CAUTION' ? '#fb923c' : '#10b981'
        }}>
          {tracker.status}
        </span>
      </div>
      <div className="stat-item">
        <span>Battery:</span>
        <span>{tracker.battery.toFixed(0)}%</span>
      </div>
      <div className="stat-item">
        <span>Coordinates:</span>
        <span>{tracker.lat.toFixed(5)}, {tracker.lng.toFixed(5)}</span>
      </div>
      <div className="stat-item">
        <span>Last Update:</span>
        <span>{new Date(tracker.lastUpdate).toLocaleTimeString()}</span>
      </div>
    </div>
    
    <button 
      className="inspector-button danger" 
      onClick={onSendAiAlert}
    >
      🤖 Send AI-Powered Alert
    </button>
    <button 
      className="inspector-button warning" 
      onClick={onQuickEmergency}
    >
      🚨 Quick Emergency
    </button>
    <button 
      className="inspector-button secondary" 
      onClick={() => {
        if (mapRef.current) {
          mapRef.current.flyTo([tracker.lat, tracker.lng], 18, { duration: 1.5 });
        }
      }}
    >
      📍 Center on Map
    </button>
    <button 
      className="inspector-button secondary" 
      onClick={onClearRoute}
    >
      🗑️ Clear Route
    </button>
  </div>
);

// Inspector Placeholder Component
const InspectorPlaceholder = ({ trackers, dangerZones, alerts }) => (
  <>
    <div className="header">🔍 Inspector</div>
    <DashboardStats trackers={trackers} dangerZones={dangerZones} alerts={alerts} />
    <div className="inspector-placeholder">
      👈 Select a tracker from the map or sidebar to view details, send alerts, and find nearby utilities.
    </div>
  </>
);

const TrackingDashboard = () => {
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

  // Effect for tracker updates and risk calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackers(prevTrackers => {
        const newTrackers = { ...prevTrackers };
        const newAlerts = [];

        Object.keys(newTrackers).forEach(id => {
          const tracker = newTrackers[id];
          if (tracker.type === 'tourist') {
            // Update tracker position and battery
            tracker.lat += (Math.random() - 0.5) * 0.0008;
            tracker.lng += (Math.random() - 0.5) * 0.0008;
            tracker.battery = Math.max(0, tracker.battery - 0.03);
            tracker.lastUpdate = new Date().toISOString();

            // Calculate risk
            const riskData = calculateRiskForTracker(tracker, dangerZones);
            tracker.riskLevel = Math.round(riskData.level);
            tracker.status = riskData.status;

            // Generate alerts
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

  // Handler functions
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

  // Integrated handler functions
  const handleSendAiAlertWrapper = () => {
    handleSendAiAlert(
      selectedTrackerId,
      trackers,
      persistentPois,
      setAiAlertModal,
      setAiRoute,
      setAlerts
    );
  };

  const handleSendBroadcastAlertWrapper = () => {
    handleSendBroadcastAlert(setAlerts, trackers);
  };

  const handleRouteToPoiWrapper = (poiCoords, poiId) => {
    handleRouteToPoi(
      poiCoords,
      poiId,
      selectedTrackerId,
      trackers,
      setAiRoute,
      mapRef,
      persistentPois
    );
  };

  const handleClearRouteWrapper = () => {
    handleClearRoute(setAiRoute, setAlerts);
  };

  const handleQuickEmergencyWrapper = () => {
    handleQuickEmergency(selectedTrackerId, trackers, setAlerts);
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

      {/* Sidebar */}
      <div className="sidebar">
        <div className="header">🛰️ Command Center</div>
        <div className="tab-bar">
          <button className={`tab-button ${leftTab === 'trackers' ? 'active' : ''}`} onClick={() => setLeftTab('trackers')}>
            Trackers
          </button>
          <button className={`tab-button ${leftTab === 'resources' ? 'active' : ''}`} onClick={() => setLeftTab('resources')}>
            Resources
          </button>
          <button className={`tab-button ${leftTab === 'weather' ? 'active' : ''}`} onClick={() => setLeftTab('weather')}>
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
          {leftTab === 'resources' && <ResourceManager trackers={trackers} />}
          {leftTab === 'weather' && <WeatherWidget />}
        </div>
        
        <div className="sidebar-footer">
          <button 
            className="inspector-button success" 
            onClick={() => { setIsCreatingRoute(true); setIsDrawing(false); }} 
            disabled={isCreatingRoute || isDrawing}
          >
            🛣️ Create Safe Route
          </button>
          <button 
            className="inspector-button" 
            onClick={() => { setIsDrawing(true); setIsCreatingRoute(false); }} 
            disabled={isCreatingRoute || isDrawing}
            style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}
          >
            🎨 Draw Danger Zone
          </button>
          <button 
            className="inspector-button danger" 
            onClick={handleSendBroadcastAlertWrapper}
          >
            📣 Broadcast Alert
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="map-container-wrapper">
        <MapContainer 
          center={MAP_CENTER} 
          zoom={MAP_ZOOM} 
          maxZoom={19} 
          ref={mapRef} 
          style={{ height: '100%', width: '100%' }}
        >
          <MapDeselector onDeselect={handleMapDeselect} />
          
          {/* Map layers and controls */}
          <LayersControl position="topright">
            {/* Base layers */}
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
            
            {/* Overlay layers */}
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
          
          {/* Drawing controls */}
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

          {/* Trackers */}
          {Object.entries(trackers).map(([id, tracker]) => (
            <Marker
              key={id}
              position={[tracker.lat, tracker.lng]}
              icon={createCustomIcon(tracker.type, tracker.riskLevel, id === selectedTrackerId)}
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

      {/* Inspector Panel */}
      <div className="inspector">
        {selectedTracker ? (
          <>
            <div className="header">🔍 Inspector</div>
            <DashboardStats trackers={trackers} dangerZones={dangerZones} alerts={alerts} />
            <div className="tab-bar">
              <button className={`tab-button ${rightTab === 'inspector' ? 'active' : ''}`} onClick={() => setRightTab('inspector')}>
                Details
              </button>
              <button className={`tab-button ${rightTab === 'profile' ? 'active' : ''}`} onClick={() => setRightTab('profile')}>
                Profile
              </button>
              <button className={`tab-button ${rightTab === 'find' ? 'active' : ''}`} onClick={() => setRightTab('find')}>
                Find Nearby
              </button>
            </div>
            
            <div className="tab-content">
              {rightTab === 'inspector' && (
                <InspectorContent 
                  tracker={selectedTracker} 
                  onSendAiAlert={handleSendAiAlertWrapper}
                  onClearRoute={handleClearRouteWrapper}
                  onQuickEmergency={handleQuickEmergencyWrapper}
                  mapRef={mapRef} 
                />
              )}
              {rightTab === 'profile' && <ProfileInspector tracker={selectedTracker} />}
              {rightTab === 'find' && (
                <PoiFinder 
                  selectedTracker={selectedTracker} 
                  onRouteToPoi={handleRouteToPoiWrapper} 
                  persistentPois={persistentPois} 
                />
              )}
            </div>
          </>
        ) : (
          <InspectorPlaceholder 
            trackers={trackers} 
            dangerZones={dangerZones} 
            alerts={alerts} 
          />
        )}
      </div>
      
      {/* AI Alert Modal */}
      {aiAlertModal.isOpen && (
        <div className="ai-modal-backdrop" onClick={() => setAiAlertModal({ isOpen: false, message: '', onConfirm: () => {} })}>
          <div className="ai-modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="ai-modal-header">🤖 AI-Generated Emergency Alert</h3>
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
};

export default TrackingDashboard;