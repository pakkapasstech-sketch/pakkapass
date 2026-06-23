import axiosInstance from '../api/axiosInstance';

export const studentService = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/students');
    return data.students || [];
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/admin/student/${id}`);
    return data;
  },

  getParentStudents: async () => {
    const { data } = await axiosInstance.get('/parent/students');
    return data.students || [];
  },
  getFilterOptions: async () => {
  const { data } = await axiosInstance.get(
    '/admin/content/options'
  );

  return data;
},
};

export default studentService;
