import '../../styles/DashboardPage.css';
import StatisticCard from '../../components/cards/StatisticCard';
import ErrorState from '../../components/loaders/ErrorState';
import DataTable from '../../components/tables/DataTable';
import { usePartnerDashboard } from '../../hooks/useDashboard';

const PartnerDashboard = () => {
  const { data, isLoading, isError, refetch } = usePartnerDashboard();

  if (isError) {
    return <ErrorState message="Failed to load partner dashboard" onRetry={refetch} />;
  }

  const analytics = data?.analytics || {};
  const partner = data?.partner || {};

  const statCards = [
    { id: 'total', title: 'Students Referred', formattedValue: String(analytics.students?.totalStudents ?? 0), trend: 0, trendLabel: 'total', trendUp: true, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', icon: 'students' },
    { id: 'active', title: 'Active Students', formattedValue: String(analytics.students?.activeStudents ?? 0), trend: 0, trendLabel: 'active', trendUp: true, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: 'students' },
    { id: 'revenue', title: 'Total Revenue', formattedValue: `₹${(analytics.revenue?.totalRevenue ?? 0).toLocaleString()}`, trend: 0, trendLabel: 'generated', trendUp: true, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', icon: 'commissions' },
    { id: 'commission', title: 'Pending Commission', formattedValue: `₹${(analytics.revenue?.pendingCommission ?? 0).toLocaleString()}`, trend: 0, trendLabel: 'pending', trendUp: true, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', icon: 'commissions' },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header-inline">
        <h2>{partner.organizationName || 'Partner Dashboard'}</h2>
        <p>Referral Code: <strong>{partner.referralCode || 'N/A'}</strong></p>
      </div>

      <div className="dashboard-stats-grid">
        {statCards.map((card) => (
          <StatisticCard key={card.id} {...card} isLoading={isLoading} />
        ))}
      </div>

      <div className="partner-referral-card">
        <h3>Your Referral Message</h3>
        <p>{partner.referralMessage || 'Referral message will appear here once configured.'}</p>
      </div>

      <div className="dashboard-table-grid">
        <DataTable
          title="Commission Summary"
          columns={[
            { key: 'label', header: 'Metric', accessor: (r) => r.label },
            { key: 'value', header: 'Value', accessor: (r) => r.value },
          ]}
          data={[
            { label: 'Total Commission Earned', value: `₹${(analytics.revenue?.totalCommissionEarned ?? 0).toLocaleString()}` },
            { label: 'Total Commission Paid', value: `₹${(analytics.revenue?.totalCommissionPaid ?? 0).toLocaleString()}` },
            { label: 'Monthly Registrations', value: analytics.students?.monthlyRegistrations ?? 0 },
            { label: 'Monthly Revenue', value: `₹${(analytics.revenue?.monthlyRevenue ?? 0).toLocaleString()}` },
          ]}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PartnerDashboard;
