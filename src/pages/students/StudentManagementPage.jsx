import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import StudentFilters from './StudentFilters';
import StudentStatsCards from './StudentStatsCards';
import StudentTable from './StudentTable';

import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import ErrorState from '../../components/loaders/ErrorState';

import { useStudents } from '../../hooks/useStudents';
import { usePermissions } from '../../auth/usePermissions';
import { PERMISSIONS } from '../../auth/permissions';

import '../../styles/student-management.css';

const StudentManagementPage = () => {
  const [filters, setFilters] =
    useState({
      search: '',
      class: '',
      board: '',
      college: '',
      state: '',
      status: '',
    });

  const location =
    useLocation();

  const {
    data: students = [],
    isLoading,
    isError,
    refetch,
  } = useStudents();

  const {
    hasPermission,
  } = usePermissions();

  const sortRecent =
    location.state?.sortRecent;

  const filteredStudents =
    students.filter(
      (student) => {
        const q = (
          filters.search ||
          ''
        )
          .toLowerCase()
          .trim();

        const searchMatch =
  !q ||
  [
    student.name,
    student.email,
    student.mobile,
    student.studentId,
    student.referralCode,
    student.partner?.referralCode,
    student.profile?.partner?.referralCode,
    student.institution,
    student.grade,
    student.board,
    student.state,
    student.status,
    student.plan,
    student.profile?.plan?.name,
    student.parentName,
    student.parentEmail,
    student.parentMobile,
  ]
    .filter(Boolean)
    .some((value) =>
      String(value)
        .toLowerCase()
        .includes(q)
    );

        const classMatch =
          !filters.class ||
          student.grade ===
            filters.class;

        const boardMatch =
          !filters.board ||
          student.board ===
            filters.board;

        const collegeMatch =
          !filters.college ||
          student.institution ===
            filters.college;

        const stateMatch =
          !filters.state ||
          student.state ===
            filters.state;

        const statusMatch =
          !filters.status ||
          student.status ===
            filters.status;

        return (
          searchMatch &&
          classMatch &&
          boardMatch &&
          collegeMatch &&
          stateMatch &&
          statusMatch
        );
      }
    );

  const displayStudents =
    sortRecent
      ? [
          ...filteredStudents,
        ].sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        )
      : filteredStudents;

  if (isLoading) {
    return (
      <LoadingSkeleton
        rows={8}
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load students"
        onRetry={
          refetch
        }
      />
    );
  }

  return (
    <div className="student-management-page">
      <StudentFilters
        onFilterChange={
          setFilters
        }
      />

      <StudentStatsCards
        students={
          filteredStudents
        }
      />

      <StudentTable
        students={
          displayStudents
        }
        canCreate={hasPermission(
          PERMISSIONS.STUDENT_CREATE
        )}
        canEdit={hasPermission(
          PERMISSIONS.STUDENT_EDIT
        )}
        canDelete={hasPermission(
          PERMISSIONS.STUDENT_DELETE
        )}
      />
    </div>
  );
};

export default StudentManagementPage;