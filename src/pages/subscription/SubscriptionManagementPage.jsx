import { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { useRecentPayments } from '../../hooks/useDashboard';
import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import StatusBadge from '../../components/tables/StatusBadge';
import '../../styles/subscriptionManagement.css';

const SubscriptionManagementPage = () => {
  const payments = useRecentPayments();
  const [search, setSearch] = useState('');

  if (payments.isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const subscriptions = payments.data || [];

  const filteredSubscriptions = subscriptions.filter(
    (item) =>
      item.student?.toLowerCase().includes(search.toLowerCase()) ||
      item.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="subscription-management-page">
      <div className="subscription-header">
        <div>
          {/* <p className="subscription-badge">
            Subscription Management
          </p> */}

          <h1>Manage Subscriptions & Payments</h1>

          <p className="subscription-description">
            Monitor student subscriptions, payment history and active plans.
          </p>
        </div>
      </div>

      <div className="subscription-table-card">
        <div className="subscription-toolbar">
          <div className="subscription-search">
            <HiOutlineSearch />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        <div className="subscription-table-wrapper">
          <table className="subscription-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subscription ID</th>
                <th>Plan Amount</th>
                <th>Status</th>
                <th>Subscription Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.student}</td>
                    <td>{item.id}</td>
                    <td>{item.formattedAmount}</td>
                    <td>
                      <StatusBadge
                        status={item.status}
                      />
                    </td>
                    <td>{item.paidOn}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-table"
                  >
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;