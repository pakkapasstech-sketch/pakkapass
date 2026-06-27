import { useState,useEffect } from 'react';
import './uploadContentModal.css';
import toast from 'react-hot-toast';
import entityService from '../../services/entity.service';

const EntityModal = ({ title, filters, onClose, onEntityAdded ,initialData = null,
  isEdit = false,}) => {
  const [name, setName] = useState(initialData?.title || '');

useEffect(() => {
  if (initialData) {
    setName(initialData.title || '');
  }
}, [initialData]);

  const handleSave = async () => {
    if (isEdit) {
  await onEntityAdded({
    name,
  });

  onClose();
  return;
}
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      switch (title) {
        case 'Add Class':
          await entityService.addGrade(name);
          break;

        case 'Add Board':
          await entityService.addBoard(name);
          break;

        case 'Add Course':
          await entityService.addBranch(name);
          break;

        case 'Add Subject':
          await entityService.addSubject({
            name,
            gradeName: filters.class,
            boardName: filters.board,
            branchName: filters.course,
          });
          break;
        case 'Add Content Type':
          await entityService.addContentType(name);
          break;
        case 'Add Chapter':
          if (!filters?.class || !filters?.board || !filters?.subject) {
            toast.error('Please select Class, Board and Subject first');
            return;
          }

          await entityService.addChapter({
            name,
            gradeName: filters.class,
            boardName: filters.board,
            branchName: filters.course,
            subjectName: filters.subject,
            contentTypeName: filters.selectedContentType,
          });
          break;

        case 'Add Section':
          if (!filters?.chapterId) {
            toast.error('Please select a Chapter first');
            return;
          }

          await entityService.addTopic({
            name,
            chapterId: filters.chapterId,
          });
          break;

        default:
          return;
      }

      toast.success(`${title.replace('Add ', '')} added successfully`);

      await onEntityAdded?.();

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="upload-modal"
        style={{
          width: '450px',
          maxHeight: 'auto',
        }}
      >
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Content' : title}</h2>

          <button onClick={onClose} className="modal-close-btn">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group full-width">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
  isEdit
    ? 'Enter title'
    : `Enter ${title.replace('Add ', '').toLowerCase()} name`
}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="save-btn" onClick={handleSave}>
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntityModal;
