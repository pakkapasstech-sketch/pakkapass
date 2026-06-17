import '../../styles/DashboardPage.css';
import StatisticCard from '../../components/cards/StatisticCard';
import ErrorState from '../../components/loaders/ErrorState';
import DataTable from '../../components/tables/DataTable';
import { useParentDashboard } from '../../hooks/useDashboard';

const ParentDashboard = () => {
  const { data, isLoading, isError, refetch } = useParentDashboard();

  if (isError) {
    return <ErrorState message="Failed to load parent dashboard" onRetry={refetch} />;
  }

  const dashboards = data?.dashboards || [];

  return (
    <div className="dashboard-page">
      <div className="page-header-inline">
        <h2>Parent Dashboard</h2>
        <p>Track your children&apos;s learning progress</p>
      </div>

      {dashboards.length === 0 && !isLoading ? (
        <p className="empty-message">No linked students found. Ask your child to add your mobile in their profile.</p>
      ) : (
        dashboards.map((d) => (
          <div key={d.studentId} className="parent-child-section">
            <h3>{d.studentName || `Student #${d.studentId}`}</h3>
            <div className="dashboard-stats-grid">
              <StatisticCard title="Study Streak" formattedValue={`${d.streak ?? 0} days`} trend={0} trendLabel="" trendUp iconBg="bg-indigo-100" iconColor="text-indigo-600" icon="students" isLoading={isLoading} />
              <StatisticCard title="Today's Hours" formattedValue={`${d.todayHours ?? 0}h`} trend={0} trendLabel="" trendUp iconBg="bg-emerald-100" iconColor="text-emerald-600" icon="dashboard" isLoading={isLoading} />
              <StatisticCard title="Monthly Hours" formattedValue={`${d.monthlyHours ?? 0}h`} trend={0} trendLabel="" trendUp iconBg="bg-blue-100" iconColor="text-blue-600" icon="dashboard" isLoading={isLoading} />
            </div>
          </div>
        ))
      )}

      <DataTable
        title="Children Overview"
        columns={[
          { key: 'name', header: 'Student', accessor: (r) => r.studentName || r.studentId },
          { key: 'streak', header: 'Streak', accessor: (r) => `${r.streak} days` },
          { key: 'today', header: 'Today', accessor: (r) => `${r.todayHours}h` },
          { key: 'monthly', header: 'This Month', accessor: (r) => `${r.monthlyHours}h` },
        ]}
        data={dashboards}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ParentDashboard;
