import { useState, useEffect } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import '../../styles/student-table.css';
import { useStudentFilterOptions } from '../../hooks/useStudents';

const StudentTable = ({
  students = [],
  noCard = false,
  hideInstitution = false,
  hideBranch = false,
  showView = true,
  partnerMap = {},
}) => {
  const navigate = useNavigate();
  const { data: optionsData } = useStudentFilterOptions();
  const branches = optionsData?.branches || [];

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
            <th>S.No</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Board</th>
            {!hideBranch && <th>Branch</th>}
            {!hideInstitution && <th>Institution</th>}
            <th>REFCODE</th>
            <th>Subscription Plan</th>
            <th>Status</th>
            <th>Registered On</th>
            {showView !== false && <th>View</th>}
          </tr>
        </thead>

        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map((student, index) => {
              const partnerVal = student.profile?.partnerId ? partnerMap[String(student.profile.partnerId)] : null;
              const partnerCode = typeof partnerVal === 'object' && partnerVal !== null ? partnerVal?.referralCode : partnerVal;
              return (
                <tr
                  key={`${student.id}-${startIndex + index}`}
                  className={showView ? "clickable-row" : ""}
                  onClick={() => {
                    if (showView) {
                      navigate(`/students/${student.id}`);
                    }
                  }}
                >
                  <td>{startIndex + index + 1}</td>

                  <td>
                    <div className="student-user">
                        <img
                          src={
                            student.photo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`
                          }
                          alt={`${student.name}'s profile`}
                          className="student-avatar"
                          width="40"
                          height="40"
                        />

                      <div>
                        <div className="student-name">{student.name}</div>
                      </div>
                    </div>
                  </td>

                  <td>{student.class}</td>

                  <td>{student.board}</td>

                  {!hideBranch && (
                    <td>
                      {branches.find(b => String(b.id) === String(student.profile?.branchId || student.branchId))?.name || student.branch || 'N/A'}
                    </td>
                  )}

                  {!hideInstitution && (
                    <td className="institute-cell" title={student.institution}>
                      {student.institution}
                    </td>
                  )}

                  <td>{student.referralCode || partnerCode || student.refCode || 'Null'}</td>

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
                          : student.status === 'Trial'
                            ? 'status-trial'
                            : 'status-pending'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>

                <td>
                  {(() => {
                    const dateVal = student.createdAt || student.registeredOn;
                    if (!dateVal) return '—';
                    const parsedDate = new Date(dateVal);
                    if (!isNaN(parsedDate.getTime())) {
                      return parsedDate.toLocaleDateString();
                    }
                    return dateVal;
                  })()}
                </td>

                {showView !== false && (
                  <td>
                    <button
                      className="table-action-btn"
                      onClick={() => navigate(`/students/${student.id}`)}
                      title="View Student"
                      aria-label={`View details for ${student.name}`}
                    >
                      <HiOutlineEye />
                    </button>
                  </td>
                )}
              </tr>
            );
          })
          ) : (
            <tr>
              <td colSpan={(hideInstitution ? 9 : 10) + (showView !== false ? 1 : 0) + 1 - (hideBranch ? 1 : 0)} className="empty-table">
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
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} aria-label="Previous Page">
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
      )}
    </div>
  );
};

export default StudentTable;
