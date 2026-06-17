const institutionTypes = [
  'Junior College',
  'Coaching Center',
  'Educational Consultant',
  'Influencer',
  'Individual Agent',
  'School',
  'Educational Organization',
  'Other',
];

const OrganizationForm = ({
  formData,
  updateField,
}) => {
  return (
    <div className="partner-form-section">
      <h2>
        Organization Information
      </h2>

      <div className="partner-form-grid">
        <div className="form-group full-width">
          <label>
            Organization Name *
          </label>

          <input
            value={
              formData.organizationName
            }
            onChange={(e) =>
              updateField(
                'organizationName',
                e.target.value
              )
            }
            placeholder="Enter organization name"
          />
        </div>

        <div className="form-group">
          <label>
            Institution Type *
          </label>

          <select
            value={
              formData.institutionType
            }
            onChange={(e) =>
              updateField(
                'institutionType',
                e.target.value
              )
            }
          >
            <option value="">
              Select Type
            </option>

            {institutionTypes.map(
              (type) => (
                <option
                  key={type}
                >
                  {type}
                </option>
              )
            )}
          </select>
        </div>

        <div className="form-group">
          <label>
            Registration Number
          </label>

          <input
            value={
              formData.registrationNumber
            }
            onChange={(e) =>
              updateField(
                'registrationNumber',
                e.target.value
              )
            }
            placeholder="Enter registration number"
          />
        </div>

        <div className="form-group full-width">
          <label>
            Website
          </label>

          <input
            value={
              formData.website
            }
            onChange={(e) =>
              updateField(
                'website',
                e.target.value
              )
            }
            placeholder="https://"
          />
        </div>

        <div className="form-group full-width">
          <label>
            Description
          </label>

          <textarea
            rows="5"
            value={
              formData.description
            }
            onChange={(e) =>
              updateField(
                'description',
                e.target.value
              )
            }
            placeholder="Write something about the institution..."
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationForm;