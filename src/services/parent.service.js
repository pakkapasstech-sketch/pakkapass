import axiosInstance from '../api/axiosInstance';

export const parentService = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/parents');
    return data.parents || [];
  },
};

export default parentService;
