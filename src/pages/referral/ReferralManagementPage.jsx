import { HiOutlinePlus } from 'react-icons/hi';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/tables/StatusBadge';
import { useReferralConversions } from '../../hooks/useDashboard';
import '../../styles/referralMangement.css';

const ReferralManagementPage = () => {
  const referrals = useReferralConversions();

  const referralColumns = [
    {
      key: 'code',
      header: 'Referral Code',
      accessor: (r) => r.code,
      render: (r) => (
        <span className="referral-code">
          {r.code}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      accessor: (r) => r.source,
    },
    {
      key: 'conversions',
      header: 'Conversions',
      sortable: true,
      accessor: (r) => r.conversions,
    },
    {
      key: 'revenue',
      header: 'Revenue',
      accessor: (r) => r.formattedRevenue,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => r.status || 'Active',
      render: (r) => (
        <StatusBadge status={r.status || 'Active'} />
      ),
    },
  ];

  return (
    <div className="referral-management-page">
      <div className="referral-header">
        <div>
          <h1>Referral Management</h1>
          <p>
            Manage referral codes, conversions and
            referral performance.
          </p>
        </div>

        <button className="create-referral-btn">
          <HiOutlinePlus />
          Create Referral Code
        </button>
      </div>

      <DataTable
        title="Referral Conversions"
        columns={referralColumns}
        data={referrals.data || []}
        isLoading={referrals.isLoading}
        searchable
        actions
      />
    </div>
  );
};

export default ReferralManagementPage;