import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineDownload ,HiOutlineChevronLeft,
  HiOutlineChevronRight,HiOutlineEye } from 'react-icons/hi';
import StatisticCard from '../../components/cards/StatisticCard';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';

import Loader from '../../components/common/Loader';
import ErrorState from '../../components/loaders/ErrorState';
import { useParents } from '../../hooks/useParents';

import '../../styles/ParentsManagement.css';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import '../../styles/student-table.css';

const ParentsManagement = () => {
  const navigate = useNavigate();

  const { data: parents = [], isLoading, isError, refetch } = useParents();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

const parentsPerPage = 5;
 useEffect(() => {
  setCurrentPage(1);
}, [search, statusFilter]);
  const filteredParents = parents.filter((p) => {
  const searchTerm = search.trim().toLowerCase();

  const matchesSearch =
    searchTerm === '' ||
    String(p.id).toLowerCase().includes(searchTerm) ||
    (p.name || '').toLowerCase().includes(searchTerm) ||
    (p.email || '').toLowerCase().includes(searchTerm) ||
    (p.phone || '').toLowerCase().includes(searchTerm) ||
    String(p.students || '').toLowerCase().includes(searchTerm) ||
    (p.status || '').toLowerCase().includes(searchTerm);

  const matchesStatus =
    statusFilter === '' || p.status === statusFilter;

  return matchesSearch && matchesStatus;
});
const totalParentsFiltered = filteredParents.length;

const totalPages =
  Math.ceil(totalParentsFiltered / parentsPerPage) || 1;

const startIndex = (currentPage - 1) * parentsPerPage;

const endIndex = startIndex + parentsPerPage;

const currentParents = filteredParents.slice(
  startIndex,
  endIndex
);

const getVisiblePages = () => {
  const start = Math.max(currentPage - 2, 1);
  const end = Math.min(currentPage + 2, totalPages);

  return Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );
};

  if (isLoading) return <Loader />;

  if (isError) {
    return <ErrorState message="Failed to load parents" onRetry={refetch} />;
  }

  const totalParents = parents.length;
  const activeParents = parents.filter((p) => p.status === 'Active').length;

  const inactiveParents = totalParents - activeParents;

  const linkedStudents = parents.reduce((total, parent) => total + parent.students, 0);
 
  return (
    <div className="parents-page">
      <div className="page-header flex justify-between items-start flex-wrap gap-6">
        <div>
          <h1 className="page-title">Parent Management</h1>
          <p className="page-subtitle">
            Search parents, manage records, and view their linked students and details.
          </p>
        </div>
        <div className="header-actions flex gap-4">
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{ height: '44px', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            onClick={() => {
              const exportCols = [
                { header: 'ID', accessor: (r) => r.id },
                { header: 'Parent Name', accessor: (r) => r.name },
                { header: 'Email', accessor: (r) => r.email },
                { header: 'Phone', accessor: (r) => r.phone },
                { header: 'Students', accessor: (r) => r.students },
                { header: 'Status', accessor: (r) => r.status },
              ];
              exportToCSV(parents, exportCols, 'parents.csv');
            }}
          >
            <HiOutlineDownload />
            CSV
          </button>
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{ height: '44px', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            onClick={() => {
              const exportCols = [
                { header: 'ID', accessor: (r) => r.id },
                { header: 'Parent Name', accessor: (r) => r.name },
                { header: 'Email', accessor: (r) => r.email },
                { header: 'Phone', accessor: (r) => r.phone },
                { header: 'Students', accessor: (r) => r.students },
                { header: 'Status', accessor: (r) => r.status },
              ];
              exportToExcel(parents, exportCols, 'parents.xlsx');
            }}
          >
            <HiOutlineDownload />
            Excel
          </button>
        </div>
      </div>
      {/* Stats */}
      <div className="dashboard-stats-grid">
        <StatisticCard
          title="Total Parents"
          value={totalParents}
          icon="users"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatisticCard
          title="Active Parents"
          value={activeParents}
          icon="user-group"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatisticCard
          title="Inactive Parents"
          value={inactiveParents}
          icon="user-remove"
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <StatisticCard
          title="Students Linked"
          value={linkedStudents}
          icon="students"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Toolbar */}
      <div className="parents-toolbar">
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
  placeholder="All Status"
  value={statusFilter || 'All Status'}
  options={[
    'All Status',
    'Active',
    'Inactive',
  ]}
  onChange={(value) =>
    setStatusFilter(
      value === 'All Status' ? '' : value
    )
  }
/>
      </div>

      {/* Table */}
      <div className="parents-table-wrapper">
        <table className="parents-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Parent Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Students</th>
              <th>Status</th>
              <th>view</th>
            </tr>
          </thead>

          <tbody>
            {filteredParents.length > 0 ? (
              currentParents.map((p) => (
                <tr
  key={p.id}
  className="parent-row"
>
                  <td>{p.id}</td>

                  <td>
                    <div className="parent-user">
                      <div className="parent-avatar">
                        {p.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>

                      <span>{p.name}</span>
                    </div>
                  </td>

                  <td>{p.email}</td>

                  <td>{p.phone}</td>

                  <td>{p.students}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        p.status === 'Active'
                          ? 'active'
                          : 'inactive'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="table-actions">
  <button
    className="table-action-btn"
    onClick={() => navigate(`/parents/${p.id}`)}
    title="View Parent"
  >
    <HiOutlineEye />
  </button>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-table">
                  No parents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalParentsFiltered > 0 && (
  <div className="pagination">
    <p>
      Showing {startIndex + 1} to{' '}
      {Math.min(endIndex, totalParentsFiltered)} of{' '}
      {totalParentsFiltered} parents
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
          className={
            currentPage === page ? 'active-page' : ''
          }
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

export default ParentsManagement;
