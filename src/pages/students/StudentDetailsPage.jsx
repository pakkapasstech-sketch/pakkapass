import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineLogin,
  HiOutlineUser,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineClock,
} from 'react-icons/hi';

import '../../styles/student-details.css';
import '../../styles/table.css';
import '../../styles/student-table.css';
import useStudents, { useStudent, useStudentFilterOptions, useStudentActivities } from '../../hooks/useStudents';
import { useLoading } from '../../contexts/LoadingContext';
import { toast } from 'react-hot-toast';
import { studentService } from '../../services/student.service';

import ErrorState from '../../components/loaders/ErrorState';

const tabs = [
  'Overview',
  'Parent Details',
  'Activity Analytics',
  'Subscription History',
  'Payment History',
];

const formatActivityDescription = (description) => {
  if (!description) return '';
  let formatted = description.replace(/^[Yy]ou\s+/, '');
  if (formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  return formatted;
};

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { data: student, isLoading, isError, refetch } = useStudent(id);
  const { data: filterOptions } = useStudentFilterOptions();
  const { data: activities = [] } = useStudentActivities(id);

  const groupedActivities = useMemo(() => {
    if (!activities || activities.length === 0) return [];

    const grouped = [];
    activities.forEach((activity) => {
      const formattedDesc = formatActivityDescription(activity.description);
      const key = `${activity.actionType || ''}___${formattedDesc.toLowerCase()}`;

      if (grouped.length > 0) {
        const last = grouped[grouped.length - 1];
        const lastFormattedDesc = formatActivityDescription(last.description);
        const lastKey = `${last.actionType || ''}___${lastFormattedDesc.toLowerCase()}`;

        if (lastKey === key) {
          last.count = (last.count || 1) + 1;
          return;
        }
      }

      grouped.push({
        ...activity,
        count: 1,
      });
    });

    return grouped;
  }, [activities]);
  const { data: allStudents } = useStudents();
  const currentStudentFromAll = allStudents?.find(s => String(s.id) === String(id));
  const deviceModel = currentStudentFromAll?.deviceModel || 'N/A';
  const ipAddress = currentStudentFromAll?.ipAddress || 'N/A';

  const gradeName = filterOptions?.grades?.find(g => String(g.id) === String(student?.gradeId))?.name || student?.class || 'N/A';
  const boardName = filterOptions?.boards?.find(b => String(b.id) === String(student?.boardId))?.name || student?.board || 'N/A';
  const branchName = filterOptions?.branches?.find(br => String(br.id) === String(student?.branchId))?.name || student?.branch || 'N/A';

  const supplyPlans = useMemo(() => {
    if (!student?.payments || !Array.isArray(student.payments)) return [];
    return student.payments
      .filter((p) => {
        const isSupPlan = p.plan?.isSupply || p.isSupply || (p.plan?.name && (p.plan.name.toLowerCase().includes('supply') || p.plan.name.toLowerCase().includes('carry')));
        return isSupPlan;
      })
      .map((p) => {
        let subjName = p.plan?.subject?.name || p.subjectName || null;
        if (!subjName && p.plan?.subjectId && filterOptions?.subjects) {
          const found = filterOptions.subjects.find((s) => String(s.id) === String(p.plan.subjectId));
          if (found) subjName = found.name;
        }
        if (!subjName && p.plan?.name) {
          subjName = p.plan.name.replace(/\s*[-_]?\s*(Supply|Carry|Plan).*/i, '').trim();
        }
        return {
          id: p.id,
          planName: p.plan?.name || 'Supply Plan',
          subject: subjName || p.plan?.name || 'Supply Subject',
          amount: p.amount,
          status: p.status === 'Success' ? 'Active' : p.status,
          date: p.createdAt,
        };
      });
  }, [student?.payments, filterOptions?.subjects]);

  const normalSubjectUsage = useMemo(() => {
    if (!student?.subjectWiseUsage || !Array.isArray(student.subjectWiseUsage)) return [];
    return student.subjectWiseUsage;
  }, [student?.subjectWiseUsage]);

  const supplySubjectUsage = useMemo(() => {
    if (!supplyPlans || supplyPlans.length === 0) return [];
    return supplyPlans.map((sp) => ({
      subject: sp.subject || sp.planName,
      percentage: 0,
      hours: '0.00',
      isSupply: true,
      planName: sp.planName,
    }));
  }, [supplyPlans]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'LOGIN':
        return <HiOutlineLogin />;
      case 'CREATE_PROFILE':
      case 'PROFILE_UPDATED':
        return <HiOutlineUser />;
      case 'STUDY_SESSION':
        return <HiOutlineBookOpen />;
      case 'TOPIC_COMPLETED':
        return <HiOutlineCheckCircle />;
      case 'PLAN_SELECTED':
      case 'TRIAL_STARTED':
      case 'PAYMENT_SUCCESS':
        return <HiOutlineCreditCard />;
      default:
        return <HiOutlineClock />;
    }
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case 'LOGIN':
        return 'Login';
      case 'CREATE_PROFILE':
        return 'Profile Created';
      case 'PROFILE_UPDATED':
        return 'Profile Updated';
      case 'STUDY_SESSION':
        return 'Study Session';
      case 'TOPIC_COMPLETED':
        return 'Topic Completed';
      case 'PLAN_SELECTED':
        return 'Plan Selected';
      case 'TRIAL_STARTED':
        return 'Free Trial Started';
      case 'PAYMENT_SUCCESS':
        return 'Subscription Purchased';
      default:
        return type?.replace('_', ' ') || '';
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Overview';
  const setActiveTab = (tab) => {
    setSearchParams(prev => {
      prev.set('tab', tab);
      return prev;
    }, { replace: true });
  };

  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [extendDays, setExtendDays] = useState(30);
  const [isExtending, setIsExtending] = useState(false);

  const handleExtendPlan = async () => {
    if (!extendDays || extendDays <= 0) {
      toast.error('Please enter a valid number of days');
      return;
    }
    try {
      setIsExtending(true);
      await studentService.extendPlan(id, extendDays);
      toast.success(`Plan extended by ${extendDays} days successfully`);
      setIsExtendModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error extending plan:', error);
      toast.error(error?.response?.data?.message || 'Failed to extend plan');
    } finally {
      setIsExtending(false);
    }
  };

useEffect(() => {
  setLoading(isLoading);

  return () => setLoading(false);
}, [isLoading, setLoading]);

  if (isError) {
    return (
      <ErrorState
        message="Failed to load student details"
        onRetry={refetch}
      />
    );
  }

  if (!student) {
    return (
      <div className="student-not-found">
        <h2>Student Not Found</h2>

        <button
          className="back-btn"
          onClick={() => navigate('/students')}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="student-dashboard">

      {/* Back Button */}
      <div className="student-topbar">
        <button
          className="back-link"
          onClick={() => navigate('/students')}
        >
          <HiOutlineArrowLeft />
          Back to Students
        </button>
      </div>

      {/* Tabs */}
      <div className="student-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`student-tab ${
              activeTab === tab ? 'active' : ''
            }`}
            onClick={() =>
              setActiveTab(tab)
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div className="student-layout">

        {/* Profile Sidebar — populated from GET /admin/student/:id */}
        <aside className="student-sidebar">

          <div className="student-profile-avatar">
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={student.name} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              student.initials
            )}
          </div>

          <h2>{student.name}</h2>

          <p className="student-code">
            {student.id}
          </p>

          <p className="student-class">
            {gradeName} • {boardName}
          </p>

          <span
            className={`student-status ${
              student.status === 'Active'
                ? 'active'
                : 'inactive'
            }`}
          >
            {student.status}
          </span>

          <div className="student-meta">

            <div>
              <strong>
                <HiOutlinePhone />
                Mobile Number
              </strong>

              <p>{student.mobile}</p>
            </div>

            <div>
              <strong>
                <HiOutlineMail />
                Email
              </strong>

              <p>
                {student.email ||
                  'Not Available'}
              </p>
            </div>

            <div>
              <strong>
                <HiOutlineOfficeBuilding />
                Institute
              </strong>

              <p>
                {student.institute}
              </p>
            </div>

            <div>
              <strong>
                <HiOutlineLocationMarker />
                State
              </strong>

              <p>{student.state}</p>
            </div>

            <div>
              <strong>
                Registered On
              </strong>

              <p>
                {student.registeredOn}
              </p>
            </div>

          </div>

        </aside>

        {/* Student Info */}
        <div className="student-content">

  {activeTab === 'Overview' && (
    <>
      <section className="student-section">
        <h3>Student Information</h3>

        <div className="info-list">
          <div className="info-item">
            <span>Full Name</span>
            <strong>{student.name}</strong>
          </div>

          {/* <div className="info-item">
            <span>Date of Birth</span>
            <strong>
              {student.dob || 'Not Available'}
            </strong>
          </div> */}

          {/* <div className="info-item">
            <span>Gender</span>
            <strong>
              {student.gender || 'Not Available'}
            </strong>
          </div> */}

          <div className="info-item">
            <span>Class</span>
            <strong>{gradeName}</strong>
          </div>

          <div className="info-item">
            <span>Board</span>
            <strong>{boardName}</strong>
          </div>

          <div className="info-item">
            <span>Branch</span>
            <strong>{branchName}</strong>
          </div>

          <div className="info-item">
            <span>Institute</span>
            <strong>{student.institute}</strong>
          </div>

          <div className="info-item">
            <span>State</span>
            <strong>{student.state}</strong>
          </div>

          <div className="info-item">
            <span>Subscription</span>
            <strong>{student.plan}</strong>
          </div>

          <div className="info-item">
            <span>Device Model</span>
            <strong>{deviceModel}</strong>
          </div>

          <div className="info-item">
            <span>IP Address</span>
            <strong>{ipAddress}</strong>
          </div>
        </div>

        {/* <div className="last-login">
          Total Study Hours:{' '}
          {student.totalHours}h
        </div> */}
      </section>

      <section className="student-section">
        <h3>Activity Summary</h3>

        <div className="activity-list">
          <div className="activity-item">
            <span>Total Study Hours</span>
            <strong>{student.totalHours}h</strong>
          </div>

          <div className="activity-item">
            <span>Today's Study Hours</span>
            <strong>{student.todayHours}h</strong>
          </div>

          <div className="activity-item">
            <span>Total Subjects</span>
            <strong>{student.subjectWiseUsage?.length || 0}</strong>
          </div>
        </div>
      </section>
    </>
  )}

  {activeTab === 'Parent Details' && (
    <section className="student-section">
      <h3>Parent Details</h3>

      <div className="info-list">
        <div className="info-item">
          <span>Parent Name</span>
          <strong>
            {student.parentName ||
              'Not Available'}
          </strong>
        </div>

        <div className="info-item">
          <span>Parent Mobile</span>
          <strong>
            {student.parentMobile ||
              'Not Available'}
          </strong>
        </div>

        <div className="info-item">
          <span>Parent Email</span>
          <strong>
            {student.parentEmail ||
              'Not Available'}
          </strong>
        </div>
      </div>
    </section>
  )}

  {activeTab === 'Academic Goal' && (
    <section className="student-section">
      <h3>Academic Goal</h3>

      <div className="info-list">
        <div className="info-item">
          <span>Target Exam</span>
          <strong>
            {student.targetExam ||
              'Not Available'}
          </strong>
        </div>

        <div className="info-item">
          <span>Target Year</span>
          <strong>
            {student.targetYear ||
              'Not Available'}
          </strong>
        </div>

        <div className="info-item">
          <span>Career Goal</span>
          <strong>
            {student.careerGoal ||
              'Not Available'}
          </strong>
        </div>
      </div>
    </section>
  )}

  {activeTab === 'Activity Analytics' && (
    <section className="student-section">
      <h3>Activity Analytics</h3>

      <div className="activity-list">
        <div className="activity-item">
          <span>Total Study Hours</span>
          <strong>{student.totalHours}h</strong>
        </div>

        <div className="activity-item">
          <span>Today's Study Hours</span>
          <strong>{student.todayHours}h</strong>
        </div>
      </div>

      <h3 className="usage-title">
        Subject Wise Usage
      </h3>

      {normalSubjectUsage?.length > 0 ? (
        normalSubjectUsage.map((subject) => (
          <div
            className="usage-item"
            key={subject.subject}
          >
            <div className="usage-header">
              <span>{subject.subject}</span>
              <span>{subject.percentage ?? subject.hours ?? 0}%</span>
            </div>

            <div className="bar">
              <span
                style={{
                  width: `${subject.percentage ?? 0}%`,
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No study activity recorded for normal plan subjects yet.</p>
      )}

      {supplySubjectUsage?.length > 0 && (
        <>
          <h3 className="usage-title" style={{ marginTop: '28px' }}>
            Supply Subject Usage
          </h3>

          {supplySubjectUsage.map((subject) => (
            <div
              className="usage-item"
              key={`supply_${subject.subject}`}
            >
              <div className="usage-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {subject.subject}
                  <span style={{ fontSize: '10px', background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>
                    Supply
                  </span>
                </span>
                <span>{subject.percentage ?? subject.hours ?? 0}%</span>
              </div>

              <div className="bar">
                <span
                  style={{
                    width: `${subject.percentage ?? 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </>
      )}

      <h3 className="usage-title" style={{ marginTop: '32px' }}>
        Detailed Activity Log
      </h3>

      {groupedActivities.length > 0 ? (
        <div className="activity-timeline-wrapper">
          <div className="activity-timeline">
            {groupedActivities.map((activity) => {
              const baseDesc = formatActivityDescription(activity.description);

              return (
                <div 
                  key={activity.id} 
                  className={`timeline-event ${activity.actionType?.toLowerCase()}`}
                >
                  <div className="timeline-icon-wrapper">
                    {getActivityIcon(activity.actionType)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-type">
                        {getActivityLabel(activity.actionType)}
                      </span>
                      <div className="timeline-time-block">
                        <span className="timeline-time">
                          {new Date(activity.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <div className="timeline-device-info">
                          {activity.ipAddress && <span className="device-badge">[{activity.ipAddress}]</span>}
                          {activity.deviceModel && <span className="device-badge">[{activity.deviceModel}]</span>}
                        </div>
                      </div>
                    </div>
                    <p className="timeline-desc">
                      {baseDesc}
                      {activity.count > 1 && (
                        <span 
                          style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: 'rgba(102, 83, 175, 0.12)',
                            color: 'var(--color-primary, #6653AF)',
                            fontWeight: '700',
                            fontSize: '12px',
                            display: 'inline-block',
                            border: '1px solid rgba(102, 83, 175, 0.2)'
                          }}
                        >
                          X{activity.count}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>No detailed activity logged yet.</p>
      )}
    </section>
  )}

  {activeTab === 'Subscription History' && (
    <section className="student-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Current Subscription</h3>
        <button 
          style={{
            background: 'var(--color-primary, #6653AF)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
          onClick={() => setIsExtendModalOpen(true)}
        >
          Extend
        </button>
      </div>

      <div className="info-list" style={{ marginBottom: '24px' }}>
        <div className="info-item">
          <span>Current Plan</span>
          <strong>{student.plan === 'Free Trial' ? 'Free Trial' : `${student.plan} ${student.isFreeTrial ? '(Free Trial)' : ''}`.trim()}</strong>
        </div>

        <div className="info-item">
          <span>Status</span>
          <strong>{student.status}</strong>
        </div>

        {student.startDate && (
          <div className="info-item">
            <span>Start Date</span>
            <strong>{new Date(student.startDate).toLocaleDateString('en-IN')}</strong>
          </div>
        )}

        {student.endDate && (
          <div className="info-item">
            <span>End Date</span>
            <strong>{new Date(student.endDate).toLocaleDateString('en-IN')}</strong>
          </div>
        )}

        <div className="info-item">
          <span>Days Left</span>
          <strong>{student.daysLeft} Days</strong>
        </div>
      </div>

      {supplyPlans && supplyPlans.length > 0 && (
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Supply (Carry) Plans Purchased</span>
            <span style={{ fontSize: '12px', background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>
              {supplyPlans.length} Active
            </span>
          </h3>

          <div className="student-table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="student-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Supply Plan</th>
                  <th>Subject</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {supplyPlans.map((sp, idx) => (
                  <tr key={sp.id || idx}>
                    <td>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {sp.planName}
                        <span style={{ fontSize: '10px', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px' }}>
                          Supply
                        </span>
                      </strong>
                    </td>
                    <td>{sp.subject || '—'}</td>
                    <td>₹{Number(sp.amount || 0).toFixed(2)}</td>
                    <td>
                      <span className="status-badge status-active">
                        {sp.status || 'Active'}
                      </span>
                    </td>
                    <td>{sp.date ? new Date(sp.date).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </section>
  )}

  {activeTab === 'Payment History' && (
    <section className="student-section">
      <h3>Payment History</h3>

      {student.payments?.length > 0 ? (
        <div className="student-table-wrapper" style={{ marginTop: '1rem', overflowX: 'auto' }}>
          <table className="student-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Amount Paid</th>
                <th>Discount Taken</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[...student.payments]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((payment) => {
                  const discountTaken = payment.plan ? Math.max(0, payment.plan.price - payment.amount) : 0;
                  return (
                    <tr key={payment.id}>
                      <td><strong>{payment.plan?.name || 'Plan'}</strong></td>
                      <td>₹{Number(payment.amount).toFixed(2)}</td>
                      <td>₹{Number(discountTaken).toFixed(2)}</td>
                      <td>{payment.paymentMode || 'UPI'}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            payment.status === 'Success'
                              ? 'status-active'
                              : payment.status === 'Pending'
                              ? 'status-pending'
                              : 'status-inactive'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td>{new Date(payment.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No payment records found.</p>
      )}
    </section>
  )}

</div>

      </div>

      {isExtendModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsExtendModalOpen(false)}
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '450px', backgroundColor: 'var(--color-surface, #fff)', 
              padding: '32px', borderRadius: '16px', width: '100%', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '20px', fontWeight: '700', color: 'var(--color-text-primary)' }}>Extend Subscription</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
              Add extra days to the student's current plan. The new expiry date will be automatically appended to the end of their existing billing cycle.
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-primary)' }}>
                Quick Selection
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {[
                  { label: '+1 Month', value: 30 },
                  { label: '+3 Months', value: 90 },
                  { label: '+6 Months', value: 180 },
                  { label: '+1 Year', value: 365 }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setExtendDays(option.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: extendDays === option.value ? '1px solid var(--color-primary, #6653AF)' : '1px solid var(--color-border)',
                      backgroundColor: extendDays === option.value ? 'rgba(102, 83, 175, 0.1)' : 'transparent',
                      color: extendDays === option.value ? 'var(--color-primary, #6653AF)' : 'var(--color-text-secondary)',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Custom Days
              </label>
              <input 
                type="number" 
                min="1"
                value={extendDays}
                onChange={(e) => setExtendDays(parseInt(e.target.value) || 0)}
                style={{ 
                  width: '100%', padding: '12px 16px', border: '1px solid var(--color-border)', 
                  borderRadius: '8px', boxSizing: 'border-box', fontSize: '16px',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button 
                onClick={() => setIsExtendModalOpen(false)}
                disabled={isExtending}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent', color: 'var(--color-text-primary)',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleExtendPlan}
                disabled={isExtending || extendDays <= 0}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: 'none',
                  backgroundColor: 'var(--color-primary, #6653AF)', color: '#fff',
                  fontWeight: '600', cursor: (isExtending || extendDays <= 0) ? 'not-allowed' : 'pointer',
                  opacity: (isExtending || extendDays <= 0) ? 0.7 : 1, transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(102, 83, 175, 0.3)'
                }}
              >
                {isExtending ? 'Extending...' : 'Confirm Extension'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDetailsPage;
