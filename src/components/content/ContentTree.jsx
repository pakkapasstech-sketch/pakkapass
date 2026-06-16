import { useMemo, useState } from 'react';
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
}) => {
  const [open, setOpen] = useState(true);

  const hasChildren =
    node.children &&
    node.children.length > 0;

  const isSelected =
    selectedNode === node.id;

  const handleClick = () => {
    onSelect(node);

    if (hasChildren) {
      setOpen((prev) => !prev);
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

      {hasChildren &&
        open &&
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
            />
          )
        )}
    </div>
  );
};

const ContentTree = ({
  filters,
  setFilters,
}) => {
  const [selectedNode, setSelectedNode] =
    useState(null);

  const handleNodeSelect = (
    node
  ) => {
    setSelectedNode(node.id);

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

  topic:
    node.topicName ||
    prev.topic,
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
            subject.chapters.map(
              (chapter) => ({
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

                      chapterName:
                        chapter.name,

                      sectionName:
                        section.name,

                      children:
                        section.topics.map(
                          (
                            topic
                          ) => ({
                            id: `topic-${topic.id}`,
                            label:
                              topic.name,

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

                            topicName:
                              topic.name,

                            children:
                              [],
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

  }, [filters]);

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
          />
        )
      )}
    </div>
  );
};

export default ContentTree;