import { useState, useEffect, useMemo } from 'react';
import {
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
  HiOutlineCloudUpload,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineArrowLeft,
  HiOutlineLink,
  HiOutlineSelector,
  HiOutlineX,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { contentService } from '../../services/content.service';

const parseNumericId = (val) => {
  if (val === null || val === undefined) return undefined;
  const num = Number(val);
  return !isNaN(num) && Number.isInteger(num) && num > 0 ? num : undefined;
};

const getString = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val === '[object Object]' ? '' : val;
  if (typeof val === 'object') {
    if (val.name && typeof val.name === 'string' && val.name !== '[object Object]') return val.name;
    if (val.title && typeof val.title === 'string' && val.title !== '[object Object]') return val.title;
    if (val.topic && typeof val.topic === 'string' && val.topic !== '[object Object]') return val.topic;
  }
  const str = String(val);
  return str === '[object Object]' ? '' : str;
};

const sortWithSavedOrder = (list, savedOrderArray, getItemKey) => {
  if (!savedOrderArray || !Array.isArray(savedOrderArray) || savedOrderArray.length === 0) return list;

  const orderMap = new Map();
  savedOrderArray.forEach((key, index) => {
    orderMap.set(String(key).toLowerCase(), index);
  });

  return [...list].sort((a, b) => {
    const keyA = String(getItemKey(a)).toLowerCase();
    const keyB = String(getItemKey(b)).toLowerCase();

    const orderA = orderMap.has(keyA) ? orderMap.get(keyA) : 999999;
    const orderB = orderMap.has(keyB) ? orderMap.get(keyB) : 999999;

    return orderA - orderB;
  });
};

const formatFileSize = (size) => {
  if (!size) return '';
  if (typeof size === 'string' && (size.toLowerCase().includes('kb') || size.toLowerCase().includes('mb') || size.toLowerCase().includes('gb') || size.toLowerCase().includes('link'))) {
    return size;
  }
  const num = Number(size);
  if (isNaN(num) || num <= 0) return String(size);
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

const normalizeContentType = (typeStr) => {
  const str = getString(typeStr);
  if (!str) return 'CHAPTER';
  const s = str.trim().toUpperCase();
  if (s.includes('CHAPTER') || s === 'CHAPTERS') return 'CHAPTER';
  if (s.includes('MIND') || s.includes('MAP')) return 'MIND_MAP';
  if (s.includes('PYQ') || s.includes('QUESTION')) return 'PYQ';
  if (s.includes('EXTERNAL') || s.includes('REFERENCE')) return 'EXTERNAL_REFERENCE';
  return s;
};

const isNotesType = (type) => {
  if (!type) return true;
  const t = String(type).toLowerCase();
  return t.includes('note') || t.includes('pdf') || t.includes('doc') || t === 'notesurl';
};

const isVideoType = (type) => {
  if (!type) return false;
  const t = String(type).toLowerCase();
  return t.includes('video') || t.includes('url') || t.includes('link') || t.includes('mp4') || t === 'videourl';
};

const TopicResourceWorkspace = ({
  topic,
  chapter,
  subject,
  branch,
  board,
  grade,
  contentType,
  contentItems = [],
  options = {},
  onUpload,
  onUpdateAsset,
  onDeleteAsset,
  onBackToTopics,
}) => {
  const [activeTab, setActiveTab] = useState('all');

  // Notes Upload Form state
  const [notesTitle, setNotesTitle] = useState('');
  const [notesFile, setNotesFile] = useState(null);
  const [isUploadingNotes, setIsUploadingNotes] = useState(false);

  // Video Upload Form state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoLinkMode, setIsVideoLinkMode] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Edit Resource Modal State
  const [editingResource, setEditingResource] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Resolve contentTypeId from options.contentTypes
  const contentTypeId = useMemo(() => {
    const found = (options?.contentTypes || []).find((ct) => {
      const ctName = String(ct.name || '').trim().toLowerCase();
      const currentTab = String(contentType || '').trim().toLowerCase();
      if (ctName === currentTab) return true;
      if (currentTab === 'chapters' && (ctName.includes('chapter') || ctName.includes('chapters'))) return true;
      if (currentTab === 'mind maps' && (ctName.includes('mind') || ctName.includes('map'))) return true;
      if (currentTab === 'pyq' && (ctName.includes('pyq') || ctName.includes('question'))) return true;
      if (currentTab === 'external references' && (ctName.includes('external') || ctName.includes('reference'))) return true;
      return false;
    });
    return found?.id || 1;
  }, [options.contentTypes, contentType]);

  // Filter content items matching this grade, board, branch, subject, content type, chapter, and topic
  const topicContent = useMemo(() => {
    return contentItems.filter((item) => {
      const targetGrade = getString(grade?.name || grade).trim().toLowerCase();
      const targetBoard = getString(board?.name || board).trim().toLowerCase();
      const targetBranch = getString(branch?.name || branch).trim().toLowerCase();
      const targetSubject = getString(subject?.name || subject).trim().toLowerCase();
      const targetType = normalizeContentType(contentType);
      const targetChapter = getString(chapter?.name || chapter).trim().toLowerCase();
      const targetTopic = getString(topic?.name || topic).trim().toLowerCase();

      const itemGrade = getString(item.grade?.name || item.grade).trim().toLowerCase();
      const itemBoard = getString(item.board?.name || item.board).trim().toLowerCase();
      const itemBranch = getString(item.course?.name || item.course || item.branch?.name || item.branch).trim().toLowerCase();
      const itemSubject = getString(item.subject?.name || item.subject).trim().toLowerCase();
      const itemType = normalizeContentType(item.hierarchyType);
      const itemChapter = getString(item.chapter).trim().toLowerCase();
      const itemTopic = getString(item.section).trim().toLowerCase();

      const matchesGrade = !itemGrade || !targetGrade || itemGrade === targetGrade || String(item.grade?.id || item.gradeId) === String(grade?.id);
      const matchesBoard = !itemBoard || !targetBoard || itemBoard === targetBoard || String(item.board?.id || item.boardId) === String(board?.id);
      const matchesBranch = !itemBranch || !targetBranch || targetBranch === 'general' || itemBranch === targetBranch || String(item.branchId) === String(branch?.id);
      const matchesSubject = !itemSubject || !targetSubject || itemSubject === targetSubject;
      const matchesType = !itemType || itemType === targetType;
      const matchesChapter = !itemChapter || !targetChapter || itemChapter === targetChapter;
      const matchesTopic = !itemTopic || !targetTopic || itemTopic === targetTopic;

      return matchesGrade && matchesBoard && matchesBranch && matchesSubject && matchesType && matchesChapter && matchesTopic;
    });
  }, [contentItems, grade, board, branch, subject, contentType, chapter, topic]);

  const existingNotes = useMemo(() => {
    return topicContent.filter((item) => isNotesType(item.type));
  }, [topicContent]);

  const hasMaxNotes = existingNotes.length >= 1;

  const [orderedItems, setOrderedItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const sortedContent = useMemo(() => {
    return [...topicContent].sort((a, b) => {
      const orderA = Number(a.order ?? a.orderIndex ?? a.position ?? 999999);
      const orderB = Number(b.order ?? b.orderIndex ?? b.position ?? 999999);
      return orderA - orderB;
    });
  }, [topicContent]);

  useEffect(() => {
    setOrderedItems(sortedContent);
  }, [sortedContent]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    let updatedList = [];
    setOrderedItems((prev) => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedIndex, 1);
      copy.splice(dropIndex, 0, draggedItem);
      updatedList = copy;
      return copy;
    });
    setDraggedIndex(null);

    // Save order globally to PostgreSQL Database via API
    try {
      await Promise.all(
        updatedList.map((item, idx) => {
          if (item.id) {
            return entityService.updateContentAsset(item.id, { order: idx + 1 }).catch(() => {});
          }
          return Promise.resolve();
        })
      );
    } catch (err) {
      console.error('Failed to update content asset order in DB:', err);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const filteredContent = orderedItems.filter((item) => {
    if (activeTab === 'notes') {
      return isNotesType(item.type);
    }
    if (activeTab === 'videos') {
      return isVideoType(item.type);
    }
    return true;
  });

  const handleOpenEditModal = (item) => {
    setEditingResource(item);
    setEditTitle(item.title || item.name || item.fileName || '');
    setEditDescription(item.description || '');
    setEditUrl(item.fileUrl || '');
  };

  const handleSaveEditResource = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    try {
      setIsSavingEdit(true);
      const updatePayload = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        fileUrl: editUrl.trim(),
      };

      if (onUpdateAsset) {
        await onUpdateAsset(editingResource.id, updatePayload);
      } else {
        await contentService.updateAsset(editingResource.id, updatePayload);
      }

      setOrderedItems((prev) =>
        prev.map((i) => (i.id === editingResource.id ? { ...i, ...updatePayload } : i))
      );

      toast.success('Resource updated successfully!');
      setEditingResource(null);
    } catch {
      toast.error('Failed to update resource');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    if (hasMaxNotes) {
      toast.error('Only 1 Notes file can be uploaded per topic. Please delete the existing Notes file first to upload a new one.');
      return;
    }
    if (!notesTitle.trim()) {
      toast.error('Please enter a title for the notes');
      return;
    }
    if (!notesFile) {
      toast.error('Please select or drop a notes file (PDF/Doc)');
      return;
    }

    try {
      setIsUploadingNotes(true);
      const filtersObj = {
        class: getString(grade?.name || grade),
        board: getString(board?.name || board),
        course: getString(branch?.name || branch),
        subject: getString(subject?.name || subject),
        chapter: getString(chapter?.name || chapter),
        section: getString(topic?.name || topic),
        selectedContentTypeId: contentTypeId,
        contentTypeId: contentTypeId,
      };

      if (parseNumericId(grade?.id)) filtersObj.classId = parseNumericId(grade.id);
      if (parseNumericId(board?.id)) filtersObj.boardId = parseNumericId(board.id);
      if (parseNumericId(branch?.id)) filtersObj.courseId = parseNumericId(branch.id);
      if (parseNumericId(subject?.id)) filtersObj.subjectId = parseNumericId(subject.id);
      if (parseNumericId(chapter?.id)) filtersObj.chapterId = parseNumericId(chapter.id);
      if (parseNumericId(topic?.id)) filtersObj.sectionId = parseNumericId(topic.id);

      await onUpload({
        filters: filtersObj,
        file: notesFile,
        title: notesTitle,
        description: `Notes for ${getString(topic?.name || topic)}`,
        topicName: getString(topic?.name || topic),
        contentType: 'notes',
        fileSize: notesFile.size ? formatFileSize(notesFile.size) : '',
      });

      setNotesTitle('');
      setNotesFile(null);
    } catch {
      toast.error('Failed to upload notes');
    } finally {
      setIsUploadingNotes(false);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      toast.error('Please enter a title for the video');
      return;
    }
    if (!isVideoLinkMode && !videoFile) {
      toast.error('Please select or drop a video file');
      return;
    }
    if (isVideoLinkMode && !videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    try {
      setIsUploadingVideo(true);
      const filtersObj = {
        class: getString(grade?.name || grade),
        board: getString(board?.name || board),
        course: getString(branch?.name || branch),
        subject: getString(subject?.name || subject),
        chapter: getString(chapter?.name || chapter),
        section: getString(topic?.name || topic),
        selectedContentTypeId: contentTypeId,
        contentTypeId: contentTypeId,
      };

      if (parseNumericId(grade?.id)) filtersObj.classId = parseNumericId(grade.id);
      if (parseNumericId(board?.id)) filtersObj.boardId = parseNumericId(board.id);
      if (parseNumericId(branch?.id)) filtersObj.courseId = parseNumericId(branch.id);
      if (parseNumericId(subject?.id)) filtersObj.subjectId = parseNumericId(subject.id);
      if (parseNumericId(chapter?.id)) filtersObj.chapterId = parseNumericId(chapter.id);
      if (parseNumericId(topic?.id)) filtersObj.sectionId = parseNumericId(topic.id);

      const filePayload = isVideoLinkMode ? videoUrl : videoFile;

      await onUpload({
        filters: filtersObj,
        file: filePayload,
        title: videoTitle,
        description: `Video for ${getString(topic?.name || topic)}`,
        topicName: getString(topic?.name || topic),
        contentType: 'video',
        fileSize: !isVideoLinkMode && videoFile?.size ? formatFileSize(videoFile.size) : 'Link',
      });

      setVideoTitle('');
      setVideoFile(null);
      setVideoUrl('');
    } catch {
      toast.error('Failed to upload video');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const isExternalRef = String(contentType || '').trim().toUpperCase() === 'EXTERNAL REF';

  return (
    <div className="topic-workspace">
      {/* Top Bar with Back Link */}
      <div className="workspace-topbar" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={onBackToTopics}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
            background: 'var(--color-card, #ffffff)',
            color: 'var(--color-text-primary, #111827)',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <HiOutlineArrowLeft />
          Back to Topics
        </button>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: 'var(--color-text-primary, #111827)' }}>
            Topic: {getString(topic?.name || topic)}
          </h2>
        </div>
      </div>

      {/* Upload Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isExternalRef ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Notes Upload Card */}
        {!isExternalRef && (
        <div
          style={{
            background: 'var(--color-card, #ffffff)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(102, 83, 175, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary, #6653AF)' }}>
              <HiOutlineDocumentText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Upload Notes</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>PDFs, Docs, and Presentation Slides</p>
            </div>
          </div>

          <div style={{
            background: 'rgba(102, 83, 175, 0.08)',
            border: '1px solid rgba(102, 83, 175, 0.2)',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '16px',
            fontSize: '12px',
            color: 'var(--color-primary, #6653AF)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>📌</span>
            <span><strong>Note:</strong> Only 1 Notes file can be uploaded per topic.</span>
          </div>

          {hasMaxNotes && (
            <div style={{
              background: '#fffbe6',
              border: '1px solid #ffe58f',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '16px',
              fontSize: '12.5px',
              color: '#d48806',
              lineHeight: '1.4'
            }}>
              ⚠️ A Notes file has already been uploaded for this topic (<strong>{existingNotes[0]?.title || existingNotes[0]?.fileName || existingNotes[0]?.name || '1 Notes File'}</strong>). Only 1 Notes file is allowed per topic. Delete the existing Notes file below to upload a replacement.
            </div>
          )}

          <form onSubmit={handleNotesSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Note Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Magnetic Field Lines Summary"
                value={notesTitle}
                onChange={(e) => setNotesTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                  fontSize: '13px',
                  background: 'var(--color-bg, #f9fafb)',
                }}
              />
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setNotesFile(e.dataTransfer.files[0]);
                }
              }}
              style={{
                border: '2px dashed rgba(102, 83, 175, 0.35)',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                background: 'rgba(102, 83, 175, 0.03)',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
              onClick={() => document.getElementById('notes-file-input').click()}
            >
              <HiOutlineCloudUpload size={32} style={{ color: 'var(--color-primary, #6653AF)', marginBottom: '6px' }} />
              <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--color-text-primary, #111827)' }}>
                {notesFile ? `${notesFile.name} (${formatFileSize(notesFile.size)})` : 'Drag & drop Notes PDF here, or browse'}
              </p>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary, #6b7280)' }}>Supports .pdf, .doc, .docx (Max 50MB)</span>
              <input
                id="notes-file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNotesFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isUploadingNotes || hasMaxNotes}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: hasMaxNotes ? '#9ca3af' : 'var(--color-primary, #6653AF)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
                cursor: (isUploadingNotes || hasMaxNotes) ? 'not-allowed' : 'pointer',
                opacity: (isUploadingNotes || hasMaxNotes) ? 0.7 : 1,
              }}
            >
              {hasMaxNotes ? 'Notes Limit Reached (Max 1 Notes Per Topic)' : (isUploadingNotes ? 'Uploading Note...' : 'Upload Notes')}
            </button>
          </form>
        </div>
        )}

        {/* Video Upload Card */}
        <div
          style={{
            background: 'var(--color-card, #ffffff)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(102, 83, 175, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary, #6653AF)' }}>
                <HiOutlineVideoCamera size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Upload Videos</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>MP4 Video Files or External Video Links</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsVideoLinkMode(!isVideoLinkMode)}
              style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-primary, #6653AF)',
                background: isVideoLinkMode ? 'rgba(102, 83, 175, 0.1)' : 'transparent',
                color: 'var(--color-primary, #6653AF)',
                cursor: 'pointer',
              }}
            >
              {isVideoLinkMode ? 'File Upload' : 'URL Link'}
            </button>
          </div>

          <form onSubmit={handleVideoSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Video Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Faraday's Law Explained"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                  fontSize: '13px',
                  background: 'var(--color-bg, #f9fafb)',
                }}
              />
            </div>

            {isVideoLinkMode ? (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Video URL / YouTube Link <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border, var(--color-border, #e5e7eb))', borderRadius: '8px', padding: '0 12px', background: 'var(--color-bg, #f9fafb)' }}>
                  <HiOutlineLink style={{ color: 'var(--color-primary, #6653AF)' }} />
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setVideoFile(e.dataTransfer.files[0]);
                  }
                }}
                style={{
                  border: '2px dashed rgba(102, 83, 175, 0.35)',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  background: 'rgba(102, 83, 175, 0.03)',
                  cursor: 'pointer',
                  marginBottom: '16px',
                }}
                onClick={() => document.getElementById('video-file-input').click()}
              >
                <HiOutlineCloudUpload size={32} style={{ color: 'var(--color-primary, #6653AF)', marginBottom: '6px' }} />
                <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--color-text-primary, #111827)' }}>
                  {videoFile ? `${videoFile.name} (${formatFileSize(videoFile.size)})` : 'Drag & drop MP4/WebM Video here, or browse'}
                </p>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary, #6b7280)' }}>Supports .mp4, .webm (Max 2GB)</span>
                <input
                  id="video-file-input"
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setVideoFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isUploadingVideo}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--color-primary, #6653AF)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
                cursor: isUploadingVideo ? 'not-allowed' : 'pointer',
                opacity: isUploadingVideo ? 0.7 : 1,
              }}
            >
              {isUploadingVideo ? 'Uploading Video...' : 'Upload Video'}
            </button>
          </form>
        </div>
      </div>

      {/* Added Content Manager Section (Drag & Drop Reorderable Row List Format) */}
      <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-border, var(--color-border, #e5e7eb))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
              Added Resources ({filteredContent.length})
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '2px 0 0 0' }}>
              Drag any row handle to rearrange resource order, edit details, or view resources for {getString(topic?.name || topic)}
            </p>
          </div>

          {/* Content Filter Tabs */}
          <div style={{ display: 'flex', background: 'var(--color-bg-secondary, #f3f4f6)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'all' ? 'var(--color-card, #ffffff)' : 'transparent',
                color: activeTab === 'all' ? 'var(--color-primary, #6653AF)' : 'var(--color-text-secondary, #6b7280)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              All ({topicContent.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'notes' ? 'var(--color-card, #ffffff)' : 'transparent',
                color: activeTab === 'notes' ? 'var(--color-primary, #6653AF)' : 'var(--color-text-secondary, #6b7280)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'notes' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Notes ({topicContent.filter((i) => isNotesType(i.type)).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'videos' ? 'var(--color-card, #ffffff)' : 'transparent',
                color: activeTab === 'videos' ? 'var(--color-primary, #6653AF)' : 'var(--color-text-secondary, #6b7280)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'videos' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Videos ({topicContent.filter((i) => isVideoType(i.type)).length})
            </button>
          </div>
        </div>

        {/* Drag & Drop Reorderable Resources List */}
        {filteredContent.length > 0 ? (
          <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid var(--color-border, #e2e8f0)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-card, #ffffff)', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg, #f8fafc)', borderBottom: '1px solid var(--color-border, #e2e8f0)' }}>
                  <th style={{ width: '50px', padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#475569' }}></th>
                  <th style={{ width: '60px', padding: '16px 10px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resource Name</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item, index) => {
                  const isVid = isVideoType(item.type);
                  const realIndex = orderedItems.findIndex((o) => o.id === item.id);
                  const isBeingDragged = draggedIndex === realIndex;

                  return (
                    <tr
                      key={item.id || index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, realIndex)}
                      onDragOver={(e) => handleDragOver(e, realIndex)}
                      onDrop={(e) => handleDrop(e, realIndex)}
                      onDragEnd={handleDragEnd}
                      style={{
                        borderBottom: '1px solid var(--color-border, #e2e8f0)',
                        background: isBeingDragged ? 'rgba(102, 83, 175, 0.05)' : 'transparent',
                        opacity: isBeingDragged ? 0.6 : 1,
                        cursor: 'grab',
                        transition: 'background 0.2s ease, opacity 0.2s ease',
                      }}
                    >
                      {/* Drag Handle Icon */}
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--color-text-muted, #9ca3af)', width: '50px' }}>
                        <div style={{ cursor: 'grab', display: 'inline-flex', alignItems: 'center' }} title="Drag to reorder row">
                          <HiOutlineSelector size={20} />
                        </div>
                      </td>

                      {/* Row Index Badge */}
                      <td style={{ padding: '16px 10px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted, #9ca3af)', width: '60px' }}>
                        #{index + 1}
                      </td>

                      {/* Title & Description */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: 'rgba(102, 83, 175, 0.1)',
                              color: 'var(--color-primary, #6653AF)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isVid ? <HiOutlineVideoCamera size={20} /> : <HiOutlineDocumentText size={20} />}
                          </div>
                          <div style={{ overflow: 'hidden', flex: 1 }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title || item.name || item.fileName || item.description || 'Uploaded Content'}
                            </h4>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)', margin: '4px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.uploadedOn || 'Recently'} {item.description ? `— ${item.description}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: isVid ? '#ef4444' : '#10b981', background: isVid ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {isVid ? 'Video' : 'Notes'}
                        </span>
                      </td>

                      {/* File Size */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-primary, #6653AF)', background: 'rgba(102, 83, 175, 0.08)', padding: '4px 10px', borderRadius: '6px' }}>
                          {formatFileSize(item.fileSize) || (item.fileUrl?.includes('http') ? 'URL Link' : 'File')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          {item.fileUrl && (
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                padding: '6px',
                                borderRadius: '4px',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--color-primary, #6653AF)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              title="View / Open resource"
                            >
                              <HiOutlineEye size={18} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            style={{
                              padding: '6px',
                              borderRadius: '4px',
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--color-primary, #6653AF)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            title="Edit resource details"
                          >
                            <HiOutlinePencil size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete "${item.title || item.name}"?`)) {
                                try {
                                  await onDeleteAsset(item.id);
                                  toast.success('Resource deleted');
                                } catch {
                                  toast.error('Failed to delete resource');
                                }
                              }
                            }}
                            style={{
                              padding: '6px',
                              borderRadius: '4px',
                              border: 'none',
                              background: 'transparent',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            title="Delete resource"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-secondary, #6b7280)' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
              No {activeTab === 'all' ? 'resources' : activeTab} added for this topic yet.
            </p>
            <span style={{ fontSize: '12px' }}>Use the upload cards above to add Notes or Videos.</span>
          </div>
        )}
      </div>

      {/* Edit Resource Modal */}
      {editingResource && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Edit Resource Details</h3>
              <button
                type="button"
                onClick={() => setEditingResource(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary, #6b7280)' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditResource}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Resource Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                    fontSize: '13px',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  File URL / Link
                </label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                    background: 'transparent',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--color-primary, #6653AF)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: isSavingEdit ? 'not-allowed' : 'pointer',
                    opacity: isSavingEdit ? 0.7 : 1,
                  }}
                >
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicResourceWorkspace;
