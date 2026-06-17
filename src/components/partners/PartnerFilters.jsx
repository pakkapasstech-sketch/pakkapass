import { HiOutlineSearch }
  from 'react-icons/hi';

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
          placeholder="Search partners..."
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(
            e.target.value
          )
        }
      >
        <option value="">
          All Statuses
        </option>

        <option>
          Active
        </option>

        <option>
          Inactive
        </option>

        <option>
          Suspended
        </option>
      </select>
    </div>
  );
};

export default PartnerFilters;