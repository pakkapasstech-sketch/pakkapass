import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { QUERY_KEYS } from '../constants/queryKeys';
import paymentService from '../services/payment.service';
import {
  mockPerformanceMetrics,
} from '../mocks/mockData';
import {
  mockSubscriptionGrowth,
} from '../mocks/mockData';
import { studentService } from '../services/student.service';
import { useStudents } from './useStudents';

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
    queryKey:
      QUERY_KEYS.dashboard
        .subscriptionGrowth,
    queryFn: async () =>
      mockSubscriptionGrowth,
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


const mapDashboardStudent = (s) => ({
  id: s.id,
  name: s.name || 'Unknown',
  email: s.email || '',
  mobile: s.mobile || '',
  profile: s.profile || null,
  referralCode: s.referralCode || null,
  refCode: s.refCode || null,

  class:
    s.profile?.grade?.name ||
    'N/A',

  board:
    s.profile?.board?.name ||
    'N/A',

  branch:
    s.profile?.branch?.name ||
    s.branch ||
    'N/A',

  institution:
    'Not Available',

  state:
    'Not Available',

  status:
    s.profile?.plan
      ? 'Active'
      : 'Trial',

  plan:
    s.profile?.plan?.name ||
    'Free Trial',

  createdAt:
    s.createdAt,

  avatar:
    s.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
});
export const useRecentRegistrations = () => {
  const { data: students, isLoading, isError } = useStudents();
  
  const mappedData = (students || [])
    .slice(0, 5)
    .map(mapDashboardStudent);

  return {
    data: mappedData,
    isLoading,
    isError
  };
};
export const useRecentPayments = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.payments,
    queryFn: async () => {
      try {
        const payments = await paymentService.getAll();

        return payments || [];
      } catch (error) {
        console.error('Failed to fetch payments:', error);
        return [];
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
    queryFn: async () =>
      mockPerformanceMetrics,
  });
