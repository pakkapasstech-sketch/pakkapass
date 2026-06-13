export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const NAVBAR_HEIGHT = 72;

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'HiOutlineViewGrid', path: '/' },
  { id: 'students', label: 'Students Management', icon: 'HiOutlineAcademicCap', path: '/students' },
  { id: 'parents', label: 'Parent Management', icon: 'HiOutlineUserGroup', path: '/parents' },
  {
    id: 'content',
    label: 'Content Management',
    icon: 'HiOutlineDocumentText',
    path: '/content',
    children: [
      { id: 'videos', label: 'Video Management', icon: 'HiOutlineFilm', path: '/content/videos' },
      { id: 'pdfs', label: 'PDF Management', icon: 'HiOutlineDocument', path: '/content/pdfs' },
    ],
  },
  { id: 'analytics', label: 'Analytics Center', icon: 'HiOutlineChartBar', path: '/analytics' },
  { id: 'subscriptions', label: 'Subscription Management', icon: 'HiOutlineCreditCard', path: '/subscriptions' },
  { id: 'payments', label: 'Payments & Revenue', icon: 'HiOutlineCurrencyRupee', path: '/payments' },
  { id: 'referrals', label: 'Referral & Promo Codes', icon: 'HiOutlineTag', path: '/referrals' },
  { id: 'partners', label: 'Partner Management', icon: 'HiOutlineBriefcase', path: '/partners' },
  { id: 'downloads', label: 'App Downloads', icon: 'HiOutlineDownload', path: '/downloads' },
  { id: 'notifications', label: 'Notifications', icon: 'HiOutlineBell', path: '/notifications' },
  { id: 'support', label: 'Support Center', icon: 'HiOutlineSupport', path: '/support' },
  { id: 'settings', label: 'Settings', icon: 'HiOutlineCog', path: '/settings' },
];

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  PARTNER: 'partner',
  SUPPORT: 'support',
};
