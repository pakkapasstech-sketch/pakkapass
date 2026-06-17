import { useAuth } from '../../auth/AuthProvider';
import { ROLES } from '../../auth/roles';
import AdminDashboard from './AdminDashboard';
import PartnerDashboard from './PartnerDashboard';
import ParentDashboard from './ParentDashboard';
import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSkeleton rows={8} />;

  switch (user?.role) {
    case ROLES.PARTNER:
      return <PartnerDashboard />;
    case ROLES.PARENT:
      return <ParentDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default DashboardPage;
