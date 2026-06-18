import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import ContentFilters from '../../components/content/ContentFilters';
import ContentTree from '../../components/content/ContentTree';
import ContentTabs from '../../components/content/ContentTabs';
import ContentTable from '../../components/content/ContentTable';
import UploadContentModal from '../../components/content/UploadContentModal';
import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import ErrorState from '../../components/loaders/ErrorState';
import { useContent } from '../../hooks/useContent';
import { contentService } from '../../services/content.service';

import './contentManagement.css';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('all');

  const [selectedFilters, setSelectedFilters] = useState({
    class: '',
    board: '',
    course: '',
    subject: '',
    chapter: '',
    section: '',
    // topic: '',
    contentType: '',
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState('content');
  const isQuestionPaperLevel = viewMode === 'paper';

  const isVideoNotesLevel = selectedFilters.section && selectedFilters.contentType;
  // Fetch content from GET /admin/content instead of hardcoded mock data
  const { data: content = [], isLoading, isError, refetch } = useContent();

  // useEffect(() => {
  //   if (selectedFilters.contentType) {
  //     setActiveTab(selectedFilters.contentType);
  //   }
  // }, [selectedFilters.contentType]);
  useEffect(() => {
  if (
    selectedFilters.contentType &&
    selectedFilters.contentType !==
      'paper'
  ) {
    setActiveTab(
      selectedFilters.contentType
    );
  }
}, [
  selectedFilters.contentType,
]);

  const handleUpload = async (uploadData) => {
    try {
      await contentService.upload(uploadData);
      toast.success('Content uploaded successfully');
      refetch();
      setShowUploadModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload content');
    }
  };

  if (isLoading) return <LoadingSkeleton rows={8} />;
  if (isError) {
    return <ErrorState message="Failed to load content" onRetry={refetch} />;
  }

  return (
    <>
      <div className="content-management-page">
        <ContentFilters
          filters={selectedFilters}
          setFilters={setSelectedFilters}
          disableContentFilter={isQuestionPaperLevel}
        />
        <div className="content-management-body">
          <ContentTree
            filters={selectedFilters}
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
                disabled={!isQuestionPaperLevel && !isVideoNotesLevel}
                onClick={() => setShowUploadModal(true)}
              >
                {isQuestionPaperLevel
  ? '+ Add Question Paper'
  : activeTab === 'video'
    ? '+ Upload Video'
    : '+ Upload Notes'}
              </button>
            </div>

            {!isQuestionPaperLevel && (
              <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            )}

            <ContentTable activeTab={activeTab} filters={selectedFilters} content={content} isQuestionPaperLevel={
    isQuestionPaperLevel
  } />
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadContentModal
  filters={selectedFilters}
  contentType={
    isQuestionPaperLevel
      ? 'paper'
      : activeTab
  }
  isQuestionPaperLevel={
    isQuestionPaperLevel
  }
  onUpload={handleUpload}
  onClose={() =>
    setShowUploadModal(false)
  }
/>
      )}
    </>
  );
};

export default ContentManagement;
