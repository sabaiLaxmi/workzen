import axiosInstance from './axiosInstance';

export const getProjects = async () => {
  const response = await axiosInstance.get('/api/projects');
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await axiosInstance.get(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (data) => {
  const response = await axiosInstance.post('/api/projects', data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await axiosInstance.put(`/api/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axiosInstance.delete(`/api/projects/${id}`);
  return response.data;
};

export const assignEmployees = async (id, employeeIds) => {
  const response = await axiosInstance.put(`/api/projects/${id}/assign`, { employeeIds });
  return response.data;
};
