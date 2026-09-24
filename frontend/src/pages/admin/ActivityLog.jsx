import React, { useState, useEffect, useMemo } from 'react';
import { getActivityLog } from '../../api/reportApi';
import Skeleton from '../../components/common/Skeleton';
import { formatRelativeTime } from '../../utils/dateFormat';
import './DashboardStyles.css';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All'); // 'All', 'Approved', 'Rejected'

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getActivityLog(50);
        setLogs(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load activity logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const filteredLogs = useMemo(() => {
    if (filter === 'All') return logs;
    if (filter === 'Approved') return logs.filter(log => log.action === 'timesheet_approved');
    if (filter === 'Rejected') return logs.filter(log => log.action === 'timesheet_rejected');
    return logs;
  }, [logs, filter]);

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 2rem' }}>
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>Activity Log</h2>
        
        {/* Filter Segmented Control */}
        {!loading && !error && logs.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--paper-raised)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            {['All', 'Approved', 'Rejected'].map(f => (
              <button
                key={f}
                className={filter === f ? 'btn-filled' : 'btn-ghost'}
                style={{ 
                  padding: '0.4rem 1rem', 
                  fontSize: '0.85rem',
                  border: filter === f ? '1px solid transparent' : '1px solid transparent',
                  backgroundColor: filter === f ? 'var(--pine)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--ink-soft)'
                }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <div style={{ padding: '1.5rem', border: '1px solid var(--brick)', borderRadius: '4px', backgroundColor: 'rgba(193, 85, 77, 0.05)', color: 'var(--brick)' }}>
          <strong>Error: </strong> {error}
        </div>
      ) : (
        <div className="panel list-panel">
          {loading ? (
            <div className="skeleton-list">
              <Skeleton height="72px" />
              <Skeleton height="72px" />
              <Skeleton height="72px" />
              <Skeleton height="72px" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
              {logs.length === 0 
                ? "No activity yet. Approvals and rejections will show up here."
                : `No ${filter.toLowerCase()} activity found.`
              }
            </div>
          ) : (
            <div className="data-list">
              {filteredLogs.map(log => {
                const isApproved = log.action === 'timesheet_approved';
                const pillClass = isApproved ? 'pill-sage' : 'pill-brick';
                const pillText = isApproved ? 'Approved' : 'Rejected';
                
                return (
                  <div key={log._id} className="hairline-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'var(--line)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center',
                        fontWeight: '600', color: 'var(--ink-soft)', fontSize: '0.9rem',
                        flexShrink: 0
                      }}>
                        {getInitials(log.userId?.name)}
                      </div>
                      <div className="row-info" style={{ flex: 1 }}>
                        <strong className="row-title">
                          {log.userId?.name || 'Unknown User'} 
                          <span style={{ fontWeight: '400', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                            {' '}• {log.userId?.role || 'employee'}
                          </span>
                        </strong>
                        <span className="text-muted">{log.details}</span>
                      </div>
                    </div>
                    <div className="row-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                      <span className={`pill ${pillClass}`}>{pillText}</span>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>{formatRelativeTime(log.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
