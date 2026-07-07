import { useMemo, useState, useEffect } from 'react';
import {
  HiOutlineSearch,
  HiOutlineDownload,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';

import StatisticCard from '../../components/cards/StatisticCard';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import {
  exportToCSV,
  exportToExcel,
} from '../../utils/exportUtils';

import '../../styles/student-table.css';
import '../../styles/ParentsManagement.css';
import partnerService from '../../services/partner.service';



const PartnerPaymentsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);

  const plans = useMemo(
    () => ['All Plans', ...new Set(payments.map((p) => p.plan).filter(Boolean))],
    [payments]
  );

const [summary, setSummary] = useState({
  totalPayments: 0,
  paid: 0,
  pending: 0,
  failed: 0,
  revenue: 0,
});
  const paymentsPerPage = 5;
  useEffect(() => {
  const loadPayments = async () => {
    try {
      const data = await partnerService.getPayments();

      setPayments(data.payments || []);
      setSummary(data.summary || {});
    } catch (err) {
      console.error(err);
    }
  };

  loadPayments();
}, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, planFilter]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        searchTerm === '' ||
        payment.student.toLowerCase().includes(searchTerm) ||
        payment.referralCode.toLowerCase().includes(searchTerm) ||
        payment.id.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === '' ||
        payment.status === statusFilter;

      const matchesPlan =
        planFilter === '' ||
        payment.plan === planFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan
      );
    });
  }, [payments, search, statusFilter, planFilter]);

  const totalPayments = filteredPayments.length;

  const totalPages =
    Math.ceil(totalPayments / paymentsPerPage) || 1;

  const startIndex =
    (currentPage - 1) * paymentsPerPage;

  const endIndex =
    startIndex + paymentsPerPage;

  const currentPayments =
    filteredPayments.slice(
      startIndex,
      endIndex
    );

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  };

  const exportColumns = [
    {
      header: 'Payment ID',
      accessor: (r) => r.id,
    },
    {
      header: 'Student',
      accessor: (r) => r.student,
    },
    {
      header: 'Plan',
      accessor: (r) => r.plan,
    },
    {
      header: 'Amount',
      accessor: (r) => r.amount,
    },
    
    {
      header: 'Status',
      accessor: (r) => r.status,
    },
    {
      header: 'Payment Date',
      accessor: (r) => r.paymentDate,
    },
  ];

  return (
    <div className="parents-page">
      <div className="page-header flex justify-between items-start flex-wrap gap-6">
        <div>
          <h1 className="page-title">
            Payments
          </h1>

          <p className="page-subtitle">
            Payments made by students using your referral code.
          </p>
        </div>

        <div className="header-actions flex gap-4">
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{
              height: '44px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() =>
              exportToCSV(
                filteredPayments,
                exportColumns,
                'partner-payments.csv'
              )
            }
          >
            <HiOutlineDownload />
            CSV
          </button>

          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{
              height: '44px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() =>
              exportToExcel(
                filteredPayments,
                exportColumns,
                'partner-payments.xlsx'
              )
            }
          >
            <HiOutlineDownload />
            Excel
          </button>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <StatisticCard
  title="Total Payments"
  value={summary.totalPayments}
  icon="commissions"
  iconBg="bg-blue-100"
  iconColor="text-blue-600"
/>

        <StatisticCard
          title="Paid"
          value={summary.paid}
          icon="commissions"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatisticCard
          title="Pending"
          value={summary.pending}
          icon="commissions"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <StatisticCard
          title="Revenue"
          value={`₹${summary.revenue.toLocaleString()}`}
          icon="commissions"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="parents-toolbar">
        <div className="search-box">
          <HiOutlineSearch />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <CommonFilterDropdown
          placeholder="All Plans"
          value={planFilter || 'All Plans'}
          options={plans}
          onChange={(value) =>
            setPlanFilter(
              value === 'All Plans'
                ? ''
                : value
            )
          }
        />

        <CommonFilterDropdown
          placeholder="All Status"
          value={statusFilter || 'All Status'}
          options={[
            'All Status',
            'Paid',
            'Pending',
            'Failed',
          ]}
          onChange={(value) =>
            setStatusFilter(
              value === 'All Status'
                ? ''
                : value
            )
          }
        />
      </div>
            <div className="parents-table-wrapper">
        <table className="parents-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Student</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>

                  <td>{payment.student}</td>

                  <td>{payment.plan}</td>

                  <td>
₹{Number(payment.amount).toLocaleString()}                  </td>


                  <td>
                    <span
                      className={`status-badge ${
                        payment.status === 'Success'
                          ? 'active'
                          : payment.status === 'Pending'
                          ? 'pending'
                          : 'inactive'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

<td>
  {new Date(payment.paymentDate).toLocaleDateString()}
</td>                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="empty-table"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPayments > 0 && (
          <div className="pagination">
            <p>
              Showing {startIndex + 1} to{' '}
              {Math.min(endIndex, totalPayments)} of{' '}
              {totalPayments} payments
            </p>

            <div className="pagination-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
              >
                <HiOutlineChevronLeft />
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={
                    currentPage === page
                      ? 'active-page'
                      : ''
                  }
                >
                  {page}
                </button>
              ))}

              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
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

export default PartnerPaymentsPage;