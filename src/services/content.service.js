import axiosInstance from '../api/axiosInstance';

// Maps API chapter/topic data into the content table row format
const mapContentFromApi = (chapters = []) => {
  const items = [];

  chapters.forEach((chapter) => {
    (chapter.topics || []).forEach((topic) => {
      const base = {
        id: topic.id,
        topic: topic.name,
        chapter: chapter.name,
        subject: chapter.subject?.name,
        grade: chapter.grade?.name,
        board: chapter.board?.name,
        uploadedOn: topic.createdAt
          ? new Date(topic.createdAt).toLocaleDateString('en-IN')
          : '-',
      };

      if (topic.videoUrl) {
        items.push({
          ...base,
          id: `${topic.id}-video`,
          title: `${topic.name} (Video)`,
          description: `Video for ${topic.name}`,
          type: 'video',
          fileName: topic.videoUrl.split('/').pop(),
          fileUrl: topic.videoUrl,
          fileSize: '-',
        });
      }
      if (topic.notesUrl) {
        items.push({
          ...base,
          id: `${topic.id}-notes`,
          title: `${topic.name} (Notes)`,
          description: `Notes for ${topic.name}`,
          type: 'notes',
          fileName: topic.notesUrl.split('/').pop(),
          fileUrl: topic.notesUrl,
          fileSize: '-',
        });
      }
      if (topic.questionsUrl) {
        items.push({
          ...base,
          id: `${topic.id}-paper`,
          title: `${topic.name} (Practice Paper)`,
          description: `Practice paper for ${topic.name}`,
          type: 'paper',
          fileName: topic.questionsUrl.split('/').pop(),
          fileUrl: topic.questionsUrl,
          fileSize: '-',
        });
      }
    });
  });

  return items;
};

export const contentService = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/content');
    return mapContentFromApi(data.content || []);
  },

  upload: async ({ filters, file, contentType }) => {
    const formData = new FormData();
    formData.append('gradeName', filters.class || '');
    formData.append('boardName', filters.board || '');
    formData.append('subjectName', filters.subject || '');
    formData.append('chapterName', filters.chapter || '');
    // formData.append('topicName', topicName || filters.topic || '');

    const fieldMap = { video: 'videoUrl', notes: 'notesUrl', paper: 'questionsUrl' };
    const fieldName = fieldMap[contentType] || 'videoUrl';
    formData.append(fieldName, file);

    const { data } = await axiosInstance.post('/admin/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

export default contentService;
