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
getProfile: async (studentId) => {
  const { data } = await axiosInstance.get(
    `/student/profile/${studentId}`
  );
  return data;
},

getAnalytics: async (studentId) => {
  const { data } = await axiosInstance.get(
    `/student/${studentId}/analytics`
  );
  return data;
},
getSubscription: async (studentId) => {
  try {
    const { profile } = await studentService.getProfile(studentId);
    return {
      currentPlan: profile?.plan ? {
        name: profile.plan.name,
        price: profile.plan.price,
        durationDays: profile.plan.durationDays,
        features: profile.plan.features || [],
        status: 'Active',
      } : null,
      history: []
    };
  } catch (error) {
    return { currentPlan: null, history: [] };
  }
},

getTransactions: async (studentId) => {
  try {
    const { profile } = await studentService.getProfile(studentId);
    if (profile?.plan) {
      return {
        summary: {
          totalPaid: profile.plan.price || 0,
          totalTransactions: 1,
          successfulPayments: 1,
        },
        transactions: [
          {
            id: 'TXN' + Math.floor(Math.random() * 1000000),
            date: profile.updatedAt || new Date().toISOString(),
            plan: profile.plan.name,
            amount: profile.plan.price || 0,
            method: 'UPI',
            status: 'Success'
          }
        ]
      };
    }
    return {
      summary: { totalPaid: 0, totalTransactions: 0, successfulPayments: 0 },
      transactions: []
    };
  } catch (error) {
    return { summary: { totalPaid: 0, totalTransactions: 0, successfulPayments: 0 }, transactions: [] };
  }
},
};

export default studentService;
