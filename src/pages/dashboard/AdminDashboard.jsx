import '../../styles/DashboardPage.css';
import { useState } from 'react';
import StatisticCard from '../../components/cards/StatisticCard';
import AnalyticsCard from '../../components/cards/AnalyticsCard';
import { useNavigate } from 'react-router-dom';
//import SubscriptionGrowthChart from '../../components/charts/SubscriptionGrowthChart';
//import RevenueTrendChart from '../../components/charts/RevenueTrendChart';
//import StudentsByStateCard from '../../components/charts/StudentsByStateCard';
import DataTable from '../../components/tables/DataTable';
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

  const registrationColumns = [
  {
    key: 'name',
    header: 'Student Name',
    sortable: true,
    accessor: (r) => r.name,
    render: (r) => (
      <div className="dashboard-student-cell">
        <Avatar
          initials={r.avatar}
          size="sm"
        />
        <span>{r.name}</span>
      </div>
    ),
  },
  {
  key: 'class',
  header: 'Class',
  accessor: (r) =>
    r.class || '—',
},
{
  key: 'board',
  header: 'Board',
  accessor: (r) =>
    r.board || '—',
},
  {
    key: 'institution',
    header: 'Institution',
    accessor: (r) =>
      r.institution?.name ||
      r.institution ||
      '—',
  },
  {
    key: 'state',
    header: 'State',
    accessor: (r) =>
      r.state?.name ||
      r.state ||
      '—',
  },
  {
    key: 'plan',
    header:
      'Subscription Plan',
    accessor: (r) =>
      r.plan?.name ||
      r.plan ||
      '—',
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <StatusBadge
        status={
          r.status ||
          'Active'
        }
      />
    ),
  },
  {
    key: 'date',
    header:
      'Registered On',
    accessor: (r) =>
      formatDate(
        r.createdAt
      ),
  },
];

  const paymentColumns = [
  {
    key: 'student',
    header: 'Student',
    accessor: (r) => r.student,
  },
  {
    key: 'plan',
    header: 'Plan',
    accessor: (r) => r.plan,
  },
  {
    key: 'amount',
    header: 'Amount',
    accessor: (r) => `₹${r.amount}`,
  },
  {
    key: 'referralCode',
    header: 'Referral Code',
    accessor: (r) =>
      r.referralCode || 'Null',
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
        <DataTable title="Recent Registrations" columns={registrationColumns} data={registrations.data || []} isLoading={registrations.isLoading} viewAllLink={() =>
  navigate('/students', {
    state: {
      sortRecent: true,
    },
  })
}
  />
        <DataTable title="Recent Payments" columns={paymentColumns} data={payments.data || []} isLoading={payments.isLoading} viewAllLink={() =>
    navigate('/payments')
  } />
        {/* <DataTable title="Referral Conversions" columns={referralColumns} data={referrals.data || []} isLoading={referrals.isLoading} viewAllLink /> */}
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
