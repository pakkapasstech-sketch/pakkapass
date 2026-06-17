import axiosInstance from '../api/axiosInstance';

export const paymentService = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/payments');
    return data.payments || [];
  },
};

export default paymentService;
