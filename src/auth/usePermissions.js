import { useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { hasPermission as checkPermission, getPermissionsForRole } from './permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const role = user?.role;

  const permissions = useMemo(() => getPermissionsForRole(role), [role]);

  const hasPermission = (permission) => checkPermission(role, permission);

  const hasAnyPermission = (...perms) => perms.some((p) => hasPermission(p));

  const hasAllPermissions = (...perms) => perms.every((p) => hasPermission(p));

  return { permissions, hasPermission, hasAnyPermission, hasAllPermissions, role };
};

export default usePermissions;
