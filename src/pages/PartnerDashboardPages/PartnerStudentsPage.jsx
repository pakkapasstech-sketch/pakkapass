import { useMemo, useState } from 'react';
import {
  HiOutlineSearch,
  HiOutlineDownload,
} from 'react-icons/hi';

import StatisticCard from '../../components/cards/StatisticCard';
import StudentTable from '../../pages/students/StudentTable';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';

import { exportToCSV, exportToExcel } from '../../utils/exportUtils';

import '../../styles/student-management.css';
import '../../styles/ParentsManagement.css';

const mockStudents = [
  {
    id: 'STU1001',
    name: 'Rahul Sharma',
    class: '10',
    board: 'CBSE',
    institution: 'ABC School',
    referralCode: 'PARTNER2026',
    plan: 'Premium',
    status: 'Active',
    createdAt: '2026-06-15',
  },
  {
    id: 'STU1002',
    name: 'Sneha Reddy',
    class: '9',
    board: 'State',
    institution: 'XYZ School',
    referralCode: 'PARTNER2026',
    plan: 'Basic',
    status: 'Inactive',
    createdAt: '2026-06-18',
  },
  {
    id: 'STU1003',
    name: 'Arjun Kumar',
    class: '8',
    board: 'CBSE',
    institution: 'ABC School',
    referralCode: 'PARTNER2026',
    plan: 'Premium',
    status: 'Active',
    createdAt: '2026-06-20',
  },
  {
    id: 'STU1004',
    name: 'Priya Singh',
    class: '10',
    board: 'ICSE',
    institution: 'National School',
    referralCode: 'PARTNER2026',
    plan: 'Standard',
    status: 'Active',
    createdAt: '2026-06-22',
  },
  {
    id: 'STU1005',
    name: 'Vikram Patel',
    class: '7',
    board: 'State',
    institution: 'Public School',
    referralCode: 'PARTNER2026',
    plan: 'Basic',
    status: 'Inactive',
    createdAt: '2026-06-24',
  },
];

export default function PartnerStudentsPage() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        searchTerm === '' ||
        student.name.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm) ||
        student.referralCode.toLowerCase().includes(searchTerm);

      const matchesClass =
        classFilter === '' ||
        student.class === classFilter;

      const matchesStatus =
        statusFilter === '' ||
        student.status === statusFilter;

      return (
        matchesSearch &&
        matchesClass &&
        matchesStatus
      );
    });
  }, [search, classFilter, statusFilter]);

  const exportColumns = [
    {
      header: 'Student ID',
      accessor: (r) => r.id,
    },
    {
      header: 'Student',
      accessor: (r) => r.name,
    },
    {
      header: 'Class',
      accessor: (r) => r.class,
    },
    {
      header: 'Board',
      accessor: (r) => r.board,
    },
    {
      header: 'Institution',
      accessor: (r) => r.institution,
    },
    {
      header: 'Referral Code',
      accessor: (r) => r.referralCode,
    },
    {
      header: 'Plan',
      accessor: (r) => r.plan,
    },
    {
      header: 'Status',
      accessor: (r) => r.status,
    },
  ];

  return (
    <div className="parents-page">
      {/* Header */}
      <div className="page-header flex justify-between items-start flex-wrap gap-6">
        <div>
          <h1 className="page-title">
            Students
          </h1>

          <p className="page-subtitle">
            Students registered using your referral code.
          </p>
        </div>

        <div className="header-actions flex gap-4">
          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{
              height: '44px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() =>
              exportToCSV(
                filteredStudents,
                exportColumns,
                'partner-students.csv'
              )
            }
          >
            <HiOutlineDownload />
            CSV
          </button>

          <button
            type="button"
            className="secondary-btn flex items-center gap-2"
            style={{
              height: '44px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() =>
              exportToExcel(
                filteredStudents,
                exportColumns,
                'partner-students.xlsx'
              )
            }
          >
            <HiOutlineDownload />
            Excel
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-grid">
        <StatisticCard
          title="Total Students"
          value={filteredStudents.length}
          icon="students"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatisticCard
          title="Active Students"
          value={
            filteredStudents.filter(
              (s) => s.status === 'Active'
            ).length
          }
          icon="students"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatisticCard
          title="Premium Plans"
          value={
            filteredStudents.filter(
              (s) => s.plan === 'Premium'
            ).length
          }
          icon="subscriptions"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatisticCard
          title="Referral Code"
          value="PARTNER2026"
          icon="partners"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Toolbar */}
      <div className="parents-toolbar">
        <div className="search-box">
          <HiOutlineSearch />

          <input
            type="text"
            placeholder="Search by Student ID, Name or Referral Code..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <CommonFilterDropdown
          placeholder="All Classes"
          value={classFilter || 'All Classes'}
          options={[
            'All Classes',
            '7',
            '8',
            '9',
            '10',
          ]}
          onChange={(value) =>
            setClassFilter(
              value === 'All Classes'
                ? ''
                : value
            )
          }
        />

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
              value === 'All Status'
                ? ''
                : value
            )
          }
        />
      </div>

      {/* Table */}
      <div className="parents-table-wrapper">
        <StudentTable
          students={filteredStudents}
          noCard={false}
        />
      </div>
    </div>
  );
}