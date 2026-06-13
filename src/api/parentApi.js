import axiosInstance from './axiosInstance';

export const getParents = async (params = {}) => {
  const { data } = await axiosInstance.get('/parents', { params });
  return data;
};
