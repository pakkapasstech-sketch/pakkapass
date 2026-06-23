import { useMemo, useState, useEffect } from 'react';
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
        className={`tree-row ${
          isSelected
            ? 'active'
            : ''
        }`}
        style={{
          paddingLeft: `${
            level * 20
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
  setFilters,
  setViewMode,
  setActiveTab,
}) => {
  const [
    selectedNode,
    setSelectedNode,
  ] = useState(null);
  const navigate = useNavigate();
  const [
    expandedNodes,
    setExpandedNodes,
  ] = useState({});

  const handleNodeSelect = (
    node
  ) => {
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
      (prev) => ({
        ...prev,

        class:
          node.className ||
          prev.class,

        board:
          node.boardName ||
          prev.board,

        course:
          node.courseName ||
          prev.course,

        subject:
          node.subjectName ||
          prev.subject,

        selectedContentType:
          node.selectedContentType ||
          prev.selectedContentType,

        chapter:
          node.chapterName ||
          prev.chapter,

        section:
          node.sectionName ||
          prev.section,

        contentType:
          node.contentType ||
          prev.contentType,
      })
    );
  };

  const treeData =
    useMemo(() => {
      if (
        !filters.class ||
        !filters.board
      ) {
        return [];
      }

      const selectedClass =
        hierarchy.find(
          (item) =>
            item.name ===
            filters.class
        );

      if (
        !selectedClass
      ) {
        return [
          {
            id: 'empty',
            label:
              'No content added yet',
            children:
              [],
          },
        ];
      }

      const selectedBoard =
        selectedClass.boards.find(
          (board) =>
            board.name ===
            filters.board
        );

      if (
        !selectedBoard
      ) {
        return [
          {
            id:
              'empty-board',
            label:
              'No content added yet',
            children:
              [],
          },
        ];
      }

      const courses =
        filters.course
          ? selectedBoard.courses.filter(
              (
                course
              ) =>
                course.name ===
                filters.course
            )
          : selectedBoard.courses;

      return courses.map(
        (course) => ({
          id: `course-${course.id}`,
          label:
            course.name,

          className:
            filters.class,

          boardName:
            filters.board,

          courseName:
            course.name,

          children:
            course.subjects.map(
              (
                subject
              ) => ({
                id: `subject-${subject.id}`,
                label:
                  subject.name,

                className:
                  filters.class,

                boardName:
                  filters.board,

                courseName:
                  course.name,

                subjectName:
                  subject.name,

                children:
                  subject.contentTypes.map(
                    (
                      type
                    ) => ({
                      id: `type-${type.id}`,

                      label:
                        type.name,

                      className:
                        filters.class,

                      boardName:
                        filters.board,

                      courseName:
                        course.name,

                      subjectName:
                        subject.name,

                      selectedContentType:
                        type.name,

                      children:
                        type.chapters.map(
                          (
                            chapter
                          ) => ({
                            id: `chapter-${chapter.id}`,

                            label:
                              chapter.name,

                            className:
                              filters.class,

                            boardName:
                              filters.board,

                            courseName:
                              course.name,

                            subjectName:
                              subject.name,

                            selectedContentType:
                              type.name,

                            chapterName:
                              chapter.name,

                            children:
                              chapter.sections.map(
                                (
                                  section
                                ) => ({
                                  id: `section-${section.id}`,

                                  label:
                                    section.name,

                                  className:
                                    filters.class,

                                  boardName:
                                    filters.board,

                                  courseName:
                                    course.name,

                                  subjectName:
                                    subject.name,

                                  selectedContentType:
                                    type.name,

                                  chapterName:
                                    chapter.name,

                                  sectionName:
                                    section.name,

                                  children:
                                    [
                                      {
                                        id: `video-${section.id}`,

                                        label:
                                          'Videos',

                                        contentType:
                                          'video',

                                        className:
                                          filters.class,

                                        boardName:
                                          filters.board,

                                        courseName:
                                          course.name,

                                        subjectName:
                                          subject.name,

                                        selectedContentType:
                                          type.name,

                                        chapterName:
                                          chapter.name,

                                        sectionName:
                                          section.name,
                                      },

                                      {
                                        id: `notes-${section.id}`,

                                        label:
                                          'Notes',

                                        contentType:
                                          'notes',

                                        className:
                                          filters.class,

                                        boardName:
                                          filters.board,

                                        courseName:
                                          course.name,

                                        subjectName:
                                          subject.name,

                                        selectedContentType:
                                          type.name,

                                        chapterName:
                                          chapter.name,

                                        sectionName:
                                          section.name,
                                      },
                                    ],
                                })
                              ),
                          })
                        ),
                    })
                  ),
              })
            ),
        })
      );
    }, [
      filters,
      hierarchy,
    ]);

  useEffect(() => {
    const expanded =
      {};

    treeData.forEach(
      (course) => {
        if (
          filters.course ===
          course.courseName
        ) {
          expanded[
            course.id
          ] = true;
        }

        course.children?.forEach(
          (
            subject
          ) => {
            if (
              filters.subject ===
              subject.subjectName
            ) {
              expanded[
                course.id
              ] = true;

              expanded[
                subject.id
              ] = true;
            }

            subject.children?.forEach(
              (
                type
              ) => {
                if (
                  filters.selectedContentType ===
                  type.label
                ) {
                  expanded[
                    course.id
                  ] = true;

                  expanded[
                    subject.id
                  ] = true;

                  expanded[
                    type.id
                  ] = true;
                }

                type.children?.forEach(
                  (
                    chapter
                  ) => {
                    if (
                      filters.chapter ===
                      chapter.chapterName
                    ) {
                      expanded[
                        course.id
                      ] = true;

                      expanded[
                        subject.id
                      ] = true;

                      expanded[
                        type.id
                      ] = true;

                      expanded[
                        chapter.id
                      ] = true;
                    }

                    chapter.children?.forEach(
                      (
                        section
                      ) => {
                        if (
                          filters.section ===
                          section.sectionName
                        ) {
                          expanded[
                            course.id
                          ] = true;

                          expanded[
                            subject.id
                          ] = true;

                          expanded[
                            type.id
                          ] = true;

                          expanded[
                            chapter.id
                          ] = true;

                          expanded[
                            section.id
                          ] = true;
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );

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