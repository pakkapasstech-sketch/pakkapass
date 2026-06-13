import axiosInstance from './axiosInstance';

export const getPartners = async (params = {}) => {
  const { data } = await axiosInstance.get('/partners', { params });
  return data;
};
