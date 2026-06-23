import { useState } from 'react';
import { indianStates } from '../../data/states';
import '../../styles/student-filters.css';
import { useStudents, useStudentFilterOptions } from '../../hooks/useStudents';

const statuses = [
  'All',
  'Active',
  'Inactive',
];

const StudentFilters = ({
  onFilterChange,
}) => {
  const [filters, setFilters] =
    useState({
      search: '',
      class: '',
      board: '',
      college: '',
      state: '',
      status: '',
    });

  const {
    data: options,
  } = useStudentFilterOptions();

  const {
    data: students = [],
  } = useStudents();

  const classes = [
    'All Classes',
    ...(options?.grades?.map(
      (g) => g.name
    ) || []),
  ];

  const boards = [
    'All Boards',
    ...(options?.boards?.map(
      (b) => b.name
    ) || []),
  ];

  const colleges = [
    'All Colleges',
    ...new Set(
      students
        .map(
          (student) =>
            student.institution
        )
        .filter(Boolean)
    ),
  ];

  const handleChange = (
    field,
    value
  ) => {
    const updated = {
      ...filters,
      [field]:
        value.startsWith(
          'All'
        )
          ? ''
          : value,
    };

    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="student-filters">
      <input
        type="text"
        placeholder="Search by Name..."
        value={filters.search}
        onChange={(e) =>
          handleChange(
            'search',
            e.target.value
          )
        }
      />

      <select
        value={
          filters.class ||
          'All Classes'
        }
        onChange={(e) =>
          handleChange(
            'class',
            e.target.value
          )
        }
      >
        {classes.map((item) => (
          <option key={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={
          filters.board ||
          'All Boards'
        }
        onChange={(e) =>
          handleChange(
            'board',
            e.target.value
          )
        }
      >
        {boards.map((item) => (
          <option key={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={
          filters.college ||
          'All Colleges'
        }
        onChange={(e) =>
          handleChange(
            'college',
            e.target.value
          )
        }
      >
        {colleges.map(
          (college) => (
            <option
              key={college}
            >
              {college}
            </option>
          )
        )}
      </select>

      <select
        value={
          filters.state ||
          'All States'
        }
        onChange={(e) =>
          handleChange(
            'state',
            e.target.value
          )
        }
      >
        <option>
          All States
        </option>

        {indianStates.map(
          (state) => (
            <option
              key={state}
            >
              {state}
            </option>
          )
        )}
      </select>

      <select
        value={
          filters.status ||
          'All'
        }
        onChange={(e) =>
          handleChange(
            'status',
            e.target.value
          )
        }
      >
        {statuses.map(
          (status) => (
            <option
              key={status}
            >
              {status}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default StudentFilters;