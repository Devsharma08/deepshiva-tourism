// import { Routes, Route } from 'react-router-dom';
// import './App.css';

// // Import Pages
// import Home from './pages/Home';
// import ChatPage from './pages/ChatPage';
// import India3D from './SpecsPages/India3D';        
// import StateDetails from './SpecsPages/StateDetails'; 



// function App() {
//   return (
//     <div className='w-full h-full m-0 p-0'>
//       <Routes>
//         {/* Default Route */}
//         <Route path="/" element={<Home />} />

//         {/* Chat Route */}
//         <Route path="/chat" element={<ChatPage />} />

//         {/* Tourism Routes */}
//         <Route path="/map" element={<India3D />} />
//         <Route path="/map/:stateName" element={<StateDetails />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import { getMapFromDB, saveMapToDB } from "./utils/ContextManager";
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider, NavigationLoader } from './contexts/NavigationContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Layout Components - import normally for faster initial load
const Navigation = React.lazy(() => import('./pages/navigation'));
const Footer = React.lazy(() => import('./pages/Footer'));

// Lazy load page components
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const India3D = React.lazy(() => import('./SpecsPages/India3D'));
const StateDetails = React.lazy(() => import('./SpecsPages/StateDetails'));
const RegionalDashboard = React.lazy(() => import('./SpecsComponent/Foot.jsx'));
const TravelDashboard = React.lazy(() => import('./SpecsComponent/TravelDashboard.jsx'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ItineraryPlanner = React.lazy(() => import('./pages/ItineraryPlanner'));

// IMMEDIATELY prefetch all routes on module load for zero navigation delay
const prefetchAllRoutes = () => {
  // Start prefetching immediately - don't wait
  Promise.all([
    import('./SpecsPages/India3D'),
    import('./pages/ChatPage'),
    import('./pages/ItineraryPlanner'),
    import('./pages/ProfilePage'),
    import('./pages/AuthPage'),
    import('./pages/OnboardingPage'),
    import('./SpecsComponent/TravelDashboard'),
    import('./SpecsComponent/Foot'),
    import('./SpecsPages/StateDetails'),
    import('./pages/navigation'),
    import('./pages/Footer'),
  ]).catch(() => { }); // Silently handle any errors
};

// Prefetch routes and images immediately when this module loads
prefetchAllRoutes();

// Preload critical images for faster rendering (imported dynamically to avoid circular deps)
import('./utils/preloadRoutes').then(module => {
  module.preloadCriticalImages?.();
}).catch(() => { });

// Activity tracking component
import { useActivityTracker } from './hooks/useActivityTracker';
import { useXPManager } from './hooks/useXPManager';
const ActivityTracker = () => { useActivityTracker(); return null; };
const XPManager = () => { useXPManager(); return null; };

// Common Page Transition Loader - consistent across all transitions
const PageTransitionLoader = () => (
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
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
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

// Initial Loading spinner (only for first app load)
const LoadingSpinner = () => (
  <div style={{
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    gap: '20px'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '4px solid rgba(251, 146, 60, 0.2)',
      borderTop: '4px solid #fb923c',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{
      color: '#94a3b8',
      fontSize: '1rem',
      fontWeight: '500',
      letterSpacing: '0.5px'
    }}>Loading...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Layout component with Navigation and Footer
const Layout = ({ children }) => {
  const location = useLocation();

  // Pages that should NOT have the global header/footer
  const noLayoutPages = ['/auth', '/onboarding', '/', '/chat'];
  const showLayout = !noLayoutPages.includes(location.pathname);

  return (
    <>
      {/* Navigation Loader - shows during all route changes */}
      <NavigationLoader />

      {showLayout && (
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
      )}
      <main style={{
        minHeight: showLayout ? 'calc(100vh - 60px)' : '100vh',
        paddingTop: showLayout ? '60px' : '0'
      }}>
        <Suspense fallback={<PageTransitionLoader />}>
          {children}
        </Suspense>
      </main>
      {showLayout && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </>
  );
};

const INDIA_MAP_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

function App() {
  const [indiaGeoData, setIndiaGeoData] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const cached = await getMapFromDB('india_main');
        if (cached) {
          setIndiaGeoData(cached);
        } else {
          const res = await fetch(INDIA_MAP_URL);
          const data = await res.json();
          setIndiaGeoData(data);
          await saveMapToDB('india_main', data);
        }
      } catch (e) { console.error("Map Load Failed", e); }
    };
    initMap();
  }, []);

  return (
    <AuthProvider>
      <NavigationProvider>
        <ActivityTracker />
        <XPManager />
        <div className='w-full h-full m-0 p-0'>
          <Suspense fallback={<LoadingSpinner />}>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<AuthPage />} />

                {/* Protected Routes */}
                <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/foot" element={<ProtectedRoute><RegionalDashboard /></ProtectedRoute>} />
                <Route path="/booking" element={<ProtectedRoute><TravelDashboard /></ProtectedRoute>} />
                <Route path="/itinerary" element={<ProtectedRoute><ItineraryPlanner /></ProtectedRoute>} />
                <Route path="/map" element={<ProtectedRoute><India3D /></ProtectedRoute>} />
                <Route path="/map/:stateName" element={<ProtectedRoute><StateDetails /></ProtectedRoute>} />
              </Routes>
            </Layout>
          </Suspense>
        </div>
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;