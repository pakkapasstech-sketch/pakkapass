import axiosInstance from '../api/axiosInstance';

export const authService = {
  loginAdmin: async ({ email, password }) => {
  console.log('Sending:', { email, password });

  const { data } = await axiosInstance.post(
    '/admin/login',
    { email, password }
  );

  return {
    accessToken: data.token || data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user || data.admin,
  };
},
sendPartnerOtp: async ({ email }) => {
  const { data } = await axiosInstance.post(
    '/partner/login',
    { email }
  );

  return data;
},

verifyPartnerOtp: async ({ email, otp }) => {
  const { data } = await axiosInstance.post(
    '/partner/verify-otp',
    {
      email,
      otp,
    }
  );

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user || data.partner,
  };
},
  sendParentOtp: async ({ email }) => {
  const { data } = await axiosInstance.post('/parent/login', { email });
  return data;
},

 verifyParentOtp: async ({ email, otp }) => {
  const { data } = await axiosInstance.post('/parent/verify-otp', {
    email,
    otp,
  });

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