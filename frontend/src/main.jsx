import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import App from './App.jsx'
import App from './SpecsPages/ListPage.jsx'
import "leaflet/dist/leaflet.css"; // Leaflet styles
import './index.css' // Global styles


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)