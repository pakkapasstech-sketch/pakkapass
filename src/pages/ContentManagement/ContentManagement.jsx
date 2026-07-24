import { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import ErrorState from '../../components/loaders/ErrorState';
import { useContent } from '../../hooks/useContent';
import { useStudentFilterOptions } from '../../hooks/useStudents';
import { contentService } from '../../services/content.service';
import entityService from '../../services/entity.service';
import { useLoading } from '../../contexts/LoadingContext';
import ContentCardGrid from '../../components/content/ContentCardGrid';
import ChapterTopicCardWorkspace from '../../components/content/ChapterTopicCardWorkspace';
import TopicResourceWorkspace from '../../components/content/TopicResourceWorkspace';
import './contentManagement.css';
import { HiOutlineHome, HiOutlineChevronRight, HiOutlineX, HiOutlinePlus } from 'react-icons/hi';

const parseNumericId = (val) => {
  if (val === null || val === undefined) return undefined;
  const num = Number(val);
  return !isNaN(num) && Number.isInteger(num) && num > 0 ? num : undefined;
};

const ContentManagement = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryGradeId = searchParams.get('gradeId');
  const queryGradeName = searchParams.get('gradeName');
  const queryBoardId = searchParams.get('boardId');
  const queryBranchId = searchParams.get('branchId');
  const querySubjectId = searchParams.get('subjectId');
  const queryChapterId = searchParams.get('chapterId');
  const queryTopicName = searchParams.get('topicName');
  const queryContentType = searchParams.get('contentType');

  const { data: optionsData, refetch: refetchOptions } = useStudentFilterOptions();
  const options = optionsData || {
    grades: [],
    boards: [],
    branches: [],
    subjects: [],
    contentTypes: [],
  };

  // Selected hierarchy state
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Active Content Type Tab (Chapters | Mind Maps | PYQ | External References | Custom)
  const [activeContentType, setActiveContentType] = useState('Chapters');
  const [customContentTypes, setCustomContentTypes] = useState([]);
  const [showAddContentTypeModal, setShowAddContentTypeModal] = useState(false);
  const [newContentTypeName, setNewContentTypeName] = useState('');

  const allContentTypes = useMemo(() => {
    const dbTypes = (options.contentTypes || []).map((ct) => ct.name).filter(Boolean);
    const combined = Array.from(new Set([...dbTypes, ...customContentTypes]));
    return combined.length > 0 ? combined : ['Chapters'];
  }, [options.contentTypes, customContentTypes]);

  useEffect(() => {
    if (allContentTypes.length > 0 && !allContentTypes.includes(activeContentType) && !queryContentType) {
      setActiveContentType(allContentTypes[0]);
    }
  }, [allContentTypes, activeContentType, queryContentType]);

  // Active Topic Resource Workspace ({ chapter, topic } or null)
  const [activeTopicWorkspace, setActiveTopicWorkspace] = useState(null);

  // State for Card Management (Add / Edit / Delete)
  const [customBoards, setCustomBoards] = useState([]);
  const [customBranches, setCustomBranches] = useState([]);
  const [customSubjects, setCustomSubjects] = useState([]);

  const [editedBoards, setEditedBoards] = useState({}); // { [boardId]: newName }
  const [editedBranches, setEditedBranches] = useState({}); // { [branchId]: newName }
  const [editedSubjects, setEditedSubjects] = useState({}); // { [subjectId]: newName }

  const [deletedBoards, setDeletedBoards] = useState(new Set()); // Set of deleted board IDs/names
  const [deletedBranches, setDeletedBranches] = useState(new Set()); // Set of deleted branch IDs/names
  const [deletedSubjects, setDeletedSubjects] = useState(new Set()); // Set of deleted subject IDs/names

  // Modals state for Card Management
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const [editItemModal, setEditItemModal] = useState(null); // { type: 'board'|'branch'|'subject', item, currentName }
  const [editNameInput, setEditNameInput] = useState('');

  const { data: content = [], isLoading, isError, refetch } = useContent();

  // Reset children when parent grade changes via URL manually (not on mount)
  const [prevGradeId, setPrevGradeId] = useState(queryGradeId);
  useEffect(() => {
    if (queryGradeId && prevGradeId !== queryGradeId) {
      setSelectedBoard(null);
      setSelectedBranch(null);
      setSelectedSubject(null);
      setSelectedChapter(null);
      setActiveTopicWorkspace(null);
      setPrevGradeId(queryGradeId);
    }
  }, [queryGradeId, prevGradeId]);

  // Hydrate initial state from URL & Sync selectedGrade with URL param
  useEffect(() => {
    if (options.grades.length > 0) {
      if (queryGradeId) {
        const found = options.grades.find((g) => String(g.id) === String(queryGradeId));
        if (found) setSelectedGrade(found);
        else if (queryGradeName) setSelectedGrade({ id: queryGradeId, name: queryGradeName });
      } else if (!selectedGrade) {
        setSelectedGrade(options.grades[0]);
      }
    }
  }, [queryGradeId, queryGradeName, options.grades]);

  useEffect(() => {
    if (options.boards && queryBoardId && !selectedBoard) {
      const found = options.boards.find((b) => String(b.id) === String(queryBoardId));
      if (found) setSelectedBoard(found);
    }
  }, [queryBoardId, options.boards]);

  useEffect(() => {
    if (options.branches && queryBranchId && !selectedBranch) {
      const found = options.branches.find((b) => String(b.id) === String(queryBranchId));
      if (found) setSelectedBranch(found);
    }
  }, [queryBranchId, options.branches]);

  useEffect(() => {
    if (options.subjects && querySubjectId && !selectedSubject) {
      const found = options.subjects.find((s) => String(s.id) === String(querySubjectId));
      if (found) setSelectedSubject(found);
    }
  }, [querySubjectId, options.subjects]);

  useEffect(() => {
    if (queryContentType && queryContentType !== activeContentType) {
      setActiveContentType(queryContentType);
    }
  }, [queryContentType]);

  useEffect(() => {
    if (options.chapters && queryChapterId && !selectedChapter) {
      const found = options.chapters.find((c) => String(c.id) === String(queryChapterId));
      if (found) setSelectedChapter(found);
    }
  }, [queryChapterId, options.chapters]);

  useEffect(() => {
    if (queryTopicName && !activeTopicWorkspace) {
      setActiveTopicWorkspace({ topic: queryTopicName });
    }
  }, [queryTopicName]);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (optionsData) {
      // Small timeout to allow the hydration useEffects to run their setSelected* calls
      setTimeout(() => setIsHydrated(true), 50);
    }
  }, [optionsData]);

  // Sync state changes back to URL
  useEffect(() => {
    if (!isHydrated) return;

    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (selectedBoard?.id) newParams.set('boardId', selectedBoard.id);
      else newParams.delete('boardId');
      
      if (selectedBranch?.id) newParams.set('branchId', selectedBranch.id);
      else newParams.delete('branchId');
      
      if (selectedSubject?.id) newParams.set('subjectId', selectedSubject.id);
      else newParams.delete('subjectId');
      
      if (activeContentType) newParams.set('contentType', activeContentType);
      else newParams.delete('contentType');

      if (selectedChapter?.id) newParams.set('chapterId', selectedChapter.id);
      else newParams.delete('chapterId');

      if (activeTopicWorkspace?.topic) newParams.set('topicName', activeTopicWorkspace.topic);
      else newParams.delete('topicName');

      return newParams.toString() !== prev.toString() ? newParams : prev;
    }, { replace: true });
  }, [selectedBoard, selectedBranch, selectedSubject, activeContentType, selectedChapter, activeTopicWorkspace, setSearchParams]);

  const currentGrade = selectedGrade || options.grades[0] || { name: 'Class' };

  // Check if selected grade uses Branches (like 11th, 12th or explicitly defined in options)
  const hasBranchesForGrade = useMemo(() => {
    if (!currentGrade) return false;
    const gradeNameLower = currentGrade.name?.trim().toLowerCase() || '';
    if (gradeNameLower.includes('11') || gradeNameLower.includes('12') || gradeNameLower.includes('neet') || gradeNameLower.includes('jee')) {
      return true;
    }
    return options.branches?.some((br) =>
      (br.gradeId && String(br.gradeId) === String(currentGrade.id)) ||
      (br.grade?.name && br.grade.name.trim().toLowerCase() === gradeNameLower)
    );
  }, [currentGrade, options.branches]);

  // Filter Boards with custom added, edited, and deleted filters
  const availableBoards = useMemo(() => {
    if (!currentGrade || !options.boards) return [];

    const gradeNameLower = currentGrade.name?.trim().toLowerCase();

    const filtered = options.boards.filter((b) => {
      const matchId = (b.gradeId && String(b.gradeId) === String(currentGrade.id)) || (b.grade?.id && String(b.grade.id) === String(currentGrade.id));
      const matchName = b.grade?.name && b.grade.name.trim().toLowerCase() === gradeNameLower;
      const isGlobal = !b.gradeId && !b.grade;
      return matchId || matchName || isGlobal;
    });

    const baseList = filtered;

    const resultList = baseList
      .filter((b) => !deletedBoards.has(b.id || b.name))
      .map((b) => ({
        ...b,
        name: editedBoards[b.id || b.name] || b.name,
      }));

    const matchedCustom = customBoards.filter((cb) => {
      const matchGrade = cb.gradeId === currentGrade.id || cb.gradeName === currentGrade.name;
      return matchGrade && !deletedBoards.has(cb.id || cb.name);
    });

    const namesSet = new Set();
    const finalBoards = [];
    [...resultList, ...matchedCustom].forEach((b) => {
      const nameLower = b.name.trim().toLowerCase();
      if (!namesSet.has(nameLower)) {
        namesSet.add(nameLower);
        finalBoards.push(b);
      }
    });

    return finalBoards;
  }, [currentGrade, options.boards, deletedBoards, editedBoards, customBoards]);

  // Filter Branches with custom added, edited, and deleted filters
  const availableBranches = useMemo(() => {
    if (!selectedBoard || !hasBranchesForGrade || !options.branches) return [];

    const gradeNameLower = currentGrade.name?.trim().toLowerCase();
    const boardNameLower = selectedBoard.name?.trim().toLowerCase();

    const filtered = options.branches.filter((br) => {
      const matchBoard = (br.boardId && String(br.boardId) === String(selectedBoard.id)) || (br.board?.name && br.board.name.trim().toLowerCase() === boardNameLower) || (!br.boardId && !br.board);
      const matchGrade = (br.gradeId && String(br.gradeId) === String(currentGrade.id)) || (br.grade?.name && br.grade.name.trim().toLowerCase() === gradeNameLower) || (!br.gradeId && !br.grade);
      return matchBoard && matchGrade;
    });

    const baseList = filtered;

    const resultList = baseList
      .filter((br) => !deletedBranches.has(br.id || br.name))
      .map((br) => ({
        ...br,
        name: editedBranches[br.id || br.name] || br.name,
      }));

    const matchedCustom = customBranches.filter((cb) => {
      const matchGrade = cb.gradeId === currentGrade.id || cb.gradeName === currentGrade.name;
      const matchBoard = cb.boardId === selectedBoard.id || cb.boardName === selectedBoard.name;
      return matchGrade && matchBoard && !deletedBranches.has(cb.id || cb.name);
    });

    const namesSet = new Set();
    const finalBranches = [];
    [...resultList, ...matchedCustom].forEach((br) => {
      const nameLower = br.name.trim().toLowerCase();
      if (!namesSet.has(nameLower)) {
        namesSet.add(nameLower);
        finalBranches.push(br);
      }
    });

    return finalBranches;
  }, [selectedBoard, currentGrade, hasBranchesForGrade, options.branches, deletedBranches, editedBranches, customBranches]);

  // Filter Subjects with custom added, edited, and deleted filters
  const availableSubjects = useMemo(() => {
    if (!selectedBoard) return [];

    const gradeNameLower = currentGrade.name?.trim().toLowerCase();
    const boardNameLower = selectedBoard.name?.trim().toLowerCase();
    const branchNameLower = selectedBranch?.name?.trim().toLowerCase();

    const dbFiltered = (options.subjects || []).filter((s) => {
      const matchGrade = !s.grade?.name || s.grade.name.trim().toLowerCase() === gradeNameLower;
      const matchBoard = !s.board?.name || s.board.name.trim().toLowerCase() === boardNameLower;
      const matchBranch = !hasBranchesForGrade || !selectedBranch || !s.branch?.name || s.branch.name.trim().toLowerCase() === branchNameLower;

      return matchGrade && matchBoard && matchBranch;
    });

    const baseList = dbFiltered;

    // Filter out deleted subjects & apply name edits
    const resultList = baseList
      .filter((s) => !deletedSubjects.has(s.id || s.name))
      .map((s) => ({
        ...s,
        name: editedSubjects[s.id || s.name] || s.name,
      }));

    // Add custom subjects created for this grade, board, and branch
    const matchedCustom = customSubjects.filter((cs) => {
      const matchGrade = cs.gradeId === currentGrade.id || cs.gradeName === currentGrade.name;
      const matchBoard = cs.boardId === selectedBoard.id || cs.boardName === selectedBoard.name;
      const matchBranch = !hasBranchesForGrade || !selectedBranch || cs.branchId === selectedBranch.id || cs.branchName === selectedBranch.name;
      return matchGrade && matchBoard && matchBranch && !deletedSubjects.has(cs.id || cs.name);
    });

    // Deduplicate by name
    const namesSet = new Set();
    const finalSubjects = [];
    [...resultList, ...matchedCustom].forEach((sub) => {
      const subNameLower = sub.name.trim().toLowerCase();
      if (!namesSet.has(subNameLower)) {
        namesSet.add(subNameLower);
        finalSubjects.push(sub);
      }
    });

    return finalSubjects;
  }, [currentGrade, selectedBoard, selectedBranch, hasBranchesForGrade, options.subjects, deletedSubjects, editedSubjects, customSubjects]);

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
    setSelectedBranch(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setActiveTopicWorkspace(null);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setActiveTopicWorkspace(null);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setActiveTopicWorkspace(null);
  };

  // Card Action Handlers
  const handleOpenEditModal = (type, item) => {
    setEditItemModal({
      type,
      item,
      currentName: item.name || item.displayName || '',
    });
    setEditNameInput(item.name || item.displayName || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editNameInput.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const { type, item } = editItemModal;
    const itemId = item.id || item.name;
    const newName = editNameInput.trim();
    const numId = parseNumericId(item.id);

    // INSTANT UI update
    if (type === 'board') {
      setEditedBoards((prev) => ({ ...prev, [itemId]: newName }));
    } else if (type === 'branch') {
      setEditedBranches((prev) => ({ ...prev, [itemId]: newName }));
    } else if (type === 'subject') {
      setEditedSubjects((prev) => ({ ...prev, [itemId]: newName }));
    }

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} renamed to "${newName}"`);
    setEditItemModal(null);
    setEditNameInput('');

    try {
      if (type === 'board' && numId) {
        await entityService.updateBoard(numId, { name: newName });
      } else if (type === 'branch' && numId) {
        await entityService.updateBranch(numId, { name: newName });
      } else if (type === 'subject' && numId) {
        await entityService.updateSubject(numId, { name: newName });
      }
      if (refetchOptions) await refetchOptions();
    } catch (err) {
      console.error(`Failed to update ${type} in DB:`, err);
    }
  };

  const handleAddBoardSubmit = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) {
      toast.error('Please enter a board name');
      return;
    }

    const boardName = newBoardName.trim();
    const newBoardObj = {
      id: `custom_bd_${Date.now()}`,
      name: boardName,
      gradeId: currentGrade.id,
      gradeName: currentGrade.name,
    };

    setCustomBoards((prev) => [...prev, newBoardObj]);
    toast.success(`Board "${boardName}" added!`);
    setNewBoardName('');
    setShowAddBoardModal(false);

    try {
      await entityService.addBoard(boardName, currentGrade?.name);
      if (refetchOptions) await refetchOptions();
    } catch (err) {
      console.error('Failed to save board in DB:', err);
    }
  };

  const handleDeleteBoard = async (board) => {
    const boardName = board.name || board.displayName;
    if (window.confirm(`Are you sure you want to delete board "${boardName}"?`)) {
      const boardId = board.id || boardName;
      const numId = parseNumericId(board.id);

      setDeletedBoards((prev) => new Set([...prev, boardId]));
      toast.success(`Board "${boardName}" deleted!`);

      try {
        if (numId) {
          await entityService.deleteBoard(numId);
        }
        if (refetchOptions) await refetchOptions();
      } catch (err) {
        console.error('Failed to delete board from DB:', err);
      }
    }
  };

  const handleAddBranchSubmit = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      toast.error('Please enter a branch name');
      return;
    }

    const branchName = newBranchName.trim();
    const newBranchObj = {
      id: `custom_br_${Date.now()}`,
      name: branchName,
      gradeId: currentGrade.id,
      gradeName: currentGrade.name,
      boardId: selectedBoard?.id,
      boardName: selectedBoard?.name,
    };

    // INSTANT UI update so it appears immediately!
    setCustomBranches((prev) => [...prev, newBranchObj]);
    toast.success(`Branch "${branchName}" added!`);
    setNewBranchName('');
    setShowAddBranchModal(false);

    try {
      await entityService.addBranch(branchName, currentGrade?.name);
      if (refetchOptions) await refetchOptions();
    } catch (err) {
      console.error('Failed to save branch in DB:', err);
    }
  };

  const handleDeleteBranch = async (branch) => {
    const branchName = branch.name || branch.displayName;
    if (window.confirm(`Are you sure you want to delete branch "${branchName}"?`)) {
      const branchId = branch.id || branchName;
      const numId = parseNumericId(branch.id);

      // INSTANT UI update
      setDeletedBranches((prev) => new Set([...prev, branchId]));
      toast.success(`Branch "${branchName}" deleted!`);

      try {
        if (numId) {
          await entityService.deleteBranch(numId);
        }
        if (refetchOptions) await refetchOptions();
      } catch (err) {
        console.error('Failed to delete branch from DB:', err);
      }
    }
  };

  const handleAddSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    const subName = newSubjectName.trim();
    const newSubObj = {
      id: `custom_sub_${Date.now()}`,
      name: subName,
      gradeId: currentGrade.id,
      gradeName: currentGrade.name,
      boardId: selectedBoard?.id,
      boardName: selectedBoard?.name,
      branchId: selectedBranch?.id,
      branchName: selectedBranch?.name,
    };

    // INSTANT UI update so it appears immediately!
    setCustomSubjects((prev) => [...prev, newSubObj]);
    toast.success(`Subject "${subName}" added!`);
    setNewSubjectName('');
    setShowAddSubjectModal(false);

    try {
      const subjectPayload = {
        name: subName,
        gradeName: currentGrade?.name,
        boardName: selectedBoard?.name,
        branchName: selectedBranch?.name,
      };
      if (parseNumericId(currentGrade?.id)) subjectPayload.gradeId = parseNumericId(currentGrade.id);
      if (parseNumericId(selectedBoard?.id)) subjectPayload.boardId = parseNumericId(selectedBoard.id);
      if (parseNumericId(selectedBranch?.id)) subjectPayload.branchId = parseNumericId(selectedBranch.id);

      await entityService.addSubject(subjectPayload);
      if (refetchOptions) await refetchOptions();
    } catch (err) {
      console.error('Failed to save subject in DB:', err);
    }
  };

  const handleAddContentTypeSubmit = async (e) => {
    e.preventDefault();
    if (!newContentTypeName.trim()) {
      toast.error('Please enter a content type name');
      return;
    }
    const trimmed = newContentTypeName.trim();
    if (allContentTypes.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Content type already exists');
      return;
    }

    // INSTANT UI update
    setCustomContentTypes((prev) => [...prev, trimmed]);
    setActiveContentType(trimmed);
    setActiveTopicWorkspace(null);
    toast.success(`Content Type "${trimmed}" created!`);
    setNewContentTypeName('');
    setShowAddContentTypeModal(false);

    try {
      await entityService.addContentType(trimmed);
      if (refetchOptions) await refetchOptions();
    } catch (err) {
      console.error('Failed to add content type to DB:', err);
    }
  };

  const handleDeleteSubject = async (subject) => {
    const subName = subject.name || subject.displayName;
    if (window.confirm(`Are you sure you want to delete subject "${subName}"?`)) {
      const subId = subject.id || subName;
      const numId = parseNumericId(subject.id);

      // INSTANT UI update
      setDeletedSubjects((prev) => new Set([...prev, subId]));
      toast.success(`Subject "${subName}" deleted!`);

      try {
        if (numId) {
          await entityService.deleteSubject(numId);
        }
        if (refetchOptions) await refetchOptions();
      } catch (err) {
        console.error('Failed to delete subject from DB:', err);
      }
    }
  };

  const handleUploadContent = async (uploadData) => {
    try {
      await contentService.upload(uploadData);
      await queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload content');
      throw error;
    }
  };

  const handleUpdateAsset = async (assetId, updateData) => {
    try {
      await contentService.updateAsset(assetId, updateData);
      await queryClient.invalidateQueries({ queryKey: ['content'] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update resource');
      throw error;
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await contentService.deleteAsset(assetId);
      await queryClient.invalidateQueries({ queryKey: ['content'] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete resource');
      throw error;
    }
  };

  useEffect(() => {
    setLoading(isLoading);
    return () => setLoading(false);
  }, [isLoading, setLoading]);

  if (isError) {
    return (
      <ErrorState
        title="Error Loading Content Management"
        message="Failed to load hierarchy data. Please try again."
        onRetry={refetch}
      />
    );
  }

  const isReadyForSubjects = selectedBoard && (!hasBranchesForGrade || selectedBranch);

  return (
    <div className="content-management-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header & Breadcrumbs Navigation */}
      <div className="content-management-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Breadcrumb Navigation Chain */}
          <div className="hierarchy-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)' }}>
            <span
              onClick={() => {
                setSelectedBoard(null);
                setSelectedBranch(null);
                setSelectedSubject(null);
                setSelectedChapter(null);
                setActiveTopicWorkspace(null);
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary, #6653AF)', fontWeight: '600' }}
            >
              <HiOutlineHome /> Content
            </span>

            {currentGrade && (
              <>
                <HiOutlineChevronRight size={14} />
                <span
                  onClick={() => {
                    setSelectedBoard(null);
                    setSelectedBranch(null);
                    setSelectedSubject(null);
                    setSelectedChapter(null);
                    setActiveTopicWorkspace(null);
                  }}
                  style={{ cursor: 'pointer', fontWeight: selectedBoard ? '400' : '600', color: selectedBoard ? 'inherit' : 'var(--color-primary, #6653AF)' }}
                >
                  Grade: {currentGrade.name}
                </span>
              </>
            )}

            {selectedBoard && (
              <>
                <HiOutlineChevronRight size={14} />
                <span
                  onClick={() => {
                    setSelectedBranch(null);
                    setSelectedSubject(null);
                    setSelectedChapter(null);
                    setActiveTopicWorkspace(null);
                  }}
                  style={{ cursor: 'pointer', fontWeight: hasBranchesForGrade && selectedBranch ? '400' : '600', color: hasBranchesForGrade && selectedBranch ? 'inherit' : 'var(--color-primary, #6653AF)' }}
                >
                  Board: {selectedBoard.name}
                </span>
              </>
            )}

            {hasBranchesForGrade && selectedBranch && (
              <>
                <HiOutlineChevronRight size={14} />
                <span
                  onClick={() => {
                    setSelectedSubject(null);
                    setSelectedChapter(null);
                    setActiveTopicWorkspace(null);
                  }}
                  style={{ cursor: 'pointer', fontWeight: selectedSubject ? '400' : '600', color: selectedSubject ? 'inherit' : 'var(--color-primary, #6653AF)' }}
                >
                  Branch: {selectedBranch.name}
                </span>
              </>
            )}

            {selectedSubject && (
              <>
                <HiOutlineChevronRight size={14} />
                <span style={{ fontWeight: '700', color: 'var(--color-primary, #6653AF)' }}>
                  Subject: {selectedSubject.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* STEP 1: Boards Cards View */}
      {!selectedBoard && (
        <ContentCardGrid
          title={`Boards available in ${currentGrade.name}`}
          subtitle={`Click on a board card to view ${hasBranchesForGrade ? 'branches' : 'subjects'}`}
          items={availableBoards}
          type="board"
          onSelect={handleBoardSelect}
          onAdd={() => setShowAddBoardModal(true)}
          onEdit={(board) => handleOpenEditModal('board', board)}
        />
      )}

      {/* STEP 2: Branches Cards View (Only shown if grade has branches) */}
      {selectedBoard && hasBranchesForGrade && !selectedBranch && (
        <ContentCardGrid
          title={`Branches under ${selectedBoard.name} (${currentGrade.name})`}
          subtitle="Click on a branch card to view its subjects"
          items={availableBranches}
          type="branch"
          onSelect={handleBranchSelect}
          onBack={() => setSelectedBoard(null)}
          onAdd={() => setShowAddBranchModal(true)}
          onEdit={(branch) => handleOpenEditModal('branch', branch)}
        />
      )}

      {/* STEP 3: Subjects Cards View */}
      {isReadyForSubjects && !selectedSubject && (
        <ContentCardGrid
          title={`Subjects under ${selectedBoard.name}${selectedBranch ? ` (${selectedBranch.name})` : ''}`}
          subtitle="Click on a subject card to manage its chapters, topics, notes, and videos"
          items={availableSubjects}
          type="subject"
          onSelect={handleSubjectSelect}
          onBack={() => {
            if (selectedBranch) {
              setSelectedBranch(null);
            } else {
              setSelectedBoard(null);
            }
          }}
          onAdd={() => setShowAddSubjectModal(true)}
          onEdit={(sub) => handleOpenEditModal('subject', sub)}
          onDelete={handleDeleteSubject}
        />
      )}

      {/* STEP 4: Subject Workspace */}
      {selectedSubject && (
        <div className="subject-workspace">
          
          {/* Content Type Tabs */}
          <div className="content-type-tabs" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--color-border, #e5e7eb)', paddingBottom: '8px', overflowX: 'auto' }}>
            {allContentTypes.map((typeTab) => (
              <button
                key={typeTab}
                type="button"
                onClick={() => {
                  setActiveContentType(typeTab);
                  setActiveTopicWorkspace(null);
                  setSelectedChapter(null);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeContentType === typeTab ? 'var(--color-primary, #6653AF)' : 'transparent',
                  color: activeContentType === typeTab ? '#ffffff' : 'var(--color-text-secondary, #6b7280)',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {typeTab}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowAddContentTypeModal(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px dashed var(--color-primary, #6653AF)',
                background: 'rgba(102, 83, 175, 0.05)',
                color: 'var(--color-primary, #6653AF)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <HiOutlinePlus size={16} />
              Add Content Type
            </button>
          </div>

          {/* Render Topic Resource Workspace if a topic is clicked */}
          {activeTopicWorkspace ? (
            <TopicResourceWorkspace
              topic={activeTopicWorkspace.topic}
              chapter={activeTopicWorkspace.chapter}
              subject={selectedSubject}
              branch={selectedBranch || { name: 'General', id: '' }}
              board={selectedBoard}
              grade={currentGrade}
              contentType={activeContentType}
              contentItems={content}
              options={options}
              onUpload={handleUploadContent}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
              onBackToTopics={() => setActiveTopicWorkspace(null)}
            />
          ) : (
            /* Render Chapter & Topic Cards Manager */
            <ChapterTopicCardWorkspace
              subject={selectedSubject}
              branch={selectedBranch || { name: 'General', id: '' }}
              board={selectedBoard}
              grade={currentGrade}
              contentType={activeContentType}
              contentItems={content}
              options={options}
              selectedChapter={selectedChapter}
              onSelectChapter={setSelectedChapter}
              refetchOptions={refetchOptions}
              onBackToSubjects={() => {
                setSelectedSubject(null);
                setSelectedChapter(null);
              }}
              onSelectTopic={(ch, top) => {
                setSelectedChapter(ch);
                setActiveTopicWorkspace({ chapter: ch, topic: top });
              }}
            />
          )}
        </div>
      )}

      {/* Modal for Adding Board */}
      {showAddBoardModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Add New Board Card</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddBoardModal(false);
                  setNewBoardName('');
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
              Create a new board under {currentGrade?.name}
            </p>

            <form onSubmit={handleAddBoardSubmit}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Board Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CBSE, ICSE, State Board..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
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
                    setShowAddBoardModal(false);
                    setNewBoardName('');
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
                  Add Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding Branch */}
      {showAddBranchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Add New Branch Card</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddBranchModal(false);
                  setNewBranchName('');
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
              Create a new branch under {selectedBoard?.name} ({currentGrade?.name})
            </p>

            <form onSubmit={handleAddBranchSubmit}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Branch Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Science, Commerce, Arts, NEET, JEE..."
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
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
                    setShowAddBranchModal(false);
                    setNewBranchName('');
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
                  Add Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding Content Type */}
      {showAddContentTypeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Create Content Type</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddContentTypeModal(false);
                  setNewContentTypeName('');
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
              Add a new content category tab under {selectedSubject?.name}
            </p>

            <form onSubmit={handleAddContentTypeSubmit}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Content Type Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Formula Sheets, Mock Tests..."
                value={newContentTypeName}
                onChange={(e) => setNewContentTypeName(e.target.value)}
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
                    setShowAddContentTypeModal(false);
                    setNewContentTypeName('');
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
                  Create Content Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding Subject */}
      {showAddSubjectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Add New Subject Card</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddSubjectModal(false);
                  setNewSubjectName('');
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
              Create a new subject under {selectedBoard?.name} {selectedBranch ? `(${selectedBranch.name})` : ''}
            </p>

            <form onSubmit={handleAddSubjectSubmit}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Subject Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Physics, Chemistry, Biology..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
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
                    setShowAddSubjectModal(false);
                    setNewSubjectName('');
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
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Board, Branch, or Subject Name */}
      {editItemModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--color-card, #ffffff)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Edit {editItemModal.type.charAt(0).toUpperCase() + editItemModal.type.slice(1)} Name
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditItemModal(null);
                  setEditNameInput('');
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                {editItemModal.type.charAt(0).toUpperCase() + editItemModal.type.slice(1)} Name <span style={{ color: '#ef4444' }}>*</span>
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
                  onClick={() => {
                    setEditItemModal(null);
                    setEditNameInput('');
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContentManagement;
