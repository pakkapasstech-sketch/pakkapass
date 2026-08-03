import axiosInstance from '../api/axiosInstance';
import { studentService } from './student.service';

let dashboardPromise = null;
let dashboardCache = null;
let dashboardCacheTime = 0;

const CACHE_DURATION = 15000; // 15 seconds cache duration

const fetchDashboard = () => {
  const now = Date.now();
  if (dashboardCache && (now - dashboardCacheTime < CACHE_DURATION)) {
    return Promise.resolve(dashboardCache);
  }
  if (dashboardPromise) {
    return dashboardPromise;
  }
  dashboardPromise = axiosInstance.get('/partner/dashboard')
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
};

const fetchOptions = async () => {
  return await studentService.getFilterOptions();
};

const invalidateCache = () => {
  dashboardCache = null;
  dashboardCacheTime = 0;
};

export const partnerService = {
  getAll: async (params = {}) => {
    const { data } = await axiosInstance.get('/partner', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/partner/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await axiosInstance.post('/partner', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await axiosInstance.put(`/partner/${id}`, payload);
    invalidateCache();
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await axiosInstance.put('/partner/profile', payload);
    invalidateCache();
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await axiosInstance.patch(`/partner/${id}/status`, { status });
    invalidateCache();
    return data;
  },

  getDashboard: async () => {
    return await fetchDashboard();
  },
  
  getPayments: async () => {
    const data = await fetchDashboard();
    const partner = data.partner || {};
    
    const filteredRaw = (data.recentPayments || []).filter(
      p => p.partnerId && String(p.partnerId) === String(partner.id) && (Number(p.discountAmount) > 0 || p.couponCode === partner.referralCode)
    );

    const formattedPayments = filteredRaw.map(p => {
      const paidAmount = Number(p.amount) || 0;
      const discountAmount = Number(p.discountAmount) || 0;
      const planAmount = paidAmount + discountAmount;
      return {
        id: String(p.id),
        transactionId: p.transactionId || String(p.id),
        student: p.student?.name || 'Unknown',
        plan: p.plan?.name || 'N/A',
        planAmount,
        discountAmount,
        amount: paidAmount,
        status: p.status || 'Paid', 
        paymentDate: p.createdAt,
        referralCode: data.partner?.referralCode || 'N/A',
      };
    });
    
    const summary = {
      totalPayments: formattedPayments.length,
      paid: formattedPayments.filter(p => p.status === 'Paid' || p.status === 'Success').length,
      pending: formattedPayments.filter(p => p.status === 'Pending').length,
      failed: formattedPayments.filter(p => p.status === 'Failed').length,
      revenue: formattedPayments.reduce((acc, p) => acc + ((p.status === 'Paid' || p.status === 'Success') ? Number(p.amount) : 0), 0)
    };

    return { payments: formattedPayments, summary };
  },
  
  getStudents: async () => {
    const [data, options] = await Promise.all([
      fetchDashboard(),
      fetchOptions().catch(err => {
        console.error("Failed to load options:", err);
        return { grades: [], boards: [], branches: [] };
      })
    ]);
    
    const formattedStudents = (data.recentStudents || []).map(s => {
      const gradeName = (options.grades || []).find(g => String(g.id) === String(s.gradeId))?.name || 'N/A';
      const boardName = (options.boards || []).find(b => String(b.id) === String(s.boardId))?.name || 'N/A';
      const branchName = (options.branches || []).find(br => String(br.id) === String(s.branchId))?.name || 'N/A';
      
      return {
        id: String(s.student?.id || s.id),
        name: s.student?.name || 'Unknown',
        class: gradeName,
        board: boardName,
        branch: branchName,
        institution: s.institution || 'N/A',
        referralCode: data.partner?.referralCode || 'N/A',
        plan: s.plan?.name || 'Free',
        status: s.plan ? 'Active' : 'Inactive',
        registeredOn: s.student?.createdAt,
        profile: s,
      };
    });
    return { students: formattedStudents, partner: data.partner || {} };
  },

  delete: async (id) => {
    const { data } = await axiosInstance.delete(`/partner/${id}`);
    invalidateCache();
    return data;
  },

  getOptions: async () => {
    return await fetchOptions();
  },
};

export default partnerService;
