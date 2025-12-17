// Preload utility for route prefetching to reduce navigation delays
// This module provides functions to preload lazy-loaded components and media

// Cache to track already preloaded routes
const preloadedRoutes = new Set();
// Cache to track preloaded images
const preloadedImages = new Set();

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

// ============ IMAGE PRELOADING ============

/**
 * Preload a single image
 * @param {string} src - The image URL to preload
 * @returns {Promise} - Resolves when image is loaded
 */
export const preloadImage = (src) => {
    if (!src || preloadedImages.has(src)) return Promise.resolve();

    preloadedImages.add(src);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => {
            preloadedImages.delete(src); // Allow retry
            reject(new Error(`Failed to load: ${src}`));
        };
        img.src = src;
    });
};

/**
 * Preload multiple images at once
 * @param {string[]} urls - Array of image URLs to preload
 * @returns {Promise} - Resolves when all images are loaded
 */
export const preloadImages = (urls) => {
    const uniqueUrls = [...new Set(urls.filter(Boolean))];
    return Promise.allSettled(uniqueUrls.map(preloadImage));
};

/**
 * Preload images in background (non-blocking)
 * @param {string[]} urls - Array of image URLs to preload
 */
export const preloadImagesInBackground = (urls) => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            preloadImages(urls).catch(() => { });
        }, { timeout: 3000 });
    } else {
        setTimeout(() => {
            preloadImages(urls).catch(() => { });
        }, 100);
    }
};

/**
 * Preload critical images for the home page
 */
export const preloadCriticalImages = () => {
    const criticalImages = [
        // Add your critical homepage images here
        'https://ik.imagekit.io/zd04b5mivn/Gemini_Generated_Image_oollssoollssooll.png?updatedAt=1761297541525',
        'https://ik.imagekit.io/zd04b5mivn/Gemini_Generated_Image_hy08gqhy08gqhy08.png?updatedAt=1761297565489',
    ];
    preloadImagesInBackground(criticalImages);
};

// ============ VIDEO PRELOADING ============

/**
 * Preload video metadata (not full video)
 * @param {string} src - The video URL to preload
 */
export const preloadVideoMetadata = (src) => {
    if (!src) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    link.type = 'video/mp4';
    document.head.appendChild(link);
};

export default {
    preloadRoute,
    preloadRoutes,
    preloadCommonRoutes,
    handleLinkPreload,
    getLinkPreloadProps,
    preloadImage,
    preloadImages,
    preloadImagesInBackground,
    preloadCriticalImages,
    preloadVideoMetadata,
};
