import axiosInstance from './axiosInstance';

export const getActivityLog = async (limit = 50) => {
  const response = await axiosInstance.get(`/api/reports/activity-log?limit=${limit}`);
  return response.data;
};

export const getProjectReport = async (id) => {
  const response = await axiosInstance.get(`/api/reports/project/${id}`);
  return response.data;
};

export const getEmployeeReport = async (id) => {
  const response = await axiosInstance.get(`/api/reports/employee/${id}`);
  return response.data;
};
