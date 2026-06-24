import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineUserRemove,
  HiOutlineAcademicCap,
} from 'react-icons/hi';

const StudentStatsCards = ({ students = [] }) => {
  const total = students.length;
  const active = students.filter((s) => s.status === 'Active').length;
  const inactive = students.filter((s) => s.status === 'Inactive').length;

  const stats = [
    { title: 'Total Students', value: total.toLocaleString(), growth: '', icon: HiOutlineUsers, color: '#6366f1' },
    { title: 'Active Students', value: active.toLocaleString(), growth: '', icon: HiOutlineUserGroup, color: '#10b981' },
    { title: 'Inactive Students', value: inactive.toLocaleString(), growth: '', icon: HiOutlineUserRemove, color: '#ef4444' },
    { title: 'On Trial', value: students.filter((s) => s.status === 'Trial').length.toLocaleString(), growth: '', icon: HiOutlineAcademicCap, color: '#3b82f6' },
  ];

  return (
    <div className="stats-grid">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="stat-card student-stat-card">
            <div className="icon-box icon-box-md" style={{ background: `${item.color}15`, color: item.color }}>
              <Icon className="icon" />
            </div>
            <p className="stat-title">{item.title}</p>
            <h3 className="stat-value">{item.value}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default StudentStatsCards;
