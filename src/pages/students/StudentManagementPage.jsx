import { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import StudentFilters from './StudentFilters';
import StudentStatsCards from './StudentStatsCards';
import StudentTable from './StudentTable';


import ErrorState from '../../components/loaders/ErrorState';

import { useStudents } from '../../hooks/useStudents';
import { usePermissions } from '../../auth/usePermissions';
import { PERMISSIONS } from '../../auth/permissions';

import '../../styles/student-management.css';
import { useLoading } from '../../contexts/LoadingContext';
import { HiOutlineDownload } from 'react-icons/hi';
import {  exportToExcel } from '../../utils/exportUtils';
const StudentManagementPage = () => {
  const { setLoading } = useLoading();
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
    student.class,
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
  student.class === filters.class;

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

  useEffect(() => {
  setLoading(isLoading);

  return () => setLoading(false);
}, [isLoading, setLoading]);

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
      <div className="page-header flex justify-between items-start flex-wrap gap-6">
        <div>
          <h1 className="page-title">
            Student Management
          </h1>
          <p className="page-subtitle">
            Search students, manage records, and view their details.
          </p>
        </div>
        <div className="header-actions flex gap-4">
          {/* <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{ height: '44px', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            onClick={() => {
              const exportCols = [
                { header: 'ID', accessor: (r) => r.id },
                { header: 'Student Name', accessor: (r) => r.name },
                { header: 'Class', accessor: (r) => r.class },
                { header: 'Board', accessor: (r) => r.board },
                { header: 'Institution', accessor: (r) => r.institution },
                { header: 'REFCODE', accessor: (r) => r.referralCode || r.refCode || 'Null' },
                { header: 'Subscription Plan', accessor: (r) => r.plan },
                { header: 'Status', accessor: (r) => r.status },
                { header: 'Registered On', accessor: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.registeredOn || '—' },
              ];
              exportToCSV(displayStudents, exportCols, 'students.csv');
            }}
          >
            <HiOutlineDownload />
            CSV
          </button> */}
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{ height: '44px', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            onClick={() => {
              const exportCols = [
                { header: 'ID', accessor: (r) => r.id },
                { header: 'Student Name', accessor: (r) => r.name },
                { header: 'Class', accessor: (r) => r.class },
                { header: 'Board', accessor: (r) => r.board },
                { header: 'Institution', accessor: (r) => r.institution },
                { header: 'REFCODE', accessor: (r) => r.referralCode || r.refCode || 'Null' },
                { header: 'Subscription Plan', accessor: (r) => r.plan },
                { header: 'Status', accessor: (r) => r.status },
                { header: 'Registered On', accessor: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.registeredOn || '—' },
              ];
              exportToExcel(displayStudents, exportCols, 'students.xlsx');
            }}
          >
            <HiOutlineDownload />
            Export
          </button>
        </div>
      </div>

      <StudentStatsCards
        students={
          filteredStudents
        }
      />
      <StudentFilters
        onFilterChange={
          setFilters
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