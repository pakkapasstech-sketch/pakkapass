import { useMemo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import ContentFilters from '../../components/content/ContentFilters';
import ContentTree from '../../components/content/ContentTree';
import ContentTabs from '../../components/content/ContentTabs';
import ContentTable from '../../components/content/ContentTable';
import UploadContentModal from '../../components/content/UploadContentModal';
//import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import ErrorState from '../../components/loaders/ErrorState';
import { useContent } from '../../hooks/useContent';
import { useStudentFilterOptions } from '../../hooks/useStudents';
import { contentService } from '../../services/content.service';
import { buildHierarchy } from '../../utils/buildHierarchy';
import { studentService } from '../../services/student.service';
import './contentManagement.css';
import { HiCloudArrowUp } from 'react-icons/hi2';
import { useLoading } from '../../contexts/LoadingContext';
const ContentManagement = () => {
  const { setLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('all');

  const [selectedFilters, setSelectedFilters] = useState({
    class: '',
    classId: '',
    board: '',
    boardId: '',
    course: '',
    courseId: '',
    subject: '',
    subjectId: '',

    selectedContentType: '',
    selectedContentTypeId: '',

    chapter: '',
    chapterId: '',

    section: '',
    sectionId: '',

    contentType: '',
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState('content');
  const queryClient = useQueryClient();
  // Fetch content from GET /admin/content instead of hardcoded mock data
  const { data: content = [], isLoading, isError, refetch } = useContent();

  const { data: optionsData } = useStudentFilterOptions();
  const options = optionsData || {
      grades: [],
      boards: [],
      branches: [],
      subjects: [],
    };
  const hierarchy = useMemo(() => buildHierarchy(content), [content]); // useEffect(() => {
  //   if (selectedFilters.contentType) {
  //     setActiveTab(selectedFilters.contentType);
  //   }
  // }, [selectedFilters.contentType]);
  // Sync dropdown to tabs
  useEffect(() => {
    if (selectedFilters.contentType) {
      if (selectedFilters.contentType !== 'paper' && selectedFilters.contentType !== activeTab) {
        setActiveTab(selectedFilters.contentType);
      }
    } else if (activeTab !== 'all') {
      setActiveTab('all');
    }
  }, [selectedFilters.contentType]);

  // Sync tabs to dropdown
  useEffect(() => {
    if (activeTab === 'all') {
      if (selectedFilters.contentType !== '') {
        setSelectedFilters((prev) => ({
          ...prev,
          contentType: '',
        }));
      }
    } else {
      if (selectedFilters.contentType !== activeTab) {
        setSelectedFilters((prev) => ({
          ...prev,
          contentType: activeTab,
        }));
      }
    }
  }, [activeTab]);

  const handleUpload = async (uploadData) => {
    try {
      await contentService.upload(uploadData);

      await queryClient.invalidateQueries({
        queryKey: ['content'],
      });

      toast.success('Content uploaded successfully');

      setShowUploadModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload content');
    }
  };

  useEffect(() => {
  setLoading(isLoading);

  return () => setLoading(false);
}, [isLoading, setLoading]);
  if (isError) {
    return <ErrorState message="Failed to load content" onRetry={refetch} />;
  }

  return (
    <>
      <div className="content-management-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Content Management</h1>
            <p className="page-subtitle">
              Manage educational content hierarchy, uploads, and resources.
            </p>
          </div>
        </div>
        <ContentFilters
          filters={selectedFilters}
          setFilters={setSelectedFilters}
          hierarchy={hierarchy}
          options={options}
          //disableContentFilter={isQuestionPaperLevel}
          onEntityAdded={async () => {
            studentService.invalidateCache();
            await queryClient.invalidateQueries({
              queryKey: ['content'],
            });

            await queryClient.invalidateQueries({
              queryKey: ['content-options'],
            });

            await queryClient.invalidateQueries({
              queryKey: ['student-filter-options'],
            });
          }}
        />
        <div className="content-management-body">
          <ContentTree
            filters={selectedFilters}
            hierarchy={hierarchy}
            options={options}
            setFilters={setSelectedFilters}
            setViewMode={setViewMode}
            setActiveTab={setActiveTab}
          />
          <div className="content-panel">
            <div className="content-header">
              <div>
                <h2>Content</h2>

                <p>Manage educational content</p>
              </div>

              <button
  className="upload-content-btn"
  disabled={
    !selectedFilters.selectedContentType ||
    !selectedFilters.chapter
  }
  onClick={() => setShowUploadModal(true)}
>
  <HiCloudArrowUp className="upload-btn-icon" />
  <span>Upload</span>
</button>
            </div>

            <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <ContentTable
              activeTab={activeTab}
              filters={selectedFilters}
              content={content}
              //isQuestionPaperLevel={isQuestionPaperLevel}
            />
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadContentModal
          filters={selectedFilters}
          contentType={activeTab}
          onUpload={handleUpload}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </>
  );
};

export default ContentManagement;
