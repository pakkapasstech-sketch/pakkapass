import axiosInstance from './axiosInstance';

export const getNotifications = async (params = {}) => {
  const { data } = await axiosInstance.get('/notifications', { params });
  return data;
};
