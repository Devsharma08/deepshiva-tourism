import React, { useState, useEffect } from 'react';

function DetailsPanel({
    destination,
    onClose,
    onUpdateNotes,
    isScheduled,
    onToggleSchedule
}) {
    const [notes, setNotes] = useState(destination.notes || '');
    const [activeTab, setActiveTab] = useState('info');
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        setNotes(destination.notes || '');
    }, [destination]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
        onUpdateNotes(e.target.value);
    };

    const tabs = [
        {
            id: 'info', label: 'Info', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'tips', label: 'Tips', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            )
        },
        {
            id: 'notes', label: 'Notes', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )
        },
        {
            id: 'gallery', label: 'Gallery', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    const formatDuration = (minutes) => {
        if (!minutes) return 'Unknown';
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
    };

    const getCategoryDetails = () => {
        const categories = {
            landmark: { icon: '🏛️', label: 'Landmark', color: 'bg-orange-500' },
            museum: { icon: '🏛️', label: 'Museum', color: 'bg-blue-500' },
            park: { icon: '🌳', label: 'Park & Garden', color: 'bg-green-500' },
            restaurant: { icon: '🍽️', label: 'Restaurant', color: 'bg-red-500' },
            shopping: { icon: '🛍️', label: 'Shopping', color: 'bg-purple-500' },
            hotel: { icon: '🏨', label: 'Hotel', color: 'bg-indigo-500' },
            temple: { icon: '🛕', label: 'Temple', color: 'bg-amber-500' },
            beach: { icon: '🏖️', label: 'Beach', color: 'bg-cyan-500' }
        };
        return categories[destination.category] || { icon: '📍', label: 'Place', color: 'bg-gray-500' };
    };

    const categoryDetails = getCategoryDetails();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleClose}
            />

            {/* Panel */}
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transition-all duration-200 ${isClosing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
                {/* Hero Image */}
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <img
                        src={destination.thumbnail}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2.5 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors group"
                    >
                        <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Schedule Badge */}
                    {isScheduled && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Day {destination.scheduledDay} • {destination.scheduledTime}
                        </div>
                    )}

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white ${categoryDetails.color}`}>
                                <span>{categoryDetails.icon}</span>
                                {categoryDetails.label}
                            </span>
                            {destination.priority === 'must-visit' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white rounded-full text-xs font-medium">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Must Visit
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">{destination.name}</h2>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? 'text-orange-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {activeTab === 'info' && (
                        <div className="space-y-5">
                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h3>
                                <p className="text-gray-700 leading-relaxed">{destination.description}</p>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-xs font-medium">Duration</span>
                                    </div>
                                    <p className="font-bold text-gray-900">{formatDuration(destination.duration)}</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                        <span className="text-xs font-medium">Entry Fee</span>
                                    </div>
                                    <p className="font-bold text-gray-900">{destination.ticketPrice || 'Free'}</p>
                                </div>
                            </div>

                            {/* Opening Hours */}
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-semibold text-orange-900">Opening Hours</span>
                                </div>
                                <p className="text-orange-800 font-medium">{destination.openingHours}</p>
                            </div>

                            {/* Website */}
                            {destination.website && (
                                <a
                                    href={destination.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span className="group-hover:underline">Visit Official Website</span>
                                </a>
                            )}

                            {/* Coordinates */}
                            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{destination.coordinates.lat.toFixed(4)}, {destination.coordinates.lng.toFixed(4)}</span>
                                <button className="ml-auto text-blue-500 hover:text-blue-600 font-medium">
                                    Open in Maps →
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tips' && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Travel Tips</h3>

                            {destination.tips && destination.tips.length > 0 ? (
                                <div className="space-y-3">
                                    {destination.tips.map((tip, index) => (
                                        <div key={index} className="flex gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed pt-1.5">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-3xl">💡</span>
                                    </div>
                                    <p className="text-gray-500 font-medium">No tips available yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Check online reviews for more information</p>
                                </div>
                            )}

                            {/* General tips */}
                            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                    <span>⚡</span> Quick Reminders
                                </h4>
                                <ul className="space-y-2 text-sm text-amber-700">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Carry valid ID for ticketing</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Photography rules may vary</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Arrive early to avoid crowds</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Personal Notes</h3>
                            <p className="text-sm text-gray-500">Add reservations, reminders, or any personal details about this stop.</p>
                            <textarea
                                value={notes}
                                onChange={handleNotesChange}
                                placeholder="e.g., Reservation at 7 PM, bring sunscreen, ask for guided tour, meet friends at entrance..."
                                className="w-full h-48 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                            />
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Your notes are saved automatically</span>
                                <span>{notes.length} characters</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gallery</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
                                    <img
                                        src={destination.thumbnail}
                                        alt={destination.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                {/* Placeholder images with loading effect */}
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden group cursor-pointer">
                                        <div className="text-center">
                                            <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xs text-gray-400">More photos</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 text-center mt-4">
                                📷 More photos would be loaded from a travel API
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="flex gap-3">
                        <button
                            onClick={onToggleSchedule}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${isScheduled
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                                }`}
                        >
                            {isScheduled ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Remove from Schedule
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add to Schedule
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleClose}
                            className="py-3 px-6 rounded-xl font-semibold text-sm bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsPanel;
