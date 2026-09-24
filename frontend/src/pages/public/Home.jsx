import React from 'react';
import { Link } from 'react-router-dom';
import StrokeText from '../../components/ui/StrokeText';
import AgenticBallWatch from '../../components/ui/AgenticBallWatch';
import './Home.css';

export default function Home() {
  return (
    <main className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-headline" style={{ padding: 0, margin: '0 0 1rem 0' }}>
              <StrokeText
                text="Every hour, accounted for."
                strokeColor="var(--pine)"
                fillColor="var(--ink)"
                strokeWidth={1.5}
                drawDuration={1.5}
                fillDelay={0.2}
                stagger={0.05}
                ease="power2.out"
                trigger="mount"
                fillMode="wipe"
                fontSize={48}
                fontWeight={700}
                letterSpacing={-1}
              />
            </h1>
            <p className="hero-subheadline">
              Log hours effortlessly, review and approve timesheets in seconds, and get clear reporting across your entire workforce—all in one place.
            </p>
            
            <div className="hero-actions">
              <Link to="/register" className="btn-filled hero-cta">Get started</Link>
              <a href="#how-it-works" className="btn-ghost hero-cta">See how it works</a>
            </div>
          </div>
          
          <div className="hero-visual-wrapper">
            <AgenticBallWatch />
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header center features-header">
            <h2 className="section-title">Everything you need to manage time effortlessly</h2>
            <p className="section-subtitle">A full suite of tools designed to remove friction from your workday.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="feature-heading">Instant Time Tracking</h3>
              <p className="feature-text">Log hours in seconds from any device. Employees can submit timesheets without fighting clunky interfaces.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="feature-heading">Frictionless Approvals</h3>
              <p className="feature-text">Managers get a streamlined inbox. Approve, reject, or request changes with one simple click, ending the back-and-forth.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3 className="feature-heading">Real-time Analytics</h3>
              <p className="feature-text">See where the time goes. Dynamic reports and dashboards break down hours by project, team, or individual in real-time.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="feature-heading">Role-based Access</h3>
              <p className="feature-text">Tailored views ensure each team member only sees what they need. Employees, managers, and admins get dedicated portals.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3 className="feature-heading">Automated Reminders</h3>
              <p className="feature-text">Never miss a timesheet deadline. Automated nudges remind your team to log their hours on time, every week.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="feature-heading">Export & Payroll Ready</h3>
              <p className="feature-text">Seamlessly export approved timesheet data in formats ready for your payroll provider, minimizing manual entry errors.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">A connected workflow that respects everyone's time.</p>
          </div>
          
          <div className="timeline">
            <div className="timeline-step">
              <div className="step-number">1</div>
              <h4 className="step-title">Log work hours</h4>
              <p className="step-text">Employees quickly enter their time for the week, allocating to proper projects.</p>
            </div>
            <div className="timeline-step">
              <div className="step-number">2</div>
              <h4 className="step-title">Submit for approval</h4>
              <p className="step-text">Once finalized, the timesheet is sent securely to the manager's queue.</p>
            </div>
            <div className="timeline-step">
              <div className="step-number">3</div>
              <h4 className="step-title">Manager reviews</h4>
              <p className="step-text">Managers review, request edits if necessary, and approve with a single click.</p>
            </div>
            <div className="timeline-step">
              <div className="step-number">4</div>
              <h4 className="step-title">Reports & analytics</h4>
              <p className="step-text">Approved hours automatically feed into payroll-ready reports and dashboards.</p>
            </div>
          </div>
        </div>
      </section>
      {/* 4. ROLE-BASED CALLOUT */}
      <section className="roles-section">
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">Built for everyone</h2>
            <p className="section-subtitle">Tailored views ensure each team member only sees what they need.</p>
          </div>
          
          <div className="roles-grid">
            <div className="role-card">
              <h3 className="role-title">Employee</h3>
              <p className="role-text">A distraction-free interface to log time, categorize hours, and see approval statuses instantly.</p>
            </div>
            <div className="role-card">
              <h3 className="role-title">Manager</h3>
              <p className="role-text">A unified inbox to review, approve, or reject timesheets for their direct reports in seconds.</p>
            </div>
            <div className="role-card">
              <h3 className="role-title">Admin</h3>
              <p className="role-text">Total visibility across the organization. Manage users, oversee all timesheets, and export payroll-ready data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA BAND */}
      <section className="cta-band">
        <div className="container">
          <h2 className="cta-headline">Ready to regain your time?</h2>
          <Link to="/register" className="btn-filled cta-btn">Get started</Link>
        </div>
      </section>
    </main>
  );
}
