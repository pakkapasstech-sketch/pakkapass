// import '../../styles/DashboardPage.css';
// import StatisticCard from '../../components/cards/StatisticCard';
// import ErrorState from '../../components/loaders/ErrorState';
// import DataTable from '../../components/tables/DataTable';
// import { useParentDashboard } from '../../hooks/useDashboard';

// const ParentDashboard = () => {
//   const { data, isLoading, isError, refetch } = useParentDashboard();

//   if (isError) {
//     return <ErrorState message="Failed to load parent dashboard" onRetry={refetch} />;
//   }

//   const dashboards = data?.dashboards || [];

//   return (
//     <div className="dashboard-page">
//       <div className="page-header-inline">
//         <h2>Parent Dashboard</h2>
//         <p>Track your children&apos;s learning progress</p>
//       </div>

//       {dashboards.length === 0 && !isLoading ? (
//         <p className="empty-message">No linked students found. Ask your child to add your mobile in their profile.</p>
//       ) : (
//         dashboards.map((d) => (
//           <div key={d.studentId} className="parent-child-section">
//             <h3>{d.studentName || `Student #${d.studentId}`}</h3>
//             <div className="dashboard-stats-grid">
//               <StatisticCard title="Study Streak" formattedValue={`${d.streak ?? 0} days`} trend={0} trendLabel="" trendUp iconBg="bg-indigo-100" iconColor="text-indigo-600" icon="students" isLoading={isLoading} />
//               <StatisticCard title="Today's Hours" formattedValue={`${d.todayHours ?? 0}h`} trend={0} trendLabel="" trendUp iconBg="bg-emerald-100" iconColor="text-emerald-600" icon="dashboard" isLoading={isLoading} />
//               <StatisticCard title="Monthly Hours" formattedValue={`${d.monthlyHours ?? 0}h`} trend={0} trendLabel="" trendUp iconBg="bg-blue-100" iconColor="text-blue-600" icon="dashboard" isLoading={isLoading} />
//             </div>
//           </div>
//         ))
//       )}

//       <DataTable
//         title="Children Overview"
//         columns={[
//           { key: 'name', header: 'Student', accessor: (r) => r.studentName || r.studentId },
//           { key: 'streak', header: 'Streak', accessor: (r) => `${r.streak} days` },
//           { key: 'today', header: 'Today', accessor: (r) => `${r.todayHours}h` },
//           { key: 'monthly', header: 'This Month', accessor: (r) => `${r.monthlyHours}h` },
//         ]}
//         data={dashboards}
//         isLoading={isLoading}
//       />
//     </div>
//   );
// };

// export default ParentDashboard;
import StatisticCard from '../../components/cards/StatisticCard';
import '../../styles/ParentDashboard.css';

const ParentDashboard = () => {
  const isLoading = false;

  const student = {
    studentId: 'STU1001',
    name: 'Rahul Sharma',
    class: '10',
    // section: 'A',
    school: 'Delhi Public School',
    attendance: '96%',
    studyStreak: 18,
    todayHours: 3.5,
    monthlyHours: 72,
  };

  const todaySubjects = [
    {
      subject: 'Mathematics',
      duration: '2 hrs',
    },
    {
      subject: 'Science',
      duration: '1.5 hrs',
    },
    {
      subject: 'English',
      duration: '1 hr',
    },
    {
      subject: 'Social Studies',
      duration: '45 mins',
    },
  ];

  const upcomingExams = [
    {
      subject: 'Mathematics',
      date: '28 Jun 2026',
    },
    {
      subject: 'Science',
      date: '30 Jun 2026',
    },
    {
      subject: 'English',
      date: '03 Jul 2026',
    },
  ];

  const activities = [
    'Completed Algebra Practice Test',
    'Watched Photosynthesis Video',
    'Solved 25 Science Questions',
    'Completed English Grammar Worksheet',
    'Logged in for 3.5 hours today',
  ];

  const statCards = [
    {
      id: 'streak',
      title: 'Study Streak',
      formattedValue: `${student.studyStreak} Days`,
      trend: 6,
      trendLabel: 'this week',
      trendUp: true,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      icon: 'students',
    },
    {
      id: 'today',
      title: "Today's Study",
      formattedValue: `${student.todayHours} hrs`,
      trend: 12,
      trendLabel: 'today',
      trendUp: true,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      icon: 'dashboard',
    },
    {
      id: 'month',
      title: 'Monthly Study',
      formattedValue: `${student.monthlyHours} hrs`,
      trend: 9,
      trendLabel: 'this month',
      trendUp: true,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: 'dashboard',
    },
    {
      id: 'attendance',
      title: 'Attendance',
      formattedValue: student.attendance,
      trend: 2,
      trendLabel: 'overall',
      trendUp: true,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: 'students',
    },
  ];

  return (
    <div className="parentdashboard-page">

      <div className="parentdashboard-header">
        <div>
          <h2>Welcome Back 👋</h2>
          <p>Track your child's learning progress.</p>
        </div>
      </div>

      <div className="parentdashboard-profile-card">

        <div className="parentdashboard-avatar">
          {student.name.charAt(0)}
        </div>

        <div className="parentdashboard-profile-info">

          <h3>{student.name}</h3>

          <div className="parentdashboard-profile-grid">

            <div>
              <span>Student ID</span>
              <strong>{student.studentId}</strong>
            </div>

            <div>
              <span>Class</span>
              <strong>
                {student.class}
              </strong>
            </div>

            <div>
              <span>School</span>
              <strong>{student.school}</strong>
            </div>

          </div>

        </div>

      </div>

      <div className="parentdashboard-stats">

        {statCards.map((card) => (
          <StatisticCard
            key={card.id}
            {...card}
            isLoading={isLoading}
          />
        ))}

      </div>

      <div className="parentdashboard-grid">

        <div className="parentdashboard-card">

          <h3>Today's Study Summary</h3>

          <div className="parentdashboard-list">

            {todaySubjects.map((item, index) => (
              <div
                key={index}
                className="parentdashboard-list-item"
              >
                <span>{item.subject}</span>

                <strong>{item.duration}</strong>

              </div>
            ))}

          </div>

        </div>

        

      </div>

      <div className="parentdashboard-card">

        <h3>Recent Activity</h3>

        <div className="parentdashboard-activity-list">

          {activities.map((activity, index) => (
            <div
              key={index}
              className="parentdashboard-activity-item"
            >
              <span className="parentdashboard-check">
                ✓
              </span>

              {activity}

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default ParentDashboard;
