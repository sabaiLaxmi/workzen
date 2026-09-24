import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axiosInstance';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axiosInstance.post('/api/auth/register', { name, email, password, role });
      navigate('/login', { state: { message: 'Registration successful! Please log in with your new credentials.' } });

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
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
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Join Workzen to streamline your workforce.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full name</label>
            <input 
              type="text" 
              id="name" 
              className="form-input" 
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select 
              id="role" 
              className="form-input" 
              value={role}
              onChange={(e) => { setRole(e.target.value); setError(''); }}
              disabled={loading}
            >
              <option value="employee">Employee</option>
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
            {loading ? <div className="spinner"></div> : 'Get started'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in here</Link>
        </div>
      </div>
    </main>
  );
}
