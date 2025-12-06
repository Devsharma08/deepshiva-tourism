// components/MapDeselector.jsx
import { useMapEvents } from 'react-leaflet';

const MapDeselector = ({ onDeselect }) => {
  useMapEvents({
    click: (e) => {
      // Check if click was on the map container itself, not on any map features
      if (e.originalEvent.target.classList.contains('leaflet-container')) {
        onDeselect();
      }
    },
    
    // Also deselect when user starts dragging the map
    dragstart: () => {
      onDeselect();
    },
    
    // Deselect when zooming
    zoomstart: () => {
      onDeselect();
    }
  });
  
  return null;
};

export default MapDeselector;