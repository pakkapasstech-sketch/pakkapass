import { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import StudentFilters from './StudentFilters';
import StudentStatsCards from './StudentStatsCards';
import StudentTable from './StudentTable';


import ErrorState from '../../components/loaders/ErrorState';

import { useStudents, useInactiveStudents } from '../../hooks/useStudents';
import { usePermissions } from '../../auth/usePermissions';
import { PERMISSIONS } from '../../auth/permissions';
import { usePartners } from '../../hooks/usePartners';
import { useMemo } from 'react';

import '../../styles/student-management.css';
import { useLoading } from '../../contexts/LoadingContext';
import { HiOutlineDownload, HiOutlineUpload } from 'react-icons/hi';
import {  exportToExcel } from '../../utils/exportUtils';
const StudentManagementPage = () => {
  const navigate = useNavigate();
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

  const [showInactive, setShowInactive] = useState(false);

  const {
    data: activeStudents = [],
    isLoading: activeLoading,
    isError: activeError,
    refetch: refetchActive,
  } = useStudents();

  const {
    data: inactiveStudents = [],
    isLoading: inactiveLoading,
    isError: inactiveError,
    refetch: refetchInactive,
  } = useInactiveStudents(showInactive);

  const students = showInactive ? inactiveStudents : activeStudents;
  const isLoading = showInactive ? inactiveLoading : activeLoading;
  const isError = showInactive ? inactiveError : activeError;
  const refetch = showInactive ? refetchInactive : refetchActive;

  const { data: partnersData } = usePartners({ limit: 1000 });
  const partners = partnersData?.partners || partnersData || [];

  const partnerMap = useMemo(() => {
    const map = {};
    if (Array.isArray(partners)) {
      partners.forEach((p) => {
        if (p.id) {
          map[String(p.id)] = p.referralCode;
        }
      });
    }
    return map;
  }, [partners]);

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
    // student.id,                    
    student.profile?.studentId,  
    student.referralCode,
    student.partner?.referralCode,
    student.profile?.partner?.referralCode,
    student.profile?.partnerId && partnerMap[String(student.profile.partnerId)],
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
  student.profile?.grade?.name?.trim().toLowerCase() ===
    filters.class.trim().toLowerCase();

const boardMatch =
  !filters.board ||
  student.profile?.board?.name?.trim().toLowerCase() ===
    filters.board.trim().toLowerCase();

const collegeMatch =
  !filters.college ||
  student.profile?.institution?.trim().toLowerCase() ===
    filters.college.trim().toLowerCase();

const stateMatch =
  !filters.state ||
  student.profile?.state?.trim().toLowerCase() ===
    filters.state.trim().toLowerCase();

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

  const displayStudents = [...filteredStudents].sort(
    (a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
  );

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
            {showInactive ? 'Inactive Students (> 1 Week)' : 'Student Management'}
          </h1>
          <p className="page-subtitle">
            {showInactive ? 'Viewing students who have been inactive for more than a week.' : 'Search students, manage records, and view their details.'}
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
            onClick={() => navigate('/students/import')}
          >
            <HiOutlineUpload />
            Import
          </button>
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{ 
              height: '44px', 
              padding: '0 16px', 
              borderRadius: '12px', 
              border: showInactive ? '1px solid #ef4444' : '1px solid var(--color-border)', 
              background: showInactive ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-card)', 
              color: showInactive ? '#ef4444' : 'var(--color-text-primary)', 
              fontWeight: '600', 
              fontSize: '14px', 
              cursor: 'pointer' 
            }}
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? 'All Students' : 'Inactive Students'}
          </button>
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
                { header: 'REFCODE', accessor: (r) => r.referralCode || (r.profile?.partnerId && partnerMap[String(r.profile.partnerId)]) || r.refCode || 'Null' },
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
        partnerMap={partnerMap}
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