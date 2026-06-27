import '../../styles/DashboardPage.css';
import { useState } from 'react';
import StatisticCard from '../../components/cards/StatisticCard';
import AnalyticsCard from '../../components/cards/AnalyticsCard';
import { useNavigate } from 'react-router-dom';
//import SubscriptionGrowthChart from '../../components/charts/SubscriptionGrowthChart';
//import RevenueTrendChart from '../../components/charts/RevenueTrendChart';
//import StudentsByStateCard from '../../components/charts/StudentsByStateCard';
import StudentTable from '../students/StudentTable';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';
import { HiOutlineDownload } from 'react-icons/hi';
import '../../styles/table.css';
import '../../styles/student-table.css';
import StatusBadge from '../../components/tables/StatusBadge';
import Avatar from '../../components/common/Avatar';
import ErrorState from '../../components/loaders/ErrorState';
import Modal from '../../components/modals/Modal';
import { getPlans } from '../../services/SubscriptionServices';
import { useQuery } from '@tanstack/react-query';
import {
  useAdminDashboard,
  //useSubscriptionGrowth,
  //useRevenueTrend,
  //useStudentsByState,
  useRecentRegistrations,
  useRecentPayments,
  //useReferralConversions,
  //usePerformanceMetrics,
} from '../../hooks/useDashboard';
import { formatDate } from '../../utils/formatters';
import { useContent } from '../../hooks/useContent';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const stats = useAdminDashboard();
  //const growth = useSubscriptionGrowth();
  //const revenue = useRevenueTrend();
  //const states = useStudentsByState();
  const registrations = useRecentRegistrations();
  const payments = useRecentPayments();
  //const referrals = useReferralConversions();
  //const performance = usePerformanceMetrics();
  const {
  data: content = [],
  isLoading: contentLoading,
} = useContent();
const { data: plans = [], isLoading: plansLoading } = useQuery({
  queryKey: ['plans'],
  queryFn: getPlans,
});
const totalPlans = plans.length;
const cards =
  stats.data?.cards?.map((card) =>
    card.title === 'Plans'
      ? {
          ...card,
          value: totalPlans,
        }
      : card
  ) || [];
  const [modal, setModal] = useState({ open: false, row: null, type: '' });

  if (stats.isError) {
    return (
      <div className="dashboard-error">
        <ErrorState message="Failed to load dashboard" onRetry={() => stats.refetch()} />
      </div>
    );
  }


const totalContent =
  content.length;

const totalVideos =
  content.filter(
    (item) =>
      item.type ===
      'video'
  ).length;

const totalPDFs =
  content.filter(
    (item) =>
      item.type !==
      'video'
  ).length;

const totalEbooks =
  content.filter(
    (item) =>
      item.hierarchyType ===
      'Ebooks'
  ).length;

const totalMindMaps =
  content.filter(
    (item) =>
      item.hierarchyType ===
      'Mind Maps'
  ).length;

const totalPYQ =
  content.filter(
    (item) =>
      item.hierarchyType ===
      'PYQ'
  ).length;

  // const referralColumns = [
  //   { key: 'code', header: 'Referral Code', accessor: (r) => r.code },
  //   { key: 'partner', header: 'Partner', accessor: (r) => r.partner },
  //   { key: 'conversions', header: 'Conversions', accessor: (r) => r.conversions },
  //   { key: 'revenue', header: 'Revenue', accessor: (r) => `₹${r.revenue?.toLocaleString()}` },
  // ];
if ( stats.isLoading || registrations.isLoading || payments.isLoading || contentLoading || plansLoading) {
  return <Loader />;
}
  return (
    <div className="dashboard-page">
      <div className="dashboard-stats-grid">
        {(cards.length ? cards : Array.from({ length: 4 })).map(
  (card, i) => (
    <StatisticCard
      key={card?.id || i}
      {...card}
      isLoading={stats.isLoading || plansLoading}
    />
  )
)}
      </div>

      {/* <div className="dashboard-chart-grid">
        <SubscriptionGrowthChart data={growth.data} isLoading={growth.isLoading} />
        <RevenueTrendChart data={revenue.data} isLoading={revenue.isLoading} />
        <StudentsByStateCard data={states.data} isLoading={states.isLoading} />
      </div> */}

      <div className="dashboard-table-grid">
        {/* Recent Registrations Table using StudentTable */}
        <div className="data-table-container" style={{ minHeight: 'unset' }}>
          <div className="data-table-header">
            <h3 className="data-table-title">Recent Registrations</h3>
            <div className="data-table-toolbar">
              {/* <button
                onClick={() => {
                  const exportCols = [
                    { header: 'ID', accessor: (r) => r.id },
                    { header: 'Student Name', accessor: (r) => r.name },
                    { header: 'Class', accessor: (r) => r.class },
                    { header: 'Board', accessor: (r) => r.board },
                    { header: 'Institution', accessor: (r) => r.institution },
                    { header: 'REFCODE', accessor: (r) => r.referralCode || r.refCode || 'Null' },
                    { header: 'Subscription Plan', accessor: (r) => r.plan },
                    { header: 'Status', accessor: (r) => r.status },
                    { header: 'Registered On', accessor: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
                  ];
                  exportToCSV(registrations.data || [], exportCols, 'recent_registrations.csv');
                }}
                className="data-table-export-btn"
              >
                <HiOutlineDownload />
                CSV
              </button>
              <button
                onClick={() => {
                  const exportCols = [
                    { header: 'ID', accessor: (r) => r.id },
                    { header: 'Student Name', accessor: (r) => r.name },
                    { header: 'Class', accessor: (r) => r.class },
                    { header: 'Board', accessor: (r) => r.board },
                    { header: 'Institution', accessor: (r) => r.institution },
                    { header: 'REFCODE', accessor: (r) => r.referralCode || r.refCode || 'Null' },
                    { header: 'Subscription Plan', accessor: (r) => r.plan },
                    { header: 'Status', accessor: (r) => r.status },
                    { header: 'Registered On', accessor: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
                  ];
                  exportToExcel(registrations.data || [], exportCols, 'recent_registrations.xlsx');
                }}
                className="data-table-export-btn"
              >
                <HiOutlineDownload />
                Excel
              </button> */}
              <button
                className="data-table-view-all"
                onClick={() =>
                  navigate('/students', {
                    state: {
                      sortRecent: true,
                    },
                  })
                }
              >
                View All
              </button>
            </div>
          </div>
          <StudentTable students={registrations.data || []} noCard={true} hideInstitution={true} />
        </div>

        {/* Recent Payments Custom Table styled like StudentTable */}
        <div className="data-table-container" style={{ minHeight: 'unset' }}>
          <div className="data-table-header">
            <h3 className="data-table-title">Recent Payments</h3>
            <div className="data-table-toolbar">
              {/* <button
                onClick={() => {
                  const exportCols = [
                    { header: 'Student', accessor: (r) => r.student },
                    { header: 'Plan', accessor: (r) => r.plan },
                    { header: 'Amount', accessor: (r) => `₹${r.amount}` },
                    { header: 'Referral Code', accessor: (r) => r.referralCode || 'Null' },
                    { header: 'Status', accessor: (r) => r.status },
                    { header: 'Date', accessor: (r) => formatDate(r.date) },
                  ];
                  exportToCSV(payments.data || [], exportCols, 'recent_payments.csv');
                }}
                className="data-table-export-btn"
              >
                <HiOutlineDownload />
                CSV
              </button> */}
              {/* <button
                onClick={() => {
                  const exportCols = [
                    { header: 'Student', accessor: (r) => r.student },
                    { header: 'Plan', accessor: (r) => r.plan },
                    { header: 'Amount', accessor: (r) => `₹${r.amount}` },
                    { header: 'Referral Code', accessor: (r) => r.referralCode || 'Null' },
                    { header: 'Status', accessor: (r) => r.status },
                    { header: 'Date', accessor: (r) => formatDate(r.date) },
                  ];
                  exportToExcel(payments.data || [], exportCols, 'recent_payments.xlsx');
                }}
                className="data-table-export-btn"
              >
                <HiOutlineDownload />
                Excel
              </button> */}
              <button
                className="data-table-view-all"
                onClick={() => navigate('/payments')}
              >
                View All
              </button>
            </div>
          </div>

          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }} className="student-col-index"></th>
                  <th style={{ width: '25%', minWidth: '130px' }}>Student</th>
                  <th style={{ width: '15%', minWidth: '80px' }}>Plan</th>
                  <th style={{ width: '12%', minWidth: '70px' }}>Amount</th>
                  <th style={{ width: '18%', minWidth: '110px' }}>Referral Code</th>
                  <th style={{ width: '15%', minWidth: '85px' }}>Status</th>
                  <th style={{ width: '15%', minWidth: '100px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.data && payments.data.length > 0 ? (
                  payments.data.slice(0, 5).map((payment, index) => (
                    <tr
                      key={payment.id || index}
                      className="clickable-row"
                      onClick={() => navigate(`/payments`)}
                    >
                      <td>{index + 1}</td>
                      <td>
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
                    <td colSpan="7" className="empty-table">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="dashboard-performance-grid">
  <AnalyticsCard
    title="Total Content"
    value={totalContent}
    subtitle="Uploaded files"
    color="#6366f1"
    icon="collection"
    isLoading={
      contentLoading
    }
  />

  <AnalyticsCard
    title="Total Videos"
    value={totalVideos}
    subtitle="Uploaded videos"
    color="#ef4444"
    icon="film"
    isLoading={
      contentLoading
    }
  />

  <AnalyticsCard
    title="Total PDFs"
    value={totalPDFs}
    subtitle="Uploaded PDFs"
    color="#f59e0b"
    icon="document"
    isLoading={
      contentLoading
    }
  />

  <AnalyticsCard
    title="E-books"
    value={totalEbooks}
    subtitle="E-book files"
    color="#10b981"
    icon="book-open"
    isLoading={
      contentLoading
    }
  />

  <AnalyticsCard
    title="Mind Maps"
    value={totalMindMaps}
    subtitle="Mind map files"
    color="#8b5cf6"
    icon="light-bulb"
    isLoading={
      contentLoading
    }
  />

  <AnalyticsCard
    title="Prev. Papers"
    value={totalPYQ}
    subtitle="Previous year papers"
    color="#06b6d4"
    icon="clipboard-list"
    isLoading={
      contentLoading
    }
  />
</div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={`${modal.type} Details`}>
        <pre className="dashboard-modal-content">{JSON.stringify(modal.row, null, 2)}</pre>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
