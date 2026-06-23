import * as api from '../api/subscriptionApi';

export const getPlans =
  async () => {
    const res =
      await api.getPlans();

    return res.data.plans;
  };

export const getPlanById =
  async (id) => {
    const res =
      await api.getPlanById(id);

    return res.data;
  };

export const createPlan =
  async (payload) => {
    const res =
      await api.createPlan(
        payload
      );

    return res.data;
  };

export const updatePlan =
  async (id, payload) => {
    const res =
      await api.updatePlan(
        id,
        payload
      );

    return res.data;
  };

export const deletePlan =
  async (id) => {
    const res =
      await api.deletePlan(id);

    return res.data;
  };