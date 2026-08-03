import { useState, useMemo, useEffect } from 'react';
import {
  HiOutlineFolder,
  HiOutlineBookOpen,
  HiOutlinePlus,
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineSelector,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import entityService from '../../services/entity.service';
import contentService from '../../services/content.service';

const parseNumericId = (val) => {
  if (val === null || val === undefined) return undefined;
  const num = Number(val);
  return !isNaN(num) && Number.isInteger(num) && num > 0 ? num : undefined;
};

const getString = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.name && typeof val.name === 'string') return val.name;
  if (typeof val === 'object' && val.title && typeof val.title === 'string') return val.title;
  return String(val);
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

const ChapterTopicCardWorkspace = ({
  subject,
  branch,
  board,
  grade,
  contentType,
  contentItems = [],
  options = {},
  selectedChapter: propSelectedChapter,
  onSelectChapter: propOnSelectChapter,
  onSelectTopic,
  onBackToSubjects,
  refetchOptions,
}) => {
  const [internalSelectedChapter, setInternalSelectedChapter] = useState(null);
  const rawCt = getString(contentType?.name || contentType);
  const isChapterType = !rawCt || rawCt.trim().toLowerCase() === 'chapter' || rawCt.trim().toLowerCase() === 'chapters';
  const displayContentType = isChapterType ? 'Chapter' : 'Title';

  const selectedChapter = propSelectedChapter !== undefined ? propSelectedChapter : internalSelectedChapter;
  const setSelectedChapter = (val) => {
    if (propOnSelectChapter) {
      propOnSelectChapter(val);
    }
    setInternalSelectedChapter(val);
  };

  // Custom created chapters & topics state for inline creation
  const [customChapters, setCustomChapters] = useState([]);
  const [customTopics, setCustomTopics] = useState({}); // { [chapterName]: ['Topic 1', 'Topic 2'] }

  // Edited & deleted state for Chapter and Topic cards
  const [editedChapterNames, setEditedChapterNames] = useState({}); // { [oldName]: newName }
  const [deletedChapters, setDeletedChapters] = useState(new Set()); // Set of deleted chapter names

  const [editedTopicNames, setEditedTopicNames] = useState({}); // { [oldName]: newName }
  const [deletedTopics, setDeletedTopics] = useState(new Set()); // Set of deleted topic names

  // Modal / Form state for Creating Chapter
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  // Modal / Form state for Creating Topic
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  // Modal state for Editing Chapter / Topic
  const [editModalItem, setEditModalItem] = useState(null); // { type: 'chapter' | 'topic', name: string }
  const [editNameInput, setEditNameInput] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 1. Filter existing Chapters from DB options (options.chapters)
  const dbChapters = useMemo(() => {
    const targetType = normalizeContentType(contentType);
    const targetGrade = getString(grade?.name || grade).trim().toLowerCase();
    const targetBoard = getString(board?.name || board).trim().toLowerCase();
    const targetSubject = getString(subject?.name || subject).trim().toLowerCase();
    const targetBranch = getString(branch?.name || branch).trim().toLowerCase();

    return (options?.chapters || []).filter((ch) => {
      const chGrade = getString(ch.grade?.name || ch.gradeName || ch.grade).trim().toLowerCase();
      const chBoard = getString(ch.board?.name || ch.boardName || ch.board).trim().toLowerCase();
      const chBranch = getString(ch.branch?.name || ch.branchName || ch.branch || ch.course?.name || ch.course).trim().toLowerCase();
      const chSubject = getString(ch.subject?.name || ch.subjectName || ch.subject).trim().toLowerCase();
      const chType = normalizeContentType(ch.contentType?.name || ch.contentType || ch.hierarchyType);

      const matchesGrade = !targetGrade || chGrade === targetGrade;
      const matchesBoard = !targetBoard || chBoard === targetBoard;
      const matchesBranch = !targetBranch || targetBranch === 'general' || chBranch === targetBranch;
      const matchesSubject = !targetSubject || chSubject === targetSubject;
      const matchesType = !targetType || chType === targetType;

      return matchesGrade && matchesBoard && matchesBranch && matchesSubject && matchesType;
    });
  }, [options.chapters, grade, board, branch, subject, contentType]);

  // 2. Map existing uploaded content items into chapters -> topics map
  const contentChaptersMap = useMemo(() => {
    const targetGrade = getString(grade?.name || grade).trim().toLowerCase();
    const targetBoard = getString(board?.name || board).trim().toLowerCase();
    const targetBranch = getString(branch?.name || branch).trim().toLowerCase();
    const targetSubject = getString(subject?.name || subject).trim().toLowerCase();
    const targetType = normalizeContentType(contentType);

    const map = {};

    contentItems.forEach((item) => {
      const itemGrade = getString(item.grade?.name || item.grade).trim().toLowerCase();
      const itemBoard = getString(item.board?.name || item.board).trim().toLowerCase();
      const itemBranch = getString(item.course?.name || item.course || item.branch?.name || item.branch).trim().toLowerCase();
      const itemSubject = getString(item.subject?.name || item.subject).trim().toLowerCase();
      const itemType = normalizeContentType(item.hierarchyType);
      const chName = getString(item.chapter);
      const topName = getString(item.section);

      const matchesGrade = !itemGrade || !targetGrade || itemGrade === targetGrade;
      const matchesBoard = !itemBoard || !targetBoard || itemBoard === targetBoard;
      const matchesBranch = !itemBranch || !targetBranch || targetBranch === 'general' || itemBranch === targetBranch;
      const matchesSubject = !itemSubject || !targetSubject || itemSubject === targetSubject;
      const matchesType = !itemType || itemType === targetType;

      if (matchesGrade && matchesBoard && matchesBranch && matchesSubject && matchesType && chName) {
        const displayChName = editedChapterNames[chName] || chName;
        const displayTopName = editedTopicNames[topName] || topName;

        if (!map[displayChName]) {
          map[displayChName] = {};
        }
        if (topName) {
          if (!map[displayChName][displayTopName]) {
            map[displayChName][displayTopName] = [];
          }
          map[displayChName][displayTopName].push(item);
        }
      }
    });

    return map;
  }, [contentItems, grade, board, branch, subject, contentType, editedChapterNames, editedTopicNames]);

  // 3. Combine all chapters (DB + uploaded content + custom created) filtering out deleted chapters
  const allChaptersList = useMemo(() => {
    const namesSet = new Set();
    const list = [];

    // Add custom created chapters FIRST so new chapters appear immediately
    customChapters.forEach((chName) => {
      const displayName = editedChapterNames[chName] || chName;
      if (displayName && !deletedChapters.has(chName) && !deletedChapters.has(displayName) && !namesSet.has(displayName.toLowerCase())) {
        namesSet.add(displayName.toLowerCase());
        list.push({ id: `custom_ch_${chName}`, name: displayName, rawName: chName });
      }
    });

    // Add chapters from DB options
    dbChapters.forEach((ch) => {
      const rawName = getString(ch.name || ch.title);
      const displayName = editedChapterNames[rawName] || rawName;
      if (displayName && !deletedChapters.has(rawName) && !deletedChapters.has(displayName) && !namesSet.has(displayName.toLowerCase())) {
        namesSet.add(displayName.toLowerCase());
        list.push({ ...ch, name: displayName, rawName });
      }
    });

    // Add chapters from uploaded content map
    Object.keys(contentChaptersMap).forEach((chName) => {
      const displayName = editedChapterNames[chName] || chName;
      if (displayName && !deletedChapters.has(chName) && !deletedChapters.has(displayName) && !namesSet.has(displayName.toLowerCase())) {
        namesSet.add(displayName.toLowerCase());
        list.push({ id: `ch_content_${chName}`, name: displayName, rawName: chName });
      }
    });

    return list;
  }, [dbChapters, contentChaptersMap, customChapters, editedChapterNames, deletedChapters]);

  // 4. Combine all topics for the selected chapter filtering out deleted topics
  const allTopicNames = useMemo(() => {
    if (!selectedChapter) return [];
    const rawChName = selectedChapter.rawName || selectedChapter.name;
    const chName = selectedChapter.name;

    const topicsSet = new Set();

    const targetGrade = getString(grade?.name || grade).trim().toLowerCase();
    const targetBoard = getString(board?.name || board).trim().toLowerCase();
    const targetBranch = getString(branch?.name || branch).trim().toLowerCase();
    const targetSubject = getString(subject?.name || subject).trim().toLowerCase();
    const targetType = normalizeContentType(contentType);

    // From DB options topics matching this chapter ID
    (options?.topics || []).forEach((t) => {
      // If the selected chapter is a newly created custom chapter, it has no DB topics.
      if (String(selectedChapter.id).startsWith('custom_') || String(selectedChapter.id).startsWith('ch_content_')) {
        return;
      }

      // Match strictly by DB chapter ID
      const matchId = selectedChapter.id && String(t.chapterId) === String(selectedChapter.id);
      
      if (matchId) {
        const rawTopName = getString(t.name);
        const displayTopName = editedTopicNames[rawTopName] || rawTopName;
        if (displayTopName && !deletedTopics.has(rawTopName) && !deletedTopics.has(displayTopName)) {
          topicsSet.add(displayTopName);
        }
      }
    });

    // From content map
    const contentTopicsMap = contentChaptersMap[chName] || contentChaptersMap[rawChName] || {};
    Object.keys(contentTopicsMap).forEach((topName) => {
      const displayTopName = editedTopicNames[topName] || topName;
      if (displayTopName && !deletedTopics.has(topName) && !deletedTopics.has(displayTopName)) {
        topicsSet.add(displayTopName);
      }
    });

    // From custom topics created for this chapter
    const customList = customTopics[chName] || customTopics[rawChName] || [];
    customList.forEach((topName) => {
      const displayTopName = editedTopicNames[topName] || topName;
      if (displayTopName && !deletedTopics.has(topName) && !deletedTopics.has(displayTopName)) {
        topicsSet.add(displayTopName);
      }
    });

    return Array.from(topicsSet);
  }, [selectedChapter, options.topics, contentChaptersMap, customTopics, editedTopicNames, deletedTopics]);

  const [orderedChapters, setOrderedChapters] = useState([]);
  const [draggedChapterIndex, setDraggedChapterIndex] = useState(null);

  const [orderedTopics, setOrderedTopics] = useState([]);
  const [draggedTopicIndex, setDraggedTopicIndex] = useState(null);

  useEffect(() => {
    setOrderedChapters(allChaptersList);
  }, [allChaptersList]);

  useEffect(() => {
    setOrderedTopics(allTopicNames);
  }, [allTopicNames]);

  const handleDragStartChapter = (e, index) => {
    setDraggedChapterIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOverChapter = (e, index) => {
    e.preventDefault();
  };
  const handleDropChapter = (e, dropIndex) => {
    e.preventDefault();
    if (draggedChapterIndex === null || draggedChapterIndex === dropIndex) return;
    setOrderedChapters((prev) => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedChapterIndex, 1);
      copy.splice(dropIndex, 0, draggedItem);
      return copy;
    });
    setDraggedChapterIndex(null);
  };
  const handleDragEndChapter = () => setDraggedChapterIndex(null);

  const handleDragStartTopic = (e, index) => {
    setDraggedTopicIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOverTopic = (e, index) => {
    e.preventDefault();
  };
  const handleDropTopic = (e, dropIndex) => {
    e.preventDefault();
    if (draggedTopicIndex === null || draggedTopicIndex === dropIndex) return;
    setOrderedTopics((prev) => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedTopicIndex, 1);
      copy.splice(dropIndex, 0, draggedItem);
      return copy;
    });
    setDraggedTopicIndex(null);
  };
  const handleDragEndTopic = () => setDraggedTopicIndex(null);

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!newChapterName.trim()) {
      toast.error(`Please enter a ${displayContentType.toLowerCase()} name`);
      return;
    }
    const name = newChapterName.trim();
    if (allChaptersList.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error(`${displayContentType} with this name already exists`);
      return;
    }

    // INSTANT UI update
    setCustomChapters((prev) => [...prev, name]);
    setDeletedChapters((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
    toast.success(`${displayContentType} "${name}" created!`);
    setNewChapterName('');
    setShowCreateChapterModal(false);

    try {
      setIsCreatingChapter(true);
      const dbSub = (options?.subjects || []).find((s) => getString(s.name).trim().toLowerCase() === getString(subject?.name || subject).trim().toLowerCase());
      const subIdNum = parseNumericId(subject?.id) || parseNumericId(dbSub?.id);
      const targetType = normalizeContentType(contentType);
      const matchCt = (options?.contentTypes || []).find((ct) => normalizeContentType(ct.name) === targetType);

      const chapterPayload = {
        name,
        gradeName: getString(grade?.name || grade),
        boardName: getString(board?.name || board),
        branchName: getString(branch?.name || branch),
        subjectName: getString(subject?.name || subject),
        contentTypeName: matchCt?.name || contentType,
      };

      if (subIdNum) chapterPayload.subjectId = subIdNum;
      if (parseNumericId(board?.id)) chapterPayload.boardId = parseNumericId(board.id);
      if (parseNumericId(grade?.id)) chapterPayload.gradeId = parseNumericId(grade.id);
      if (parseNumericId(branch?.id)) chapterPayload.branchId = parseNumericId(branch.id);
      if (matchCt?.id) chapterPayload.contentTypeId = matchCt.id;

      await entityService.addChapter(chapterPayload);
      if (refetchOptions) await refetchOptions();
    } catch (err) {
      console.error('Failed to add chapter to DB:', err);
    } finally {
      setIsCreatingChapter(false);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) {
      toast.error('Please enter a topic name');
      return;
    }
    if (!selectedChapter) return;

    const chName = selectedChapter.name;
    const topName = newTopicName.trim();

    if (allTopicNames.some((t) => t.toLowerCase() === topName.toLowerCase())) {
      toast.error('Topic with this name already exists in this chapter');
      return;
    }

    // INSTANT UI update
    setCustomTopics((prev) => ({
      ...prev,
      [chName]: [...(prev[chName] || []), topName],
    }));
    setDeletedTopics((prev) => {
      const next = new Set(prev);
      next.delete(topName);
      return next;
    });
    toast.success(`Topic "${topName}" created under ${chName}!`);
    setNewTopicName('');
    setShowCreateTopicModal(false);

    try {
      setIsCreatingTopic(true);
      const dbCh = (options?.chapters || []).find((c) => getString(c.name || c.title).trim().toLowerCase() === chName.trim().toLowerCase());
      const chapterIdNum = parseNumericId(selectedChapter?.id) || parseNumericId(dbCh?.id);

      const topicPayload = {
        name: topName,
        chapterName: chName,
        subjectName: getString(subject?.name || subject),
        boardName: getString(board?.name || board),
        gradeName: getString(grade?.name || grade),
        branchName: getString(branch?.name || branch),
      };

      if (chapterIdNum) {
        topicPayload.chapterId = chapterIdNum;
      }

      await entityService.addTopic(topicPayload);
      if (refetchOptions) await refetchOptions();
    } catch (err) {
      console.error('Failed to add topic to DB:', err);
    } finally {
      setIsCreatingTopic(false);
    }
  };

  const findChapterId = (chItem) => {
    if (typeof chItem === 'object' && chItem !== null) {
      const numId = parseNumericId(chItem.id);
      if (numId) return numId;
    }
    const nameStr = typeof chItem === 'object' ? (chItem.rawName || chItem.name) : String(chItem || '');
    if (!nameStr) return undefined;

    const found = (options?.chapters || []).find((c) => {
      const cName = getString(c.name || c.title || c.chapterName || c).trim().toLowerCase();
      return cName === nameStr.trim().toLowerCase();
    });

    return parseNumericId(found?.id);
  };

  const findTopicId = (topicItem) => {
    if (typeof topicItem === 'object' && topicItem !== null) {
      const numId = parseNumericId(topicItem.id);
      if (numId) return numId;
    }
    const nameStr = typeof topicItem === 'object' ? (topicItem.rawName || topicItem.name) : String(topicItem || '');
    if (!nameStr) return undefined;

    const found = (options?.topics || []).find((t) => {
      const tName = getString(t.name || t.title || t.topicName || t).trim().toLowerCase();
      return tName === nameStr.trim().toLowerCase();
    });

    return parseNumericId(found?.id);
  };

  // Chapter & Topic Action Handlers (Edit & Delete)
  const handleOpenEditTopicModal = (topicItem) => {
    const topicName = typeof topicItem === 'object' ? (topicItem.name || topicItem.title) : String(topicItem || '');
    setEditModalItem({ type: 'topic', name: topicName, item: topicItem });
    setEditNameInput(topicName);
  };

  const handleOpenEditChapterModal = (chItem) => {
    const chapterName = typeof chItem === 'object' ? (chItem.name || chItem.rawName) : String(chItem || '');
    setEditModalItem({ type: 'chapter', name: chapterName, item: chItem });
    setEditNameInput(chapterName);
  };

  const handleSaveEditItem = async (e) => {
    e.preventDefault();
    if (!editNameInput.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const trimmed = editNameInput.trim();
    const { type, name, item } = editModalItem;

    // INSTANT UI update
    if (type === 'topic') {
      setEditedTopicNames((prev) => ({ ...prev, [name]: trimmed }));
      toast.success(`Topic renamed to "${trimmed}"`);
    } else if (type === 'chapter') {
      setEditedChapterNames((prev) => ({ ...prev, [name]: trimmed }));
      toast.success(`${displayContentType} renamed to "${trimmed}"`);
    }

    setEditModalItem(null);
    setEditNameInput('');

    try {
      setIsSavingEdit(true);

      if (type === 'topic') {
        const topicIdNum = findTopicId(item || name);
        if (topicIdNum) {
          await entityService.updateTopic(topicIdNum, { name: trimmed });
        }
        if (refetchOptions) await refetchOptions();
      } else if (type === 'chapter') {
        const chapterIdNum = findChapterId(item || name);
        if (chapterIdNum) {
          await entityService.updateChapter(chapterIdNum, { name: trimmed });
        }
        if (refetchOptions) await refetchOptions();
      }
    } catch (err) {
      console.error(`Failed to update ${type} in DB:`, err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteTopic = async (topicItem) => {
    const topicName = typeof topicItem === 'object' ? (topicItem.name || topicItem.title) : String(topicItem || '');
    if (!topicName) return;

    if (window.confirm(`Are you sure you want to delete topic "${topicName}"?`)) {
      // INSTANT UI update
      setDeletedTopics((prev) => new Set([...prev, topicName]));
      toast.success(`Topic "${topicName}" deleted!`);

      try {
        const topicIdNum = findTopicId(topicItem);
        if (topicIdNum) {
          await entityService.deleteTopic(topicIdNum);
        }

        // Also delete any uploaded content assets linked to this topic in contentItems
        const matchingAssets = (contentItems || []).filter((item) => {
          const itemTop = getString(item.section).trim().toLowerCase();
          return itemTop === topicName.trim().toLowerCase();
        });

        if (matchingAssets.length > 0) {
          await Promise.all(
            matchingAssets.map((asset) => {
              if (asset.id) {
                return contentService.deleteAsset(asset.id).catch(() => {});
              }
              return Promise.resolve();
            })
          );
        }

        if (refetchOptions) await refetchOptions();
      } catch (err) {
        console.error('Failed to delete topic from DB:', err);
      }
    }
  };

  const handleDeleteChapter = async (chItem) => {
    const chapterName = typeof chItem === 'object' ? (chItem.name || chItem.rawName) : String(chItem || '');
    if (!chapterName) return;

    if (window.confirm(`Are you sure you want to delete ${displayContentType.toLowerCase()} "${chapterName}"?`)) {
      const rawName = typeof chItem === 'object' ? (chItem.rawName || chItem.name) : chapterName;

      // INSTANT UI update
      setDeletedChapters((prev) => new Set([...prev, chapterName, rawName]));
      if (selectedChapter && (selectedChapter.name === chapterName || selectedChapter.rawName === chapterName || selectedChapter.name === rawName)) {
        setSelectedChapter(null);
      }
      toast.success(`${displayContentType} "${chapterName}" deleted!`);

      try {
        const chapterIdNum = findChapterId(chItem);
        if (chapterIdNum) {
          await entityService.deleteChapter(chapterIdNum);
        }

        // Also delete any uploaded content assets linked to this chapter in contentItems
        const matchingAssets = (contentItems || []).filter((item) => {
          const itemCh = getString(item.chapter).trim().toLowerCase();
          return itemCh === chapterName.trim().toLowerCase() || (rawName && itemCh === rawName.trim().toLowerCase());
        });

        if (matchingAssets.length > 0) {
          await Promise.all(
            matchingAssets.map((asset) => {
              if (asset.id) {
                return contentService.deleteAsset(asset.id).catch(() => {});
              }
              return Promise.resolve();
            })
          );
        }

        if (refetchOptions) await refetchOptions();
      } catch (err) {
        console.error('Failed to delete chapter from DB:', err);
      }
    }
  };

  // Render Level 2: Topics View for Selected Chapter
  if (selectedChapter) {
    const chName = selectedChapter.name;

    return (
      <div className="topics-level-view">
        {/* Top Bar with Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
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
                border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                background: 'var(--color-card, #ffffff)',
                color: 'var(--color-text-primary, #111827)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <HiOutlineArrowLeft />
              Back to {displayContentType}s
            </button>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: 'var(--color-text-primary, #111827)' }}>
                {displayContentType}: {chName}
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
          <div style={{ overflowX: 'auto', background: 'var(--color-card, #ffffff)', borderRadius: '8px', border: '1px solid var(--color-border, #e5e7eb)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid var(--color-border, #e5e7eb)' }}>
                <tr>
                  <th style={{ width: '40px', padding: '14px 10px', textAlign: 'center' }}></th>
                  <th style={{ padding: '14px 20px', color: 'var(--color-text-secondary, #6b7280)', fontWeight: '600', fontSize: '13px' }}>S.No</th>
                  <th style={{ padding: '14px 20px', color: 'var(--color-text-secondary, #6b7280)', fontWeight: '600', fontSize: '13px' }}>Topic Name</th>
                  <th style={{ padding: '14px 20px', color: 'var(--color-text-secondary, #6b7280)', fontWeight: '600', fontSize: '13px' }}>Resources</th>
                  <th style={{ padding: '14px 20px', color: 'var(--color-text-secondary, #6b7280)', fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderedTopics.map((topName, idx) => {
                  const topicItems = contentChaptersMap[chName]?.[topName] || [];
                  const notesCount = topicItems.filter((i) => i.type === 'notes' || i.type === 'pdf' || i.type === 'document').length;
                  const videosCount = topicItems.filter((i) => i.type === 'video' || i.type === 'url' || i.type === 'link').length;
                  const isBeingDragged = draggedTopicIndex === idx;

                  return (
                    <tr
                      key={topName}
                      draggable
                      onDragStart={(e) => handleDragStartTopic(e, idx)}
                      onDragOver={(e) => handleDragOverTopic(e, idx)}
                      onDrop={(e) => handleDropTopic(e, idx)}
                      onDragEnd={handleDragEndTopic}
                      onClick={() => onSelectTopic(selectedChapter, { name: topName })}
                      style={{ 
                        borderBottom: '1px solid var(--color-border, #e5e7eb)', 
                        cursor: isBeingDragged ? 'grab' : 'pointer', 
                        transition: 'background 0.2s, opacity 0.2s',
                        background: isBeingDragged ? 'rgba(102, 83, 175, 0.05)' : 'transparent',
                        opacity: isBeingDragged ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => !isBeingDragged && (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => !isBeingDragged && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '16px 10px', textAlign: 'center', color: 'var(--color-text-muted, #9ca3af)' }}>
                        <div style={{ cursor: 'grab', display: 'inline-flex', alignItems: 'center' }} title="Drag to reorder topic" onClick={(e) => e.stopPropagation()}>
                          <HiOutlineSelector size={20} />
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155' }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                        {topName}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HiOutlineDocumentText size={15} style={{ color: '#4f46e5' }} /> {notesCount} Notes
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HiOutlineVideoCamera size={15} style={{ color: '#ec4899' }} /> {videosCount} Videos
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditTopicModal(topName);
                            }}
                            style={{
                              background: 'transparent',
                              color: 'var(--color-primary, #6653AF)',
                              border: 'none',
                              padding: '6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            title="Edit Topic"
                          >
                            <HiOutlinePencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTopic(topName);
                            }}
                            style={{
                              background: 'transparent',
                              color: '#ef4444',
                              border: 'none',
                              padding: '6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            title="Delete Topic"
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTopic(selectedChapter, { name: topName });
                            }}
                            style={{
                              background: 'var(--color-primary, #6653AF)',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                            }}
                          >
                            Open
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
          <div
            onClick={() => setShowCreateTopicModal(true)}
            style={{
              border: '2px dashed var(--color-border, var(--color-border, #e5e7eb))',
              borderRadius: '16px',
              padding: '50px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--color-card, #ffffff)',
            }}
          >
            <HiOutlinePlus size={40} style={{ color: 'var(--color-primary, #6653AF)', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>No Topics Created Yet</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>
              Click here to create a topic under {displayContentType} "{chName}".
            </p>
          </div>
        )}

        {/* Modal for Creating Topic */}
        {showCreateTopicModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Create Topic Card</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateTopicModal(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary, #6b7280)' }}
                >
                  <HiOutlineX size={20} />
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
                Add a new topic under {displayContentType}: {chName}
              </p>

              <form onSubmit={handleAddTopic}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Topic Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electric Lines of Force"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                    fontSize: '14px',
                    marginBottom: '20px',
                  }}
                  autoFocus
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateTopicModal(false)}
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
                    disabled={isCreatingTopic}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--color-primary, #6653AF)',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: isCreatingTopic ? 'not-allowed' : 'pointer',
                      opacity: isCreatingTopic ? 0.7 : 1,
                    }}
                  >
                    {isCreatingTopic ? 'Creating...' : 'Create Topic'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Editing Chapter / Topic */}
        {editModalItem && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                  Edit {editModalItem.type === 'topic' ? 'Topic' : displayContentType} Name
                </h3>
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary, #6b7280)' }}
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEditItem}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  {editModalItem.type === 'topic' ? 'Topic' : displayContentType} Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                    fontSize: '14px',
                    marginBottom: '20px',
                  }}
                  autoFocus
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setEditModalItem(null)}
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
  }

  // Render Level 1: Chapters View
  return (
    <div className="chapters-level-view">
      {/* Top Header & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBackToSubjects && (
            <button
              type="button"
              onClick={onBackToSubjects}
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
              Back to Subjects
            </button>
          )}

          <div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)' }}>
              {getString(subject?.name || subject)} &bull; {contentType}
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '2px 0 0 0', color: 'var(--color-text-primary, #111827)' }}>
              {displayContentType}s ({allChaptersList.length})
            </h2>
          </div>
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
          Create {displayContentType}
        </button>
      </div>

      {/* Chapters Grid */}
      {allChaptersList.length > 0 ? (
        <div style={{ overflowX: 'auto', background: 'var(--color-card, #ffffff)', borderRadius: '8px', border: '1px solid var(--color-border, #e5e7eb)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid var(--color-border, #e5e7eb)' }}>
              <tr>
                <th style={{ width: '40px', padding: '14px 10px', textAlign: 'center' }}></th>
                <th style={{ padding: '14px 20px', color: 'var(--color-text-secondary, #6b7280)', fontWeight: '600', fontSize: '13px' }}>S.No</th>
                <th style={{ padding: '14px 20px', color: 'var(--color-text-secondary, #6b7280)', fontWeight: '600', fontSize: '13px' }}>{displayContentType} Name</th>
                <th style={{ padding: '14px 20px', color: 'var(--color-text-secondary, #6b7280)', fontWeight: '600', fontSize: '13px' }}>Topics Count</th>
                <th style={{ padding: '14px 20px', color: 'var(--color-text-secondary, #6b7280)', fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderedChapters.map((ch, idx) => {
                const chName = ch.name;
                const rawChName = ch.rawName || chName;

                const apiTopicNames = Object.keys(contentChaptersMap[chName] || contentChaptersMap[rawChName] || {});
                const dbTopicNames = (options?.topics || [])
                  .filter((t) => {
                    if (ch.id && !String(ch.id).startsWith('custom_') && !String(ch.id).startsWith('ch_content_')) {
                      return String(t.chapterId) === String(ch.id);
                    }
                    return false;
                  })
                  .map((t) => t.name);
                const customTopicNames = customTopics[chName] || customTopics[rawChName] || [];

                const totalTopicsCount = new Set(
                  [...apiTopicNames, ...dbTopicNames, ...customTopicNames]
                    .map((t) => getString(editedTopicNames[t] || t)?.trim().toLowerCase())
                    .filter((t) => Boolean(t) && !deletedTopics.has(t))
                ).size;

                const isBeingDragged = draggedChapterIndex === idx;

                return (
                  <tr
                    key={ch.id || chName}
                    draggable
                    onDragStart={(e) => handleDragStartChapter(e, idx)}
                    onDragOver={(e) => handleDragOverChapter(e, idx)}
                    onDrop={(e) => handleDropChapter(e, idx)}
                    onDragEnd={handleDragEndChapter}
                    onClick={() => setSelectedChapter(ch)}
                    style={{ 
                      borderBottom: '1px solid var(--color-border, #e5e7eb)', 
                      cursor: isBeingDragged ? 'grab' : 'pointer', 
                      transition: 'background 0.2s, opacity 0.2s',
                      background: isBeingDragged ? 'rgba(102, 83, 175, 0.05)' : 'transparent',
                      opacity: isBeingDragged ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => !isBeingDragged && (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseLeave={(e) => !isBeingDragged && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '16px 10px', textAlign: 'center', color: 'var(--color-text-muted, #9ca3af)' }}>
                      <div style={{ cursor: 'grab', display: 'inline-flex', alignItems: 'center' }} title="Drag to reorder chapter" onClick={(e) => e.stopPropagation()}>
                        <HiOutlineSelector size={20} />
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                      {chName}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)' }}>
                      {totalTopicsCount} {totalTopicsCount === 1 ? 'Topic' : 'Topics'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditChapterModal(ch);
                          }}
                          style={{
                            background: 'transparent',
                            color: 'var(--color-primary, #6653AF)',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          title={`Edit ${displayContentType}`}
                        >
                          <HiOutlinePencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChapter(ch);
                          }}
                          style={{
                            background: 'transparent',
                            color: '#ef4444',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          title={`Delete ${displayContentType}`}
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedChapter(ch);
                          }}
                          style={{
                            background: 'var(--color-primary, #6653AF)',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          View Topics
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
        <div
          onClick={() => setShowCreateChapterModal(true)}
          style={{
            border: '2px dashed var(--color-border, var(--color-border, #e5e7eb))',
            borderRadius: '16px',
            padding: '50px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'var(--color-card, #ffffff)',
          }}
        >
          <HiOutlinePlus size={40} style={{ color: 'var(--color-primary, #6653AF)', marginBottom: '10px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>No {displayContentType}s Created Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>
            Click here to create a {displayContentType.toLowerCase()} under "{contentType}" for {subject.name}.
          </p>
        </div>
      )}

      {/* Modal for Creating Chapter */}
      {showCreateChapterModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Create {displayContentType}</h3>
              <button
                type="button"
                onClick={() => setShowCreateChapterModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary, #6b7280)' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
              Add a {displayContentType.toLowerCase()} under {contentType} for {subject.name}
            </p>

            <form onSubmit={handleAddChapter}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                {displayContentType} Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder={isChapterType ? "e.g. Chapter 1: Introduction to Mechanics" : "e.g. 2025 Solved Question Papers"}
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateChapterModal(false)}
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
                  disabled={isCreatingChapter}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--color-primary, #6653AF)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: isCreatingChapter ? 'not-allowed' : 'pointer',
                    opacity: isCreatingChapter ? 0.7 : 1,
                  }}
                >
                  {isCreatingChapter ? 'Creating...' : `Create ${displayContentType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Chapter / Topic */}
      {editModalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Edit {editModalItem.type === 'topic' ? 'Topic' : displayContentType} Name
              </h3>
              <button
                type="button"
                onClick={() => setEditModalItem(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary, #6b7280)' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                {editModalItem.type === 'topic' ? 'Topic' : displayContentType} Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
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

export default ChapterTopicCardWorkspace;
