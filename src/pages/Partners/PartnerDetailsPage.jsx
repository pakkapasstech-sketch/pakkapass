import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

import { useNavigate } from 'react-router-dom';

import '../../styles/partnerDetails.css';

const mockPartner = {
  partnerId: 'PP1001',

  organizationName:
    'Narayana Junior College',

  institutionType:
    'Junior College',

  contactPerson:
    'Ramesh Kumar',

  mobile:
    '9876543210',

  email:
    'ramesh@gmail.com',

  status:
    'Active',

  referralCode:
    'PPRA1001',

  students: 245,

  revenue: 125000,

  commission:
    '15%',

  joiningDate:
    '2026-06-17',
};

const PartnerDetailsPage = () => {
  const navigate =
    useNavigate();

  return (
    <div className="partner-details-page">
      <div className="details-header">
        <button
          className="partner-back-btn"
          onClick={() =>
            navigate(
              '/partners'
            )
          }
        >
          <HiOutlineArrowLeft />
        </button>

        <div className="header-content">
          <h1>
            {
              mockPartner.contactPerson
            }
          </h1>

          <p>
            {
              mockPartner.partnerId
            }
          </p>
        </div>

        <div className="details-actions">
          <button
            className="btn-primary"
            onClick={() =>
              navigate(
                '/partners/1/edit'
              )
            }
          >
            <HiOutlinePencil />
            Edit
          </button>

          <button className="btn-danger">
            <HiOutlineTrash />
            Delete
          </button>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <h3>
            Partner
            Information
          </h3>

          <p>
            <span>
              Institution
            </span>

            <strong>
              {
                mockPartner.institutionType
              }
            </strong>
          </p>

          <p>
            <span>
              Status
            </span>

            <strong>
              {
                mockPartner.status
              }
            </strong>
          </p>

          <p>
            <span>
              Joined
            </span>

            <strong>
              {
                mockPartner.joiningDate
              }
            </strong>
          </p>
        </div>

        <div className="detail-card">
          <h3>
            Contact
            Information
          </h3>

          <p>
            <span>
              Name
            </span>

            <strong>
              {
                mockPartner.contactPerson
              }
            </strong>
          </p>

          <p>
            <span>
              Mobile
            </span>

            <strong>
              {
                mockPartner.mobile
              }
            </strong>
          </p>

          <p>
            <span>
              Email
            </span>

            <strong>
              {
                mockPartner.email
              }
            </strong>
          </p>
        </div>

        <div className="detail-card">
          <h3>
            Referral
            Details
          </h3>

          <p>
            <span>
              Code
            </span>

            <strong>
              {
                mockPartner.referralCode
              }
            </strong>
          </p>

          <p>
            <span>
              Students
            </span>

            <strong>
              {
                mockPartner.students
              }
            </strong>
          </p>

          <p>
            <span>
              Commission
            </span>

            <strong>
              {
                mockPartner.commission
              }
            </strong>
          </p>
        </div>

        <div className="detail-card revenue-card">
          <h3>
            Revenue
          </h3>

          <h1>
            ₹
            {mockPartner.revenue.toLocaleString()}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailsPage;