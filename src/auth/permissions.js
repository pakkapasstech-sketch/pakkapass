import { ROLES } from './roles';

export const PERMISSIONS = {
  STUDENT_VIEW: 'student.view',
  STUDENT_CREATE: 'student.create',
  STUDENT_EDIT: 'student.edit',
  STUDENT_DELETE: 'student.delete',
  COUPON_VIEW: 'coupon.view',
  COUPON_CREATE: 'coupon.create',
  COUPON_EDIT: 'coupon.edit',
  COUPON_DELETE: 'coupon.delete',
  COMMISSION_VIEW: 'commission.view',
  COMMISSION_EXPORT: 'commission.export',
  INSTITUTION_VIEW: 'institution.view',
  INSTITUTION_EDIT: 'institution.edit',
  RESOURCE_VIEW: 'resource.view',
  RESOURCE_CREATE: 'resource.create',
  RESOURCE_EDIT: 'resource.edit',
  RESOURCE_DELETE: 'resource.delete',
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ALL_PERMISSIONS,
  [ROLES.PARTNER]: [
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.STUDENT_CREATE,
    PERMISSIONS.STUDENT_EDIT,
    PERMISSIONS.COMMISSION_VIEW,
    PERMISSIONS.RESOURCE_VIEW,
    PERMISSIONS.RESOURCE_CREATE,
    PERMISSIONS.RESOURCE_EDIT,
  ],
  [ROLES.PARENT]: [PERMISSIONS.STUDENT_VIEW],
};

export const getPermissionsForRole = (role) => ROLE_PERMISSIONS[role] || [];

export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const perms = getPermissionsForRole(role);
  return perms.includes(permission);
};
