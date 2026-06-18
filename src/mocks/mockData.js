export const mockDashboardStats = [
  {
    id: 'total-students',
    title: 'Total Registered Students',
    value: 125680,
    formattedValue: '125,680',
    trend: 16.4,
    trendLabel: 'vs last week',
    trendUp: true,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    icon: 'HiOutlineAcademicCap',
  },
  {
    id: 'active-subs',
    title: 'Active Subscriptions',
    value: 98432,
    formattedValue: '98,432',
    trend: 14.8,
    trendLabel: 'vs last week',
    trendUp: true,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    icon: 'HiOutlineCheckCircle',
  },
  {
    id: 'expired-subs',
    title: 'Expired Subscriptions',
    value: 27248,
    formattedValue: '27,248',
    trend: -8.2,
    trendLabel: 'vs last week',
    trendUp: false,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    icon: 'HiOutlineXCircle',
  },
  {
    id: 'revenue-today',
    title: 'Revenue Today',
    value: 876540,
    formattedValue: '₹ 8,76,540',
    trend: 12.3,
    trendLabel: 'vs yesterday',
    trendUp: true,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: 'HiOutlineCurrencyRupee',
  },
  {
    id: 'revenue-month',
    title: 'Revenue This Month',
    value: 14863250,
    formattedValue: '₹ 1,48,63,250',
    trend: 21.7,
    trendLabel: 'vs last month',
    trendUp: true,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    icon: 'HiOutlineTrendingUp',
  },
  {
    id: 'app-downloads',
    title: 'Total App Downloads',
    value: 215680,
    formattedValue: '215,680',
    trend: 17.1,
    trendLabel: 'vs last week',
    trendUp: true,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-800',
    icon: 'HiOutlineDeviceMobile',
  },
  {
    id: 'active-partners',
    title: 'Active Partners',
    value: 256,
    formattedValue: '256',
    trend: 10.5,
    trendLabel: 'vs last week',
    trendUp: true,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    icon: 'HiOutlineBriefcase',
  },
  {
    id: 'active-referrals',
    title: 'Active Referrals',
    value: 1245,
    formattedValue: '1,245',
    trend: 9.3,
    trendLabel: 'vs last week',
    trendUp: true,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: 'HiOutlineTag',
  },
];

export const mockSubscriptionGrowth = [
  { date: '2025-05-20', newSubscriptions: 420, activeSubscriptions: 8200 },
  { date: '2025-05-21', newSubscriptions: 380, activeSubscriptions: 8400 },
  { date: '2025-05-22', newSubscriptions: 520, activeSubscriptions: 8600 },
  { date: '2025-05-23', newSubscriptions: 460, activeSubscriptions: 8800 },
  { date: '2025-05-24', newSubscriptions: 610, activeSubscriptions: 9100 },
  { date: '2025-05-25', newSubscriptions: 720, activeSubscriptions: 9400 },
  { date: '2025-05-26', newSubscriptions: 580, activeSubscriptions: 9600 },
];

export const mockRevenueTrend = [
  { date: '2025-05-20', revenue: 720000 },
  { date: '2025-05-21', revenue: 680000 },
  { date: '2025-05-22', revenue: 850000 },
  { date: '2025-05-23', revenue: 790000 },
  { date: '2025-05-24', revenue: 920000 },
  { date: '2025-05-25', revenue: 1050000 },
  { date: '2025-05-26', revenue: 876540 },
];

export const mockStudentsByState = [
  { state: 'Andhra Pradesh', count: 24568 },
  { state: 'Telangana', count: 21456 },
  { state: 'Karnataka', count: 18325 },
  { state: 'Tamil Nadu', count: 14985 },
  { state: 'Maharashtra', count: 12658 },
];

export const mockRecentRegistrations = [
  { id: '1', name: 'Rahul Sharma', avatar: 'RS', class: '12', board: 'CBSE', institution: 'Delhi Public School', location: 'Hyderabad, TS', registeredOn: '2025-05-26' },
  { id: '2', name: 'Priya Patel', avatar: 'PP', class: '10', board: 'ICSE', institution: "St. Mary's School", location: 'Bangalore, KA', registeredOn: '2025-05-26' },
  { id: '3', name: 'Arjun Reddy', avatar: 'AR', class: '11', board: 'State', institution: 'Narayana Junior College', location: 'Vijayawada, AP', registeredOn: '2025-05-25' },
  { id: '4', name: 'Sneha Gupta', avatar: 'SG', class: '9', board: 'CBSE', institution: 'Kendriya Vidyalaya', location: 'Chennai, TN', registeredOn: '2025-05-25' },
  { id: '5', name: 'Vikram Singh', avatar: 'VS', class: '12', board: 'JEE', institution: 'Allen Career Institute', location: 'Kota, RJ', registeredOn: '2025-05-24' },
];

export const mockRecentPayments = [
  { id: 'TXN-88421', student: 'Rahul Sharma', amount: 2499, formattedAmount: '₹ 2,499', status: 'success', paidOn: '2025-05-26' },
  { id: 'TXN-88420', student: 'Priya Patel', amount: 1999, formattedAmount: '₹ 1,999', status: 'success', paidOn: '2025-05-26' },
  { id: 'TXN-88419', student: 'Arjun Reddy', amount: 3499, formattedAmount: '₹ 3,499', status: 'pending', paidOn: '2025-05-25' },
  { id: 'TXN-88418', student: 'Sneha Gupta', amount: 999, formattedAmount: '₹ 999', status: 'success', paidOn: '2025-05-25' },
  { id: 'TXN-88417', student: 'Vikram Singh', amount: 4999, formattedAmount: '₹ 4,999', status: 'failed', paidOn: '2025-05-24' },
];

export const mockReferralConversions = [
  { code: 'REF-HYD2025', source: 'Partner', conversions: 128, revenue: 320000, formattedRevenue: '₹ 3,20,000' },
  { code: 'PROMO-NEET50', source: 'Promo Code', conversions: 96, revenue: 240000, formattedRevenue: '₹ 2,40,000' },
  { code: 'REF-BLR2025', source: 'Partner', conversions: 84, revenue: 210000, formattedRevenue: '₹ 2,10,000' },
  { code: 'PROMO-JEE30', source: 'Promo Code', conversions: 72, revenue: 180000, formattedRevenue: '₹ 1,80,000' },
  { code: 'REF-CHN2025', source: 'Partner', conversions: 56, revenue: 140000, formattedRevenue: '₹ 1,40,000' },
];

export const mockPerformanceMetrics = [
  { id: 'content', title: 'Total Content', value: 12568, subtitle: 'Study Materials', trend: 8.2, color: '#4f46e5', icon: 'HiOutlineCollection', sparkline: [40, 55, 45, 60, 50, 65, 58, 72, 68, 80] },
  { id: 'videos', title: 'Total Videos', value: 5432, subtitle: 'Videos', trend: 12.1, color: '#10b981', icon: 'HiOutlineFilm', sparkline: [30, 42, 38, 50, 45, 55, 52, 60, 58, 65] },
  { id: 'pdfs', title: 'Total PDFs', value: 6245, subtitle: 'PDF Files', trend: -3.4, color: '#ef4444', icon: 'HiOutlineDocument', sparkline: [50, 48, 52, 45, 40, 38, 42, 35, 30, 28] },
  { id: 'ebooks', title: 'E-books', value: 1245, subtitle: 'E-books', trend: 5.6, color: '#f59e0b', icon: 'HiOutlineBookOpen', sparkline: [20, 25, 22, 30, 28, 35, 32, 38, 36, 42] },
  { id: 'mindmaps', title: 'Mind Maps', value: 856, subtitle: 'Mind Maps', trend: 4.2, color: '#6b7280', icon: 'HiOutlineLightBulb', sparkline: [15, 18, 16, 22, 20, 25, 23, 28, 26, 30] },
  { id: 'papers', title: 'Prev. Papers', value: 745, subtitle: 'Previous Papers', trend: 6.8, color: '#1e3a8a', icon: 'HiOutlineClipboardList', sparkline: [10, 14, 12, 18, 16, 22, 20, 25, 23, 28] },
];

// export const mockUser = {
//   id: '1',
//   name: 'Super Admin',
//   email: 'superadmin@pakkapass.com',
//   initials: 'SA',
//   role: 'super_admin',
//   status: 'Online',
// };
