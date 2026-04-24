import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../services/api';
import L from 'leaflet';

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const cityCoords = {
  'Delhi': [28.6139, 77.2090],
  'Mumbai': [19.0760, 72.8777],
  'Bangalore': [12.9716, 77.5946],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Hyderabad': [17.3850, 78.4867],
  'Pune': [18.5204, 73.8567]
};

export default function RouteMap() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    API.get('/slots').then(res => setSlots(res.data));
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Route Network Visualization</h1>
        <p>Interactive origin-destination mapping</p>
      </header>

      <div className="card glass-panel" style={{ height: '600px', padding: 0, overflow: 'hidden' }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          
          {Object.entries(cityCoords).map(([city, coords]) => (
            <Marker key={city} position={coords}>
              <Popup>{city} Airport</Popup>
            </Marker>
          ))}

          {slots.map(slot => {
            if (cityCoords[slot.fromCity] && cityCoords[slot.toCity]) {
              return (
                <Polyline 
                  key={slot._id}
                  positions={[cityCoords[slot.fromCity], cityCoords[slot.toCity]]} 
                  color={slot.status === 'Optimized' ? '#ef4444' : '#3b82f6'} 
                  weight={2} 
                  opacity={0.5} 
                />
              )
            }
            return null;
          })}
        </MapContainer>
      </div>
      <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
        <span style={{color:'#3b82f6'}}>■ Standard Route</span>
        <span style={{color:'#ef4444'}}>■ Optimized/Congested Route</span>
      </div>
    </div>
  );
}
