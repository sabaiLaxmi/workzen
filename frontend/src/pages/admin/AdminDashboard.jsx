import React, { useState, useEffect } from 'react';
import OverviewBand from '../../components/dashboard/OverviewBand';
import Skeleton from '../../components/common/Skeleton';
import './DashboardStyles.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ totalProjects: 0, pendingApprovals: 0, totalEmployees: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, projectsRes, timesheetsRes] = await Promise.all([
          axiosInstance.get('/api/dashboard'),
          axiosInstance.get('/api/projects'),
          axiosInstance.get('/api/timesheets')
        ]);
        
        if (statsRes.data) {
          setDashboardStats({
            totalProjects: statsRes.data.totalProjects || 0,
            pendingApprovals: statsRes.data.pendingTimesheets || 0,
            totalEmployees: statsRes.data.totalUsers || 0,
          });
        }
        
        if (projectsRes.data) {
          setProjects(projectsRes.data);
        }
        
        if (timesheetsRes.data) {
          const sorted = timesheetsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setActivities(sorted.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const stats = [
    { value: dashboardStats.totalProjects.toString(), label: 'Total Projects' },
    { value: dashboardStats.pendingApprovals.toString(), label: 'Pending Approvals' },
    { value: dashboardStats.totalEmployees.toString(), label: 'Total Users' },
    { value: '96%', label: 'On-time Rate' }
  ];

  return (
    <div className="dashboard-page">
      <OverviewBand 
        ringPercentage={85} 
        ringCenterText="342 / 400 hrs" 
        stats={stats} 
        loading={loading} 
      />

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <h2 className="dashboard-section-title">Recent Activity</h2>
          <div className="panel list-panel">
            {loading ? (
              <div className="skeleton-list">
                <Skeleton height="72px" />
                <Skeleton height="72px" />
              </div>
            ) : (
              <div className="data-list">
                {activities.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>No recent activity.</div>
                ) : (
                  activities.map(act => (
                    <div key={act._id} className="hairline-row">
                      <div className="row-info">
                        <strong className="row-title">{act.user?.name || 'Unknown User'}</strong>
                        <span className="text-muted">{act.project?.name || 'Unknown Project'} timesheet</span>
                      </div>
                      <div className="row-actions text-right" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                        <span className={`pill ${act.status === 'approved' ? 'pill-sage' : act.status === 'rejected' ? 'pill-brick' : 'pill-pending'}`} style={{ textTransform: 'capitalize' }}>
                          {act.status}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {new Date(act.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <h2 className="dashboard-section-title" style={{ marginTop: '1.5rem' }}>Quick Actions</h2>
          <div className="panel list-panel">
            {loading ? (
              <div className="skeleton-list">
                <Skeleton height="100px" />
              </div>
            ) : (
              <div className="quick-action-box" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <button className="btn-filled action-btn" onClick={() => navigate('/app/projects')}>Create project</button>
                <button className="btn-ghost action-btn" onClick={() => navigate('/app/users')}>Add user</button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-column">
          <h2 className="dashboard-section-title">All Projects</h2>
          <div className="panel list-panel">
            {loading ? (
              <div className="skeleton-list">
                <Skeleton height="72px" />
                <Skeleton height="72px" />
                <Skeleton height="72px" />
              </div>
            ) : (
              <div className="data-list">
                {projects.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>No projects found.</div>
                ) : (
                  projects.map((proj) => (
                    <div key={proj._id} className="hairline-row project-row">
                      <div className="row-info">
                        <strong className="row-title">{proj.name}</strong>
                        <span className="text-muted">Manager: {proj.manager?.name || 'Unassigned'} • Team: {proj.assignedEmployees?.length || 0}</span>
                      </div>
                      <div className="row-actions">
                        <span className={`pill ${proj.status === 'active' ? 'pill-pine' : proj.status === 'completed' ? 'pill-sage' : 'pill-slate'}`} style={{ textTransform: 'capitalize' }}>
                          {proj.status || 'active'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
