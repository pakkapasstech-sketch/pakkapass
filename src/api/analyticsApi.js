import axiosInstance from './axiosInstance';

export const getAnalytics = async (params = {}) => {
  const { data } = await axiosInstance.get('/analytics', { params });
  return data;
};
