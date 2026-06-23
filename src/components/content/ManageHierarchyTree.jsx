import { useMemo, useState } from 'react';
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
  options,
}) => {
  const hierarchy =
    useMemo(() => {
      if (!options) return [];

      return (
        options.grades || []
      ).map((grade) => ({
        id: grade.id,
        name: grade.name,

        boards:
          (
            options.boards ||
            []
          ).map((board) => ({
            id: board.id,
            name: board.name,

            courses:
              (
                options.branches ||
                []
              ).map(
                (
                  branch
                ) => ({
                  id:
                    branch.id,
                  name:
                    branch.name,

                  subjects:
                    (
                      options.subjects ||
                      []
                    )
                      .filter(
                        (
                          subject
                        ) =>
                          subject.gradeId ===
                            grade.id &&
                          subject.boardId ===
                            board.id &&
                          (subject.branchId ||
                            null) ===
                            (branch.id ||
                              null)
                      )
                      .map(
                        (
                          subject
                        ) => ({
                          id:
                            subject.id,

                          name:
                            subject.name,

                          contentTypes:
                            (
                              options.contentTypes ||
                              []
                            )
                              .map(
                                (
                                  type
                                ) => ({
                                  id:
                                    type.id,

                                  name:
                                    type.name,

                                  chapters:
                                    (
                                      options.chapters ||
                                      []
                                    )
                                      .filter(
                                        (
                                          chapter
                                        ) =>
                                          chapter.subjectId ===
                                            subject.id &&
                                          chapter.contentTypeId ===
                                            type.id
                                      )
                                      .map(
                                        (
                                          chapter
                                        ) => ({
                                          id:
                                            chapter.id,

                                          name:
                                            chapter.name,

                                          sections:
                                            (
                                              options.topics ||
                                              []
                                            )
                                              .filter(
                                                (
                                                  topic
                                                ) =>
                                                  topic.chapterId ===
                                                  chapter.id
                                              )
                                              .map(
                                                (
                                                  topic
                                                ) => ({
                                                  id:
                                                    topic.id,

                                                  name:
                                                    topic.name,
                                                })
                                              ),
                                        })
                                      ),
                                })
                              )
                              .filter(
                                (
                                  type
                                ) =>
                                  type
                                    .chapters
                                    .length >
                                  0
                              ),
                        })
                      ),
                })
              ).filter(
                (
                  course
                ) =>
                  course
                    .subjects
                    .length > 0
              ),
          })).filter(
            (
              board
            ) =>
              board
                .courses
                .length > 0
          ),
      }));
    }, [options]);

  if (
    hierarchy.length ===
    0
  ) {
    return (
      <div className="tree-empty">
        No content found
      </div>
    );
  }

  return (
    <div className="manage-tree">
      {hierarchy.map(
        (grade) => (
          <HierarchyItem
            key={`${grade.id}-${grade.name}`}
            node={grade}
          />
        )
      )}
    </div>
  );
};

export default ManageHierarchyTree;