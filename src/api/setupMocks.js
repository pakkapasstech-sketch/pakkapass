import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './axiosInstance';
import {
  mockDashboardStats,
  mockSubscriptionGrowth,
  mockRevenueTrend,
  mockStudentsByState,
  mockRecentRegistrations,
  mockRecentPayments,
  mockReferralConversions,
  mockPerformanceMetrics,
  mockUser,
} from '../mocks/mockData';

export const setupMocks = () => {
  const mock = new MockAdapter(axiosInstance, {
    delayResponse: 400,
    onNoMatch: 'passthrough', // let unmocked requests hit the real backend
  });
  mock.onPost('/auth/login').reply(async (config) => {
    const { email, password } = JSON.parse(config.data);
    if (email === 'superadmin@pakkapass.com' && password === 'admin123') {
      return [200, {
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }];
    }
    return [401, { message: 'Invalid credentials' }];
  });

  mock.onPost('/auth/refresh').reply(200, { accessToken: 'mock-refreshed-token' });
  mock.onGet('/auth/me').reply(200, { user: mockUser });
  mock.onPost('/auth/logout').reply(200, { success: true });

  mock.onGet('/dashboard/stats').reply(200, { data: mockDashboardStats });
  mock.onGet('/dashboard/subscription-growth').reply(200, { data: mockSubscriptionGrowth });
  mock.onGet('/dashboard/revenue-trend').reply(200, { data: mockRevenueTrend });
  mock.onGet('/dashboard/students-by-state').reply(200, { data: mockStudentsByState });
  mock.onGet('/dashboard/registrations').reply(200, { data: mockRecentRegistrations });
  mock.onGet('/dashboard/payments').reply(200, { data: mockRecentPayments });
  mock.onGet('/dashboard/referrals').reply(200, { data: mockReferralConversions });
  mock.onGet('/dashboard/performance').reply(200, { data: mockPerformanceMetrics });

  // mock.onGet(/\/students/).reply(200, { data: [], total: 0 });
  // mock.onGet(/\/parents/).reply(200, { data: [], total: 0 });
  // mock.onGet(/\/content/).reply(200, { data: [], total: 0 });
  // mock.onGet(/\/videos/).reply(200, { data: [], total: 0 });
  // mock.onGet(/\/pdfs/).reply(200, { data: [], total: 0 });
  // mock.onGet(/\/analytics/).reply(200, { data: {} });
  // mock.onGet(/\/subscriptions/).reply(200, { data: [], total: 0 });
  // mock.onGet(/\/payments/).reply(200, { data: mockRecentPayments, total: 5 });
  // mock.onGet(/\/partners/).reply(200, { data: [], total: 0 });
  // mock.onGet(/\/notifications/).reply(200, { data: [], total: 0 });
  // mock.onGet(/\/settings/).reply(200, { data: {} });

  return mock;
};
