import React from 'react';
import { NavLink } from 'react-router-dom';

const ROLE_NAV = {
  admin: [
    { name: 'Dashboard', path: '/app/dashboard' },
    { name: 'Projects', path: '/app/projects' },
    { name: 'Users', path: '/app/users' },
    { name: 'Reports', path: '/app/reports' },
    { name: 'Activity Log', path: '/app/activity' },
  ],
  manager: [
    { name: 'Dashboard', path: '/app/dashboard' },
    { name: 'Projects', path: '/app/projects' },
    { name: 'Approvals', path: '/app/approvals' },
    { name: 'Reports', path: '/app/reports' },
  ],
  employee: [
    { name: 'Dashboard', path: '/app/dashboard' },
    { name: 'My Projects', path: '/app/my-projects' },
    { name: 'My Timesheets', path: '/app/my-timesheets' },
  ]
};

export default function AppSidebar({ userRole, isOpen, onClose }) {
  const links = ROLE_NAV[userRole] || ROLE_NAV.employee; // default fallback
  
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
        <svg className="aesthetic-logo" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <circle cx="12" cy="12" r="10" stroke="var(--paper)" strokeWidth="2" strokeDasharray="15 45" className="logo-ring" strokeLinecap="round"/>
           <circle cx="12" cy="12" r="10" stroke="var(--paper)" strokeWidth="2" opacity="0.15"/>
           <circle cx="12" cy="12" r="2" fill="var(--ochre)"/>
           <path d="M12 7V12L15 15" stroke="var(--ochre)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-hands"/>
        </svg>
        <span className="sidebar-brand-text">Workzen</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink 
            key={link.name} 
            to={link.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  );
}
