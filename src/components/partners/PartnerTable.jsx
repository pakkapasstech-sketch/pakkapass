import { useNavigate } from 'react-router-dom';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlinePause,
  HiOutlineTrash,
} from 'react-icons/hi';

const PartnerTable = ({
  partners,
}) => {
  const navigate =
    useNavigate();

  if (
    !partners ||
    partners.length === 0
  ) {
    return (
      <div className="empty-partners">
        <h3>
          No Partners Found
        </h3>

        <p>
          Create your first
          channel partner to
          get started.
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
              <th>
                Partner ID
              </th>
              <th>
                Organization
              </th>
              <th>
                Institution
              </th>
              <th>
                Contact
              </th>
              <th>
                Mobile
              </th>
              <th>
                Referral
              </th>
              <th>
                Students
              </th>
              <th>
                Revenue
              </th>
              <th>
                Status
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {partners.map(
              (partner) => (
                <tr
                  key={
                    partner.id
                  }
                >
                  <td>
                    {
                      partner.partnerId
                    }
                  </td>

                  <td>
                    {
                      partner.organizationName
                    }
                  </td>

                  <td>
                    {
                      partner.institutionType
                    }
                  </td>

                  <td>
                    {
                      partner.contactPerson
                    }
                  </td>

                  <td>
                    {
                      partner.mobile
                    }
                  </td>

                  <td>
                    {
                      partner.referralCode
                    }
                  </td>

                  <td>
                    {
                      partner.students
                    }
                  </td>

                  <td>
                    ₹
                    {partner.revenue.toLocaleString()}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${partner.status.toLowerCase()}`}
                    >
                      {
                        partner.status
                      }
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() =>
                          navigate(
                            `/partners/${partner.id}`
                          )
                        }
                      >
                        <HiOutlineEye />
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/partners/${partner.id}/edit`
                          )
                        }
                      >
                        <HiOutlinePencil />
                      </button>

                      <button>
                        <HiOutlinePause />
                      </button>

                      <button className="delete-btn">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerTable;