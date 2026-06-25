import { useMemo, useState, useEffect } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineDownload } from 'react-icons/hi';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';
import StatusBadge from '../../components/tables/StatusBadge';
import ErrorState from '../../components/loaders/ErrorState';
import { useRecentPayments } from '../../hooks/useDashboard';
import { formatDate } from '../../utils/formatters';
import './recentPaymentsPage.css';
import '../../styles/student-table.css';
import '../../styles/table.css';
import StatisticCard from '../../components/cards/StatisticCard';
import Loader from '../../components/common/Loader';
import { useStudents } from '../../hooks/useStudents';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
const RecentPaymentsPage = () => {
  const {
    data: payments = [],
    isLoading,
    isError,
    refetch,
  } = useRecentPayments();
  const { data: students = [] } = useStudents();
  console.log(students[0]);
  const [search, setSearch] =
    useState('');

  const [
    selectedPlan,
    setSelectedPlan,
  ] = useState('All Plans');

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState('All');

  const plans = useMemo(
    () => [
      'All Plans',
      ...new Set(
        payments
          .map((p) => p.plan)
          .filter(Boolean)
      ),
    ],
    [payments]
  );
const studentIdMap = useMemo(() => {
  const map = {};

  students
    .filter((student) => student?.name)
    .forEach((student) => {
      map[student.name.trim().toLowerCase()] = student.id;
    });

  return map;
}, [students]);
  const filteredPayments =
    useMemo(() => {
      return payments.filter(
        (payment) => {
          const searchTerm = search.trim().toLowerCase();

const matchesSearch =
  searchTerm === '' ||
  String(
    studentIdMap[payment.student?.trim().toLowerCase()] || ''
  )
    .toLowerCase()
    .includes(searchTerm) ||
  (payment.student || '')
    .toLowerCase()
    .includes(searchTerm) ||
  (payment.plan || '')
    .toLowerCase()
    .includes(searchTerm) ||
  String(payment.amount || '')
    .toLowerCase()
    .includes(searchTerm) ||
  (payment.referralCode || 'null')
    .toLowerCase()
    .includes(searchTerm) ||
  (payment.status || '')
    .toLowerCase()
    .includes(searchTerm) ||
  (payment.date
    ? formatDate(payment.date).toLowerCase()
    : ''
  ).includes(searchTerm);

          const matchesPlan =
            selectedPlan ===
              'All Plans' ||
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
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedPlan, selectedStatus]);

  const totalFiltered = filteredPayments.length;
  const totalPages = Math.ceil(totalFiltered / paymentsPerPage) || 1;
  const startIndex = (currentPage - 1) * paymentsPerPage;
  const endIndex = startIndex + paymentsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);
    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  };

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
      <div className="page-header flex justify-between items-start flex-wrap gap-6" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
            Payment and Revenue
          </h1>
          <p className="page-subtitle" style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            View transaction history, track subscription revenues, and export payment records.
          </p>
        </div>
        <div className="header-actions flex gap-4">
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{ height: '44px', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            onClick={() => {
              const exportCols = [
                { header: 'ID', accessor: (r) => r.id },
                { header: 'Student', accessor: (r) => r.student },
                { header: 'Plan', accessor: (r) => r.plan },
                { header: 'Amount', accessor: (r) => `₹${r.amount}` },
                { header: 'Referral Code', accessor: (r) => r.referralCode || 'Null' },
                { header: 'Status', accessor: (r) => r.status },
                { header: 'Date', accessor: (r) => formatDate(r.date) },
              ];
              exportToCSV(filteredPayments, exportCols, 'payments.csv');
            }}
          >
            <HiOutlineDownload />
            CSV
          </button>
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{ height: '44px', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            onClick={() => {
              const exportCols = [
                { header: 'ID', accessor: (r) => r.id },
                { header: 'Student', accessor: (r) => r.student },
                { header: 'Plan', accessor: (r) => r.plan },
                { header: 'Amount', accessor: (r) => `₹${r.amount}` },
                { header: 'Referral Code', accessor: (r) => r.referralCode || 'Null' },
                { header: 'Status', accessor: (r) => r.status },
                { header: 'Date', accessor: (r) => formatDate(r.date) },
              ];
              exportToExcel(filteredPayments, exportCols, 'payments.xlsx');
            }}
          >
            <HiOutlineDownload />
            Excel
          </button>
        </div>
      </div>
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

        <CommonFilterDropdown
  placeholder="All Plans"
  value={selectedPlan}
  options={plans}
  onChange={setSelectedPlan}
/>

        <CommonFilterDropdown
  placeholder="All Status"
  value={selectedStatus}
  options={[
    'All',
    'Success',
    'Pending',
    'Failed',
  ]}
  onChange={setSelectedStatus}
/>
      </div>

      <div className="student-table-card">

        <div className="student-table-wrapper">
          <table className="student-table">
            <thead>
  <tr>
    <th className="student-col-index">ID</th>
    <th>Student</th>
    <th>Plan</th>
    <th>Amount</th>
    <th>Referral Code</th>
    <th>Status</th>
    <th>Date</th>
  </tr>
</thead>
            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment, index) => (
                  <tr
                    key={payment.id || index}
                    className="clickable-row"
                  >
<td>
  {studentIdMap[payment.student?.trim().toLowerCase()] ?? "—"}
</td>                    <td>
                      <div className="student-user">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(payment.student)}`}
                          alt={payment.student}
                          className="student-avatar"
                        />
                        <div>
                          <div className="student-name">{payment.student}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="plan-badge">{payment.plan}</span>
                    </td>
                    <td>₹{payment.amount}</td>
                    <td>{payment.referralCode || 'Null'}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          payment.status === 'Success'
                            ? 'status-active'
                            : payment.status === 'Failed'
                              ? 'status-inactive'
                              : 'status-pending'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>{formatDate(payment.date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalFiltered > 0 && (
          <div className="pagination">
            <p>
              Showing {startIndex + 1} to {Math.min(endIndex, totalFiltered)} of {totalFiltered}{' '}
              payments
            </p>

            <div className="pagination-buttons">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                <HiOutlineChevronLeft />
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'active-page' : ''}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <HiOutlineChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPaymentsPage;