import axiosInstance from './axiosInstance';

export const getDashboardStats =
  async () => {
    const { data } =
      await axiosInstance.get(
        '/dashboard/stats'
      );

    return {
      cards: data.data,
    };
  };

export const getSubscriptionGrowth = async () => {
  const { data } = await axiosInstance.get('/dashboard/subscription-growth');
  return data.data;
};



export const getRevenueTrend = async () => {
  const { data } = await axiosInstance.get('/dashboard/revenue-trend');
  return data.data;

};

export const getStudentsByState = async () => {
  const { data } = await axiosInstance.get('/dashboard/students-by-state');
  return data.data;
};

export const getRecentRegistrations = async () => {
  const { data } = await axiosInstance.get('/dashboard/registrations');
  return data.data;
};

export const getRecentPayments = async () => {
  const { data } = await axiosInstance.get('/dashboard/payments');
  return data.data;
};

export const getReferralConversions = async () => {
  const { data } = await axiosInstance.get('/dashboard/referrals');
  return data.data;
};

export const getPerformanceMetrics = async () => {
  const { data } = await axiosInstance.get('/dashboard/performance');
  return data.data;
};
