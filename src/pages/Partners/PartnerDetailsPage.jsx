import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiArrowLeft,
  HiOutlineClipboardCopy,
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';

import '../../styles/partnerDetails.css';

import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import partnerService from '../../services/partner.service';

const PartnerDetailsPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { id } = useParams();
  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(partner.referralCode || '');
      toast.success('Referral code copied');
    } catch {
      toast.error('Failed to copy referral code');
    }
  };
  const [partner, setPartner] = useState(null);
  const [loading, setPageLoading] = useState(true);

  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    fetchPartner();
  }, [id]);
  useEffect(() => {
    return () => setLoading(false);
  }, [setLoading]);
  const fetchPartner = async () => {
    try {
      setPageLoading(true);
      setLoading(true);

      const res = await partnerService.getById(id);

      setPartner(res.partner);
      setAnalytics(res.analytics);
    } catch (err) {
      console.log(err);
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${partner.organizationName || partner.contactPerson || 'this partner'}?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await partnerService.delete(id);
      toast.success('Partner deleted successfully');
      navigate('/partners');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete partner');
    } finally {
      setLoading(false);
    }
  };

  if (!partner) return null;
  return (
    <div className="partner-details-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <HiArrowLeft />
        <span>Back to partners</span>
      </button>
      <div className="details-header">
        <div className="header-content">
          <h1>{partner.contactPerson}</h1>

          <p>{partner.partnerId}</p>
        </div>

        <div className="details-actions">
          <button className="btn-primary" onClick={() => navigate(`/partners/${partner.id}/edit`)}>
            <HiOutlinePencil />
            Edit
          </button>

          <button className="btn-danger" onClick={handleDelete}>
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

            <strong
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {partner.referralCode}

              <HiOutlineClipboardCopy
                size={18}
                style={{
                  cursor: 'pointer',
                  color: '#6653AF',
                }}
                title="Copy referral code"
                onClick={copyReferralCode}
              />
            </strong>
          </p>
          <p>
            <span>Students</span>

            <strong>{analytics?.students?.totalStudents}</strong>
          </p>

          <p>
            <span>Commission</span>

            <strong>{partner.commission}</strong>
          </p>
        </div>

        <div className="detail-card revenue-card">
          <h3>Revenue</h3>

          <h1>₹{analytics?.revenue?.totalRevenue?.toLocaleString()}</h1>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailsPage;
