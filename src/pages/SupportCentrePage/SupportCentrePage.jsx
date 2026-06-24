import {
  HiOutlineSupport,
  HiOutlineQuestionMarkCircle,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineTicket,
  HiOutlineChatAlt2,
} from 'react-icons/hi';

import '../../styles/supportCentrePage.css';
const faqs = [
  {
    question:
      'How do I upload content?',
    answer:
      'Navigate to Content Management, select a topic and click Upload Content.',
  },
  {
    question:
      'How can I reset my password?',
    answer:
      'Go to Profile Settings and click Change Password.',
  },
  {
    question:
      'How do I manage subscriptions?',
    answer:
      'Open Subscription Management from the sidebar.',
  },
];

const tickets = [
  {
    id: '#SUP001',
    title: 'Unable to upload videos',
    status: 'Open',
    date: '10 Jul 2025',
  },
  {
    id: '#SUP002',
    title: 'Payment issue',
    status: 'Resolved',
    date: '08 Jul 2025',
  },
];

const SupportCentrePage = () => {
  return (
    <div className="support-page">
      {/* Header */}

      <div className="support-header">
        <div>
          <h1>Support Centre</h1>

          <p>
            Get help, raise tickets and
            find answers quickly.
          </p>
        </div>

        <button className="create-ticket-btn">
          <HiOutlineTicket />
          Create Ticket
        </button>
      </div>

      {/* Quick Actions */}

      <div className="support-cards">
        <div className="support-card">
          <HiOutlineChatAlt2 />

          <h3>Live Chat</h3>

          <p>
            Chat with our support team.
          </p>
        </div>

        <div className="support-card">
          <HiOutlineMail />

          <h3>Email Support</h3>

          <p>
            support@example.com
          </p>
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
            {tickets.map(
              (ticket) => (
                <div
                  key={ticket.id}
                  className="ticket-card"
                >
                  <div>
                    <h4>
                      {ticket.title}
                    </h4>

                    <p>
                      {ticket.id}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`ticket-status ${ticket.status.toLowerCase()}`}
                    >
                      {
                        ticket.status
                      }
                    </span>

                    <p>
                      {ticket.date}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* FAQs */}

        <div className="support-section">
          <div className="section-title">
            <HiOutlineQuestionMarkCircle />
            <h2>
              Frequently Asked
              Questions
            </h2>
          </div>

          <div className="faq-list">
            {faqs.map(
              (
                faq,
                index
              ) => (
                <div
                  key={index}
                  className="faq-item"
                >
                  <h4>
                    {
                      faq.question
                    }
                  </h4>

                  <p>
                    {
                      faq.answer
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCentrePage;