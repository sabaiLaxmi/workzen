import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axiosInstance';
import confetti from 'canvas-confetti';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const passwordInputRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Handle ESC key to close popup modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSignupModal) {
        setShowSignupModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSignupModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsPasswordError(false);
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);

    try {
      // API call to authenticate user
      const res = await axiosInstance.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      const { token, ...userData } = res.data;
      login(token, userData);

      const userRole = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'User';
      setSuccessMessage(`Welcome back! Successfully logged in as ${userRole}.`);

      // Fire celebratory confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#1E3A34', '#D4AF37', '#F6F6F0', '#34D399']
      });

      // Brief delay to let the user see the success confirmation
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1400);

    } catch (err) {
      setLoading(false);
      const resData = err.response?.data;
      const status = err.response?.status;

      // If user doesn't exist in database -> trigger signup popup modal
      if (status === 404 || resData?.code === 'USER_NOT_FOUND') {
        setShowSignupModal(true);
      } 
      // If user exists but password is incorrect -> show wrong password error
      else if (status === 401 || resData?.code === 'WRONG_PASSWORD') {
        setIsPasswordError(true);
        setError('Wrong password. Please try again.');
        setTimeout(() => {
          passwordInputRef.current?.focus();
          passwordInputRef.current?.select();
        }, 50);
      } 
      else {
        setError(resData?.message || err.message || 'Login failed. Please check your credentials.');
      }
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
          <p className="auth-subtitle">Enter your email and password to access your account.</p>
        </div>

        {successMessage && (
          <div className="form-success" style={{ color: 'var(--pine)', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '4px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500' }}>
            {successMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => { 
                setEmail(e.target.value); 
                setError(''); 
                setIsPasswordError(false);
              }}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-wrapper">
              <input 
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"} 
                id="password" 
                className={`form-input ${isPasswordError ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { 
                  setPassword(e.target.value); 
                  setError(''); 
                  setIsPasswordError(false);
                }}
                disabled={loading}
                autoComplete="current-password"
                required
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
            {error && (
              <div className="form-error" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-filled auth-submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Log in'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>

      {/* Account Not Found - Sign Up Popup Modal */}
      {showSignupModal && (
        <div 
          className="auth-modal-overlay" 
          onClick={() => setShowSignupModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-modal-title"
        >
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="auth-modal-close-btn" 
              onClick={() => setShowSignupModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="auth-modal-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>

            <h2 id="signup-modal-title" className="auth-modal-title">Account Not Found</h2>
            <p className="auth-modal-desc">
              No account exists for <span className="auth-modal-highlight">{email}</span> in our records. Please sign up to create your account and access Workzen.
            </p>

            <div className="auth-modal-actions">
              <button 
                type="button" 
                className="auth-modal-btn-primary"
                onClick={() => {
                  setShowSignupModal(false);
                  navigate('/register', { state: { email } });
                }}
              >
                Sign Up Now
              </button>
              <button 
                type="button" 
                className="auth-modal-btn-secondary"
                onClick={() => setShowSignupModal(false)}
              >
                Try Another Email
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
