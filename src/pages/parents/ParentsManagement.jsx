import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineDownload,
  HiOutlineEye,
} from 'react-icons/hi';

import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import ErrorState from '../../components/loaders/ErrorState';
import { useParents } from '../../hooks/useParents';

import '../../styles/ParentsManagement.css';

const ParentsManagement = () => {
  const navigate = useNavigate();

  const { data: parents = [], isLoading, isError, refetch } = useParents();

  const [search, setSearch] = useState('');

  const filteredParents = parents.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search)
  );

  if (isLoading) return <LoadingSkeleton rows={6} />;

  if (isError) {
    return (
      <ErrorState
        message="Failed to load parents"
        onRetry={refetch}
      />
    );
  }

  const totalParents = parents.length;
  const activeParents = parents.filter(
    (p) => p.status === 'Active'
  ).length;

  const inactiveParents = totalParents - activeParents;

  const linkedStudents = parents.reduce(
    (total, parent) => total + parent.students,
    0
  );

  return (
    <div className="parents-page">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-title">
            Total Parents
          </p>
          <h3 className="stat-value">
            {totalParents}
          </h3>
        </div>

        <div className="stat-card">
          <p className="stat-title">
            Active Parents
          </p>
          <h3 className="stat-value">
            {activeParents}
          </h3>
        </div>

        <div className="stat-card">
          <p className="stat-title">
            Inactive Parents
          </p>
          <h3 className="stat-value">
            {inactiveParents}
          </h3>
        </div>

        <div className="stat-card">
          <p className="stat-title">
            Students Linked
          </p>
          <h3 className="stat-value">
            {linkedStudents}
          </h3>
        </div>
      </div>

      {/* Toolbar */}
      <div className="parents-toolbar">
        <div className="search-box">
          <HiOutlineSearch />

          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* <button
          type="button"
          className="export-btn"
        >
          <HiOutlineDownload />
          Export
        </button> */}
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredParents.length > 0 ? (
              filteredParents.map((p) => (
                <tr
                  key={p.id}
                  className="parent-row"
                  onClick={() =>
                    navigate(`/parents/${p.id}`)
                  }
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

                  <td>
                    <button
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/parents/${p.id}`
                        );
                      }}
                    >
                      <HiOutlineEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="empty-table"
                >
                  No parents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParentsManagement;