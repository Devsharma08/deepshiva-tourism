import React, { useState } from 'react';

const RouteManager = ({ routes, onRouteSelect, onRouteDelete, onRouteEdit }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredRoutes = routes.filter(route => {
    if (filter === 'all') return true;
    return route.difficulty === filter;
  });

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'length':
        return a.length - b.length;
      case 'difficulty':
        return a.difficulty.localeCompare(b.difficulty);
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#27ae60';
      case 'medium': return '#f39c12';
      case 'difficult': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatLength = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxHeight: '400px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>
        🛣️ Managed Routes ({routes.length})
      </h3>

      {/* Filters and Sorting */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '6px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px',
            flex: 1
          }}
        >
          <option value="all">All Routes</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '6px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px',
            flex: 1
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="length">Sort by Length</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {/* Routes List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {sortedRoutes.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#7f8c8d', 
            padding: '20px',
            fontStyle: 'italic'
          }}>
            No routes found. Create your first safe route!
          </div>
        ) : (
          sortedRoutes.map(route => (
            <div
              key={route.id}
              style={{
                padding: '12px',
                border: '1px solid #e1e5e9',
                borderRadius: '6px',
                marginBottom: '8px',
                background: '#f8f9fa',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e8f4fd';
                e.target.style.borderColor = '#3498db';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f8f9fa';
                e.target.style.borderColor = '#e1e5e9';
              }}
              onClick={() => onRouteSelect(route)}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '6px'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2c3e50' }}>
                  {route.name}
                </div>
                <span
                  style={{
                    background: getDifficultyColor(route.difficulty),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                >
                  {route.difficulty}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                {route.description}
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#7f8c8d'
              }}>
                <span>📏 {formatLength(route.length)}</span>
                <span>⛰️ {Math.round(route.elevationGain)}m gain</span>
                <span>📅 {new Date(route.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '6px', 
                marginTop: '8px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRouteSelect(route);
                  }}
                  style={{
                    padding: '4px 8px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                >
                  👁️ View
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRouteEdit(route);
                  }}
                  style={{
                    padding: '4px 8px',
                    background: '#f39c12',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                >
                  ✏️ Edit
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete route "${route.name}"?`)) {
                      onRouteDelete(route.id);
                    }
                  }}
                  style={{
                    padding: '4px 8px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RouteManager;