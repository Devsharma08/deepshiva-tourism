import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Create context for navigation loading state
const NavigationContext = createContext({
    isNavigating: false,
    startNavigation: () => { },
    endNavigation: () => { },
    navigateTo: () => { }
});

// Hook to use navigation context
export const useNavigation = () => useContext(NavigationContext);

// Provider component
export const NavigationProvider = ({ children }) => {
    const [isNavigating, setIsNavigating] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const prevPathRef = React.useRef(location.pathname);

    // Start navigation loading state
    const startNavigation = useCallback(() => {
        setIsNavigating(true);
    }, []);

    // End navigation loading state
    const endNavigation = useCallback(() => {
        setIsNavigating(false);
    }, []);

    // Navigate with loading state
    const navigateTo = useCallback((path, options = {}) => {
        if (path === location.pathname) return; // Don't navigate to same page

        setIsNavigating(true);

        // Use setTimeout to ensure the loader appears before navigation starts
        setTimeout(() => {
            navigate(path, options);
        }, 0);
    }, [navigate, location.pathname]);

    // Listen for route changes and manage loading state
    useEffect(() => {
        if (prevPathRef.current !== location.pathname) {
            // Route changed - show loader immediately
            setIsNavigating(true);
            prevPathRef.current = location.pathname;

            // End loading after a micro-delay to allow Suspense to render
            // The actual component will take over once loaded
            const timer = setTimeout(() => {
                setIsNavigating(false);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    return (
        <NavigationContext.Provider value={{
            isNavigating,
            startNavigation,
            endNavigation,
            navigateTo
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

// Navigation Loader Component - shows during all navigations
export const NavigationLoader = () => {
    const { isNavigating } = useNavigation();

    if (!isNavigating) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            gap: '16px'
        }}>
            {/* Animated logo/spinner */}
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(245, 158, 11, 0.3)',
                animation: 'navPulse 1.5s ease-in-out infinite'
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
            <p style={{
                color: '#92400e',
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.5px',
                margin: 0
            }}>Loading...</p>
            <style>{`
        @keyframes navPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
        </div>
    );
};

export default NavigationContext;
