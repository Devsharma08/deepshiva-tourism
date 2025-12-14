import React, { useState } from 'react';

function LocationCard({
    destination,
    categoryColors,
    categoryIcons = {},
    onClick,
    onQuickAdd,
    onRemove,
    tripDays,
    showQuickAdd = false,
    showRemove = false,
    showTime = false,
    isHovered = false,
    compact = false,
    onPriorityChange
}) {
    const [showDayPicker, setShowDayPicker] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const categoryColor = categoryColors[destination.category] || 'bg-gray-100 text-gray-700 border-gray-200';
    const categoryIcon = categoryIcons[destination.category] || '📍';

    const togglePriority = (e) => {
        e.stopPropagation();
        const newPriority = destination.priority === 'must-visit' ? 'optional' : 'must-visit';
        if (onPriorityChange) {
            onPriorityChange(destination.id, newPriority);
        }
    };

    const formatDuration = (minutes) => {
        if (!minutes) return 'Unknown';
        if (minutes < 60) return `${minutes}min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const parseOpeningHours = (hours) => {
        if (!hours) return { isOpen: null, status: 'Unknown' };
        if (hours === '24 Hours') return { isOpen: true, status: 'Open 24h' };

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        // Simple parsing for "HH:MM - HH:MM" format
        const match = hours.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
        if (match) {
            const openTime = parseInt(match[1]) * 60 + parseInt(match[2]);
            const closeTime = parseInt(match[3]) * 60 + parseInt(match[4]);

            if (currentTime >= openTime && currentTime < closeTime) {
                const minsUntilClose = closeTime - currentTime;
                if (minsUntilClose < 60) {
                    return { isOpen: true, status: `Closes in ${minsUntilClose}m`, warning: true };
                }
                return { isOpen: true, status: 'Open now' };
            } else if (currentTime < openTime) {
                const minsUntilOpen = openTime - currentTime;
                if (minsUntilOpen < 60) {
                    return { isOpen: false, status: `Opens in ${minsUntilOpen}m` };
                }
                return { isOpen: false, status: `Opens ${match[1]}:${match[2]}` };
            } else {
                return { isOpen: false, status: 'Closed' };
            }
        }

        return { isOpen: null, status: hours };
    };

    const openStatus = parseOpeningHours(destination.openingHours);

    return (
        <div
            onClick={onClick}
            className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${isHovered
                ? 'border-orange-400 shadow-xl shadow-orange-200/30 scale-[1.02] -translate-y-1'
                : destination.hasConflict
                    ? 'border-red-300 shadow-md shadow-red-100'
                    : 'border-gray-100 hover:border-orange-200 hover:shadow-lg'
                } ${compact ? 'p-3' : 'p-4'}`}
        >
            {/* Priority Ribbon */}
            {destination.priority === 'must-visit' && (
                <div className="absolute -top-1 -right-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold py-1 px-8 transform rotate-45 shadow-md">
                    MUST VISIT
                </div>
            )}

            <div className="flex gap-3">
                {/* Thumbnail with overlay */}
                <div className={`relative flex-shrink-0 overflow-hidden rounded-xl ${compact ? 'w-16 h-16' : 'w-24 h-24'}`}>
                    <img
                        src={destination.thumbnail}
                        alt={destination.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
                        }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Duration badge */}
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                        {formatDuration(destination.duration)}
                    </div>

                    {/* Priority Toggle Button */}
                    <button
                        onClick={togglePriority}
                        className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${destination.priority === 'must-visit'
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-400/50'
                            : 'bg-white/80 text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                            }`}
                        title={destination.priority === 'must-visit' ? 'Must Visit ⭐' : 'Optional (Click to make must-visit)'}
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
                                {destination.name}
                            </h3>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                                {showRemove && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove();
                                        }}
                                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all"
                                        title="Remove from schedule"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category & Status */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${categoryColor}`}>
                                <span>{categoryIcon}</span>
                                {destination.category}
                            </span>

                            {/* Opening Status */}
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${openStatus.isOpen === true
                                ? openStatus.warning
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
                                : openStatus.isOpen === false
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${openStatus.isOpen === true ? 'bg-green-500' : openStatus.isOpen === false ? 'bg-red-500' : 'bg-gray-400'
                                    }`} />
                                {openStatus.status}
                            </span>
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-2">
                        {/* Scheduled Time */}
                        {showTime && destination.scheduledTime && (
                            <div className="flex items-center gap-1.5 text-sm">
                                <div className="flex items-center gap-1 text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-lg">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {destination.scheduledTime}
                                </div>
                            </div>
                        )}

                        {/* Quick Add Button */}
                        {showQuickAdd && (
                            <div className="relative ml-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDayPicker(!showDayPicker);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Schedule
                                </button>

                                {/* Day Picker Dropdown */}
                                {showDayPicker && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDayPicker(false);
                                            }}
                                        />
                                        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-[140px] animate-in slide-in-from-bottom-2">
                                            <div className="px-3 py-1.5 text-xs font-medium text-gray-400 border-b border-gray-100">
                                                Select Day
                                            </div>
                                            {tripDays.map(day => (
                                                <button
                                                    key={day}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onQuickAdd(day);
                                                        setShowDayPicker(false);
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2"
                                                >
                                                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xs font-bold">
                                                        {day}
                                                    </span>
                                                    Day {day}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Conflict Warning Banner */}
            {destination.hasConflict && (
                <div className="mt-3 -mx-4 -mb-4 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border-t border-red-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-xs text-red-700 font-medium">
                        {destination.conflictReason || 'Schedule conflict detected'}
                    </span>
                </div>
            )}

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: 'radial-gradient(circle at 50% 100%, rgba(251, 146, 60, 0.1), transparent 70%)'
                }}
            />
        </div>
    );
}

export default LocationCard;
