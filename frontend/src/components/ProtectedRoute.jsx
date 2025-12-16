import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Track if initial auth has been verified globally
let initialAuthVerified = false;

/**
 * Protected Route wrapper - redirects to /auth if not authenticated
 * Optimized for faster navigation after initial auth check
 */
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const [forceRender, setForceRender] = useState(false);
    const hasRenderedOnce = useRef(false);

    // Mark that we've verified auth after first successful render
    useEffect(() => {
        if (isAuthenticated && !loading) {
            initialAuthVerified = true;
            hasRenderedOnce.current = true;
        }
    }, [isAuthenticated, loading]);

    // Failsafe: Force render after 1 second (reduced from 3s)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading && !initialAuthVerified) {
                console.warn('⚠️ Auth loading timeout - forcing render');
                setForceRender(true);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [loading]);

    // Skip loading state if auth was already verified (fast path)
    if (initialAuthVerified && isAuthenticated) {
        return children;
    }

    // Show loading spinner only on INITIAL auth check (not on every navigation)
    if (loading && !forceRender && !initialAuthVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Verifying...</p>
                </div>
            </div>
        );
    }

    // Redirect to auth page if not authenticated
    if (!isAuthenticated && !forceRender) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If force rendered but not authenticated, also redirect
    if (forceRender && !isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
