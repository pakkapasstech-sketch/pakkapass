import './uploadContentModal.css';

const EntityModal = ({
  title,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div
        className="upload-modal"
        style={{
          width: '500px',
        }}
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Name</label>

            <input />
          </div>

          <div className="form-group">
            <label>Code</label>

            <input />
          </div>

          <div className="form-group">
            <label>
              Description
            </label>

            <textarea
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>
              Status
            </label>

            <select>
              <option>
                Active
              </option>

              <option>
                Inactive
              </option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="save-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntityModal;