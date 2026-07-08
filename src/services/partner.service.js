import axiosInstance from '../api/axiosInstance';

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
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await axiosInstance.put('/partner/profile', payload);
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await axiosInstance.patch(`/partner/${id}/status`, { status });
    return data;
  },

  getDashboard: async () => {
    const { data } = await axiosInstance.get('/partner/dashboard');
    return data;
  },
  
  getPayments: async () => {
    const { data } = await axiosInstance.get('/partner/dashboard');
    const formattedPayments = (data.recentPayments || []).map(p => ({
      id: String(p.id),
      student: p.student?.name || 'Unknown',
      plan: p.plan?.name || 'N/A',
      amount: p.amount || 0,
      status: p.status || 'Paid', 
      paymentDate: p.createdAt,
      referralCode: data.partner?.referralCode || 'N/A',
    }));
    
    const summary = {
      totalPayments: formattedPayments.length,
      paid: formattedPayments.filter(p => p.status === 'Paid').length,
      pending: formattedPayments.filter(p => p.status === 'Pending').length,
      failed: formattedPayments.filter(p => p.status === 'Failed').length,
      revenue: formattedPayments.reduce((acc, p) => acc + (p.status === 'Paid' ? p.amount : 0), 0)
    };

    return { payments: formattedPayments, summary };
  },
  
  getStudents: async () => {
    const { data } = await axiosInstance.get('/partner/dashboard');
    const formattedStudents = (data.recentStudents || []).map(s => ({
      id: String(s.student?.id || s.id),
      name: s.student?.name || 'Unknown',
      class: s.grade?.name || 'N/A',
      board: s.board?.name || 'N/A',
      institution: 'N/A',
      referralCode: data.partner?.referralCode || 'N/A',
      plan: s.plan?.name || 'Free',
      status: s.plan ? 'Active' : 'Inactive',
      registeredOn: s.student?.createdAt,
    }));
    return { students: formattedStudents };
  },

  delete: async (id) => {
    const { data } = await axiosInstance.delete(`/partner/${id}`);
    return data;
  },
};

export default partnerService;
