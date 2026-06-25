import { HiOutlineSearch }
  from 'react-icons/hi';
import CommonFilterDropdown from '../common/CommonFilterDropdown';
const PartnerFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="partner-filters">
      <div className="search-box">
        <HiOutlineSearch />

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search..."
        />
      </div>

      <CommonFilterDropdown
  placeholder="All Status"
  value={statusFilter || 'All Status'}
  options={[
    'All Status',
    'Active',
    'Inactive',
    'Suspended',
  ]}
  onChange={(value) =>
    setStatusFilter(
      value === 'All Status' ? '' : value
    )
  }
/>
    </div>
  );
};

export default PartnerFilters;