import { HiOutlinePlus } from 'react-icons/hi';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/tables/StatusBadge';
import { useRecentPayments } from '../../hooks/useDashboard';

import '../../styles/subscriptionManagement.css';

const SubscriptionManagementPage = () => {
  const payments = useRecentPayments();

  const subscriptionColumns = [
    {
      key: 'student',
      header: 'Student',
      sortable: true,
      accessor: (r) => r.student,
    },
    {
      key: 'id',
      header: 'Subscription ID',
      accessor: (r) => r.id,
    },
    {
      key: 'amount',
      header: 'Plan Amount',
      accessor: (r) => r.formattedAmount,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => r.status,
      render: (r) => (
        <StatusBadge status={r.status} />
      ),
    },
    {
      key: 'paidOn',
      header: 'Subscription Date',
      accessor: (r) => r.paidOn,
    },
  ];

  return (
    <div className="subscription-management-page">
      <div className="subscription-header">
        <div>
          <h1>Subscription Management</h1>

          <p>
            Manage subscriptions, payments and
            subscription activity.
          </p>
        </div>

        <button className="create-subscription-btn">
          <HiOutlinePlus />
          Add Subscription
        </button>
      </div>

      <DataTable
        title="Subscriptions"
        columns={subscriptionColumns}
        data={payments.data || []}
        isLoading={payments.isLoading}
        searchable
        actions
      />
    </div>
  );
};

export default SubscriptionManagementPage;