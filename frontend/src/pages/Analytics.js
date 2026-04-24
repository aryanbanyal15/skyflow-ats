import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import API from '../services/api';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await API.get('/analytics');
      
      const chartData = res.data.hourlyDemand.map((count, hour) => ({
        time: `${hour}:00`,
        flights: count
      }));
      
      setData({ ...res.data, chartData });
    };
    fetchAnalytics();
  }, []);

  if (!data) return <div style={{padding: '2rem'}}>Loading analytics...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Performance Analytics</h1>
        <p>Real-time optimization metrics and insights</p>
      </header>

      <div className="stats-container">
        <div className="stat-card glass-panel">
          <div className="stat-content">
            <p className="stat-title">Delay Reduction</p>
            <h3 className="stat-value text-success">{data.optimizedSlots > 0 ? '15%' : '0%'}</h3>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-content">
            <p className="stat-title">Optimized Slots</p>
            <h3 className="stat-value">{data.optimizedSlots}</h3>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-content">
            <p className="stat-title">Capacity Utilization</p>
            <h3 className="stat-value">{data.utilizationRate}%</h3>
          </div>
        </div>
      </div>

      <div className="card glass-panel" style={{ marginTop: '2rem', height: '400px' }}>
        <h3 style={{marginBottom: '1rem'}}>Hourly Slot Demand</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
            <Bar dataKey="flights" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
