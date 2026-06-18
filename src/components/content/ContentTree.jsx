import { useMemo, useState, useEffect} from 'react';
import {
  HiChevronRight,
  HiChevronDown,
  HiFolder,
} from 'react-icons/hi';

import { hierarchyData } from '../../data/hierarchyData';
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
      setExpandedNodes(
  (prev) => ({
    ...prev,
    [node.id]:
      !prev[node.id],
  })
);
    }
  };

  return (
    <div>
      <div
        className={`tree-row ${
          isSelected ? 'active' : ''
        }`}
        style={{
          paddingLeft: `${level * 20}px`,
        }}
        onClick={handleClick}
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
  key={child.id}
  node={child}
  level={level + 1}
  onSelect={onSelect}
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
  setFilters,
  setViewMode,
  setActiveTab,
}) => {
  const [selectedNode, setSelectedNode] =
    useState(null);
const [expandedNodes, setExpandedNodes] =
  useState({});
  
  const handleNodeSelect = (
    node
  ) => {
    setSelectedNode(node.id);

    if (
  node.contentType === 'paper'
) {
  setViewMode('paper');
} else {
  setViewMode('content');
}

if (
  node.contentType === 'video' ||
  node.contentType === 'notes'
) {
  setActiveTab(
    node.contentType
  );
}


setFilters((prev) => ({
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

  chapter:
    node.chapterName ||
    prev.chapter,

  section:
    node.sectionName ||
    prev.section,

  contentType:
    node.contentType ||
    prev.contentType,
}));
  };

  const treeData = useMemo(() => {
    if (
      !filters.class ||
      !filters.board
    ) {
      return [];
    }

    const selectedClass =
      hierarchyData.find(
        (item) =>
          item.name ===
          filters.class
      );

    if (!selectedClass) {
      return [];
    }

    const selectedBoard =
      selectedClass.boards.find(
        (board) =>
          board.name ===
          filters.board
      );

    if (!selectedBoard) {
      return [];
    }

    return selectedBoard.courses.map(
      (course) => ({
        id: `course-${course.id}`,
        label: course.name,

        className:
          filters.class,

        boardName:
          filters.board,

        courseName:
          course.name,

        children:
          course.subjects.map(
            (subject) => ({
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
              [
  ...subject.chapters.map((chapter) => ({
    id: `chapter-${chapter.id}`,
    label: chapter.name,

    className: filters.class,
    boardName: filters.board,
    courseName: course.name,
    subjectName: subject.name,
    chapterName: chapter.name,

    children: chapter.sections.map(
  (section) => ({
    id: `section-${section.id}`,
    label: section.name,

    className: filters.class,
    boardName: filters.board,
    courseName: course.name,
    subjectName: subject.name,
    chapterName: chapter.name,
    sectionName: section.name,

    children: [
      {
        id: `video-${section.id}`,
        label: 'Videos',

        contentType: 'video',

        className:
          filters.class,
        boardName:
          filters.board,
        courseName:
          course.name,
        subjectName:
          subject.name,
        chapterName:
          chapter.name,
        sectionName:
          section.name,
      },

      {
        id: `notes-${section.id}`,
        label: 'Notes',

        contentType: 'notes',

        className:
          filters.class,
        boardName:
          filters.board,
        courseName:
          course.name,
        subjectName:
          subject.name,
        chapterName:
          chapter.name,
        sectionName:
          section.name,
      },
    ],
  })
),
  })),

  {
  id: `paper-${subject.id}`,
  label: 'Question Papers',

  className: filters.class,
  boardName: filters.board,
  courseName: course.name,
  subjectName: subject.name,

  contentType: 'paper',

  children: [],
}
],
            })
          ),
      })
    );
  }, [filters]);
  useEffect(() => {
  const expanded = {};

  treeData.forEach((course) => {
    if (
      filters.course ===
      course.courseName
    ) {
      expanded[course.id] = true;
    }

    course.children?.forEach(
      (subject) => {
        if (
          filters.subject ===
          subject.subjectName
        ) {
          expanded[course.id] =
            true;
          expanded[subject.id] =
            true;
        }

        subject.children?.forEach(
          (chapter) => {
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
                chapter.id
              ] = true;
            }

            chapter.children?.forEach(
              (section) => {
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
  });

  setExpandedNodes(expanded);
}, [filters, treeData]);

  return (
    <div className="content-tree">
      <h3 className="tree-title">
        Content Hierarchy
      </h3>

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