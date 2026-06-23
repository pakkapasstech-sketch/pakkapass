import { useState } from 'react';
import './uploadContentModal.css';

const UploadContentModal = ({
  //isQuestionPaperLevel,
  filters,
  contentType,
  onUpload,
  onClose,
}) => {
  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');
  const [topicName, setTopicName] =
  useState(filters.section || '');
  const [file, setFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const uploadedOn =
    new Date().toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );

  const formatFileSize = (
    bytes
  ) => {
    if (!bytes) return '';

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(2)} KB`;
    }

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(2)} MB`;
  };

  const handleFileChange = (
    e
  ) => {
    const selected =
      e.target.files[0];

    if (!selected) return;

    setFile(selected);

    if (!title) {
      const name =
        selected.name.replace(
          /\.[^/.]+$/,
          ''
        );

      setTitle(name);
    }
  };

  const handleUpload =
    async () => {
      if (!file) {
        alert(
          'Please select a file'
        );
        return;
      }

      setUploading(true);

      try {
        await onUpload({
  filters,
  file,
  title,
  description,
  topicName,
  uploadedOn,
  fileName: file.name,
  fileSize:
    formatFileSize(file.size),
  contentType,
});
      } finally {
        setUploading(false);
      }
    };

 const heading =
  `Upload ${
    filters.selectedContentType ||
    'Content'
  }`;
  const topicLabelMap = {
  Ebooks: 'Ebook Name',
  PYQ: 'Question Paper Name',
  'Mind Maps': 'Mind Map Name',
  Chapter: 'Topic Name',
};

const topicLabel =
  topicLabelMap[
    filters.selectedContentType
  ] || 'Topic Name';

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <h2>{heading}</h2>

          <button
            className="modal-close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group full-width">
            <label>
              Title
            </label>

            <input
              value={
                title
              }
              onChange={(
                e
              ) =>
                setTitle(
                  e.target
                    .value
                )
              }
              placeholder="Enter title"
            />
          </div>

          <div className="form-group full-width">
            <div className="form-group full-width">
  <label>{topicLabel}</label>

  <input
    value={topicName}
    onChange={(e) =>
      setTopicName(
        e.target.value
      )
    }
    placeholder={`Enter ${topicLabel.toLowerCase()}`}
  />
</div>

            <label>
              Description
            </label>

            <textarea
              rows="4"
              value={
                description
              }
              onChange={(
                e
              ) =>
                setDescription(
                  e.target
                    .value
                )
              }
              placeholder="Enter description"
            />
          </div>

          <div className="form-group">
            <label>
              Uploaded On
            </label>

            <input
              value={
                uploadedOn
              }
              readOnly
            />
          </div>

          <div className="form-group">
            <label>
              File Name
            </label>

            <input
              value={
                file?.name ||
                ''
              }
              readOnly
              placeholder="No file selected"
            />
          </div>

          <div className="form-group">
            <label>
              File Size
            </label>

            <input
              value={
                file
                  ? formatFileSize(
                      file.size
                    )
                  : ''
              }
              readOnly
              placeholder="Auto generated"
            />
          </div>

          <div className="form-group full-width">
            <label>
              Upload File
            </label>

            <label className="upload-dropzone">
              <input
                className="hidden-file-input"
                type="file"
                accept={
  contentType === 'video'
    ? 'video/*'
    : '.pdf'
}
                onChange={
                  handleFileChange
                }
              />

              <div className="upload-placeholder">
                <span className="upload-icon">
                  📁
                </span>

                <h4>
                  Click to
                  Upload
                </h4>

                <p>
                  {contentType === 'video'
  ? 'MP4, AVI, MOV'
  : 'PDF files only'}
                </p>
              </div>
            </label>

            {file && (
              <div className="selected-file">
                <div>
                  <strong>
                    {
                      file.name
                    }
                  </strong>

                  <p>
                    {formatFileSize(
                      file.size
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={() =>
                    setFile(
                      null
                    )
                  }
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={
              onClose
            }
            disabled={
              uploading
            }
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={
              handleUpload
            }
            disabled={
              uploading
            }
          >
            {uploading
              ? 'Uploading...'
              : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadContentModal;