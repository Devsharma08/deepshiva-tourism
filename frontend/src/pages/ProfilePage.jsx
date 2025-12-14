import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { getActivityHistory, clearActivityHistory } from '../hooks/useActivityTracker';
import { getLevelFromXP, getNextLevelXP } from '../hooks/useXPManager';
import { User, Mail, Calendar, MapPin, Heart, Trophy, Compass, Sparkles, ArrowLeft, Settings, LogOut, X, Clock, Trash2, Edit3, Check, Flame } from 'lucide-react';

function ProfilePage() {
    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    const [preferences, setPreferences] = useState(null);
    const [gamification, setGamification] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [activityHistory, setActivityHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Settings modal state
    const [showSettings, setShowSettings] = useState(false);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfileData();
            setActivityHistory(getActivityHistory());
        }
    }, [user]);

    const fetchProfileData = async () => {
        try {
            const { data: prefs } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single();
            setPreferences(prefs);

            const { data: game } = await supabase
                .from('user_gamification')
                .select('*')
                .eq('user_id', user.id)
                .single();
            setGamification(game);

            const { data: trips } = await supabase
                .from('itineraries')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);
            setItineraries(trips || []);

        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const handleClearActivity = () => {
        clearActivityHistory();
        setActivityHistory([]);
    };

    const handleUpdateDisplayName = async () => {
        if (!editName.trim()) return;
        setSaving(true);
        try {
            await supabase
                .from('users')
                .update({ display_name: editName.trim() })
                .eq('id', user.id);
            window.location.reload(); // Refresh to update context
        } catch (error) {
            console.error('Error updating name:', error);
        } finally {
            setSaving(false);
        }
    };

    const openSettings = () => {
        setEditName(userProfile?.display_name || '');
        setShowSettings(true);
    };

    // Avatar and display info
    const avatarUrl = userProfile?.avatar_url ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.display_name || user?.email}`;
    const displayName = userProfile?.display_name || user?.email?.split('@')[0] || 'Traveler';
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long'
    }) : 'Unknown';

    const tagColors = [
        'bg-orange-100 text-orange-700 border-orange-200',
        'bg-amber-100 text-amber-700 border-amber-200',
        'bg-rose-100 text-rose-700 border-rose-200',
        'bg-emerald-100 text-emerald-700 border-emerald-200',
        'bg-blue-100 text-blue-700 border-blue-200',
        'bg-purple-100 text-purple-700 border-purple-200',
    ];

    // Format time ago
    const timeAgo = (timestamp) => {
        const mins = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
                    <button onClick={openSettings} className="p-2 hover:bg-orange-100 rounded-xl transition-colors">
                        <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

                {/* Hero Section */}
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-orange-500/10 border border-orange-100">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <img src={avatarUrl} alt={displayName} className="w-28 h-28 rounded-full border-4 border-orange-200 shadow-lg object-cover" />
                            {gamification && (
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    Lvl {gamification.current_level || 1}
                                </div>
                            )}
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{displayName}</h2>
                            <p className="text-orange-600 font-medium mb-2">{gamification?.player_title || 'Novice Wanderer'}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{user?.email}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Member since {memberSince}</span>
                            </div>
                        </div>

                        <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut className="w-4 h-4" />Sign Out
                        </button>
                    </div>

                    {gamification && (() => {
                        const currentXP = gamification.current_xp || 0;
                        const currentLevel = getLevelFromXP(currentXP);
                        const nextLevelXP = getNextLevelXP(currentXP);
                        const prevLevelXP = currentLevel.xp;
                        const progress = nextLevelXP > prevLevelXP
                            ? ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100
                            : 100;

                        return (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Level {currentLevel.level}</span>
                                        {gamification.login_streak > 1 && (
                                            <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                                <Flame className="w-3 h-3" />
                                                {gamification.login_streak} day streak
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-orange-600">{currentXP} / {nextLevelXP} XP</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-4">
                    <button onClick={() => navigate('/map')} className="bg-white rounded-2xl p-5 shadow-lg shadow-orange-500/5 border border-orange-100 text-center hover:shadow-xl hover:border-orange-300 transition-all group">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="font-semibold text-gray-800">Explore Map</div>
                        <div className="text-xs text-gray-500 mt-1">Discover India</div>
                    </button>
                    <button onClick={() => navigate('/chat')} className="bg-white rounded-2xl p-5 shadow-lg shadow-orange-500/5 border border-orange-100 text-center hover:shadow-xl hover:border-orange-300 transition-all group">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="font-semibold text-gray-800">AI Assistant</div>
                        <div className="text-xs text-gray-500 mt-1">Plan with AI</div>
                    </button>
                    <button onClick={() => navigate('/booking')} className="bg-white rounded-2xl p-5 shadow-lg shadow-orange-500/5 border border-orange-100 text-center hover:shadow-xl hover:border-orange-300 transition-all group">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Compass className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="font-semibold text-gray-800">Book Travel</div>
                        <div className="text-xs text-gray-500 mt-1">Flights & Hotels</div>
                    </button>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            Recent Activity
                        </h3>
                        {activityHistory.length > 0 && (
                            <button onClick={handleClearActivity} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1">
                                <Trash2 className="w-4 h-4" /> Clear
                            </button>
                        )}
                    </div>
                    {(() => {
                        // Filter out Profile and group consecutive same activities
                        const filtered = activityHistory.filter(item =>
                            item.name !== 'Profile' && item.path !== '/profile'
                        );

                        const grouped = [];
                        for (const item of filtered) {
                            const last = grouped[grouped.length - 1];
                            if (last && last.name === item.name) {
                                last.count = (last.count || 1) + 1;
                            } else {
                                grouped.push({ ...item, count: 1 });
                            }
                        }

                        return grouped.length > 0 ? (
                            <div className="space-y-2">
                                {grouped.slice(0, 8).map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => item.path && navigate(item.path)}
                                        disabled={!item.path}
                                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors text-left group disabled:cursor-default disabled:hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="font-medium text-gray-700 group-hover:text-orange-600 capitalize">
                                                {item.name}
                                                {item.count > 1 && (
                                                    <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                                        ×{item.count}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">{timeAgo(item.timestamp)}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-6 text-gray-400">No recent activity</p>
                        );
                    })()}
                </div>

                {/* Interests */}
                {preferences?.interest_tags && preferences.interest_tags.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-rose-500" />My Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {preferences.interest_tags.map((tag, index) => (
                                <span key={tag} className={`px-4 py-2 rounded-full text-sm font-medium border ${tagColors[index % tagColors.length]}`}>{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Badges */}
                {gamification?.badges_earned && gamification.badges_earned.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />Badges Earned
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                            {gamification.badges_earned.map((badge, index) => (
                                <div key={index} className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                                    <div className="text-3xl mb-2">🏆</div>
                                    <div className="text-xs text-gray-600 font-medium">{badge}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Travel Preferences */}
                {preferences && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />Travel Preferences
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <div className="text-gray-500 mb-1">Budget</div>
                                <div className="font-semibold text-gray-800 capitalize">{preferences.budget_tier || 'Not set'}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <div className="text-gray-500 mb-1">Walking Pace</div>
                                <div className="font-semibold text-gray-800 capitalize">{preferences.walking_pace || 'Moderate'}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <div className="text-gray-500 mb-1">Crowd</div>
                                <div className="font-semibold text-gray-800 capitalize">{preferences.crowd_tolerance || 'Neutral'}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <div className="text-gray-500 mb-1">Transport</div>
                                <div className="font-semibold text-gray-800 capitalize">{preferences.preferred_transport || 'Mixed'}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Visiting History */}
                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />Trip History
                    </h3>
                    {itineraries.length > 0 ? (
                        <div className="space-y-3">
                            {itineraries.map((trip, index) => (
                                <div key={trip.itinerary_id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                                    <div>
                                        <div className="font-semibold text-gray-800">{trip.title || 'Untitled Trip'}</div>
                                        <div className="text-sm text-gray-500">{trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'No date'}</div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${trip.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : trip.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {trip.status || 'draft'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Compass className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No trips yet. Start exploring!</p>
                            <button onClick={() => navigate('/map')} className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                                Explore Map
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Edit Display Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Display Name</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Enter your name"
                                />
                                <button
                                    onClick={handleUpdateDisplayName}
                                    disabled={saving || !editName.trim()}
                                    className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? '...' : <Check className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Clear Activity */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Browsing Activity</label>
                            <button
                                onClick={() => { handleClearActivity(); setShowSettings(false); }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All Activity
                            </button>
                        </div>

                        {/* Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
