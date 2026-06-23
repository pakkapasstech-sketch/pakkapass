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
    useState({});

  const location =
    useLocation();

  const {
    data: students = [],
    isLoading,
    isError,
    refetch,
  } = useStudents();

  const { hasPermission } =
    usePermissions();

  const sortRecent =
    location.state?.sortRecent;

  const filteredStudents =
    students.filter(
      (student) => {
        const searchMatch =
          !filters.search ||
          student.name
            ?.toLowerCase()
            .includes(
              filters.search.toLowerCase()
            ) ||
          student.mobile?.includes(
            filters.search
          );

        const classMatch =
          !filters.class ||
          filters.class ===
            'All Classes' ||
          student.class ===
            filters.class;

        const boardMatch =
          !filters.board ||
          filters.board ===
            'All Boards' ||
          student.board ===
            filters.board;

        const stateMatch =
          !filters.state ||
          filters.state ===
            'All States' ||
          student.state ===
            filters.state;

        const matchCollege =
          !filters.college ||
          student.institution
            ?.trim()
            .toLowerCase() ===
            filters.college
              .trim()
              .toLowerCase();

        const statusMatch =
          !filters.status ||
          filters.status ===
            'All' ||
          student.status ===
            filters.status;

        return (
          searchMatch &&
          classMatch &&
          boardMatch &&
          stateMatch &&
          matchCollege &&
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