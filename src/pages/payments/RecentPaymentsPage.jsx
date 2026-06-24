import {
  useMemo,
  useState,
} from 'react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/tables/StatusBadge';

import ErrorState from '../../components/loaders/ErrorState';
import { useRecentPayments } from '../../hooks/useDashboard';
import { formatDate } from '../../utils/formatters';
import './recentPaymentsPage.css';
import StatisticCard from '../../components/cards/StatisticCard';
import Loader from '../../components/common/Loader';
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
    const totalRevenue = payments.reduce(
  (sum, payment) =>
    sum + Number(payment.amount || 0),
  0
);

const totalPayments =
  payments.length;

const successfulPayments =
  payments.filter(
    (payment) =>
      payment.status ===
      'Success'
  ).length;

const pendingPayments =
  payments.filter(
    (payment) =>
      payment.status ===
      'Pending'
  ).length;
  const columns = [
    {
  key: 'id',
  header: 'Student ID',
  accessor: (r) =>
    r.id || '—',
},
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
    return <Loader />;
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
      <div className="dashboard-stats-grid">
  <StatisticCard
    title="Total Revenue"
    value={`₹${totalRevenue.toLocaleString(
      'en-IN'
    )}`}
    icon="commissions"
    iconBg="bg-green-100"
    iconColor="text-green-600"
  />

  <StatisticCard
    title="Total Payments"
    value={totalPayments}
    icon="subscriptions"
    iconBg="bg-blue-100"
    iconColor="text-blue-600"
  />

  <StatisticCard
    title="Successful Payments"
    value={successfulPayments}
    icon="success"
    iconBg="bg-emerald-100"
    iconColor="text-emerald-600"
  />

  <StatisticCard
    title="Pending Payments"
    value={pendingPayments}
    icon="clock"
    iconBg="bg-yellow-100"
    iconColor="text-yellow-600"
  />
</div>
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