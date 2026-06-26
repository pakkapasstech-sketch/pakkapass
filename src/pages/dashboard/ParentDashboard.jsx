import StatisticCard from '../../components/cards/StatisticCard';
import '../../styles/ParentDashboard.css';

const ParentDashboard = () => {
  const isLoading = false;

  const parent = {
    parentId: 'PAR1001',
    name: 'Rajesh Sharma',
    email: 'rajesh@gmail.com',
    phone: '+91 9876543210',
  };

  const linkedStudents = [
    {
      id: 'STU1001',
      name: 'Rahul Sharma',
      class: '10',
      school: 'Delhi Public School',
    },
    {
      id: 'STU1002',
      name: 'Priya Sharma',
      class: '7',
      school: 'Delhi Public School',
    },
  ];

  const statCards = [
    {
      id: 'students',
      title: 'Linked Students',
      formattedValue: linkedStudents.length,
      trend: 0,
      trendLabel: 'Total',
      trendUp: true,
      icon: 'students',
    },
    {
      id: 'active',
      title: 'Active Students',
      formattedValue: linkedStudents.length,
      trend: 0,
      trendLabel: 'Currently',
      trendUp: true,
      icon: 'dashboard',
    },
  ];

  return (
    <div className="parentdashboard-page">

      <div className="parentdashboard-header">
        <div>
          <h2>Welcome Back 👋</h2>
          <p>Manage your children's accounts.</p>
        </div>
      </div>

      {/* Parent Profile */}

      <div className="parentdashboard-profile-card">

        <div className="parentdashboard-avatar">
          {parent.name.charAt(0)}
        </div>

        <div className="parentdashboard-profile-info">

          <h3>{parent.name}</h3>

          <div className="parentdashboard-profile-grid">

            <div>
              <span>Parent ID</span>
              <strong>{parent.parentId}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{parent.email}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{parent.phone}</strong>
            </div>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="parentdashboard-stats">
        {statCards.map((card) => (
          <StatisticCard
            key={card.id}
            {...card}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Linked Students */}

      <div className="parentdashboard-card">

        <h3>Linked Students</h3>

        <div className="parentdashboard-list">

          {linkedStudents.map((student) => (
            <div
              key={student.id}
              className="parentdashboard-list-item"
            >
              <div>
                <strong>{student.name}</strong>
                <p>{student.school}</p>
              </div>

              <div>
                <span>Class {student.class}</span>
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default ParentDashboard;