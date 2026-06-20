import { HiOutlinePencil, HiOutlineTrash, HiArrowLeft } from 'react-icons/hi';


import '../../styles/partnerDetails.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useNavigate,
} from
'react-router-dom';

import partnerService
from '../../services/partner.service';

const PartnerDetailsPage = () => {
  const navigate = useNavigate();
const { id } =
  useParams();

const [partner,
  setPartner] =
  useState(null);

const [analytics,
  setAnalytics] =
  useState(null);useEffect(() => {
  fetchPartner();
}, [id]);

const fetchPartner =
  async () => {
    try {
      const res =
        await partnerService.getById(
          id
        );

      setPartner(
        res.partner
      );

      setAnalytics(
        res.analytics
      );
    } catch (err) {
      console.log(err);
    }
  };if (!partner)
  return null;
  return (
    <div className="partner-details-page">
      <div className="details-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <HiArrowLeft />
          <span>Back</span>
        </button>

        <div className="header-content">
          <h1>{partner.contactPerson}</h1>

          <p>{partner.partnerId}</p>
        </div>

        <div className="details-actions">
          <button className="btn-primary" onClick={() => navigate(
  `/partners/${partner.id}/edit`
)}>
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
          <h3>Partner Information</h3>

          <p>
            <span>Institution</span>

            <strong>{partner.institutionType}</strong>
          </p>

          <p>
            <span>Status</span>

            <strong>{partner.status}</strong>
          </p>

          <p>
            <span>Joined</span>

            <strong>{partner.joiningDate}</strong>
          </p>
        </div>

        <div className="detail-card">
          <h3>Contact Information</h3>

          <p>
            <span>Name</span>

            <strong>{partner.contactPerson}</strong>
          </p>

          <p>
            <span>Mobile</span>

            <strong>{partner.mobile}</strong>
          </p>

          <p>
            <span>Email</span>

            <strong>{partner.email}</strong>
          </p>
        </div>

        <div className="detail-card">
          <h3>Referral Details</h3>

          <p>
            <span>Code</span>

            <strong>{partner.referralCode}</strong>
          </p>

          <p>
            <span>Students</span>

            <strong>{
  analytics?.students
    ?.totalStudents
}</strong>
          </p>

          <p>
            <span>Commission</span>

            <strong>{partner.commission}</strong>
          </p>
        </div>

        <div className="detail-card revenue-card">
          <h3>Revenue</h3>

          <h1>₹
{analytics?.revenue
  ?.totalRevenue
  ?.toLocaleString()}</h1>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailsPage;
