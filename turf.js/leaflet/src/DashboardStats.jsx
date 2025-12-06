// components/DashboardStats.js
import React from 'react';

const DashboardStats = ({ trackers, dangerZones, alerts }) => {
  const stats = {
    totalTourists: Object.values(trackers).filter(t => t.type === 'tourist').length,
    highRiskTourists: Object.values(trackers).filter(t => t.riskLevel > 70).length,
    activeAlerts: alerts.filter(a => a.type === 'risk' || a.type === 'sos').length,
    dangerZones: dangerZones.length,
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon tourist">👤</div>
        <div className="stat-info">
          <div className="stat-value">{stats.totalTourists}</div>
          <div className="stat-label">Total Tourists</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon risk">⚠️</div>
        <div className="stat-info">
          <div className="stat-value">{stats.highRiskTourists}</div>
          <div className="stat-label">High Risk</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon alert">🚨</div>
        <div className="stat-info">
          <div className="stat-value">{stats.activeAlerts}</div>
          <div className="stat-label">Active Alerts</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon zone">🔺</div>
        <div className="stat-info">
          <div className="stat-value">{stats.dangerZones}</div>
          <div className="stat-label">Danger Zones</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;