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

  getAnalytics: async (studentId) => {
    const now = Date.now();
    if (analyticsCaches[studentId] && (now - analyticsCacheTimes[studentId] < CACHE_DURATION)) {
      return analyticsCaches[studentId];
    }
    if (analyticsPromises[studentId]) {
      return analyticsPromises[studentId];
    }
    analyticsPromises[studentId] = axiosInstance.get(`/student/${studentId}/analytics`)
      .then(res => {
        analyticsCaches[studentId] = res.data;
        analyticsCacheTimes[studentId] = Date.now();
        analyticsPromises[studentId] = null;
        return res.data;
      })
      .catch(err => {
        analyticsPromises[studentId] = null;
        throw err;
      });
    return analyticsPromises[studentId];
  },


getSubscription: async (studentId) => {
  try {
    const { profile } = await studentService.getProfile(studentId);
    
    let startDate = null;
    let expiryDate = null;
    let daysLeft = 0;
    let status = 'Active';
    
    if (profile?.plan) {
      startDate = new Date(profile.updatedAt || profile.createdAt || new Date());
      expiryDate = new Date(startDate.getTime() + (profile.plan.durationDays || 0) * 24 * 60 * 60 * 1000);
      const now = new Date();
      daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (daysLeft < 0) {
        daysLeft = 0;
        status = 'Expired';
      }
    }

    return {
      currentPlan: profile?.plan ? {
        name: profile.plan.name,
        price: profile.plan.price,
        durationDays: profile.plan.durationDays,
        features: profile.plan.features || [],
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
};

export default studentService;
