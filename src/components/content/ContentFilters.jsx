import { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import EntityModal from './EntityModal';
// import { hierarchyData } from '../../data/hierarchyData';
//import { useQuery } from '@tanstack/react-query';
//import axiosInstance from '../../api/axiosInstance';
import './contentFilters.css';

const ContentFilters = ({
  filters,
  setFilters,
  disableContentFilter,
  hierarchy,
  options,
  onEntityAdded,
}) => {
  const [modal, setModal] = useState(null);
  //   const { data: grades = [] } =
  // useQuery({
  //   queryKey: ['grades'],
  //   queryFn: async () => {
  //     const { data } =
  //       await axiosInstance.get(
  //         '/admin/content/options'
  //       );

  //     return data.grades || [];
  //   },
  // });

  const update = (field, value) => {
    const resetMap = {
      class: [
        'board',
        'course',
        'subject',
        'chapter',
        'section',
        // 'topic',
        'contentType',
      ],

      board: [
        'course',
        'subject',
        'chapter',
        'section',
        // 'topic',
        'contentType',
      ],

      course: [
        'subject',
        'chapter',
        'section',
        // 'topic',
        'contentType',
      ],

      subject: [
        'chapter',
        'section',
        // 'topic',
        'contentType',
      ],

      chapter: [
        'section',
        // 'topic',
        'contentType',
      ],

      section: ['contentType'],
    };

    setFilters((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      resetMap[field]?.forEach((key) => {
        next[key] = '';
      });

      return next;
    });
  };
  const contentOptions = [
    'video',
    'notes',
    // 'Question Paper',
  ];

  /*
  =====================
  Dynamic Options
  =====================
  */

  const classOptions = options?.grades?.map((grade) => grade.name) || [];

  const selectedClass = hierarchy.find((item) => item.name === filters.class) || {
    boards: [],
  };

  const boardOptions = filters.class ? options?.boards?.map((board) => board.name) || [] : [];
  const selectedBoard = selectedClass?.boards?.find((board) => board.name === filters.board);

  const courseOptions = filters.board ? options?.branches?.map((branch) => branch.name) || [] : [];
  const selectedCourse = selectedBoard?.courses?.find((course) => course.name === filters.course);

  const subjectOptions = filters.course
    ? options?.subjects?.map((subject) => subject.name) || []
    : [];
  const selectedSubject = selectedCourse?.subjects?.find(
    (subject) => subject.name === filters.subject
  );

  const chapterOptions =
  options?.chapters
    ?.filter((chapter) => {
      const subjectMatch =
        chapter.subject?.name ===
        filters.subject;

      const gradeMatch =
        chapter.grade?.name ===
        filters.class;

      const boardMatch =
        chapter.board?.name ===
        filters.board;

      const branchMatch =
        filters.course
          ? chapter.branch?.name ===
            filters.course
          : !chapter.branch;

      return (
        subjectMatch &&
        gradeMatch &&
        boardMatch &&
        branchMatch
      );
    })
    .map((chapter) => chapter.name) || [];
  const selectedChapterObj =
  options?.chapters?.find(
    (chapter) =>
      chapter.name ===
        filters.chapter &&
      chapter.subject?.name ===
        filters.subject &&
      chapter.grade?.name ===
        filters.class &&
      chapter.board?.name ===
        filters.board &&
      (filters.course
        ? chapter.branch?.name ===
          filters.course
        : !chapter.branch)
  );

const sectionOptions =
  options?.topics
    ?.filter(
      (topic) =>
        topic.chapterId ===
        selectedChapterObj?.id
    )
    .map((topic) => topic.name) || [];
  // const selectedSection =
  //   selectedChapter?.sections.find(
  //     (section) =>
  //       section.name ===
  //       filters.section
  //   );

  // const topicOptions =
  //   selectedSection?.topics.map(
  //     (topic) =>
  //       topic.name
  //   ) || [];

  return (
    <>
      <div className="content-filters">
        {/* Class */}

        <FilterDropdown
          label="Class"
          value={filters.class}
          options={classOptions}
          onSelect={(v) => update('class', v)}
          onAdd={() => setModal('Add Class')}
        />

        {/* Board */}

        <FilterDropdown
          label="Board"
          value={filters.board}
          disabled={!filters.class}
          options={boardOptions}
          onSelect={(v) => update('board', v)}
          onAdd={() => setModal('Add Board')}
        />

        {/* Course */}

        <FilterDropdown
          label="Course"
          value={filters.course}
          disabled={!filters.board}
          options={courseOptions}
          onSelect={(v) => update('course', v)}
          onAdd={() => setModal('Add Course')}
        />

        {/* Subject */}

        <FilterDropdown
          label="Subject"
          value={filters.subject}
          disabled={!filters.course}
          options={subjectOptions}
          onSelect={(v) => update('subject', v)}
          onAdd={() => setModal('Add Subject')}
        />

        {/* Chapter */}

        <FilterDropdown
          label="Chapter"
          value={filters.chapter}
          disabled={!filters.subject}
          options={chapterOptions}
          onSelect={(v) => update('chapter', v)}
          onAdd={() => setModal('Add Chapter')}
        />

        {/* Section */}

        <FilterDropdown
          label="Topic"
          value={filters.section}
          disabled={!filters.chapter}
          options={sectionOptions}
          onSelect={(v) => update('section', v)}
          onAdd={() => setModal('Add Section')}
        />

        {/* Topic */}

        {/* <FilterDropdown 
//   label="Topic"
//   value={filters.topic}
//   disabled={!filters.section}
//   options={topicOptions}
//   onSelect={(v) =>
//     update(
//       'topic',
//       v
//     )
//   }
//   onAdd={() =>
//     setModal(
//       'Add Topic'
//     )
//   }
// />*/}

        {/* Content */}

        <FilterDropdown
          label="Content"
          value={filters.contentType}
          disabled={!filters.section || disableContentFilter}
          options={contentOptions}
          onSelect={(v) => update('contentType', v)}
          onAdd={() => {}}
        />
      </div>
{modal && (
  <EntityModal
    title={modal}
    filters={filters}
    onClose={() => setModal(null)}
    onEntityAdded={onEntityAdded}
  />
)}
   </>
  );
};

export default ContentFilters;
