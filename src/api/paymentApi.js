import axiosInstance from './axiosInstance';

export const getPayments = async (params = {}) => {
  const { data } = await axiosInstance.get('/payments', { params });
  return data;
};
