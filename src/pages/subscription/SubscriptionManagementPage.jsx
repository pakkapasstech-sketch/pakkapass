import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineDownload,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
} from 'react-icons/hi';
import {  exportToExcel } from '../../utils/exportUtils';
import '../../styles/subscriptionManagement.css';
import { getPlans } from '../../services/SubscriptionServices';
import { useLoading } from '../../contexts/LoadingContext';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import '../../styles/student-table.css';
const SubscriptionManagementPage = () => {
  const navigate = useNavigate();
const { setLoading: setGlobalLoading } = useLoading();  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const plansPerPage = 5;
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);

      const data = await getPlans();

      console.log('Plans API Response:', data);

      setPlans(data || []);
    } catch (err) {
      console.error('Failed to load plans:', err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const searchTerm = search.trim().toLowerCase();

      const searchMatch =
        searchTerm === '' ||
        String(plan.id || '')
          .toLowerCase()
          .includes(searchTerm) ||
        (plan.name || '').toLowerCase().includes(searchTerm) ||
        String(plan.price || '')
          .toLowerCase()
          .includes(searchTerm) ||
        String(plan.durationDays || '')
          .toLowerCase()
          .includes(searchTerm) ||
        (plan.grade?.name || '').toLowerCase().includes(searchTerm) ||
        (plan.board?.name || '').toLowerCase().includes(searchTerm) ||
        (plan.branch?.name || '').toLowerCase().includes(searchTerm) ||
        (plan.createdAt
          ? new Date(plan.createdAt).toLocaleDateString('en-IN').toLowerCase()
          : ''
        ).includes(searchTerm) ||
        'active'.includes(searchTerm);

      const classMatch =
        !selectedClass || plan.grade?.name?.toLowerCase() === selectedClass.toLowerCase();

      const boardMatch =
        !selectedBoard || plan.board?.name?.toLowerCase() === selectedBoard.toLowerCase();

      const branchMatch =
        !selectedBranch || plan.branch?.name?.toLowerCase() === selectedBranch.toLowerCase();

      return searchMatch && classMatch && boardMatch && branchMatch;
    });
  }, [plans, search, selectedClass, selectedBoard, selectedBranch]);
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  const startIndex = (currentPage - 1) * plansPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + plansPerPage);
  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);

    const end = Math.min(currentPage + 2, totalPages);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClass, selectedBoard, selectedBranch]);
  useEffect(() => {
  setGlobalLoading(loading);

  return () => setGlobalLoading(false);
}, [loading, setGlobalLoading]);

  return (
    <div className="subscription-management-page">
      <div className="page-header flex justify-between items-start flex-wrap gap-6">
        <div>
          <h1 className="page-title">Subscription Plans</h1>
          <p className="page-subtitle">Manage pricing plans and academic mappings.</p>
        </div>
        <div className="header-actions flex gap-4">
          {/* <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{
              height: '44px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() => {
              const exportCols = [
                { header: 'ID', accessor: (r) => r.id },
                { header: 'Plan Name', accessor: (r) => r.name },
                { header: 'Price', accessor: (r) => r.price },
                { header: 'Duration (Days)', accessor: (r) => r.durationDays },
                { header: 'Class', accessor: (r) => r.grade?.name || '—' },
                { header: 'Board', accessor: (r) => r.board?.name || '—' },
                { header: 'Branch', accessor: (r) => r.branch?.name || '—' },
                {
                  header: 'Created At',
                  accessor: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'),
                },
              ];
              exportToCSV(filteredPlans, exportCols, 'subscription_plans.csv');
            }}
          >
            <HiOutlineDownload />
            CSV
          </button> */}
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{
              height: '44px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() => {
              const exportCols = [
                { header: 'ID', accessor: (r) => r.id },
                { header: 'Plan Name', accessor: (r) => r.name },
                { header: 'Price', accessor: (r) => r.price },
                { header: 'Duration (Days)', accessor: (r) => r.durationDays },
                { header: 'Class', accessor: (r) => r.grade?.name || '—' },
                { header: 'Board', accessor: (r) => r.board?.name || '—' },
                { header: 'Branch', accessor: (r) => r.branch?.name || '—' },
                {
                  header: 'Created At',
                  accessor: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'),
                },
              ];
              exportToExcel(filteredPlans, exportCols, 'subscription_plans.xlsx');
            }}
          >
            <HiOutlineDownload />
            Export
          </button>
          <button
            className="primary-btn"
            onClick={() => navigate('/admin/subscriptions/plans/create')}
          >
            <HiOutlinePlus />
            Create Plan
          </button>
        </div>
      </div>

      <div className="subscription-filters">
        <div className="search-box">
          <HiOutlineSearch />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <CommonFilterDropdown
          placeholder="All Classes"
          value={selectedClass || 'All Classes'}
          options={['All Classes', '10th', '11th', '12th']}
          onChange={(value) => setSelectedClass(value === 'All Classes' ? '' : value)}
        />
        <CommonFilterDropdown
          placeholder="All Boards"
          value={selectedBoard || 'All Boards'}
          options={['All Boards', 'State', 'CBSE', 'ICSE']}
          onChange={(value) => setSelectedBoard(value === 'All Boards' ? '' : value)}
        />

        <CommonFilterDropdown
          placeholder="All Branches"
          value={selectedBranch || 'All Branches'}
          options={['All Branches', 'PCM', 'BiPC', 'MEC', 'CEC']}
          onChange={(value) => setSelectedBranch(value === 'All Branches' ? '' : value)}
        />
      </div>

      <div className="student-table-card" style={{ marginTop: '24px' }}>
        <div className="student-table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>view</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-table">
                    Loading...
                  </td>
                </tr>
              ) : filteredPlans.length > 0 ? (
                paginatedPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.id}</td>

                    <td>
                      <div className="student-user">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(plan.name)}`}
                          alt={plan.name}
                          className="student-avatar"
                        />

                        <div>
                          <div className="student-name">{plan.name}</div>
                        </div>
                      </div>
                    </td>

                    <td>₹{Number(plan.price || 0).toLocaleString('en-IN')}</td>

                    <td>
                      <span className="plan-badge">{plan.durationDays} Days</span>
                    </td>

                    <td>
                      <span className="status-badge status-active">Active</span>
                    </td>

                    <td>
                      {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="table-actions">
                      <button
                        className="table-action-btn"
                        onClick={() => navigate(`/admin/subscriptions/plans/${plan.id}`)}
                        title="View Plan"
                      >
                        <HiOutlineEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No plans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredPlans.length > 0 && (
          <div className="pagination">
            <p>
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + plansPerPage, filteredPlans.length)} of {filteredPlans.length}{' '}
              plans
            </p>

            <div className="pagination-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <HiOutlineChevronLeft />
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'active-page' : ''}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <HiOutlineChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;
