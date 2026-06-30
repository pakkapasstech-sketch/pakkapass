import { useState, useEffect } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight,HiOutlineEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import '../../styles/student-table.css';

const StudentTable = ({ students = [], noCard = false, hideInstitution = false }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [students]);

  const totalStudents = students.length;

  const totalPages = Math.ceil(totalStudents / studentsPerPage) || 1;

  const startIndex = (currentPage - 1) * studentsPerPage;

  const endIndex = startIndex + studentsPerPage;

  const currentStudents = students.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);

    const end = Math.min(currentPage + 2, totalPages);

    return Array.from(
      {
        length: end - start + 1,
      },
      (_, i) => start + i
    );
  };

  const tableContent = (
    <div className="student-table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Board</th>
            {!hideInstitution && <th>Institution</th>}
            <th>REFCODE</th>
            <th>Subscription Plan</th>
            <th>Status</th>
            <th>Registered On</th>
            <th>view</th>
          </tr>
        </thead>

        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map((student, index) => (
              <tr
  key={`${student.id}-${startIndex + index}`}
  className="clickable-row"
  onClick={() => navigate(`/students/${student.id}`)}
>
                <td>{student.id || '—'}</td>

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
                      <div className="student-name">{student.name}</div>
                    </div>
                  </div>
                </td>

                <td>{student.class}</td>

                <td>{student.board}</td>

                {!hideInstitution && <td>{student.institution}</td>}

                <td>
                  {student.referralCode ||
                    student.refCode ||
                    "Null"}
                </td>

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

                <td>
                  {student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString()
                    : student.registeredOn || '—'}
                </td>
                

<td>
  <button
    className="table-action-btn"
    onClick={() => navigate(`/students/${student.id}`)}
    title="View Student"
  >
    <HiOutlineEye />
  </button>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={hideInstitution ? "9" : "10"} className="empty-table">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (noCard) {
    return tableContent;
  }

  return (
    <div className="student-table-card">
      {tableContent}

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
