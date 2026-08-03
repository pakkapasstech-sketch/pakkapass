import { useMemo, useState, useEffect } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineDownload, HiOutlineCalendar, HiOutlineX } from 'react-icons/hi';
import { exportToExcel } from '../../utils/exportUtils';
//import StatusBadge from '../../components/tables/StatusBadge';
import ErrorState from '../../components/loaders/ErrorState';
import { useRecentPayments } from '../../hooks/useDashboard';
import { formatDate } from '../../utils/formatters';
import './recentPaymentsPage.css';
import '../../styles/student-table.css';
import '../../styles/table.css';
import StatisticCard from '../../components/cards/StatisticCard';
import { useLoading } from '../../contexts/LoadingContext';
import { useStudents, useStudentFilterOptions } from '../../hooks/useStudents';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import { useQuery } from '@tanstack/react-query';
import { getPlans } from '../../services/SubscriptionServices';
import { usePartners } from '../../hooks/usePartners';

const RecentPaymentsPage = () => {
  const { setLoading } = useLoading();
  const { data: payments = [], isLoading, isError, refetch } = useRecentPayments();
  const { data: students = [] } = useStudents();
  const { data: filterOptions } = useStudentFilterOptions();
  const { data: plansData = [] } = useQuery({ queryKey: ['plans'], queryFn: getPlans });
  const { data: partnersData } = usePartners({ limit: 1000 });
  const partners = partnersData?.partners || partnersData || [];

  const partnerMap = useMemo(() => {
    const map = {};
    if (Array.isArray(partners)) {
      partners.forEach((p) => {
        if (p.id) {
          map[String(p.id)] = p;
        }
      });
    }
    return map;
  }, [partners]);

  const planPriceMap = useMemo(() => {
    const map = {};
    plansData.forEach((p) => {
      if (p.name) {
        map[p.name.trim().toLowerCase()] = p.price;
      }
    });
    return map;
  }, [plansData]);

  const [search, setSearch] = useState('');

  const [selectedPlan, setSelectedPlan] = useState('All Plans');

  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const plans = useMemo(
    () => ['All Plans', ...new Set(payments.map((p) => p.plan).filter(Boolean))],
    [payments]
  );

  const getStudentForPayment = (payment) => {
    if (payment?.studentId) {
      const found = students.find((s) => Number(s.id) === Number(payment.studentId));
      if (found) return found;
    }
    if (payment?.student) {
      return students.find((s) => s.name?.trim().toLowerCase() === payment.student.trim().toLowerCase());
    }
    return null;
  };

  const studentPaymentCountMap = useMemo(() => {
    const map = {};
    payments.forEach((payment) => {
      let studentIdVal = payment.studentId;
      if (!studentIdVal && payment.student) {
        const found = students.find((s) => s.name?.trim().toLowerCase() === payment.student.trim().toLowerCase());
        studentIdVal = found?.id || payment.student;
      }
      if (studentIdVal) {
        map[studentIdVal] = (map[studentIdVal] || 0) + 1;
      }
    });
    return map;
  }, [payments, students]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchTerm = search.trim().toLowerCase();

      const sInfo = getStudentForPayment(payment);
      const studentIdVal = payment.studentId || sInfo?.id || '';
      const planPrice = planPriceMap[payment.plan?.trim().toLowerCase()];
      const partner = sInfo?.profile?.partnerId ? partnerMap[String(sInfo.profile.partnerId)] : null;
      const isDiscounted = planPrice ? (Number(planPrice) > Number(payment.amount)) : !!partner?.referralCode;
      const resolvedReferralCode = isDiscounted ? (partner?.referralCode || 'Null') : 'Null';

      const matchesSearch =
        searchTerm === '' ||
        String(studentIdVal)
          .toLowerCase()
          .includes(searchTerm) ||
        (payment.student || '').toLowerCase().includes(searchTerm) ||
        (payment.plan || '').toLowerCase().includes(searchTerm) ||
        String(payment.amount || '')
          .toLowerCase()
          .includes(searchTerm) ||
        resolvedReferralCode.toLowerCase().includes(searchTerm) ||
        (payment.status || '').toLowerCase().includes(searchTerm) ||
        (payment.date ? formatDate(payment.date).toLowerCase() : '').includes(searchTerm);

      const matchesPlan = selectedPlan === 'All Plans' || payment.plan === selectedPlan;

      const matchesStatus = selectedStatus === 'All Status' || payment.status === selectedStatus;

      let matchesDate = true;
      const paymentDate = payment.date ? new Date(payment.date) : null;
      if (startDate) {
        matchesDate = matchesDate && paymentDate && paymentDate >= new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && paymentDate && paymentDate <= end;
      }

      return matchesSearch && matchesPlan && matchesStatus && matchesDate;
    });
  }, [payments, search, selectedPlan, selectedStatus, startDate, endDate, students, planPriceMap, partnerMap]);
  const onlineRevenue = useMemo(() => {
    return filteredPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [filteredPayments]);

  const offlineRevenue = useMemo(() => {
    if (!Array.isArray(plansData) || !Array.isArray(students)) return 0;
    const privatePlans = plansData.filter((plan) => plan.isPublic === false || plan.isPublic === 0);
    let totalOffline = 0;
    privatePlans.forEach((plan) => {
      const planPrice = Number(plan.price || 0);
      const planNameLower = plan.name?.trim().toLowerCase();
      const studentCount = students.filter((s) => {
        if (Number(s.planId) === Number(plan.id)) return true;
        if (planNameLower && s.plan?.trim().toLowerCase() === planNameLower) return true;
        return false;
      }).length;
      totalOffline += planPrice * studentCount;
    });
    return totalOffline;
  }, [plansData, students]);

  const totalRevenue = onlineRevenue + offlineRevenue;
  const totalDiscount = useMemo(() => {
    return filteredPayments.reduce((sum, payment) => {
      const planPrice = planPriceMap[payment.plan?.trim().toLowerCase()];
      if (planPrice) {
        const pPrice = Number(planPrice);
        const pAmount = Number(payment.amount);
        if (pPrice > pAmount) {
          return sum + (pPrice - pAmount);
        }
      }
      return sum;
    }, 0);
  }, [filteredPayments, planPriceMap]);

  const successfulPayments = filteredPayments.filter((payment) => payment.status === 'Success').length;

  const pendingPayments = filteredPayments.filter((payment) => payment.status === 'Pending').length;
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedPlan, selectedStatus, startDate, endDate]);

  const totalFiltered = filteredPayments.length;
  const totalPages = Math.ceil(totalFiltered / paymentsPerPage) || 1;
  const startIndex = (currentPage - 1) * paymentsPerPage;
  const endIndex = startIndex + paymentsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

useEffect(() => {
  setLoading(isLoading);

  return () => setLoading(false);
}, [isLoading, setLoading]);
  if (isError) {
    return <ErrorState message="Failed to load payments" onRetry={refetch} />;
  }

  return (
    <div className="dashboard-page">
      <div
        className="page-header flex justify-between items-start flex-wrap gap-6"
        style={{ marginBottom: '24px' }}
      >
        <div>
          <h1 className="page-title">
            Revenue and Payments
          </h1>
          <p
            className="page-subtitle"
            style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}
          >
            View transaction history, track subscription revenues, and export payment records.
          </p>
        </div>
        <div className="header-actions flex gap-4">
          {/* <button
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
          </button> */}
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
            onClick={() => {
              const exportCols = [
                { header: 'Transaction ID', accessor: (r) => r.transactionId || '—' },
                { header: 'Student', accessor: (r) => r.student },
                { header: 'Plan', accessor: (r) => r.plan },
                { header: 'Total Plan Amount', accessor: (r) => `₹${planPriceMap[r.plan?.trim().toLowerCase()] ?? r.amount}` },
                { header: 'Actual Amount Paid', accessor: (r) => `₹${r.amount}` },
                { header: 'Discount Value', accessor: (r) => {
                  const planPrice = planPriceMap[r.plan?.trim().toLowerCase()];
                  const sInfo = getStudentForPayment(r);
                  const partner = sInfo?.profile?.partnerId ? partnerMap[String(sInfo.profile.partnerId)] : null;
                  const isDiscounted = planPrice ? (Number(planPrice) > Number(r.amount)) : !!partner?.referralCode;
                  if (isDiscounted) {
                    if (partner) {
                      return partner.discountType === 'Percentage Based' ? `${partner.discountValue}%` : `₹${partner.discountValue}`;
                    }
                    return `₹${Number(planPrice) - Number(r.amount)}`;
                  }
                  return '—';
                }},
                { header: 'Referral Code', accessor: (r) => {
                  const planPrice = planPriceMap[r.plan?.trim().toLowerCase()];
                  const sInfo = getStudentForPayment(r);
                  const partner = sInfo?.profile?.partnerId ? partnerMap[String(sInfo.profile.partnerId)] : null;
                  const isDiscounted = planPrice ? (Number(planPrice) > Number(r.amount)) : !!partner?.referralCode;
                  return isDiscounted ? (partner?.referralCode || 'Null') : 'Null';
                }},
                { header: 'Total Payments Made', accessor: (r) => {
                  const sInfo = getStudentForPayment(r);
                  const studentIdVal = r.studentId || sInfo?.id || r.student;
                  return studentPaymentCountMap[studentIdVal] || 1;
                }},
                { header: 'Status', accessor: (r) => r.status },
                { header: 'Date', accessor: (r) => formatDate(r.date) },
              ];

              const summaryData = [
                { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}` },
                { label: 'Online Revenue', value: `₹${onlineRevenue.toLocaleString('en-IN')}` },
                { label: 'Offline Revenue', value: `₹${offlineRevenue.toLocaleString('en-IN')}` },
                { label: 'Total Amount Discounted', value: `₹${totalDiscount.toLocaleString('en-IN')}` },
                { label: 'Successful Payments', value: successfulPayments },
              ];

              exportToExcel(filteredPayments, exportCols, 'payments.xlsx', summaryData);
            }}
          >
            <HiOutlineDownload />
            Export
          </button>
        </div>
      </div>
      <div className="dashboard-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <StatisticCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          topRight={
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                gap: '3px 8px',
                alignItems: 'center',
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              <span>Online</span>
              <span>=</span>
              <span>₹{onlineRevenue.toLocaleString('en-IN')}</span>

              <span>Offline</span>
              <span>=</span>
              <span>₹{offlineRevenue.toLocaleString('en-IN')}</span>
            </div>
          }
          icon="commissions"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatisticCard
          title="Total Amount Discounted"
          value={`₹${totalDiscount.toLocaleString('en-IN')}`}
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
      </div>
      <div className="payments-filters">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          options={['All Status', 'Success', 'Pending', 'Failed']}
          onChange={setSelectedStatus}
        />

        <button
          type="button"
          onClick={() => setIsDateModalOpen(true)}
          style={{
            height: '52px',
            width: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {startDate || endDate ? 'Date Filter Applied' : 'Filter by Date'}
          </span>
          <HiOutlineCalendar size={18} />
        </button>
      </div>

      {isDateModalOpen && (
        <div className="payment-modal-overlay" onClick={() => setIsDateModalOpen(false)} style={{ zIndex: 1000 }}>
          <div className="payment-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="payment-modal-header">
              <h2>Select Date Range</h2>
              <button
                type="button"
                className="payment-modal-close"
                onClick={() => setIsDateModalOpen(false)}
                aria-label="Close modal"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px' }}
              >
                <HiOutlineX />
              </button>
            </div>
            <div className="payment-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500', color: 'var(--color-text-primary)' }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500', color: 'var(--color-text-primary)' }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setIsDateModalOpen(false);
                  }}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsDateModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--color-primary, #6653AF)', color: '#fff', cursor: 'pointer', fontWeight: '600' }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="student-table-card">
        <div className="student-table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th className="student-col-index">ID</th>
                <th>Student</th>
                <th style={{ textAlign: 'center' }}>Plan</th>
                <th>Total Plan Amount</th>
                <th>Actual Amount Paid</th>
                <th>Discount Value</th>
                <th>Referral Code</th>
                <th>Total Payments Made</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment, index) => {
                  const sInfo = getStudentForPayment(payment);
                  const displayStudentId = payment.studentId || sInfo?.id || '—';
                  const planPrice = planPriceMap[payment.plan?.trim().toLowerCase()];
                  const partner = sInfo?.profile?.partnerId ? partnerMap[String(sInfo.profile.partnerId)] : null;
                  const isDiscounted = planPrice ? (Number(planPrice) > Number(payment.amount)) : !!partner?.referralCode;
                  const referralCode = isDiscounted ? (partner?.referralCode || 'Null') : 'Null';
                  
                  // Calculate discount label
                  let discountLabel = '—';
                  if (isDiscounted) {
                    if (partner) {
                      if (partner.discountType === 'Percentage Based') {
                        discountLabel = `${Number(partner.discountValue).toFixed(2)}%`;
                      } else {
                        discountLabel = `₹${Number(partner.discountValue).toFixed(2)}`;
                      }
                    } else {
                      discountLabel = `₹${Number(Number(planPrice) - Number(payment.amount)).toFixed(2)}`;
                    }
                  }

                  return (
                    <tr key={payment.id || index} className="clickable-row" onClick={() => setSelectedPayment(payment)} style={{ cursor: 'pointer' }}>
                      <td>{displayStudentId}</td>
                      <td>
                        <div className="student-user">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(payment.student)}`}
                            alt=""
                            aria-hidden="true"
                            className="student-avatar"
                            width="40"
                            height="40"
                          />
                          <div>
                            <div className="student-name">{payment.student}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="plan-badge">{payment.plan}</span>
                      </td>
                      <td>₹{Number(planPriceMap[payment.plan?.trim().toLowerCase()] ?? payment.amount).toFixed(2)}</td>
                      <td>₹{Number(payment.amount).toFixed(2)}</td>
                      <td>{discountLabel}</td>
                      <td>{referralCode}</td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>{studentPaymentCountMap[displayStudentId] || 1}</td>
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
                  );
                })
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
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                aria-label="Previous Page"
              >
                <HiOutlineChevronLeft />
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'active-page' : ''}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                aria-label="Next Page"
              >
                <HiOutlineChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (() => {
        const studentInfo = getStudentForPayment(selectedPayment);
        const modalStudentId = selectedPayment.studentId || studentInfo?.id || '—';
        return (
          <div className="payment-modal-overlay" onClick={() => setSelectedPayment(null)}>
            <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="payment-modal-header">
                <h2>Payment Details</h2>
                <button
                  type="button"
                  className="payment-modal-close"
                  onClick={() => setSelectedPayment(null)}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>

              <div className="payment-modal-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Transaction ID</label>
                    <span>{selectedPayment.transactionId || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Student ID</label>
                    <span>{modalStudentId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Student Name</label>
                    <span>{selectedPayment.student}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Payments Made</label>
                    <span>{studentPaymentCountMap[modalStudentId || selectedPayment.student] || 1}</span>
                  </div>
                  <div className="detail-item">
                    <label>Class</label>
                    <span>{studentInfo?.class || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Board</label>
                    <span>{studentInfo?.board || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Branch</label>
                    <span>
                      {
                        studentInfo?.branch !== 'N/A' 
                          ? studentInfo?.branch 
                          : filterOptions?.branches?.find(b => b.id === studentInfo?.profile?.branchId)?.name || '—'
                      }
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Plan Name</label>
                    <span>{selectedPayment.plan}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Plan Amount</label>
                    <span>₹{Number(planPriceMap[selectedPayment.plan?.trim().toLowerCase()] ?? selectedPayment.amount).toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Actual Amount Paid</label>
                    <strong>₹{Number(selectedPayment.amount).toFixed(2)}</strong>
                  </div>
                  {(() => {
                    const planPrice = planPriceMap[selectedPayment.plan?.trim().toLowerCase()];
                    const partner = studentInfo?.profile?.partnerId ? partnerMap[String(studentInfo.profile.partnerId)] : null;
                    const isDiscounted = planPrice ? (Number(planPrice) > Number(selectedPayment.amount)) : !!partner?.referralCode;
                    if (!isDiscounted || !partner?.referralCode) return null;
                    return (
                      <>
                        <div className="detail-item">
                          <label>Discount Value</label>
                          <span>{(() => {
                            if (partner) {
                              return partner.discountType === 'Percentage Based' ? `${Number(partner.discountValue).toFixed(2)}%` : `₹${Number(partner.discountValue).toFixed(2)}`;
                            }
                            return `₹${Number(planPrice - selectedPayment.amount).toFixed(2)}`;
                          })()}</span>
                        </div>
                        <div className="detail-item">
                          <label>Referral Code</label>
                          <span>{partner.referralCode}</span>
                        </div>
                      </>
                    );
                  })()}
                  <div className="detail-item">
                    <label>Payment Status</label>
                    <span className={`status-badge ${
                      selectedPayment.status === 'Success'
                        ? 'status-active'
                        : selectedPayment.status === 'Failed'
                          ? 'status-inactive'
                          : 'status-pending'
                    }`}>
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Date</label>
                    <span>{formatDate(selectedPayment.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default RecentPaymentsPage;
