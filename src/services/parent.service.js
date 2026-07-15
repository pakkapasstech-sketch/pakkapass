import axiosInstance from '../api/axiosInstance';

let dashboardPromise = null;
let dashboardCache = null;
let dashboardCacheTime = 0;

let studentsPromise = null;
let studentsCache = null;
let studentsCacheTime = 0;

let transactionsPromise = null;
let transactionsCache = null;
let transactionsCacheTime = 0;

const CACHE_DURATION = 15000; // 15 seconds cache duration

const parentService = {
  getDashboard: async () => {
    const now = Date.now();
    if (dashboardCache && (now - dashboardCacheTime < CACHE_DURATION)) {
      return dashboardCache;
    }
    if (dashboardPromise) return dashboardPromise;

    dashboardPromise = axiosInstance.get('/parent/dashboard')
      .then(res => {
        dashboardCache = res.data;
        dashboardCacheTime = Date.now();
        dashboardPromise = null;
        return res.data;
      })
      .catch(err => {
        dashboardPromise = null;
        throw err;
      });
    return dashboardPromise;
  },

  getStudents: async () => {
    const now = Date.now();
    if (studentsCache && (now - studentsCacheTime < CACHE_DURATION)) {
      return studentsCache;
    }
    if (studentsPromise) return studentsPromise;

    studentsPromise = axiosInstance.get('/parent/students')
      .then(res => {
        studentsCache = res.data;
        studentsCacheTime = Date.now();
        studentsPromise = null;
        return res.data;
      })
      .catch(err => {
        studentsPromise = null;
        throw err;
      });
    return studentsPromise;
  },

  getTransactions: async () => {
    const now = Date.now();
    if (transactionsCache && (now - transactionsCacheTime < CACHE_DURATION)) {
      return transactionsCache;
    }
    if (transactionsPromise) return transactionsPromise;

    transactionsPromise = axiosInstance.get('/parent/transactions')
      .then(res => {
        transactionsCache = res.data;
        transactionsCacheTime = Date.now();
        transactionsPromise = null;
        return res.data;
      })
      .catch(err => {
        transactionsPromise = null;
        throw err;
      });
    return transactionsPromise;
  },

  // Admin page
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/parents');
    return data.parents || [];
  },
};

export default parentService;