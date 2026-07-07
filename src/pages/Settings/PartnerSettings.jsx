import { useState,useRef } from 'react';
import { HiOutlineClipboardCopy, HiOutlinePencil } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import partnerService from '../../services/partner.service';
//import StatisticCard from '../../components/cards/StatisticCard';

import '../../styles/PartnerProfile.css';

const PartnerSettings = () => {
  const [editing, setEditing] = useState(false);

  const [partner, setPartner] = useState(null);

  const { user } = useAuth();
  const profileInputRef = useRef(null);
const logoInputRef = useRef(null);
  useEffect(() => {
    loadPartner();
  }, []);

  const loadPartner = async () => {
    try {
      const data = await partnerService.getById(user.id);

const partnerData = data.partner;

if (partnerData.dateOfBirth) {
  partnerData.dateOfBirth = new Date(
    partnerData.dateOfBirth
  )
    .toISOString()
    .split("T")[0];
}

setPartner(partnerData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile');
    }
  };
  const handleChange = (e) => {
    setPartner({
      ...partner,
      [e.target.name]: e.target.value,
    });
  };
const handleProfilePhoto = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setPartner((prev) => ({
    ...prev,
    image: file,
    profilePhoto: URL.createObjectURL(file),
  }));
};

const handleLogo = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setPartner((prev) => ({
    ...prev,
    logoFile: file,
    logo: URL.createObjectURL(file),
  }));
};
  const copyCode = () => {
    navigator.clipboard.writeText(partner.referralCode);

    toast.success('Referral code copied');
  };

 const saveProfile = async () => {
  try {
    const formData = new FormData();

    const fields = [
      "contactFirstName",
      "contactLastName",
      "dateOfBirth",
      "gender",
      "organizationName",
      "institutionType",
      "institutionRegistrationNumber",
      "websiteUrl",
      "description",
      "email",
      "mobile",
      "alternateEmail",
      "alternateMobile",
      "addressLine1",
      "city",
      "district",
      "state",
      "country",
      "pincode",
    ];

    fields.forEach((field) => {
      const value = partner[field];

      // Skip invalid or empty dates
      if (
        field === "dateOfBirth" &&
        (!value || value === "Invalid date")
      ) {
        return;
      }

      if (value !== undefined && value !== null) {
        formData.append(field, value);
      }
    });

    if (partner.image) {
      formData.append("image", partner.image);
    }

    if (partner.logoFile) {
      formData.append("logo", partner.logoFile);
    }

    // Debug
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await partnerService.update(
      partner.id,
      formData
    );

    setPartner(response.partner);

    toast.success("Profile updated");
    setEditing(false);

  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile");
  }
};
  if (!partner) {
    return <div>Loading...</div>;
  }
  return (
    <div className="partner-profile-page">
      <div className="partner-profile-header">
        <div className="profile-card profile-images">
          <div className="profile-photo-section">

  <img
  src={partner.profilePhoto || "/default-avatar.png"}
  alt=""
  className="passport-photo"
/>

  {editing && (
    <>
      <button
        className="photo-edit-btn"
        onClick={() => profileInputRef.current.click()}
      >
        <HiOutlinePencil />
      </button>

      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleProfilePhoto}
      />
    </>
  )}

</div>

          <div className="logo-section">

  <label>Organization Logo</label>

  <img
    src={partner.logo || "/default-logo.png"}
    alt=""
    className="organization-logo"
  />

  {editing && (
    <>
      <button
        className="change-logo-btn"
        onClick={() => logoInputRef.current.click()}
      >
        Change Logo
      </button>

      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleLogo}
      />
    </>
  )}

</div>
        </div>

        <div>
          <h1>Partner Profile</h1>

          <p>Manage your partner account.</p>
        </div>

        {!editing ? (
          <button className="profile-primary-btn" onClick={() => setEditing(true)}>
            <HiOutlinePencil />
            Edit Profile
          </button>
        ) : (
          <button className="profile-primary-btn" onClick={saveProfile}>
            Save Changes
          </button>
        )}
      </div>

      <div className="partner-profile-grid">
        <div className="profile-card">
          <h3>Partner Information</h3>

          <div className="profile-grid">
            <div>
              <label>First Name</label>
              <input
                name="contactFirstName"
                value={partner.contactFirstName || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label>Last Name</label>
              <input
                name="contactLastName"
                value={partner.contactLastName || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label>Date of Birth</label>
              <input
  type="date"
  name="dateOfBirth"
  value={
  partner.dateOfBirth
    ? new Date(partner.dateOfBirth)
        .toISOString()
        .split("T")[0]
    : ""
}
  onChange={handleChange}
/>
            </div>

            <div>
              <label>Gender</label>
              <select
                name="gender"
                value={partner.gender || ''}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label>Organization</label>
              <input
                name="organizationName"
                value={partner.organizationName || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label>Institution Type</label>
              <input
                name="institutionType"
                value={partner.institutionType || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label>Partner ID</label>
              <input value={partner.partnerId || ''} disabled />
            </div>

            <div>
              <label>Joining Date</label>
              <input value={partner.joiningDate || ''} disabled />
            </div>

            <div>
              <label>Status</label>
              <input value={partner.status || ''} disabled />
            </div>
          </div>
        </div>
        <div className="profile-card">
          <h3>Organization Information</h3>

          <div className="profile-grid">
            <div>
              <label>Registration Number</label>

              <input
                name="institutionRegistrationNumber"
                value={partner.institutionRegistrationNumber || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label>Website</label>

              <input
                name="websiteUrl"
                value={partner.websiteUrl || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="full">
              <label>Description</label>

              <textarea
                rows={5}
                name="description"
                value={partner.description || ''}
                onChange={handleChange}
                disabled={!editing}
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
              <label>Alternate Email</label>

              <input
                name="alternateEmail"
                value={partner.alternateEmail || ''}
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
              <label>Country</label>

              <input
                name="country"
                value={partner.country || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <label>City</label>

              <input name="city" value={partner.city} onChange={handleChange} disabled={!editing} />
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

            <button className="copy-btn" onClick={copyCode}>
              <HiOutlineClipboardCopy />
              Copy
            </button>
          </div>

          <div className="profile-grid">
            <div>
              <label>Discount Type</label>

              <input value={partner.discountType} disabled />
            </div>

            <div>
              <label>Discount</label>

              <input value={`${partner.discountValue}%`} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSettings;
