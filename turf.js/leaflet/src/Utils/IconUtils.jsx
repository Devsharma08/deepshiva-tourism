// utils/iconUtils.js
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const createCustomIcon = (type, riskLevel = 0, isSelected = false) => {
  // Define colors based on type and risk level
  const colors = {
    tourist: riskLevel > 70 ? '#ef4444' : riskLevel > 40 ? '#f59e0b' : '#10b981',
    ranger: '#22c55e',
    hospital: '#dc2626',
    police: '#2563eb',
    shop: '#14b8a6',
    restaurant: '#f59e0b',
    hotel: '#8b5cf6',
    attraction: '#ec4899',
    emergency: '#ef4444',
    default: '#6b7280'
  };

  // Define icons/emojis for each type
  const icons = {
    tourist: riskLevel > 70 ? '🚨' : riskLevel > 40 ? '⚠️' : '👤',
    ranger: '🛡️',
    hospital: '🏥',
    police: '🚓',
    shop: '🛒',
    restaurant: '🍽️',
    hotel: '🏨',
    attraction: '🏛️',
    emergency: '🆘',
    default: '📍'
  };

  // Define pulse animation classes based on risk level
  const pulseClass = riskLevel > 70 ? 'pulse-high-risk' : riskLevel > 40 ? 'pulse-medium-risk' : '';

  // Additional selected state styling
  const selectedClass = isSelected ? 'selected-marker' : '';
  const borderColor = isSelected ? '#3b82f6' : colors[type] || colors.default;

  return L.divIcon({
    className: `custom-marker ${type}-marker ${pulseClass} ${selectedClass}`,
    html: `
      <div class="custom-marker-container">
        <div class="custom-marker-icon" style="
          background: ${colors[type] || colors.default}; 
          border-color: ${borderColor};
          box-shadow: 0 4px 12px ${isSelected ? 'rgba(59, 130, 246, 0.4)' : 'rgba(0,0,0,0.3)'};
          transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
        ">
          ${icons[type] || icons.default}
          ${riskLevel > 70 ? '<div class="risk-badge">⚠️</div>' : ''}
          ${isSelected ? '<div class="selection-ring"></div>' : ''}
        </div>
        ${riskLevel > 40 ? `
          <div class="risk-level" style="
            background: ${riskLevel > 70 ? '#ef4444' : riskLevel > 40 ? '#f59e0b' : '#10b981'};
          ">
            ${riskLevel}%
          </div>
        ` : ''}
        ${isSelected ? '<div class="selection-arrow"></div>' : ''}
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
    tooltipAnchor: [21, -21]
  });
};

// Special icon for selected trackers
export const createSelectedIcon = (type, riskLevel = 0) => {
  return createCustomIcon(type, riskLevel, true);
};

// Icon for temporary drawing points
export const createTempPointIcon = (pointNumber, type = 'point') => {
  const colors = {
    point: '#3b82f6',
    route: '#10b981',
    zone: '#ef4444'
  };

  return L.divIcon({
    className: `temp-point-icon ${type}-point`,
    html: `
      <div class="temp-point-marker" style="background: ${colors[type] || colors.point}">
        <span class="point-number">${pointNumber}</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

// Icon for POI (Points of Interest)
export const createPoiIcon = (poiType, isClosest = false) => {
  const poiColors = {
    hospital: '#dc2626',
    police: '#2563eb',
    shop: '#14b8a6',
    restaurant: '#f59e0b',
    hotel: '#8b5cf6',
    attraction: '#ec4899',
    emergency: '#ef4444',
    default: '#6b7280'
  };

  const poiIcons = {
    hospital: '🏥',
    police: '🚓',
    shop: '🛒',
    restaurant: '🍽️',
    hotel: '🏨',
    attraction: '🏛️',
    emergency: '🆘',
    default: '📍'
  };

  return L.divIcon({
    className: `poi-marker ${poiType}-poi ${isClosest ? 'closest-poi' : ''}`,
    html: `
      <div class="poi-marker-container">
        <div class="poi-icon" style="
          background: ${poiColors[poiType] || poiColors.default};
          ${isClosest ? 'border: 3px solid #f59e0b; transform: scale(1.2);' : ''}
        ">
          ${poiIcons[poiType] || poiIcons.default}
        </div>
        ${isClosest ? '<div class="closest-badge">⭐</div>' : ''}
      </div>
    `,
    iconSize: isClosest ? [48, 48] : [36, 36],
    iconAnchor: isClosest ? [24, 48] : [18, 36],
    popupAnchor: [0, isClosest ? -48 : -36]
  });
};

// Icon for danger zones
export const createDangerZoneIcon = (severity = 'high') => {
  const severityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#f97316'
  };

  const severityIcons = {
    high: '🚨',
    medium: '⚠️',
    low: '🔶'
  };

  return L.divIcon({
    className: `danger-zone-icon ${severity}-severity`,
    html: `
      <div class="danger-zone-marker">
        <div class="danger-icon" style="background: ${severityColors[severity] || severityColors.high}">
          ${severityIcons[severity] || severityIcons.high}
        </div>
        <div class="severity-badge">${severity.toUpperCase()}</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Icon for safe routes
export const createSafeRouteIcon = (difficulty = 'easy') => {
  const difficultyColors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444'
  };

  const difficultyIcons = {
    easy: '🛣️',
    medium: '🚶',
    hard: '🚵'
  };

  return L.divIcon({
    className: `safe-route-icon ${difficulty}-difficulty`,
    html: `
      <div class="safe-route-marker">
        <div class="route-icon" style="background: ${difficultyColors[difficulty] || difficultyColors.easy}">
          ${difficultyIcons[difficulty] || difficultyIcons.easy}
        </div>
        <div class="difficulty-badge">${difficulty.toUpperCase()}</div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

// Icon for weather information
export const createWeatherIcon = (weatherCode, temperature, isDay = true) => {
  const weatherIcons = {
    0: isDay ? '☀️' : '🌙', // Clear sky
    1: isDay ? '🌤️' : '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌦️', // Light drizzle
    53: '🌦️', // Moderate drizzle
    55: '🌦️', // Dense drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    71: '🌨️', // Slight snow
    73: '🌨️', // Moderate snow
    75: '🌨️', // Heavy snow
    77: '🌨️', // Snow grains
    80: '🌦️', // Slight rain showers
    81: '🌧️', // Moderate rain showers
    82: '🌧️', // Violent rain showers
    85: '🌨️', // Slight snow showers
    86: '🌨️', // Heavy snow showers
    95: '⛈️', // Thunderstorm
    96: '⛈️', // Thunderstorm with slight hail
    99: '⛈️' // Thunderstorm with heavy hail
  };

  const tempColor = temperature > 30 ? '#ef4444' : temperature > 20 ? '#f59e0b' : '#3b82f6';

  return L.divIcon({
    className: 'weather-marker',
    html: `
      <div class="weather-marker-container">
        <div class="weather-icon">
          ${weatherIcons[weatherCode] || '☀️'}
        </div>
        <div class="temperature-badge" style="background: ${tempColor}">
          ${Math.round(temperature)}°
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44]
  });
};

// Batch icon creation for multiple markers
export const createIconsBatch = (items, iconType = 'tourist') => {
  return items.map(item => {
    switch (iconType) {
      case 'tourist':
        return createCustomIcon('tourist', item.riskLevel);
      case 'ranger':
        return createCustomIcon('ranger');
      case 'poi':
        return createPoiIcon(item.type);
      case 'danger':
        return createDangerZoneIcon(item.severity);
      case 'route':
        return createSafeRouteIcon(item.difficulty);
      default:
        return createCustomIcon(iconType);
    }
  });
};

// Utility to get icon configuration
export const getIconConfig = (type) => {
  const configs = {
    tourist: { color: '#10b981', icon: '👤', size: 36 },
    ranger: { color: '#22c55e', icon: '🛡️', size: 36 },
    hospital: { color: '#dc2626', icon: '🏥', size: 32 },
    police: { color: '#2563eb', icon: '🚓', size: 32 },
    shop: { color: '#14b8a6', icon: '🛒', size: 30 },
    restaurant: { color: '#f59e0b', icon: '🍽️', size: 30 },
    hotel: { color: '#8b5cf6', icon: '🏨', size: 32 },
    attraction: { color: '#ec4899', icon: '🏛️', size: 32 }
  };

  return configs[type] || { color: '#6b7280', icon: '📍', size: 36 };
};

// Export default function
export default createCustomIcon;