export const mockDashboardCharts = {
  subscriptionGrowth: [
    { month: 'Jan', subscriptions: 120 },
    { month: 'Feb', subscriptions: 145 },
    { month: 'Mar', subscriptions: 168 },
    { month: 'Apr', subscriptions: 192 },
    { month: 'May', subscriptions: 210 },
    { month: 'Jun', subscriptions: 235 },
  ],
  studentsByState: [
    { state: 'Telangana', count: 420 },
    { state: 'Andhra Pradesh', count: 380 },
    { state: 'Karnataka', count: 290 },
    { state: 'Maharashtra', count: 210 },
    { state: 'Tamil Nadu', count: 185 },
  ],
  referralConversions: [
    { code: 'RK102720', partner: 'Ravi Kumar', conversions: 45, revenue: 89000 },
    { code: 'VR458915', partner: 'Vineeth Reddy', conversions: 32, revenue: 62000 },
    { code: 'SR7632500', partner: 'Suresh Rao', conversions: 28, revenue: 54000 },
  ],
};

export const mockRecentPayments = [
  { id: 1, student: 'Arjun Reddy', plan: 'Premium Annual', amount: 4999, date: '2026-06-15', status: 'Success' },
  { id: 2, student: 'Priya Sharma', plan: 'Standard Monthly', amount: 499, date: '2026-06-14', status: 'Success' },
  { id: 3, student: 'Karthik Nair', plan: 'Premium Monthly', amount: 799, date: '2026-06-13', status: 'Pending' },
];

export default mockDashboardCharts;
