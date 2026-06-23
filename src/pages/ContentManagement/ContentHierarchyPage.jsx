import { useMemo } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

import {
  useContent,
} from '../../hooks/useContent';
import { buildHierarchy } from '../../utils/buildHierarchy';
import ManageHierarchyTree from '../../components/content/ManageHierarchyTree';

import './contentHierarchyPage.css';

const ContentHierarchyPage =
  () => {
    const navigate =
      useNavigate();

    const {
      data: content = [],
      isLoading,
      isError,
    } = useContent();

    const hierarchy =
      useMemo(
        () =>
          buildHierarchy(
            content
          ),
        [content]
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
          Failed to load
          hierarchy
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
              Content
              Hierarchy
              Management
            </h1>

            <p>
              Edit and
              delete
              classes,
              boards,
              courses,
              subjects,
              chapters and
              topics.
            </p>
          </div>
        </div>

        <div className="hierarchy-card">
          <ManageHierarchyTree
            hierarchy={
              hierarchy
            }
          />
        </div>
      </div>
    );
  };

export default ContentHierarchyPage;