import { useEffect, useState } from 'react';
import '../../styles/SubsciptionPage.css';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import studentService from '../../services/student.service';

const SubscriptionPage = () => {
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const students = await studentService.getParentStudents();

        setLinkedStudents(students);

        if (students.length > 0) {
          setSelectedStudentId(students[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadStudents();
  }, []);

  const selectedStudent =
    linkedStudents.find(
      (student) => String(student.id) === String(selectedStudentId)
    ) || {};

  // Replace this with backend data later
  const currentPlan = {
    name: 'Premium Plan',
    amount: '₹1,999',
    duration: '1 Year',
    status: 'Active',
    startDate: '01 Jan 2026',
    expiryDate: '31 Dec 2026',
    daysLeft: 189,
  };

  const features = [
    'Unlimited Video Lessons',
    'Unlimited Notes & PDFs',
    'Practice Tests',
    'Question Papers',
    'Parent Dashboard Access',
    'Performance Reports',
    'Priority Support',
  ];

  const history = [
    {
      id: 'SUB1001',
      plan: 'Premium Plan',
      purchased: '01 Jan 2026',
      expiry: '31 Dec 2026',
      amount: '₹1,999',
      status: 'Active',
    },
    {
      id: 'SUB1000',
      plan: 'Premium Plan',
      purchased: '01 Jan 2025',
      expiry: '31 Dec 2025',
      amount: '₹1,999',
      status: 'Expired',
    },
  ];

  return (
    <div className="subscription-page">

      <div className="subscription-header">

        <div>
          <h2>Subscription</h2>
          <p>Manage your child's subscription details.</p>
        </div>

        <div style={{ width: 260 }}>
          <CommonFilterDropdown
            placeholder="Select Student"
            value={selectedStudent.name || 'Select Student'}
            options={linkedStudents.map((student) => student.name)}
            onChange={(name) => {
              const student = linkedStudents.find(
                (s) => s.name === name
              );

              if (student) {
                setSelectedStudentId(student.id);
              }
            }}
          />
        </div>

      </div>

      <div className="subscription-current-card">

        <div>
          <h3>{currentPlan.name}</h3>
          <p>
            {currentPlan.amount} / {currentPlan.duration}
          </p>
        </div>

        <span className="subscription-status active">
          {currentPlan.status}
        </span>

      </div>

      <div className="subscription-info-grid">

        <div className="subscription-info-card">
          <span>Start Date</span>
          <strong>{currentPlan.startDate}</strong>
        </div>

        <div className="subscription-info-card">
          <span>Expiry Date</span>
          <strong>{currentPlan.expiryDate}</strong>
        </div>

        <div className="subscription-info-card">
          <span>Days Left</span>
          <strong>{currentPlan.daysLeft} Days</strong>
        </div>

        <div className="subscription-info-card">
          <span>Plan Amount</span>
          <strong>{currentPlan.amount}</strong>
        </div>

      </div>

      <div className="subscription-card">

        <h3>Plan Features</h3>

        <div className="subscription-features">
          {features.map((feature) => (
            <div
              key={feature}
              className="subscription-feature"
            >
              ✓ {feature}
            </div>
          ))}
        </div>

      </div>

      <div className="subscription-card">

        <h3>Subscription History</h3>

        <table className="subscription-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Plan</th>
              <th>Purchased</th>
              <th>Expiry</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.plan}</td>
                <td>{item.purchased}</td>
                <td>{item.expiry}</td>
                <td>{item.amount}</td>
                <td>
                  <span
                    className={`subscription-badge ${
                      item.status === 'Active'
                        ? 'active'
                        : 'expired'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default SubscriptionPage;