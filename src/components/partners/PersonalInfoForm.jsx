const PersonalInfoForm = ({
  formData,
  updateField,
}) => {
  return (
    <div className="partner-form-section">
      <h2>Personal Information</h2>

      <div className="partner-form-grid">
        <div className="form-group">
          <label>
            First Name *
          </label>

          <input
            value={
              formData.firstName
            }
            onChange={(e) =>
              updateField(
                'firstName',
                e.target.value
              )
            }
            placeholder="Enter first name"
          />
        </div>

        <div className="form-group">
          <label>
            Last Name *
          </label>

          <input
            value={
              formData.lastName
            }
            onChange={(e) =>
              updateField(
                'lastName',
                e.target.value
              )
            }
            placeholder="Enter last name"
          />
        </div>

        <div className="form-group">
          <label>
            Date of Birth
          </label>

          <input
            type="date"
            value={formData.dob}
            onChange={(e) =>
              updateField(
                'dob',
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>Gender</label>

          <select
            value={
              formData.gender
            }
            onChange={(e) =>
              updateField(
                'gender',
                e.target.value
              )
            }
          >
            <option value="">
              Select Gender
            </option>

            <option>
              Male
            </option>

            <option>
              Female
            </option>

            <option>
              Other
            </option>
          </select>
        </div>
      </div>

      <div className="upload-grid">
        <div className="upload-card">
          <label>
            Profile Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              updateField(
                'profilePhoto',
                e.target.files[0]
              )
            }
          />
        </div>

        <div className="upload-card">
          <label>Logo</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              updateField(
                'logo',
                e.target.files[0]
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;