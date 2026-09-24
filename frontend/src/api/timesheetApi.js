import axiosInstance from './axiosInstance';

export const submitTimesheet = async (data) => {
  const response = await axiosInstance.post('/api/timesheets', data);
  return response.data;
};

export const getMyTimesheets = async () => {
  const response = await axiosInstance.get('/api/timesheets');
  return response.data;
};

export const updateTimesheet = async (id, data) => {
  const response = await axiosInstance.put(`/api/timesheets/${id}`, data);
  return response.data;
};

export const deleteTimesheet = async (id) => {
  const response = await axiosInstance.delete(`/api/timesheets/${id}`);
  return response.data;
};
