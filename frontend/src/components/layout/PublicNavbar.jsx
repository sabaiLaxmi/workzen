import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PublicNavbar.css';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`public-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="brand">
          <svg className="aesthetic-logo" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="15 45" className="logo-ring" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.15"/>
            <circle cx="12" cy="12" r="2" fill="var(--ochre)"/>
            <path d="M12 7V12L15 15" stroke="var(--ochre)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-hands"/>
          </svg>
          <span className="brand-text">Workzen</span>
        </Link>
        
        <nav className="nav-links">
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#how-it-works" className="nav-link">How it works</a>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn-ghost">Log in</Link>
          <Link to="/register" className="btn-filled">Get started</Link>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : 'closed'}`}>
        <a href="/#features" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="/#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>How it works</a>
        <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--ochre)' }}>Log in</Link>
        <Link to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--pine)' }}>Get started</Link>
      </div>
    </header>
  );
}
