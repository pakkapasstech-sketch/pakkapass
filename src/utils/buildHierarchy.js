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

    const hierarchyType =
      item.hierarchyType ||
      'Chapters';

    const chapter =
      item.chapter || 'Unknown';

    const section =
      item.section || 'Unknown';

    if (!classes[grade]) {
      classes[grade] = {
        id: grade,
        name: grade,
        boards: {},
      };
    }

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
        contentTypes: {},
      };
    }

    const subjectNode =
      classes[grade]
        .boards[board]
        .courses[course]
        .subjects[subject];

    if (
      !subjectNode
        .contentTypes[
          hierarchyType
        ]
    ) {
      subjectNode
        .contentTypes[
          hierarchyType
        ] = {
        id:
          hierarchyType,
        name:
          hierarchyType,
        chapters: {},
      };
    }

    const typeNode =
      subjectNode
        .contentTypes[
          hierarchyType
        ];

    if (
      !typeNode.chapters[
        chapter
      ]
    ) {
      typeNode.chapters[
        chapter
      ] = {
        id: chapter,
        name: chapter,
        sections: {},
      };
    }

    if (
      !typeNode
        .chapters[chapter]
        .sections[section]
    ) {
      typeNode
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
          ).map(
            (subject) => ({
              ...subject,
              contentTypes:
                Object.values(
                  subject.contentTypes
                ).map(
                  (type) => ({
                    ...type,
                    chapters:
                      Object.values(
                        type.chapters
                      ).map(
                        (
                          chapter
                        ) => ({
                          ...chapter,
                          sections:
                            Object.values(
                              chapter.sections
                            ),
                        })
                      ),
                  })
                ),
            })
          ),
      })),
    })),
  }));
};