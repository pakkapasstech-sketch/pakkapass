import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import { mockDashboardCharts } from '../mock/dashboard';
import { QUERY_KEYS } from '../constants/queryKeys';
import paymentService from '../services/payment.service';
import { mockPayments } from '../mock/payments'

export const useAdminDashboard = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.stats,
    queryFn: dashboardService.getStats,
  });

export const usePartnerDashboard = () =>
  useQuery({
    queryKey: ['partner', 'dashboard'],
    queryFn: dashboardService.getPartnerDashboard,
  });

export const useParentDashboard = () =>
  useQuery({
    queryKey: ['parent', 'dashboard'],
    queryFn: dashboardService.getParentDashboard,
  });

export const useDashboardStats = () => useAdminDashboard();

export const useSubscriptionGrowth = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.subscriptionGrowth,
    queryFn: async () => mockDashboardCharts.subscriptionGrowth,
  });

export const useRevenueTrend = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.revenueTrend,
    queryFn: async () => [
      { date: '2026-06-11', revenue: 125000 },
      { date: '2026-06-12', revenue: 148000 },
      { date: '2026-06-13', revenue: 162000 },
      { date: '2026-06-14', revenue: 185000 },
      { date: '2026-06-15', revenue: 210000 },
      { date: '2026-06-16', revenue: 195000 },
      { date: '2026-06-17', revenue: 245000 },
    ],
  });

export const useStudentsByState = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.studentsByState,
    queryFn: async () => mockDashboardCharts.studentsByState,
  });

export const useRecentRegistrations = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.registrations,
    queryFn: async () => [
      {
        id: 1,
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        date: '2026-06-15',
        avatar: 'RS',
        status: 'Active',
      },
      {
        id: 2,
        name: 'Priya Reddy',
        email: 'priya@example.com',
        date: '2026-06-16',
        avatar: 'PR',
        status: 'Active',
      },
      {
        id: 3,
        name: 'Arjun Kumar',
        email: 'arjun@example.com',
        date: '2026-06-17',
        avatar: 'AK',
        status: 'Active',
      },
    ],
  });
export const useRecentPayments = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.payments,
    queryFn: async () => {
      try {
        const payments = await paymentService.getAll();

        // Backend returns []
        if (!payments?.length) {
          return mockPayments;
        }

        return payments;
      } catch {
        return mockPayments;
      }
    },
  });
export const useReferralConversions = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.referrals,
    queryFn: dashboardService.getReferralConversions,
  });

export const usePerformanceMetrics = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.performance,
    queryFn: async () => [
      { label: 'Avg. Study Hours', value: '2.4h', change: '+12%', trend: 'up' },
      { label: 'Completion Rate', value: '78%', change: '+5%', trend: 'up' },
      { label: 'Active Users', value: '1,240', change: '+8%', trend: 'up' },
      { label: 'Churn Rate', value: '3.2%', change: '-1%', trend: 'down' },
    ],
  });
