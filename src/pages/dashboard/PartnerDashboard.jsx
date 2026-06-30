import { HiOutlineClipboardCopy } from 'react-icons/hi';

import StatisticCard from '../../components/cards/StatisticCard';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import '../../styles/PartnerDashboard.css';
import { toast } from 'react-hot-toast';
const PartnerDashboard = () => {
  const isLoading = false;
  const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(partner.referralMessage);
    toast.success('Referral message copied!');
  } catch {
    toast.error('Failed to copy referral message');
  }
};
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

  const recentRegistrations = [
    {
      id: 1,
      studentId: 'STU1001',
      name: 'Rahul Sharma',
      class: '10',
      parent: 'Amit Sharma',
      referralCode: partner.referralCode,
      status: 'Active',
      registeredOn: '15 Jun 2026',
    },
    {
      id: 2,
      studentId: 'STU1002',
      name: 'Sneha Reddy',
      class: '9',
      parent: 'Suresh Reddy',
      referralCode: partner.referralCode,
      status: 'Pending',
      registeredOn: '18 Jun 2026',
    },
    {
      id: 3,
      studentId: 'STU1003',
      name: 'Arjun Kumar',
      class: '8',
      parent: 'Raj Kumar',
      referralCode: partner.referralCode,
      status: 'Active',
      registeredOn: '20 Jun 2026',
    },
    {
      id: 4,
      studentId: 'STU1004',
      name: 'Priya Singh',
      class: '10',
      parent: 'Neha Singh',
      referralCode: partner.referralCode,
      status: 'Active',
      registeredOn: '22 Jun 2026',
    },
    {
      id: 5,
      studentId: 'STU1005',
      name: 'Vikram Patel',
      class: '7',
      parent: 'Ramesh Patel',
      referralCode: partner.referralCode,
      status: 'Active',
      registeredOn: '24 Jun 2026',
    },
  ];

  const recentPayments = [
    {
      id: 1,
      student: 'Rahul Sharma',
      plan: 'Premium',
      amount: '₹12,000',
      referralCode: partner.referralCode,
      status: 'Paid',
      date: '15 Jun 2026',
    },
    {
      id: 2,
      student: 'Sneha Reddy',
      plan: 'Standard',
      amount: '₹9,500',
      referralCode: partner.referralCode,
      status: 'Paid',
      date: '18 Jun 2026',
    },
    {
      id: 3,
      student: 'Arjun Kumar',
      plan: 'Premium',
      amount: '₹10,500',
      referralCode: partner.referralCode,
      status: 'Pending',
      date: '20 Jun 2026',
    },
    {
      id: 4,
      student: 'Priya Singh',
      plan: 'Premium',
      amount: '₹11,000',
      referralCode: partner.referralCode,
      status: 'Paid',
      date: '22 Jun 2026',
    },
    {
      id: 5,
      student: 'Vikram Patel',
      plan: 'Basic',
      amount: '₹8,500',
      referralCode: partner.referralCode,
      status: 'Paid',
      date: '24 Jun 2026',
    },
  ];

  const copyReferralCode = async () => {
  try {
    await navigator.clipboard.writeText(partner.referralCode);
    toast.success('Referral code copied!');
  } catch {
    toast.error('Failed to copy referral code');
  }
};

  return (
    <div className="partnerdashboard-page">
      <div className="partnerdashboard-header">
        <div>
          <h2>{partner.organizationName}</h2>
          <p>
            Referral Code <strong>{partner.referralCode}</strong>
          </p>
        </div>
      </div>

      <div className="partnerdashboard-stats">
        {statCards.map((card) => (
          <StatisticCard key={card.id} {...card} isLoading={isLoading} />
        ))}
      </div>

     <div className="partnerdashboard-referral-container">
  <div className="partnerdashboard-referral-card">
    <p>Generated Referral Code</p>

    <h1>{partner.referralCode}</h1>

    <button
      className="partnerdashboard-copy-code-btn"
      onClick={copyReferralCode}
    >
      <HiOutlineClipboardCopy />
      Copy Code
    </button>
  </div>

  <div className="partnerdashboard-message-card">
    <h3>Referral Message</h3>

    <textarea
      value={partner.referralMessage}
      readOnly
      rows={8}
    />

    <button
      className="partnerdashboard-copy-message-btn"
      onClick={copyMessage}
    >
      <HiOutlineClipboardCopy />
      Copy Message
    </button>
  </div>
</div>

      <div className="partnerdashboard-summary">
        <div className="partnerdashboard-summary-card">
          <span>Total Commission Earned</span>
          <h3>₹{analytics.revenue.totalCommissionEarned.toLocaleString()}</h3>
        </div>

        <div className="partnerdashboard-summary-card">
          <span>Total Commission Paid</span>
          <h3>₹{analytics.revenue.totalCommissionPaid.toLocaleString()}</h3>
        </div>

        <div className="partnerdashboard-summary-card">
          <span>Monthly Registrations</span>
          <h3>{analytics.students.monthlyRegistrations}</h3>
        </div>

        <div className="partnerdashboard-summary-card">
          <span>Monthly Revenue</span>
          <h3>₹{analytics.revenue.monthlyRevenue.toLocaleString()}</h3>
        </div>
      </div>
      <div className="partnerdashboard-dashboard-section">
        {/* Recent Registrations */}

        <div className="partnerdashboard-table-card">
          <div className="partnerdashboard-table-title">
            <h3>Recent Registrations</h3>

            <Link to="/partner/students" className="partnerdashboard-view-all">
              View All
              <HiOutlineArrowRight />
            </Link>
          </div>
          <div className="partnerdashboard-table-wrapper">
            <table className="partnerdashboard-data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Parent</th>
                  <th>Referral Code</th>
                  <th>Status</th>
                  <th>Registered On</th>
                </tr>
              </thead>

              <tbody>
                {recentRegistrations.map((student) => (
                  <tr key={student.id}>
                    <td>{student.studentId}</td>

                    <td>{student.name}</td>

                    <td>Class {student.class}</td>

                    <td>{student.parent}</td>

                    <td>{student.referralCode}</td>

                    <td>
                      <span
                        className={`partnerdashboard-status ${
                          student.status === 'Active'
                            ? 'partnerdashboard-status-active'
                            : 'partnerdashboard-status-pending'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>{student.registeredOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}

        <div className="partnerdashboard-table-card">
          <div className="partnerdashboard-table-title">
            <h3>Recent Payments</h3>

            <Link to="/partner/payments" className="partnerdashboard-view-all">
              View All
              <HiOutlineArrowRight />
            </Link>
          </div>
          <div className="partnerdashboard-table-wrapper">
            <table className="partnerdashboard-data-table">
              <thead>
                <tr>
                  <th>Student</th>

                  <th>Plan</th>

                  <th>Amount</th>

                  <th>Referral Code</th>

                  <th>Status</th>

                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.student}</td>

                    <td>{payment.plan}</td>

                    <td>{payment.amount}</td>

                    <td>{payment.referralCode}</td>

                    <td>
                      <span
                        className={`partnerdashboard-status ${
                          payment.status === 'Paid'
                            ? 'partnerdashboard-status-active'
                            : 'partnerdashboard-status-pending'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td>{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
