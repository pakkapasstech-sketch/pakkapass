import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { usePermissions } from './usePermissions';

const ProtectedRoute = ({ permission, permissions = [], roles = [], redirectTo = '/login' }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const { hasPermission, hasAnyPermission } = usePermissions();
  const location = useLocation();


  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permissions.length > 0 && !hasAnyPermission(...permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
