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
  'selectedContentType',
  'selectedContentTypeId',
  'chapter',
  'chapterId',
  'section',
  'contentType',
],
selectedContentType: [
  'chapter',
  'chapterId',
  'section',
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
/*
=====================
Dynamic Options
=====================
*/

const classOptions =
  options?.grades?.map(
    (grade) => grade.name
  ) || [];

const selectedGradeObj = options?.grades?.find((g) => g.name === filters.class);

const boardOptions =
  filters.class && selectedGradeObj
    ? options?.boards
        ?.filter((board) => board.gradeId === selectedGradeObj.id || !board.gradeId)
        .map((board) => board.name) || []
    : [];

const courseOptions =
  filters.board && selectedGradeObj
    ? options?.branches
        ?.filter((branch) => branch.gradeId === selectedGradeObj.id || !branch.gradeId)
        .map((branch) => branch.name) || []
    : [];

const showCourse = ['11th', '12th'].includes(filters.class);

const subjectOptions =
  (showCourse ? filters.course : filters.board)
    ? options?.subjects
        ?.filter(
          (subject) =>
            subject.grade?.name === filters.class &&
            subject.board?.name === filters.board &&
            (!showCourse || subject.branch?.name === filters.course)
        )
        .map((subject) => subject.name) || []
    : [];
const contentTypeOptions =
  filters.subject
    ? options?.contentTypes?.map(
        (type) => type.name
      ) || []
    : [];
const chapterOptions =
  filters.subject &&
  filters.selectedContentType
    ? options?.chapters
        ?.filter(
          (chapter) =>
            chapter.grade?.name ===
              filters.class &&
            chapter.board?.name ===
              filters.board &&
            chapter.subject?.name ===
              filters.subject &&
            chapter.contentType
              ?.name ===
              filters.selectedContentType &&
            (
              !filters.course ||
              chapter.branch?.name ===
                filters.course
            )
        )
        .map(
          (chapter) =>
            chapter.name
        ) || []
    : [];

const selectedChapterObj =
  options?.chapters?.find(
    (chapter) =>
      chapter.name === filters.chapter &&
      chapter.grade?.name === filters.class &&
      chapter.board?.name === filters.board &&
      chapter.subject?.name === filters.subject &&
      chapter.contentType?.name ===
        filters.selectedContentType &&
      (
        !filters.course ||
        chapter.branch?.name === filters.course
      )
  );

const sectionOptions =
  filters.chapter
    ? options?.topics
        ?.filter(
          (topic) =>
            Number(topic.chapterId) ===
            Number(selectedChapterObj?.id)
        )
        .map((topic) => topic.name) || []
    : [];
        const getTitleLabel = () =>
  filters.selectedContentType
    ? filters.selectedContentType.replace(/s$/, '')
    : 'Title';

const getAddTitle = () =>
  filters.selectedContentType
    ? `Add ${filters.selectedContentType.replace(/s$/, '')}`
    : 'Add Title';
  return (
    <>
      <div className="content-filters">
        {/* Class */}

        <FilterDropdown
          label="Class"
          value={filters.class}
          options={classOptions}
          onSelect={(v) => {
            const grade = options?.grades?.find((g) => g.name === v);
            setFilters((prev) => ({
              ...prev,
              class: v,
              classId: grade?.id || '',
              board: '',
              boardId: '',
              course: '',
              courseId: '',
              subject: '',
              subjectId: '',
              selectedContentType: '',
              selectedContentTypeId: '',
              chapter: '',
              chapterId: '',
              section: '',
              sectionId: '',
              contentType: '',
            }));
          }}
          onAdd={() => setModal('Add Class')}
        />

        {/* Board */}

        <FilterDropdown
          label="Board"
          value={filters.board}
          disabled={!filters.class}
          options={boardOptions}
          onSelect={(v) => {
            const board = options?.boards?.find(
              (b) => b.name === v && (b.gradeId === selectedGradeObj?.id || !b.gradeId)
            );
            setFilters((prev) => ({
              ...prev,
              board: v,
              boardId: board?.id || '',
              course: '',
              courseId: '',
              subject: '',
              subjectId: '',
              selectedContentType: '',
              selectedContentTypeId: '',
              chapter: '',
              chapterId: '',
              section: '',
              sectionId: '',
              contentType: '',
            }));
          }}
          onAdd={() => setModal('Add Board')}
        />

        {/* Course */}

        {showCourse && (
          <FilterDropdown
            label="Course"
            value={filters.course}
            disabled={!filters.board}
            options={courseOptions}
            onSelect={(v) => {
              const branch = options?.branches?.find(
                (br) => br.name === v && (br.gradeId === selectedGradeObj?.id || !br.gradeId)
              );
              setFilters((prev) => ({
                ...prev,
                course: v,
                courseId: branch?.id || '',
                subject: '',
                subjectId: '',
                selectedContentType: '',
                selectedContentTypeId: '',
                chapter: '',
                chapterId: '',
                section: '',
                sectionId: '',
                contentType: '',
              }));
            }}
            onAdd={() => setModal('Add Course')}
          />
        )}

        {/* Subject */}

        <FilterDropdown
          label="Subject"
          value={filters.subject}
          disabled={showCourse ? !filters.course : !filters.board}
          options={subjectOptions}
          onSelect={(v) => {
            const subject = options?.subjects?.find(
              (s) =>
                s.name === v &&
                s.grade?.name === filters.class &&
                s.board?.name === filters.board &&
                (!showCourse || s.branch?.name === filters.course)
            );
            setFilters((prev) => ({
              ...prev,
              subject: v,
              subjectId: subject?.id || '',
              selectedContentType: '',
              selectedContentTypeId: '',
              chapter: '',
              chapterId: '',
              section: '',
              sectionId: '',
              contentType: '',
            }));
          }}
          onAdd={() => setModal('Add Subject')}
        />
<FilterDropdown
  label="Content Type"
  value={
    filters.selectedContentType
  }
  disabled={!filters.subject}
  options={
    contentTypeOptions
  }
  onSelect={(v) => {
    const type =
      options?.contentTypes?.find(
        (t) => t.name === v
      );

    setFilters((prev) => ({
      ...prev,
      selectedContentType: v,
      selectedContentTypeId:
        type?.id || '',
      chapter: '',
      chapterId: '',
      section: '',
      sectionId: '',
      contentType: '',
    }));
  }}
  onAdd={() =>
    setModal(
      'Add Content Type'
    )
  }
/>
        {/* Chapter */}

        <FilterDropdown
  label={getTitleLabel()}
  value={filters.chapter}
disabled={
  !filters.selectedContentType
}
  options={chapterOptions}
  onSelect={(v) => {
    const chapter = options?.chapters?.find(
      (c) =>
        c.name === v &&
        c.grade?.name === filters.class &&
        c.board?.name === filters.board &&
        c.subject?.name === filters.subject &&
        (!filters.course || c.branch?.name === filters.course)
    );

    setFilters((prev) => ({
      ...prev,
      chapter: v,
      chapterId: chapter?.id || '',
      section: '',
      sectionId: '',
      contentType: '',
    }));
  }}
  onAdd={() => setModal(getAddTitle())}
/>

        {/* Section */}

        <FilterDropdown
          label="Title"
          value={filters.section}
          disabled={!filters.chapter}
          options={sectionOptions}
          onSelect={(v) => {
            const topic = options?.topics?.find(
              (t) => t.name === v && Number(t.chapterId) === Number(selectedChapterObj?.id)
            );
            setFilters((prev) => ({
              ...prev,
              section: v,
              sectionId: topic?.id || '',
              contentType: '',
            }));
          }}
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
