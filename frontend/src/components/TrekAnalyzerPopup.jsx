import React, { useState } from 'react';
import { X, Mountain, MapPin, Search, Loader2, AlertCircle, CheckCircle2, Clock, DollarSign, Users, Compass, Star, Shield, Phone, Wifi, AlertTriangle, Lightbulb, Video, Youtube, ChevronDown, ChevronUp, Thermometer, Calendar, Route } from 'lucide-react';

const TREK_API_BASE = 'http://localhost:8000';

const TrekAnalyzerPopup = ({ isOpen, onClose }) => {
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [trekData, setTrekData] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Helper function to render complex nested data beautifully
    const renderComplexData = (data, depth = 0) => {
        if (data === null || data === undefined) return null;

        // Handle primitive types
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            return <span>{String(data)}</span>;
        }

        // Handle arrays
        if (Array.isArray(data)) {
            return (
                <ul className={`space-y-2 ${depth > 0 ? 'ml-4' : ''}`}>
                    {data.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
                            <div className="flex-1">
                                {typeof item === 'object' && item !== null ? (
                                    renderComplexObject(item, depth + 1)
                                ) : (
                                    <span>{String(item)}</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }

        // Handle objects
        if (typeof data === 'object') {
            return renderComplexObject(data, depth);
        }

        return <span>{String(data)}</span>;
    };

    // Render complex objects with proper formatting
    const renderComplexObject = (obj, depth = 0) => {
        if (!obj || typeof obj !== 'object') return null;

        return (
            <div className={`space-y-3 ${depth > 0 ? 'pl-3 border-l-2 border-gray-200' : ''}`}>
                {Object.entries(obj).map(([key, value]) => {
                    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                    // Special handling for known field types
                    if (key === 'problem' || key === 'issue') {
                        return (
                            <div key={key} className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <span className="font-medium text-amber-800">{String(value)}</span>
                            </div>
                        );
                    }

                    if (key === 'solutions' || key === 'workaround' || key === 'alternatives') {
                        return (
                            <div key={key}>
                                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Solutions:</span>
                                {Array.isArray(value) ? (
                                    <ul className="mt-1 space-y-1">
                                        {value.map((sol, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">{String(sol)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-700">{String(value)}</p>
                                )}
                            </div>
                        );
                    }

                    if (key === 'trigger' || key === 'cause' || key === 'when') {
                        return (
                            <div key={key} className="text-sm">
                                <span className="text-gray-500 font-medium">Cause: </span>
                                <span className="text-gray-700">{String(value)}</span>
                            </div>
                        );
                    }

                    if (key === 'frequency') {
                        return (
                            <div key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                {String(value)}
                            </div>
                        );
                    }

                    // Default rendering for other keys
                    if (Array.isArray(value)) {
                        return (
                            <div key={key}>
                                <p className="text-sm font-medium text-gray-700 mb-1">{formattedKey}:</p>
                                {renderComplexData(value, depth + 1)}
                            </div>
                        );
                    }

                    if (typeof value === 'object' && value !== null) {
                        return (
                            <div key={key}>
                                <p className="text-sm font-medium text-gray-700 mb-1">{formattedKey}:</p>
                                {renderComplexData(value, depth + 1)}
                            </div>
                        );
                    }

                    return (
                        <div key={key} className="text-sm">
                            <span className="font-medium text-gray-600">{formattedKey}: </span>
                            <span className="text-gray-800">{String(value)}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Simple renderer for basic values
    const renderValue = (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }
        return renderComplexData(value);
    };

    const handleAnalyze = async () => {
        if (!location.trim()) {
            setError('Please enter a trek location');
            return;
        }

        setIsLoading(true);
        setError(null);
        setTrekData(null);

        try {
            const response = await fetch(`${TREK_API_BASE}/analyze_trek`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location: location.trim() })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze trek. Please try again.');
            }

            const data = await response.json();
            setTrekData(data);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleAnalyze();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 py-6">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23fff'/%3E%3C/svg%3E\")", backgroundSize: '30px 30px' }} />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Mountain className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Trek Analyzer</h2>
                                <p className="text-white/80 text-sm">AI-powered trek insights from YouTube</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Search Input */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            <MapPin className="w-4 h-4 inline-block mr-2 text-emerald-600" />
                            Trek Location
                        </label>
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter trek name (e.g., Kedarkantha Trek, Valley of Flowers)"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                                    disabled={isLoading}
                                />
                                {location && !isLoading && (
                                    <button
                                        onClick={() => setLocation('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !location.trim()}
                                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Analyze
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-6">
                                <Mountain className="w-10 h-10 text-emerald-600 animate-bounce" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Trek Data</h3>
                            <p className="text-gray-500 max-w-md">
                                Searching YouTube vlogs and shorts, extracting insights with AI. This may take a moment...
                            </p>
                            <div className="mt-6 flex gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {trekData && !isLoading && (
                        <div className="space-y-6">
                            {/* Trek Header */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {trekData.trek_overview?.full_name || trekData.location}
                                </h3>
                                {trekData.under_construction && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                        <AlertTriangle className="w-4 h-4" />
                                        Active construction on route
                                    </div>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(trekData.difficulty || trekData.trek_overview?.difficulty_level) && (
                                    <StatCard
                                        icon={<Compass className="w-5 h-5" />}
                                        label="Difficulty"
                                        value={trekData.difficulty || trekData.trek_overview?.difficulty_level}
                                        color="emerald"
                                    />
                                )}
                                {trekData.trek_overview?.duration && (
                                    <StatCard
                                        icon={<Clock className="w-5 h-5" />}
                                        label="Duration"
                                        value={trekData.trek_overview.duration}
                                        color="blue"
                                    />
                                )}
                                {trekData.trek_overview?.altitude && (
                                    <StatCard
                                        icon={<Mountain className="w-5 h-5" />}
                                        label="Altitude"
                                        value={trekData.trek_overview.altitude}
                                        color="purple"
                                    />
                                )}
                                {(trekData.trek_overview?.total_distance || trekData.trek_overview?.distance) && (
                                    <StatCard
                                        icon={<Route className="w-5 h-5" />}
                                        label="Distance"
                                        value={trekData.trek_overview.total_distance || trekData.trek_overview.distance}
                                        color="orange"
                                    />
                                )}
                                {trekData.trek_overview?.best_season && (
                                    <StatCard
                                        icon={<Calendar className="w-5 h-5" />}
                                        label="Best Season"
                                        value={trekData.trek_overview.best_season}
                                        color="emerald"
                                    />
                                )}
                                {trekData.trek_overview?.elevation_gain && (
                                    <StatCard
                                        icon={<Mountain className="w-5 h-5" />}
                                        label="Elevation Gain"
                                        value={trekData.trek_overview.elevation_gain}
                                        color="purple"
                                    />
                                )}
                            </div>

                            {/* Expandable Sections */}

                            {/* Difficulty Details */}
                            {trekData.difficulty_details && (
                                <CollapsibleSection
                                    title="Difficulty Breakdown"
                                    icon={<Compass className="w-5 h-5" />}
                                    isExpanded={expandedSections.difficulty}
                                    onToggle={() => toggleSection('difficulty')}
                                >
                                    <div className="text-gray-600">
                                        {typeof trekData.difficulty_details === 'string'
                                            ? trekData.difficulty_details
                                            : renderComplexData(trekData.difficulty_details)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Route */}
                            {trekData.recommended_route && (
                                <CollapsibleSection
                                    title="Recommended Route"
                                    icon={<Route className="w-5 h-5" />}
                                    isExpanded={expandedSections.route}
                                    onToggle={() => toggleSection('route')}
                                >
                                    <div className="space-y-2">
                                        {Array.isArray(trekData.recommended_route)
                                            ? trekData.recommended_route.map((point, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                                    <span className="text-gray-700">{typeof point === 'object' ? JSON.stringify(point) : String(point)}</span>
                                                </div>
                                            ))
                                            : <p className="text-gray-600">{renderValue(trekData.recommended_route)}</p>
                                        }
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Alternative Routes */}
                            {trekData.alternative_routes && (
                                <CollapsibleSection
                                    title="Alternative Routes"
                                    icon={<Compass className="w-5 h-5" />}
                                    isExpanded={expandedSections.altRoutes}
                                    onToggle={() => toggleSection('altRoutes')}
                                >
                                    <div className="text-gray-600">
                                        {Array.isArray(trekData.alternative_routes)
                                            ? trekData.alternative_routes.map((route, i) => (
                                                <p key={i} className="mb-2">• {typeof route === 'object' ? JSON.stringify(route) : String(route)}</p>
                                            ))
                                            : renderValue(trekData.alternative_routes)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Notable Landmarks */}
                            {trekData.notable_landmarks && (
                                <CollapsibleSection
                                    title="Notable Landmarks"
                                    icon={<Star className="w-5 h-5" />}
                                    isExpanded={expandedSections.landmarks}
                                    onToggle={() => toggleSection('landmarks')}
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(trekData.notable_landmarks)
                                            ? trekData.notable_landmarks.map((landmark, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">{typeof landmark === 'object' ? JSON.stringify(landmark) : String(landmark)}</span>
                                            ))
                                            : <p className="text-gray-600">{renderValue(trekData.notable_landmarks)}</p>
                                        }
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Hidden Gems */}
                            {trekData.hidden_gems && (
                                <CollapsibleSection
                                    title="Hidden Gems"
                                    icon={<Lightbulb className="w-5 h-5" />}
                                    isExpanded={expandedSections.gems}
                                    onToggle={() => toggleSection('gems')}
                                >
                                    <div className="text-gray-600">
                                        {Array.isArray(trekData.hidden_gems)
                                            ? trekData.hidden_gems.map((gem, i) => (
                                                <p key={i} className="mb-2">💎 {typeof gem === 'object' ? JSON.stringify(gem) : String(gem)}</p>
                                            ))
                                            : renderValue(trekData.hidden_gems)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Tips */}
                            {trekData.tips && (
                                <CollapsibleSection
                                    title="Trekker Tips"
                                    icon={<CheckCircle2 className="w-5 h-5" />}
                                    isExpanded={expandedSections.tips}
                                    onToggle={() => toggleSection('tips')}
                                >
                                    <div className="space-y-2">
                                        {Array.isArray(trekData.tips)
                                            ? trekData.tips.map((tip, i) => (
                                                <div key={i} className="flex gap-3 items-start">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{typeof tip === 'object' ? JSON.stringify(tip) : String(tip)}</span>
                                                </div>
                                            ))
                                            : <p className="text-gray-600">{renderValue(trekData.tips)}</p>
                                        }
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Seasonal Information */}
                            {trekData.seasonal_information && (
                                <CollapsibleSection
                                    title="Seasonal Information"
                                    icon={<Calendar className="w-5 h-5" />}
                                    isExpanded={expandedSections.seasonal}
                                    onToggle={() => toggleSection('seasonal')}
                                >
                                    <div className="text-gray-600">
                                        {renderComplexData(trekData.seasonal_information)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Permits */}
                            {trekData.permits_and_regulations && (
                                <CollapsibleSection
                                    title="Permits & Regulations"
                                    icon={<Shield className="w-5 h-5" />}
                                    isExpanded={expandedSections.permits}
                                    onToggle={() => toggleSection('permits')}
                                >
                                    <div className="text-gray-600">
                                        {renderComplexData(trekData.permits_and_regulations)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Accommodation */}
                            {trekData.accommodation_options && (
                                <CollapsibleSection
                                    title="Accommodation Options"
                                    icon={<Users className="w-5 h-5" />}
                                    isExpanded={expandedSections.accommodation}
                                    onToggle={() => toggleSection('accommodation')}
                                >
                                    <div className="text-gray-600">
                                        {renderComplexData(trekData.accommodation_options)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Budget Breakdown */}
                            {trekData.budget_breakdown && (
                                <CollapsibleSection
                                    title="Budget Breakdown"
                                    icon={<DollarSign className="w-5 h-5" />}
                                    isExpanded={expandedSections.budget}
                                    onToggle={() => toggleSection('budget')}
                                >
                                    <div className="text-gray-600">
                                        {renderComplexData(trekData.budget_breakdown)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Practical Details */}
                            {trekData.practical_details && (
                                <CollapsibleSection
                                    title="Practical Details"
                                    icon={<Phone className="w-5 h-5" />}
                                    isExpanded={expandedSections.practical}
                                    onToggle={() => toggleSection('practical')}
                                >
                                    <div className="text-gray-600">
                                        {renderComplexData(trekData.practical_details)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Visitor Problems */}
                            {trekData.visitor_problems && (
                                <CollapsibleSection
                                    title="Known Issues & Safety"
                                    icon={<AlertTriangle className="w-5 h-5" />}
                                    isExpanded={expandedSections.problems}
                                    onToggle={() => toggleSection('problems')}
                                    variant="warning"
                                >
                                    <div className="space-y-4">
                                        {typeof trekData.visitor_problems === 'object' && !Array.isArray(trekData.visitor_problems) ? (
                                            // Handle object with nested categories
                                            Object.entries(trekData.visitor_problems).map(([category, items]) => (
                                                <div key={category} className="mb-4">
                                                    <h5 className="font-semibold text-amber-800 capitalize mb-2 flex items-center gap-2">
                                                        <AlertTriangle className="w-4 h-4" />
                                                        {category.replace(/_/g, ' ')}
                                                    </h5>
                                                    <div className="space-y-3 pl-2">
                                                        {renderComplexData(items)}
                                                    </div>
                                                </div>
                                            ))
                                        ) : Array.isArray(trekData.visitor_problems) ? (
                                            // Handle array of problems
                                            <div className="space-y-4">
                                                {trekData.visitor_problems.map((problem, i) => (
                                                    <div key={i} className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                                                        {typeof problem === 'object' ? (
                                                            renderComplexData(problem)
                                                        ) : (
                                                            <p className="text-amber-800">⚠️ {String(problem)}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-amber-800">{String(trekData.visitor_problems)}</p>
                                        )}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Unique Insights */}
                            {trekData.unique_insights && (
                                <CollapsibleSection
                                    title="Unique Insights"
                                    icon={<Lightbulb className="w-5 h-5" />}
                                    isExpanded={expandedSections.insights}
                                    onToggle={() => toggleSection('insights')}
                                >
                                    <div className="text-gray-600">
                                        {renderComplexData(trekData.unique_insights)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Video Insights Summary */}
                            {trekData.video_insights_summary && (
                                <CollapsibleSection
                                    title="Video Insights Summary"
                                    icon={<Video className="w-5 h-5" />}
                                    isExpanded={expandedSections.videoSummary}
                                    onToggle={() => toggleSection('videoSummary')}
                                >
                                    <div className="text-gray-600">
                                        {renderComplexData(trekData.video_insights_summary)}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* YouTube Videos */}
                            {(trekData.vlogs?.length > 0 || trekData.shorts?.length > 0) && (
                                <CollapsibleSection
                                    title="Source Videos"
                                    icon={<Youtube className="w-5 h-5" />}
                                    isExpanded={expandedSections.videos}
                                    onToggle={() => toggleSection('videos')}
                                >
                                    <div className="space-y-4">
                                        {trekData.vlogs?.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-gray-800 mb-2">Vlogs ({trekData.vlogs.length})</h5>
                                                <div className="space-y-2">
                                                    {trekData.vlogs.slice(0, 5).map((vlog, i) => (
                                                        <VideoItem key={i} video={vlog} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {trekData.shorts?.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-gray-800 mb-2">Shorts ({trekData.shorts.length})</h5>
                                                <div className="space-y-2">
                                                    {trekData.shorts.slice(0, 5).map((short, i) => (
                                                        <VideoItem key={i} video={short} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CollapsibleSection>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !trekData && !error && (
                        <div className="py-12 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mountain className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Explore</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Enter a trek location above to get AI-powered insights gathered from real YouTube vlogs and shorts.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {['Kedarkantha Trek', 'Valley of Flowers', 'Hampta Pass', 'Brahmatal'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setLocation(suggestion)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-full text-sm transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className={`p-4 rounded-2xl ${colorClasses[color] || colorClasses.emerald}`}>
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-xs font-medium opacity-80">{label}</span>
            </div>
            <p className="font-bold text-lg">{value}</p>
        </div>
    );
};

// Collapsible Section Component
const CollapsibleSection = ({ title, icon, children, isExpanded, onToggle, variant = 'default' }) => {
    const variants = {
        default: 'bg-white border-gray-200 hover:border-gray-300',
        warning: 'bg-amber-50 border-amber-200 hover:border-amber-300'
    };

    return (
        <div className={`border rounded-2xl overflow-hidden transition-colors ${variants[variant]}`}>
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-3">
                    <span className={`${variant === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>{icon}</span>
                    <span className="font-semibold text-gray-800">{title}</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
            </button>
            {isExpanded && (
                <div className="px-5 pb-5 pt-0">
                    {children}
                </div>
            )}
        </div>
    );
};

// Video Item Component
const VideoItem = ({ video }) => {
    const url = video.url || video.link;
    const title = video.title || 'Video';

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
        >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Youtube className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-gray-700 group-hover:text-gray-900 text-sm line-clamp-1 flex-1">{title}</span>
        </a>
    );
};

export default TrekAnalyzerPopup;
