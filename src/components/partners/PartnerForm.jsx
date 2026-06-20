const PartnerForm = ({ step, formData, updateField }) => {
  
  switch (step) {
    case 0:
      return (
        <>
          <h2>Personal Information</h2>

          <div className="partner-grid">
            <div className="form-group">
              <label>First Name *</label>

              <input
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>

              <input
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Enter last name"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                value={formData.dob}
                onChange={(e) => updateField('dob', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>

              <select
                value={formData.gender}
                onChange={(e) => updateField('gender', e.target.value)}
              >
                <option value="">Select Gender</option>

                <option>Male</option>

                <option>Female</option>

                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Profile Photo</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateField('profilePhoto', e.target.files[0])}
              />
            </div>

            <div className="form-group">
              <label>Logo</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateField('logo', e.target.files[0])}
              />
            </div>
          </div>
        </>
      );

    case 1:
      return (
        <>
          <h2>Organization Information</h2>

          <div className="partner-grid">
            <div className="form-group full-width">
              <label>Organization Name *</label>

              <input
                value={formData.organizationName}
                onChange={(e) => updateField('organizationName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Institution Type*</label>

              <select
                value={formData.institutionType}
                onChange={(e) => updateField('institutionType', e.target.value)}
              >
                <option value="">Select Type</option>

                <option>Junior College</option>

                <option>Coaching Center</option>

                <option>School</option>

                <option>Educational Consultant</option>

                <option>Individual Agent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Registration Number</label>

              <input
                value={formData.registrationNumber}
                onChange={(e) => updateField('registrationNumber', e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Website</label>

              <input
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>

              <textarea
                rows="5"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </div>
        </>
      );

    case 2:
      return (
        <>
          <h2>Contact & Address</h2>

          <div className="partner-grid">
            <div className="form-group">
              <label>Mobile *</label>

              <input
                type="tel"
                value={formData.mobile}
                maxLength={10}
                minLength={10}
                placeholder="Enter 10-digit mobile number"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');

                  updateField('mobile', value);
                }}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>

              <input
                type="email"
                value={formData.email}
                placeholder="Enter email address"
                onChange={(e) => updateField('email', e.target.value.toLowerCase())}
              />
            </div>

            <div className="form-group">
              <label>Alternate Mobile</label>

              <input
                type="tel"
                value={formData.alternateMobile}
                maxLength={10}
                placeholder="Enter alternate mobile"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');

                  updateField('alternateMobile', value);
                }}
              />
            </div>

            <div className="form-group">
              <label>Alternate Email</label>

              <input
                type="email"
                value={formData.alternateEmail}
                placeholder="Enter alternate email"
                onChange={(e) => updateField('alternateEmail', e.target.value.toLowerCase())}
              />
            </div>

            <div className="form-group full-width">
              <label>Address*</label>

              <input
                value={formData.address1}
                onChange={(e) => updateField('address1', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>City*</label>

              <input value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
            </div>
            <div className="form-group">
              <label>District*</label>

              <input
                type="text"
                value={formData.district}
                onChange={(e) => updateField('district', e.target.value)}
                placeholder="Enter district"
              />
            </div>

            <div className="form-group">
              <label>State*</label>

              <input
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Country*</label>

              <input
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Pincode*</label>

              <input
                value={formData.pincode}
                onChange={(e) => updateField('pincode', e.target.value)}
              />
            </div>
          </div>
        </>
      );

    case 3:
      return (
        <>
          <h2>Partnership Details</h2>

          <div className="partner-grid">
            <div className="info-card">
              <span>Partner ID</span>

              <h3>{formData.partnerId}</h3>
            </div>

            <div className="info-card">
              <span>Joining Date</span>

              <h3>{formData.joiningDate}</h3>
            </div>

            <div className="form-group full-width">
              <label>Status</label>

              <div className="status-options">
                {['Active', 'Inactive', 'Suspended'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`status-chip ${formData.status === status ? 'active' : ''}`}
                    onClick={() => updateField('status', status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      );

    case 4:
      return (
        <>
          <h2>Student Discount</h2>

          <div className="partner-grid">
            <div className="form-group">
              <label>Discount Type</label>

              <select
                value={formData.discountType}
                onChange={(e) => updateField('discountType', e.target.value)}
              >
                <option>Percentage</option>

                <option>Fixed Amount</option>
              </select>
            </div>

            <div className="form-group">
              <label>Discount Value</label>

              <input
                value={formData.discountValue}
                onChange={(e) => updateField('discountValue', e.target.value)}
              />
            </div>

            {/* <div className="form-group">
              <label>Maximum Discount</label>

              <input
                value={formData.maxDiscount}
                onChange={(e) => updateField('maxDiscount', e.target.value)}
              />
            </div> */}

            {/* <div className="form-group">
              <label>Usage Limit</label>

              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => updateField('usageLimit', e.target.value)}
              />
            </div> */}
          </div>
        </>
      );

    default:
      return null;
  }
};

export default PartnerForm;
