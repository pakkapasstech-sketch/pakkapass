import axiosInstance from './axiosInstance';

export const getSettings = async () => {
  const { data } = await axiosInstance.get('/settings');
  return data;
};

export const updateSettings = async (payload) => {
  const { data } = await axiosInstance.put('/settings', payload);
  return data;
};
