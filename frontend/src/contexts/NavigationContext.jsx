import React, { createContext, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Simplified Navigation Context - relies on React Suspense for loading states
const NavigationContext = createContext({
    navigateTo: () => { }
});

// Hook to use navigation context
export const useNavigation = () => useContext(NavigationContext);

// Provider component - simplified to just provide navigation function
export const NavigationProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Simple navigation - just navigate directly, let Suspense handle loading
    const navigateTo = useCallback((path, options = {}) => {
        if (path === location.pathname) return; // Don't navigate to same page
        navigate(path, options);
    }, [navigate, location.pathname]);

    // Compatibility: startNavigation is now a no-op (Suspense handles loading)
    const startNavigation = useCallback(() => { }, []);
    const endNavigation = useCallback(() => { }, []);

    return (
        <NavigationContext.Provider value={{
            isNavigating: false, // Always false - Suspense handles loading
            startNavigation,
            endNavigation,
            navigateTo
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

// Navigation Loader is now disabled - Suspense fallback handles loading
export const NavigationLoader = () => null;

export default NavigationContext;
