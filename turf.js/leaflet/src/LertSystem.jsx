// components/AlertSystem.js
import React, { useState } from 'react';

const AlertSystem = ({ alerts, onClearAlert }) => {
  const [expandedAlert, setExpandedAlert] = useState(null);

  if (alerts.length === 0) return null;

  return (
    <div className="alert-system">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={`alert-toast ${alert.type} ${alert.priority || ''} ${expandedAlert === alert.id ? 'expanded' : ''}`}
          onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
        >
          <div className="alert-content">
            <div className="alert-icon">
              {alert.type === 'sos' ? '🆘' : 
               alert.type === 'risk' ? '⚠️' : 
               alert.type === 'zone' ? '🚨' : '🔔'}
            </div>
            <div className="alert-details">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-message">
                {expandedAlert === alert.id ? alert.message : `${alert.message.substring(0, 60)}...`}
              </div>
              <div className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
            <button 
              className="alert-close" 
              onClick={(e) => {
                e.stopPropagation();
                onClearAlert(alert.id);
              }}
            >
              ✕
            </button>
          </div>
          {alert.type === 'sos' && expandedAlert === alert.id && (
            <div className="alert-actions">
              <button className="btn-alert-action primary">Dispatch Help</button>
              <button className="btn-alert-action secondary">Contact User</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlertSystem;