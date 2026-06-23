import api from './axiosInstance';

export const getPlans = () =>
  api.get('/admin/plans');

export const getPlanById = (id) =>
  api.get('/admin/plans').then((res) => ({
    data: res.data.plans.find(
      (p) => p.id === Number(id)
    ),
  }));

export const createPlan = (data) =>
  api.post('/admin/plans', data);

export const updatePlan = (
  id,
  data
) =>
  api.put(
    `/admin/plans/${id}`,
    data
  );

export const deletePlan = (id) =>
  api.delete(
    `/admin/plans/${id}`
  );