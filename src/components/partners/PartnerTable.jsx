import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
} from 'react-icons/hi';
const PartnerTable = ({
  partners = [],
  onStatusChange,
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
              <th>ID</th>
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
            {currentPartners.map((partner) => (
              <tr
  key={partner.id}
  className="partner-row"
>
                <td>{partner.id}</td>

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
                  ₹
                  {(
                    partner.analytics?.revenue
                      ?.totalRevenue ?? 0
                  ).toLocaleString()}
                </td>

                <td>
  <select
    className="partner-status-select"
    value={partner.status}
    onChange={(e) => {
  console.log('Selected:', e.target.value);
  onStatusChange(partner.id, e.target.value);
}}
    onClick={(e) => e.stopPropagation()}
  >
    <option value="Active">Active</option>
<option value="Inactive">Inactive</option>
<option value="Suspended">Suspended</option>
  </select>
</td>
<td className="partner-actions">
  <button
  className="partner-action-btn"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/partners/${partner.id}`);
  }}
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
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
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