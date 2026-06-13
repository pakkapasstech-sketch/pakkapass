import axiosInstance from './axiosInstance';

export const getPdfs = async (params = {}) => {
  const { data } = await axiosInstance.get('/pdfs', { params });
  return data;
};
