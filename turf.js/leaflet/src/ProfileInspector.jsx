// components/ProfileInspector.jsx
import React from 'react';
import { MOCK_TOURIST_INFO } from './Constants.jsx';

const ProfileInspector = ({ tracker }) => {
  const profile = MOCK_TOURIST_INFO[tracker.infoId];
  
  if (!profile) {
    return (
      <div className="inspector-content">
        <div className="empty-placeholder">No profile data available for this tracker.</div>
      </div>
    );
  }

  const getRiskColor = (riskLevel) => {
    if (riskLevel > 70) return '#ef4444';
    if (riskLevel > 40) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="inspector-content">
      <div className="profile-header">
        <div className="profile-avatar" style={{ background: getRiskColor(tracker.riskLevel) }}>
          {tracker.riskLevel > 70 ? '🚨' : '👤'}
        </div>
        <div className="profile-info">
          <h3>{profile.name}</h3>
          <div className="profile-group">{profile.group}</div>
        </div>
        <div 
          className="risk-badge-large"
          style={{ background: getRiskColor(tracker.riskLevel) }}
        >
          {tracker.riskLevel}% Risk
        </div>
      </div>

      <div className="profile-section">
        <h4>📋 Basic Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <span className="info-value">{profile.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Permit ID:</span>
            <span className="info-value">{profile.permit}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tracker ID:</span>
            <span className="info-value">{tracker.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Update:</span>
            <span className="info-value">
              {new Date(tracker.lastUpdate).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h4>📍 Current Status</h4>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Battery Level:</span>
            <div className="battery-display">
              <div 
                className="battery-fill"
                style={{ 
                  width: `${tracker.battery}%`,
                  background: tracker.battery > 30 ? '#10b981' : '#ef4444'
                }}
              ></div>
              <span className="battery-text">{tracker.battery.toFixed(0)}%</span>
            </div>
          </div>
          <div className="status-item">
            <span className="status-label">Coordinates:</span>
            <span className="status-value">
              {tracker.lat.toFixed(5)}, {tracker.lng.toFixed(5)}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Signal Strength:</span>
            <div className="signal-bars">
              <div className={`signal-bar ${tracker.battery > 80 ? 'active' : ''}`}></div>
              <div className={`signal-bar ${tracker.battery > 60 ? 'active' : ''}`}></div>
              <div className={`signal-bar ${tracker.battery > 40 ? 'active' : ''}`}></div>
              <div className={`signal-bar ${tracker.battery > 20 ? 'active' : ''}`}></div>
            </div>
          </div>
        </div>
      </div>

      {profile.members.length > 0 && (
        <div className="profile-section">
          <h4>👥 Group Members ({profile.members.length})</h4>
          <div className="members-list">
            {profile.members.map(member => (
              <div key={member.id} className="member-card">
                <div className="member-avatar">
                  {member.relation === 'Child' ? '👶' : 
                   member.relation === 'Spouse' ? '💑' : '👤'}
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-details">
                    {member.relation}
                    {member.age && ` • Age: ${member.age}`}
                  </div>
                </div>
                <div className="member-status">
                  <div className="status-dot online"></div>
                  <span>With Group</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="profile-actions">
        <button className="btn-profile-action primary">
          📞 Call Tourist
        </button>
        <button className="btn-profile-action secondary">
          📱 Send Message
        </button>
        <button className="btn-profile-action warning">
          🚨 Emergency Contact
        </button>
      </div>
    </div>
  );
};

export default ProfileInspector;