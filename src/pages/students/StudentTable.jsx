import { useState, useEffect } from 'react';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import '../../styles/student-table.css';

const StatusBadge = ({ status }) => {
  const styles = {
    Active: 'bg-green-100 text-green-700 border border-green-200',
    Inactive: 'bg-red-100 text-red-700 border border-red-200',
    Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  };

  return (
    <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const PlanBadge = ({ plan }) => {
  return (
    <span className="rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-600">
      {plan}
    </span>
  );
};

const StudentTable = ({ students = [] }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [students]);

  const totalStudents = students.length;

  const totalPages = Math.ceil(totalStudents / studentsPerPage);

  const startIndex = (currentPage - 1) * studentsPerPage;

  const endIndex = startIndex + studentsPerPage;

  const currentStudents = students.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="student-table-card">
      <div className="student-table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th></th>
              <th>Student Name</th>
              <th>Mobile Number</th>
              <th>Class</th>
              <th>Board</th>
              <th>Institution</th>
              <th>State</th>
              <th>Subscription Plan</th>
              <th>Status</th>
              <th>Registered On</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{startIndex + index + 1}</td>

                  <td>
                    <div className="student-user">
                      <img
                        src={
                          student.photo ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`
                        }
                        alt={student.name}
                        className="student-avatar"
                      />

                      <div>
                        <div>
                          <div className="student-name">{student.name}</div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{student.mobile}</td>

                  <td>{student.class}</td>

                  <td>{student.board}</td>

                  <td>{student.institution}</td>

                  <td>{student.state}</td>

                  <td>
                    <span className="plan-badge">{student.plan}</span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        student.status === 'Active'
                          ? 'status-active'
                          : student.status === 'Inactive'
                            ? 'status-inactive'
                            : 'status-pending'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td>{student.registeredOn}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/students/${student.id}`)}
                      >
                        <HiOutlineEye />
                      </button>

                      <button className="edit-btn">
                        <HiOutlinePencil />
                      </button>

                      <button className="delete-btn">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="empty-table">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalStudents > 0 && (
        <div className="pagination">
          <p>
            Showing {startIndex + 1} to {Math.min(endIndex, totalStudents)} of {totalStudents}{' '}
            students
          </p>

          <div className="pagination-buttons">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
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
  );
};

export default StudentTable;
