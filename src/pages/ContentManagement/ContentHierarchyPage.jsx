import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import ManageHierarchyTree from '../../components/content/ManageHierarchyTree';

import './contentHierarchyPage.css';

const ContentHierarchyPage = () => {
  const navigate =
    useNavigate();

  const {
    data: options,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'content-options',
    ],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get(
          '/admin/content/options'
        );

      return data;
    },
  });

  console.log(
    'OPTIONS',
    options
  );

  if (isLoading) {
    return (
      <div className="content-hierarchy-page">
        Loading...
      </div>
    );
  }

  if (isError) {
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
        Back to Content
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
        />
      </div>
    </div>
  );
};

export default ContentHierarchyPage;