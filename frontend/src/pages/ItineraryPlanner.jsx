import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ItineraryHeader from '../components/itinerary/ItineraryHeader';
import DestinationPanel from '../components/itinerary/DestinationPanel';
import TimelineView from '../components/itinerary/TimelineView';
import MapView from '../components/itinerary/MapView';
import DetailsPanel from '../components/itinerary/DetailsPanel';
import ItineraryChatPopup, { ItineraryChatButton } from '../components/itinerary/ItineraryChatPopup';
import { getAttractions, getNearbyPlaces as fetchNearbyPlaces } from '../utils/overpassService';

function ItineraryPlanner() {
    const navigate = useNavigate();

    // Trip context state with search location
    const [tripContext, setTripContext] = useState({
        title: 'Agra Heritage Tour',
        dateRange: {
            start: new Date().toISOString().split('T')[0],
            end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        pace: 'balanced',
        transportMode: 'car',
        partySize: 2,
        // Search location for Overpass API
        location: {
            lat: 27.1751, // Agra (Taj Mahal)
            lon: 78.0421,
            name: 'Agra'
        }
    });

    // Destinations state - starts empty, loaded from API
    const [destinations, setDestinations] = useState([]);
    const [nearbySuggestions, setNearbySuggestions] = useState([]);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // UI state
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [hoveredDestination, setHoveredDestination] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showDetailsPanel, setShowDetailsPanel] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Load destinations from Overpass API on mount
    useEffect(() => {
        async function loadDestinations() {
            setIsLoadingDestinations(true);
            setLoadError(null);

            try {
                // Fetch attractions from Overpass API
                const attractions = await getAttractions(
                    tripContext.location.lat,
                    tripContext.location.lon,
                    10000, // 10km radius
                    null,  // All categories
                    20     // Up to 20 results
                );

                if (attractions.length > 0) {
                    setDestinations(attractions);
                }

                // Also fetch nearby suggestions for the map
                const nearby = await fetchNearbyPlaces(
                    tripContext.location.lat,
                    tripContext.location.lon,
                    2000, // 2km radius for nearby
                    5
                );
                setNearbySuggestions(nearby.filter(n => !attractions.find(a => a.id === n.id)));

            } catch (error) {
                console.error('Error loading destinations:', error);
                setLoadError('Failed to load attractions. Please try again.');
            } finally {
                setIsLoadingDestinations(false);
            }
        }

        loadDestinations();
    }, [tripContext.location.lat, tripContext.location.lon]);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Get unscheduled destinations
    const unscheduledDestinations = destinations.filter(d => d.scheduledDay === null);

    // Calculate trip days
    const getTripDays = useCallback(() => {
        const start = new Date(tripContext.dateRange.start);
        const end = new Date(tripContext.dateRange.end);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return Array.from({ length: Math.max(1, days) }, (_, i) => i + 1);
    }, [tripContext.dateRange]);

    // Check for conflicts in opening hours
    const checkConflicts = useCallback((dests) => {
        return dests.map(dest => {
            if (!dest.scheduledDay || !dest.scheduledTime || !dest.openingHours) {
                return { ...dest, hasConflict: false, conflictReason: null };
            }

            const [schedHour, schedMin] = dest.scheduledTime.split(':').map(Number);
            const scheduledMinutes = schedHour * 60 + schedMin;
            const endMinutes = scheduledMinutes + dest.duration;

            // Check if closed on certain days
            if (dest.openingHours.includes('Closed Monday')) {
                const tripStart = new Date(tripContext.dateRange.start);
                tripStart.setDate(tripStart.getDate() + dest.scheduledDay - 1);
                if (tripStart.getDay() === 1) { // Monday
                    return {
                        ...dest,
                        hasConflict: true,
                        conflictReason: `${dest.name} is closed on Mondays`
                    };
                }
            }

            // Parse opening hours
            const hoursMatch = dest.openingHours.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
            if (hoursMatch) {
                const openMinutes = parseInt(hoursMatch[1]) * 60 + parseInt(hoursMatch[2]);
                const closeMinutes = parseInt(hoursMatch[3]) * 60 + parseInt(hoursMatch[4]);

                if (scheduledMinutes < openMinutes) {
                    return {
                        ...dest,
                        hasConflict: true,
                        conflictReason: `Opens at ${hoursMatch[1]}:${hoursMatch[2]}, scheduled too early`
                    };
                }
                if (endMinutes > closeMinutes) {
                    return {
                        ...dest,
                        hasConflict: true,
                        conflictReason: `Closes at ${hoursMatch[3]}:${hoursMatch[4]}, not enough time`
                    };
                }
            }

            return { ...dest, hasConflict: false, conflictReason: null };
        });
    }, [tripContext.dateRange]);

    // Apply conflict checking whenever destinations change
    useEffect(() => {
        const withConflicts = checkConflicts(destinations);
        const hasChanges = withConflicts.some((d, i) =>
            d.hasConflict !== destinations[i].hasConflict ||
            d.conflictReason !== destinations[i].conflictReason
        );
        if (hasChanges) {
            setDestinations(withConflicts);
        }
    }, [destinations, checkConflicts]);

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle adding destination to schedule
    const addToSchedule = useCallback((destinationId, day, time = '09:00') => {
        setDestinations(prev => {
            const updated = prev.map(d => {
                if (d.id === destinationId) {
                    // Calculate time based on existing schedule
                    const dayDests = prev.filter(dest =>
                        dest.scheduledDay === day && dest.id !== destinationId
                    ).sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));

                    let scheduledTime = '09:00';
                    if (dayDests.length > 0) {
                        const lastDest = dayDests[dayDests.length - 1];
                        if (lastDest.scheduledTime) {
                            const [h, m] = lastDest.scheduledTime.split(':').map(Number);
                            const transitTime = tripContext.transportMode === 'walking' ? 30 :
                                tripContext.transportMode === 'transit' ? 25 : 15;
                            const totalMins = h * 60 + m + lastDest.duration + transitTime;
                            const newH = Math.floor(totalMins / 60);
                            const newM = totalMins % 60;
                            scheduledTime = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
                        }
                    }

                    return { ...d, scheduledDay: day, scheduledTime };
                }
                return d;
            });
            return updated;
        });
        showNotification(`Added to Day ${day}!`);
    }, [tripContext.transportMode]);

    // Handle removing from schedule
    const removeFromSchedule = useCallback((destinationId) => {
        setDestinations(prev => prev.map(d => {
            if (d.id === destinationId) {
                return { ...d, scheduledDay: null, scheduledTime: null, hasConflict: false, conflictReason: null };
            }
            return d;
        }));
        showNotification('Removed from schedule', 'info');
    }, []);

    // Handle reordering within schedule
    const reorderSchedule = useCallback((destinationId, newDay, newTime) => {
        setDestinations(prev => prev.map(d => {
            if (d.id === destinationId) {
                return { ...d, scheduledDay: newDay, scheduledTime: newTime };
            }
            return d;
        }));
    }, []);

    // Handle priority change
    const handlePriorityChange = useCallback((destinationId, newPriority) => {
        setDestinations(prev => prev.map(d => {
            if (d.id === destinationId) {
                return { ...d, priority: newPriority };
            }
            return d;
        }));
    }, []);

    // Handle adding new destination from search
    const handleAddNewDestination = useCallback((newDest) => {
        setDestinations(prev => [...prev, newDest]);
        showNotification(`${newDest.name} added to your list!`);
    }, []);

    // Auto-optimize algorithm
    const optimizeItinerary = useCallback(async () => {
        setIsOptimizing(true);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const days = getTripDays();
        const mustVisit = destinations.filter(d => d.priority === 'must-visit');
        const optional = destinations.filter(d => d.priority === 'optional');

        // Calculate items per day based on pace
        const paceMultiplier = {
            relaxed: 0.5,
            balanced: 0.7,
            packed: 0.9
        };

        const hoursPerDay = 10 * paceMultiplier[tripContext.pace];
        let allDestinations = [...mustVisit, ...optional];

        // Sort by geographic proximity (cluster nearby locations)
        allDestinations.sort((a, b) => {
            const distA = Math.sqrt(Math.pow(a.coordinates.lat, 2) + Math.pow(a.coordinates.lng, 2));
            const distB = Math.sqrt(Math.pow(b.coordinates.lat, 2) + Math.pow(b.coordinates.lng, 2));
            return distA - distB;
        });

        let currentDay = 1;
        let currentDayMinutes = 0;
        let dayStartHour = 9;
        const maxDayMinutes = hoursPerDay * 60;

        const transitTime = tripContext.transportMode === 'walking' ? 30 :
            tripContext.transportMode === 'transit' ? 25 : 15;

        const optimized = allDestinations.map((dest, index) => {
            const totalTimeNeeded = dest.duration + (index > 0 ? transitTime : 0);

            if (currentDayMinutes + totalTimeNeeded > maxDayMinutes && currentDay < days.length) {
                currentDay++;
                currentDayMinutes = 0;
                dayStartHour = 9;
            }

            // Respect opening hours
            let startMinutes = dayStartHour * 60 + currentDayMinutes;

            // Parse opening hours to avoid scheduling before open
            const hoursMatch = dest.openingHours?.match(/(\d{2}):(\d{2})/);
            if (hoursMatch) {
                const openMinutes = parseInt(hoursMatch[1]) * 60 + parseInt(hoursMatch[2]);
                if (startMinutes < openMinutes) {
                    startMinutes = openMinutes;
                    currentDayMinutes = openMinutes - dayStartHour * 60;
                }
            }

            const hours = Math.floor(startMinutes / 60);
            const minutes = startMinutes % 60;
            const scheduledTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            currentDayMinutes = startMinutes - dayStartHour * 60 + dest.duration + transitTime;

            return {
                ...dest,
                scheduledDay: currentDay <= days.length ? currentDay : null,
                scheduledTime: currentDay <= days.length ? scheduledTime : null
            };
        });

        setDestinations(optimized);
        setIsOptimizing(false);
        showNotification('Itinerary optimized! 🎉');
    }, [destinations, tripContext, getTripDays]);

    // Update trip context
    const updateTripContext = useCallback((updates) => {
        setTripContext(prev => ({ ...prev, ...updates }));
    }, []);

    // Handle destination click for details
    const handleDestinationClick = useCallback((destination) => {
        setSelectedDestination(destination);
        setShowDetailsPanel(true);
    }, []);

    // Get scheduled destinations grouped by day
    const getScheduledByDay = useCallback(() => {
        const days = getTripDays();
        return days.map(day => ({
            day,
            destinations: destinations
                .filter(d => d.scheduledDay === day)
                .sort((a, b) => {
                    if (!a.scheduledTime || !b.scheduledTime) return 0;
                    return a.scheduledTime.localeCompare(b.scheduledTime);
                })
        }));
    }, [destinations, getTripDays]);

    // Handle save
    const handleSave = () => {
        // Save to localStorage for demo
        localStorage.setItem('itinerary', JSON.stringify({
            tripContext,
            destinations: destinations.filter(d => d.scheduledDay !== null)
        }));
        showNotification('Itinerary saved! ✓');
    };

    // Handle share
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        showNotification('Link copied to clipboard!');
    };

    // Handle export
    const handleExport = () => {
        const scheduledDests = destinations.filter(d => d.scheduledDay !== null);
        const exportData = {
            tripTitle: tripContext.title,
            dates: `${tripContext.dateRange.start} to ${tripContext.dateRange.end}`,
            totalDays: getTripDays().length,
            totalPlaces: scheduledDests.length,
            schedule: getScheduledByDay().map(day => ({
                day: day.day,
                places: day.destinations.map(d => ({
                    name: d.name,
                    time: d.scheduledTime,
                    duration: `${Math.floor(d.duration / 60)}h ${d.duration % 60}m`
                }))
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tripContext.title.replace(/\s+/g, '_')}_itinerary.json`;
        a.click();
        showNotification('Itinerary exported!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right-5 ${notification.type === 'success' ? 'bg-green-500 text-white' :
                    notification.type === 'error' ? 'bg-red-500 text-white' :
                        'bg-blue-500 text-white'
                    }`}>
                    {notification.type === 'success' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            {/* Header */}
            <ItineraryHeader
                tripContext={tripContext}
                updateTripContext={updateTripContext}
                onBack={() => navigate('/')}
                onSave={handleSave}
                onShare={handleShare}
                onExport={handleExport}
            />

            {/* Main Content */}
            <div className="relative z-10 flex h-[calc(100vh-80px)]">
                {/* Left Panel - Destination Input */}
                <DestinationPanel
                    destinations={unscheduledDestinations}
                    onAddToSchedule={addToSchedule}
                    onDestinationClick={handleDestinationClick}
                    onDestinationHover={setHoveredDestination}
                    onOptimize={optimizeItinerary}
                    isOptimizing={isOptimizing}
                    tripDays={getTripDays()}
                    onAddNewDestination={handleAddNewDestination}
                    searchLocation={{
                        lat: tripContext.location?.lat || destinations[0]?.coordinates?.lat || 27.1767,
                        lon: tripContext.location?.lon || destinations[0]?.coordinates?.lng || 78.0081
                    }}
                    isLoading={isLoadingDestinations}
                    loadError={loadError}
                />

                {/* Center Panel - Timeline */}
                <TimelineView
                    scheduledByDay={getScheduledByDay()}
                    transportMode={tripContext.transportMode}
                    onRemoveFromSchedule={removeFromSchedule}
                    onReorder={reorderSchedule}
                    onDestinationClick={handleDestinationClick}
                    onDestinationHover={setHoveredDestination}
                    hoveredDestination={hoveredDestination}
                    onPriorityChange={handlePriorityChange}
                />

                {/* Right Panel - Map */}
                <MapView
                    destinations={destinations.filter(d => d.scheduledDay !== null)}
                    unscheduledDestinations={unscheduledDestinations}
                    nearbySuggestions={nearbySuggestions}
                    hoveredDestination={hoveredDestination}
                    onDestinationClick={handleDestinationClick}
                    transportMode={tripContext.transportMode}
                    onAddNearby={(nearby) => {
                        const newDest = {
                            ...nearby,
                            priority: 'optional',
                            scheduledDay: null,
                            scheduledTime: null,
                            duration: 60,
                            openingHours: '09:00 - 18:00',
                            description: 'A nearby point of interest.',
                            ticketPrice: 'Varies',
                            website: null,
                            hasConflict: false,
                            conflictReason: null
                        };
                        setDestinations(prev => [...prev, newDest]);
                        showNotification(`${nearby.name} added!`);
                    }}
                />
            </div>

            {/* Details Panel Overlay */}
            {showDetailsPanel && selectedDestination && (
                <DetailsPanel
                    destination={selectedDestination}
                    onClose={() => {
                        setShowDetailsPanel(false);
                        setSelectedDestination(null);
                    }}
                    onUpdateNotes={(notes) => {
                        setDestinations(prev => prev.map(d =>
                            d.id === selectedDestination.id ? { ...d, notes } : d
                        ));
                    }}
                    isScheduled={selectedDestination.scheduledDay !== null}
                    onToggleSchedule={() => {
                        if (selectedDestination.scheduledDay !== null) {
                            removeFromSchedule(selectedDestination.id);
                        } else {
                            addToSchedule(selectedDestination.id, 1);
                        }
                    }}
                />
            )}

            {/* Chat Button - Bottom Left */}
            {!isChatOpen && (
                <ItineraryChatButton onClick={() => setIsChatOpen(true)} />
            )}

            {/* Chat Popup */}
            <ItineraryChatPopup
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                tripContext={tripContext}
                destinations={destinations}
            />
        </div>
    );
}

export default ItineraryPlanner;
