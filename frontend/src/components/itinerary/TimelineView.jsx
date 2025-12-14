import React, { useState } from 'react';
import LocationCard from './LocationCard';
import TransitConnector from './TransitConnector';

function TimelineView({
    scheduledByDay,
    transportMode,
    onRemoveFromSchedule,
    onReorder,
    onDestinationClick,
    onDestinationHover,
    hoveredDestination,
    onPriorityChange
}) {
    const [dragOverDay, setDragOverDay] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);

    const handleDragOver = (e, day) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverDay(day);
    };

    const handleDragLeave = (e) => {
        // Only leave if we're actually leaving the drop zone
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverDay(null);
        }
    };

    const handleDrop = (e, day) => {
        e.preventDefault();
        setDragOverDay(null);

        try {
            const destination = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (destination && destination.id) {
                // Get current day's destinations to calculate time
                const daySchedule = scheduledByDay.find(d => d.day === day);
                const lastDest = daySchedule?.destinations[daySchedule.destinations.length - 1];

                let newTime = '09:00';
                if (lastDest && lastDest.scheduledTime) {
                    const [hours, mins] = lastDest.scheduledTime.split(':').map(Number);
                    const transitTime = getTransitTime();
                    const totalMins = hours * 60 + mins + lastDest.duration + transitTime;
                    const newHours = Math.floor(totalMins / 60);
                    const newMins = totalMins % 60;
                    newTime = `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
                }

                onReorder(destination.id, day, newTime);
            }
        } catch (err) {
            console.error('Drop error:', err);
        }
    };

    const categoryColors = {
        landmark: 'bg-orange-100 text-orange-700 border-orange-200',
        museum: 'bg-blue-100 text-blue-700 border-blue-200',
        park: 'bg-green-100 text-green-700 border-green-200',
        restaurant: 'bg-red-100 text-red-700 border-red-200',
        shopping: 'bg-purple-100 text-purple-700 border-purple-200',
        hotel: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        temple: 'bg-amber-100 text-amber-700 border-amber-200',
        beach: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };

    const categoryIcons = {
        landmark: '🏛️',
        museum: '🏛️',
        park: '🌳',
        restaurant: '🍽️',
        shopping: '🛍️',
        hotel: '🏨',
        temple: '🛕',
        beach: '🏖️'
    };

    const getTransitTime = () => {
        switch (transportMode) {
            case 'walking': return 30;
            case 'transit': return 25;
            case 'car': return 15;
            default: return 20;
        }
    };

    const getTransitDetails = (from, to) => {
        // Calculate approximate distance based on coordinates
        const distance = Math.sqrt(
            Math.pow((to.coordinates.lat - from.coordinates.lat) * 111, 2) +
            Math.pow((to.coordinates.lng - from.coordinates.lng) * 85, 2)
        );

        let duration;
        switch (transportMode) {
            case 'walking':
                duration = Math.round(distance * 12); // ~5 km/h
                break;
            case 'transit':
                duration = Math.round(distance * 4 + 10); // ~15 km/h + waiting
                break;
            case 'car':
                duration = Math.round(distance * 2 + 5); // ~30 km/h + traffic
                break;
            default:
                duration = Math.round(distance * 4);
        }

        return {
            distance: distance.toFixed(1) + ' km',
            duration: Math.max(duration, 5) // Minimum 5 minutes
        };
    };

    const getDayDate = (dayNum) => {
        const date = new Date();
        date.setDate(date.getDate() + dayNum - 1);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const calculateEndTime = (startTime, duration) => {
        if (!startTime) return null;
        const [hours, mins] = startTime.split(':').map(Number);
        const totalMins = hours * 60 + mins + duration;
        const endHours = Math.floor(totalMins / 60);
        const endMins = totalMins % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    };

    const calculateDayStats = (destinations) => {
        const totalDuration = destinations.reduce((acc, d) => acc + d.duration, 0);
        const totalTransit = (destinations.length - 1) * getTransitTime();
        return {
            places: destinations.length,
            duration: totalDuration,
            transit: Math.max(totalTransit, 0),
            total: totalDuration + Math.max(totalTransit, 0)
        };
    };

    const totalScheduled = scheduledByDay.reduce((acc, day) => acc + day.destinations.length, 0);

    return (
        <div className="flex-1 h-full flex flex-col bg-white/50 backdrop-blur-sm border-r border-gray-200/50 overflow-hidden">
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-white to-blue-50/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm">
                                📅
                            </span>
                            Daily Schedule
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {totalScheduled} {totalScheduled === 1 ? 'place' : 'places'} across {scheduledByDay.length} {scheduledByDay.length === 1 ? 'day' : 'days'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            Drag to reorder
                        </div>
                    </div>
                </div>

                {/* Transport Mode Indicator */}
                <div className="flex items-center gap-2 mt-3 p-2 bg-white rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-500">Transport:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${transportMode === 'walking' ? 'bg-green-100 text-green-700' :
                            transportMode === 'transit' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                        }`}>
                        {transportMode === 'walking' ? '🚶' : transportMode === 'transit' ? '🚇' : '🚗'}
                        {transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                        (~{getTransitTime()} min between stops)
                    </span>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                {scheduledByDay.map(({ day, destinations }, dayIndex) => {
                    const stats = calculateDayStats(destinations);
                    const isExpanded = expandedDay === null || expandedDay === day;

                    return (
                        <div
                            key={day}
                            onDragOver={(e) => handleDragOver(e, day)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, day)}
                            className={`relative rounded-2xl border-2 transition-all duration-300 ${dragOverDay === day
                                    ? 'border-orange-400 bg-orange-50/50 shadow-lg shadow-orange-200/30'
                                    : 'border-transparent'
                                }`}
                        >
                            {/* Day Header */}
                            <div
                                className="flex items-center gap-3 mb-4 cursor-pointer group"
                                onClick={() => setExpandedDay(expandedDay === day ? null : day)}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center shadow-lg shadow-blue-200/50">
                                    <span className="text-white font-bold text-xl leading-none">{day}</span>
                                    <span className="text-blue-200 text-[10px] leading-none mt-0.5">DAY</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {getDayDate(day)}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full" />
                                            {stats.places} {stats.places === 1 ? 'stop' : 'stops'}
                                        </span>
                                        {stats.places > 0 && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <span>{Math.floor(stats.total / 60)}h {stats.total % 60}m total</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {stats.places > 0 && (
                                        <div className="flex -space-x-2">
                                            {destinations.slice(0, 3).map((d, i) => (
                                                <img
                                                    key={d.id}
                                                    src={d.thumbnail}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                                    style={{ zIndex: 3 - i }}
                                                />
                                            ))}
                                            {destinations.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                                    +{destinations.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Destinations for this day */}
                            <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                {destinations.length === 0 ? (
                                    <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/30">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-semibold">No plans yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Drag destinations here or use Auto-Arrange</p>
                                    </div>
                                ) : (
                                    <div className="relative pl-8">
                                        {/* Timeline Line */}
                                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-400 via-indigo-400 to-blue-300 rounded-full" />

                                        <div className="space-y-0">
                                            {destinations.map((destination, index) => {
                                                const nextDest = destinations[index + 1];
                                                const transitDetails = nextDest ? getTransitDetails(destination, nextDest) : null;

                                                return (
                                                    <div key={destination.id}>
                                                        {/* Destination Card */}
                                                        <div
                                                            className="relative"
                                                            onMouseEnter={() => onDestinationHover(destination)}
                                                            onMouseLeave={() => onDestinationHover(null)}
                                                        >
                                                            {/* Timeline Dot */}
                                                            <div className={`absolute -left-5 top-8 w-5 h-5 rounded-full border-3 border-white shadow-md transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white ${hoveredDestination?.id === destination.id
                                                                    ? 'bg-orange-500 scale-125 shadow-orange-300'
                                                                    : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                                                                }`}>
                                                                {index + 1}
                                                            </div>

                                                            {/* Time Label */}
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
                                                                    <span className="text-sm font-bold text-blue-600">
                                                                        {destination.scheduledTime}
                                                                    </span>
                                                                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                    <span className="text-sm text-blue-500">
                                                                        {calculateEndTime(destination.scheduledTime, destination.duration)}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                                    {Math.floor(destination.duration / 60)}h {destination.duration % 60}m
                                                                </span>
                                                            </div>

                                                            <LocationCard
                                                                destination={destination}
                                                                categoryColors={categoryColors}
                                                                categoryIcons={categoryIcons}
                                                                onClick={() => onDestinationClick(destination)}
                                                                onRemove={() => onRemoveFromSchedule(destination.id)}
                                                                onPriorityChange={onPriorityChange}
                                                                showRemove
                                                                showTime={false}
                                                                isHovered={hoveredDestination?.id === destination.id}
                                                                compact
                                                            />
                                                        </div>

                                                        {/* Transit Connector */}
                                                        {transitDetails && (
                                                            <TransitConnector
                                                                duration={transitDetails.duration}
                                                                mode={transportMode}
                                                                distance={transitDetails.distance}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Day Summary */}
                                        {destinations.length > 0 && (
                                            <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Activities: {Math.floor(stats.duration / 60)}h {stats.duration % 60}m
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                        Transit: ~{stats.transit}m
                                                    </span>
                                                </div>
                                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                                    Done by {calculateEndTime(destinations[destinations.length - 1]?.scheduledTime, destinations[destinations.length - 1]?.duration)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TimelineView;
