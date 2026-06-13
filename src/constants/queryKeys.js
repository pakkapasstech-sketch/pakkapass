export const QUERY_KEYS = {
  dashboard: {
    all: ['dashboard'],
    stats: ['dashboard', 'stats'],
    subscriptionGrowth: ['dashboard', 'subscription-growth'],
    revenueTrend: ['dashboard', 'revenue-trend'],
    studentsByState: ['dashboard', 'students-by-state'],
    registrations: ['dashboard', 'registrations'],
    payments: ['dashboard', 'payments'],
    referrals: ['dashboard', 'referrals'],
    performance: ['dashboard', 'performance'],
  },
  students: {
    all: ['students'],
    list: (params) => ['students', 'list', params],
    detail: (id) => ['students', 'detail', id],
  },
  payments: {
    all: ['payments'],
    list: (params) => ['payments', 'list', params],
  },
  auth: {
    user: ['auth', 'user'],
  },
};
