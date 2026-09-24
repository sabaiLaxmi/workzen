import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminDashboard from '../admin/AdminDashboard';
import ManagerDashboard from '../manager/ManagerDashboard';
import EmployeeDashboard from '../employee/EmployeeDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'manager') return <ManagerDashboard />;
  
  return <EmployeeDashboard />;
}
