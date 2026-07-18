import { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

import ErrorState from '../../components/loaders/ErrorState';

const tabs = [
  'Overview',
  'Parent Details',
  'Activity Analytics',
  'Subscription History',
  'Payment History',
];

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { data: student, isLoading, isError, refetch } = useStudent(id);
  const { data: filterOptions } = useStudentFilterOptions();
  const { data: activities = [] } = useStudentActivities(id);
  const { data: allStudents } = useStudents();
  const currentStudentFromAll = allStudents?.find(s => String(s.id) === String(id));
  const deviceModel = currentStudentFromAll?.deviceModel || 'N/A';
  const ipAddress = currentStudentFromAll?.ipAddress || 'N/A';

  const gradeName = filterOptions?.grades?.find(g => String(g.id) === String(student?.gradeId))?.name || student?.class || 'N/A';
  const boardName = filterOptions?.boards?.find(b => String(b.id) === String(student?.boardId))?.name || student?.board || 'N/A';
  const branchName = filterOptions?.branches?.find(br => String(br.id) === String(student?.branchId))?.name || student?.branch || 'N/A';

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

  const formatActivityDescription = (description) => {
    if (!description) return '';
    let formatted = description.replace(/^[Yy]ou\s+/, '');
    if (formatted.length > 0) {
      formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    return formatted;
  };

  const [activeTab, setActiveTab] =
    useState('Overview');

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

      {student.subjectWiseUsage?.length > 0 ? (
        student.subjectWiseUsage.map((subject) => (
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
        <p>No study activity recorded yet.</p>
      )}

      <h3 className="usage-title" style={{ marginTop: '32px' }}>
        Detailed Activity Log
      </h3>

      {activities.length > 0 ? (
        <div className="activity-timeline-wrapper">
          <div className="activity-timeline">
            {activities.map((activity) => (
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
                    <span className="timeline-time">
                      {new Date(activity.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="timeline-desc">{formatActivityDescription(activity.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No detailed activity logged yet.</p>
      )}
    </section>
  )}

  {activeTab === 'Subscription History' && (
    <section className="student-section">
      <h3>Current Subscription</h3>

      <div className="info-list">
        <div className="info-item">
          <span>Current Plan</span>
          <strong>{student.plan} {student.isFreeTrial ? '(Free Trial)' : ''}</strong>
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
    </div>
  );
};

export default StudentDetailsPage;
