import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  HiArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { useStudents } from '../../hooks/useStudents';
import '../../styles/planDetails.css';
import studentService from '../../services/student.service';
import {
  getPlanById,
  deletePlan,
} from '../../services/SubscriptionServices';
import { useLoading } from '../../contexts/LoadingContext';

const PlanDetailsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { planId } = useParams();
  const { setLoading } = useLoading();

  const [options, setOptions] = useState({
    grades: [],
    boards: [],
    branches: [],
  });

  const [plan, setPlan] = useState(null);
  const [loading, setPageLoading] = useState(true);

  const { data: students = [] } = useStudents();
  const planStudents = students.filter(s => s.plan === plan?.name);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const totalStudents = planStudents.length;
  const totalPages = Math.ceil(totalStudents / studentsPerPage) || 1;
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = planStudents.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

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
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
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

      <div className="page-title-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>{plan.name}</h1>
          <p>Subscription Plan</p>
        </div>
        <span
          className={`status-badge ${
            plan.isPublic ? 'status-active' : 'status-inactive'
          }`}
          style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '999px', fontWeight: '600' }}
        >
          {plan.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      <div className="detail-card">
        <h3>Basic Information</h3>

        <div className="detail-grid">
          <div>
            <label>Status</label>
            <p>{plan.status}</p>
          </div>

          <div>
            <label>Visibility</label>
            <p>
              <span
                className={`status-badge ${
                  plan.isPublic ? 'status-active' : 'status-inactive'
                }`}
              >
                {plan.isPublic ? 'Public' : 'Private'}
              </span>
            </p>
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

          <div>
            <label>Subscribed Students</label>
            <p>{totalStudents}</p>
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

      {/* Subscribed Students Table */}
      <div className="parentdashboard-card" style={{ marginTop: '24px', padding: '24px', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
        <h3>Subscribed Students ({totalStudents})</h3>
        {totalStudents > 0 ? (
          <>
            <div className="student-table-wrapper" style={{ marginTop: '1rem', overflowX: 'auto' }}>
              <table className="student-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Registered On</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((s, index) => (
                    <tr 
                      key={s.id} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/students/${s.id}`)}
                    >
                      <td>{startIndex + index + 1}</td>
                      <td><strong style={{ color: 'var(--color-primary)' }}>{s.name || 'Unknown'}</strong></td>
                      <td>{s.email || '-'}</td>
                      <td>{s.mobile || '-'}</td>
                      <td>
                        {s.createdAt 
                          ? new Date(s.createdAt).toLocaleDateString('en-IN')
                          : '-'}
                      </td>
                      <td>
                        {s.profile?.planExpiryDate 
                          ? new Date(s.profile.planExpiryDate).toLocaleDateString('en-IN')
                          : (s.profile?.plan?.durationDays ? new Date(new Date(s.profile.updatedAt || s.createdAt).getTime() + s.profile.plan.durationDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN') : '-')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                Showing {startIndex + 1} to {Math.min(endIndex, totalStudents)} of {totalStudents} students
              </p>

              <div className="pagination-buttons" style={{ display: 'flex', gap: '8px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  aria-label="Previous Page"
                >
                  <HiOutlineChevronLeft />
                </button>

                {getVisiblePages().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'active-page' : ''}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  aria-label="Next Page"
                >
                  <HiOutlineChevronRight />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No students subscribed to this plan yet.
          </div>
        )}
      </div>

    </div>
  );
};

export default PlanDetailsPage;