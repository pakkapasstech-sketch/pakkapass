import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineUserRemove,
  HiOutlineAcademicCap,
} from 'react-icons/hi';

const stats = [
  {
    title: 'Total Students',
    value: '125,680',
    growth: '+16.4%',
    icon: HiOutlineUsers,
    color: '#6366f1',
  },
  {
    title: 'Active Students',
    value: '98,432',
    growth: '+14.8%',
    icon: HiOutlineUserGroup,
    color: '#10b981',
  },
  {
    title: 'Inactive Students',
    value: '14,568',
    growth: '+3.8%',
    icon: HiOutlineUserRemove,
    color: '#ef4444',
  },
  {
    title: 'New This Week',
    value: '3,256',
    growth: '+12.1%',
    icon: HiOutlineAcademicCap,
    color: '#3b82f6',
  },
];

const StudentStatsCards = () => {
  return (
    <div className="stats-grid">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="stat-card student-stat-card"
          >
            <div
              className="icon-box icon-box-md"
              style={{
                background: `${item.color}15`,
                color: item.color,
              }}
            >
              <Icon className="icon" />
            </div>

            <p className="stat-title">
              {item.title}
            </p>

            <h3 className="stat-value">
              {item.value}
            </h3>

            <div className="stat-trend">
              <span className="stat-trend-positive">
                ↑
              </span>

              <span className="stat-trend-value stat-trend-positive">
                {item.growth}
              </span>

              <span className="stat-trend-label">
                vs last week
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentStatsCards;