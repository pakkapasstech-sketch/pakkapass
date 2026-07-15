import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useStudentFilterOptions } from '../../hooks/useStudents';
import { useContentRaw } from '../../hooks/useContent';
import ManageHierarchyTree from '../../components/content/ManageHierarchyTree';
import Loader from '../../components/common/Loader';
import { studentService } from '../../services/student.service';

import './contentHierarchyPage.css';

const ContentHierarchyPage = () => {
  const navigate =
    useNavigate();
    const queryClient =
  useQueryClient();
  const {
  data: contentData,
  isLoading: contentLoading,
} = useContentRaw();
  const {
    data: options,
    isLoading: optionsLoading,
    isError: optionsError,
  } = useStudentFilterOptions();


  if (optionsLoading || contentLoading) {
    return <Loader />;
  }

  if (optionsError) {
    return (
      <div className="content-hierarchy-page">
        Failed to load hierarchy
      </div>
    );
  }

  return (
    <div className="content-hierarchy-page">
      <button
        className="back-btn"
        onClick={() =>
          navigate(-1)
        }
      >
        <HiArrowLeft />
        <span>Back to Content</span>
      </button>

      <div className="hierarchy-header">
        <div>
          <h1>
            Content Hierarchy
            Management
          </h1>

          <p>
            Edit and delete
            classes, boards,
            courses, subjects,
            chapters and topics.
          </p>
        </div>
      </div>

      <div className="hierarchy-card">
        <ManageHierarchyTree
  options={options}
  content={contentData || []}
  refresh={async () => {
    studentService.invalidateCache();
    await queryClient.invalidateQueries({
      queryKey: ['content'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['content'],
    });

    await queryClient.invalidateQueries({
      queryKey: ['student-filter-options'],
    });
  }}
/>
      </div>
    </div>
  );
};

export default ContentHierarchyPage;