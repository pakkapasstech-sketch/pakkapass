import StatisticCard from '../../components/cards/StatisticCard';

const StudentStatsCards = ({ students = [] }) => {
  const total = students.length;
  const active = students.filter((s) => s.status === 'Active').length;
  const inactive = students.filter((s) => s.status === 'Inactive').length;

  const stats = [
    { title: 'Total Students', value: total, icon: 'users', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { title: 'Active Students', value: active, icon: 'user-group', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { title: 'Inactive Students', value: inactive, icon: 'user-remove', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
    { title: 'On Trial', value: students.filter((s) => s.status === 'Trial').length, icon: 'students', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  ];

  return (
    <div className="dashboard-stats-grid">
      {stats.map((item) => (
        <StatisticCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          iconBg={item.iconBg}
          iconColor={item.iconColor}
        />
      ))}
    </div>
  );
};

export default StudentStatsCards;
