import axiosInstance from './axiosInstance';

export const getUsers = async () => {
  const response = await axiosInstance.get('/api/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/api/users/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await axiosInstance.post('/api/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axiosInstance.put(`/api/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/users/${id}`);
  return response.data;
};
