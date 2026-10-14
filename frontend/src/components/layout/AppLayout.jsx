import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import './AppShell.css';

export default function AppLayout() {
  const { user, loading, roleChangeToast, setRoleChangeToast } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return null; // Wait until auth state is resolved

  // Redirect to login if unauthenticated
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      {roleChangeToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          backgroundColor: 'var(--pine)',
          color: '#fff',
          padding: '0.9rem 1.4rem',
          borderRadius: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: 500,
          fontSize: '0.95rem'
        }}>
          <span style={{ fontSize: '1.25rem' }}>✨</span>
          <span>{roleChangeToast}</span>
          <button
            onClick={() => setRoleChangeToast('')}
            aria-label="Dismiss"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1.3rem',
              lineHeight: 1,
              marginLeft: '0.5rem',
              padding: '0 0.25rem'
            }}
          >
            &times;
          </button>
        </div>
      )}
      <AppSidebar userRole={user.role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <AppTopbar user={user} onMenuToggle={() => setSidebarOpen(true)} />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
