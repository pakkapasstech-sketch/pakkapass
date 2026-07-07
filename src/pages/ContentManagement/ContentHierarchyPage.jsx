import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import ManageHierarchyTree from '../../components/content/ManageHierarchyTree';
import Loader from '../../components/common/Loader';

import './contentHierarchyPage.css';

const ContentHierarchyPage = () => {
  const navigate =
    useNavigate();
    const queryClient =
  useQueryClient();
  const {
  data: contentData = [],
  isLoading: contentLoading,
} = useQuery({
  queryKey: ['content-hierarchy-raw'],
  queryFn: async () => {
    const { data } =
      await axiosInstance.get(
        '/admin/content'
      );

    return data.content;
  },
  staleTime: 0,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
});
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
    staleTime: 0,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
  });


  if (isLoading || contentLoading) {
    return <Loader />;
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
        className="back-link"
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
  content={contentData || []}
  refresh={async () => {
    await queryClient.invalidateQueries({
      queryKey: ['content'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['content-hierarchy-raw'],
    });

    await queryClient.invalidateQueries({
      queryKey: ['content-options'],
    });
    await queryClient.refetchQueries({
  queryKey: ['content-hierarchy-raw'],
});

await queryClient.refetchQueries({
  queryKey: ['content-options'],
});
  }}
/>
      </div>
    </div>
  );
};

export default ContentHierarchyPage;