import api from '../api/axiosInstance'; // Use axiosInstance directly

export const getPlans = async () => {
  const res = await api.get('/admin/plans');
  return res.data.plans;
};

export const getPlanById = async (id) => {
  const res = await api.get('/admin/plans');
  return res.data.plans.find((p) => p.id === Number(id));
};

export const createPlan = async (payload) => {
  const res = await api.post('/admin/plans', payload);
  return res.data;
};

export const updatePlan = async (id, payload) => {
  const res = await api.put(`/admin/plans/${id}`, payload);
  return res.data;
};

export const deletePlan = async (id) => {
  const res = await api.delete(`/admin/plans/${id}`);
  return res.data;
};