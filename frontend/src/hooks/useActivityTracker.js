import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Page name mappings for display
const PAGE_NAMES = {
    '/': 'Home',
    '/profile': 'Profile',
    '/chat': 'AI Chat',
    '/map': 'India Map',
    '/booking': 'Travel Booking',
    '/foot': 'Regional Dashboard',
    '/onboarding': 'Onboarding',
};

// Icons for each page/action type
const ICONS = {
    page: { '/': '🏠', '/profile': '👤', '/chat': '💬', '/map': '🗺️', '/booking': '✈️', '/foot': '📊' },
    state: '📍',
    destination: '🏛️',
    card: '🎴',
    search: '🔍',
};

const STORAGE_KEY = 'deepshiva_activity_history';
const MAX_HISTORY = 30;

/**
 * Get activity history from localStorage
 */
export function getActivityHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Clear all activity history
 */
export function clearActivityHistory() {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Log a custom activity (card click, region select, etc.)
 * @param {string} type - 'card' | 'state' | 'destination' | 'search' | 'page'
 * @param {string} name - Display name of clicked item
 * @param {string} path - Optional navigation path
 * @param {object} metadata - Additional data
 */
export function logActivity(type, name, path = null, metadata = {}) {
    const history = getActivityHistory();

    const newEntry = {
        type,
        name,
        path,
        icon: ICONS[type] || '📌',
        timestamp: new Date().toISOString(),
        ...metadata
    };

    // Remove very recent duplicates of same name/type
    const filtered = history.filter(h =>
        !(h.name === name && h.type === type &&
            Date.now() - new Date(h.timestamp).getTime() < 60000)
    );

    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Add a page visit to activity history
 */
function addPageVisit(path) {
    if (path === '/auth' || path === '/onboarding' || path === '/profile') return;

    let name = PAGE_NAMES[path];
    let icon = ICONS.page[path] || '📄';

    // Handle state detail pages
    if (path.startsWith('/map/')) {
        const stateName = path.replace('/map/', '').replace(/-/g, ' ');
        name = `Explored ${stateName}`;
        icon = ICONS.state;
    }

    if (!name) return;

    logActivity('page', name, path, { icon });
}

/**
 * Hook to track page visits
 */
export function useActivityTracker() {
    const location = useLocation();

    useEffect(() => {
        addPageVisit(location.pathname);
    }, [location.pathname]);
}

export default useActivityTracker;
