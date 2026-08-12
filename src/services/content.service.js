import axiosInstance from '../api/axiosInstance';

export const mapContentFromApi = (
  chapters = []
) => {
  const items = [];

  chapters.forEach(
    (chapter) => {
      (
        chapter.topics || []
      ).forEach(
        (topic) => {
          (
            topic.assets || []
          ).forEach(
            (asset) => {

              items.push({
                id:
                  asset.id,

                title:
                  asset.title || asset.notesTitle || asset.videoTitle || asset.name || asset.titleName || asset.assetName || asset.fileName || asset.originalName || 'Uploaded Content',

                description:
                  asset.description,

                order:
                  asset.order,

                type:
                  asset.assetType,

                fileUrl:
                  asset.fileUrl || asset.videoUrl || asset.notesUrl || asset.url,

                fileName:
                  (asset.fileUrl || asset.videoUrl || asset.notesUrl || asset.url)
                    ?.split(
                      '/'
                    )
                    .pop(),

                uploadedOn:
                  new Date(
                    asset.createdAt
                  ).toLocaleDateString(
                    'en-IN'
                  ),

                fileSize:
                  asset.fileSize,

                grade: {
  id: chapter.grade?.id,
  name: chapter.grade?.name,
},

board: {
  id: chapter.board?.id,
  name: chapter.board?.name,
},

course: {
  id: chapter.branch?.id,
  name: chapter.branch?.name,
},

                subject:
                  chapter.subject
                    ?.name ||
                  '',

                chapter:
                  chapter.name,

                section:
                  topic.name,

                hierarchyType:
                  chapter
                    .contentType
                    ?.name,
                hierarchyTypeId:
    chapter.contentType?.id,
              });
            }
          );
        }
      );
    }
  );

  return items;
};

export const contentService = {
  getAll: async () => {
  const { data } =
    await axiosInstance.get(
      '/admin/content'
    );

    return data.content || [];
  },

  upload: async ({
  filters,
  file,
  title,
  description,
  topicName,
  fileSize,
  contentType,
}) => {
    const formData = new FormData();

    formData.append('gradeName', filters.class || '');
    if (filters.classId) formData.append('gradeId', filters.classId);

    formData.append('boardName', filters.board || '');
    if (filters.boardId) formData.append('boardId', filters.boardId);

    formData.append('branchName', filters.course || '');
    if (filters.courseId) formData.append('branchId', filters.courseId);

    formData.append('subjectName', filters.subject || '');
    if (filters.subjectId) formData.append('subjectId', filters.subjectId);

    const contentTypeId = filters.contentTypeId || filters.selectedContentTypeId || 1;
    formData.append('contentTypeId', contentTypeId);
    
    formData.append('chapterName', filters.chapter || '');
    if (filters.chapterId) formData.append('chapterId', filters.chapterId);

    formData.append(
      'topicName',
      topicName ||
      filters.section ||
      title
    );
    if (filters.sectionId) formData.append('topicId', filters.sectionId);

    formData.append('title', title || '');

    formData.append('description', description || '');

    formData.append('fileSize', fileSize || '');

    const fieldName =
  contentType === 'video'
    ? 'videoUrl'
    : 'notesUrl';
    formData.append(fieldName, file);



    try {
      const { data } = await axiosInstance.post('/admin/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 600000, // 10 minutes
      });

      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        const { data } = await axiosInstance.post('/admin/content-asset', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 600000,
        });
        return data;
      }
      throw err;
    }
  },
  updateAsset: (id, data) =>
  axiosInstance.put(
    `/admin/content-asset/${id}`,
    data
  ),

deleteAsset: (id) =>
  axiosInstance.delete(
    `/admin/content-asset/${id}`
  ),

  reorderContentAssets: (orderedIds) =>
    axiosInstance.put('/admin/content-assets/reorder', { orderedIds }),
};

export default contentService;
