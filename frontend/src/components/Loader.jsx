import React from "react";
import { Compass } from "lucide-react";

/**
 * Unified Loader Component - Use this across all components for consistent loading UX
 * 
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'md')
 * @param {string} text - Loading text to display (optional)
 * @param {boolean} overlay - Whether to show as a full-screen overlay (default: false)
 * @param {string} variant - 'default' | 'minimal' | 'pulse' (default: 'default')
 */
const Loader = ({
    size = "md",
    text = "",
    overlay = false,
    variant = "default"
}) => {

    // Size configurations
    const sizes = {
        sm: { container: "h-16", compass: "w-6 h-6", ring: "w-10 h-10", text: "text-xs" },
        md: { container: "h-32", compass: "w-8 h-8", ring: "w-14 h-14", text: "text-sm" },
        lg: { container: "h-48", compass: "w-12 h-12", ring: "w-20 h-20", text: "text-base" },
        xl: { container: "h-64", compass: "w-16 h-16", ring: "w-28 h-28", text: "text-lg" },
        full: { container: "h-screen", compass: "w-20 h-20", ring: "w-32 h-32", text: "text-xl" }
    };

    const config = sizes[size] || sizes.md;

    // Minimal variant - just a simple spinner
    if (variant === "minimal") {
        return (
            <div className={`flex items-center justify-center ${overlay ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : config.container}`}>
                <div className="relative">
                    <div className={`${config.ring} border-4 border-amber-100 rounded-full`} />
                    <div className={`${config.ring} border-4 border-transparent border-t-amber-500 rounded-full absolute inset-0 animate-spin`} />
                </div>
            </div>
        );
    }

    // Pulse variant - gentle pulsing compass
    if (variant === "pulse") {
        return (
            <div className={`flex flex-col items-center justify-center gap-4 ${overlay ? 'fixed inset-0 bg-white/90 backdrop-blur-sm z-50' : config.container}`}>
                <div className="relative">
                    <div className={`${config.ring} bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center animate-pulse`}>
                        <Compass className={`${config.compass} text-amber-600`} />
                    </div>
                </div>
                {text && <p className={`${config.text} text-gray-500 font-medium`}>{text}</p>}
            </div>
        );
    }

    // Default variant - premium animated compass with orbit rings
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${overlay ? 'fixed inset-0 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/50 backdrop-blur-sm z-50' : config.container}`}>
            {/* Main loader animation */}
            <div className="relative">
                {/* Outer glow */}
                <div className={`${config.ring} absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl opacity-30 animate-pulse`} />

                {/* Orbiting ring 1 */}
                <div className={`${config.ring} absolute inset-0`}>
                    <div className="w-full h-full border-2 border-dashed border-amber-300/50 rounded-full animate-[spin_8s_linear_infinite]" />
                </div>

                {/* Orbiting ring 2 */}
                <div className={`${config.ring} absolute inset-0`}>
                    <div className="w-full h-full border-2 border-dotted border-orange-300/40 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                </div>

                {/* Main spinning ring */}
                <div className={`${config.ring} relative`}>
                    <svg className="w-full h-full animate-[spin_2s_ease-in-out_infinite]" viewBox="0 0 50 50">
                        <circle
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="80 40"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="50%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#ea580c" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Center compass icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-full p-2 shadow-lg animate-pulse">
                            <Compass className={`${config.compass} text-white animate-[spin_4s_ease-in-out_infinite]`} />
                        </div>
                    </div>
                </div>

                {/* Orbiting dots */}
                <div className={`${config.ring} absolute inset-0 animate-[spin_3s_linear_infinite]`}>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-lg" />
                </div>
                <div className={`${config.ring} absolute inset-0 animate-[spin_4s_linear_infinite_reverse]`}>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full shadow-lg" />
                </div>
            </div>

            {/* Loading text with animated dots */}
            {text && (
                <div className="flex items-center gap-1">
                    <p className={`${config.text} text-gray-600 font-medium`}>{text}</p>
                    <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                </div>
            )}
        </div>
    );
};

// Named exports for convenience
export const FullPageLoader = ({ text = "Preparing your journey" }) => (
    <Loader size="full" text={text} overlay />
);

export const SectionLoader = ({ text = "Loading" }) => (
    <Loader size="lg" text={text} />
);

export const InlineLoader = () => (
    <Loader size="sm" variant="minimal" />
);

export const CardLoader = () => (
    <Loader size="md" variant="pulse" text="Loading content" />
);

export default Loader;
