import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HiArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import '../../styles/planDetails.css';
import studentService from '../../services/student.service';
import {
  getPlanById,
  deletePlan,
} from '../../services/SubscriptionServices';
import { useLoading } from '../../contexts/LoadingContext';

const PlanDetailsPage = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { setLoading } = useLoading();

  const [options, setOptions] = useState({
    grades: [],
    boards: [],
    branches: [],
  });

  const [plan, setPlan] = useState(null);
  const [loading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);

        const [optionsData, planData] = await Promise.all([
          studentService.getFilterOptions(),
          getPlanById(planId),
        ]);

        setOptions(optionsData);
        setPlan(planData);
      } catch (err) {
        console.error('Failed to load plan:', err);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [planId]);

  useEffect(() => {
    setLoading(loading);

    return () => setLoading(false);
  }, [loading, setLoading]);

  const getGradeNames = (ids = []) =>
    options.grades
      .filter((g) => ids.includes(g.id))
      .map((g) => g.name);

  const getBoardNames = (ids = []) =>
    options.boards
      .filter((b) => ids.includes(b.id))
      .map((b) => b.name);

  const getBranchNames = (ids = []) =>
    options.branches
      .filter((b) => ids.includes(b.id))
      .map((b) => b.name);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this plan?');

    if (!confirmed) return;

    try {
      await deletePlan(planId);
      navigate('/subscriptions/plans');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return null;
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
      <button className="back-link" onClick={() => navigate(-1)}>
        <HiArrowLeft />
        <span>Back</span>
      </button>
      <div className="details-header">


        <div className="details-actions">
          <button
            className="primary-btn"
            onClick={() =>
              navigate(`/subscriptions/plans/${planId}/edit`)
            }
          >
            <HiOutlinePencil />
            Edit
          </button>

          <button
            className="danger-btn"
            onClick={handleDelete}
          >
            <HiOutlineTrash />
            Delete
          </button>
        </div>
      </div>

      <div className="page-title-card">
        <h1>{plan.name}</h1>
        <p>Subscription Plan</p>
      </div>

      <div className="detail-card">
        <h3>Basic Information</h3>

        <div className="detail-grid">
          <div>
            <label>Status</label>
            <p>{plan.status}</p>
          </div>

          <div>
            <label>Created At</label>
            <p>
              {plan.createdAt
                ? new Date(plan.createdAt).toLocaleDateString('en-IN')
                : '-'}
            </p>
          </div>

          <div>
            <label>Updated At</label>
            <p>
              {plan.updatedAt
                ? new Date(plan.updatedAt).toLocaleDateString('en-IN')
                : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Academic Mapping</h3>

        <div className="mapping-section">
          <label>Class</label>

          <div className="chips">
            {getGradeNames(plan.gradeIds).map((name) => (
              <span
                key={name}
                className="chip"
              >
                {name}
              </span>
            ))}
          </div>

          <label>Board</label>

          <div className="chips">
            {getBoardNames(plan.boardIds).map((name) => (
              <span
                key={name}
                className="chip"
              >
                {name}
              </span>
            ))}
          </div>

          <label>Branch</label>

          <div className="chips">
            {getBranchNames(plan.branchIds).map((name) => (
              <span
                key={name}
                className="chip"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="detail-card">
        <h3>Features</h3>

        <div className="chips">
          {plan.features?.length ? (
            plan.features.map((feature) => (
              <span key={feature} className="chip">
                {feature}
              </span>
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      </div>
      <div className="detail-card">
        <h3>Pricing</h3>

        <div className="detail-grid">
          <div>
            <label>Original Price</label>
            <p>
              ₹{Number(plan.price || 0).toLocaleString('en-IN')}
            </p>
          </div>

          <div>
            <label>Duration</label>
            <p>{plan.durationDays} Days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsPage;