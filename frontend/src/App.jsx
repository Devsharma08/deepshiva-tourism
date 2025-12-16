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

import React, { useState, useEffect, Suspense } from 'react'; // Import Hooks
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { getMapFromDB, saveMapToDB } from "./utils/ContextManager";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Layout Components
const Navigation = React.lazy(() => import('./pages/navigation'));
const Footer = React.lazy(() => import('./pages/Footer'));

// Lazy load heavy components for faster initial load and navigation
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const India3D = React.lazy(() => import('./SpecsPages/India3D'));
const StateDetails = React.lazy(() => import('./SpecsPages/StateDetails'));
const RegionalDashboard = React.lazy(() => import('./SpecsComponent/Foot.jsx'));
const TravelDashboard = React.lazy(() => import('./SpecsComponent/TravelDashboard.jsx'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ItineraryPlanner = React.lazy(() => import('./pages/ItineraryPlanner'));

// Activity tracking component
import { useActivityTracker } from './hooks/useActivityTracker';
import { useXPManager } from './hooks/useXPManager';
const ActivityTracker = () => { useActivityTracker(); return null; };
const XPManager = () => { useXPManager(); return null; };

// Loading spinner component
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

  // Pages that should NOT have the global header/footer (they have their own)
  const noLayoutPages = ['/auth', '/onboarding', '/'];
  const showLayout = !noLayoutPages.includes(location.pathname);

  return (
    <>
      {showLayout && (
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
      )}
      <main style={{
        minHeight: showLayout ? 'calc(100vh - 60px)' : '100vh',
        paddingTop: showLayout ? '60px' : '0' // Account for fixed header
      }}>
        {children}
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
  // 1. Store the map data at the top level
  const [indiaGeoData, setIndiaGeoData] = useState(null);

  // 2. Fetch it ONCE when the website loads
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
    </AuthProvider>
  );
}

export default App;