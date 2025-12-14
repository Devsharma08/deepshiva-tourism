import React from 'react';

function TransitConnector({ duration, mode, distance }) {
    const getModeDetails = () => {
        switch (mode) {
            case 'walking':
                return {
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l2 2m0 0l2 2m-2-2v6m-4-4l-2 2m0 0l-2 2m2-2v6m4-8a4 4 0 100-8 4 4 0 000 8z" />
                        </svg>
                    ),
                    label: 'Walk',
                    color: 'bg-green-100 text-green-700 border-green-200',
                    emoji: '🚶'
                };
            case 'transit':
                return {
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    ),
                    label: 'Transit',
                    color: 'bg-blue-100 text-blue-700 border-blue-200',
                    emoji: '🚇'
                };
            case 'car':
                return {
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8l2 4H6l2-4zM6 11v4a1 1 0 001 1h1m8-5v4a1 1 0 01-1 1h-1m-6 0v1a2 2 0 002 2h4a2 2 0 002-2v-1m-6 0a2 2 0 114 0" />
                        </svg>
                    ),
                    label: 'Drive',
                    color: 'bg-purple-100 text-purple-700 border-purple-200',
                    emoji: '🚗'
                };
            default:
                return {
                    icon: <span>🚶</span>,
                    label: 'Travel',
                    color: 'bg-gray-100 text-gray-700 border-gray-200',
                    emoji: '🚶'
                };
        }
    };

    const modeDetails = getModeDetails();

    const formatDuration = (mins) => {
        if (mins < 60) return `${mins} min`;
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    };

    return (
        <div className="flex items-center gap-3 py-4 pl-0 relative">
            {/* Animated connecting line */}
            <div className="absolute left-[-17px] top-0 bottom-0 flex flex-col items-center">
                <div className="flex-1 w-px bg-gradient-to-b from-blue-300 to-transparent" />
                <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-300 shadow-sm z-10 flex items-center justify-center">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                </div>
                <div className="flex-1 w-px bg-gradient-to-b from-transparent to-blue-300" />
            </div>

            {/* Transit Info Card */}
            <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-sm transition-all hover:shadow-md bg-white`}>
                {/* Mode Icon Badge */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${modeDetails.color} border`}>
                    {modeDetails.emoji}
                </div>

                {/* Duration & Distance */}
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                        {formatDuration(duration)} {modeDetails.label.toLowerCase()}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {distance}
                    </span>
                </div>

                {/* Animated dots */}
                <div className="flex items-center gap-1 ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>

            {/* Route info tooltip on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 ml-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Route optimized
            </div>
        </div>
    );
}

export default TransitConnector;
