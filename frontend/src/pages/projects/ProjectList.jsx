import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../../api/projectApi';
import { useAuth } from '../../hooks/useAuth';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import '../admin/DashboardStyles.css';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    try {
      await createProject(formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent row click if any
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete project.');
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 2rem' }}>
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>Projects</h2>
        {canManage && (
          <button className="btn-filled" onClick={() => setIsModalOpen(true)}>Create Project</button>
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
            </div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
              No projects found.
            </div>
          ) : (
            <div className="data-list">
              {projects.map(project => {
                const statusPillClass = project.status === 'active' ? 'pill-pine' : project.status === 'completed' ? 'pill-sage' : 'pill-slate';
                // Only admin can delete any, manager can delete if they own it
                const canEditDelete = user?.role === 'admin' || (user?.role === 'manager' && project.manager?._id === user?._id);

                return (
                  <div key={project._id} className="hairline-row project-row" style={{ cursor: canManage ? 'pointer' : 'default' }} onClick={() => canManage && navigate(`/app/projects/${project._id}`)}>
                    <div className="row-info" style={{ flex: 1 }}>
                      <strong className="row-title">{project.name}</strong>
                      <span className="text-muted">
                        Manager: {project.manager?.name || 'Unknown'} • Team: {project.assignedEmployees?.length || 0}
                      </span>
                    </div>
                    <div className="row-actions" style={{ gap: '1.5rem' }}>
                      <span className={`pill ${statusPillClass}`}>{project.status}</span>
                      {canEditDelete && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-ghost small" onClick={(e) => { e.stopPropagation(); navigate(`/app/projects/${project._id}`); }}>Edit</button>
                          <button className="btn-ghost small" style={{ color: 'var(--brick)', borderColor: 'transparent' }} onClick={(e) => handleDelete(project._id, e)}>Delete</button>
                        </div>
                      )}
                      {!canManage && (
                        <span className="mono">Assigned</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => !formSubmitting && setIsModalOpen(false)} title="New Project">
        <form onSubmit={handleCreateProject} className="auth-form" style={{ maxWidth: 'none', margin: 0, padding: 0 }}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.name}
              onChange={e => { setFormData({...formData, name: e.target.value}); setFormError(''); }}
              required
              disabled={formSubmitting}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              disabled={formSubmitting}
              style={{ resize: 'vertical' }}
            />
          </div>
          
          {formError && <div className="form-error">{formError}</div>}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)} disabled={formSubmitting}>Cancel</button>
            <button type="submit" className="btn-filled" disabled={formSubmitting}>
              {formSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
