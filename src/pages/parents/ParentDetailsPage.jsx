import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import StatisticCard from '../../components/cards/StatisticCard';
import { useParents } from '../../hooks/useParents';
import '../../styles/ParentDashboard.css';
import '../../styles/ParentDetails.css';

const ParentDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: parents = [] } = useParents();

  const parent = parents.find(
    (p) => String(p.id) === id
  );

  if (!parent) {
    return <div>Parent not found</div>;
  }

  const statCards = [
    {
      id: 'students',
      title: 'Linked Students',
      formattedValue: parent.studentNames?.length || 0,
      trend: 0,
      trendLabel: 'Total',
      trendUp: true,
      icon: 'students',
    },
    {
      id: 'status',
      title: 'Status',
      formattedValue: parent.status,
      trend: 0,
      trendLabel: 'Current',
      trendUp: parent.status === 'Active',
      icon: 'dashboard',
    },
  ];

  return (
    <div className="parentdashboard-page">
      <button
        className="parent-back-btn"
        onClick={() => navigate('/parents')}
      >
        <HiArrowLeft />
        Back to Parents
      </button>

      <div className="parentdashboard-header">
        <div>
          <h2>Parent Details</h2>
          <p>View parent information and linked students.</p>
        </div>
      </div>

      <div className="parentdashboard-profile-card">
        <div className="parentdashboard-avatar">
          {parent.name.charAt(0)}
        </div>

        <div className="parentdashboard-profile-info">
          <h3>{parent.name}</h3>

          <div className="parentdashboard-profile-grid">
            <div>
              <span>Parent ID</span>
              <strong>{parent.id}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{parent.email}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{parent.phone}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{parent.status}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="parentdashboard-stats">
        {statCards.map((card) => (
          <StatisticCard
            key={card.id}
            {...card}
            isLoading={false}
          />
        ))}
      </div>

      <div className="parentdashboard-card">
        <h3>Linked Students</h3>

        <div className="parentdashboard-list">
          {parent.studentNames?.length ? (
            parent.studentNames.map((student, index) => (
              <div
                key={index}
                className="parentdashboard-list-item"
              >
                <strong>{student}</strong>
              </div>
            ))
          ) : (
            <p>No students linked.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDetailsPage;