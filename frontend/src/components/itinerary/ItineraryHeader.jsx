import React, { useState } from 'react';

function ItineraryHeader({
    tripContext,
    updateTripContext,
    onBack,
    onSave,
    onShare,
    onExport
}) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(tripContext.title);

    const handleTitleSave = () => {
        updateTripContext({ title: titleValue });
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            setTitleValue(tripContext.title);
            setIsEditingTitle(false);
        }
    };

    const paceOptions = [
        { value: 'relaxed', label: 'Relaxed', emoji: '🐢' },
        { value: 'balanced', label: 'Balanced', emoji: '🚶' },
        { value: 'packed', label: 'Packed', emoji: '🏃' }
    ];

    const transportOptions = [
        { value: 'walking', label: 'Walking', emoji: '🚶', activeClass: 'bg-green-100 text-green-700 border-green-300' },
        { value: 'transit', label: 'Transit', emoji: '🚇', activeClass: 'bg-blue-100 text-blue-700 border-blue-300' },
        { value: 'car', label: 'Car', emoji: '🚗', activeClass: 'bg-purple-100 text-purple-700 border-purple-300' }
    ];

    const calculateDays = () => {
        const start = new Date(tripContext.dateRange.start);
        const end = new Date(tripContext.dateRange.end);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(1, days);
    };

    return (
        <header className="relative z-20 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
            <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
                        title="Back to Home"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Trip Title */}
                    <div className="min-w-0 flex-shrink">
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={titleValue}
                                onChange={(e) => setTitleValue(e.target.value)}
                                onBlur={handleTitleSave}
                                onKeyDown={handleTitleKeyDown}
                                autoFocus
                                className="text-lg font-bold text-gray-900 bg-transparent border-b-2 border-orange-400 focus:outline-none w-full max-w-[200px]"
                            />
                        ) : (
                            <h1
                                onClick={() => setIsEditingTitle(true)}
                                className="text-lg font-bold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors truncate max-w-[180px]"
                                title="Click to edit"
                            >
                                {tripContext.title}
                            </h1>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <span>{calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}</span>
                            <span>•</span>
                            <span>{tripContext.partySize} {tripContext.partySize === 1 ? 'person' : 'people'}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-gray-200 hidden md:block" />

                    {/* Pace Selector */}
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Pace:</span>
                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                            {paceOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateTripContext({ pace: option.value })}
                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${tripContext.pace === option.value
                                            ? 'bg-white text-orange-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    title={option.label}
                                >
                                    <span>{option.emoji}</span>
                                    <span className="hidden lg:inline">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transport Mode */}
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Transport:</span>
                        <div className="flex gap-1">
                            {transportOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateTripContext({ transportMode: option.value })}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 border ${tripContext.transportMode === option.value
                                            ? option.activeClass
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                    title={option.label}
                                >
                                    <span>{option.emoji}</span>
                                    <span className="hidden lg:inline">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Party Size */}
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Party:</span>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1 py-0.5">
                            <button
                                onClick={() => updateTripContext({ partySize: Math.max(1, tripContext.partySize - 1) })}
                                className="w-6 h-6 rounded-md hover:bg-white flex items-center justify-center text-gray-500 hover:text-orange-600 transition-colors"
                            >
                                −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-gray-700">
                                {tripContext.partySize}
                            </span>
                            <button
                                onClick={() => updateTripContext({ partySize: Math.min(20, tripContext.partySize + 1) })}
                                className="w-6 h-6 rounded-md hover:bg-white flex items-center justify-center text-gray-500 hover:text-orange-600 transition-colors"
                            >
                                +
                            </button>
                            <span className="text-sm">👥</span>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={onSave}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Save"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                        </button>
                        <button
                            onClick={onShare}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Share"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                        <button
                            onClick={onExport}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
                        >
                            Export
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default ItineraryHeader;
