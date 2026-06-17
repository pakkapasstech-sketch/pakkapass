const ContactAddressForm = ({
  formData,
  updateField,
}) => {
  return (
    <div className="partner-form-section">
      <h2>
        Contact & Address
      </h2>

      <div className="partner-form-grid">
        <div className="form-group">
          <label>
            Mobile Number *
          </label>

          <input
            value={
              formData.mobile
            }
            onChange={(e) =>
              updateField(
                'mobile',
                e.target.value
              )
            }
            placeholder="Enter mobile number"
          />
        </div>

        <div className="form-group">
          <label>
            Email Address *
          </label>

          <input
            value={
              formData.email
            }
            onChange={(e) =>
              updateField(
                'email',
                e.target.value
              )
            }
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>
            Alternate Mobile
          </label>

          <input
            value={
              formData.alternateMobile
            }
            onChange={(e) =>
              updateField(
                'alternateMobile',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Alternate Email
          </label>

          <input
            value={
              formData.alternateEmail
            }
            onChange={(e) =>
              updateField(
                'alternateEmail',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group full-width">
          <label>
            Address Line 1 *
          </label>

          <input
            value={
              formData.address1
            }
            onChange={(e) =>
              updateField(
                'address1',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>City *</label>

          <input
            value={
              formData.city
            }
            onChange={(e) =>
              updateField(
                'city',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            District *
          </label>

          <input
            value={
              formData.district
            }
            onChange={(e) =>
              updateField(
                'district',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>State *</label>

          <input
            value={
              formData.state
            }
            onChange={(e) =>
              updateField(
                'state',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Country *
          </label>

          <input
            value={
              formData.country
            }
            onChange={(e) =>
              updateField(
                'country',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Pincode *
          </label>

          <input
            value={
              formData.pincode
            }
            onChange={(e) =>
              updateField(
                'pincode',
                e.target.value
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ContactAddressForm;