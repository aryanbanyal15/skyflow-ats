import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { LayoutDashboard, Plane, Map, BarChart3, Settings, LogOut, FileText } from 'lucide-react';
import API from '../services/api';
import SlotForm from '../components/SlotForm';
import SlotTable from '../components/SlotTable';
import StatsCards from '../components/StatsCards';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const cityCoords = {
  'Delhi': [28.6139, 77.2090], 'Mumbai': [19.0760, 72.8777],
  'Bangalore': [12.9716, 77.5946], 'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639], 'Hyderabad': [17.3850, 78.4867],
  'Pune': [18.5204, 73.8567]
};

export default function SchedulerDashboard() {
  const [slots, setSlots] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [slotsRes, analyticsRes] = await Promise.all([
        API.get('/slots'),
        API.get('/analytics')
      ]);
      setSlots(slotsRes.data);
      
      const chartData = analyticsRes.data.hourlyDemand.map((count, hour) => ({
        time: `${hour}:00`, flights: count
      })).filter(d => d.flights > 0);
      
      setAnalytics({ ...analyticsRes.data, chartData });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addSlot = async (data) => {
    await API.post('/slots', data);
    fetchData();
  };

  const deleteSlot = async (id) => {
    await API.delete(`/slots/${id}`);
    fetchData();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Scheduler Slot Allocation Report", 20, 10);
    doc.autoTable({
      head: [['Airline', 'Route', 'Departure', 'Status']],
      body: slots.map(s => [s.airline, `${s.fromCity} - ${s.toCity}`, new Date(s.slotTime).toLocaleString(), s.status]),
    });
    doc.save('my_slots.pdf');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <nav className="sidebar glass-panel">
        <div className="logo-area" style={{marginBottom: '2rem'}}>
          <Plane size={28} color="#3b82f6" />
          <h2 style={{margin:0, fontSize:'1.2rem'}}>SkyFlow ATS</h2>
        </div>
        <div className="nav-links">
          <span className="nav-label">Main Menu</span>
          <Link to="/dashboard" className="nav-link active"><LayoutDashboard size={18}/> Console</Link>
          <Link to="/map" className="nav-link"><Map size={18}/> Network Map</Link>
          <Link to="/analytics" className="nav-link"><BarChart3 size={18}/> Analytics</Link>
          
          {user?.role === 'admin' && (
            <>
              <span className="nav-label" style={{marginTop:'1rem'}}>Administration</span>
              <Link to="/admin" className="nav-link"><Settings size={18}/> Admin Panel</Link>
            </>
          )}
          
          <button onClick={() => { logout(); navigate('/login'); }} className="nav-link btn-logout mt-auto">
            <LogOut size={18}/> Logout
          </button>
        </div>
      </nav>

      {/* Main Operations Console */}
      <div className="ops-container">
        <header className="ops-header">
          <div>
            <h1>Operations Console</h1>
            <p>Welcome back, Scheduler. System is active.</p>
          </div>
          <button onClick={exportPDF} className="btn-secondary"><FileText size={16}/> Export Report</button>
        </header>

        {/* Top KPIs */}
        <div className="kpi-row">
          <StatsCards slots={slots} />
        </div>

        {/* 3-Column Layout */}
        <div className="ops-grid">
          {/* Left: Queue */}
          <div className="ops-col queue-col glass-panel card">
            <h3>Live Flight Queue</h3>
            <div className="table-wrapper" style={{maxHeight:'500px', overflowY:'auto'}}>
              <SlotTable slots={slots} onDelete={deleteSlot} />
            </div>
          </div>

          {/* Center: Map */}
          <div className="ops-col map-col glass-panel card" style={{padding:0, overflow:'hidden'}}>
            <MapContainer center={[20.5937, 78.9629]} zoom={4.5} style={{ height: '100%', width: '100%', zIndex: 1 }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {slots.map(slot => (cityCoords[slot.fromCity] && cityCoords[slot.toCity]) ? (
                <Polyline key={slot._id} positions={[cityCoords[slot.fromCity], cityCoords[slot.toCity]]} 
                  color={slot.status === 'Optimized' ? '#ef4444' : '#3b82f6'} weight={2} opacity={0.6} />
              ) : null)}
            </MapContainer>
          </div>

          {/* Right: Forms & Alerts */}
          <div className="ops-col actions-col" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <SlotForm addSlot={addSlot} />
            
            <div className="glass-panel card alert-panel">
              <h3><span style={{color:'#f59e0b'}}>⚠</span> System Alerts</h3>
              {analytics?.optimizedSlots > 0 ? (
                <div className="alert-item warning">
                  <strong>Congestion Warning:</strong> {analytics.optimizedSlots} flights were automatically delayed and optimized to prevent runway collisions.
                </div>
              ) : (
                <div className="alert-item success">
                  <strong>System Normal:</strong> No congestion detected in the network.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Charts */}
        {analytics && analytics.chartData && analytics.chartData.length > 0 && (
          <div className="bottom-row glass-panel card" style={{marginTop:'1.5rem', height:'300px'}}>
            <h3>Demand Trend (Next 24h)</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={analytics.chartData}>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                <Bar dataKey="flights" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
