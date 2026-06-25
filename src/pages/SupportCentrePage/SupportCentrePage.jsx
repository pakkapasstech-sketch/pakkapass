import { useState } from 'react';
import {
  HiOutlineSupport,
  HiOutlineQuestionMarkCircle,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineTicket,
  HiOutlineX,
} from 'react-icons/hi';

import '../../styles/supportCentrePage.css';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';

const faqs = [
  {
    question: 'How do I upload content?',
    answer: 'Navigate to Content Management, select a topic and click Upload Content.',
  },
  {
    question: 'How can I reset my password?',
    answer: 'Go to Profile Settings and click Change Password.',
  },
  {
    question: 'How do I manage subscriptions?',
    answer: 'Open Subscription Management from the sidebar.',
  },
];

const initialTickets = [
  {
    id: '#SUP001',
    title: 'Unable to upload videos',
    status: 'Open',
    date: '10 Jul 2025',
    studentName: 'Aryan Mandal',
    studentId: 'STU99281',
    studentEmail: 'aryanmandal800@gmail.com',
    message: 'Whenever I try to upload a video format (.mp4), it gets stuck at 99% ',
  },
  {
    id: '#SUP002',
    title: 'Payment issue',
    status: 'Resolved',
    date: '08 Jul 2025',
    studentName: 'Nisha Sharma',
    studentId: 'STU18291',
    studentEmail: 'nisha@example.com',
    message: 'Money was deducted from my account but my subscription still shows as Pending/Inactive. I used UPI for the transaction.',
  },
];

const SupportCentrePage = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicket, setActiveTicket] = useState(null);

  const handleStatusChange = (newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === activeTicket.id ? { ...t, status: newStatus } : t))
    );
    setActiveTicket((prev) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="support-page">
      {/* Header */}
      <div className="support-header">
        <div>
          <h1>Support Centre</h1>
          <p>Get help, raise tickets and find answers quickly.</p>
        </div>

        <button className="create-ticket-btn">
          <HiOutlineTicket />
          Create Ticket
        </button>
      </div>

      {/* Quick Actions (Live Chat Removed) */}
      <div className="support-cards">
        <div className="support-card">
          <HiOutlineMail />
          <h3>Email Support</h3>
          <p>support@example.com</p>
        </div>

        <div className="support-card">
          <HiOutlinePhone />
          <h3>Call Support</h3>
          <p>+91 98765 43210</p>
        </div>
      </div>

      <div className="support-grid">
        {/* Tickets */}
        <div className="support-section">
          <div className="section-title">
            <HiOutlineSupport />
            <h2>Support Tickets</h2>
          </div>

          <div className="ticket-list">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="ticket-card"
                onClick={() => setActiveTicket(ticket)}
              >
                <div>
                  <h4>{ticket.title}</h4>
                  <p>{ticket.id}</p>
                </div>

                <div>
                  <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                    {ticket.status}
                  </span>
                  <p>{ticket.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="support-section">
          <div className="section-title">
            <HiOutlineQuestionMarkCircle />
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Details Popup Modal */}
      {activeTicket && (
        <div className="modal-overlay-wrapper">
          <div className="modal-backdrop" onClick={() => setActiveTicket(null)}></div>
          <div className="modal-container modal-md">
            <div className="modal-header">
              <h3 className="modal-title">Ticket Detail - {activeTicket.id}</h3>
              <button className="modal-close-btn" onClick={() => setActiveTicket(null)}>
                <HiOutlineX className="modal-close-icon" />
              </button>
            </div>

            <div className="modal-content">
              <div className="ticket-detail-group">
                <label className="ticket-detail-label">Subject</label>
                <div className="ticket-detail-value" style={{ fontWeight: '600', fontSize: '16px', color: 'var(--color-text-primary)' }}>
                  {activeTicket.title}
                </div>
              </div>

              <div
                className="ticket-student-info-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginTop: '16px',
                }}
              >
                <div className="ticket-detail-group">
                  <label className="ticket-detail-label">Student Name</label>
                  <div className="ticket-detail-value">{activeTicket.studentName}</div>
                </div>
                <div className="ticket-detail-group">
                  <label className="ticket-detail-label">Student ID</label>
                  <div className="ticket-detail-value">{activeTicket.studentId}</div>
                </div>
              </div>

              <div className="ticket-detail-group" style={{ marginTop: '16px' }}>
                <label className="ticket-detail-label">Student Email</label>
                <div className="ticket-detail-value">{activeTicket.studentEmail}</div>
              </div>

              <div className="ticket-detail-group" style={{ marginTop: '16px' }}>
                <label className="ticket-detail-label">Support Message</label>
                <div
                  className="ticket-message-box"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    marginTop: '6px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                >
                  {activeTicket.message}
                </div>
              </div>

              <div
                className="ticket-detail-group"
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <label className="ticket-detail-label" style={{ display: 'block', marginBottom: '8px' }}>
                    Resolve Issue Status
                  </label>
                  <CommonFilterDropdown
  placeholder="Status"
  value={activeTicket.status}
  options={[
    'Open',
    'Resolved',
  ]}
  onChange={handleStatusChange}
/>
                </div>

                <button
                  className="primary-btn"
                  style={{ height: '44px', marginTop: '20px' }}
                  onClick={() => setActiveTicket(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportCentrePage;