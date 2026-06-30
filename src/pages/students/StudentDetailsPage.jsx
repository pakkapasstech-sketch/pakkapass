import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

import '../../styles/student-details.css';
import { useStudent } from '../../hooks/useStudents';
import ErrorState from '../../components/loaders/ErrorState';

const tabs = [
  'Overview',
  'Parent Details',
  'Academic Goal',
  'Activity Analytics',
  'Subscription History',
  'Payment History',
];

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: student, isError, refetch } = useStudent(id);

  const [activeTab, setActiveTab] =
    useState('Overview');


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
            {student.initials}
          </div>

          <h2>{student.name}</h2>

          <p className="student-code">
            STU
            {String(student.id).padStart(
              5,
              '0'
            )}
          </p>

          <p className="student-class">
            {student.class} • {student.board}
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
                Institution
              </strong>

              <p>
                {student.institution}
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

          <div className="info-item">
            <span>Date of Birth</span>
            <strong>
              {student.dob || 'Not Available'}
            </strong>
          </div>

          <div className="info-item">
            <span>Gender</span>
            <strong>
              {student.gender || 'Not Available'}
            </strong>
          </div>

          <div className="info-item">
            <span>Class</span>
            <strong>{student.class}</strong>
          </div>

          <div className="info-item">
            <span>Board</span>
            <strong>{student.board}</strong>
          </div>

          <div className="info-item">
            <span>Institution</span>
            <strong>{student.institution}</strong>
          </div>

          <div className="info-item">
            <span>State</span>
            <strong>{student.state}</strong>
          </div>

          <div className="info-item">
            <span>Subscription</span>
            <strong>{student.plan}</strong>
          </div>
        </div>

        <div className="last-login">
          Total Study Hours:{' '}
          {student.totalHours}h
        </div>
      </section>

      <section className="student-section">
        <h3>Activity Summary</h3>

        <div className="activity-list">
          <div className="activity-item">
            <span>Total Study Hours</span>
            <strong>{student.totalHours}h</strong>
          </div>

          <div className="activity-item">
            <span>Subjects Studied</span>
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
            {student.fatherName ||
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
              <span>{subject.percentage || subject.hours}%</span>
            </div>

            <div className="bar">
              <span
                style={{
                  width: `${subject.percentage || 50}%`,
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No study activity recorded yet.</p>
      )}
    </section>
  )}

  {activeTab === 'Subscription History' && (
    <section className="student-section">
      <h3>Subscription History</h3>

      {student.subscriptionHistory?.length > 0 ? (
        <div className="info-list">
          {student.subscriptionHistory.map((sub, index) => (
            <div className="info-item" key={index}>
              <span>{sub.plan}</span>
              <strong>
                ₹{sub.amount} — {sub.status} — {new Date(sub.date).toLocaleDateString('en-IN')}
              </strong>
            </div>
          ))}
        </div>
      ) : (
        <div className="info-list">
          <div className="info-item">
            <span>Current Plan</span>
            <strong>{student.plan}</strong>
          </div>

          <div className="info-item">
            <span>Status</span>
            <strong>{student.status}</strong>
          </div>
        </div>
      )}
    </section>
  )}

  {activeTab === 'Payment History' && (
    <section className="student-section">
      <h3>Payment History</h3>

      {student.payments?.length > 0 ? (
        <div className="info-list">
          {student.payments.map((payment) => (
            <div className="info-item" key={payment.id}>
              <span>{payment.plan?.name || 'Plan'}</span>
              <strong>
                ₹{payment.amount} — {payment.paymentMode || 'UPI'} — {payment.status} — {new Date(payment.createdAt).toLocaleDateString('en-IN')}
              </strong>
            </div>
          ))}
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
