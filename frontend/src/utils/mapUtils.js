// 1. Convert City Name to Lat/Lng (Using Nominatim)
export const getCoordinates = async (cityName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

// 2. Get Route & Time (Using OSRM)
export const getRouteData = async (startCoords, endCoords) => {
  try {
    // OSRM expects "lon,lat" (opposite of Google!)
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        path: route.geometry.coordinates.map(coord => [coord[1], coord[0]]), // Flip back to [lat, lon] for Leaflet
        duration: Math.round(route.duration / 60), // Convert seconds to minutes
        distance: (route.distance / 1000).toFixed(1) // Convert meters to km
      };
    }
    return null;
  } catch (error) {
    console.error("Routing error:", error);
    return null;
  }
};