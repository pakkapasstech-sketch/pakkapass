import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import StatisticCard from '../../components/cards/StatisticCard';
import { useParents } from '../../hooks/useParents';
import '../../styles/ParentDashboard.css';
import '../../styles/ParentDetails.css';
import { useLoading } from '../../contexts/LoadingContext';
const ParentDetailsPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { id } = useParams();
  const { data:parents = [] , isLoading} = useParents();

  const parent = parents.find(
    (p) => String(p.id) === id
  );
  useEffect(() => {
  setLoading(isLoading);

  return () => setLoading(false);
}, [isLoading, setLoading]);
  if (!parent) {
    return <div>Parent not found</div>;
  }


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
              <span>Linked Students</span>
              <strong>{parent.studentNames?.length || 0}</strong>
            </div>
          </div>
        </div>
      </div>


      <div className="parentdashboard-card">
        <h3>Linked Students</h3>

        <div className="parentdashboard-list">
          {parent.studentList?.length ? (
            parent.studentList.map((student, index) => (
              <div
                key={student.id || index}
                className="parentdashboard-list-item"
                style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                onClick={() => navigate(`/students/${student.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-main-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                <strong style={{ color: 'var(--color-primary)' }}>{student.name}</strong>
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