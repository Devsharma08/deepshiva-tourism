// components/ResourceManager.jsx
import React from 'react';

const ResourceManager = ({ trackers }) => {
  const resources = Object.values(trackers).filter(t => t.type === 'ranger');
  
  const getStatusColor = (availability) => {
    switch (availability) {
      case 'On Patrol': return '#10b981';
      case 'Available': return '#3b82f6';
      case 'Busy': return '#f59e0b';
      case 'Offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getBatteryColor = (battery) => {
    if (battery > 70) return '#10b981';
    if (battery > 30) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="resource-list">
      <div className="resource-header">
        <h3>🛡️ Security Resources</h3>
        <div className="resource-count">{resources.length} Active Units</div>
      </div>
      
      {resources.length === 0 ? (
        <div className="empty-placeholder">No security resources available</div>
      ) : (
        resources.map(resource => (
          <div key={resource.id} className="resource-card">
            <div className="resource-icon">🛡️</div>
            <div className="resource-info">
              <div className="resource-name">{resource.name}</div>
              <div className="resource-details">
                <span 
                  className="resource-status" 
                  style={{ color: getStatusColor(resource.availability) }}
                >
                  {resource.availability}
                </span>
                <span className="resource-location">
                  {resource.lat.toFixed(4)}, {resource.lng.toFixed(4)}
                </span>
              </div>
              <div className="resource-meta">
                <span className="last-update">
                  Updated: {new Date(resource.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div className="resource-battery">
              <div 
                className="battery-level" 
                style={{ 
                  color: getBatteryColor(resource.battery),
                  background: `linear-gradient(90deg, ${getBatteryColor(resource.battery)}20 0%, ${getBatteryColor(resource.battery)}20 ${resource.battery}%, transparent ${resource.battery}%)`
                }}
              >
                {resource.battery}% 🔋
              </div>
            </div>
          </div>
        ))
      )}
      
      <div className="resource-stats">
        <div className="stat-item">
          <span className="stat-label">On Patrol:</span>
          <span className="stat-value">
            {resources.filter(r => r.availability === 'On Patrol').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Available:</span>
          <span className="stat-value">
            {resources.filter(r => r.availability === 'Available').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Battery:</span>
          <span className="stat-value">
            {Math.round(resources.reduce((acc, r) => acc + r.battery, 0) / resources.length)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResourceManager;