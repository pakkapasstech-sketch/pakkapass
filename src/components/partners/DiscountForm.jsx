const DiscountForm = ({
  formData,
  updateField,
}) => {
  return (
    <div className="partner-form-section">
      <h2>
        Student Discount Configuration
      </h2>

      <div className="partner-form-grid">
        <div className="form-group">
          <label>
            Discount Type
          </label>

          <select
            value={
              formData.discountType
            }
            onChange={(e) =>
              updateField(
                'discountType',
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
            Discount Value
          </label>

          <input
            value={
              formData.discountValue
            }
            onChange={(e) =>
              updateField(
                'discountValue',
                e.target.value
              )
            }
            placeholder={
              formData.discountType ===
              'Percentage'
                ? '20%'
                : '₹500'
            }
          />
        </div>

        <div className="form-group">
          <label>
            Coupon Expiry
          </label>

          <input
            type="date"
            value={
              formData.couponExpiry
            }
            onChange={(e) =>
              updateField(
                'couponExpiry',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Usage Limit
          </label>

          <input
            type="number"
            value={
              formData.usageLimit
            }
            onChange={(e) =>
              updateField(
                'usageLimit',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Maximum Discount Amount
          </label>

          <input
            value={
              formData.maxDiscount
            }
            onChange={(e) =>
              updateField(
                'maxDiscount',
                e.target.value
              )
            }
            placeholder="₹1000"
          />
        </div>
      </div>

      <div className="coupon-status">
        <label>
          Coupon Status
        </label>

        <button
          type="button"
          onClick={() =>
            updateField(
              'couponStatus',
              !formData.couponStatus
            )
          }
          className={`toggle-btn ${
            formData.couponStatus
              ? 'on'
              : 'off'
          }`}
        >
          {formData.couponStatus
            ? 'Active'
            : 'Inactive'}
        </button>
      </div>
    </div>
  );
};

export default DiscountForm;