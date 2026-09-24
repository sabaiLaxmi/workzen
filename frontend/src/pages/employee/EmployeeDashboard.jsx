import React, { useState, useEffect } from 'react';
import OverviewBand from '../../components/dashboard/OverviewBand';
import Skeleton from '../../components/common/Skeleton';
import '../admin/DashboardStyles.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({ pending: 0, approved: 0, totalApprovedHours: 0 });
  const [myProjects, setMyProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, projectsRes] = await Promise.all([
          axiosInstance.get('/api/dashboard'),
          axiosInstance.get('/api/projects')
        ]);
        
        if (statsRes.data) {
          setDashboardStats(statsRes.data);
        }
        
        if (projectsRes.data) {
          setMyProjects(projectsRes.data);
        }
      } catch (err) {
        console.error("Error fetching employee dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { value: `${dashboardStats.totalApprovedHours}h`, label: 'Approved Hours' },
    { value: `${dashboardStats.pending}`, label: 'Pending Timesheets' },
    { value: `${myProjects.length}`, label: 'Active Projects' },
  ];

  return (
    <div className="dashboard-page">
      <OverviewBand 
        ringPercentage={Math.min(100, Math.round((dashboardStats.totalApprovedHours / 40) * 100)) || 0} 
        ringCenterText={`${dashboardStats.totalApprovedHours} / 40 hrs`} 
        stats={stats} 
        loading={loading} 
      />

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <h2 className="dashboard-section-title">My Projects</h2>
          <div className="panel list-panel">
            {loading ? (
              <div className="skeleton-list">
                <Skeleton height="72px" />
                <Skeleton height="72px" />
              </div>
            ) : (
              <div className="data-list">
                {myProjects.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                    No projects assigned to you yet.
                  </div>
                ) : (
                  myProjects.map(proj => (
                    <div key={proj._id} className="hairline-row project-row">
                      <div className="row-info">
                        <strong className="row-title">{proj.name}</strong>
                        <span className="text-muted">Manager: {proj.manager?.name || 'Unassigned'}</span>
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

        <div className="dashboard-column">
          <h2 className="dashboard-section-title">Quick Actions</h2>
          <div className="panel list-panel">
            {loading ? (
              <div className="skeleton-list">
                <Skeleton height="150px" />
              </div>
            ) : (
              <div className="quick-action-box">
                <p className="text-muted">Ready to wrap up for the day?</p>
                <button className="btn-filled action-btn" onClick={() => navigate('/app/submit-timesheet')}>Submit today's hours</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
