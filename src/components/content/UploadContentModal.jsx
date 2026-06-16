import { useState } from 'react';
import './uploadContentModal.css';

const UploadContentModal = ({ onClose }) => {
  const [contentType, setContentType] =
    useState('video');

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <h2>Upload Content</h2>

          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>
              Content Type
            </label>

            <select
              value={contentType}
              onChange={(e) =>
                setContentType(
                  e.target.value
                )
              }
            >
              <option value="video">
                Video
              </option>

              <option value="notes">
                Notes
              </option>

              <option value="pdf">
                PDF
              </option>

              <option value="paper">
                Question Paper
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>

            <input
              placeholder="Enter title"
            />
          </div>

          <div className="form-group">
            <label>
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Enter description"
            />
          </div>

          <div className="form-group">
            <label>Tags</label>

            <input
              placeholder="real numbers, algebra..."
            />
          </div>

          <div className="form-group">
            <label>
              Upload File
            </label>

            <input
              type="file"
            />
          </div>

          {contentType ===
            'video' && (
            <>
              <div className="form-group">
                <label>
                  Video Duration
                </label>

                <input placeholder="20 mins" />
              </div>

              <div className="form-group">
                <label>
                  Video URL
                </label>

                <input placeholder="https://" />
              </div>
            </>
          )}

          {contentType ===
            'pdf' && (
            <div className="form-group">
              <label>
                Number Of Pages
              </label>

              <input
                type="number"
              />
            </div>
          )}

          {contentType ===
            'paper' && (
            <>
              <div className="form-group">
                <label>
                  Academic Year
                </label>

                <input placeholder="2024-2025" />
              </div>

              <div className="form-group">
                <label>
                  Exam Type
                </label>

                <input placeholder="Mid Term" />
              </div>
            </>
          )}

          {contentType ===
            'notes' && (
            <div className="form-group">
              <label>
                Author Name
              </label>

              <input />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="save-btn">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadContentModal;