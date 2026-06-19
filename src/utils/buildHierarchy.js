export const buildHierarchy = (
  content = []
) => {
  const classes = {};

  content.forEach((item) => {
    const grade =
      item.grade || 'Unknown';

    const board =
      item.board || 'Unknown';

    const course =
      item.course || 'General';

    const subject =
      item.subject || 'Unknown';

    // Create grade
    if (!classes[grade]) {
      classes[grade] = {
        id: grade,
        name: grade,
        boards: {},
      };
    }

    // Create board
    if (
      !classes[grade].boards[board]
    ) {
      classes[grade].boards[
        board
      ] = {
        id: board,
        name: board,
        courses: {},
      };
    }

    // Create course
    if (
      !classes[grade]
        .boards[board]
        .courses[course]
    ) {
      classes[grade]
        .boards[board]
        .courses[course] = {
        id: course,
        name: course,
        subjects: {},
      };
    }

    // Create subject
    if (
      !classes[grade]
        .boards[board]
        .courses[course]
        .subjects[subject]
    ) {
      classes[grade]
        .boards[board]
        .courses[course]
        .subjects[subject] = {
        id: subject,
        name: subject,
        chapters: {},
      };
    }

    // ❌ Do not create chapter/section for papers
    if (item.type === 'paper') {
      return;
    }

    const chapter =
      item.chapter || 'Unknown';

    const section =
      item.section || 'Unknown';

    // Create chapter
    if (
      !classes[grade]
        .boards[board]
        .courses[course]
        .subjects[subject]
        .chapters[chapter]
    ) {
      classes[grade]
        .boards[board]
        .courses[course]
        .subjects[subject]
        .chapters[chapter] = {
        id: chapter,
        name: chapter,
        sections: {},
      };
    }

    // Create section
    if (
      !classes[grade]
        .boards[board]
        .courses[course]
        .subjects[subject]
        .chapters[chapter]
        .sections[section]
    ) {
      classes[grade]
        .boards[board]
        .courses[course]
        .subjects[subject]
        .chapters[chapter]
        .sections[section] = {
        id: section,
        name: section,
      };
    }
  });

  return Object.values(
    classes
  ).map((grade) => ({
    ...grade,
    boards: Object.values(
      grade.boards
    ).map((board) => ({
      ...board,
      courses: Object.values(
        board.courses
      ).map((course) => ({
        ...course,
        subjects:
          Object.values(
            course.subjects
          ).map((subject) => ({
            ...subject,
            chapters:
              Object.values(
                subject.chapters
              ).map(
                (chapter) => ({
                  ...chapter,
                  sections:
                    Object.values(
                      chapter.sections
                    ),
                })
              ),
          })),
      })),
    })),
  }));
};