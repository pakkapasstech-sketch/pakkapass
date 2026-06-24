import axiosInstance from '../api/axiosInstance';

const mapContentFromApi = (
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
              console.log(
  'CHAPTER',
  chapter.name,
  chapter.contentType
);
              items.push({
                id:
                  asset.id,

                title:
                  asset.title,

                description:
                  asset.description,

                type:
                  asset.assetType,

                fileUrl:
                  asset.fileUrl,

                fileName:
                  asset.fileUrl
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

                grade:
                  chapter.grade
                    ?.name ||
                  '',

                board:
                  chapter.board
                    ?.name ||
                  '',

                course:
                  chapter.branch
                    ?.name ||
                  'General',

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

  return mapContentFromApi(
    data.content || []
  );
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

    formData.append('boardName', filters.board || '');

    formData.append('branchName', filters.course || '');

    formData.append('subjectName', filters.subject || '');
if (filters.selectedContentTypeId) {
  formData.append(
    'contentTypeId',
    filters.selectedContentTypeId
  );
}
    formData.append('chapterName', filters.chapter || '');

    formData.append(
  'topicName',
  topicName ||
    filters.section ||
    title
);

    formData.append('title', title || '');

    formData.append('description', description || '');

    formData.append('fileSize', fileSize || '');

    const fieldName =
  contentType === 'video'
    ? 'videoUrl'
    : 'notesUrl';
    formData.append(fieldName, file);

    console.log('UPLOADING', {
      contentType,
      fieldName,
      filters,
    });

    const { data } = await axiosInstance.post('/admin/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
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
};

export default contentService;
