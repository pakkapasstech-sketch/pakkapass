import { useState } from 'react';
import './uploadContentModal.css';

const UploadContentModal = ({
  topic,
  filters,
  contentType,
  onUpload,
  onClose,
}) => {
  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [file, setFile] =
    useState(null);

  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected =
      e.target.files[0];

    if (!selected) return;

    setFile(selected);

    if (!title) {
      setTitle(selected.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      // POST /admin/content via parent handler
      await onUpload({
        filters,
        topicName: topic,
        file,
        contentType: contentType === 'all' ? 'video' : contentType,
        title,
        description,
      });
    } finally {
      setUploading(false);
    }
  };

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
            <label>Title</label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Enter title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Enter description"
            />
          </div>

          <div className="form-group">
            <label>
              Upload File
            </label>

            <input
              type="file"
              onChange={
                handleFileChange
              }
            />

            {file && (
              <p
                style={{
                  marginTop: 10,
                }}
              >
                Selected:
                {' '}
                {file.name}
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={
              handleUpload
            }
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadContentModal;
