import { useMemo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import ContentFilters from '../../components/content/ContentFilters';
import ContentTree from '../../components/content/ContentTree';
import ContentTabs from '../../components/content/ContentTabs';
import ContentTable from '../../components/content/ContentTable';
import UploadContentModal from '../../components/content/UploadContentModal';
import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import ErrorState from '../../components/loaders/ErrorState';
import { useContent } from '../../hooks/useContent';
import { contentService } from '../../services/content.service';
import { buildHierarchy } from '../../utils/buildHierarchy';
import './contentManagement.css';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';
const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('all');

  const [selectedFilters, setSelectedFilters] = useState({
    class: '',
    board: '',
    course: '',
    subject: '',

    selectedContentType: '',
    selectedContentTypeId: '',

    chapter: '',
    chapterId: '',

    section: '',

    contentType: '',
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState('content');
  const queryClient = useQueryClient();
  // Fetch content from GET /admin/content instead of hardcoded mock data
  const { data: content = [], isLoading, isError, refetch } = useContent();

  const {
    data: options = {
      grades: [],
      boards: [],
      branches: [],
      subjects: [],
    },
  } = useQuery({
    queryKey: ['content-options'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/content/options');

      return data;
    },
  });
  const hierarchy = useMemo(() => buildHierarchy(content), [content]); // useEffect(() => {
  //   if (selectedFilters.contentType) {
  //     setActiveTab(selectedFilters.contentType);
  //   }
  // }, [selectedFilters.contentType]);
  useEffect(() => {
    if (selectedFilters.contentType && selectedFilters.contentType !== 'paper') {
      setActiveTab(selectedFilters.contentType);
    }
  }, [selectedFilters.contentType]);

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

  if (isLoading) return <Loader />;
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
            await queryClient.invalidateQueries({
              queryKey: ['content'],
            });

            await queryClient.invalidateQueries({
              queryKey: ['content-options'],
            });
          }}
        />
        <div className="content-management-body">
          <ContentTree
            filters={selectedFilters}
            hierarchy={hierarchy}
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
                disabled={!selectedFilters.selectedContentType || !selectedFilters.chapter}
                onClick={() => setShowUploadModal(true)}
              >
                {`+ Upload ${selectedFilters.selectedContentType || 'Content'}`}
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
