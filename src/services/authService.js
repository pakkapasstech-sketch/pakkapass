import * as authApi from '../api/authApi';

export const authService = {
  login: authApi.login,
  requestOTP: authApi.requestOTP,
  verifyOTP: authApi.verifyOTP,
  logout: authApi.logout,
  getMe: authApi.getMe,
  refreshToken: authApi.refreshToken,
};
