// hooks/useRiskDetection.js
import { useCallback } from 'react';
import { turfPoint, turfPolygon, booleanPointInPolygon, turfDistance } from '../constants';

export const useRiskDetection = (trackers, dangerZones) => {
  const calculateRiskForTracker = useCallback((tracker, zones) => {
    let riskScore = 0;
    const factors = [];
    const trackerPoint = turfPoint([tracker.lng, tracker.lat]);

    let inZone = false;
    let closestZoneDistance = Infinity;
    
    zones.forEach(zone => {
      const zonePolygon = turfPolygon(zone.turfCoords);
      if (booleanPointInPolygon(trackerPoint, zonePolygon)) {
        riskScore += zone.riskFactor || 80;
        factors.push(`Inside ${zone.name}`);
        inZone = true;
        closestZoneDistance = 0;
      } else {
        zone.coords.forEach(coord => {
          const distance = turfDistance(trackerPoint, turfPoint([coord[1], coord[0]]), { units: 'kilometers' });
          if (distance < closestZoneDistance) {
            closestZoneDistance = distance;
          }
        });
      }
    });

    // ... rest of risk calculation logic

    const status = inZone ? 'DANGER' : 
                   closestZoneDistance < 0.1 ? 'WARNING' : 
                   riskScore > 50 ? 'CAUTION' : 'Safe';

    return {
      level: Math.min(riskScore, 99),
      factors,
      inZone,
      closestTouristDistance,
      closestZoneDistance,
      status
    };
  }, []);

  return { calculateRiskForTracker };
};