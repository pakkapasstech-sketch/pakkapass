import axiosInstance from '../api/axiosInstance';

export const commissionService = {
  // Fetches commission ledger from GET /admin/commissions
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/commissions');
    return data.commissions || [];
  },
};

export default commissionService;
