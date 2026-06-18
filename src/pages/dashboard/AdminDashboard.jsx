import '../../styles/DashboardPage.css';
import { useState } from 'react';
import StatisticCard from '../../components/cards/StatisticCard';
import AnalyticsCard from '../../components/cards/AnalyticsCard';
import SubscriptionGrowthChart from '../../components/charts/SubscriptionGrowthChart';
import RevenueTrendChart from '../../components/charts/RevenueTrendChart';
import StudentsByStateCard from '../../components/charts/StudentsByStateCard';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/tables/StatusBadge';
import Avatar from '../../components/common/Avatar';
import ErrorState from '../../components/loaders/ErrorState';
import Modal from '../../components/modals/Modal';
import {
  useAdminDashboard,
  useSubscriptionGrowth,
  useRevenueTrend,
  useStudentsByState,
  useRecentRegistrations,
  useRecentPayments,
  useReferralConversions,
  usePerformanceMetrics,
} from '../../hooks/useDashboard';
import { formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const stats = useAdminDashboard();
  const growth = useSubscriptionGrowth();
  const revenue = useRevenueTrend();
  const states = useStudentsByState();
  const registrations = useRecentRegistrations();
  const payments = useRecentPayments();
  const referrals = useReferralConversions();
  const performance = usePerformanceMetrics();
  const [modal, setModal] = useState({ open: false, row: null, type: '' });

  if (stats.isError) {
    return (
      <div className="dashboard-error">
        <ErrorState message="Failed to load dashboard" onRetry={() => stats.refetch()} />
      </div>
    );
  }

  const registrationColumns = [
    { key: 'name', header: 'Student Name', sortable: true, accessor: (r) => r.name, render: (r) => (
      <div className="dashboard-student-cell"><Avatar initials={r.avatar} size="sm" /><span>{r.name}</span></div>
    )},
    { key: 'email', header: 'Email', accessor: (r) => r.email },
    { key: 'date', header: 'Date', accessor: (r) => formatDate(r.date) },
  ];

  const paymentColumns = [
    { key: 'student', header: 'Student', accessor: (r) => r.student },
    { key: 'plan', header: 'Plan', accessor: (r) => r.plan },
    { key: 'amount', header: 'Amount', accessor: (r) => `₹${r.amount}` },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'date', header: 'Date', accessor: (r) => formatDate(r.date) },
  ];

  const referralColumns = [
    { key: 'code', header: 'Referral Code', accessor: (r) => r.code },
    { key: 'partner', header: 'Partner', accessor: (r) => r.partner },
    { key: 'conversions', header: 'Conversions', accessor: (r) => r.conversions },
    { key: 'revenue', header: 'Revenue', accessor: (r) => `₹${r.revenue?.toLocaleString()}` },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-stats-grid">
        {(stats.data?.cards || Array.from({ length: 5 })).map((card, i) => (
          <StatisticCard key={card?.id || i} {...card} isLoading={stats.isLoading} />
        ))}
      </div>

      <div className="dashboard-chart-grid">
        <SubscriptionGrowthChart data={growth.data} isLoading={growth.isLoading} />
        <RevenueTrendChart data={revenue.data} isLoading={revenue.isLoading} />
        <StudentsByStateCard data={states.data} isLoading={states.isLoading} />
      </div>

      <div className="dashboard-table-grid">
        <DataTable title="Recent Registrations" columns={registrationColumns} data={registrations.data || []} isLoading={registrations.isLoading} viewAllLink />
        <DataTable title="Recent Payments" columns={paymentColumns} data={payments.data || []} isLoading={payments.isLoading} viewAllLink />
        <DataTable title="Referral Conversions" columns={referralColumns} data={referrals.data || []} isLoading={referrals.isLoading} viewAllLink />
      </div>

      <div className="dashboard-performance-grid">
  {(performance.data || []).map(
    (m, i) => (
      <AnalyticsCard
        key={m.id || i}
        {...m}
        isLoading={
          performance.isLoading
        }
      />
    )
  )}
</div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={`${modal.type} Details`}>
        <pre className="dashboard-modal-content">{JSON.stringify(modal.row, null, 2)}</pre>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
