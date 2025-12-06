// components/DrawingControls.jsx
import React, { useState, useEffect } from 'react';
import { Polygon, useMap } from 'react-leaflet';

const DrawingControls = ({ onZoneCreated, isDrawing, setIsDrawing }) => {
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

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setTempPoints([]);
        setIsDrawing(false);
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
  }, [map, isDrawing, setIsDrawing]);

  const finishDrawing = () => {
    if (tempPoints.length < 3) {
      alert('Need at least 3 points to create a danger zone');
      return;
    }
    
    const name = prompt('Zone Name:', `Danger Zone ${Math.floor(Math.random() * 100)}`);
    if (!name) return;
    
    const severity = prompt('Severity Level (high/medium/low):', 'high') || 'high';
    
    const riskFactor = {
      high: 80,
      medium: 50,
      low: 30
    }[severity] || 80;
    
    const turfCoords = [[ 
      ...tempPoints.map(p => [p[1], p[0]]), 
      [tempPoints[0][1], tempPoints[0][0]] 
    ]];
    
    onZoneCreated({
      id: `dz-${Date.now()}`, 
      name, 
      coords: [...tempPoints, tempPoints[0]],
      turfCoords, 
      severity,
      riskFactor,
      createdAt: new Date().toISOString(),
      createdBy: 'System',
      description: `Danger zone marked as ${severity} risk`
    });
    setTempPoints([]);
    setIsDrawing(false);
  };

  const removeLastPoint = () => {
    setTempPoints(prev => prev.slice(0, -1));
  };

  const cancelDrawing = () => {
    setTempPoints([]);
    setIsDrawing(false);
  };

  if (!isDrawing) return null;
  
  return (
    <>
      <div className="map-control-panel drawing-panel">
        <h3>🚨 Draw Danger Zone</h3>
        <p>Click on the map to create polygon points for the danger zone.</p>
        
        <div className="drawing-stats">
          <div className="stat">
            <span className="stat-label">Points:</span>
            <span className="stat-value">{tempPoints.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Status:</span>
            <span className="stat-value">
              {tempPoints.length < 3 ? 'Need more points' : 'Ready to create'}
            </span>
          </div>
        </div>
        
        <div className="drawing-instructions">
          <div className="instruction">• Click on map to add points</div>
          <div className="instruction">• Minimum 3 points required</div>
          <div className="instruction">• Press ESC to cancel</div>
        </div>
        
        <div className="map-control-actions">
          <button 
            className="btn-warning" 
            onClick={finishDrawing} 
            disabled={tempPoints.length < 3}
          >
            ✅ Finish Zone
          </button>
          <button 
            className="btn-secondary" 
            onClick={removeLastPoint} 
            disabled={tempPoints.length === 0}
          >
            ↩️ Remove Last
          </button>
          <button className="btn-danger" onClick={cancelDrawing}>
            ❌ Cancel
          </button>
        </div>
      </div>
      
      {tempPoints.length > 0 && (
        <Polygon 
          positions={[...tempPoints, tempPoints[0]]} 
          pathOptions={{ 
            color: '#ef4444', 
            fillColor: '#ef4444', 
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '5, 5'
          }} 
        />
      )}
      
      {/* Show temporary markers for each point */}
      {tempPoints.map((point, index) => (
        <div key={index} className="temp-point-marker">
          <div className="point-number">{index + 1}</div>
        </div>
      ))}
    </>
  );
};

export default DrawingControls;