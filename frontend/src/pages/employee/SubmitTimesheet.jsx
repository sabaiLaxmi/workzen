import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { submitTimesheet } from '../../api/timesheetApi';
import { useNavigate, Link } from 'react-router-dom';
import Skeleton from '../../components/common/Skeleton';
import '../admin/DashboardStyles.css';
import '../public/Auth.css';

export default function SubmitTimesheet() {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project: '',
    date: getTodayDate(),
    hours: '',
    notes: '',
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setInitialLoading(true);
        const res = await axiosInstance.get('/api/projects'); // employee only gets assigned projects per backend
        setProjects(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            project: res.data[0]._id,
            date: prev.date || getTodayDate(),
          }));
        }
      } catch (err) {
        console.error('Failed to load projects', err);
        setError('Failed to load your assigned projects. Please refresh or try again later.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project) {
      setError('Please select a project.');
      return;
    }

    if (!formData.hours || Number(formData.hours) <= 0) {
      setError('Please enter a valid number of hours (greater than 0).');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await submitTimesheet({
        project: formData.project,
        date: formData.date,
        hours: Number(formData.hours),
        notes: formData.notes.trim(),
      });
      navigate('/app/my-timesheets', {
        state: { message: 'Timesheet submitted successfully and sent for manager review!' },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit timesheet. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page" style={{ maxWidth: '640px', margin: '1.5rem auto 0', width: '100%' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>Log Hours</h2>
        <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
          Record your daily work hours and allocate them to your assigned project.
        </p>
      </div>

      <div className="panel" style={{ padding: '2rem' }}>
        {initialLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Skeleton height="45px" />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Skeleton height="45px" width="50%" />
              <Skeleton height="45px" width="50%" />
            </div>
            <Skeleton height="85px" />
            <Skeleton height="45px" />
          </div>
        ) : projects.length === 0 ? (
          /* Friendly Empty State for Unassigned Employees */
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(201, 138, 62, 0.15)',
              color: 'var(--ochre)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
            </div>

            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.45rem', margin: '0 0 0.5rem', color: 'var(--ink)' }}>
              No Projects Assigned Yet
            </h3>
            
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: '1.55', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
              You are not currently assigned to any active project. In Workzen, timesheets can only be logged for projects you have been added to by a Manager or Administrator.
            </p>

            {/* Informative Guidance Card */}
            <div style={{
              backgroundColor: 'var(--paper-raised)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '2rem',
              fontSize: '0.9rem',
            }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--ochre)' }}>💡</span>
                <span>How to get started:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
                <li>Contact your <strong>Project Manager</strong> or <strong>Administrator</strong> and request to be assigned to your team's project.</li>
                <li>As soon as your manager adds you to a project, it will automatically appear here.</li>
                <li>You'll then be able to log daily hours, track approvals, and view your timesheet history.</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn-filled" 
                onClick={() => navigate('/app/dashboard')}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Go to Dashboard
              </button>
              <button 
                type="button" 
                className="btn-ghost" 
                onClick={() => navigate('/app/my-timesheets')}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                View Timesheets History
              </button>
            </div>
          </div>
        ) : (
          /* Active Timesheet Submission Form */
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="project" className="form-label" style={{ fontWeight: 600 }}>Project</label>
              <select 
                id="project"
                className="form-input" 
                value={formData.project}
                onChange={e => {
                  setFormData({ ...formData, project: e.target.value });
                  setError('');
                }}
                disabled={submitting}
                required
              >
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label htmlFor="date" className="form-label" style={{ fontWeight: 600 }}>Date</label>
                <input 
                  type="date" 
                  id="date"
                  className="form-input" 
                  value={formData.date}
                  onChange={e => {
                    setFormData({ ...formData, date: e.target.value });
                    setError('');
                  }}
                  disabled={submitting}
                  required
                />
              </div>
              
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label htmlFor="hours" className="form-label" style={{ fontWeight: 600 }}>Hours Worked</label>
                <input 
                  type="number" 
                  id="hours"
                  step="0.5"
                  min="0.5"
                  max="24"
                  placeholder="e.g. 8"
                  className="form-input" 
                  value={formData.hours}
                  onChange={e => {
                    setFormData({ ...formData, hours: e.target.value });
                    setError('');
                  }}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label" style={{ fontWeight: 600 }}>Work Description / Notes (Optional)</label>
              <textarea 
                id="notes"
                className="form-input" 
                rows="3"
                style={{ resize: 'vertical' }}
                placeholder="Briefly describe what you worked on..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                disabled={submitting}
              />
            </div>

            {error && (
              <div className="form-error" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="btn-filled auth-submit" 
                disabled={submitting} 
                style={{ width: '100%', minHeight: '48px' }}
              >
                {submitting ? <div className="spinner"></div> : 'Submit Timesheet'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
