import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
} from 'react-icons/hi';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import '../../styles/student-table.css';


const PartnerTable = ({
  partners = [],
  onStatusChange,
  allPayments = [],
}) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const partnersPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [partners]);

  if (!partners.length) {
    return (
      <div className="empty-partners">
        <h3>No Partners Found</h3>

        <p>
          Try changing the filters or add a new
          partner.
        </p>
      </div>
    );
  }

  const totalPartners = partners.length;

  const totalPages =
    Math.ceil(totalPartners / partnersPerPage) || 1;

  const startIndex =
    (currentPage - 1) * partnersPerPage;

  const endIndex =
    startIndex + partnersPerPage;

  const currentPartners = partners.slice(
    startIndex,
    endIndex
  );

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  };

  return (
    <div className="partners-table-card">
      <div className="table-wrapper">
        <table className="partners-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Partner ID</th>
              <th>Institution</th>
              <th>Mobile</th>
              <th>REFCODE</th>
              <th>Students</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {currentPartners.map((partner, index) => (
              <tr
  key={partner.id}
  className="partner-row clickable-row"
  onClick={() => navigate(`/partners/${partner.id}`)}
>
                <td>{startIndex + index + 1}</td>

                <td>{partner.contactPerson}</td>

                <td>{partner.partnerId}</td>

                <td>{partner.institutionType}</td>

                <td>{partner.mobile}</td>

                <td>{partner.referralCode}</td>

                <td>
                  {partner.analytics?.students
                    ?.totalStudents ?? 0}
                </td>

                <td>
                  {(() => {
                    const partnerPayments = allPayments.filter(
                      (p) =>
                        p.partnerId === partner.id ||
                        p.couponCode === partner.referralCode
                    );
                    const totalRevenue = partnerPayments
                      .filter((p) => p.status === 'Success')
                      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
                    return `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  })()}
                </td>

                <td
  className="partner-status-cell"
  onClick={(e) => e.stopPropagation()}
>
  <div className="partner-status-dropdown">
    <CommonFilterDropdown
    placeholder=""
      value={partner.status}
      options={[
        'Active',
        'Inactive',
        'Suspended',
      ]}
      onChange={(value) =>
        onStatusChange(partner.id, value)
      }
    />
  </div>
</td>
<td>
  <button
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/partners/${partner.id}`);
  }}
  aria-label={`View details for ${partner.contactPerson}`}
  title="View Partner"
>
  <HiOutlineEye />
</button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPartners > 0 && (
        <div className="pagination">
          <p>
            Showing {startIndex + 1} to{' '}
            {Math.min(endIndex, totalPartners)} of{' '}
            {totalPartners} partners
          </p>

          <div className="pagination-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              aria-label="Previous Page"
            >
              <HiOutlineChevronLeft />
            </button>

            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? 'active-page'
                    : ''
                }
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              aria-label="Next Page"
            >
              <HiOutlineChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default PartnerTable;