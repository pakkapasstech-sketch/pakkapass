import * as authApi from '../api/authApi';

export const authService = {
  login: authApi.login,
  logout: authApi.logout,
  getMe: authApi.getMe,
  refreshToken: authApi.refreshToken,
};
