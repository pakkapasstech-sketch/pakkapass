import { useNavigate, useParams } from 'react-router-dom';
import {
  HiArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import '../../styles/planDetails.css';

const mockPlan = {
  id: '1',
  name: 'Class 11 MPC Premium Plan',
  description:
    'Complete access for Class 11 and Class 12 MPC students including videos, PDFs and analytics.',
  status: 'Active',
  createdBy: 'Admin',
  createdAt: '18 Jun 2026',
  updatedAt: '18 Jun 2026',
  classes: ['11th', '12th'],
  boards: ['State'],
  branches: ['MPC'],
  price: '₹2,999',
  duration: '180 Days',
  features: [
    'Full Video Access',
    'PDF Notes Access',
    'Question Papers Access',
    'Learning Analytics',
    'Parent Dashboard Access',
  ],
};

const PlanDetailsPage = () => {
  const navigate = useNavigate();
  const { planId } = useParams();

  const plan = mockPlan;

  return (
    <div className="plan-details-page">
      <div className="details-header">
  <button
    className="back-link"
    onClick={() => navigate(-1)}
  >
    <HiArrowLeft />
    <span>Back</span>
  </button>

  <div className="details-actions">
    <button
      className="primary-btn"
      onClick={() =>
        navigate(
          `/admin/subscriptions/plans/${planId}/edit`
        )
      }
    >
      <HiOutlinePencil />
      Edit
    </button>

    <button
      className="danger-btn"
      onClick={() =>
        console.log('Delete')
      }
    >
      <HiOutlineTrash />
      Delete
    </button>
  </div>
</div>

      <div className="page-title-card">
        <h1>{plan.name}</h1>
        <p>{plan.description}</p>
      </div>

      <div className="detail-card">
        <h3>Basic Information</h3>

        <div className="detail-grid">
          <div>
            <label>Status</label>
            <p>{plan.status}</p>
          </div>

          <div>
            <label>Created By</label>
            <p>{plan.createdBy}</p>
          </div>

          <div>
            <label>Created At</label>
            <p>{plan.createdAt}</p>
          </div>

          <div>
            <label>Updated At</label>
            <p>{plan.updatedAt}</p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Academic Mapping</h3>

        <div className="mapping-section">
          <label>Classes</label>

          <div className="chips">
            {plan.classes.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>

          <label>Boards</label>

          <div className="chips">
            {plan.boards.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>

          <label>Branches</label>

          <div className="chips">
            {plan.branches.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Pricing</h3>

        <div className="detail-grid">
          <div>
            <label>Original Price</label>
            <p>{plan.price}</p>
          </div>

          <div>
            <label>Duration</label>
            <p>{plan.duration}</p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Features</h3>

        <div className="chips">
          {plan.features.map((feature) => (
            <span
              key={feature}
              className="chip"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* <div className="detail-card coming-soon">
        <h3>Subscription Statistics</h3>
        <p>Coming Soon</p>
      </div> */}
    </div>
  );
};

export default PlanDetailsPage;