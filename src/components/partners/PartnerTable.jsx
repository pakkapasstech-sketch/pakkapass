import { useNavigate } from 'react-router-dom';

const PartnerTable = ({
  partners = [],
}) => {
  const navigate =
    useNavigate();

  if (!partners.length) {
    return (
      <div className="empty-partners">
        <h3>
          No Partners Found
        </h3>

        <p>
          Try changing the
          filters or add a
          new partner.
        </p>
      </div>
    );
  }

  return (
    <div className="partners-table-card">
      <div className="table-header">
        <h2>
          Channel Partners
        </h2>
      </div>

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
            </tr>
          </thead>

         <tbody>
  {partners.map((partner) => (
    <tr
      key={partner.id}
      className="partner-row"
      onClick={() =>
        navigate(`/partners/${partner.id}`)
      }
    >
      <td>{partner.id}</td>

      <td>
        {partner.contactPerson}
      </td>

      <td>
        {partner.partnerId}
      </td>

      <td>
        {partner.institutionType}
      </td>

      <td>
        {partner.mobile}
      </td>

      <td>
        {partner.referralCode}
      </td>

      <td>
        {partner.analytics
          ?.students
          ?.totalStudents ?? 0}
      </td>

      <td>
        ₹
        {(
          partner.analytics
            ?.revenue
            ?.totalRevenue ?? 0
        ).toLocaleString()}
      </td>

      <td>
        <span
          className={`status-badge ${
            partner.status?.toLowerCase()
          }`}
        >
          {partner.status}
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

export default PartnerTable;