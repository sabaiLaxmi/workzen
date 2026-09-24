import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { submitTimesheet } from '../../api/timesheetApi';
import { useNavigate } from 'react-router-dom';
import '../admin/DashboardStyles.css';
import '../public/Auth.css';

export default function SubmitTimesheet() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ project: '', date: '', hours: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get('/api/projects'); // employee only gets assigned projects per backend
        setProjects(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, project: res.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitTimesheet({
        project: formData.project,
        date: formData.date,
        hours: Number(formData.hours),
        notes: formData.notes
      });
      navigate('/app/my-timesheets');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit timesheet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page" style={{ maxWidth: '600px', margin: '2rem auto 0', width: '100%' }}>
      <h2 className="dashboard-section-title" style={{ marginBottom: '2rem' }}>Log Hours</h2>
      
      <div className="panel" style={{ padding: '2rem' }}>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project</label>
            <select 
              className="form-input" 
              value={formData.project}
              onChange={e => setFormData({...formData, project: e.target.value})}
              required
            >
              {projects.length === 0 ? <option value="">No projects assigned</option> : null}
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Hours</label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="24"
                className="form-input" 
                value={formData.hours}
                onChange={e => setFormData({...formData, hours: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea 
              className="form-input" 
              rows="3"
              style={{ resize: 'vertical' }}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn-filled" disabled={loading || projects.length === 0} style={{ width: '100%' }}>
              {loading ? <div className="spinner"></div> : 'Submit Timesheet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
