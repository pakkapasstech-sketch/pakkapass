import axiosInstance from '../api/axiosInstance';

export const partnerService = {
  getAll: async (params = {}) => {
    const { data } = await axiosInstance.get('/partner', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/partner/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await axiosInstance.post('/partner', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await axiosInstance.put(`/partner/${id}`, payload);
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await axiosInstance.patch(`/partner/${id}/status`, { status });
    return data;
  },

  getDashboard: async () => {
  const { data } = await axiosInstance.get(
    '/partner/dashboard'
  );

  return data;
},
getPayments: async () => {
  const { data } = await axiosInstance.get(
    '/partner/payments'
  );

  return data;
},
  getStudents: async () => {
    const { data } = await axiosInstance.get('/partner/students');
    return data;
  },

  delete: async (id) => {
    const { data } = await axiosInstance.delete(`/partner/${id}`);
    return data;
  },
};

export default partnerService;
