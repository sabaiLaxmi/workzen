import React from 'react';
import { Link } from 'react-router-dom';
import './PublicFooter.css';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="var(--ink)" strokeWidth="2"/>
              <path d="M12 6V12L16 16" stroke="var(--ochre)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="footer-brand-text">Workzen</span>
          </Link>
          <p className="footer-tagline">Every hour, accounted for.</p>
        </div>
        
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Workzen. All rights reserved.</p>
      </div>
    </footer>
  );
}
