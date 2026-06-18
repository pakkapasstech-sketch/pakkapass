export const mockContent = [];
import { hierarchyData } from "../data/hierarchyData";
hierarchyData.forEach((cls) => {
  cls.boards.forEach((board) => {
    board.courses.forEach((course) => {
      course.subjects.forEach((subject) => {
        // Videos & Notes
        subject.chapters.forEach((chapter) => {
          chapter.sections.forEach((section) => {
            mockContent.push(
              {
                id: `${section.id}-video`,
                title: `${section.name} Video`,
                section: section.name,
                chapter: chapter.name,
                subject: subject.name,
                board: board.name,
                grade: cls.name,
                type: 'video',
                fileName: `${section.name}.mp4`,
                fileUrl: '#',
                fileSize: '120 MB',
                uploadedOn: '17 Jun 2026',
              },
              {
                id: `${section.id}-notes`,
                title: `${section.name} Notes`,
                section: section.name,
                chapter: chapter.name,
                subject: subject.name,
                board: board.name,
                grade: cls.name,
                type: 'notes',
                fileName: `${section.name}.pdf`,
                fileUrl: '#',
                fileSize: '2 MB',
                uploadedOn: '17 Jun 2026',
              }
            );
          });
        });

        // Question Papers
        subject.questionPapers.forEach((paper) => {
          mockContent.push({
            id: `${paper.id}-paper`,
            title: paper.name,
            subject: subject.name,
            board: board.name,
            grade: cls.name,
            type: 'paper',
            fileName: `${paper.name}.pdf`,
            fileUrl: '#',
            fileSize: '1 MB',
            uploadedOn: '17 Jun 2026',
          });
        });
      });
    });
  });
});