import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/tables/StatusBadge';
import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import ErrorState from '../../components/loaders/ErrorState';
import { useRecentPayments } from '../../hooks/useDashboard';
import { formatDate } from '../../utils/formatters';

const RecentPaymentsPage = () => {
  const {
    data: payments = [],
    isLoading,
    isError,
    refetch,
  } = useRecentPayments();

  const columns = [
    {
      key: 'student',
      header: 'Student',
      accessor: (r) =>
        r.student,
    },
    {
      key: 'plan',
      header: 'Plan',
      accessor: (r) =>
        r.plan,
    },
    {
      key: 'amount',
      header: 'Amount',
      accessor: (r) =>
        `₹${r.amount}`,
    },
    {
      key: 'referralCode',
      header:
        'Referral Code',
      accessor: (r) =>
        r.referralCode ||
        'Null',
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <StatusBadge
          status={r.status}
        />
      ),
    },
    {
      key: 'date',
      header: 'Date',
      accessor: (r) =>
        formatDate(r.date),
    },
  ];

  if (isLoading) {
    return (
      <LoadingSkeleton
        rows={8}
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load payments"
        onRetry={
          refetch
        }
      />
    );
  }

  return (
    <div
      className="dashboard-page"
    >
      <DataTable
        title="Recent Payments"
        columns={columns}
        data={payments}
        pageSize={10}
      />
    </div>
  );
};

export default RecentPaymentsPage;