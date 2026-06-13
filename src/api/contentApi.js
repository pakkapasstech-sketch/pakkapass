import axiosInstance from './axiosInstance';

export const getContent = async (params = {}) => {
  const { data } = await axiosInstance.get('/content', { params });
  return data;
};
