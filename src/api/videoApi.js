import axiosInstance from './axiosInstance';

export const getVideos = async (params = {}) => {
  const { data } = await axiosInstance.get('/videos', { params });
  return data;
};
