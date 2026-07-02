import { useMemo, useState, useEffect, useRef } from 'react';
import {
  HiChevronRight,
  HiChevronDown,
  HiFolder,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import './contentTree.css';

const TreeNode = ({
  node,
  level = 0,
  onSelect,
  selectedNode,
  expandedNodes,
  setExpandedNodes,
}) => {
  const open =
    expandedNodes[node.id];

  const hasChildren =
    node.children?.length > 0;

  const isSelected =
    selectedNode === node.id;

  const handleClick = () => {
    onSelect(node);

    if (hasChildren) {
      setExpandedNodes((prev) => ({
        ...prev,
        [node.id]:
          !prev[node.id],
      }));
    }
  };

  return (
    <div>
      <div
        className={`tree-row ${isSelected
            ? 'active'
            : ''
          }`}
        style={{
          paddingLeft: `${level * 20
            }px`,
        }}
        onClick={
          handleClick
        }
      >
        <span className="tree-arrow">
          {hasChildren &&
            (open ? (
              <HiChevronDown />
            ) : (
              <HiChevronRight />
            ))}
        </span>

        <HiFolder className="tree-icon" />

        <span className="tree-label">
          {node.label}
        </span>
      </div>

      {open &&
        hasChildren &&
        node.children.map(
          (child) => (
            <TreeNode
              key={
                child.id
              }
              node={
                child
              }
              level={
                level + 1
              }
              onSelect={
                onSelect
              }
              selectedNode={
                selectedNode
              }
              expandedNodes={
                expandedNodes
              }
              setExpandedNodes={
                setExpandedNodes
              }
            />
          )
        )}
    </div>
  );
};

const ContentTree = ({
  filters,
  hierarchy,
  options,
  setFilters,
  setViewMode,
  setActiveTab,
}) => {
  const [
    selectedNode,
    setSelectedNode,
  ] = useState(null);
  const [
    expandedNodes,
    setExpandedNodes,
  ] = useState({});
  const lastTreeClickTime = useRef(0);
  const navigate = useNavigate();

  const handleNodeSelect = (
    node
  ) => {
    lastTreeClickTime.current = Date.now();
    setSelectedNode(node.id);

    setViewMode(
      'content'
    );

    if (
      node.contentType ===
      'video' ||
      node.contentType ===
      'notes'
    ) {
      setActiveTab(
        node.contentType
      );
    }

    setFilters(
      (prev) => {
        const nextFilters = {
          ...prev,
          class: node.className || '',
          classId: node.classId || '',
          board: node.boardName || '',
          boardId: node.boardId || '',
          course: node.courseName || '',
          courseId: node.courseId || '',
          subject: node.subjectName || '',
          subjectId: node.subjectId || '',
          selectedContentType: node.selectedContentType || '',
          selectedContentTypeId: node.selectedContentTypeId || '',
          chapter: node.chapterName || '',
          chapterId: node.chapterId || '',
          section: node.sectionName || '',
          sectionId: node.sectionId || '',
          contentType: node.contentType || '',
        };
        return nextFilters;
      }
    );
  };

  
  const treeData = useMemo(() => {
    // We use options to build the full tree, filtering by filters if selected
    if (!options || !options.grades) {
      // Fallback to hierarchy based tree (which is the old logic) if options aren't provided
      if (!filters.class || !filters.board) return [];
      const selectedClass = hierarchy.find((item) => item.name === filters.class);
      if (!selectedClass) return [{ id: 'empty', label: 'No content added yet', children: [] }];
      const selectedBoard = selectedClass.boards.find((board) => board.name === filters.board);
      if (!selectedBoard) return [{ id: 'empty-board', label: 'No content added yet', children: [] }];
      const courses = filters.course
        ? selectedBoard.courses.filter((course) => course.name === filters.course)
        : selectedBoard.courses;
      // ... old logic here is not needed if we fully migrate, but let's just fully build from options!
      return [];
    }

    // Full tree from options
    let grades = options.grades || [];
    if (filters.class) grades = grades.filter((g) => g.name === filters.class);

    return grades.map((grade) => {
      const showCourse = ['11th', '12th'].includes(grade.name);

      return {
        id: `grade-${grade.id}`,
        label: grade.name,
        className: grade.name,
        classId: grade.id,
        children: (options.boards || [])
          .map((board) => {
            if (!showCourse) {
              return {
                id: `board-${board.id}`,
                label: board.name,
                className: grade.name,
                classId: grade.id,
                boardName: board.name,
                boardId: board.id,
                children: (options.subjects || [])
                  .filter((subject) => subject.gradeId === grade.id && subject.boardId === board.id)
                  .map((subject) => ({
                    id: `subject-${subject.id}`,
                    label: subject.name,
                    className: grade.name,
                    classId: grade.id,
                    boardName: board.name,
                    boardId: board.id,
                    subjectName: subject.name,
                    subjectId: subject.id,
                    children: (options.contentTypes || [])
                      .map((type) => ({
                        id: `type-${type.id}`,
                        label: type.name,
                        className: grade.name,
                        classId: grade.id,
                        boardName: board.name,
                        boardId: board.id,
                        subjectName: subject.name,
                        subjectId: subject.id,
                        selectedContentType: type.name,
                        selectedContentTypeId: type.id,
                        children: (options.chapters || [])
                          .filter(
                            (chapter) =>
                              chapter.subjectId === subject.id && chapter.contentTypeId === type.id
                          )
                          .map((chapter) => ({
                            id: `chapter-${chapter.id}`,
                            label: chapter.name,
                            className: grade.name,
                            classId: grade.id,
                            boardName: board.name,
                            boardId: board.id,
                            subjectName: subject.name,
                            subjectId: subject.id,
                            selectedContentType: type.name,
                            selectedContentTypeId: type.id,
                            chapterName: chapter.name,
                            chapterId: chapter.id,
                            children: (options.topics || [])
                              .filter((topic) => topic.chapterId === chapter.id)
                              .map((topic) => ({
                                id: `topic-${topic.id}`,
                                label: topic.name,
                                className: grade.name,
                                classId: grade.id,
                                boardName: board.name,
                                boardId: board.id,
                                subjectName: subject.name,
                                subjectId: subject.id,
                                selectedContentType: type.name,
                                selectedContentTypeId: type.id,
                                chapterName: chapter.name,
                                chapterId: chapter.id,
                                sectionName: topic.name,
                                sectionId: topic.id,
                                children: [
                                  {
                                    id: `video-${topic.id}`,
                                    label: 'Videos',
                                    contentType: 'video',
                                    className: grade.name,
                                    classId: grade.id,
                                    boardName: board.name,
                                    boardId: board.id,
                                    subjectName: subject.name,
                                    subjectId: subject.id,
                                    selectedContentType: type.name,
                                    selectedContentTypeId: type.id,
                                    chapterName: chapter.name,
                                    chapterId: chapter.id,
                                    sectionName: topic.name,
                                    sectionId: topic.id,
                                  },
                                  {
                                    id: `notes-${topic.id}`,
                                    label: 'Notes',
                                    contentType: 'notes',
                                    className: grade.name,
                                    classId: grade.id,
                                    boardName: board.name,
                                    boardId: board.id,
                                    subjectName: subject.name,
                                    subjectId: subject.id,
                                    selectedContentType: type.name,
                                    selectedContentTypeId: type.id,
                                    chapterName: chapter.name,
                                    chapterId: chapter.id,
                                    sectionName: topic.name,
                                    sectionId: topic.id,
                                  },
                                ],
                              })),
                          })),
                      }))
                      .filter((type) => type.children.length > 0),
                  })),
              };
            }

            return {
              id: `board-${board.id}`,
              label: board.name,
              className: grade.name,
              classId: grade.id,
              boardName: board.name,
              boardId: board.id,
              children: (options.branches || [])
                .map((branch) => ({
                  id: `branch-${branch.id}`,
                  label: branch.name,
                  className: grade.name,
                  classId: grade.id,
                  boardName: board.name,
                  boardId: board.id,
                  courseName: branch.name,
                  courseId: branch.id,
                  children: (options.subjects || [])
                    .filter(
                      (subject) =>
                        subject.gradeId === grade.id &&
                        subject.boardId === board.id &&
                        (subject.branchId || null) === (branch.id || null)
                    )
                    .map((subject) => ({
                      id: `subject-${subject.id}`,
                      label: subject.name,
                      className: grade.name,
                      classId: grade.id,
                      boardName: board.name,
                      boardId: board.id,
                      courseName: branch.name,
                      courseId: branch.id,
                      subjectName: subject.name,
                      subjectId: subject.id,
                      children: (options.contentTypes || [])
                        .map((type) => ({
                          id: `type-${type.id}`,
                          label: type.name,
                          className: grade.name,
                          classId: grade.id,
                          boardName: board.name,
                          boardId: board.id,
                          courseName: branch.name,
                          courseId: branch.id,
                          subjectName: subject.name,
                          subjectId: subject.id,
                          selectedContentType: type.name,
                          selectedContentTypeId: type.id,
                          children: (options.chapters || [])
                            .filter(
                              (chapter) =>
                                chapter.subjectId === subject.id && chapter.contentTypeId === type.id
                            )
                            .map((chapter) => ({
                              id: `chapter-${chapter.id}`,
                              label: chapter.name,
                              className: grade.name,
                              classId: grade.id,
                              boardName: board.name,
                              boardId: board.id,
                              courseName: branch.name,
                              courseId: branch.id,
                              subjectName: subject.name,
                              subjectId: subject.id,
                              selectedContentType: type.name,
                              selectedContentTypeId: type.id,
                              chapterName: chapter.name,
                              chapterId: chapter.id,
                              children: (options.topics || [])
                                .filter((topic) => topic.chapterId === chapter.id)
                                .map((topic) => ({
                                  id: `topic-${topic.id}`,
                                  label: topic.name,
                                  className: grade.name,
                                  classId: grade.id,
                                  boardName: board.name,
                                  boardId: board.id,
                                  courseName: branch.name,
                                  courseId: branch.id,
                                  subjectName: subject.name,
                                  subjectId: subject.id,
                                  selectedContentType: type.name,
                                  selectedContentTypeId: type.id,
                                  chapterName: chapter.name,
                                  chapterId: chapter.id,
                                  sectionName: topic.name,
                                  sectionId: topic.id,
                                  children: [
                                    {
                                      id: `video-${topic.id}`,
                                      label: 'Videos',
                                      contentType: 'video',
                                      className: grade.name,
                                      classId: grade.id,
                                      boardName: board.name,
                                      boardId: board.id,
                                      courseName: branch.name,
                                      courseId: branch.id,
                                      subjectName: subject.name,
                                      subjectId: subject.id,
                                      selectedContentType: type.name,
                                      selectedContentTypeId: type.id,
                                      chapterName: chapter.name,
                                      chapterId: chapter.id,
                                      sectionName: topic.name,
                                      sectionId: topic.id,
                                    },
                                    {
                                      id: `notes-${topic.id}`,
                                      label: 'Notes',
                                      contentType: 'notes',
                                      className: grade.name,
                                      classId: grade.id,
                                      boardName: board.name,
                                      boardId: board.id,
                                      courseName: branch.name,
                                      courseId: branch.id,
                                      subjectName: subject.name,
                                      subjectId: subject.id,
                                      selectedContentType: type.name,
                                      selectedContentTypeId: type.id,
                                      chapterName: chapter.name,
                                      chapterId: chapter.id,
                                      sectionName: topic.name,
                                      sectionId: topic.id,
                                    },
                                  ],
                                })),
                            })),
                        }))
                        .filter((type) => type.children.length > 0),
                    })),
                }))
                .filter((branch) => branch.children.length > 0),
            };
          })
          .filter((board) => board.children.length > 0),
      };
    });
  }, [filters, options]);


  useEffect(() => {
    // If the filters changed within the last 100ms of a tree click, skip auto-expand.
    // This perfectly bypasses React Strict Mode double-invocation issues.
    if (Date.now() - lastTreeClickTime.current < 100) {
      return;
    }

    const expanded = {};

    const traverse = (nodes) => {
      nodes.forEach((node) => {
        let shouldExpand = false;
        
        if (node.id.startsWith('grade-') && filters.class && filters.class === node.className) shouldExpand = true;
        if (node.id.startsWith('board-') && filters.board && filters.board === node.boardName) shouldExpand = true;
        if (node.id.startsWith('branch-') && filters.course && filters.course === node.courseName) shouldExpand = true;
        if (node.id.startsWith('subject-') && filters.subject && filters.subject === node.subjectName) shouldExpand = true;
        if (node.id.startsWith('type-') && filters.selectedContentType && filters.selectedContentType === node.selectedContentType) shouldExpand = true;
        if (node.id.startsWith('chapter-') && filters.chapter && filters.chapter === node.chapterName) shouldExpand = true;
        if (node.id.startsWith('topic-') && filters.section && filters.section === node.sectionName) shouldExpand = true;
        
        if (shouldExpand) {
          expanded[node.id] = true;
        }

        if (node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(treeData);

    setExpandedNodes(
      expanded
    );
  }, [
    filters,
    treeData,
  ]);

  return (
    <div className="content-tree">
      <div className="tree-header">
        <h3 className="tree-title">
          Content Hierarchy
        </h3>

        <button
          className="manage-hierarchy-btn"
          onClick={() => navigate('/admin/content-hierarchy')}
        >
          Manage
        </button>
      </div>

      {!filters.class && (
        <div className="tree-empty">
          Select a class
        </div>
      )}

      {filters.class &&
        !filters.board && (
          <div className="tree-empty">
            Select a board
          </div>
        )}

      {filters.class &&
        filters.board &&
        treeData.length ===
        0 && (
          <div className="tree-empty">
            No content found
          </div>
        )}

      {treeData.map(
        (node) => (
          <TreeNode
            key={node.id}
            node={node}
            onSelect={
              handleNodeSelect
            }
            selectedNode={
              selectedNode
            }
            expandedNodes={
              expandedNodes
            }
            setExpandedNodes={
              setExpandedNodes
            }
          />
        )
      )}
    </div>
  );
};

export default ContentTree;