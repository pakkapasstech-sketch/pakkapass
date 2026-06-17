import { useEffect, useState } from 'react';

import ContentFilters from '../../components/content/ContentFilters';
import ContentTree from '../../components/content/ContentTree';
import ContentTabs from '../../components/content/ContentTabs';
import ContentTable from '../../components/content/ContentTable';
import UploadContentModal from '../../components/content/UploadContentModal';

import './contentManagement.css';

const ContentManagement = () => {
  const [activeTab, setActiveTab] =
    useState('all');

  const [selectedFilters, setSelectedFilters] =
    useState({
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
const [content, setContent] =
  useState([
    {
      id: 1,
      title:
        'Introduction to Euclid Division Lemma',
      description:
        'Basic explanation of Euclid Division Lemma',

      topic:
        'Euclid Division Lemma',

      type: 'video',

      uploadedOn:
        '15 Jul 2025',

      fileSize: '45 MB',

      fileName:
        'euclid-introduction.mp4',

      fileUrl:
        'https://www.w3schools.com/html/mov_bbb.mp4',
    },

    {
      id: 2,
      title:
        'Euclid Lemma Examples',

      description:
        'Solved examples',

      topic:
        'Euclid Division Lemma',

      type: 'video',

      uploadedOn:
        '16 Jul 2025',

      fileSize: '60 MB',

      fileName:
        'euclid-examples.mp4',

      fileUrl:
        'https://www.w3schools.com/html/movie.mp4',
    },

    {
      id: 3,
      title:
        'Euclid Division Notes',

      description:
        'Complete notes',

      topic:
        'Euclid Division Lemma',

      type: 'notes',

      uploadedOn:
        '18 Jul 2025',

      fileSize: '2 MB',

      fileName:
        'euclid-notes.pdf',

      fileUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },

    {
      id: 4,
      title:
        'Euclid Division Practice Paper',

      description:
        'Practice Questions',

      topic:
        'Euclid Division Lemma',

      type: 'paper',

      uploadedOn:
        '20 Jul 2025',

      fileSize: '1 MB',

      fileName:
        'euclid-paper.pdf',

      fileUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },

    {
      id: 5,
      title:
        'Irrational Numbers Introduction',

      description:
        'Introduction video',

      topic:
        'Irrational Numbers',

      type: 'video',

      uploadedOn:
        '22 Jul 2025',

      fileSize: '50 MB',

      fileName:
        'irrational-numbers.mp4',

      fileUrl:
        'https://www.w3schools.com/html/mov_bbb.mp4',
    },

    {
      id: 6,
      title:
        'Zeros of Polynomial Basics',

      description:
        'Polynomial introduction',

      topic:
        'Zeros of Polynomial',

      type: 'video',

      uploadedOn:
        '25 Jul 2025',

      fileSize: '38 MB',

      fileName:
        'polynomial-basics.mp4',

      fileUrl:
        'https://www.w3schools.com/html/movie.mp4',
    },
  ]);
  useEffect(() => {
    if (
      selectedFilters.contentType
    ) {
      setActiveTab(
        selectedFilters.contentType
      );
    }
  }, [
    selectedFilters.contentType,
  ]);

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
            setFilters={
              setSelectedFilters
            }
          />

          <div className="content-panel">
            <div className="content-header">
              <div>
                <h2>Content</h2>

                <p>
                  Manage educational
                  content
                </p>
              </div>

              <button
                className="upload-content-btn"
                disabled={
                  !selectedFilters.topic
                }
                onClick={() =>
                  setShowUploadModal(
                    true
                  )
                }
              >
                + Upload Content
              </button>
            </div>

            <ContentTabs
              activeTab={activeTab}
              setActiveTab={
                setActiveTab
              }
            />

            <ContentTable
              activeTab={activeTab}
              filters={
                selectedFilters
              }
              content={content}
            />
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadContentModal
          topic={
            selectedFilters.topic
          }
          contentType={
            activeTab
          }
          setContent={
            setContent
          }
          onClose={() =>
            setShowUploadModal(
              false
            )
          }
        />
      )}
    </>
  );
};

export default ContentManagement;