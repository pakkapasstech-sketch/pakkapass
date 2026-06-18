import { useState } from 'react';
import { indianStates } from '../../data/states';
import '../../styles/student-filters.css';
import { students } from '../../data/students';

const classes = [
  'All Classes',
  ...Array.from(
    { length: 12 },
    (_, i) => `${i + 1}th`
  ),
];

const boards = [
  'All Boards',
  'CBSE',
  'ICSE',
  'State Board',
];

const colleges = [
  'All Colleges',
  ...new Set(
    students.map(
      (student) =>
        student.institution
    )
  ),
];

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
      {/* Search */}

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

      {/* Class */}

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

      {/* Board */}

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

      {/* College */}

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

      {/* State */}

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

      {/* Status */}

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