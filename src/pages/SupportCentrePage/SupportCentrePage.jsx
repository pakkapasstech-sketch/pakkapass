import { useState, useEffect } from 'react';
import {
  HiOutlineSupport,
  HiOutlineQuestionMarkCircle,
  HiOutlinePhone,
  HiOutlineMail,
  //HiOutlineTicket,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
} from 'react-icons/hi';

import '../../styles/supportCentrePage.css';
import '../../styles/student-filters.css';
import '../../styles/student-table.css';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import { useAuth } from '../../auth/AuthProvider';
import { getSupportTickets, submitSupportTicket, updateSupportTicketStatus, getUserSupportTickets } from '../../services/supportService';
import { useLoading } from '../../contexts/LoadingContext';
import toast from 'react-hot-toast';

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

const SupportCentrePage = () => {
  const [tickets, setTickets] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [adminMessageInput, setAdminMessageInput] = useState('');
  const [adminStatusInput, setAdminStatusInput] = useState('Pending');
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const isAdmin = user?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);

  const ticketsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filteredTickets = tickets.filter((ticket) => {
    const searchTerm = search.toLowerCase().trim();
    const matchSearch =
      searchTerm === '' ||
      String(ticket.id).toLowerCase().includes(searchTerm) ||
      (ticket.name || '').toLowerCase().includes(searchTerm) ||
      (ticket.email || '').toLowerCase().includes(searchTerm) ||
      (ticket.message || '').toLowerCase().includes(searchTerm);

    const matchStatus =
      statusFilter === 'All Status' ||
      ticket.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const totalTickets = filteredTickets.length;
  const totalPages = Math.ceil(totalTickets / ticketsPerPage) || 1;
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleSubmitTicket = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setLoading(true);
      await submitSupportTicket({
        name: user?.name || 'Anonymous',
        email: user?.email || '',
        message: message,
        studentId: user?.id || null
      }, user?.role);
      toast.success('Support ticket submitted successfully');
      setMessage('');
      fetchTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (status) => {
    try {
      setLoading(true);
      await updateSupportTicketStatus(activeTicket.id, status, adminMessageInput);
      toast.success('Ticket status updated successfully');

      setActiveTicket((prev) => ({
        ...prev,
        status,
        adminMessage: adminMessageInput,
      }));

      setTickets((prev) =>
        prev.map((ticket) => (ticket.id === activeTicket.id ? { ...ticket, status, adminMessage: adminMessageInput } : ticket))
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update ticket status');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user || isAdmin) {
      fetchTickets();
    }
  }, [isAdmin, user]);

  const fetchTickets = async () => {
    try {
      if (!isAdmin && !user?.id) return;
      setLoading(true);

      const { data } = isAdmin 
        ? await getSupportTickets() 
        : await getUserSupportTickets(user?.id, user?.role);

      setTickets(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="support-page">
      {/* Header */}
      <div className="support-header">
        <div>
          <h1>Support Centre</h1>
          {!isAdmin && <p>Get help, raise tickets and find answers quickly.</p>}
        </div>

        {/* {isAdmin && (
  <button className="create-ticket-btn">
    <HiOutlineTicket />
    Create Ticket
  </button>
)} */}
      </div>

      {/* Quick Actions (Live Chat Removed) */}
      {!isAdmin && (
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
      )}

      {!isAdmin && (
        <div className="support-grid">
          <div className="support-section">
            <div className="section-title">
              <HiOutlineSupport />
              <h2>Contact Support</h2>
            </div>

            <div className="support-form">
              <div className="support-form-group">
                <label>Name</label>

                <input type="text" value={user?.name || ''} readOnly />
              </div>

              <div className="support-form-group">
                <label>Email</label>

                <input type="email" value={user?.email || ''} readOnly />
              </div>

              <div className="support-form-group">
                <label>Message</label>

                <textarea
                  rows={6}
                  placeholder="Describe your issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button className="create-ticket-btn" onClick={handleSubmitTicket}>
                Send Message
              </button>
            </div>
          </div>

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
      )}

      {/* Support Tickets Section */}
      <div className="support-section" style={{ overflow: 'visible', marginTop: !isAdmin ? '32px' : '0' }}>
        <div className="section-title">
          <HiOutlineSupport />
          <h2>{isAdmin ? 'Support Tickets' : 'My Support Tickets'}</h2>
        </div>

          {/* Toolbar and Search (Styling like student management filters, side-by-side layout) */}
          <div className="student-filters-container" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
              <div className="student-search-row" style={{ flex: 1, minWidth: '240px', width: 'auto' }}>
                <div className="search-box">
                  <HiOutlineSearch />
                  <input
                    type="text"
                    placeholder="Search tickets by ID, name, email, message..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div style={{ width: '240px' }}>
                <CommonFilterDropdown
                  placeholder="All Status"
                  value={statusFilter}
                  options={['All Status', 'Pending', 'Resolved']}
                  onChange={(value) => setStatusFilter(value)}
                />
              </div>
            </div>
          </div>

          {/* Table (Styling like student management table) */}
          <div className="student-table-card">
            <div className="student-table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.length > 0 ? (
                    currentTickets.map((ticket, index) => (
                      <tr
                        key={ticket.id}
                        className="clickable-row"
                        onClick={() => { 
                          setActiveTicket(ticket); 
                          setAdminMessageInput(ticket.adminMessage || ''); 
                          setAdminStatusInput(ticket.status || 'Pending');
                        }}
                      >
                        <td style={{ fontWeight: '500' }}>{ticket.id}</td>
                        <td style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{ticket.student?.name || ticket.name}</td>
                        <td style={{ color: 'var(--color-text-secondary)' }}>{ticket.student?.email || ticket.email}</td>
                          <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>
                            {ticket.message}
                          </td>
                        <td>
                          <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '6px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTicket(ticket);
                              setAdminMessageInput(ticket.adminMessage || '');
                              setAdminStatusInput(ticket.status || 'Pending');
                            }}
                            title="View Ticket"
                          >
                            <HiOutlineEye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No support tickets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination (Styling like student management pagination) */}
            {totalTickets > 0 && (
              <div className="pagination" style={{ borderTop: '1px solid var(--color-border)' }}>
                <p>
                  Showing {startIndex + 1} to {Math.min(endIndex, totalTickets)} of {totalTickets}{' '}
                  tickets
                </p>
                
                <div className="pagination-buttons">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    <HiOutlineChevronLeft />
                  </button>

                  {getVisiblePages().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'active-page' : ''}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    <HiOutlineChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Ticket Details Popup Modal */}
      {activeTicket && (
        <div className="modal-overlay-wrapper">
          <div className="modal-backdrop" onClick={() => setActiveTicket(null)}></div>
          <div className="modal-container modal-md" style={{ maxHeight: '78vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3 className="modal-title">Ticket Detail - {activeTicket.id}</h3>
              <button className="modal-close-btn" onClick={() => setActiveTicket(null)}>
                <HiOutlineX className="modal-close-icon" />
              </button>
            </div>

            <div className="modal-content" style={{ overflowY: 'auto', flex: 1 }}>
              {(() => {
                return (
                  <>
                    <div
                      className="ticket-student-info-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginTop: '12px',
                      }}
                    >
                      <div className="ticket-detail-group">
                        <label className="ticket-detail-label">Name</label>
                        <div className="ticket-detail-value">
                          {activeTicket.student?.name || activeTicket.name}
                        </div>
                      </div>
                      <div className="ticket-detail-group">
                        <label className="ticket-detail-label">ID</label>
                        <div className="ticket-detail-value">{activeTicket.studentId || '-'}</div>
                      </div>
                    </div>

                    <div className="ticket-detail-group" style={{ marginTop: '16px' }}>
                      <label className="ticket-detail-label">Email</label>
                      <div className="ticket-detail-value">
                        {activeTicket.student?.email || activeTicket.email}
                      </div>
                    </div>
                  </>
                );
              })()}

              <div className="ticket-detail-group" style={{ marginTop: '12px' }}>
                <label className="ticket-detail-label">Support Message</label>
                <div
                  className="ticket-message-box"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    marginTop: '4px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                  }}
                >
                  {activeTicket.message}
                </div>
              </div>

              {activeTicket.adminMessage && !isAdmin && (
                <div className="ticket-detail-group" style={{ marginTop: '12px' }}>
                  <label className="ticket-detail-label">Resolution Message</label>
                  <div
                    className="ticket-message-box"
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      marginTop: '4px',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {activeTicket.adminMessage}
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="ticket-detail-group" style={{ marginTop: '16px' }}>
                  <label className="ticket-detail-label">Admin Resolution Message</label>
                  <textarea
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      marginTop: '6px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    placeholder="Enter resolution message before changing status..."
                    value={adminMessageInput}
                    onChange={(e) => setAdminMessageInput(e.target.value)}
                  />
                </div>
              )}

              <div
                className="ticket-detail-group"
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    className="ticket-detail-label"
                    style={{ display: 'block', marginBottom: '8px' }}
                  >
                    Ticket Status
                  </label>
                  {isAdmin ? (
                    <CommonFilterDropdown
                      placeholder="Status"
                      value={adminStatusInput}
                      options={['Pending', 'Resolved', 'Rejected']}
                      onChange={setAdminStatusInput}
                    />
                  ) : (
                    <div style={{ fontWeight: '600', textTransform: 'capitalize', padding: '8px 12px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '8px', display: 'inline-block' }}>
                      {activeTicket.status}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  {isAdmin && (
                    <button
                      className="primary-btn"
                      style={{ height: '44px' }}
                      onClick={() => handleStatusChange(adminStatusInput)}
                    >
                      Update & Send
                    </button>
                  )}
                  <button
                    className="primary-btn"
                    style={{ height: '44px', backgroundColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    onClick={() => setActiveTicket(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportCentrePage;
