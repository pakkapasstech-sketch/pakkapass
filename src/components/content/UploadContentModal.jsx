import { useState } from 'react';
import { formatFileSize } from '../../utils/formatters';
import './uploadContentModal.css';

const UploadContentModal = ({
  //isQuestionPaperLevel,
  filters,
  contentType,
  onUpload,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topicName, setTopicName] = useState(filters.section || '');
  const [file, setFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadedOn = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const isVideo = contentType === 'video' || selected.type?.startsWith('video/') || selected.name?.match(/\.(mp4|avi|mov|mkv|webm)$/i);

    if (isVideo && selected.size > MAX_VIDEO_SIZE) {
      alert('Video file size exceeds maximum limit of 100 MB. Please upload a smaller video or use a Video URL / Link.');
      e.target.value = '';
      setFile(null);
      return;
    }

    setFile(selected);

    if (!title) {
      const name = selected.name.replace(/\.[^/.]+$/, '');
      setTitle(name);
    }
  };

  const handleUpload = async () => {
    if (uploadMode === 'url') {
      if (!videoUrl.trim()) {
        alert('Please enter a valid Video URL / Link');
        return;
      }
      setUploading(true);
      try {
        await onUpload({
          filters,
          file: videoUrl.trim(),
          title: title || 'Video Link',
          description,
          topicName,
          uploadedOn,
          fileName: 'Video Link',
          fileSize: 'Link',
          contentType: contentType || 'video',
        });
      } finally {
        setUploading(false);
      }
      return;
    }

    if (!file) {
      alert('Please select a file');
      return;
    }

    const isVideo = contentType === 'video' || file.type?.startsWith('video/') || file.name?.match(/\.(mp4|avi|mov|mkv|webm)$/i);
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      alert('Video file size exceeds maximum limit of 100 MB. Please upload a smaller video or use a Video URL / Link.');
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
        fileSize: formatFileSize(file.size),
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
          <div style={{
            background: 'rgba(102, 83, 175, 0.08)',
            border: '1px solid rgba(102, 83, 175, 0.2)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '12.5px',
            color: 'var(--color-primary, #6653AF)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📌</span>
            <span><strong>Note:</strong> Only 1 Notes file can be uploaded per topic.</span>
          </div>

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ margin: 0 }}>
                {uploadMode === 'url' ? 'Video URL / Link' : 'Upload File'}
              </label>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    border: '1px solid var(--color-border, #cbd5e1)',
                    background: uploadMode === 'file' ? '#2563eb' : 'var(--color-card, #ffffff)',
                    color: uploadMode === 'file' ? '#ffffff' : 'var(--color-text-primary, #475569)',
                    cursor: 'pointer'
                  }}
                >
                  📁 File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    border: '1px solid var(--color-border, #cbd5e1)',
                    background: uploadMode === 'url' ? '#2563eb' : 'var(--color-card, #ffffff)',
                    color: uploadMode === 'url' ? '#ffffff' : 'var(--color-text-primary, #475569)',
                    cursor: 'pointer'
                  }}
                >
                  🔗 Video URL Link
                </button>
              </div>
            </div>

            {uploadMode === 'url' ? (
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or video link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            ) : (
              <>
                <label className="upload-dropzone">
                  <input
                    className="hidden-file-input"
                    type="file"
                    accept={
                      contentType === 'video'
                        ? 'video/*'
                        : '.pdf'
                    }
                    onChange={handleFileChange}
                  />

                  <div className="upload-placeholder">
                    <span className="upload-icon">
                      📁
                    </span>

                    <h4>
                      Click to Upload
                    </h4>

                    <p>
                      {contentType === 'video'
                        ? 'MP4, AVI, MOV (Max 100 MB)'
                        : 'PDF files only'}
                    </p>
                  </div>
                </label>

                {file && (
                  <div className="selected-file">
                    <div>
                      <strong>
                        {file.name}
                      </strong>

                      <p>
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => setFile(null)}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </>
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