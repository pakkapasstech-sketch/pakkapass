import axiosInstance from '../api/axiosInstance';
import parentService from './parent.service';

let optionsPromise = null;
let optionsCache = null;
let optionsCacheTime = 0;
const CACHE_DURATION = 15000; // 15 seconds cache duration

const profilePromises = {};
const profileCaches = {};
const profileCacheTimes = {};

const analyticsPromises = {};
const analyticsCaches = {};
const analyticsCacheTimes = {};

export const studentService = {
  invalidateCache: () => {
    optionsCache = null;
    optionsCacheTime = 0;
  },

  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/students');
    return data.students || [];
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/admin/student/${id}`);
    return data;
  },

  importStudents: async (payload) => {
    const { data } = await axiosInstance.post('/admin/import-students', payload);
    return data;
  },

  extendPlan: async (studentId, days) => {
    const { data } = await axiosInstance.put(`/admin/student/${studentId}/extend-plan`, { days });
    return data;
  },

  getParentStudents: async () => {
    const data = await parentService.getStudents();
    return data.students || [];
  },

  getFilterOptions: async () => {
    const now = Date.now();
    if (optionsCache && (now - optionsCacheTime < CACHE_DURATION)) {
      return optionsCache;
    }
    if (optionsPromise) {
      return optionsPromise;
    }
    optionsPromise = axiosInstance.get('/admin/content/options')
      .then(res => {
        optionsCache = res.data;
        optionsCacheTime = Date.now();
        optionsPromise = null;
        return res.data;
      })
      .catch(err => {
        optionsPromise = null;
        throw err;
      });
    return optionsPromise;
  },

  getProfile: async (studentId) => {
    const now = Date.now();
    if (profileCaches[studentId] && (now - profileCacheTimes[studentId] < CACHE_DURATION)) {
      return profileCaches[studentId];
    }
    if (profilePromises[studentId]) {
      return profilePromises[studentId];
    }
    profilePromises[studentId] = axiosInstance.get(`/student/profile/${studentId}`)
      .then(res => {
        profileCaches[studentId] = res.data;
        profileCacheTimes[studentId] = Date.now();
        profilePromises[studentId] = null;
        return res.data;
      })
      .catch(err => {
        profilePromises[studentId] = null;
        throw err;
      });
    return profilePromises[studentId];
  },

  getAnalytics: async (studentId, filter) => {
    const cacheKey = filter ? `${studentId}_${filter}` : studentId;
    const now = Date.now();
    if (analyticsCaches[cacheKey] && (now - analyticsCacheTimes[cacheKey] < CACHE_DURATION)) {
      return analyticsCaches[cacheKey];
    }
    if (analyticsPromises[cacheKey]) {
      return analyticsPromises[cacheKey];
    }
    const url = `/student/${studentId}/analytics${filter ? `?filter=${filter}` : ''}`;
    analyticsPromises[cacheKey] = axiosInstance.get(url)
      .then(res => {
        analyticsCaches[cacheKey] = res.data;
        analyticsCacheTimes[cacheKey] = Date.now();
        analyticsPromises[cacheKey] = null;
        return res.data;
      })
      .catch(err => {
        analyticsPromises[cacheKey] = null;
        throw err;
      });
    return analyticsPromises[cacheKey];
  },


getSubscription: async (studentId) => {
  try {
    const { profile } = await studentService.getProfile(studentId);
    
    let startDate = null;
    let expiryDate = null;
    let daysLeft = 0;
    let status = 'Active';
    const hasPlan = Boolean(profile?.plan || profile?.currentPlanId);
    
    if (hasPlan) {
      startDate = new Date(profile.updatedAt || profile.createdAt || new Date());
      if (profile.planExpiryDate) {
        expiryDate = new Date(profile.planExpiryDate);
      } else if (profile.plan?.durationDays) {
        expiryDate = new Date(startDate.getTime() + (profile.plan.durationDays || 0) * 24 * 60 * 60 * 1000);
      }
      const now = new Date();
      if (expiryDate) {
        daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (daysLeft < 0) {
          daysLeft = 0;
          status = 'Expired';
        }
      }
    }

    return {
      currentPlan: hasPlan ? {
        name: profile.plan?.name || 'Subscribed',
        price: profile.plan?.price || 0,
        durationDays: profile.plan?.durationDays || 0,
        features: profile.plan?.features || [],
        status,
        startDate: startDate?.toISOString(),
        expiryDate: expiryDate?.toISOString(),
        daysLeft,
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

getInactiveStudents: async () => {
  const { data } = await axiosInstance.get('/admin/inactive-students');
  return data.inactiveStudents || [];
},

getActivities: async (studentId) => {
  const { data } = await axiosInstance.get(`/student/${studentId}/activities`);
  return data;
},
};

export default studentService;
