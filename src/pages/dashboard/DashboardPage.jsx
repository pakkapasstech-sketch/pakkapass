import '../../styles/DashboardPage.css';

import toast from 'react-hot-toast';
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
  useDashboardStats,
  useSubscriptionGrowth,
  useRevenueTrend,
  useStudentsByState,
  useRecentRegistrations,
  useRecentPayments,
  useReferralConversions,
  usePerformanceMetrics,
} from '../../hooks/useDashboard';

import { formatDate } from '../../utils/formatters';

const DashboardPage = () => {
  const stats = useDashboardStats();
  const growth = useSubscriptionGrowth();
  const revenue = useRevenueTrend();
  const states = useStudentsByState();
  const registrations = useRecentRegistrations();
  const payments = useRecentPayments();
  const referrals = useReferralConversions();
  const performance = usePerformanceMetrics();

  const [modal, setModal] = useState({
    open: false,
    row: null,
    type: '',
  });

  const hasError = [stats, growth, revenue].some(
    (q) => q.isError
  );

  if (hasError) {
    return (
      <div className="dashboard-error">
        <ErrorState
          message="Failed to load dashboard"
          onRetry={() => stats.refetch()}
        />
      </div>
    );
  }

  const registrationColumns = [
  {
    key: 'name',
    header: 'Student Name',
    sortable: true,
    accessor: (r) => r.name,
    render: (r) => (
      <div className="dashboard-student-cell">
        <Avatar initials={r.avatar} size="sm" />
        <span className="dashboard-student-name">
          {r.name}
        </span>
      </div>
    ),
  },
  {
    key: 'class',
    header: 'Class',
    sortable: true,
    accessor: (r) => r.class,
  },
  {
    key: 'board',
    header: 'Board',
    sortable: true,
    accessor: (r) => r.board,
  },
  {
    key: 'registeredOn',
    header: 'Date',
    sortable: true,
    accessor: (r) => formatDate(r.registeredOn),
  },
];

  const paymentColumns = [
    {
      key: 'id',
      header: 'Transaction ID',
      sortable: true,
      accessor: (r) => r.id,
    },
    {
      key: 'student',
      header: 'Student',
      accessor: (r) => r.student,
    },
    {
      key: 'amount',
      header: 'Amount',
      accessor: (r) => r.formattedAmount,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => r.status,
      render: (r) => (
        <StatusBadge status={r.status} />
      ),
    },
    {
      key: 'paidOn',
      header: 'Paid On',
      accessor: (r) => formatDate(r.paidOn),
    },
  ];

  const referralColumns = [
    {
      key: 'code',
      header: 'Referral Code',
      accessor: (r) => r.code,
      render: (r) => (
        <span className="dashboard-referral-code">
          {r.code}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      accessor: (r) => r.source,
    },
    {
      key: 'conversions',
      header: 'Conversions',
      sortable: true,
      accessor: (r) => r.conversions,
    },
    {
      key: 'revenue',
      header: 'Revenue',
      accessor: (r) => r.formattedRevenue,
    },
  ];

  const handleAction = (type, row) => {
    setModal({
      open: true,
      row,
      type,
    });

    toast.success(
      `${type} action for ${row.name || row.id}`
    );
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-stats-grid">
        {(stats.data || Array.from({ length: 8 })).map(
          (card, i) => (
            <StatisticCard
              key={card?.id || i}
              {...card}
              isLoading={stats.isLoading}
            />
          )
        )}
      </div>

      <div className="dashboard-chart-grid">
        <SubscriptionGrowthChart
          data={growth.data}
          isLoading={growth.isLoading}
        />

        <RevenueTrendChart
          data={revenue.data}
          isLoading={revenue.isLoading}
        />

        <StudentsByStateCard
          data={states.data}
          isLoading={states.isLoading}
        />
      </div>

      <div className="dashboard-table-grid">
        <DataTable
          title="Recent Registrations"
          columns={registrationColumns}
          data={registrations.data || []}
          isLoading={registrations.isLoading}
          viewAllLink
          actions
          onView={(r) => handleAction('View', r)}
          onEdit={(r) => handleAction('Edit', r)}
          onDelete={(r) => handleAction('Delete', r)}
        />

        <DataTable
          title="Recent Payments"
          columns={paymentColumns}
          data={payments.data || []}
          isLoading={payments.isLoading}
          viewAllLink
        />

        <DataTable
          title="Referral Conversions"
          columns={referralColumns}
          data={referrals.data || []}
          isLoading={referrals.isLoading}
          viewAllLink
        />
      </div>

      <div className="dashboard-performance-grid">
        {(performance.data || []).map((m) => (
          <AnalyticsCard
            key={m.id}
            {...m}
            isLoading={performance.isLoading}
          />
        ))}
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() =>
          setModal({
            open: false,
          })
        }
        title={`${modal.type} Details`}
      >
        <pre className="dashboard-modal-content">
          {JSON.stringify(modal.row, null, 2)}
        </pre>
      </Modal>
    </div>
  );
};

export default DashboardPage;