// Preload utility for route prefetching to reduce navigation delays
// This module provides functions to preload lazy-loaded components

// Cache to track already preloaded routes
const preloadedRoutes = new Set();

// Route component mappings for preloading
const routeComponentMap = {
    '/': () => import('../pages/Home'),
    '/map': () => import('../SpecsPages/India3D'),
    '/chat': () => import('../pages/ChatPage'),
    '/itinerary': () => import('../pages/ItineraryPlanner'),
    '/profile': () => import('../pages/ProfilePage'),
    '/booking': () => import('../SpecsComponent/TravelDashboard'),
    '/auth': () => import('../pages/AuthPage'),
    '/activities': () => import('../pages/Activities'),
};

/**
 * Preload a specific route's component
 * @param {string} path - The route path to preload
 */
export const preloadRoute = (path) => {
    // Normalize path (remove query strings, hashes)
    const normalizedPath = path.split('?')[0].split('#')[0];

    // Skip if already preloaded
    if (preloadedRoutes.has(normalizedPath)) return;

    // Get loader function for this route
    const loader = routeComponentMap[normalizedPath];

    if (loader) {
        // Mark as preloaded immediately to prevent duplicate loads
        preloadedRoutes.add(normalizedPath);

        // Use requestIdleCallback if available for non-blocking load
        const loadFn = () => {
            loader().catch(() => {
                // Remove from cache if load failed so it can be retried
                preloadedRoutes.delete(normalizedPath);
            });
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadFn, { timeout: 1000 });
        } else {
            setTimeout(loadFn, 0);
        }
    }
};

/**
 * Preload multiple routes at once
 * @param {string[]} paths - Array of route paths to preload
 */
export const preloadRoutes = (paths) => {
    paths.forEach(path => preloadRoute(path));
};

/**
 * Preload all commonly used routes
 */
export const preloadCommonRoutes = () => {
    const commonRoutes = ['/map', '/chat', '/itinerary', '/profile', '/booking'];
    preloadRoutes(commonRoutes);
};

/**
 * Handler for mouse enter/focus events on links
 * Call this in onMouseEnter or onFocus of Link components
 * @param {string} to - The destination path
 */
export const handleLinkPreload = (to) => {
    preloadRoute(to);
};

/**
 * Create preload props for a Link component
 * @param {string} to - The destination path
 * @returns {Object} Props to spread on Link component
 */
export const getLinkPreloadProps = (to) => ({
    onMouseEnter: () => preloadRoute(to),
    onFocus: () => preloadRoute(to),
});

export default {
    preloadRoute,
    preloadRoutes,
    preloadCommonRoutes,
    handleLinkPreload,
    getLinkPreloadProps
};
