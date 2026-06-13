import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useDashboardStats = () =>
  useQuery({ queryKey: QUERY_KEYS.dashboard.stats, queryFn: dashboardService.getStats });

export const useSubscriptionGrowth = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.subscriptionGrowth,
    queryFn: dashboardService.getSubscriptionGrowth,
  });

export const useRevenueTrend = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.revenueTrend,
    queryFn: dashboardService.getRevenueTrend,
  });

export const useStudentsByState = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.studentsByState,
    queryFn: dashboardService.getStudentsByState,
  });

export const useRecentRegistrations = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.registrations,
    queryFn: dashboardService.getRecentRegistrations,
  });

export const useRecentPayments = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.payments,
    queryFn: dashboardService.getRecentPayments,
  });

export const useReferralConversions = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.referrals,
    queryFn: dashboardService.getReferralConversions,
  });

export const usePerformanceMetrics = () =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard.performance,
    queryFn: dashboardService.getPerformanceMetrics,
  });
