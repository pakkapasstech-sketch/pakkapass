import axiosInstance from '../api/axiosInstance';

const BASE_URL =
  (
    import.meta.env
      .VITE_API_URL ||
    'http://localhost:8000/api'
  ).replace('/api', '');

const mapContentFromApi = (
  chapters = []
) => {
  const items = [];

  console.log(
    'RAW CHAPTERS',
    chapters
  );

  chapters.forEach(
    (chapter) => {
      (
        chapter.topics || []
      ).forEach((topic) => {
        const base = {
          id: topic.id,

          title:
            topic.title ||
            topic.name,

          chapter:
            chapter.name,

          section:
            topic.name,

          subject:
            chapter.subject
              ?.name || '',

          course:
            chapter.branch
              ?.name ||
            'General',

          grade:
            chapter.grade
              ?.name || '',

          board:
            chapter.board
              ?.name || '',

          uploadedOn:
            topic.createdAt
              ? new Date(
                  topic.createdAt
                ).toLocaleDateString(
                  'en-IN'
                )
              : '-',

          fileSize:
            topic.fileSize ||
            '-',
        };

        if (
          topic.videoUrl
        ) {
          items.push({
            ...base,
            id: `${topic.id}-video`,
            type: 'video',
            description: `Video for ${topic.name}`,
            fileName:
              topic.videoUrl.split(
                '/'
              ).pop(),
            fileUrl: `${BASE_URL}${topic.videoUrl}`,
          });
        }

        if (
          topic.notesUrl
        ) {
          items.push({
            ...base,
            id: `${topic.id}-notes`,
            type: 'notes',
            description: `Notes for ${topic.name}`,
            fileName:
              topic.notesUrl.split(
                '/'
              ).pop(),
            fileUrl: `${BASE_URL}${topic.notesUrl}`,
          });
        }

        if (
          topic.questionsUrl
        ) {
          items.push({
            ...base,
            id: `${topic.id}-paper`,
            type: 'paper',
            description: `Practice paper for ${topic.name}`,
            fileName:
              topic.questionsUrl.split(
                '/'
              ).pop(),
            fileUrl: `${BASE_URL}${topic.questionsUrl}`,
          });
        }
      });
    }
  );

  console.log(
    'MAPPED CONTENT',
    items
  );

  return items;
};

export const contentService =
  {
    getAll: async () => {
  const { data } =
    await axiosInstance.get(
      '/admin/content'
    );

  const content =
    mapContentFromApi(
      data.content || []
    );

  const papers =
    (
      data.papers || []
    ).map((paper) => ({
      id: `paper-${paper.id}`,

      title:
        paper.title,

      type: 'paper',

      chapter: '',

      section: '',

      subject:
        paper.subject
          ?.name || '',

      course:
        paper.branch
          ?.name ||
        'General',

      grade:
        paper.grade
          ?.name || '',

      board:
        paper.board
          ?.name || '',

      uploadedOn:
        new Date(
          paper.createdAt
        ).toLocaleDateString(
          'en-IN'
        ),

      fileSize:
        paper.fileSize,

      fileName:
        paper.fileUrl
          .split('/')
          .pop(),

      fileUrl:
        `${BASE_URL}${paper.fileUrl}`,
    }));

  return [
    ...content,
    ...papers,
  ];
},

    upload: async ({
      filters,
      file,
      title,
      description,
      fileSize,
      contentType,
    }) => {
      const formData =
        new FormData();

      formData.append(
        'gradeName',
        filters.class || ''
      );

      formData.append(
        'boardName',
        filters.board || ''
      );

      formData.append(
        'branchName',
        filters.course || ''
      );

      formData.append(
        'subjectName',
        filters.subject || ''
      );

      formData.append(
        'chapterName',
        filters.chapter || ''
      );

      formData.append(
        'topicName',
        filters.section || ''
      );

      formData.append(
        'title',
        title || ''
      );

      formData.append(
        'description',
        description || ''
      );

      formData.append(
        'fileSize',
        fileSize || ''
      );

      const fieldMap = {
        video: 'videoUrl',
        notes: 'notesUrl',
        paper:
          'questionsUrl',
      };

      const fieldName =
        fieldMap[
          contentType
        ] ||
        'videoUrl';

      formData.append(
        fieldName,
        file
      );

      console.log(
        'UPLOADING',
        {
          contentType,
          fieldName,
          filters,
        }
      );

      const { data } =
        await axiosInstance.post(
          '/admin/content',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      return data;
    },
  };

export default contentService;