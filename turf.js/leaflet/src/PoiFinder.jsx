// components/PoiFinder.jsx
import React, { useState } from 'react';
import { turfPoint, turfDistance } from './Constants.jsx';

const PoiFinder = ({ selectedTracker, onRouteToPoi, persistentPois }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const getClosestPois = () => {
    if (!selectedTracker || persistentPois.length === 0) return [];
    
    const trackerPoint = turfPoint([selectedTracker.lng, selectedTracker.lat]);
    const poisWithDistance = persistentPois.map(poi => {
      const poiPoint = turfPoint([poi.lng, poi.lat]);
      const distance = turfDistance(trackerPoint, poiPoint, { units: 'meters' });
      return { ...poi, distance };
    });

    // Filter by category
    const filteredPois = selectedCategory === 'all' 
      ? poisWithDistance 
      : poisWithDistance.filter(poi => poi.type === selectedCategory);

    // Sort
    const sortedPois = [...filteredPois].sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return sortedPois.slice(0, 10);
  };

  const closestPois = getClosestPois();

  const getPoiIcon = (type) => {
    const icons = {
      hospital: '🏥',
      police: '🚓',
      shop: '🛒',
      restaurant: '🍽️',
      hotel: '🏨',
      attraction: '🏛️',
      emergency: '🆘'
    };
    return icons[type] || '📍';
  };

  const getPoiColor = (type) => {
    const colors = {
      hospital: '#dc2626',
      police: '#2563eb',
      shop: '#14b8a6',
      restaurant: '#f59e0b',
      hotel: '#8b5cf6',
      attraction: '#ec4899',
      emergency: '#ef4444'
    };
    return colors[type] || '#6b7280';
  };

  const getPoiCategory = (type) => {
    const categories = {
      hospital: 'Medical',
      police: 'Security',
      shop: 'Shopping',
      restaurant: 'Dining',
      hotel: 'Accommodation',
      attraction: 'Attraction',
      emergency: 'Emergency'
    };
    return categories[type] || 'Other';
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const getEstimatedTime = (distance) => {
    const walkingSpeed = 5; // km/h
    const timeInHours = distance / 1000 / walkingSpeed;
    const minutes = Math.round(timeInHours * 60);
    
    if (minutes < 60) return `${minutes} min walk`;
    return `${Math.round(minutes / 60)}h ${minutes % 60}min walk`;
  };

  return (
    <div className="poi-finder">
      <div className="poi-finder-header">
        <h4 className="poi-finder-title">
          🗺️ Nearby Points of Interest
        </h4>
        <div className="poi-subtitle">
          For <strong>{selectedTracker.name}</strong>
        </div>
      </div>

      <div className="poi-controls">
        <div className="filter-group">
          <label>Filter by:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="hospital">Medical</option>
            <option value="police">Security</option>
            <option value="shop">Shopping</option>
            <option value="restaurant">Dining</option>
            <option value="hotel">Accommodation</option>
          </select>
        </div>
        
        <div className="sort-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="distance">Distance</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="poi-finder-list">
        {closestPois.length === 0 ? (
          <div className="empty-placeholder">
            No points of interest found nearby.
          </div>
        ) : (
          closestPois.map(poi => (
            <div key={poi.id} className="poi-list-item">
              <div 
                className="poi-icon" 
                style={{ backgroundColor: getPoiColor(poi.type) }}
              >
                {getPoiIcon(poi.type)}
              </div>
              
              <div className="poi-details">
                <div className="poi-name">{poi.name}</div>
                <div className="poi-category">{getPoiCategory(poi.type)}</div>
                <div className="poi-distance-info">
                  <span className="poi-distance">{formatDistance(poi.distance)}</span>
                  <span className="poi-time">• {getEstimatedTime(poi.distance)}</span>
                </div>
              </div>
              
              <div className="poi-actions">
                <button 
                  onClick={() => onRouteToPoi([poi.lat, poi.lng], poi.id)} 
                  className="btn-route"
                  title="Get directions"
                >
                  🗺️ Route
                </button>
                <button 
                  className="btn-info"
                  title="More information"
                >
                  ℹ️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="poi-stats">
        <div className="poi-stat">
          <span className="stat-number">{closestPois.length}</span>
          <span className="stat-label">Places Found</span>
        </div>
        <div className="poi-stat">
          <span className="stat-number">
            {closestPois.length > 0 ? formatDistance(closestPois[0].distance) : 'N/A'}
          </span>
          <span className="stat-label">Closest</span>
        </div>
        <div className="poi-stat">
          <span className="stat-number">
            {closestPois.filter(p => p.type === 'hospital' || p.type === 'police').length}
          </span>
          <span className="stat-label">Emergency</span>
        </div>
      </div>
    </div>
  );
};

export default PoiFinder;