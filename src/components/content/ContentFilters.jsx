import {  useState } from 'react';
import FilterDropdown from './FilterDropdown';
import EntityModal from './EntityModal';
import { hierarchyData } from '../../data/hierarchyData';

import './contentFilters.css';

const ContentFilters = ({
  filters,
  setFilters,
  disableContentFilter,
}) => {
  const [modal, setModal] =
    useState(null);

  const update = (
    field,
    value
  ) => {
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

      section: [
  'contentType',
],
    };

    setFilters((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      resetMap[field]?.forEach(
        (key) => {
          next[key] = '';
        }
      );

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


  const classOptions =
    hierarchyData.map(
      (item) => item.name
    );

  const selectedClass =
    hierarchyData.find(
      (item) =>
        item.name ===
        filters.class
    );

  const boardOptions =
    selectedClass?.boards.map(
      (board) => board.name
    ) || [];

  const selectedBoard =
    selectedClass?.boards.find(
      (board) =>
        board.name ===
        filters.board
    );

  const courseOptions =
    selectedBoard?.courses.map(
      (course) => course.name
    ) || [];

  const selectedCourse =
    selectedBoard?.courses.find(
      (course) =>
        course.name ===
        filters.course
    );

 const subjectOptions =
  selectedCourse?.subjects.map(
    (subject) => subject.name
  ) || [];

const selectedSubject =
  selectedCourse?.subjects.find(
    (subject) =>
      subject.name ===
      filters.subject
  );

const chapterOptions =
  selectedSubject?.chapters.map(
    (chapter) =>
      chapter.name
  ) || [];

const selectedChapter =
  selectedSubject?.chapters.find(
    (chapter) =>
      chapter.name ===
      filters.chapter
  );

const sectionOptions =
  selectedChapter?.sections.map(
    (section) =>
      section.name
  ) || [];

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
          options={
            classOptions
          }
          onSelect={(v) =>
            update(
              'class',
              v
            )
          }
          onAdd={() =>
            setModal(
              'Add Class'
            )
          }
        />

        {/* Board */}

        <FilterDropdown
          label="Board"
          value={filters.board}
          disabled={
            !filters.class
          }
          options={
            boardOptions
          }
          onSelect={(v) =>
            update(
              'board',
              v
            )
          }
          onAdd={() =>
            setModal(
              'Add Board'
            )
          }
        />

        {/* Course */}

        <FilterDropdown
          label="Course"
          value={filters.course}
          disabled={
            !filters.board
          }
          options={
            courseOptions
          }
          onSelect={(v) =>
            update(
              'course',
              v
            )
          }
          onAdd={() =>
            setModal(
              'Add Course'
            )
          }
        />

        {/* Subject */}

        <FilterDropdown
          label="Subject"
          value={
            filters.subject
          }
          disabled={
            !filters.course
          }
          options={
            subjectOptions
          }
          onSelect={(v) =>
            update(
              'subject',
              v
            )
          }
          onAdd={() =>
            setModal(
              'Add Subject'
            )
          }
        />

        {/* Chapter */}

        <FilterDropdown
          label="Chapter"
          value={
            filters.chapter
          }
          disabled={
            !filters.subject
          }
          options={
            chapterOptions
          }
          onSelect={(v) =>
            update(
              'chapter',
              v
            )
          }
          onAdd={() =>
            setModal(
              'Add Chapter'
            )
          }
        />

        {/* Section */}

        <FilterDropdown
          label="Section"
          value={
            filters.section
          }
          disabled={
            !filters.chapter
          }
          options={
            sectionOptions
          }
          onSelect={(v) =>
            update(
              'section',
              v
            )
          }
          onAdd={() =>
            setModal(
              'Add Section'
            )
          }
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
  disabled={
    !filters.section ||
    disableContentFilter
  }
  options={contentOptions}
  onSelect={(v) =>
    update(
      'contentType',
      v
    )
  }
  onAdd={() => {}}
/>
      </div>

      {modal && (
        <EntityModal
          title={modal}
          onClose={() =>
            setModal(null)
          }
        />
      )}
    </>
  );
};

export default ContentFilters;