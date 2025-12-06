import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- 1. MANUAL OVERRIDES FOR BROKEN STATES ---
// Using 'vemve' and 'HindustanTimesLabs' to guarantee coverage
const MANUAL_URLS = {
  "Maharashtra": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Maharashtra.json",
  "West Bengal": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/West%20Bengal.json",
  "Jammu and Kashmir": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Jammu%20and%20Kashmir.json",
  "J & K": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Jammu%20and%20Kashmir.json",
  "Delhi": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Delhi.json",
  "Ladakh": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Ladakh.json",
  "Telangana": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Telangana.json",
  "Andhra Pradesh": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Andhra%20Pradesh.json",
  "Uttar Pradesh": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Uttar%20Pradesh.json",
  "Rajasthan": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Rajasthan.json",
  "Karnataka": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Karnataka.json",
  "Tamil Nadu": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Tamil%20Nadu.json",
  "Kerala": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Kerala.json",
  "Gujarat": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Gujarat.json",
  "Madhya Pradesh": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Madhya%20Pradesh.json",
  "Bihar": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Bihar.json",
  
  // FIX FOR ODISHA
  "Odisha": "https://raw.githubusercontent.com/HindustanTimesLabs/shapefiles/master/state_ut/odisha/district/odisha_district.json",
  "Orissa": "https://raw.githubusercontent.com/HindustanTimesLabs/shapefiles/master/state_ut/odisha/district/odisha_district.json",
  
  "Punjab": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Punjab.json",
  "Haryana": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Haryana.json",
  "Assam": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Assam.json",
  "Chhattisgarh": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Chhattisgarh.json",
  "Jharkhand": "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Jharkhand.json"
};

const DistrictMap = ({ stateName }) => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      setError(false);
      setGeoData(null); // Reset data on change
      
      const cleanName = stateName.trim();
      
      // 1. Check if we have a manual override first (Solves Maharashtra/Odisha Issue)
      if (MANUAL_URLS[cleanName]) {
        try {
          console.log(`Fetching Manual URL for ${cleanName}:`, MANUAL_URLS[cleanName]);
          const res = await fetch(MANUAL_URLS[cleanName]);
          if (res.ok) {
            const data = await res.json();
            setGeoData(data);
            setLoading(false);
            return;
          }
        } catch(e) {
          console.warn("Manual URL failed, trying others...");
        }
      }

      // 2. Fallback to Algorithmic URLs (Standard names)
      const urls = [
        `https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/${cleanName}.json`,
        `https://raw.githubusercontent.com/yuvraj-k/indian-map-geojson/master/district/${cleanName.toLowerCase().replace(/ /g, "-")}.json`,
        `https://raw.githubusercontent.com/geohacker/india/master/district/${cleanName.toLowerCase().replace(/ /g, "-")}.json`,
        // Fix for old repo names (e.g. orissa.json instead of odisha.json)
        `https://raw.githubusercontent.com/geohacker/india/master/district/${cleanName.toLowerCase().replace('odisha', 'orissa').replace(/ /g, "-")}.json`, 
        `https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States/${cleanName.replace(/ /g, "_")}.json`
      ];

      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            // Ensure it's valid JSON (some 404s return HTML)
            if (text.startsWith("{")) {
              setGeoData(JSON.parse(text));
              setLoading(false);
              return;
            }
          }
        } catch (e) { console.warn(`Failed: ${url}`); }
      }
      
      // If we reach here, nothing worked
      console.error(`All map sources failed for ${cleanName}`);
      setError(true);
      setLoading(false);
    };

    fetchDistricts();
  }, [stateName]);

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>District Topography</h3>
      <div style={styles.mapFrame}>
        {loading && <div style={styles.centerMsg}>Loading Map Data...</div>}
        {error && <div style={styles.centerMsg}>Map Unavailable for {stateName}</div>}
        
        {!loading && !error && geoData && (
          <MapContainer center={[20, 78]} zoom={6} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <GeoJSON 
              key={stateName} // Force re-render when state changes
              data={geoData} 
              style={() => ({ fillColor: "#3b82f6", color: "white", weight: 1, fillOpacity: 0.5 })} 
              onEachFeature={(feature, layer) => {
                 const dName = feature.properties.dtname || feature.properties.district || feature.properties.NAME_2 || "District";
                 layer.bindTooltip(dName, { direction: "center", className: "map-tooltip" });
                 layer.on('mouseover', function(){ this.setStyle({fillOpacity: 0.8, color: "#1d4ed8"}) });
                 layer.on('mouseout', function(){ this.setStyle({fillOpacity: 0.5, color: "white"}) });
              }}
            />
            <FitBounds geoData={geoData} />
          </MapContainer>
        )}
      </div>
      <style>{`
        .map-tooltip { background: transparent; border: none; box-shadow: none; font-weight: bold; color: #333; text-shadow: 0 0 2px white; }
      `}</style>
    </div>
  );
};

const FitBounds = ({ geoData }) => {
  const map = useMap();
  useEffect(() => {
    if (geoData) {
      const layer = L.geoJSON(geoData);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [geoData, map]);
  return null;
};

const styles = {
  container: { padding: "40px 10%" },
  heading: { fontSize: "2rem", marginBottom: "20px", color: "#333", borderLeft: "5px solid #3b82f6", paddingLeft: "15px" },
  mapFrame: { height: "500px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", border: "1px solid #eee", position: "relative" },
  centerMsg: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#888", fontSize: "1.2rem" }
};

export default DistrictMap;

