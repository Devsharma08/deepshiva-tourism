// components/SafeRouteCreator.jsx
import React, { useState, useEffect } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import { turfPoint, turfDistance } from './Constants.jsx';

const SafeRouteCreator = ({ onRouteCreated, isCreatingRoute, setIsCreatingRoute }) => {
  const map = useMap();
  const [routePoints, setRoutePoints] = useState([]);
  const [routeStats, setRouteStats] = useState({ length: 0, pointCount: 0 });
  
  useEffect(() => {
    if (!isCreatingRoute) {
      setRoutePoints([]);
      setRouteStats({ length: 0, pointCount: 0 });
      return;
    }

    const handleClick = (e) => {
      const newPoint = [e.latlng.lat, e.latlng.lng];
      const newPoints = [...routePoints, newPoint];
      setRoutePoints(newPoints);
      
      // Calculate route length
      let length = 0;
      for(let i = 0; i < newPoints.length - 1; i++) {
        length += turfDistance(
          turfPoint([newPoints[i][1], newPoints[i][0]]), 
          turfPoint([newPoints[i+1][1], newPoints[i+1][0]]),
          { units: 'meters' }
        );
      }
      
      setRouteStats({
        length: length,
        pointCount: newPoints.length
      });
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setRoutePoints([]);
        setIsCreatingRoute(false);
      } else if (e.key === 'Backspace' && routePoints.length > 0) {
        removeLastPoint();
      }
    };

    map.on('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);
    map.getContainer().style.cursor = 'crosshair';

    return () => {
      map.off('click', handleClick);
      document.removeEventListener('keydown', handleKeyPress);
      map.getContainer().style.cursor = '';
    };
  }, [map, isCreatingRoute, routePoints]);

  const removeLastPoint = () => {
    if (routePoints.length === 0) return;
    
    const newPoints = routePoints.slice(0, -1);
    setRoutePoints(newPoints);
    
    let length = 0;
    for(let i = 0; i < newPoints.length - 1; i++) {
      length += turfDistance(
        turfPoint([newPoints[i][1], newPoints[i][0]]), 
        turfPoint([newPoints[i+1][1], newPoints[i+1][0]]),
        { units: 'meters' }
      );
    }
    
    setRouteStats({
      length: length,
      pointCount: newPoints.length
    });
  };

  const finishRoute = () => {
    if (routePoints.length < 2) {
      alert('Need at least 2 points to create a route');
      return;
    }
    
    const name = prompt('Route Name:', `Safe Route ${Math.floor(Math.random() * 1000)}`);
    if (!name) return;
    
    const difficulty = prompt('Difficulty Level (easy/medium/hard):', 'easy') || 'easy';
    
    const description = prompt('Route Description:', 'Safe tourist route') || 'Safe tourist route';
    
    onRouteCreated({
      id: `route-${Date.now()}`, 
      name, 
      coords: routePoints, 
      difficulty,
      length: routeStats.length,
      elevationGain: Math.random() * 100,
      createdAt: new Date().toISOString(),
      description,
      estimatedTime: Math.round(routeStats.length / 5000 * 60), // 5km/h walking speed
      createdBy: 'System'
    });
    
    setRoutePoints([]);
    setIsCreatingRoute(false);
  };

  const cancelRoute = () => {
    setRoutePoints([]);
    setIsCreatingRoute(false);
  };

  if (!isCreatingRoute) return null;

  return (
    <>
      <div className="map-control-panel route-panel">
        <h3>🛣️ Create Safe Route</h3>
        <p>Click on the map to add route points. Connect points to form a safe path.</p>
        
        <div className="route-stats">
          <div className="stat">
            <span className="stat-label">Points:</span>
            <span className="stat-value">{routeStats.pointCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Length:</span>
            <span className="stat-value">{(routeStats.length / 1000).toFixed(2)} km</span>
          </div>
          <div className="stat">
            <span className="stat-label">Est. Time:</span>
            <span className="stat-value">
              {routeStats.length > 0 ? Math.round(routeStats.length / 5000 * 60) : 0} min
            </span>
          </div>
        </div>
        
        <div className="route-instructions">
          <div className="instruction">• Click to add route points</div>
          <div className="instruction">• Minimum 2 points required</div>
          <div className="instruction">• Press Backspace to remove last point</div>
          <div className="instruction">• Press ESC to cancel</div>
        </div>
        
        <div className="map-control-actions">
          <button 
            className="btn-success" 
            onClick={finishRoute} 
            disabled={routePoints.length < 2}
          >
            ✅ Finish Route
          </button>
          <button 
            className="btn-secondary" 
            onClick={removeLastPoint} 
            disabled={routePoints.length === 0}
          >
            ↩️ Remove Last
          </button>
          <button className="btn-danger" onClick={cancelRoute}>
            ❌ Cancel
          </button>
        </div>
      </div>
      
      {routePoints.length > 0 && (
        <Polyline 
          positions={routePoints} 
          pathOptions={{ 
            color: '#10b981', 
            weight: 6, 
            opacity: 0.8,
            dashArray: '10, 10'
          }} 
        />
      )}
      
      {/* Show markers for each route point */}
      {routePoints.map((point, index) => (
        <div key={index} className="route-point-marker">
          <div className="point-number">{index + 1}</div>
        </div>
      ))}
    </>
  );
};

export default SafeRouteCreator;