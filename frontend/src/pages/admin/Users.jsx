import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import './DashboardStyles.css'; // Reusing standard dashboard styles

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [editingUserId, setEditingUserId] = useState(null);
  
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    try {
      if (editingUserId) {
        await updateUser(editingUserId, formData);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'employee' });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                           (err.response?.data?.errors ? err.response.data.errors.map(e => e.msg).join(', ') : `Failed to ${editingUserId ? 'update' : 'create'} user.`);
      setFormError(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditClick = (user) => {
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setEditingUserId(user._id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user.');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const getRolePillStyle = (role) => {
    if (role === 'admin') {
      return { backgroundColor: 'var(--pine)', color: '#fff', border: 'none' };
    }
    if (role === 'manager') {
      return { backgroundColor: 'rgba(225, 172, 70, 0.15)', color: '#9c7117', border: 'none' };
    }
    return { backgroundColor: 'var(--paper-raised)', color: 'var(--ink-soft)', border: '1px solid var(--line)' };
  };

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 2rem' }}>
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>Users</h2>
        {isAdmin && (
          <button className="btn-filled" onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'employee' });
            setEditingUserId(null);
            setIsModalOpen(true);
          }}>Add user</button>
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
          ) : users.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
              No users yet. Add your first team member.
            </div>
          ) : (
            <div className="data-list">
              {users.map(u => (
                <div key={u._id} className="hairline-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: 'var(--line)', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center',
                      fontWeight: '600', color: 'var(--ink-soft)', fontSize: '0.9rem'
                    }}>
                      {getInitials(u.name)}
                    </div>
                    <div className="row-info">
                      <strong className="row-title">{u.name}</strong>
                      <span className="text-muted">{u.email}</span>
                    </div>
                  </div>
                  <div className="row-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="pill" style={getRolePillStyle(u.role)}>{u.role}</span>
                    {isAdmin && currentUser?._id !== u._id && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-ghost small" onClick={() => handleEditClick(u)}>Edit</button>
                        <button className="btn-ghost small" style={{ color: 'var(--brick)', borderColor: 'transparent' }} onClick={() => handleDeleteClick(u._id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => !formSubmitting && setIsModalOpen(false)} title={editingUserId ? "Edit User" : "Add User"}>
        <form onSubmit={handleCreateOrUpdateUser} className="auth-form" style={{ maxWidth: 'none', margin: 0, padding: 0 }}>
          <div className="form-group">
            <label className="form-label">Name</label>
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
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={formData.email}
              onChange={e => { setFormData({...formData, email: e.target.value}); setFormError(''); }}
              required
              disabled={formSubmitting}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                value={formData.password}
                onChange={e => { setFormData({...formData, password: e.target.value}); setFormError(''); }}
                required={!editingUserId}
                disabled={formSubmitting}
                minLength="6"
                placeholder={editingUserId ? "Leave blank to keep unchanged" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select 
              className="form-input"
              value={formData.role}
              onChange={e => { setFormData({...formData, role: e.target.value}); setFormError(''); }}
              disabled={formSubmitting}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {formError && <div className="form-error">{formError}</div>}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)} disabled={formSubmitting}>Cancel</button>
            <button type="submit" className="btn-filled" disabled={formSubmitting}>
              {formSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="spinner" viewBox="0 0 50 50" style={{ width: '1rem', height: '1rem', animation: 'var(--animate-spin-slow)', stroke: '#fff', fill: 'none' }}>
                    <circle cx="25" cy="25" r="20" strokeWidth="5" strokeLinecap="round" strokeDasharray="90, 150"></circle>
                  </svg>
                  Saving...
                </div>
              ) : (editingUserId ? 'Save changes' : 'Add user')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
