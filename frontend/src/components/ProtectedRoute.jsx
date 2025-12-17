import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Simplified Protected Route wrapper
 * - If authenticated: render children immediately
 * - If not authenticated: redirect to /auth
 * - If loading (initial auth check only): show minimal loader
 */
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // FAST PATH: If authenticated, render immediately (don't wait for loading)
    if (isAuthenticated) {
        return children;
    }

    // Only show loader during INITIAL page load when we don't know auth state yet
    // This prevents loader showing during navigation between auth'd pages
    if (loading && !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated and not loading = redirect to auth
    return <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;
