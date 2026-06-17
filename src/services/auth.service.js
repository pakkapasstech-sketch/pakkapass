import axiosInstance from '../api/axiosInstance';

export const authService = {
  loginAdmin: async ({ email, password }) => {
    const { data } = await axiosInstance.post('/admin/login', { email, password });
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user || data.admin,
    };
  },

  sendPartnerOtp: async ({ mobile }) => {
    const { data } = await axiosInstance.post('/partner/login', { mobile });
    return data;
  },

  verifyPartnerOtp: async ({ mobile, otp }) => {
    const { data } = await axiosInstance.post('/partner/verify-otp', { mobile, otp });
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    };
  },

  sendParentOtp: async ({ mobile }) => {
    const { data } = await axiosInstance.post('/parent/login', { mobile });
    return data;
  },

  verifyParentOtp: async ({ mobile, otp }) => {
    const { data } = await axiosInstance.post('/parent/verify-otp', { mobile, otp });
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user || data.parent,
    };
  },

  getMe: async () => {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      /* ignore */
    }
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const { data } = await axiosInstance.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },

  updateProfile: async (adminId, payload) => {
    const { data } = await axiosInstance.put(`/admin/profile/${adminId}`, payload);
    return data;
  },

  getProfile: async (adminId) => {
    const { data } = await axiosInstance.get(`/admin/profile/${adminId}`);
    return data;
  },
};

export default authService;
