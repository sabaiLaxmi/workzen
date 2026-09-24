import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import './AppShell.css';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return null; // Wait until auth state is resolved

  // Redirect to login if unauthenticated
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
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
