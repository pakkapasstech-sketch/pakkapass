import axiosInstance from './axiosInstance';

export const login = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data;
};

export const requestOTP = async (email) => {
  const { data } = await axiosInstance.post('/auth/request-otp', { email });
  return data;
};

export const verifyOTP = async (email, otp) => {
  const { data } = await axiosInstance.post('/auth/verify-otp', { email, otp });
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
};

export const refreshToken = async (token) => {
  const { data } = await axiosInstance.post('/auth/refresh', { refreshToken: token });
  return data;
};
