import React, { useState, useEffect } from 'react';
import OverviewBand from '../../components/dashboard/OverviewBand';
import Skeleton from '../../components/common/Skeleton';
import axiosInstance from '../../api/axiosInstance';
import '../admin/DashboardStyles.css';

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ managedProjects: 0, pendingTimesheets: 0, teamMembers: 0 });
  const [teamMembers, setTeamMembers] = useState([]);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/approvals/${id}/approve`);
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    } catch (error) {
      console.error("Error approving timesheet", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/api/approvals/${id}/reject`, { notes: "Rejected by manager" });
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    } catch (error) {
      console.error("Error rejecting timesheet", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, reviewsRes, projectsRes] = await Promise.all([
          axiosInstance.get('/api/dashboard'),
          axiosInstance.get('/api/timesheets'),
          axiosInstance.get('/api/projects')
        ]);
        
        let uniqueTeam = new Map();
        
        if (projectsRes.data) {
          projectsRes.data.forEach(proj => {
            if (proj.assignedEmployees) {
              proj.assignedEmployees.forEach(emp => {
                if (!uniqueTeam.has(emp._id)) {
                  uniqueTeam.set(emp._id, { id: emp._id, name: emp.name, role: emp.role || 'Employee', logged: 0, target: 40 });
                }
              });
            }
          });
        }
        
        if (reviewsRes.data) {
          const timesheets = reviewsRes.data.map(ts => ({
            id: ts._id,
            name: ts.user ? ts.user.name : 'Unknown',
            userId: ts.user ? ts.user._id : null,
            hrs: ts.hours,
            proj: ts.project ? ts.project.name : 'Unknown Project',
            date: new Date(ts.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            status: ts.status
          }));
          setReviews(timesheets);
          
          // Calculate logged hours
          timesheets.forEach(ts => {
            if (ts.status === 'approved' && ts.userId && uniqueTeam.has(ts.userId)) {
              const emp = uniqueTeam.get(ts.userId);
              emp.logged += ts.hrs;
            }
          });
        }
        
        const teamArray = Array.from(uniqueTeam.values());
        setTeamMembers(teamArray);
        
        if (statsRes.data) {
          setDashboardStats({
            managedProjects: statsRes.data.managedProjects || 0,
            pendingTimesheets: statsRes.data.pendingTimesheets || 0,
            teamMembers: teamArray.length
          });
        }
      } catch (error) {
        console.error("Error fetching manager data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { value: dashboardStats.managedProjects.toString(), label: 'Active Projects' },
    { value: reviews.filter(r => r.status === 'pending').length.toString(), label: 'Pending Approvals' },
    { value: dashboardStats.teamMembers.toString(), label: 'Team Members' },
    { value: '92%', label: 'On-time Rate' }
  ];

  return (
    <div className="dashboard-page">
      <OverviewBand 
        ringPercentage={88} 
        ringCenterText="142 / 160 hrs" 
        stats={stats} 
        loading={loading} 
      />

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <h2 className="dashboard-section-title">Waiting on your review</h2>
          <div className="panel list-panel">
            {loading ? (
              <div className="skeleton-list">
                <Skeleton height="72px" />
                <Skeleton height="72px" />
                <Skeleton height="72px" />
              </div>
            ) : (
              <div className="data-list">
                {reviews.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                    No pending reviews at the moment.
                  </div>
                ) : (
                  reviews.map((item) => (
                    <div key={item.id} className="hairline-row approval-row">
                      <div className="row-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>{item.name.charAt(0)}</div>
                        <div>
                          <strong className="row-title" style={{ display: 'block' }}>{item.name}</strong>
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>{item.proj} • {item.date}</span>
                        </div>
                      </div>
                      <div className="row-actions" style={{ alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                          <span className="mono">{item.hrs} hrs</span>
                          {item.status === 'pending' && <span className="pill pill-pending">Pending</span>}
                          {item.status === 'approved' && <span className="pill pill-pine">Approved</span>}
                          {item.status === 'rejected' && <span className="pill pill-brick">Rejected</span>}
                        </div>
                        {item.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-ghost small" onClick={() => handleReject(item.id)}>Reject</button>
                            <button className="btn-filled small" onClick={() => handleApprove(item.id)}>Approve</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-column">
          <h2 className="dashboard-section-title">Team this week</h2>
          <div className="panel" style={{ padding: '1.5rem', background: 'transparent', border: 'none' }}>
            {loading ? (
               <div className="skeleton-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                <Skeleton height="100px" />
                <Skeleton height="100px" />
                <Skeleton height="100px" />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                 {teamMembers.length === 0 ? (
                   <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                     No team members found. Assign employees to your projects.
                   </div>
                 ) : (
                   teamMembers.map((member) => {
                     const pct = Math.min(100, Math.round((member.logged / member.target) * 100));
                     return (
                       <div key={member.id} className="panel" style={{ padding: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                         <div>
                           <strong style={{ display: 'block', fontSize: '1.1rem' }}>{member.name}</strong>
                           <span className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{member.role}</span>
                         </div>
                         <div className="progress-bar-container" style={{ height: '6px', backgroundColor: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                           <div className="progress-bar-fill" style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--pine)' }}></div>
                         </div>
                         <div className="mono" style={{ fontSize: '0.95rem' }}>
                           {member.logged} / {member.target} hrs
                         </div>
                       </div>
                     );
                   })
                 )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
