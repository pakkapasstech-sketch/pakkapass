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
import { students } from '../../data/students';

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

  const [activeTab, setActiveTab] =
    useState('Overview');

  const student = students.find(
    (s) => s.id === Number(id)
  );

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

        {/* Profile Sidebar */}
        <aside className="student-sidebar">

          <div className="student-avatar">
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
        <section className="student-section">

          <h3>
            Student Information
          </h3>

          <div className="info-list">

            <div className="info-item">
              <span>
                Full Name
              </span>

              <strong>
                {student.name}
              </strong>
            </div>

            <div className="info-item">
              <span>
                Date of Birth
              </span>

              <strong>
                {student.dob ||
                  'Not Available'}
              </strong>
            </div>

            <div className="info-item">
              <span>Gender</span>

              <strong>
                {student.gender ||
                  'Not Available'}
              </strong>
            </div>

            <div className="info-item">
              <span>Class</span>

              <strong>
                {student.class}
              </strong>
            </div>

            <div className="info-item">
              <span>Board</span>

              <strong>
                {student.board}
              </strong>
            </div>

            <div className="info-item">
              <span>
                Institution
              </span>

              <strong>
                {student.institution}
              </strong>
            </div>

            <div className="info-item">
              <span>State</span>

              <strong>
                {student.state}
              </strong>
            </div>

            <div className="info-item">
              <span>
                Subscription
              </span>

              <strong>
                {student.plan}
              </strong>
            </div>

          </div>

          <div className="last-login">
            Last Login :
            {' '}
            {student.lastLogin ||
              'May 26, 2025 09:15 AM'}
          </div>

        </section>

        {/* Analytics */}
        <section className="student-section">

          <h3>
            Activity Summary
          </h3>

          <div className="activity-list">

            <div className="activity-item">
              <span>
                Reading Hours
              </span>

              <strong>
                24h 30m
              </strong>
            </div>

            <div className="activity-item">
              <span>
                Video Watch Hours
              </span>

              <strong>
                18h 20m
              </strong>
            </div>

            <div className="activity-item">
              <span>
                PDFs Read
              </span>

              <strong>45</strong>
            </div>

            <div className="activity-item">
              <span>
                Videos Watched
              </span>

              <strong>32</strong>
            </div>

            <div className="activity-item">
              <span>
                Tests Taken
              </span>

              <strong>
                {student.testsTaken ||
                  28}
              </strong>
            </div>

          </div>

          <h3 className="usage-title">
            Subject Wise Usage
          </h3>

          <div className="usage-item">

            <div className="usage-header">
              <span>Physics</span>
              <span>80%</span>
            </div>

            <div className="bar">
              <span
                style={{
                  width: '80%',
                }}
              />
            </div>

          </div>

          <div className="usage-item">

            <div className="usage-header">
              <span>
                Chemistry
              </span>
              <span>55%</span>
            </div>

            <div className="bar">
              <span
                style={{
                  width: '55%',
                }}
              />
            </div>

          </div>

          <div className="usage-item">

            <div className="usage-header">
              <span>
                Mathematics
              </span>
              <span>78%</span>
            </div>

            <div className="bar">
              <span
                style={{
                  width: '78%',
                }}
              />
            </div>

          </div>

          <div className="usage-item">

            <div className="usage-header">
              <span>
                Biology
              </span>
              <span>42%</span>
            </div>

            <div className="bar">
              <span
                style={{
                  width: '42%',
                }}
              />
            </div>

          </div>

          <div className="usage-item">

            <div className="usage-header">
              <span>
                English
              </span>
              <span>35%</span>
            </div>

            <div className="bar">
              <span
                style={{
                  width: '35%',
                }}
              />
            </div>

          </div>

        </section>

      </div>
    </div>
  );
};

export default StudentDetailsPage;