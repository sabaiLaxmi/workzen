import React, { useState, useEffect } from 'react';
import { getMyTimesheets, updateTimesheet, deleteTimesheet } from '../../api/timesheetApi';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import '../admin/DashboardStyles.css';

export default function MyTimesheets() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  
  const [editData, setEditData] = useState({ hours: '', notes: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  
  const [toast, setToast] = useState('');

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyTimesheets();
      // Sort newest date first
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTimesheets(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch timesheets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'var(--sage)';
      case 'rejected': return 'var(--brick)';
      default: return 'var(--ochre)'; // pending
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const openEditModal = (ts) => {
    setSelectedTimesheet(ts);
    setEditData({ hours: ts.hours, notes: ts.notes || '' });
    setActionError('');
    setEditModalOpen(true);
  };

  const openDeleteModal = (ts) => {
    setSelectedTimesheet(ts);
    setActionError('');
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError('');
    try {
      await updateTimesheet(selectedTimesheet._id, {
        hours: Number(editData.hours),
        notes: editData.notes
      });
      setEditModalOpen(false);
      showToast('Timesheet updated successfully');
      fetchTimesheets();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update timesheet');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await deleteTimesheet(selectedTimesheet._id);
      setDeleteModalOpen(false);
      showToast('Timesheet deleted');
      // Update local state without refetching for speed, or refetch. We will refetch to be safe.
      fetchTimesheets();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete timesheet');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 2rem' }}>
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>My Timesheets</h2>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', 
          backgroundColor: 'var(--pine)', color: '#fff', 
          padding: '1rem 1.5rem', borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000,
          fontWeight: 500
        }}>
          {toast}
        </div>
      )}

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
            </div>
          ) : timesheets.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
              No timesheets yet. Log your first hours above.
            </div>
          ) : (
            <div className="data-list">
              {timesheets.map(ts => (
                <div key={ts._id} className="hairline-row">
                  <div className="row-info" style={{ flex: 1 }}>
                    <strong className="row-title">{ts.project?.name || 'Unknown Project'}</strong>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {new Date(ts.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span style={{ fontFamily: '"IBM Plex Mono", monospace', color: 'var(--pine)', fontWeight: 500 }}>
                        {ts.hours} hrs
                      </span>
                    </div>
                    {ts.notes && (
                      <div className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.85rem', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                        "{ts.notes}"
                      </div>
                    )}
                  </div>
                  <div className="row-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {ts.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }} onClick={() => openEditModal(ts)}>
                          Edit
                        </button>
                        <button className="btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', color: 'var(--brick)', borderColor: 'transparent' }} onClick={() => openDeleteModal(ts)}>
                          Delete
                        </button>
                      </div>
                    )}
                    <div 
                      className="status-pill" 
                      style={{ 
                        backgroundColor: `${getStatusColor(ts.status)}1A`,
                        color: getStatusColor(ts.status),
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                      }}
                    >
                      {ts.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Timesheet">
        <form onSubmit={handleEditSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Project (Not Editable)</label>
            <input type="text" className="form-input" value={selectedTimesheet?.project?.name || ''} disabled />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Date (Not Editable)</label>
            <input type="text" className="form-input" value={selectedTimesheet ? new Date(selectedTimesheet.date).toLocaleDateString() : ''} disabled />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Hours</label>
            <input 
              type="number" 
              step="0.1" min="0" max="24" 
              className="form-input" 
              value={editData.hours} 
              onChange={e => setEditData({...editData, hours: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Notes</label>
            <textarea 
              className="form-input" 
              rows="3" 
              value={editData.notes} 
              onChange={e => setEditData({...editData, notes: e.target.value})} 
            />
          </div>
          {actionError && <div className="form-error" style={{ marginBottom: '1rem' }}>{actionError}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn-ghost" onClick={() => setEditModalOpen(false)} disabled={actionLoading}>Cancel</button>
            <button type="submit" className="btn-filled" disabled={actionLoading} style={{ minWidth: '100px' }}>
              {actionLoading ? <div className="spinner" style={{ width: '16px', height: '16px' }}></div> : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Timesheet">
        <p style={{ margin: '0 0 1.5rem', color: 'var(--ink)' }}>
          Are you sure you want to delete this timesheet? This action cannot be undone.
        </p>
        {actionError && <div className="form-error" style={{ marginBottom: '1rem' }}>{actionError}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" className="btn-ghost" onClick={() => setDeleteModalOpen(false)} disabled={actionLoading}>Cancel</button>
          <button type="button" className="btn-filled" style={{ backgroundColor: 'var(--brick)' }} onClick={handleDeleteSubmit} disabled={actionLoading}>
            {actionLoading ? <div className="spinner" style={{ width: '16px', height: '16px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div> : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
