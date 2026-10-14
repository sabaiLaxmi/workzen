import React from 'react';
import { Link } from 'react-router-dom';
import './PublicFooter.css';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container footer-grid-container">
        {/* Column 1: Brand & Contact Info */}
        <div className="footer-col footer-col-brand">
          <Link to="/" className="footer-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="var(--ink)" strokeWidth="2"/>
              <path d="M12 6V12L16 16" stroke="var(--ochre)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="footer-brand-text">Workzen</span>
          </Link>
          <p className="footer-tagline">
            Every hour, accounted for. A modern timesheet and workforce operating system designed for remote and hybrid teams.
          </p>

          {/* Direct Contact Details */}
          <div className="footer-contact-details">
            <a href="mailto:support@workzen.io" className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>support@workzen.io</span>
            </a>
            <a href="tel:+18005559675" className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>+1 (800) 555-WORK</span>
            </a>
            <div className="footer-contact-item footer-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Innovation Hub, Tech City • Remote Worldwide</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="footer-social-links">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter / X" className="footer-social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="footer-social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Product & Features */}
        <div className="footer-col">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-list">
            <li><a href="/#features">Time Tracking</a></li>
            <li><a href="/#how-it-works">Approvals Queue</a></li>
            <li><a href="/#features">Real-time Analytics</a></li>
            <li><a href="/#roles">Role-based Access</a></li>
          </ul>
        </div>

        {/* Column 3: Solutions by Role */}
        <div className="footer-col">
          <h4 className="footer-heading">Solutions</h4>
          <ul className="footer-list">
            <li><a href="/#roles">For Employees</a></li>
            <li><a href="/#roles">For Managers</a></li>
            <li><a href="/#roles">For Administrators</a></li>
            <li><Link to="/register">Create an Account</Link></li>
          </ul>
        </div>

        {/* Column 4: Company & Legal */}
        <div className="footer-col">
          <h4 className="footer-heading">Company & Legal</h4>
          <ul className="footer-list">
            <li><Link to="/contact">Contact Support</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/login">Portal Login</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Release Version */}
      <div className="container footer-bottom">
        <div className="footer-bottom-left">
          &copy; {new Date().getFullYear()} Workzen Technologies. All rights reserved.
        </div>

        <div className="footer-bottom-right mono">
          v1.2.0 • Production Build
        </div>
      </div>
    </footer>
  );
}
