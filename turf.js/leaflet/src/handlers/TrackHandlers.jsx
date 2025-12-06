// handlers/trackerHandlers.js
import { OSRM_API_URL } from '../constants';
import { turfPoint, turfDistance } from '../constants';

// AI-Powered Emergency Alert Handler
export const handleSendAiAlert = async (
  selectedTrackerId, 
  trackers, 
  persistentPois, 
  setAiAlertModal, 
  setAiRoute, 
  setAlerts
) => {
  if (!selectedTrackerId || persistentPois.length === 0) {
    alert("No tracker selected or POIs not loaded.");
    return;
  }
  
  const tracker = trackers[selectedTrackerId];
  const trackerPoint = turfPoint([tracker.lng, tracker.lat]);

  // Find closest emergency services (hospital or police)
  let closestHelp = null;
  let minDistance = Infinity;
  let emergencyPois = [];
  
  persistentPois.filter(p => p.type === 'hospital' || p.type === 'police').forEach(poi => {
    const poiPoint = turfPoint([poi.lng, poi.lat]);
    const distance = turfDistance(trackerPoint, poiPoint, { units: 'kilometers' });
    emergencyPois.push({ ...poi, distance });
    
    if (distance < minDistance) {
      minDistance = distance;
      closestHelp = poi;
    }
  });

  if (!closestHelp) {
    alert("No nearby emergency services (hospital or police) found.");
    return;
  }

  // Sort emergency POIs by distance for the modal
  emergencyPois.sort((a, b) => a.distance - b.distance);

  const [userLat, userLng] = [tracker.lat, tracker.lng];
  const [targetLat, targetLng] = [closestHelp.lat, closestHelp.lng];
  const url = `${OSRM_API_URL}/${userLng},${userLat};${targetLng},${targetLat}?steps=true&geometries=geojson&overview=full`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('OSRM API failed');
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }
    
    const route = data.routes[0];
    const distanceKm = (route.distance / 1000).toFixed(1);
    const durationMin = (route.duration / 60).toFixed(0);
    const firstStep = route.legs[0]?.steps[0]?.maneuver?.instruction || 'Head towards destination';

    // Create detailed AI message with multiple options
    const aiMessage = `
      <strong>Emergency Alert for ${tracker.name}</strong><br/><br/>
      
      <div class="emergency-info">
        <strong>📍 Current Location:</strong><br/>
        ${tracker.lat.toFixed(5)}, ${tracker.lng.toFixed(5)}<br/>
        <em>Risk Level: ${tracker.riskLevel}% - ${tracker.status}</em>
      </div>
      
      <div class="recommended-help">
        <strong>🚨 Recommended Emergency Service:</strong><br/>
        <strong>${closestHelp.name}</strong> (${closestHelp.type})<br/>
        📏 Distance: <strong>${distanceKm} km</strong><br/>
        ⏱️ Estimated Time: <strong>${durationMin} minutes</strong>
      </div>
      
      <div class="route-instruction">
        <strong>🗺️ First Direction:</strong><br/>
        "${firstStep}"
      </div>
      
      <div class="alternative-options">
        <strong>Alternative Options:</strong><br/>
        ${emergencyPois.slice(1, 3).map(poi => `
          • ${poi.name} (${(poi.distance / 1000).toFixed(1)} km away)
        `).join('<br/>')}
      </div>
      
      <div class="emergency-message">
        <strong>📱 Message to send:</strong><br/>
        <em>"Emergency: High risk detected. Nearest help: ${closestHelp.name} (${distanceKm} km, ${durationMin} min). First: ${firstStep}. Stay calm and proceed with caution."</em>
      </div>
    `;
    
    setAiAlertModal({
      isOpen: true,
      message: aiMessage,
      routeData: route,
      closestHelp: closestHelp,
      tracker: tracker,
      onConfirm: () => {
        // Set the route on the map
        setAiRoute(route.geometry);
        
        // Close modal
        setAiAlertModal({ isOpen: false, message: '', onConfirm: () => {} });
        
        // Create success alert
        setAlerts(prev => [{
          id: Date.now(),
          type: 'broadcast',
          title: '🤖 AI ALERT SENT',
          message: `Sent emergency directions to ${closestHelp.name} for ${tracker.name}. Distance: ${distanceKm} km, ETA: ${durationMin} min.`,
          timestamp: new Date().toISOString(),
          priority: 'high',
          trackerId: tracker.id,
          actions: [
            { label: 'View Route', action: 'view_route' },
            { label: 'Contact Help', action: 'contact_help' }
          ]
        }, ...prev]);
        
        // Also send to other emergency channels (simulated)
        simulateEmergencyNotification(tracker, closestHelp, distanceKm, durationMin);
      },
      onAlternative: (alternativePoi) => {
        // Handle alternative POI selection
        handleAlternativeHelpSelection(alternativePoi, tracker, setAiRoute, setAlerts);
      }
    });

  } catch (error) {
    console.error("Error in AI Alert:", error);
    
    // Fallback to simple distance-based recommendation
    const fallbackMessage = `
      <strong>Emergency Alert for ${tracker.name}</strong><br/><br/>
      
      <div class="emergency-info">
        <strong>⚠️ Route Calculation Failed</strong><br/>
        Using straight-line distance instead.
      </div>
      
      <div class="recommended-help">
        <strong>🚨 Nearest Emergency Service:</strong><br/>
        <strong>${closestHelp.name}</strong> (${closestHelp.type})<br/>
        📏 Straight-line Distance: <strong>${(minDistance).toFixed(1)} km</strong>
      </div>
      
      <div class="emergency-message">
        <strong>📱 Message to send:</strong><br/>
        <em>"Emergency: High risk detected. Nearest help: ${closestHelp.name} (approx. ${(minDistance).toFixed(1)} km away). Proceed with caution and contact authorities."</em>
      </div>
    `;
    
    setAiAlertModal({
      isOpen: true,
      message: fallbackMessage,
      closestHelp: closestHelp,
      tracker: tracker,
      onConfirm: () => {
        setAiAlertModal({ isOpen: false, message: '', onConfirm: () => {} });
        setAlerts(prev => [{
          id: Date.now(),
          type: 'broadcast',
          title: '🤖 AI ALERT SENT (Fallback)',
          message: `Sent emergency notification for ${tracker.name}. Nearest help: ${closestHelp.name} (${(minDistance).toFixed(1)} km).`,
          timestamp: new Date().toISOString(),
          priority: 'high',
          trackerId: tracker.id
        }, ...prev]);
        
        simulateEmergencyNotification(tracker, closestHelp, minDistance, null);
      }
    });
  }
};

// Broadcast Alert to All Tourists
export const handleSendBroadcastAlert = (setAlerts, trackers) => {
  const message = prompt("Enter broadcast message for all tourists:");
  if (!message) return;
  
  const touristCount = Object.values(trackers).filter(t => t.type === 'tourist').length;
  
  const alert = {
    id: Date.now(),
    type: 'broadcast',
    title: '📣 BROADCAST ALERT',
    message: message,
    timestamp: new Date().toISOString(),
    priority: 'critical',
    affectedTourists: touristCount,
    actions: [
      { label: 'Acknowledge All', action: 'acknowledge_all' },
      { label: 'Send Reminder', action: 'send_reminder' }
    ]
  };
  
  setAlerts(prev => [alert, ...prev]);
  
  // Simulate sending to all tourists
  simulateBroadcastToTourists(message, touristCount);
};

// Route to Point of Interest
export const handleRouteToPoi = async (poiCoords, poiId, selectedTrackerId, trackers, setAiRoute, mapRef, persistentPois) => {
  if (!selectedTrackerId) return;
  
  const tracker = trackers[selectedTrackerId];
  const poi = persistentPois.find(p => p.id === poiId);
  const [userLat, userLng] = [tracker.lat, tracker.lng];
  const [targetLat, targetLng] = poiCoords;
  const url = `${OSRM_API_URL}/${userLng},${userLat};${targetLng},${targetLat}?steps=false&geometries=geojson&overview=full`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('OSRM API failed');
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      setAiRoute(route.geometry);
      
      // Calculate route statistics
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMin = Math.round(route.duration / 60);
      
      // Fit map to show entire route
      const bounds = L.latLngBounds([userLat, userLng], poiCoords);
      if (mapRef.current) {
        mapRef.current.fitBounds(bounds, { padding: [80, 80] });
      }
      
      // Show route info alert
      setTimeout(() => {
        // This would typically be set in the main component's state
        console.log(`Route to ${poi.name}: ${distanceKm} km, ${durationMin} min`);
      }, 500);
      
    }
  } catch (error) {
    console.error('Error fetching OSRM route:', error);
    
    // Fallback: Show straight-line distance
    const trackerPoint = turfPoint([tracker.lng, tracker.lat]);
    const poiPoint = turfPoint([poiCoords[1], poiCoords[0]]);
    const straightDistance = turfDistance(trackerPoint, poiPoint, { units: 'kilometers' });
    
    alert(`Could not calculate detailed route. Straight-line distance: ${straightDistance.toFixed(1)} km`);
  }
};

// Alternative Help Selection Handler
const handleAlternativeHelpSelection = async (alternativePoi, tracker, setAiRoute, setAlerts) => {
  const [userLat, userLng] = [tracker.lat, tracker.lng];
  const [targetLat, targetLng] = [alternativePoi.lat, alternativePoi.lng];
  const url = `${OSRM_API_URL}/${userLng},${userLat};${targetLng},${targetLat}?steps=true&geometries=geojson&overview=full`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('OSRM API failed');
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMin = (route.duration / 60).toFixed(0);
      
      setAiRoute(route.geometry);
      
      setAlerts(prev => [{
        id: Date.now(),
        type: 'broadcast',
        title: '🤖 ALTERNATIVE ROUTE SET',
        message: `Alternative route to ${alternativePoi.name} for ${tracker.name}. Distance: ${distanceKm} km, ETA: ${durationMin} min.`,
        timestamp: new Date().toISOString(),
        priority: 'medium',
        trackerId: tracker.id
      }, ...prev]);
    }
  } catch (error) {
    console.error("Error calculating alternative route:", error);
    alert("Failed to calculate alternative route. Please try the primary option.");
  }
};

// Simulation Functions
const simulateEmergencyNotification = (tracker, helpLocation, distance, duration) => {
  console.log(`🚨 EMERGENCY NOTIFICATION SENT:
    Tourist: ${tracker.name}
    Help: ${helpLocation.name} (${helpLocation.type})
    Distance: ${distance} km
    ETA: ${duration} minutes
    Timestamp: ${new Date().toISOString()}
  `);
  
  // Simulate API calls to emergency services
  setTimeout(() => {
    console.log(`📞 Notified local authorities about ${tracker.name}'s emergency`);
  }, 1000);
  
  setTimeout(() => {
    console.log(`📱 Sent SMS alert to ${tracker.name} with emergency instructions`);
  }, 2000);
};

const simulateBroadcastToTourists = (message, touristCount) => {
  console.log(`📢 BROADCASTING TO ${touristCount} TOURISTS:
    Message: "${message}"
    Timestamp: ${new Date().toISOString()}
  `);
  
  // Simulate sending to each tourist
  for (let i = 1; i <= touristCount; i++) {
    setTimeout(() => {
      console.log(`✅ Message delivered to tourist ${i}`);
    }, i * 100);
  }
};

// Additional Utility Handlers
export const handleClearRoute = (setAiRoute, setAlerts) => {
  setAiRoute(null);
  setAlerts(prev => [{
    id: Date.now(),
    type: 'zone',
    title: '🗺️ ROUTE CLEARED',
    message: 'Active route has been cleared from the map.',
    timestamp: new Date().toISOString(),
    priority: 'low'
  }, ...prev]);
};

export const handleQuickEmergency = (selectedTrackerId, trackers, setAlerts) => {
  if (!selectedTrackerId) {
    alert("Please select a tracker first.");
    return;
  }
  
  const tracker = trackers[selectedTrackerId];
  
  setAlerts(prev => [{
    id: Date.now(),
    type: 'sos',
    title: '🚨 QUICK EMERGENCY ALERT',
    message: `Emergency alert triggered for ${tracker.name}. Authorities have been notified.`,
    timestamp: new Date().toISOString(),
    priority: 'critical',
    trackerId: tracker.id,
    actions: [
      { label: 'Dispatch Team', action: 'dispatch' },
      { label: 'Call Tourist', action: 'call' },
      { label: 'Notify Family', action: 'notify_family' }
    ]
  }, ...prev]);
  
  // Simulate emergency response
  simulateQuickEmergencyResponse(tracker);
};

const simulateQuickEmergencyResponse = (tracker) => {
  console.log(`🚨 QUICK EMERGENCY ACTIVATED FOR: ${tracker.name}`);
  
  const responses = [
    { time: 1000, action: '🚓 Alerting nearest police unit' },
    { time: 3000, action: '🏥 Notifying local hospitals' },
    { time: 5000, action: '📞 Contacting emergency contacts' },
    { time: 7000, action: '📍 Tracking team dispatched' }
  ];
  
  responses.forEach(response => {
    setTimeout(() => {
      console.log(response.action);
    }, response.time);
  });
};

// Export all handlers
export default {
  handleSendAiAlert,
  handleSendBroadcastAlert,
  handleRouteToPoi,
  handleClearRoute,
  handleQuickEmergency
};