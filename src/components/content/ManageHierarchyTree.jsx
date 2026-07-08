import { useMemo, useState } from 'react';
import { HiChevronRight, HiChevronDown, HiFolder, HiPencil, HiTrash } from 'react-icons/hi';
import './manageHierarchyTree.css';
import toast from 'react-hot-toast';
import entityService from '../../services/entity.service';
const HierarchyItem = ({ node, level = 0, refresh, setEditingNode, setEditedName, setDeletingNode }) => {
  const [expanded, setExpanded] = useState(false);

  const children =
    node.boards ||
    node.courses ||
    node.subjects ||
    node.contentTypes ||
    node.chapters ||
    node.sections ||
    [];

  const hasChildren = children.length > 0;
  const isGrade = node.type === 'grade';
  const isBoard = node.type === 'board';
  const isBranch = node.type === 'branch';
  const isSubject = node.type === 'subject';
  const isChapter = node.type === 'chapter';
  const isTopic = node.type === 'topic';

  return (
    <>
      <div
        className="manage-tree-row"
        style={{
          paddingLeft: `${level * 24}px`,
        }}
      >
        <div className="manage-tree-left" onClick={() => hasChildren && setExpanded(!expanded)}>
          <span className="tree-arrow">
            {hasChildren ? expanded ? <HiChevronDown /> : <HiChevronRight /> : null}
          </span>

          <HiFolder className="tree-icon" />

          <div className="tree-label-wrapper">
            <span className="tree-label">{node.name}</span>

            <span className="tree-count">
              {` ${node.resourceCount || 0} ${
                (node.resourceCount || 0) === 1 ? 'Resource' : 'Resources'
              }`}
            </span>
          </div>
        </div>

        <div className="manage-tree-actions">
          {(isGrade || isBoard || isBranch || isSubject || isChapter || isTopic) && (
            <>
              <button
                type="button"
                title="Edit"
                onClick={() => {
                  setEditingNode(node);
                  setEditedName(node.name);
                }}
              >
                <HiPencil />
              </button>

              {!(isGrade || isBoard || isBranch) && (
                <button type="button" title="Delete" onClick={() => setDeletingNode(node)}>
                  <HiTrash />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {expanded &&
        children.map((child) => (
          <HierarchyItem
            key={`${child.id}-${child.name}`}
            node={child}
            level={level + 1}
            refresh={refresh}
            setEditingNode={setEditingNode}
            setEditedName={setEditedName}
            setDeletingNode={setDeletingNode}
          />
        ))}
    </>
  );
};

const ManageHierarchyTree = ({ options, content, refresh }) => {
  const [editingNode, setEditingNode] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingNode, setDeletingNode] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deletingNode || isDeleting) return;
    setIsDeleting(true);
    try {
      const isGrade = deletingNode.type === 'grade';
      const isBoard = deletingNode.type === 'board';
      const isBranch = deletingNode.type === 'branch';
      const isSubject = deletingNode.type === 'subject';
      const isChapter = deletingNode.type === 'chapter';
      const isTopic = deletingNode.type === 'topic';

      if (isGrade) {
        await entityService.deleteGrade(deletingNode.id);
      } else if (isBoard) {
        await entityService.deleteBoard(deletingNode.id);
      } else if (isBranch) {
        await entityService.deleteBranch(deletingNode.id);
      } else if (isSubject) {
        await entityService.deleteSubject(deletingNode.id);
      } else if (isChapter) {
        await entityService.deleteChapter(deletingNode.id);
      } else if (isTopic) {
        await entityService.deleteTopic(deletingNode.id);
      }

      toast.success('Deleted successfully');
      setDeletingNode(null);
      await refresh();
    } catch {
      toast.error('Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!editingNode || !editedName.trim() || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      const isGrade = editingNode.type === 'grade';
      const isBoard = editingNode.type === 'board';
      const isBranch = editingNode.type === 'branch';
      const isSubject = editingNode.type === 'subject';
      const isChapter = editingNode.type === 'chapter';
      const isTopic = editingNode.type === 'topic';
      if (isGrade) {
        await entityService.updateGrade(editingNode.id, {
          name: editedName.trim(),
        });
      } else if (isBoard) {
        await entityService.updateBoard(editingNode.id, {
          name: editedName.trim(),
        });
      } else if (isBranch) {
        await entityService.updateBranch(editingNode.id, {
          name: editedName.trim(),
        });
      } else if (isSubject) {
        await entityService.updateSubject(editingNode.id, {
          name: editedName.trim(),
        });
      } else if (isChapter) {
        await entityService.updateChapter(editingNode.id, {
          name: editedName.trim(),
        });
      } else if (isTopic) {
        await entityService.updateTopic(editingNode.id, {
          name: editedName.trim(),
        });
      }

      toast.success('Updated successfully');

      setEditingNode(null);
      setEditedName('');

      await refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const hierarchy = useMemo(() => {
    if (!options) return [];

    const tree = (options.grades || []).map((grade) => {
      const showCourse = ['11th', '12th'].includes(grade.name);

      return {
        id: grade.id,
        name: grade.name,
        type: 'grade',

        boards: (options.boards || [])
          .map((board) => {
            if (!showCourse) {
              return {
                id: board.id,
                name: board.name,
                type: 'board',
                subjects: (options.subjects || [])
                  .filter((subject) => subject.gradeId === grade.id && subject.boardId === board.id)
                  .map((subject) => ({
                    id: subject.id,
                    name: subject.name,
                    type: 'subject',

                    contentTypes: (options.contentTypes || [])
                      .map((type) => ({
                        id: type.id,
                        name: type.name,

                        chapters: (options.chapters || [])
                          .filter(
                            (chapter) =>
                              chapter.subjectId === subject.id && chapter.contentTypeId === type.id
                          )
                          .map((chapter) => ({
                            id: chapter.id,
                            name: chapter.name,
                            type: 'chapter',

                            sections: (options.topics || [])
                              .filter((topic) => topic.chapterId === chapter.id)
                              .map((topic) => ({
                                id: topic.id,
                                name: topic.name,
                                type: 'topic',
                              })),
                          })),
                      }))
                      .filter((type) => type.chapters.length > 0),
                  })),
              };
            }

            return {
              id: board.id,
              name: board.name,
              type: 'board',

              courses: (options.branches || [])
                .map((branch) => ({
                  id: branch.id,
                  name: branch.name,
                  type: 'branch',

                  subjects: (options.subjects || [])
                    .filter(
                      (subject) =>
                        subject.gradeId === grade.id &&
                        subject.boardId === board.id &&
                        (subject.branchId || null) === (branch.id || null)
                    )
                    .map((subject) => ({
                      id: subject.id,
                      name: subject.name,
                      type: 'subject',

                      contentTypes: (options.contentTypes || [])
                        .map((type) => ({
                          id: type.id,
                          name: type.name,

                          chapters: (options.chapters || [])
                            .filter(
                              (chapter) =>
                                chapter.subjectId === subject.id && chapter.contentTypeId === type.id
                            )
                            .map((chapter) => ({
                              id: chapter.id,
                              name: chapter.name,
                              type: 'chapter',

                              sections: (options.topics || [])
                                .filter((topic) => topic.chapterId === chapter.id)
                                .map((topic) => ({
                                  id: topic.id,
                                  name: topic.name,
                                  type: 'topic',
                                })),
                            })),
                        }))
                        .filter((type) => type.chapters.length > 0),
                    })),
                }))
                .filter((course) => course.subjects.length > 0),
            };
          })
          .filter((board) => (showCourse ? board.courses.length > 0 : board.subjects.length > 0)),
      };
    });

    const topicCounts = {};

    (content || []).forEach((chapter) => {
      (chapter.topics || []).forEach((topic) => {
        topicCounts[topic.id] = (topic.assets || []).length;
      });
    });

    console.log('TOPIC COUNTS', topicCounts);

    const addCounts = (nodes) => {
      return nodes.map((node) => {
        const children =
          node.boards ||
          node.courses ||
          node.subjects ||
          node.contentTypes ||
          node.chapters ||
          node.sections ||
          [];

        if (children.length) {
          const updated = addCounts(children);

          const count = updated.reduce((sum, child) => sum + child.resourceCount, 0);

          return {
            ...node,
            boards: node.boards ? updated : undefined,
            courses: node.courses ? updated : undefined,
            subjects: node.subjects ? updated : undefined,
            contentTypes: node.contentTypes ? updated : undefined,
            chapters: node.chapters ? updated : undefined,
            sections: node.sections ? updated : undefined,
            resourceCount: count,
          };
        }

        return {
          ...node,
          resourceCount: node.type === 'topic' ? (topicCounts[node.id] || 0) : 0,
        };
      });
    };

    return addCounts(tree);
  }, [options, content]);

  if (hierarchy.length === 0) {
    return <div className="tree-empty">No content found</div>;
  }

  return (
    <div className="manage-tree">
      {hierarchy.map((grade) => (
        <HierarchyItem
          key={`${grade.id}-${grade.name}`}
          node={grade}
          refresh={refresh}
          setEditingNode={setEditingNode}
          setEditedName={setEditedName}
          setDeletingNode={setDeletingNode}
        />
      ))}
      {editingNode && (
        <div className="modal-overlay">
          <div className="entity-modal">
            <h3>Edit Name</h3>

            <p>Update the chapter or topic name below.</p>

            <input
              className="entity-input"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
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

              <button className="save-btn" onClick={handleSave} disabled={!editedName.trim() || isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      {deletingNode && (
        <div className="modal-overlay">
          <div className="entity-modal">
            <h3>Delete Confirmation</h3>
            <p>Are you sure you want to delete <strong>{deletingNode.name}</strong>?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeletingNode(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={handleConfirmDelete} disabled={isDeleting} style={{backgroundColor: '#dc3545'}}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHierarchyTree;
