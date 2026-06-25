import { useMemo, useState } from 'react';
import {
  HiOutlineClipboardCopy,
  HiOutlineSearch,
} from 'react-icons/hi';

import StatisticCard from '../../components/cards/StatisticCard';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';

import '../../styles/PartnerDashboard.css';

const PartnerDashboard = () => {
  const isLoading = false;

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const partner = {
    organizationName: 'ABC Educational Services',
    referralCode: 'PARTNER2026',
    referralMessage:
      'Share your referral code with parents and earn commission on every successful admission.',
  };

  const analytics = {
    students: {
      totalStudents: 128,
      activeStudents: 102,
      monthlyRegistrations: 14,
    },
    revenue: {
      totalRevenue: 248500,
      pendingCommission: 18500,
      totalCommissionEarned: 74500,
      totalCommissionPaid: 56000,
      monthlyRevenue: 48500,
    },
  };

  const statCards = [
    {
      id: 'total',
      title: 'Students Referred',
      formattedValue: String(analytics.students.totalStudents),
      trend: 12,
      trendLabel: 'this month',
      trendUp: true,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      icon: 'students',
    },
    {
      id: 'active',
      title: 'Active Students',
      formattedValue: String(analytics.students.activeStudents),
      trend: 8,
      trendLabel: 'active',
      trendUp: true,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      icon: 'students',
    },
    {
      id: 'revenue',
      title: 'Total Revenue',
      formattedValue: `₹${analytics.revenue.totalRevenue.toLocaleString()}`,
      trend: 18,
      trendLabel: 'generated',
      trendUp: true,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: 'commissions',
    },
    {
      id: 'commission',
      title: 'Pending Commission',
      formattedValue: `₹${analytics.revenue.pendingCommission.toLocaleString()}`,
      trend: 4,
      trendLabel: 'pending',
      trendUp: false,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: 'commissions',
    },
  ];

  const referredStudents = [
    {
      id: 1,
      studentId: 'STU1001',
      name: 'Rahul Sharma',
      class: '10',
      parent: 'Amit Sharma',
      registeredOn: '15 Jun 2026',
      status: 'Active',
      fee: '₹12,000',
    },
    {
      id: 2,
      studentId: 'STU1002',
      name: 'Sneha Reddy',
      class: '9',
      parent: 'Suresh Reddy',
      registeredOn: '18 Jun 2026',
      status: 'Pending',
      fee: '₹9,500',
    },
    {
      id: 3,
      studentId: 'STU1003',
      name: 'Arjun Kumar',
      class: '8',
      parent: 'Raj Kumar',
      registeredOn: '20 Jun 2026',
      status: 'Active',
      fee: '₹10,500',
    },
    {
      id: 4,
      studentId: 'STU1004',
      name: 'Priya Singh',
      class: '10',
      parent: 'Neha Singh',
      registeredOn: '22 Jun 2026',
      status: 'Active',
      fee: '₹11,000',
    },
    {
      id: 5,
      studentId: 'STU1005',
      name: 'Vikram Patel',
      class: '7',
      parent: 'Ramesh Patel',
      registeredOn: '24 Jun 2026',
      status: 'Active',
      fee: '₹8,500',
    },
  ];

  const filteredStudents = useMemo(() => {
    return referredStudents.filter((student) => {
      const matchesSearch =
        student.studentId
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        student.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        student.parent
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesClass =
        !selectedClass ||
        student.class === selectedClass;

      const matchesStatus =
        !selectedStatus ||
        student.status === selectedStatus;

      return (
        matchesSearch &&
        matchesClass &&
        matchesStatus
      );
    });
  }, [
    search,
    selectedClass,
    selectedStatus,
  ]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(
      partner.referralCode
    );
  };

  return (
    <div className="partnerdashboard-page">

      <div className="partnerdashboard-header">
        <div>
          <h2>{partner.organizationName}</h2>
          <p>
            Referral Code{' '}
            <strong>{partner.referralCode}</strong>
          </p>
        </div>
      </div>

      <div className="partnerdashboard-stats">
        {statCards.map((card) => (
          <StatisticCard
            key={card.id}
            {...card}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="partnerdashboard-referral-card">

        <div className="partnerdashboard-referral-header">

          <h3>Your Referral Message</h3>

          <button
            className="partnerdashboard-copy-btn"
            onClick={copyReferralCode}
          >
            <HiOutlineClipboardCopy />
            Copy Referral Code
          </button>

        </div>

        <div className="partnerdashboard-referral-code">
          {partner.referralCode}
        </div>

        <p>{partner.referralMessage}</p>

      </div>

      <div className="partnerdashboard-summary">

        <div className="partnerdashboard-summary-card">
          <span>Total Commission Earned</span>
          <h3>
            ₹
            {analytics.revenue.totalCommissionEarned.toLocaleString()}
          </h3>
        </div>

        <div className="partnerdashboard-summary-card">
          <span>Total Commission Paid</span>
          <h3>
            ₹
            {analytics.revenue.totalCommissionPaid.toLocaleString()}
          </h3>
        </div>

        <div className="partnerdashboard-summary-card">
          <span>Monthly Registrations</span>
          <h3>
            {analytics.students.monthlyRegistrations}
          </h3>
        </div>

        <div className="partnerdashboard-summary-card">
          <span>Monthly Revenue</span>
          <h3>
            ₹
            {analytics.revenue.monthlyRevenue.toLocaleString()}
          </h3>
        </div>

      </div>
            <div className="partnerdashboard-students">

        <div className="partnerdashboard-section-header">
          <h3>Students Registered Using Your Referral Code</h3>

          <span>
            {filteredStudents.length} Students
          </span>
        </div>

        {/* Toolbar */}

        <div className="partnerdashboard-toolbar">

          <div className="partnerdashboard-search">

            <HiOutlineSearch />

            <input
              type="text"
              placeholder="Search Student ID, Student or Parent..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <CommonFilterDropdown
            placeholder="Class"
            value={selectedClass}
            options={[
              '7',
              '8',
              '9',
              '10',
            ]}
            onChange={setSelectedClass}
          />

          <CommonFilterDropdown
            placeholder="Status"
            value={selectedStatus}
            options={[
              'Active',
              'Pending',
            ]}
            onChange={setSelectedStatus}
          />

          {/* <button
            className="partnerdashboard-reset-btn"
            onClick={() => {
              setSearch('');
              setSelectedClass('');
              setSelectedStatus('');
            }}
          >
            Reset
          </button> */}

        </div>

        {/* Students Table */}

        <div className="partnerdashboard-table">

          <div className="partnerdashboard-table-header">

            <div>Student ID</div>

            <div>Student Name</div>

            <div>Class</div>

            <div>Parent</div>

            <div>Registered On</div>

            <div>Status</div>

            <div>Subscription</div>

          </div>

          {filteredStudents.length === 0 ? (

            <div className="partnerdashboard-empty">

              No students found.

            </div>

          ) : (

            filteredStudents.map((student) => (

              <div
                className="partnerdashboard-table-row"
                key={student.id}
              >

                <div className="partnerdashboard-student-id">
                  {student.studentId}
                </div>

                <div className="partnerdashboard-student-name">
                  {student.name}
                </div>

                <div>
                  Class {student.class}
                </div>

                <div>
                  {student.parent}
                </div>

                <div>
                  {student.registeredOn}
                </div>

                <div>

                  <span
                    className={`partnerdashboard-status ${
                      student.status === 'Active'
                        ? 'partnerdashboard-status-active'
                        : 'partnerdashboard-status-pending'
                    }`}
                  >
                    {student.status}
                  </span>

                </div>

                <div className="partnerdashboard-fee">
                  {student.fee}
                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default PartnerDashboard;