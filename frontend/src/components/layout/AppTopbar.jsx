import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AppTopbar({ user, onMenuToggle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  // Basic title extraction from path for the shell (e.g., /app/my-timesheets -> My Timesheets)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const titleRaw = pathParts[pathParts.length - 1] || 'Dashboard';
  const pageTitle = titleRaw.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="app-topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Menu" style={{ background: 'transparent', border: 'none', color: 'var(--ink)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>
      
      <div className="topbar-right">
        <div className="current-date mono">{currentDate}</div>
        
        <div className="user-menu-wrapper">
          <button className="user-profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{user?.role || 'Employee'}</span>
            </div>
          </button>
          
          {dropdownOpen && (
            <div className="user-dropdown">
              <button className="dropdown-item">Profile</button>
              <button className="dropdown-item text-brick" onClick={logout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
