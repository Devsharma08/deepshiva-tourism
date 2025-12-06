// Local imports for better performance
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  LayersControl,
  useMap,
  useMapEvents,
  FeatureGroup
} from 'react-leaflet';

// Leaflet core
import L from 'leaflet';

// CSS imports
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icons for different tracker types
const createCustomIcon = (type) => {
  const colors = {
    tourist: '#3498db',
    ranger: '#2ecc71', 
    item: '#e74c3c'
  };
  
  const icons = {
    tourist: '👤',
    ranger: '🛡️',
    item: '📦'
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${colors[type] || '#95a5a6'};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
      ">
        ${icons[type] || '📍'}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Simple drawing controls using native Leaflet
class DrawingManager {
  constructor(map) {
    this.map = map;
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);
  }

  enableDrawing() {
    // Enable click-to-add points for polygons
    this.map.on('click', this.handleMapClick.bind(this));
  }

  disableDrawing() {
    this.map.off('click');
  }

  handleMapClick(e) {
    const { lat, lng } = e.latlng;
    // You can implement custom drawing logic here
    console.log('Map clicked at:', lat, lng);
  }
}

export {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  LayersControl,
  useMap,
  useMapEvents,
  FeatureGroup,
  L,
  createCustomIcon,
  DrawingManager
};