const CommissionForm = ({
  formData,
  updateField,
}) => {
  return (
    <div className="partner-form-section">
      <h2>
        Commission Configuration
      </h2>

      <div className="partner-form-grid">
        <div className="form-group">
          <label>
            Commission Type
          </label>

          <select
            value={
              formData.commissionType
            }
            onChange={(e) =>
              updateField(
                'commissionType',
                e.target.value
              )
            }
          >
            <option>
              Percentage
            </option>

            <option>
              Fixed Amount
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Commission Value
          </label>

          <input
            value={
              formData.commissionValue
            }
            onChange={(e) =>
              updateField(
                'commissionValue',
                e.target.value
              )
            }
            placeholder={
              formData.commissionType ===
              'Percentage'
                ? '15%'
                : '₹500'
            }
          />
        </div>
      </div>

      <div className="settlement-section">
        <label>
          Settlement Cycle
        </label>

        <div className="settlement-grid">
          {[
            'Weekly',
            'Monthly',
            'Quarterly',
          ].map((cycle) => (
            <button
              key={cycle}
              type="button"
              className={`settlement-card ${
                formData.settlementCycle ===
                cycle
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                updateField(
                  'settlementCycle',
                  cycle
                )
              }
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommissionForm;