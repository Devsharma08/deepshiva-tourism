import { useState } from 'react'
import App2 from './Leaflet'
import AdminDashboard from './AdminDashboard.jsx';
import App3 from './Dashboard.jsx';
import TouristDashboard from './UserInteface.jsx';
// import TrackingDashboard from './Dashboard.jsx';
import TrackingDashboard from './TrackingDashboard.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <App3/> */}
    <TrackingDashboard/>
      {/* <AdminDashboard/> */}
      {/* <TouristDashboard/> */}
    </>
  )
}

export default App
