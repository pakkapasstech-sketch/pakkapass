
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useParents } from '../../hooks/useParents';
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

  return (
    <div className="parent-details-page">
      <button
  className="parent-back-btn"
  onClick={() => navigate('/parents')}
>
  <HiArrowLeft />
  Back to Parents
</button>
      <div className="profile-card">

        <div className="profile-header">
          <div className="avatar">
            {parent.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>

          <div>
            <h1>{parent.name}</h1>
            <p>{parent.email}</p>
          </div>
        </div>

        <div className="details-grid">
          <div>
            <label>Phone</label>
            <p>{parent.phone}</p>
          </div>

          <div>
            <label>Status</label>
            <p>{parent.status}</p>
          </div>

          <div>
  <label>Students Linked</label>

  {parent.studentNames?.length ? (
    parent.studentNames.map((name) => (
      <p key={name}>{name}</p>
    ))
  ) : (
    <p>No students linked</p>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default ParentDetailsPage;