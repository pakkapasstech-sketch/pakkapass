import axiosInstance from '../api/axiosInstance';

const parentService = {
  getDashboard: async () => {
    const { data } = await axiosInstance.get('/parent/dashboard');
    return data;
  },

  getStudents: async () => {
    const { data } = await axiosInstance.get('/parent/students');
    return data;
  },

  getTransactions: async () => {
    const { data } = await axiosInstance.get('/parent/transactions');
    return data;
  },

  // Admin page
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/parents');
    return data.parents || [];
  },
};

export default parentService;