import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axiosInstance';
import confetti from 'canvas-confetti';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Simulate API call latency to show inline spinner
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const res = await axiosInstance.post('/api/auth/login', { email, password, role });
      const { token, ...userData } = res.data;
      login(token, userData);
      
      // Show success message and fire beautiful confetti
      setSuccessMessage(`You logged in as a ${role} successfully!`);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#1E3A34', '#D4AF37', '#F6F6F0', '#34D399']
      });

      // Delay navigation to let them see the animation
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Incorrect email or password.');
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="var(--ink)" strokeWidth="2"/>
              <path d="M12 6V12L16 16" stroke="var(--ochre)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to manage your time and team.</p>
        </div>

        {successMessage && <div className="form-success" style={{ color: 'var(--pine)', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '4px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500' }}>{successMessage}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="role" className="form-label">Login As</label>
            <select 
              id="role"
              className="form-input"
              value={role}
              onChange={(e) => { setRole(e.target.value); setError(''); }}
              disabled={loading}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="form-input"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                disabled={loading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            {error && <div className="form-error">{error}</div>}
          </div>

          <button type="submit" className="btn-filled auth-submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Log in'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </main>
  );
}
