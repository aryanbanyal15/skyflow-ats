import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Demo bypass login
  const handleLogin = async (e) => {
    e.preventDefault();

    login({
      username: "admin",
      role: "admin",
      token: "demo-token"
    });

    navigate('/admin');
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

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}