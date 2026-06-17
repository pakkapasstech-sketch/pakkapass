import { hierarchyData } from '../data/hierarchyData';

export const mockContent = [];

hierarchyData.forEach((cls) => {
  cls.boards.forEach((board) => {
    board.courses.forEach((course) => {
      course.subjects.forEach((subject) => {
        subject.chapters.forEach((chapter) => {
          chapter.sections.forEach((section) => {
            section.topics.forEach((topic) => {
              mockContent.push(
                {
                  id: `${topic.id}-video`,
                  title: `${topic.name} Video`,
                  topic: topic.name,
                  chapter: chapter.name,
                  subject: subject.name,
                  board: board.name,
                  grade: cls.name,
                  type: 'video',
                  fileName: `${topic.name}.mp4`,
                  fileUrl: '#',
                  fileSize: '120 MB',
                  uploadedOn: '17 Jun 2026',
                },
                {
                  id: `${topic.id}-notes`,
                  title: `${topic.name} Notes`,
                  topic: topic.name,
                  chapter: chapter.name,
                  subject: subject.name,
                  board: board.name,
                  grade: cls.name,
                  type: 'notes',
                  fileName: `${topic.name}.pdf`,
                  fileUrl: '#',
                  fileSize: '2 MB',
                  uploadedOn: '17 Jun 2026',
                },
                {
                  id: `${topic.id}-paper`,
                  title: `${topic.name} Practice Paper`,
                  topic: topic.name,
                  chapter: chapter.name,
                  subject: subject.name,
                  board: board.name,
                  grade: cls.name,
                  type: 'paper',
                  fileName: `${topic.name}-paper.pdf`,
                  fileUrl: '#',
                  fileSize: '1 MB',
                  uploadedOn: '17 Jun 2026',
                }
              );
            });
          });
        });
      });
    });
  });
});