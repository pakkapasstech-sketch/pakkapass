const PartnershipForm = ({
  formData,
  updateField,
}) => {
  return (
    <div className="partner-form-section">
      <h2>Partnership Details</h2>

      <div className="partner-form-grid">
        <div className="info-card">
          <span className="info-label">
            Partner ID
          </span>

          <h3>
            {formData.partnerId}
          </h3>
        </div>

        <div className="info-card">
          <span className="info-label">
            Joining Date
          </span>

          <h3>
            {formData.joiningDate}
          </h3>
        </div>
      </div>

      <div className="status-section">
        <label>
          Partner Status
        </label>

        <div className="status-options">
          {[
            'Active',
            'Inactive',
            'Suspended',
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                updateField(
                  'status',
                  status
                )
              }
              className={`status-chip ${
                formData.status ===
                status
                  ? 'selected'
                  : ''
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnershipForm;