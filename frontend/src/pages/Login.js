import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mocking auto-register for demo purposes so it always works
      try {
        await API.post('/auth/register', { username, password, role: 'admin' });
      } catch (err) {
        // Ignore register error (user probably exists)
      }

      const res = await API.post('/auth/login', { username, password });
      login(res.data);
      
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <h2 className="login-title">Aviation Slot System</h2>
        <p className="login-subtitle">Scheduler Login</p>
        
        {error && <div className="error-badge">{error}</div>}
        
        <form onSubmit={handleLogin} className="slot-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn-primary" style={{width: '100%'}}>Sign In</button>
        </form>
      </div>
    </div>
  );
}
