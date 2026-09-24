import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Skeleton from '../../components/common/Skeleton';
import '../admin/DashboardStyles.css';

export default function ApprovalsQueue() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimesheets = async () => {
    try {
      const res = await axiosInstance.get('/api/timesheets'); // Backend returns timesheets to approve
      setTimesheets(res.data.filter(ts => ts.status === 'pending'));
    } catch (err) {
      console.error('Failed to fetch approvals queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await axiosInstance.put(`/api/approvals/${id}/approve`);
      } else {
        const notes = prompt('Reason for rejection:');
        if (!notes) return;
        await axiosInstance.put(`/api/approvals/${id}/reject`, { notes });
      }
      setTimesheets(prev => prev.filter(ts => ts._id !== id));
    } catch (err) {
      alert('Failed to process timesheet.');
    }
  };

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 2rem' }}>
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>Approvals Queue</h2>
      </div>

      <div className="panel list-panel">
        {loading ? (
          <div className="skeleton-list">
            <Skeleton height="72px" />
            <Skeleton height="72px" />
            <Skeleton height="72px" />
          </div>
        ) : timesheets.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
            No pending timesheets require your review.
          </div>
        ) : (
          <div className="data-list">
            {timesheets.map(ts => (
              <div key={ts._id} className="hairline-row approval-row">
                <div className="row-info">
                  <strong className="row-title">{ts.user?.name || 'Unknown User'}</strong>
                  <span className="mono text-muted">{ts.hours} hrs • {ts.project?.name || 'Unknown Project'}</span>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>{new Date(ts.date).toLocaleDateString()}</span>
                  {ts.notes && <span className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>"{ts.notes}"</span>}
                </div>
                <div className="row-actions">
                  <button className="btn-ghost small" onClick={() => handleAction(ts._id, 'reject')} style={{ color: 'var(--brick)' }}>Reject</button>
                  <button className="btn-filled small" onClick={() => handleAction(ts._id, 'approve')}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
