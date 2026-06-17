import { PERMISSIONS } from '../auth/permissions';

export const MENU_ITEMS = [
  { title: 'Dashboard', path: '/dashboard', icon: 'dashboard', permission: null },
  { title: 'Students', path: '/students', icon: 'students', permission: PERMISSIONS.STUDENT_VIEW },
  { title: 'Parents', path: '/parents', icon: 'parents', permission: PERMISSIONS.STUDENT_VIEW, roles: ['ADMIN'] },
  { title: 'Partners', path: '/partners', icon: 'partners', permission: PERMISSIONS.INSTITUTION_VIEW },
  { title: 'Content', path: '/content', icon: 'content', permission: PERMISSIONS.RESOURCE_VIEW },
  { title: 'Subscriptions', path: '/subscriptions', icon: 'subscriptions', permission: PERMISSIONS.COUPON_VIEW, roles: ['ADMIN'] },
  //{ title: 'Commissions', path: '/commissions', icon: 'commissions', permission: PERMISSIONS.COMMISSION_VIEW },
  //{ title: 'Coupons', path: '/coupons', icon: 'coupons', permission: PERMISSIONS.COUPON_VIEW, roles: ['ADMIN'] },
  { title: 'Notifications', path: '/notifications', icon: 'notifications', permission: null },
  { title: 'Support', path: '/support', icon: 'support', permission: null },
  { title: 'Settings', path: '/settings', icon: 'settings', permission: null },
];

export const getMenuForUser = (role, hasPermission) =>
  MENU_ITEMS.filter((item) => {
    if (item.roles && !item.roles.includes(role)) return false;
    if (item.permission && !hasPermission(item.permission)) return false;
    return true;
  });

export const getDefaultRoute = (role) => {
  if (role === 'PARTNER') return '/dashboard';
  if (role === 'PARENT') return '/dashboard';
  return '/dashboard';
};
