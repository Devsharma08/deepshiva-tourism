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

import React, { useState, useEffect } from 'react'; // Import Hooks
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import India3D from './SpecsPages/India3D';       
import StateDetails from './SpecsPages/StateDetails'; 
import { getMapFromDB, saveMapToDB } from "./utils/ContextManager";
import RegionalDashboard from './SpecsComponent/Foot.jsx'
import BookingPage from './SpecsPages/BookingPage.jsx';
import TravelApp from './SpecsPages/TravelCard.jsx';
import './App.css';
import ListPage from './SpecsPages/ListPage.jsx';
import App1 from './main1.jsx'


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
    <div className='w-full h-full m-0 p-0'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/foot" element={<RegionalDashboard />} />
        <Route path="/bot" element={<App1 />} />
        
        
        {/* 3. Pass the pre-loaded data down to India3D */}
        <Route 
          path="/map" 
          element={<India3D preLoadedData={indiaGeoData} />} 
        />
        <Route path="/map/:stateName" element={<StateDetails />} />
        </Routes>


        {/* booking */}
        {/* <Route path='/booking' element={<ListPage/>}></Route> */}
    </div>
  );
}

export default App;