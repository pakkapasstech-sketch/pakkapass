import { HiOutlineClipboardCopy } from 'react-icons/hi';

import StatisticCard from '../../components/cards/StatisticCard';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import '../../styles/PartnerDashboard.css';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import partnerService from '../../services/partner.service';
import { useLoading } from '../../contexts/LoadingContext';

const PartnerDashboard = () => {
  const { setLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [options, setOptions] = useState({});
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(partner.referralMessage);
      toast.success('Referral message copied!');
    } catch {
      toast.error('Failed to copy referral message');
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(partner.referralCode);
      toast.success('Referral code copied!');
    } catch {
      toast.error('Failed to copy referral code');
    }
  };
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        const [data, optionsData] = await Promise.all([
          partnerService.getDashboard(),
          partnerService.getOptions().catch(err => {
            console.error("Failed to load options:", err);
            return { grades: [], boards: [], branches: [] };
          })
        ]);

        setDashboard(data);
        setOptions(optionsData || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [setLoading]);
  const partner = dashboard?.partner || {};

  const analytics = dashboard?.analytics || {};

  const recentRegistrations = (dashboard?.recentStudents || []).map(s => {
    const gradeName = (options.grades || []).find(g => String(g.id) === String(s.gradeId))?.name || 'N/A';
    const boardName = (options.boards || []).find(b => String(b.id) === String(s.boardId))?.name || 'N/A';
    const branchName = (options.branches || []).find(br => String(br.id) === String(s.branchId))?.name || 'N/A';
    
    return {
      id: s.id,
      name: s.student?.name || 'Unknown',
      class: gradeName,
      board: boardName,
      branch: branchName,
      status: s.plan ? 'Active' : 'Inactive',
      registeredOn: s.student?.createdAt,
    };
  });

  const recentPayments = (dashboard?.recentPayments || [])
    .filter(p => p.partnerId && String(p.partnerId) === String(partner.id) && (Number(p.discountAmount) > 0 || p.couponCode === partner.referralCode))
    .map(p => ({
      id: p.id,
      transactionId: p.transactionId || String(p.id),
      student: p.student?.name || 'Unknown',
      plan: p.plan?.name || 'N/A',
      amount: `₹${p.amount || 0}`,
      status: p.status || 'Paid',
      paymentDate: p.createdAt,
    }));
  const statCards = [
    {
      id: 'total',
      title: 'Students Referred',
      formattedValue: String(analytics?.students?.totalStudents ?? 0),
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
      formattedValue: String(analytics?.students?.activeStudents ?? 0),
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
      formattedValue: (() => {
        const totalAmountPaid = (dashboard?.recentPayments || [])
          .filter(
            (p) =>
              p.partnerId &&
              String(p.partnerId) === String(partner.id) &&
              (Number(p.discountAmount) > 0 || p.couponCode === partner.referralCode)
          )
          .filter((p) => p.status === 'Success' || p.status === 'Paid')
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        return `₹${totalAmountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      })(),
      trend: 18,
      trendLabel: 'generated',
      trendUp: true,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: 'commissions',
    },
    {
      id: 'monthly_registrations',
      title: 'Monthly Registrations',
      formattedValue: String(analytics?.students?.monthlyRegistrations ?? 0),
      trend: 0,
      trendLabel: 'registrations',
      trendUp: true,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: 'students',
    },
  ];
  return (
    <div className="partnerdashboard-page">
      <div className="partnerdashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {partner.logo && (
            <img
              src={partner.logo}
              alt={partner.organizationName}
              style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'contain', border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: '4px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div>
            <h2>{partner.organizationName}</h2>
            <p>
              Referral Code <strong>{partner.referralCode}</strong>
            </p>
          </div>
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

          <button className="partnerdashboard-copy-code-btn" onClick={copyReferralCode}>
            <HiOutlineClipboardCopy />
            Copy Code
          </button>
        </div>

        <div className="partnerdashboard-message-card">
          <h3>Referral Message</h3>

          <textarea value={partner.referralMessage} readOnly rows={8} />

          <button className="partnerdashboard-copy-message-btn" onClick={copyMessage}>
            <HiOutlineClipboardCopy />
            Copy Message
          </button>
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
                  <th>S.No</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Board</th>
                  <th>Branch</th>

                  <th>Status</th>
                  <th>Registered On</th>
                </tr>
              </thead>

              <tbody>
                {recentRegistrations.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>

                    <td>{student.name}</td>

                    <td>{student.class}</td>

                    <td>{student.board}</td>

                    <td>{student.branch}</td>

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

                    <td>
                      {student.registeredOn
                        ? new Date(student.registeredOn).toLocaleDateString()
                        : '-'}
                    </td>
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
                  <th>Transaction ID</th>

                  <th>Student</th>

                  <th>Plan</th>

                  <th>Amount</th>

                 

                  <th>Status</th>

                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.transactionId}</td>

                    <td>{payment.student}</td>

                    <td>{payment.plan}</td>

                    <td>{payment.amount}</td>

                    

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

                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
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
