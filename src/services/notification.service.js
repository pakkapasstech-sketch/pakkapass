import axiosInstance from '../api/axiosInstance';

export const notificationService = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/notifications');
    return data;
  },

  create: async (payload) => {
    const { data } = await axiosInstance.post('/admin/notifications', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await axiosInstance.put(`/admin/notifications/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await axiosInstance.delete(`/admin/notifications/${id}`);
    return data;
  },
};

export default notificationService;
