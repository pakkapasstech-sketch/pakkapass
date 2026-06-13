import axiosInstance from './axiosInstance';

export const getSubscriptions = async (params = {}) => {
  const { data } = await axiosInstance.get('/subscriptions', { params });
  return data;
};
