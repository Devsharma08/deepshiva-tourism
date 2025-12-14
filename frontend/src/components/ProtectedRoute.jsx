import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protected Route wrapper - redirects to /auth if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const [forceRender, setForceRender] = useState(false);

    // Failsafe: Force render after 3 seconds even if still loading
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                console.warn('⚠️ Auth loading timeout - forcing render');
                setForceRender(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [loading]);

    console.log('🔐 ProtectedRoute:', { loading, isAuthenticated, forceRender, path: location.pathname });

    // Show loading spinner while checking auth (max 3 seconds)
    if (loading && !forceRender) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to auth page if not authenticated
    if (!isAuthenticated && !forceRender) {
        console.log('🔐 Not authenticated, redirecting to /auth');
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If force rendered but not authenticated, also redirect
    if (forceRender && !isAuthenticated) {
        console.log('🔐 Force render but not authenticated, redirecting');
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    console.log('🔐 Rendering protected content');
    return children;
};

export default ProtectedRoute;
