import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Polyline, Marker } from 'react-leaflet';

const SafeRouteCreator = ({ onRouteCreated, isCreatingRoute }) => {
  const map = useMap();
  const [routePoints, setRoutePoints] = useState([]);
  const [tempRoute, setTempRoute] = useState([]);
  const [currentStep, setCurrentStep] = useState('idle'); // idle, placing, naming

  // Reset when creation mode changes
  useEffect(() => {
    if (!isCreatingRoute) {
      setRoutePoints([]);
      setTempRoute([]);
      setCurrentStep('idle');
    }
  }, [isCreatingRoute]);

  const handleMapClick = useCallback((e) => {
    if (!isCreatingRoute || currentStep !== 'placing') return;

    const { lat, lng } = e.latlng;
    const newPoint = [lat, lng];
    
    setRoutePoints(prev => [...prev, newPoint]);
    setTempRoute(prev => [...prev, newPoint]);
  }, [isCreatingRoute, currentStep]);

  const startRouteCreation = () => {
    setCurrentStep('placing');
    setRoutePoints([]);
    setTempRoute([]);
  };

  const finishRoute = () => {
    if (routePoints.length < 2) {
      alert('Please add at least 2 points to create a route');
      return;
    }

    setCurrentStep('naming');
  };

  const saveRoute = () => {
    const name = prompt('Name this safe route (e.g., "Trail to Viewpoint"):');
    const difficulty = prompt('Difficulty level (easy/medium/difficult):', 'medium');
    const description = prompt('Brief description of the route:');
    
    if (name && difficulty) {
      const newRoute = {
        id: `route-${Date.now()}`,
        name,
        points: [...routePoints],
        difficulty,
        description: description || '',
        length: calculateRouteLength(routePoints),
        elevationGain: calculateElevationGain(routePoints), // Mock elevation
        createdAt: new Date().toISOString(),
        createdBy: 'user' // In real app, get from auth
      };

      onRouteCreated(newRoute);
      
      // Reset
      setRoutePoints([]);
      setTempRoute([]);
      setCurrentStep('idle');
    }
  };

  const cancelCreation = () => {
    setRoutePoints([]);
    setTempRoute([]);
    setCurrentStep('idle');
  };

  const removeLastPoint = () => {
    if (routePoints.length > 0) {
      setRoutePoints(prev => prev.slice(0, -1));
      setTempRoute(prev => prev.slice(0, -1));
    }
  };

  // Calculate approximate route length in meters
  const calculateRouteLength = (points) => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      totalDistance += calculateDistance(points[i-1], points[i]);
    }
    
    return totalDistance;
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1, point2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Mock elevation gain calculation
  const calculateElevationGain = (points) => {
    // In real app, you'd use elevation data
    // This is a simplified mock calculation
    return Math.random() * 300 + 50; // Random between 50-350 meters
  };

  // Add map click listener
  useEffect(() => {
    if (currentStep === 'placing') {
      map.on('click', handleMapClick);
    } else {
      map.off('click', handleMapClick);
    }

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, currentStep, handleMapClick]);

  if (!isCreatingRoute) return null;

  return (
    <>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        zIndex: 1000,
        background: 'white',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        minWidth: '280px',
        border: '2px solid #27ae60'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#27ae60' }}>
          🛣️ Create Safe Route
        </h3>

        {currentStep === 'idle' && (
          <div>
            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
              Click "Start Drawing" to begin creating a safe route by clicking on the map.
            </p>
            <button
              onClick={startRouteCreation}
              style={{
                padding: '10px 16px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🎨 Start Drawing Route
            </button>
          </div>
        )}

        {currentStep === 'placing' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                Step 1: Place Route Points
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#666' }}>
                Click on the map to add route points. Add at least 2 points.
              </p>
              
              <div style={{ 
                background: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                marginBottom: '10px'
              }}>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Points: <strong>{routePoints.length}</strong>
                </div>
                {routePoints.length >= 2 && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Length: <strong>{(calculateRouteLength(routePoints) / 1000).toFixed(2)} km</strong>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={finishRoute}
                disabled={routePoints.length < 2}
                style={{
                  padding: '8px 12px',
                  background: routePoints.length < 2 ? '#95a5a6' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: routePoints.length < 2 ? 'not-allowed' : 'pointer',
                  flex: 1,
                  fontSize: '12px'
                }}
              >
                ✅ Finish Route
              </button>
              
              <button
                onClick={removeLastPoint}
                disabled={routePoints.length === 0}
                style={{
                  padding: '8px 12px',
                  background: routePoints.length === 0 ? '#95a5a6' : '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: routePoints.length === 0 ? 'not-allowed' : 'pointer',
                  flex: 1,
                  fontSize: '12px'
                }}
              >
                ↩️ Remove Last
              </button>
            </div>

            <button
              onClick={cancelCreation}
              style={{
                padding: '8px 12px',
                background: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                marginTop: '8px',
                fontSize: '12px'
              }}
            >
              ❌ Cancel
            </button>
          </div>
        )}

        {currentStep === 'naming' && (
          <div>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
              Step 2: Save Route
            </p>
            <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>
              Ready to save your {routePoints.length}-point route.
            </p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={saveRoute}
                style={{
                  padding: '10px 16px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '14px'
                }}
              >
                💾 Save Route
              </button>
              
              <button
                onClick={() => setCurrentStep('placing')}
                style={{
                  padding: '10px 16px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '14px'
                }}
              >
                ✏️ Edit More
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visual Route Preview */}
      {tempRoute.length > 0 && (
        <>
          <Polyline
            positions={tempRoute}
            pathOptions={{
              color: '#27ae60',
              weight: 6,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
          
          {/* Start and end markers */}
          <Marker
            position={tempRoute[0]}
            icon={L.divIcon({
              className: 'route-start-marker',
              html: '<div style="background: #27ae60; color: white; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">S</div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          />
          
          {tempRoute.length > 1 && (
            <Marker
              position={tempRoute[tempRoute.length - 1]}
              icon={L.divIcon({
                className: 'route-end-marker',
                html: '<div style="background: #e74c3c; color: white; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">E</div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            />
          )}
          
          {/* Intermediate point markers */}
          {tempRoute.slice(1, -1).map((point, index) => (
            <Marker
              key={index}
              position={point}
              icon={L.divIcon({
                className: 'route-point-marker',
                html: '<div style="background: #3498db; color: white; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            />
          ))}
        </>
      )}
    </>
  );
};

export default SafeRouteCreator;