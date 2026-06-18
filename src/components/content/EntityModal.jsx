import { useState } from 'react';
import './uploadContentModal.css';

const EntityModal = ({
  title,
  onClose,
}) => {
  const [name, setName] =
    useState('');

  const handleSave = () => {
    if (!name.trim()) {
      alert(
        'Please enter a name'
      );
      return;
    }

    console.log({
      type: title,
      name,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div
        className="upload-modal"
        style={{
          width: '450px',
          maxHeight: 'auto',
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
          <div className="form-group full-width">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder={`Enter ${title
                .replace(
                  'Add ',
                  ''
                )
                .toLowerCase()} name`}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntityModal;