// components/TouristList.js
import React from 'react';
import { MOCK_TOURIST_INFO } from './Constants.jsx';

const TouristList = ({ trackers, selectedTrackerId, onTrackerSelect }) => {
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
};

export default TouristList;