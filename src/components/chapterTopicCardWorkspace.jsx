import { useState, useMemo } from 'react';
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
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import entityService from '../services/entity.service';
import contentService from '../services/content.service';

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

const sortByDatabaseOrder = (list) => {
  return [...list].sort((a, b) => {
    const orderA = Number(a.order ?? a.orderIndex ?? a.position ?? 999999);
    const orderB = Number(b.order ?? b.orderIndex ?? b.position ?? 999999);
    return orderA - orderB;
  });
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

    const orderA = orderMap.has(keyA) ? orderMap.get(keyA) : Number(a.order ?? a.orderIndex ?? a.position ?? 999999);
    const orderB = orderMap.has(keyB) ? orderMap.get(keyB) : Number(b.order ?? b.orderIndex ?? b.position ?? 999999);

    return orderA - orderB;
  });
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

  const selectedChapter = propSelectedChapter !== undefined ? propSelectedChapter : internalSelectedChapter;
  const setSelectedChapter = (val) => {
    const handleDropChapter = async (e, dropIndex) => {
      e.preventDefault();
      if (draggedChapterIndex === null || draggedChapterIndex === dropIndex) return;

      let updatedList = [];
      setOrderedChapters((prev) => {
        const copy = [...prev];
        const [draggedItem] = copy.splice(draggedChapterIndex, 1);
        copy.splice(dropIndex, 0, draggedItem);
        updatedList = copy;
        return copy;
      });
      setDraggedChapterIndex(null);

      // Save order globally to PostgreSQL Database via API
      try {
        await Promise.all(
          updatedList.map((ch, idx) => {
            const numId = findChapterId(ch);
            if (numId) {
              return entityService.updateChapter(numId, { order: idx + 1 }).catch(() => {});
            }
            return Promise.resolve();
          })
        );
        if (refetchOptions) refetchOptions();
      } catch (err) {
        console.error('Failed to update chapter order in DB:', err);
      }
    };
    const handleDragEndChapter = () => setDraggedChapterIndex(null);

    const handleDragStartTopic = (e, index) => {
      setDraggedTopicIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    };
    const handleDragOverTopic = (e, index) => {
      e.preventDefault();
    };
    const handleDropTopic = async (e, dropIndex) => {
      e.preventDefault();
      if (draggedTopicIndex === null || draggedTopicIndex === dropIndex) return;

      let updatedList = [];
      setOrderedTopics((prev) => {
        const copy = [...prev];
        const [draggedItem] = copy.splice(draggedTopicIndex, 1);
        copy.splice(dropIndex, 0, draggedItem);
        updatedList = copy;
        return copy;
      });
      setDraggedTopicIndex(null);

      // Save order globally to PostgreSQL Database via API
      try {
        await Promise.all(
          updatedList.map((topName, idx) => {
            const numId = findTopicId(topName);
            if (numId) {
              return entityService.updateTopic(numId, { order: idx + 1 }).catch(() => {});
            }
            return Promise.resolve();
          })
        );
        if (refetchOptions) refetchOptions();
      } catch (err) {
        console.error('Failed to update topic order in DB:', err);
      }
    };
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

    // Add custom created chapters AT THE LAST (Newly added chapters should be in the last)
    customChapters.forEach((chName) => {
      const displayName = editedChapterNames[chName] || chName;
      if (displayName && !deletedChapters.has(chName) && !deletedChapters.has(displayName) && !namesSet.has(displayName.toLowerCase())) {
        namesSet.add(displayName.toLowerCase());
        list.push({ id: `custom_ch_${chName}`, name: displayName, rawName: chName, order: 999999 });
      }
    });

    // Sort chapters with saved drag-and-drop order (new items stay at the LAST)
    const storageKey = `pakka_chapter_order_${getString(subject?.name || subject)}_${getString(contentType?.name || contentType)}`;
    try {
      const savedOrderRaw = localStorage.getItem(storageKey);
      if (savedOrderRaw) {
        const savedOrder = JSON.parse(savedOrderRaw);
        return sortWithSavedOrder(list, savedOrder, (item) => item.rawName || item.name);
      }
    } catch (e) {
      console.error(e);
    }

    return sortByDatabaseOrder(list);
  }, [dbChapters, contentChaptersMap, customChapters, editedChapterNames, deletedChapters, subject, contentType]);

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

    // From custom topics created for this chapter AT THE LAST
    const customList = customTopics[chName] || customTopics[rawChName] || [];
    customList.forEach((topName) => {
      const displayTopName = editedTopicNames[topName] || topName;
      if (displayTopName && !deletedTopics.has(topName) && !deletedTopics.has(displayTopName) && !topicsSet.has(displayTopName.toLowerCase())) {
        topicsSet.add(displayTopName);
      }
    });

    const topicList = Array.from(topicsSet);

    // Sort topics with saved drag-and-drop order (new items stay at the LAST)
    const storageKey = `pakka_topic_order_${chName}`;
    try {
      const savedOrderRaw = localStorage.getItem(storageKey);
      if (savedOrderRaw) {
        const savedOrder = JSON.parse(savedOrderRaw);
        return sortWithSavedOrder(topicList, savedOrder, (item) => item);
      }
    } catch (e) {
      console.error(e);
    }

    return topicList;
  }, [selectedChapter, options.topics, contentChaptersMap, customTopics, editedTopicNames, deletedTopics]);

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!newChapterName.trim()) {
      toast.error('Please enter a chapter name');
      return;
    }
    const name = newChapterName.trim();
    if (allChaptersList.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Chapter with this name already exists');
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
                {getString(subject?.name || subject)} &bull; {contentType}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
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
                            flexShrink: 0,
                          }}
                        >
                          <HiOutlineBookOpen size={22} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary, #6b7280)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Topic Card
                          </span>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: 'var(--color-text-primary, #111827)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {topName}
                          </h3>
                        </div>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditTopicModal(topName);
                          }}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border, #e5e7eb)',
                            background: '#ffffff',
                            color: 'var(--color-primary, #6653AF)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Edit Topic Name"
                        >
                          <HiOutlinePencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTopic(topName);
                          }}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Delete Topic"
                        >
                          <HiOutlineTrash size={15} />
                        </button>
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

                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary, #6653AF)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <HiOutlinePlus size={14} /> Add Content &rarr;
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
              padding: '50px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--color-card, #ffffff)',
            }}
          >
            <HiOutlinePlus size={40} style={{ color: 'var(--color-primary, #6653AF)', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>No Topics Created Yet</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>
              Click here to create a topic under chapter "{chName}".
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
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
                >
                  <HiOutlineX size={20} />
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
                Add a new topic card under Chapter: {chName}
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
                    border: '1px solid var(--color-border, #d1d5db)',
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
                  Edit {editModalItem.type === 'topic' ? 'Topic' : 'Chapter'} Name
                </h3>
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEditItem}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  {editModalItem.type === 'topic' ? 'Topic' : 'Chapter'} Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
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
                    onClick={() => setEditModalItem(null)}
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
                border: '1px solid var(--color-border, #e5e7eb)',
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
              Chapters ({allChaptersList.length})
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
          Create Chapter
        </button>
      </div>

      {/* Chapters Grid */}
      {allChaptersList.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {allChaptersList.map((ch) => {
            const chName = ch.name;
            const rawChName = ch.rawName || chName;

            const apiTopicNames = Object.keys(contentChaptersMap[chName] || contentChaptersMap[rawChName] || {});
            const dbTopicNames = (options?.topics || [])
              .filter((t) => {
                // Only match by chapter ID if chapter has a DB ID
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
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
                          flexShrink: 0,
                        }}
                      >
                        <HiOutlineFolder size={24} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary, #6b7280)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Chapter Card
                        </span>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--color-text-primary, #111827)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {chName}
                        </h3>
                      </div>
                    </div>

                    {/* Edit & Delete Action Buttons for Chapter */}
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditChapterModal(rawChName);
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border, #e5e7eb)',
                          background: '#ffffff',
                          color: 'var(--color-primary, #6653AF)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Edit Chapter Name"
                      >
                        <HiOutlinePencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChapter(rawChName);
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Delete Chapter"
                      >
                        <HiOutlineTrash size={15} />
                      </button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Create Chapter Card</h3>
              <button
                type="button"
                onClick={() => setShowCreateChapterModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>
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
                  onClick={() => setShowCreateChapterModal(false)}
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
                  {isCreatingChapter ? 'Creating...' : 'Create Chapter'}
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
                Edit {editModalItem.type === 'topic' ? 'Topic' : 'Chapter'} Name
              </h3>
              <button
                type="button"
                onClick={() => setEditModalItem(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                {editModalItem.type === 'topic' ? 'Topic' : 'Chapter'} Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
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
                  onClick={() => setEditModalItem(null)}
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
