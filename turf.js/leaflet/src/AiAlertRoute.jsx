// components/AiAlertRoute.jsx
import { Polyline } from 'react-leaflet';

const AiAlertRoute = ({ routeGeoJSON }) => {
  if (!routeGeoJSON) return null;
  
  try {
    const leafletPath = routeGeoJSON.coordinates.map(coord => [coord[1], coord[0]]);
    
    return (
      <Polyline
        positions={leafletPath}
        pathOptions={{
          color: '#dc2626', 
          weight: 8, 
          opacity: 0.9,
          className: 'poi-route-path',
          dashArray: '15, 10',
          lineCap: 'round'
        }}
      />
    );
  } catch (error) {
    console.error('Error rendering AI alert route:', error);
    return null;
  }
};

export default AiAlertRoute;