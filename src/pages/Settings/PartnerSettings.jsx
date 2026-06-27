import { useState } from 'react';
import {
  HiOutlineClipboardCopy,
  HiOutlinePencil,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

//import StatisticCard from '../../components/cards/StatisticCard';

import '../../styles/PartnerProfile.css';

const PartnerSettings = () => {
  const [editing, setEditing] = useState(false);

  const [partner, setPartner] = useState({
    organizationName: 'ABC Educational Services',

    partnerId: 'PART0001',

    referralCode: 'PARTNER2026',

    contactFirstName: 'Rahul',

    contactLastName: 'Sharma',

    institutionType: 'School',

    email: 'partner@test.com',

    mobile: '9876543210',

    alternateMobile: '9876543200',

    addressLine1: 'Madhapur',

    city: 'Hyderabad',

    district: 'Hyderabad',

    state: 'Telangana',

    country: 'India',

    pincode: '500081',

    // commissionType: 'Percentage',

    // commissionValue: '10',

    discountType: 'Percentage',

    discountValue: '15',

    joiningDate: '15 Jun 2025',

    status: 'Active',
  });

  const handleChange = (e) => {
    setPartner({
      ...partner,
      [e.target.name]: e.target.value,
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(
      partner.referralCode
    );

    toast.success('Referral code copied');
  };

  const saveProfile = () => {
    // API Later

    toast.success('Profile updated');

    setEditing(false);
  };

  return (
    <div className="partner-profile-page">

      <div className="partner-profile-header">

        <div>

          <h1>Partner Profile</h1>

          <p>
            Manage your partner account.
          </p>

        </div>

        {!editing ? (

          <button
            className="profile-primary-btn"
            onClick={() =>
              setEditing(true)
            }
          >
            <HiOutlinePencil />

            Edit Profile

          </button>

        ) : (

          <button
            className="profile-primary-btn"
            onClick={saveProfile}
          >
            Save Changes
          </button>

        )}

      </div>

      {/* <div className="dashboard-stats-grid">

        <StatisticCard
          title="Students"
          value="128"
          icon="students"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatisticCard
          title="Revenue"
          value="₹2,48,500"
          icon="commissions"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatisticCard
          title="Commission"
          value="₹74,500"
          icon="commissions"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatisticCard
          title="Referral Code"
          value={partner.referralCode}
          icon="partners"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />

      </div> */}

      <div className="partner-profile-grid">

        <div className="profile-card">

          <h3>Partner Information</h3>

          <div className="profile-grid">

            <div>

              <label>First Name</label>

              <input
                name="contactFirstName"
                value={partner.contactFirstName}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>Last Name</label>

              <input
                name="contactLastName"
                value={partner.contactLastName}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>Organization</label>

              <input
                name="organizationName"
                value={partner.organizationName}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>Institution Type</label>

              <input
                name="institutionType"
                value={partner.institutionType}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>Partner ID</label>

              <input
                value={partner.partnerId}
                disabled
              />

            </div>

            <div>

              <label>Status</label>

              <input
                value={partner.status}
                disabled
              />

            </div>

          </div>

        </div>

        <div className="profile-card">

          <h3>Contact Information</h3>

          <div className="profile-grid">

            <div>

              <label>Email</label>

              <input
                name="email"
                value={partner.email}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>Mobile</label>

              <input
                name="mobile"
                value={partner.mobile}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>Alternate Mobile</label>

              <input
                name="alternateMobile"
                value={partner.alternateMobile}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

          </div>

        </div>

        <div className="profile-card">

          <h3>Address</h3>

          <div className="profile-grid">

            <div className="full">

              <label>Address</label>

              <input
                name="addressLine1"
                value={partner.addressLine1}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>City</label>

              <input
                name="city"
                value={partner.city}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>District</label>

              <input
                name="district"
                value={partner.district}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>State</label>

              <input
                name="state"
                value={partner.state}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

            <div>

              <label>Pincode</label>

              <input
                name="pincode"
                value={partner.pincode}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

          </div>

        </div>

        <div className="profile-card">

          <div className="profile-copy">

            <div>

              <h3>Referral Details</h3>

              <h2>{partner.referralCode}</h2>

            </div>

            <button
              className="copy-btn"
              onClick={copyCode}
            >
              <HiOutlineClipboardCopy />

              Copy

            </button>

          </div>

          <div className="profile-grid">

            {/* <div>

              <label>Commission Type</label>

              <input
                value={partner.commissionType}
                disabled
              />

            </div>

            <div>

              <label>Commission</label>

              <input
                value={`${partner.commissionValue}%`}
                disabled
              />

            </div> */}

            <div>

              <label>Discount Type</label>

              <input
                value={partner.discountType}
                disabled
              />

            </div>

            <div>

              <label>Discount</label>

              <input
                value={`${partner.discountValue}%`}
                disabled
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PartnerSettings;