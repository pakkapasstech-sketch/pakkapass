import * as dashboardApi from '../api/dashboardApi';

export const dashboardService = {
  getStats: dashboardApi.getDashboardStats,
  getSubscriptionGrowth: dashboardApi.getSubscriptionGrowth,
  getRevenueTrend: dashboardApi.getRevenueTrend,
  getStudentsByState: dashboardApi.getStudentsByState,
  getRecentRegistrations: dashboardApi.getRecentRegistrations,
  getRecentPayments: dashboardApi.getRecentPayments,
  getReferralConversions: dashboardApi.getReferralConversions,
  getPerformanceMetrics: dashboardApi.getPerformanceMetrics,
};
