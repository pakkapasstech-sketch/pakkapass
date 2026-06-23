import { useState } from 'react';
import {
  HiChevronRight,
  HiChevronDown,
  HiFolder,
  HiPencil,
  HiTrash,
} from 'react-icons/hi';
import './manageHierarchyTree.css';

const HierarchyItem = ({
  node,
  level = 0,
}) => {
  const [expanded, setExpanded] =
    useState(false);

  const children =
    node.boards ||
    node.courses ||
    node.subjects ||
    node.contentTypes ||
    node.chapters ||
    node.sections ||
    [];

  const hasChildren =
    children.length > 0;

  return (
    <>
      <div
        className="manage-tree-row"
        style={{
          paddingLeft: `${
            level * 24
          }px`,
        }}
      >
        <div
          className="manage-tree-left"
          onClick={() =>
            hasChildren &&
            setExpanded(
              !expanded
            )
          }
        >
          <span className="tree-arrow">
            {hasChildren ? (
              expanded ? (
                <HiChevronDown />
              ) : (
                <HiChevronRight />
              )
            ) : null}
          </span>

          <HiFolder className="tree-icon" />

          <span className="tree-label">
            {node.name}
          </span>
        </div>

        <div className="manage-tree-actions">
          <button
            type="button"
            title="Edit"
          >
            <HiPencil />
          </button>

          <button
            type="button"
            title="Delete"
          >
            <HiTrash />
          </button>
        </div>
      </div>

      {expanded &&
        children.map(
          (child) => (
            <HierarchyItem
              key={`${child.id}-${child.name}`}
              node={child}
              level={
                level + 1
              }
            />
          )
        )}
    </>
  );
};

const ManageHierarchyTree = ({
  hierarchy = [],
}) => {
  if (
    !Array.isArray(
      hierarchy
    )
  ) {
    return (
      <div>
        No hierarchy found
      </div>
    );
  }

  return (
    <div className="manage-tree">
      {hierarchy.length ===
      0 ? (
        <div className="tree-empty">
          No content found
        </div>
      ) : (
        hierarchy.map(
          (grade) => (
            <HierarchyItem
              key={`${grade.id}-${grade.name}`}
              node={grade}
            />
          )
        )
      )}
    </div>
  );
};

export default ManageHierarchyTree;