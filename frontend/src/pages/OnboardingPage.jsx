import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserPreferences } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import {
    Wallet, Utensils, Heart, Footprints, Users, Sun, Moon,
    Car, Train, Plane, Bike, ArrowRight, ArrowLeft, Check,
    Sparkles, MapPin, Mountain, Camera, Music, BookOpen,
    Accessibility, Eye, Ear, HelpCircle
} from 'lucide-react';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { user, completeOnboarding } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    const [preferences, setPreferences] = useState({
        budgetTier: '',
        dietaryRestrictions: [],
        interestTags: [],
        interestWeights: {},
        walkingPace: '',
        accessibilityNeeds: [],
        crowdTolerance: '',
        morningPerson: null,
        preferredTransport: ''
    });

    // Mouse tracking for orb effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const steps = [
        {
            title: "What's your travel budget?",
            subtitle: "This helps us recommend perfect destinations",
            field: 'budgetTier',
            type: 'single',
            options: [
                { value: 'budget', label: 'Budget Friendly', icon: '💰', desc: 'Hostels, local transport, street food' },
                { value: 'mid', label: 'Comfortable', icon: '🏨', desc: 'Good hotels, taxis, nice restaurants' },
                { value: 'luxury', label: 'Luxury', icon: '✨', desc: 'Premium stays, private tours, fine dining' },
                { value: 'no_limit', label: 'No Limit', icon: '👑', desc: 'The best of everything' }
            ]
        },
        {
            title: "Any dietary preferences?",
            subtitle: "We'll find the best food spots for you",
            field: 'dietaryRestrictions',
            type: 'multi',
            options: [
                { value: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
                { value: 'vegan', label: 'Vegan', icon: '🌱' },
                { value: 'halal', label: 'Halal', icon: '🍖' },
                { value: 'jain', label: 'Jain', icon: '🙏' },
                { value: 'gluten_free', label: 'Gluten Free', icon: '🌾' },
                { value: 'none', label: 'No Restrictions', icon: '🍽️' }
            ]
        },
        {
            title: "What interests you most?",
            subtitle: "Select all that excite you",
            field: 'interestTags',
            type: 'multi',
            options: [
                { value: 'heritage', label: 'Heritage & History', icon: BookOpen },
                { value: 'nature', label: 'Nature & Wildlife', icon: Mountain },
                { value: 'adventure', label: 'Adventure Sports', icon: Bike },
                { value: 'spiritual', label: 'Spiritual & Wellness', icon: Sparkles },
                { value: 'photography', label: 'Photography', icon: Camera },
                { value: 'food', label: 'Food & Cuisine', icon: Utensils },
                { value: 'nightlife', label: 'Nightlife & Music', icon: Music },
                { value: 'local', label: 'Local Experiences', icon: Users }
            ]
        },
        {
            title: "How do you like to explore?",
            subtitle: "Your walking pace preference",
            field: 'walkingPace',
            type: 'single',
            options: [
                { value: 'slow', label: 'Leisurely', icon: '🐢', desc: 'Take it slow, enjoy every moment' },
                { value: 'moderate', label: 'Moderate', icon: '🚶', desc: 'Balanced pace with breaks' },
                { value: 'fast', label: 'Energetic', icon: '🏃', desc: 'Cover more ground quickly' }
            ]
        },
        {
            title: "How do you feel about crowds?",
            subtitle: "We'll plan your visits accordingly",
            field: 'crowdTolerance',
            type: 'single',
            options: [
                { value: 'avoid', label: 'Avoid Crowds', icon: '😌', desc: 'Prefer peaceful, quiet spots' },
                { value: 'neutral', label: 'Don\'t Mind', icon: '🙂', desc: 'Okay with some crowds' },
                { value: 'enjoy', label: 'Love the Energy', icon: '🎉', desc: 'Bring on the buzz!' }
            ]
        },
        {
            title: "Early bird or night owl?",
            subtitle: "When do you like to start your day?",
            field: 'morningPerson',
            type: 'single',
            options: [
                { value: true, label: 'Morning Person', icon: Sun, desc: 'Sunrise adventures, early starts' },
                { value: false, label: 'Night Owl', icon: Moon, desc: 'Late rises, evening explorations' }
            ]
        },
        {
            title: "Preferred way to travel?",
            subtitle: "Your comfort in getting around",
            field: 'preferredTransport',
            type: 'single',
            options: [
                { value: 'public', label: 'Public Transport', icon: Train, desc: 'Buses, metros, local trains' },
                { value: 'private', label: 'Private Vehicle', icon: Car, desc: 'Cabs, rentals, comfort first' },
                { value: 'mixed', label: 'Mix of Both', icon: Bike, desc: 'Flexible based on situation' },
                { value: 'flights', label: 'Prefer Flying', icon: Plane, desc: 'Domestic flights when possible' }
            ]
        },
        {
            title: "Any accessibility needs?",
            subtitle: "We'll ensure comfortable experiences for you",
            field: 'accessibilityNeeds',
            type: 'multi',
            options: [
                { value: 'wheelchair', label: 'Wheelchair Access', icon: Accessibility, desc: 'Ramps, elevators, accessible paths' },
                { value: 'visual', label: 'Visual Assistance', icon: Eye, desc: 'Audio guides, braille signage' },
                { value: 'hearing', label: 'Hearing Assistance', icon: Ear, desc: 'Visual alerts, sign language' },
                { value: 'mobility', label: 'Limited Mobility', icon: '🦯', desc: 'Shorter walks, rest areas' },
                { value: 'senior', label: 'Senior Friendly', icon: '👴', desc: 'Slower pace, comfortable seating' },
                { value: 'none', label: 'No Special Needs', icon: '✅', desc: 'Standard accessibility is fine' }
            ]
        }
    ];

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleSelect = (value) => {
        const field = currentStepData.field;

        if (currentStepData.type === 'multi') {
            const current = preferences[field] || [];
            let newSelection;

            if (value === 'none') {
                newSelection = ['none'];
            } else {
                const filtered = current.filter(v => v !== 'none');
                if (filtered.includes(value)) {
                    newSelection = filtered.filter(v => v !== value);
                } else {
                    newSelection = [...filtered, value];
                }
            }

            setPreferences({ ...preferences, [field]: newSelection });

            // Auto-advance for multi-select (only if not on last step)
            if (newSelection.length > 0 && currentStep < steps.length - 1) {
                setTimeout(() => {
                    handleNext();
                }, 800);
            }
        } else {
            // Single select - update and auto-advance
            setPreferences({ ...preferences, [field]: value });

            // Auto-advance (only if not on last step)
            if (currentStep < steps.length - 1) {
                setTimeout(() => {
                    handleNext();
                }, 600);
            }
        }
    };

    const isSelected = (value) => {
        const field = currentStepData.field;
        if (currentStepData.type === 'multi') {
            return (preferences[field] || []).includes(value);
        }
        return preferences[field] === value;
    };

    const canProceed = () => {
        const field = currentStepData.field;
        if (currentStepData.type === 'multi') {
            return (preferences[field] || []).length > 0;
        }
        return preferences[field] !== '' && preferences[field] !== undefined;
    };

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Save preferences and complete onboarding
            setLoading(true);
            try {
                // Calculate interest weights based on selection order
                const interestWeights = {};
                const interests = preferences.interestTags || [];
                const totalInterests = interests.length;
                interests.forEach((interest, index) => {
                    interestWeights[interest] = 1.0 - (index * 0.5 / Math.max(totalInterests - 1, 1));
                });

                const finalPreferences = {
                    ...preferences,
                    interestWeights
                };

                console.log('💾 Saving preferences...');

                // Add timeout to prevent hanging
                const saveWithTimeout = Promise.race([
                    saveUserPreferences(user.id, finalPreferences),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Save timeout')), 5000)
                    )
                ]);

                await saveWithTimeout;
                console.log('✅ Preferences saved successfully');
                completeOnboarding();
                navigate('/');
            } catch (error) {
                console.error('⚠️ Error saving preferences:', error);
                console.warn('⚠️ Likely RLS issue - continuing anyway');
                // Still complete onboarding even if save fails
                completeOnboarding();
                navigate('/');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col relative overflow-hidden">

            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
                    style={{ top: '20%', left: '10%', animationDuration: '10s' }}
                />
                <div
                    className="absolute w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
                    style={{ bottom: '20%', right: '10%', animationDelay: '3s', animationDuration: '12s' }}
                />
                <div
                    className="absolute w-64 h-64 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 transition-all duration-1000 ease-out"
                    style={{
                        top: `${mousePosition.y}%`,
                        left: `${mousePosition.x}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            </div>

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-lg">
                <div className="max-w-3xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-lg">🇮🇳</span>
                            </div>
                            <span className="text-sm font-bold text-gray-600 tracking-wide">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-sm text-gray-400 hover:text-orange-600 transition-colors font-medium"
                        >
                            Skip for now →
                        </button>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-40 relative z-10">
                <div className="w-full max-w-3xl">

                    {/* Question */}
                    <div className="text-center mb-12 animate-in fade-in duration-500">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-orange-200/50">
                            <MapPin className="w-4 h-4" />
                            Personalizing Your Journey
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                            {currentStepData.title}
                        </h1>
                        <p className="text-xl text-gray-600 font-medium">
                            {currentStepData.subtitle}
                        </p>
                    </div>

                    {/* Options Grid */}
                    <div className={`grid gap-5 ${currentStepData.options.length <= 3
                        ? 'grid-cols-1 max-w-lg mx-auto'
                        : currentStepData.options.length === 4
                            ? 'grid-cols-2 max-w-2xl mx-auto'
                            : 'grid-cols-2 md:grid-cols-4'
                        }`}>
                        {currentStepData.options.map((option, index) => {
                            const selected = isSelected(option.value);

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`group relative p-7 rounded-3xl border-2 transition-all duration-300 text-left transform hover:scale-105 animate-in fade-in ${selected
                                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-2xl shadow-orange-500/30 scale-105'
                                        : 'border-white/60 bg-white/70 backdrop-blur-xl hover:border-orange-300 hover:shadow-xl shadow-lg'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Selection indicator */}
                                    {selected && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                            <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`text-4xl mb-4 ${selected ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                        {typeof option.icon === 'string' ? (
                                            <span className="drop-shadow-lg">{option.icon}</span>
                                        ) : (
                                            <option.icon className={`w-10 h-10 ${selected ? 'text-orange-600' : 'text-gray-600'} transition-colors`} />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div className={`font-bold text-base mb-2 ${selected ? 'text-orange-900' : 'text-gray-800'}`}>
                                        {option.label}
                                    </div>

                                    {/* Description */}
                                    {option.desc && (
                                        <div className={`text-sm leading-relaxed ${selected ? 'text-orange-700' : 'text-gray-500'}`}>
                                            {option.desc}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Hint text for multi-select, Complete button only on last step */}
                    {currentStepData.type === 'multi' && (
                        <p className="text-center text-gray-500 text-sm font-medium mt-6">
                            ✨ Select all that apply
                        </p>
                    )}

                    {/* Complete button only on last step */}
                    {currentStep === steps.length - 1 && canProceed() && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 transition-all transform hover:scale-105"
                            >
                                {loading ? 'Saving...' : 'Start Exploring ✨'}
                            </button>
                        </div>
                    )}
                </div>
            </div>



            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700&display=swap');
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-20px) translateX(10px); }
                    66% { transform: translateY(-10px) translateX(-10px); }
                }
                .animate-float {
                    animation: float ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default OnboardingPage;
