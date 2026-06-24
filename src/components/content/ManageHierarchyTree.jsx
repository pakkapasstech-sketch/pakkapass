import { useMemo, useState } from 'react';
import {
  HiChevronRight,
  HiChevronDown,
  HiFolder,
  HiPencil,
  HiTrash,
} from 'react-icons/hi';
import './manageHierarchyTree.css';
import toast from 'react-hot-toast';
import entityService from '../../services/entity.service';
const HierarchyItem = ({
  node,
  level = 0,
  refresh,
  setEditingNode,
  setEditedName,
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
    const isChapter =
  Array.isArray(
    node.sections
  );

const isTopic =
  !node.sections &&
  !node.chapters &&
  !node.contentTypes &&
  !node.subjects &&
  !node.courses &&
  !node.boards;
  
  const handleDelete =
  async () => {
    if (
      !window.confirm(
        `Delete ${node.name}?`
      )
    ) {
      return;
    }

    try {
      if (isTopic) {
  await entityService.deleteTopic(
    node.id
  );
} else if (
  isChapter
) {
  await entityService.deleteChapter(
    node.id
  );
}

      toast.success(
        'Deleted successfully'
      );

      refresh();
    } catch {
      toast.error(
        'Delete failed'
      );
    }
  };
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

          <div className="tree-label-wrapper">
  <span className="tree-label">
    {node.name}
  </span>

  <span className="tree-count">
  {` ${node.resourceCount || 0} ${
    (node.resourceCount || 0) === 1
      ? 'Resource'
      : 'Resources'
  }`}
</span>
</div>
        </div>

        <div className="manage-tree-actions">
  {(isChapter ||
    isTopic) && (
    <>
      <button
  type="button"
  title="Edit"
  onClick={() => {
    setEditingNode(node);
    setEditedName(
      node.name
    );
  }}
>
  <HiPencil />
</button>

      <button
        type="button"
        title="Delete"
        onClick={
          handleDelete
        }
      >
        <HiTrash />
      </button>
    </>
  )}
</div>
      </div>

      {expanded &&
        children.map(
          (child) => (
            <HierarchyItem
  key={`${child.id}-${child.name}`}
  node={child}
  level={level + 1}
  refresh={refresh}
  setEditingNode={
    setEditingNode
  }
  setEditedName={
    setEditedName
  }
/>
          )
        )}
    </>
  );
};

const ManageHierarchyTree = ({
  options,
  content,
  refresh,
}) => {
  const [editingNode, setEditingNode] =
  useState(null);

const [editedName, setEditedName] =
  useState('');
  const handleSave = async () => {
  if (
    !editingNode ||
    !editedName.trim()
  ) {
    return;
  }

  try {
    const isChapter =
      Array.isArray(
        editingNode.sections
      );

    const isTopic =
      !editingNode.sections &&
      !editingNode.chapters &&
      !editingNode.contentTypes &&
      !editingNode.subjects &&
      !editingNode.courses &&
      !editingNode.boards;

    if (isTopic) {
      await entityService.updateTopic(
        editingNode.id,
        {
          name:
            editedName.trim(),
        }
      );
    } else if (
      isChapter
    ) {
      await entityService.updateChapter(
        editingNode.id,
        {
          name:
            editedName.trim(),
        }
      );
    }

    toast.success(
      'Updated successfully'
    );

    setEditingNode(null);
    setEditedName('');

    refresh();
  } catch (error) {
    toast.error(
      error.response?.data
        ?.message ||
        'Update failed'
    );
  }
};
  // const gradeCounts =
  // useMemo(() => {
  //   const counts = {};

  //   (content || []).forEach(
  //     (chapter) => {
  //       const gradeName =
  //         chapter.grade?.name;

  //       if (!gradeName)
  //         return;

  //       let total = 0;

  //       (
  //         chapter.topics || []
  //       ).forEach(
  //         (topic) => {
  //           total +=
  //             (
  //               topic.assets ||
  //               []
  //             ).length;
  //         }
  //       );

  //       counts[
  //         gradeName
  //       ] =
  //         (counts[
  //           gradeName
  //         ] || 0) + total;
  //     }
  //   );

  //   return counts;
  // }, [content]);
//   const getResourceCount = (node) => {
//   if (node.sections) {
//     return node.sections.reduce(
//       (sum, section) =>
//         sum + getResourceCount(section),
//       0
//     );
//   }

//   if (node.chapters) {
//     return node.chapters.reduce(
//       (sum, chapter) =>
//         sum + getResourceCount(chapter),
//       0
//     );
//   }

//   if (node.contentTypes) {
//     return node.contentTypes.reduce(
//       (sum, type) =>
//         sum + getResourceCount(type),
//       0
//     );
//   }

//   if (node.subjects) {
//     return node.subjects.reduce(
//       (sum, subject) =>
//         sum + getResourceCount(subject),
//       0
//     );
//   }

//   if (node.courses) {
//     return node.courses.reduce(
//       (sum, course) =>
//         sum + getResourceCount(course),
//       0
//     );
//   }

//   if (node.boards) {
//     return node.boards.reduce(
//       (sum, board) =>
//         sum + getResourceCount(board),
//       0
//     );
//   }

//   // topic node
//   const topic = options?.topics?.find(
//     (t) => t.id === node.id
//   );

//   return topic?.assetCount || 0;
// };
  const hierarchy = useMemo(() => {
  if (!options) return [];

  const tree = (options.grades || []).map(
    (grade) => ({
      id: grade.id,
      name: grade.name,

      boards: (
        options.boards || []
      )
        .map((board) => ({
          id: board.id,
          name: board.name,

          courses: (
            options.branches || []
          )
            .map((branch) => ({
              id: branch.id,
              name: branch.name,

              subjects: (
                options.subjects || []
              )
                .filter(
                  (subject) =>
                    subject.gradeId ===
                      grade.id &&
                    subject.boardId ===
                      board.id &&
                    (subject.branchId ||
                      null) ===
                      (branch.id ||
                        null)
                )
                .map((subject) => ({
                  id: subject.id,
                  name:
                    subject.name,

                  contentTypes: (
                    options.contentTypes ||
                    []
                  )
                    .map((type) => ({
                      id: type.id,
                      name:
                        type.name,

                      chapters: (
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
                    }))
                    .filter(
                      (type) =>
                        type.chapters
                          .length >
                        0
                    ),
                })),
            }))
            .filter(
              (course) =>
                course.subjects
                  .length > 0
            ),
        }))
        .filter(
          (board) =>
            board.courses
              .length > 0
        ),
    })
  );
  
const topicCounts = {};

(content || []).forEach((asset) => {
  const topicId = asset.topicId;

  if (!topicId) return;

  topicCounts[topicId] =
    (topicCounts[topicId] || 0) + 1;
});


(content || []).forEach(
  (chapter) => {
    (chapter.topics || []).forEach(
      (topic) => {
        topicCounts[topic.id] =
          topic.assets?.length || 0;
      }
    );
  }
);
  const addCounts = (
    nodes
  ) => {
    return nodes.map(
      (node) => {
        const children =
          node.boards ||
          node.courses ||
          node.subjects ||
          node.contentTypes ||
          node.chapters ||
          node.sections ||
          [];

        if (
          children.length
        ) {
          const updated =
            addCounts(
              children
            );

          const count =
            updated.reduce(
              (
                sum,
                child
              ) =>
                sum +
                child.resourceCount,
              0
            );

          return {
            ...node,
            boards:
              node.boards
                ? updated
                : undefined,
            courses:
              node.courses
                ? updated
                : undefined,
            subjects:
              node.subjects
                ? updated
                : undefined,
            contentTypes:
              node.contentTypes
                ? updated
                : undefined,
            chapters:
              node.chapters
                ? updated
                : undefined,
            sections:
              node.sections
                ? updated
                : undefined,
            resourceCount:
              count,
          };
        }

        return {
  ...node,
  resourceCount:
    topicCounts[node.id] || 0,
};
      }
    );
  };

  return addCounts(
    tree
  );
}, [options, content]);

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
  refresh={refresh}
  setEditingNode={
    setEditingNode
  }
  setEditedName={
    setEditedName
  }
/>
        )
      )}
      {editingNode && (
  <div className="modal-overlay">
  <div className="entity-modal">
    <h3>Edit Name</h3>

    <p>
      Update the chapter or topic
      name below.
    </p>

    <input
      className="entity-input"
      value={editedName}
      onChange={(e) =>
        setEditedName(
          e.target.value
        )
      }
      placeholder="Enter name"
    />

    <div className="modal-actions">
      <button
        className="cancel-btn"
        onClick={() => {
          setEditingNode(null);
          setEditedName('');
        }}
      >
        Cancel
      </button>

      <button
  className="save-btn"
  onClick={handleSave}
  disabled={
    !editedName.trim()
  }
>
  Save Changes
</button>
    </div>
  </div>
</div>
)}
    </div>
  );
};

export default ManageHierarchyTree;