// Route analysis utilities
export const analyzeRouteSafety = (route, dangerZones) => {
  const analysis = {
    safetyScore: 100,
    warnings: [],
    intersections: [],
    totalRisk: 0
  };

  // Check for intersections with danger zones
  route.points.forEach((point, index) => {
    dangerZones.forEach(zone => {
      if (isPointInPolygon(point, zone.coords)) {
        analysis.intersections.push({
          point,
          zone: zone.name,
          severity: zone.severity
        });
        analysis.safetyScore -= 20;
        analysis.totalRisk += zone.severity === 'high' ? 3 : zone.severity === 'medium' ? 2 : 1;
      }
    });
  });

  // Add warnings based on analysis
  if (analysis.intersections.length > 0) {
    analysis.warnings.push({
      type: 'danger_zone_intersection',
      message: `Route intersects with ${analysis.intersections.length} danger zone(s)`,
      severity: 'high'
    });
  }

  if (route.elevationGain > 200) {
    analysis.warnings.push({
      type: 'steep_elevation',
      message: `High elevation gain: ${Math.round(route.elevationGain)}m`,
      severity: 'medium'
    });
  }

  if (route.length > 5000) {
    analysis.warnings.push({
      type: 'long_route',
      message: `Long route: ${(route.length / 1000).toFixed(1)}km`,
      severity: 'low'
    });
  }

  analysis.safetyScore = Math.max(0, analysis.safetyScore - analysis.totalRisk * 5);

  return analysis;
};

// Helper function to check if point is in polygon
const isPointInPolygon = (point, vs) => {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export const calculateOptimalRoute = (start, end, waypoints = []) => {
  // Simplified route optimization
  // In real app, use routing engine like OSRM or GraphHopper
  const allPoints = [start, ...waypoints, end];
  return {
    points: allPoints,
    length: calculateTotalDistance(allPoints),
    waypoints: waypoints.length
  };
};

const calculateTotalDistance = (points) => {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += calculateDistance(points[i-1], points[i]);
  }
  return total;
};

const calculateDistance = (point1, point2) => {
  const R = 6371000;
  const dLat = (point2[0] - point1[0]) * Math.PI / 180;
  const dLon = (point2[1] - point1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};