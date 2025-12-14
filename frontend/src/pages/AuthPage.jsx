import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn, hasCompletedOnboarding } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, MapPin, Compass } from 'lucide-react';

const AuthPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: ''
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🔵 Form submitted');
        setLoading(true);
        setError('');

        const email = formData.email.trim();
        const password = formData.password.trim();
        const displayName = formData.displayName.trim();

        console.log('📧 Email:', email);
        console.log('🔐 Password length:', password.length);
        console.log('👤 Display name:', displayName);

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                console.log('🔑 Attempting sign in...');
                const authData = await signIn(email, password);
                console.log('✅ Sign in successful:', authData.user.id);

                // Login always goes to home (no onboarding)
                console.log('🏠 Navigating to home...');
                navigate('/');
            } else {
                console.log('📝 Attempting sign up...');
                const result = await signUp(email, password, displayName);
                console.log('✅ Sign up successful:', result.user.id);
                console.log('🚀 Navigating to onboarding...');
                navigate('/onboarding');
            }
        } catch (err) {
            console.error('❌ Auth Error:', err);
            const message = err.message || err.error_description || 'An error occurred. Please try again.';

            // Provide helpful error messages
            if (message.includes('Invalid login credentials')) {
                setError('❌ Invalid email or password. Please check and try again.');
            } else if (message.includes('Email not confirmed')) {
                setError('⚠️ Please confirm your email before signing in.');
            } else if (message.includes('already registered')) {
                setError('This email is already registered. Please sign in instead.');
            } else if (message.includes('User not found')) {
                setError('❌ No account found. Please sign up first.');
            } else {
                setError(message);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"
                    style={{
                        top: '10%',
                        left: '10%',
                        animationDuration: '8s'
                    }}
                />
                <div
                    className="absolute w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"
                    style={{
                        bottom: '10%',
                        right: '10%',
                        animationDelay: '2s',
                        animationDuration: '10s'
                    }}
                />
                <div
                    className="absolute w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animationDelay: '4s',
                        animationDuration: '12s'
                    }}
                />

                {/* Mouse-following orb */}
                <div
                    className="absolute w-64 h-64 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 transition-all duration-1000 ease-out"
                    style={{
                        top: `${mousePosition.y}%`,
                        left: `${mousePosition.x}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="w-full max-w-6xl mx-auto flex gap-12 items-center relative z-10">

                {/* Left Panel - Branding */}
                <div className="hidden lg:flex lg:w-1/2 flex-col gap-8">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white shadow-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🇮🇳</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent" style={{ fontFamily: "'Cinzel', serif" }}>
                                DeepShiva Tourism
                            </span>
                        </div>

                        <h1 className="text-6xl font-black text-gray-900 leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                            Discover
                            <span className="block bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                                Incredible India
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                            Join thousands of travelers exploring India's rich heritage, vibrant culture, and breathtaking landscapes with AI-powered personalized itineraries.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        {[
                            { icon: Sparkles, text: 'AI-Powered Recommendations' },
                            { icon: MapPin, text: 'Personalized Itineraries' },
                            { icon: Compass, text: 'Local Expert Guides' }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-700">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                                    <feature.icon className="w-5 h-5 text-orange-600" />
                                </div>
                                <span className="font-medium">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 max-w-md mx-auto w-full">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🇮🇳</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Cinzel', serif" }}>DeepShiva</span>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-orange-500/20 p-8 border border-white/50">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                                {isLogin ? 'Welcome Back' : 'Start Your Journey'}
                            </h2>
                            <p className="text-gray-500">
                                {isLogin
                                    ? 'Sign in to continue exploring'
                                    : 'Create your account to discover India'}
                            </p>
                        </div>

                        {/* Toggle */}
                        <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-1.5 mb-8 shadow-inner">
                            <button
                                onClick={() => { setIsLogin(true); setError(''); }}
                                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${isLogin
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setError(''); }}
                                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${!isLogin
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm font-medium animate-in fade-in">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Display Name (Signup only) */}
                            {!isLogin && (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="displayName"
                                        placeholder="Your Name"
                                        value={formData.displayName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 font-medium"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 font-medium"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 font-medium"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg shadow-orange-500/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Terms */}
                        <p className="text-center text-gray-400 text-xs mt-6">
                            By continuing, you agree to our{' '}
                            <a href="#" className="text-orange-600 hover:underline font-medium">Terms</a>
                            {' & '}
                            <a href="#" className="text-orange-600 hover:underline font-medium">Privacy Policy</a>
                        </p>
                    </div>
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

export default AuthPage;
