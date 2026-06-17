import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePencil,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

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
          className="back-btn"
          onClick={() =>
            navigate(
              '/partners'
            )
          }
        >
          <HiOutlineArrowLeft />
        </button>

        <div>
          <h1>
            {
              mockPartner.organizationName
            }
          </h1>

          <p>
            {
              mockPartner.partnerId
            }
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() =>
            navigate(
              `/partners/1/edit`
            )
          }
        >
          <HiOutlinePencil />
          Edit
        </button>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <h3>
            Organization
          </h3>

          <p>
            Institution:
            {
              mockPartner.institutionType
            }
          </p>

          <p>
            Status:
            {
              mockPartner.status
            }
          </p>

          <p>
            Joined:
            {
              mockPartner.joiningDate
            }
          </p>
        </div>

        <div className="detail-card">
          <h3>
            Contact
          </h3>

          <p>
            Person:
            {
              mockPartner.contactPerson
            }
          </p>

          <p>
            Mobile:
            {
              mockPartner.mobile
            }
          </p>

          <p>
            Email:
            {
              mockPartner.email
            }
          </p>
        </div>

        <div className="detail-card">
          <h3>
            Referral
          </h3>

          <p>
            Code:
            {
              mockPartner.referralCode
            }
          </p>

          <p>
            Students:
            {
              mockPartner.students
            }
          </p>

          <p>
            Commission:
            {
              mockPartner.commission
            }
          </p>
        </div>

        <div className="detail-card">
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