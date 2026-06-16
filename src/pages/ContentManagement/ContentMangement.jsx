import { useState } from 'react';

import ContentFilters from '../../components/content/ContentFilters';
import ContentTree from '../../components/content/ContentTree';
import ContentTabs from '../../components/content/ContentTabs';
import ContentTable from '../../components/content/ContentTable';
import UploadContentModal from '../../components/content/UploadContentModal';

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
    topic: '',
    contentType: '',
  });

  const [showUploadModal, setShowUploadModal] =
    useState(false);

  return (
    <>
      

      <div className="content-management-page">
        <ContentFilters
          filters={selectedFilters}
          setFilters={setSelectedFilters}
        />

        <div className="content-management-body">
          <ContentTree
  filters={selectedFilters}
  setFilters={setSelectedFilters}
/>

          <div className="content-panel">
            <div className="content-header">
              <div>
                <h2>
                  Content
                </h2>

                <p>
                  Manage educational content
                  for selected topic
                </p>
              </div>

              <button
                className="upload-content-btn"
                disabled={
                  !selectedFilters.topic
                }
                onClick={() =>
                  setShowUploadModal(true)
                }
              >
                + Upload Content
              </button>
            </div>

            <ContentTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <ContentTable
              activeTab={activeTab}
              filters={selectedFilters}
            />
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadContentModal
          onClose={() =>
            setShowUploadModal(false)
          }
        />
      )}
    </>
  );
};

export default ContentManagement;