import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleChangeToast, setRoleChangeToast] = useState('');

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return null;

    try {
      const res = await axiosInstance.get('/api/auth/me');
      const freshUser = res.data;

      setUser(prevUser => {
        if (prevUser && freshUser && prevUser.role !== freshUser.role) {
          const prevRole = prevUser.role.charAt(0).toUpperCase() + prevUser.role.slice(1);
          const newRole = freshUser.role.charAt(0).toUpperCase() + freshUser.role.slice(1);
          setRoleChangeToast(`Your role has been updated from ${prevRole} to ${newRole}! Sidebar and permissions refreshed.`);
          setTimeout(() => setRoleChangeToast(''), 6000);
        }
        return freshUser;
      });

      localStorage.setItem('user', JSON.stringify(freshUser));
      return freshUser;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await axiosInstance.get('/api/auth/me');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
          console.error('Auth check failed', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Auto-sync role when tab gains focus, window visibility changes, or via custom event
  useEffect(() => {
    const handleSync = () => {
      if (localStorage.getItem('token')) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleSync);
    window.addEventListener('user-role-changed', handleSync);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && localStorage.getItem('token')) {
        handleSync();
      }
    });

    // Check periodically every 20 seconds if user is active
    const interval = setInterval(() => {
      if (localStorage.getItem('token') && document.visibilityState === 'visible') {
        refreshUser();
      }
    }, 20000);

    return () => {
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('user-role-changed', handleSync);
      clearInterval(interval);
    };
  }, [refreshUser]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser, roleChangeToast, setRoleChangeToast }}>
      {children}
    </AuthContext.Provider>
  );
};
