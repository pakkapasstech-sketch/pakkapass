import axiosInstance from '../api/axiosInstance';

const mapAdminStatsToCards = (stats = {}) => [
  { id: 'students', title: 'Total Students', formattedValue: String(stats.totalStudents ?? 0), trend: 12, trendLabel: 'total', trendUp: true, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', icon: 'students' },
  { id: 'parents', title: 'Total Parents', formattedValue: String(stats.totalParents ?? 0), trend: 8, trendLabel: 'total', trendUp: true, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: 'parents' },
  { id: 'partners', title: 'Total Partners', formattedValue: String(stats.totalInstitutes ?? 0), trend: 5, trendLabel: 'total', trendUp: true, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', icon: 'partners' },
  { id: 'chapters', title: 'Total Chapters', formattedValue: String(stats.totalChapters ?? 0), trend: 3, trendLabel: 'content', trendUp: true, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', icon: 'content' },
  { id: 'topics', title: 'Total Topics', formattedValue: String(stats.totalTopics ?? 0), trend: 6, trendLabel: 'content', trendUp: true, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', icon: 'content' },
];

export const dashboardService = {
  getStats: async () => {
    const { data } = await axiosInstance.get('/admin/dashboard');
    return {
      ...data,
      cards: mapAdminStatsToCards(data.stats),
    };
  },

  getPartnerDashboard: async () => {
    const { data } = await axiosInstance.get('/partner/dashboard');
    return data;
  },

  getParentDashboard: async () => {
    const { data } = await axiosInstance.get('/parent/dashboard');
    return data;
  },

  // Fetches recent payments from backend for dashboard and subscription pages
  getRecentPayments: async () => {
    const { data } = await axiosInstance.get('/admin/payments');
    return data.payments || [];
  },

  // Fetches referral conversion stats from partner profiles
  getReferralConversions: async () => {
    const { data } = await axiosInstance.get('/admin/referrals');
    return data.referrals || [];
  },
};

export default dashboardService;
