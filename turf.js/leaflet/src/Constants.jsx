// constants.js
export const MAP_CENTER = [28.6322, 77.2190];
export const MAP_ZOOM = 15;
export const OSRM_API_URL = 'https://router.project-osrm.org/route/v1/driving';
export const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Mock Turf.js functions
export const turfPoint = (coords) => ({ type: 'Point', coordinates: coords });
export const turfPolygon = (coords) => ({ type: 'Polygon', coordinates: coords });

export const booleanPointInPolygon = (point, polygon) => {
  const x = point.coordinates[0];
  const y = point.coordinates[1];
  const vs = polygon.coordinates[0];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export const turfDistance = (from, to, options = {}) => {
  const R = options.units === 'meters' ? 6371000 : 6371;
  const [lon1, lat1] = from.coordinates;
  const [lon2, lat2] = to.coordinates;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Mock data
export const MOCK_TOURIST_INFO = { /* ... your existing mock data ... */ };
export const MOCK_TRACKERS = { /* ... your existing mock data ... */ };
export const MOCK_DANGER_ZONES = [ /* ... your existing mock data ... */ ];
export const MOCK_SAFE_ROUTES = [ /* ... your existing mock data ... */ ];
export const MOCK_POIS = [ /* ... your existing mock data ... */ ];