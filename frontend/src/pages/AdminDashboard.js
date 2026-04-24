import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { ShieldAlert, Users, Settings, Activity, Plane, LogOut } from 'lucide-react';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const [slots, setSlots] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/slots').then(res => setSlots(res.data));
    API.get('/analytics').then(res => setAnalytics(res.data));
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <nav className="sidebar glass-panel admin-sidebar">
        <div className="logo-area" style={{marginBottom: '2rem'}}>
          <ShieldAlert size={28} color="#f59e0b" />
          <h2 style={{margin:0, fontSize:'1.2rem', color:'#f59e0b'}}>SkyFlow Admin</h2>
        </div>
        <div className="nav-links">
          <Link to="/admin" className="nav-link active"><Activity size={18}/> Overview</Link>
          <Link to="/dashboard" className="nav-link"><Plane size={18}/> User Console</Link>
          <a href="#" className="nav-link"><Users size={18}/> Manage Users</a>
          <a href="#" className="nav-link"><Settings size={18}/> System Config</a>
          
          <button onClick={() => { logout(); navigate('/login'); }} className="nav-link btn-logout mt-auto">
            <LogOut size={18}/> Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="ops-container">
        <header className="ops-header">
          <div>
            <h1>Admin Control Center</h1>
            <p>System-wide monitoring and access control</p>
          </div>
        </header>

        {/* Admin Widgets */}
        {analytics && (
          <div className="stats-container" style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1.5rem', marginBottom:'2rem'}}>
            <div className="stat-card glass-panel" style={{minWidth:0}}>
              <div className="stat-content">
                <p className="stat-title">System Load</p>
                <h3 className="stat-value">{analytics.totalSlots} Slots</h3>
              </div>
            </div>
            <div className="stat-card glass-panel" style={{minWidth:0, borderLeft:'4px solid #ef4444'}}>
              <div className="stat-content">
                <p className="stat-title">Congestion Events</p>
                <h3 className="stat-value text-danger">{analytics.optimizedSlots}</h3>
              </div>
            </div>
            <div className="stat-card glass-panel" style={{minWidth:0}}>
              <div className="stat-content">
                <p className="stat-title">Capacity Usage</p>
                <h3 className="stat-value">{analytics.utilizationRate}%</h3>
              </div>
            </div>
            <div className="stat-card glass-panel" style={{minWidth:0, borderLeft:'4px solid #10b981'}}>
              <div className="stat-content">
                <p className="stat-title">Delay Reduction</p>
                <h3 className="stat-value text-success">{analytics.optimizedSlots > 0 ? '15%' : '0%'}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Audit Log Table */}
        <div className="card glass-panel">
          <h3 style={{marginBottom:'1rem', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'1rem'}}>
            System Audit Log: Slot Allocations
          </h3>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Flight Route</th>
                  <th>Priority</th>
                  <th>Outcome Status</th>
                </tr>
              </thead>
              <tbody>
                {slots.slice().reverse().map(slot => (
                  <tr key={slot._id}>
                    <td><span className="date" style={{fontSize:'0.85rem'}}>{new Date(slot.createdAt).toLocaleString()}</span></td>
                    <td>Allocation Request</td>
                    <td><strong>{slot.fromCity}</strong> → <strong>{slot.toCity}</strong></td>
                    <td>{slot.priority}</td>
                    <td><StatusBadge status={slot.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
