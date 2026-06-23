import {
  useEffect,
  useState,
} from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  HiArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import '../../styles/planDetails.css';

import {
  getPlanById,
  deletePlan,
} from '../../services/SubscriptionServices';

const PlanDetailsPage = () => {
  const navigate = useNavigate();
  const { planId } = useParams();

  const [plan, setPlan] =
    useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadPlan();
  }, [planId]);

  const loadPlan = async () => {
    try {
      setLoading(true);

      const data =
        await getPlanById(planId);

      console.log(
        'Plan Details:',
        data
      );

      setPlan(data);
    } catch (err) {
      console.error(
        'Failed to load plan:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete =
    async () => {
      const confirmed =
        window.confirm(
          'Delete this plan?'
        );

      if (!confirmed) return;

      try {
        await deletePlan(planId);

        navigate(
          '/admin/subscriptions/plans'
        );
      } catch (err) {
        console.error(
          'Delete failed:',
          err
        );
      }
    };

  if (loading) {
    return (
      <div className="plan-details-page">
        Loading...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="plan-details-page">
        Plan not found
      </div>
    );
  }

  return (
    <div className="plan-details-page">
      <div className="details-header">
        <button
          className="back-link"
          onClick={() =>
            navigate(-1)
          }
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
            onClick={
              handleDelete
            }
          >
            <HiOutlineTrash />
            Delete
          </button>
        </div>
      </div>

      <div className="page-title-card">
        <h1>{plan.name}</h1>

        <p>
          Subscription Plan
        </p>
      </div>

      <div className="detail-card">
        <h3>
          Basic Information
        </h3>

        <div className="detail-grid">
          <div>
            <label>Status</label>

            <p>Active</p>
          </div>

          <div>
            <label>
              Created At
            </label>

            <p>
              {plan.createdAt
                ? new Date(
                    plan.createdAt
                  ).toLocaleDateString(
                    'en-IN'
                  )
                : '-'}
            </p>
          </div>

          <div>
            <label>
              Updated At
            </label>

            <p>
              {plan.updatedAt
                ? new Date(
                    plan.updatedAt
                  ).toLocaleDateString(
                    'en-IN'
                  )
                : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>
          Academic Mapping
        </h3>

        <div className="mapping-section">
          <label>
            Class
          </label>

          <div className="chips">
            <span className="chip">
              {plan.grade
                ?.name || '-'}
            </span>
          </div>

          <label>
            Board
          </label>

          <div className="chips">
            <span className="chip">
              {plan.board
                ?.name || '-'}
            </span>
          </div>

          <label>
            Branch
          </label>

          <div className="chips">
            <span className="chip">
              {plan.branch
                ?.name || '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Pricing</h3>

        <div className="detail-grid">
          <div>
            <label>
              Original Price
            </label>

            <p>
              ₹
              {Number(
                plan.price || 0
              ).toLocaleString(
                'en-IN'
              )}
            </p>
          </div>

          <div>
            <label>
              Duration
            </label>

            <p>
              {
                plan.durationDays
              }{' '}
              Days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsPage;