import { useState, useMemo } from 'react';
import {
  HiOutlineFolder,
  HiOutlineBookOpen,
  HiOutlinePlus,
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const normalizeContentType = (typeStr) => {
  if (!typeStr) return 'CHAPTER';
  const s = String(typeStr).trim().toUpperCase();
  if (s.includes('CHAPTER') || s === 'CHAPTERS') return 'CHAPTER';
  if (s.includes('MIND') || s.includes('MAP')) return 'MIND_MAP';
  if (s.includes('PYQ') || s.includes('QUESTION')) return 'PYQ';
  if (s.includes('EXTERNAL') || s.includes('REFERENCE')) return 'EXTERNAL_REFERENCE';
  return s;
};

const ChapterTopicCardWorkspace = ({
  subject,
  branch,
  board,
  grade,
  contentType,
  contentItems = [],
  options = {},
  onSelectTopic,
}) => {
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Custom created chapters & topics state for inline creation
  const [customChapters, setCustomChapters] = useState([]);
  const [customTopics, setCustomTopics] = useState({}); // { [chapterName]: ['Topic 1', 'Topic 2'] }

  // Modal / Form state for Creating Chapter
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');

  // Modal / Form state for Creating Topic
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  // 1. Filter existing Chapters from DB options (options.chapters)
  const dbChapters = useMemo(() => {
    const targetType = normalizeContentType(contentType);
    const targetGrade = grade?.name?.trim().toLowerCase();
    const targetBoard = board?.name?.trim().toLowerCase();
    const targetSubject = subject?.name?.trim().toLowerCase();
    const targetBranch = branch?.name?.trim().toLowerCase();

    return (options?.chapters || []).filter((ch) => {
      const chGrade = (ch.grade?.name || ch.gradeName || '').trim().toLowerCase();
      const chBoard = (ch.board?.name || ch.boardName || '').trim().toLowerCase();
      const chSubject = (ch.subject?.name || ch.subjectName || '').trim().toLowerCase();
      const chBranch = (ch.branch?.name || ch.branchName || '').trim().toLowerCase();
      const chType = normalizeContentType(ch.contentType?.name || ch.hierarchyType);

      const matchGrade = !chGrade || !targetGrade || chGrade === targetGrade || String(ch.gradeId) === String(grade?.id);
      const matchBoard = !chBoard || !targetBoard || chBoard === targetBoard || String(ch.boardId) === String(board?.id);
      const matchSubject = !chSubject || !targetSubject || chSubject === targetSubject || String(ch.subjectId) === String(subject?.id);
      const matchBranch = !chBranch || !targetBranch || targetBranch === 'general' || chBranch === targetBranch || String(ch.branchId) === String(branch?.id);
      const matchType = !chType || chType === targetType;

      return matchGrade && matchBoard && matchSubject && matchBranch && matchType;
    });
  }, [options.chapters, grade, board, subject, branch, contentType]);

  // 2. Filter content assets from API (contentItems)
  const activeContentItems = useMemo(() => {
    const targetType = normalizeContentType(contentType);
    const targetGrade = grade?.name?.trim().toLowerCase();
    const targetBoard = board?.name?.trim().toLowerCase();
    const targetSubject = subject?.name?.trim().toLowerCase();
    const targetBranch = branch?.name?.trim().toLowerCase();

    return contentItems.filter((item) => {
      const itemGrade = (item.grade?.name || item.grade || '').trim().toLowerCase();
      const itemBoard = (item.board?.name || item.board || '').trim().toLowerCase();
      const itemBranch = (item.course?.name || item.course || '').trim().toLowerCase();
      const itemSubject = (item.subject?.name || item.subject || '').trim().toLowerCase();
      const itemType = normalizeContentType(item.hierarchyType);

      const matchGrade = !itemGrade || !targetGrade || itemGrade === targetGrade || String(item.grade?.id) === String(grade?.id);
      const matchBoard = !itemBoard || !targetBoard || itemBoard === targetBoard || String(item.board?.id) === String(board?.id);
      const matchSubject = !itemSubject || !targetSubject || itemSubject === targetSubject;
      const matchBranch = !itemBranch || !targetBranch || targetBranch === 'general' || itemBranch === targetBranch;
      const matchType = !itemType || itemType === targetType;

      return matchGrade && matchBoard && matchBranch && matchSubject && matchType;
    });
  }, [contentItems, grade, board, branch, subject, contentType]);

  // Map content assets to chapter -> topics map
  const contentChaptersMap = useMemo(() => {
    const map = {};
    activeContentItems.forEach((item) => {
      const chName = item.chapter || 'General Chapter';
      if (!map[chName]) {
        map[chName] = {};
      }
      const topName = item.section || 'General Topic';
      if (!map[chName][topName]) {
        map[chName][topName] = [];
      }
      map[chName][topName].push(item);
    });
    return map;
  }, [activeContentItems]);

  // Combine all chapter names from DB options + content assets + custom created
  const allChaptersList = useMemo(() => {
    const chapterMap = new Map();

    // From DB options
    dbChapters.forEach((ch) => {
      if (ch.name) {
        chapterMap.set(ch.name.trim(), ch);
      }
    });

    // From content assets
    Object.keys(contentChaptersMap).forEach((chName) => {
      if (!chapterMap.has(chName.trim())) {
        chapterMap.set(chName.trim(), { name: chName.trim(), id: chName });
      }
    });

    // From custom created
    customChapters.forEach((chName) => {
      if (!chapterMap.has(chName.trim())) {
        chapterMap.set(chName.trim(), { name: chName.trim(), id: chName });
      }
    });

    return Array.from(chapterMap.values());
  }, [dbChapters, contentChaptersMap, customChapters]);

  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!newChapterName.trim()) {
      toast.error('Please enter a chapter name');
      return;
    }
    const exists = allChaptersList.some((c) => c.name.toLowerCase() === newChapterName.trim().toLowerCase());
    if (exists) {
      toast.error('Chapter with this name already exists');
      return;
    }
    setCustomChapters([...customChapters, newChapterName.trim()]);
    toast.success(`Chapter "${newChapterName.trim()}" created!`);
    setNewChapterName('');
    setShowCreateChapterModal(false);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) {
      toast.error('Please enter a topic name');
      return;
    }
    const chName = typeof selectedChapter === 'object' ? selectedChapter.name : selectedChapter;
    const existingTopics = customTopics[chName] || [];
    if (existingTopics.some((t) => t.toLowerCase() === newTopicName.trim().toLowerCase())) {
      toast.error('Topic with this name already exists in this chapter');
      return;
    }

    setCustomTopics({
      ...customTopics,
      [chName]: [...existingTopics, newTopicName.trim()],
    });

    toast.success(`Topic "${newTopicName.trim()}" created!`);
    setNewTopicName('');
    setShowCreateTopicModal(false);
  };

  // LEVEL 2: Topic View for Selected Chapter
  if (selectedChapter) {
    const chName = typeof selectedChapter === 'object' ? selectedChapter.name : selectedChapter;
    const selectedChObj = typeof selectedChapter === 'object' ? selectedChapter : allChaptersList.find((c) => c.name === chName);

    // Topics from DB options matching selected chapter ID or name
    const dbTopicsList = (options?.topics || [])
      .filter((t) => {
        if (selectedChObj?.id) {
          return String(t.chapterId) === String(selectedChObj.id);
        }
        return t.chapterName === chName;
      })
      .map((t) => t.name);

    // Topics from content assets
    const contentTopicNames = Object.keys(contentChaptersMap[chName] || {});

    // Topics from custom created
    const customTopicNames = customTopics[chName] || [];

    // All combined topic names
    const allTopicNames = Array.from(
      new Set([...dbTopicsList, ...contentTopicNames, ...customTopicNames].map((t) => t?.trim()).filter(Boolean))
    );

    return (
      <div className="topics-level-view">
        {/* Top Header & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setSelectedChapter(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid var(--color-border, #e5e7eb)',
                background: 'var(--color-card, #ffffff)',
                color: 'var(--color-text-primary, #111827)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <HiOutlineArrowLeft />
              Back to Chapters
            </button>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)' }}>
                {subject.name} &bull; {contentType}
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '2px 0 0 0', color: 'var(--color-text-primary, #111827)' }}>
                Chapter: {chName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateTopicModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--color-primary, #6653AF)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 83, 175, 0.25)',
            }}
          >
            <HiOutlinePlus size={18} />
            Create Topic
          </button>
        </div>

        {/* Topics Cards Grid */}
        {allTopicNames.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {allTopicNames.map((topName) => {
              const topicItems = contentChaptersMap[chName]?.[topName] || [];
              const notesCount = topicItems.filter((i) => i.type === 'notes' || i.type === 'pdf' || i.type === 'document').length;
              const videosCount = topicItems.filter((i) => i.type === 'video' || i.type === 'url' || i.type === 'link').length;

              return (
                <div
                  key={topName}
                  onClick={() => onSelectTopic(selectedChapter, { name: topName })}
                  style={{
                    background: 'var(--color-card, #ffffff)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid var(--color-border, #e5e7eb)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = 'var(--color-primary, #6653AF)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = 'var(--color-border, #e5e7eb)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'rgba(102, 83, 175, 0.1)',
                          color: 'var(--color-primary, #6653AF)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <HiOutlineBookOpen size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary, #6b7280)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Topic Card
                        </span>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: 'var(--color-text-primary, #111827)' }}>
                          {topName}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border, #f1f5f9)' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <HiOutlineDocumentText size={15} style={{ color: '#4f46e5' }} /> {notesCount} Notes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <HiOutlineVideoCamera size={15} style={{ color: '#ec4899' }} /> {videosCount} Videos
                      </span>
                    </div>

                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary, #6653AF)' }}>
                      Open &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            onClick={() => setShowCreateTopicModal(true)}
            style={{
              border: '2px dashed var(--color-border, #d1d5db)',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--color-card, #ffffff)',
            }}
          >
            <HiOutlinePlus size={36} style={{ color: 'var(--color-primary, #6653AF)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>No topics created yet in "{chName}"</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>
              Click here to create a topic card to upload notes and videos.
            </p>
          </div>
        )}

        {/* Modal for Creating Topic */}
        {showCreateTopicModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>Create New Topic Card</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
                Add a topic card under chapter "{chName}"
              </p>

              <form onSubmit={handleAddTopic}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Topic Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electromagnetic Waves Basics"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border, #d1d5db)',
                    fontSize: '14px',
                    marginBottom: '20px',
                  }}
                  autoFocus
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateTopicModal(false);
                      setNewTopicName('');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #d1d5db)',
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
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--color-primary, #6653AF)',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Create Topic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LEVEL 1: Chapters Cards View (No chapter selected)
  return (
    <div className="chapters-level-view">
      {/* Top Header & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)' }}>
            {subject.name} &bull; {contentType}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '2px 0 0 0', color: 'var(--color-text-primary, #111827)' }}>
            Chapters ({allChaptersList.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateChapterModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--color-primary, #6653AF)',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 83, 175, 0.25)',
          }}
        >
          <HiOutlinePlus size={18} />
          Create Chapter
        </button>
      </div>

      {/* Chapters Grid */}
      {allChaptersList.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {allChaptersList.map((ch) => {
            const chName = ch.name;
            const apiTopicsCount = Object.keys(contentChaptersMap[chName] || {}).length;
            const dbTopicsCount = (options?.topics || []).filter((t) => String(t.chapterId) === String(ch.id) || t.chapterName === chName).length;
            const customTopicsCount = (customTopics[chName] || []).length;
            const totalTopicsCount = new Set([apiTopicsCount, dbTopicsCount, customTopicsCount]).size || (apiTopicsCount + dbTopicsCount + customTopicsCount);

            return (
              <div
                key={ch.id || chName}
                onClick={() => setSelectedChapter(ch)}
                style={{
                  background: 'var(--color-card, #ffffff)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid var(--color-border, #e5e7eb)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--color-primary, #6653AF)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--color-border, #e5e7eb)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'rgba(102, 83, 175, 0.12)',
                        color: 'var(--color-primary, #6653AF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <HiOutlineFolder size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary, #6b7280)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Chapter Card
                      </span>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--color-text-primary, #111827)' }}>
                        {chName}
                      </h3>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--color-border, #f1f5f9)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary, #6b7280)' }}>
                    {totalTopicsCount} {totalTopicsCount === 1 ? 'Topic' : 'Topics'}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary, #6653AF)' }}>
                    View Topics &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          onClick={() => setShowCreateChapterModal(true)}
          style={{
            border: '2px dashed var(--color-border, #d1d5db)',
            borderRadius: '16px',
            padding: '50px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'var(--color-card, #ffffff)',
          }}
        >
          <HiOutlinePlus size={40} style={{ color: 'var(--color-primary, #6653AF)', marginBottom: '10px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>No Chapters Created Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>
            Click here to create a chapter under "{contentType}" for {subject.name}.
          </p>
        </div>
      )}

      {/* Modal for Creating Chapter */}
      {showCreateChapterModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>Create Chapter Card</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
              Add a chapter card under {contentType} for {subject.name}
            </p>

            <form onSubmit={handleAddChapter}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Chapter Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 1: Introduction to Mechanics"
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border, #d1d5db)',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateChapterModal(false);
                    setNewChapterName('');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border, #d1d5db)',
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
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--color-primary, #6653AF)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterTopicCardWorkspace;
