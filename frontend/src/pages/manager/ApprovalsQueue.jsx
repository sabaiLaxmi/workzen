import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import '../admin/DashboardStyles.css';

const REJECTION_PRESETS = [
  'Hours miscalculated / mismatch',
  'Incorrect project selected',
  'Overtime / extra hours not pre-approved',
  'Insufficient task description / detail',
];

export default function ApprovalsQueue() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Rejection Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const [rejectError, setRejectError] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const fetchTimesheets = async () => {
    try {
      const res = await axiosInstance.get('/api/timesheets');
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

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/approvals/${id}/approve`);
      setTimesheets(prev => prev.filter(ts => ts._id !== id));
      showToast('Timesheet approved successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve timesheet.');
    }
  };

  const openRejectModal = (ts) => {
    setSelectedTimesheet(ts);
    setRejectionReason('');
    setRejectError('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setRejectError('Please provide a reason for rejection so the employee knows what to fix.');
      return;
    }

    setRejectSubmitting(true);
    setRejectError('');

    try {
      await axiosInstance.put(`/api/approvals/${selectedTimesheet._id}/reject`, {
        reason: rejectionReason.trim(),
      });
      setTimesheets(prev => prev.filter(ts => ts._id !== selectedTimesheet._id));
      setRejectModalOpen(false);
      showToast('Timesheet rejected and feedback sent to employee');
    } catch (err) {
      setRejectError(err.response?.data?.message || 'Failed to reject timesheet.');
    } finally {
      setRejectSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 2rem' }}>
        <div>
          <h2 className="dashboard-section-title" style={{ margin: 0 }}>Approvals Queue</h2>
          <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
            Review, approve, or reject logged hours submitted by your team members.
          </p>
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          backgroundColor: 'var(--pine)', color: '#fff',
          padding: '0.85rem 1.4rem', borderRadius: '6px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)', zIndex: 2000,
          fontWeight: 500, fontSize: '0.95rem',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      <div className="panel list-panel">
        {loading ? (
          <div className="skeleton-list">
            <Skeleton height="72px" />
            <Skeleton height="72px" />
            <Skeleton height="72px" />
          </div>
        ) : timesheets.length === 0 ? (
          <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--ink)' }}>All caught up!</strong>
            No pending timesheets require your review right now.
          </div>
        ) : (
          <div className="data-list">
            {timesheets.map(ts => (
              <div key={ts._id} className="hairline-row approval-row" style={{ padding: '1rem 0' }}>
                <div className="row-info" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <strong className="row-title" style={{ fontSize: '1.05rem' }}>{ts.user?.name || 'Unknown User'}</strong>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>({ts.user?.email})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className="mono" style={{ color: 'var(--pine)', fontWeight: 600 }}>{ts.hours} hrs</span>
                    <span className="text-muted">•</span>
                    <span style={{ fontWeight: 500 }}>{ts.project?.name || 'Unknown Project'}</span>
                    <span className="text-muted">•</span>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {new Date(ts.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {ts.notes && (
                    <div className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.88rem', backgroundColor: 'var(--paper-raised)', padding: '0.35rem 0.65rem', borderRadius: '4px', display: 'inline-block', maxWidth: '600px' }}>
                      "{ts.notes}"
                    </div>
                  )}
                </div>
                <div className="row-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button 
                    className="btn-ghost small" 
                    onClick={() => openRejectModal(ts)} 
                    style={{ color: 'var(--brick)', borderColor: 'rgba(177, 92, 74, 0.4)' }}
                  >
                    Reject
                  </button>
                  <button 
                    className="btn-filled small" 
                    onClick={() => handleApprove(ts._id)}
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Timesheet">
        {selectedTimesheet && (
          <form onSubmit={handleConfirmReject}>
            {/* Timesheet Summary Card */}
            <div style={{ 
              backgroundColor: 'var(--paper-raised)', 
              padding: '0.85rem 1rem', 
              borderRadius: '6px', 
              marginBottom: '1.25rem',
              fontSize: '0.9rem',
              border: '1px solid var(--line)'
            }}>
              <div><strong>Employee:</strong> {selectedTimesheet.user?.name} ({selectedTimesheet.user?.email})</div>
              <div><strong>Project:</strong> {selectedTimesheet.project?.name} • <strong>Hours:</strong> {selectedTimesheet.hours} hrs</div>
              <div><strong>Date:</strong> {new Date(selectedTimesheet.date).toLocaleDateString()}</div>
              {selectedTimesheet.notes && (
                <div style={{ marginTop: '0.25rem', fontStyle: 'italic', color: 'var(--ink-soft)' }}>
                  <strong>Description:</strong> "{selectedTimesheet.notes}"
                </div>
              )}
            </div>

            {/* Quick Reason Chips */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                Quick Selection (click to insert):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {REJECTION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionReason(preset)}
                    style={{
                      background: rejectionReason === preset ? 'var(--pine)' : 'transparent',
                      color: rejectionReason === preset ? '#fff' : 'var(--ink)',
                      border: '1px solid var(--line)',
                      borderRadius: '16px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea for Custom Feedback */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="rejectionReason" className="form-label" style={{ fontWeight: 600 }}>
                Rejection Reason / Feedback <span style={{ color: 'var(--brick)' }}>*</span>
              </label>
              <textarea
                id="rejectionReason"
                rows="3"
                className="form-input"
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Explain to the employee why this timesheet cannot be approved..."
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setRejectError('');
                }}
                required
              />
              <span className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                This message will be visible to the employee so they can correct and resubmit.
              </span>
            </div>

            {rejectError && (
              <div style={{ color: 'var(--brick)', fontSize: '0.88rem', marginBottom: '1rem', fontWeight: 500 }}>
                {rejectError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setRejectModalOpen(false)}
                disabled={rejectSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-filled"
                style={{ backgroundColor: 'var(--brick)', borderColor: 'var(--brick)' }}
                disabled={rejectSubmitting}
              >
                {rejectSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
