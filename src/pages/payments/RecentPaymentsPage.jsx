import {
  useMemo,
  useState,
} from 'react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/tables/StatusBadge';
import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import ErrorState from '../../components/loaders/ErrorState';
import { useRecentPayments } from '../../hooks/useDashboard';
import { formatDate } from '../../utils/formatters';
import './recentPaymentsPage.css';

const RecentPaymentsPage = () => {
  const {
    data: payments = [],
    isLoading,
    isError,
    refetch,
  } = useRecentPayments();

  const [search, setSearch] =
    useState('');

  const [
    selectedPlan,
    setSelectedPlan,
  ] = useState('All');

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState('All');

  const plans = useMemo(
    () => [
      'All',
      ...new Set(
        payments
          .map((p) => p.plan)
          .filter(Boolean)
      ),
    ],
    [payments]
  );

  const filteredPayments =
    useMemo(() => {
      return payments.filter(
        (payment) => {
          const matchesSearch =
            payment.student
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesPlan =
            selectedPlan ===
              'All' ||
            payment.plan ===
              selectedPlan;

          const matchesStatus =
            selectedStatus ===
              'All' ||
            payment.status ===
              selectedStatus;

          return (
            matchesSearch &&
            matchesPlan &&
            matchesStatus
          );
        }
      );
    }, [
      payments,
      search,
      selectedPlan,
      selectedStatus,
    ]);

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
    <div className="dashboard-page">
      <div className="payments-filters">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="payments-filter-input"
        />

        <select
          className="payments-filter-select"
          value={
            selectedPlan
          }
          onChange={(e) =>
            setSelectedPlan(
              e.target.value
            )
          }
        >
          {plans.map(
            (plan) => (
              <option
                key={plan}
                value={plan}
              >
                {plan}
              </option>
            )
          )}
        </select>

        <select
          className="payments-filter-select"
          value={
            selectedStatus
          }
          onChange={(e) =>
            setSelectedStatus(
              e.target.value
            )
          }
        >
          <option value="All">
            All Status
          </option>
          <option value="Success">
            Success
          </option>
          <option value="Pending">
            Pending
          </option>
          <option value="Failed">
            Failed
          </option>
        </select>
      </div>

      <DataTable
        title="Recent Payments"
        columns={columns}
        data={
          filteredPayments
        }
        pageSize={10}
      />
    </div>
  );
};

export default RecentPaymentsPage;