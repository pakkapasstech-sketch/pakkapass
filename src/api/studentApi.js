import axiosInstance from './axiosInstance';

export const getStudents = async (params = {}) => {
  const { data } = await axiosInstance.get('/students', { params });
  return data;
};

export const getStudentById = async (id) => {
  const { data } = await axiosInstance.get(`/students/${id}`);
  return data;
};

export const createStudent = async (payload) => {
  const { data } = await axiosInstance.post('/students', payload);
  return data;
};

export const updateStudent = async (id, payload) => {
  const { data } = await axiosInstance.put(`/students/${id}`, payload);
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await axiosInstance.delete(`/students/${id}`);
  return data;
};
