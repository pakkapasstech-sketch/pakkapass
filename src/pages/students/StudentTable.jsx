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
    <span
      className={`rounded-md px-2 py-1 text-[11px] font-medium ${styles[status]}`}
    >
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

  const totalPages = Math.ceil(
    totalStudents / studentsPerPage
  );

  const startIndex =
    (currentPage - 1) * studentsPerPage;

  const endIndex =
    startIndex + studentsPerPage;

  const currentStudents =
    students.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-slate-50">
              <th className="px-4 py-4 text-left text-xs font-semibold">#</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Student Name</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Mobile Number</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Class</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Board</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Institution</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">State</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Subscription Plan</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Status</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Registered On</th>
              <th className="px-4 py-4 text-left text-xs font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-4 text-sm">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          student.photo ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            student.name
                          )}`
                        }
                        alt={student.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {student.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {student.mobile}
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {student.class}
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {student.board}
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {student.institution}
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {student.state}
                  </td>

                  <td className="px-4 py-4">
                    <PlanBadge plan={student.plan} />
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={student.status} />
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {student.registeredOn}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                        onClick={() =>
                          navigate(`/students/${student.id}`)
                        }
                      >
                        <HiOutlineEye />
                      </button>

                      <button className="rounded-lg p-2 text-amber-600 hover:bg-amber-50">
                        <HiOutlinePencil />
                      </button>

                      <button className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="py-10 text-center text-gray-500"
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalStudents > 0 && (
        <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-6 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-gray-500">
            Showing {startIndex + 1} to{' '}
            {Math.min(endIndex, totalStudents)} of{' '}
            {totalStudents} students
          </p>

          <div className="flex items-center gap-2">
            <button
              className="rounded border p-2 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
            >
              <HiOutlineChevronLeft />
            </button>

            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-1 ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              className="rounded border p-2 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
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