import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlaneTakeoff, ShieldCheck, Activity, Map } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo-area">
          <PlaneTakeoff size={32} color="#3b82f6" />
          <h1 className="logo-text">SkyFlow ATS</h1>
        </div>
        <button onClick={() => navigate('/login')} className="btn-primary" style={{marginTop: 0, padding: '0.5rem 1.5rem'}}>
          System Login
        </button>
      </nav>

      <main className="landing-hero">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <div className="badge">Enterprise Edition</div>
          <h1 className="hero-title">
            Intelligent Multi-City-Pair <br/>
            <span className="text-gradient">Slot Allocation System</span>
          </h1>
          <p className="hero-subtitle">
            Rationalized block-time optimization, delay reduction, and dynamic capacity management for modern aviation operations centers.
          </p>
          
          <div className="hero-actions">
            <button onClick={() => navigate('/login')} className="btn-primary" style={{padding: '1rem 2rem', fontSize: '1.1rem'}}>
              Access Operations Console
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="features-grid"
        >
          <div className="feature-card glass-panel">
            <Activity className="feature-icon" color="#34d399" />
            <h3>Optimization Engine</h3>
            <p>Dynamically rationalizes block times to minimize delays.</p>
          </div>
          <div className="feature-card glass-panel">
            <Map className="feature-icon" color="#3b82f6" />
            <h3>Route Network Visualization</h3>
            <p>Real-time interactive monitoring of congested city pairs.</p>
          </div>
          <div className="feature-card glass-panel">
            <ShieldCheck className="feature-icon" color="#8b5cf6" />
            <h3>Role-Based Access</h3>
            <p>Strict RBAC for Administrators and Schedulers.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
