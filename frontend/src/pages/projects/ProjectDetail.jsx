import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject, assignEmployees } from '../../api/projectApi';
import { getUsers } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/common/Modal';
import '../admin/DashboardStyles.css';
import '../public/Auth.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', status: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Assign Employees state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [assignLoading, setAssignLoading] = useState(false);
  
  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectById(id);
      setProject(data);
      setFormData({ name: data.name, description: data.description, status: data.status });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const canManage = user?.role === 'admin' || (user?.role === 'manager' && project?.manager?._id === user?._id);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await updateProject(id, formData);
      setIsEditing(false);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update project');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        navigate('/app/projects');
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  const openAssignModal = async () => {
    setIsAssignModalOpen(true);
    setAssignLoading(true);
    try {
      const allUsers = await getUsers();
      // Filter for employees
      const employeeUsers = allUsers.filter(u => u.role === 'employee');
      setUsers(employeeUsers);
      
      const currentAssigned = new Set(project.assignedEmployees.map(e => e._id));
      setSelectedUsers(currentAssigned);
    } catch (err) {
      alert('Failed to fetch users');
    } finally {
      setAssignLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await assignEmployees(id, Array.from(selectedUsers));
      setIsAssignModalOpen(false);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign employees');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading project...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-page" style={{ padding: '2rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid var(--brick)', borderRadius: '4px', backgroundColor: 'rgba(193, 85, 77, 0.05)', color: 'var(--brick)' }}>
          <strong>Error: </strong> {error}
        </div>
        <button className="btn-ghost mt-4" onClick={() => navigate('/app/projects')}>Back to Projects</button>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', margin: '1rem 0 2rem', gap: '1.5rem' }}>
        <div>
          <button className="btn-ghost small" style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem' }} onClick={() => navigate('/app/projects')}>&larr; Back</button>
          <h2 className="dashboard-section-title" style={{ margin: 0, fontSize: '2rem', wordBreak: 'break-word' }}>{project.name}</h2>
        </div>
        {canManage && !isEditing && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button className="btn-ghost" onClick={() => setIsEditing(true)}>Edit Project</button>
            <button className="btn-filled" onClick={openAssignModal}>Assign Employees</button>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-column" style={{ flex: 2 }}>
          {isEditing ? (
            <div className="panel">
              <h3 style={{ marginBottom: '1.5rem' }}>Edit Project Details</h3>
              <form className="auth-form" onSubmit={handleUpdate} style={{ maxWidth: 'none', margin: 0, padding: 0 }}>
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-input" 
                    rows="4"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input" 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <button type="submit" className="btn-filled" disabled={formSubmitting}>Save Changes</button>
                    <button type="button" className="btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                  <button type="button" className="btn-ghost" style={{ color: 'var(--brick)', borderColor: 'transparent' }} onClick={handleDelete}>Delete Project</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="panel">
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--ink-soft)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Description</h4>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>{project.description || 'No description provided.'}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                <div style={{ minWidth: '120px' }}>
                  <h4 style={{ color: 'var(--ink-soft)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Status</h4>
                  <span className={`pill ${project.status === 'active' ? 'pill-pine' : project.status === 'completed' ? 'pill-sage' : 'pill-slate'}`} style={{ fontSize: '1rem' }}>
                    {project.status}
                  </span>
                </div>
                <div style={{ minWidth: '120px' }}>
                  <h4 style={{ color: 'var(--ink-soft)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Manager</h4>
                  <p style={{ margin: 0, fontWeight: '500' }}>{project.manager?.name || 'Unknown'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-column">
          <h2 className="dashboard-section-title">Team Members ({project.assignedEmployees?.length || 0})</h2>
          <div className="panel list-panel">
            {project.assignedEmployees?.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                No employees assigned yet.
              </div>
            ) : (
              <div className="data-list">
                {project.assignedEmployees.map(emp => (
                  <div key={emp._id} className="hairline-row">
                    <div className="row-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="avatar" style={{ width: '40px', height: '40px' }}>
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong className="row-title" style={{ display: 'block' }}>{emp.name}</strong>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>{emp.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Employees Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => !formSubmitting && setIsAssignModalOpen(false)} title="Assign Employees">
        {assignLoading ? (
          <div>Loading employees...</div>
        ) : (
          <form onSubmit={handleAssignSubmit}>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', border: '1px solid var(--line)', borderRadius: '4px' }}>
              {users.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--ink-soft)' }}>No employees found.</div>
              ) : (
                users.map(u => (
                  <label key={u._id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--line)', cursor: 'pointer', gap: '1rem', margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.has(u._id)} 
                      onChange={() => toggleUserSelection(u._id)} 
                      style={{ width: '18px', height: '18px', accentColor: 'var(--pine)' }}
                    />
                    <div>
                      <strong style={{ display: 'block' }}>{u.name}</strong>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>{u.email}</span>
                    </div>
                  </label>
                ))
              )}
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-ghost" onClick={() => setIsAssignModalOpen(false)} disabled={formSubmitting}>Cancel</button>
              <button type="submit" className="btn-filled" disabled={formSubmitting}>
                {formSubmitting ? 'Saving...' : 'Save Assignments'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
