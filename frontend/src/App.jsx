import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingBar from './components/common/LoadingBar'
import PublicNavbar from './components/layout/PublicNavbar'
import PublicFooter from './components/layout/PublicFooter'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/public/Home'
import PrivacyPolicy from './pages/public/PrivacyPolicy'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Dashboard from './pages/dashboard/Dashboard'
import ProjectList from './pages/projects/ProjectList'
import ProjectDetail from './pages/projects/ProjectDetail'
import SubmitTimesheet from './pages/employee/SubmitTimesheet'
import MyTimesheets from './pages/employee/MyTimesheets'
import ApprovalsQueue from './pages/manager/ApprovalsQueue'
import Reports from './pages/admin/Reports'
import Users from './pages/admin/Users'
import ActivityLog from './pages/admin/ActivityLog'
import './index.css'

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    window.dispatchEvent(new Event('api-request-start'));
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('api-request-end'));
    }, 400); // Simulate network latency for route change
    return () => clearTimeout(timer);
  }, [location.pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </>
  )
}

function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds on initial load
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return (
      <div style={{ 
        position: 'fixed', inset: 0, 
        backgroundColor: 'var(--paper)', 
        zIndex: 9999, 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', marginBottom: '2rem', color: 'var(--pine-deep)' }}>
          Welcome to Workzen
        </h1>
        <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px', borderColor: 'rgba(0,0,0,0.1)', borderTopColor: 'var(--pine)' }}></div>
      </div>
    );
  }

  return (
    <>
      <RouteTracker />
      <LoadingBar />
      <ErrorBoundary>
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Authenticated Internal App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="my-projects" element={<ProjectList />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="my-timesheets" element={<MyTimesheets />} />
            <Route path="submit-timesheet" element={<SubmitTimesheet />} />
            <Route path="approvals" element={<ApprovalsQueue />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="*" element={
              <div className="panel">
                <h2>Under Construction</h2>
                <p>This section is being built.</p>
              </div>
            } />
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  )
}

export default App
