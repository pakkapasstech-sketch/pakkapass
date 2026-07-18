import { useState } from 'react';
import { indianStates } from '../../data/states';
import { HiOutlineSearch } from 'react-icons/hi';
import '../../styles/student-filters.css';
import { useStudents, useStudentFilterOptions } from '../../hooks/useStudents';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
const statuses = [
  'All Status',
  'Active',
  'Inactive',
  'Trial',
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

  const handleChange = (field, value) => {
  const updated = {
    ...filters,
    [field]: value.startsWith('All') ? '' : value,
  };



  setFilters(updated);
  onFilterChange(updated);
};

  return (
    <div className="student-filters-container">
      <div className="student-filters-row">
        <div className="student-search-row">
          <div className="search-box">
            <HiOutlineSearch />
            <input
              type="text"
              placeholder="Search students by name, email, phone, refcode..."
              value={filters.search}
              onChange={(e) =>
                handleChange(
                  'search',
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div className="class-dropdown-wrapper">
          <CommonFilterDropdown
            placeholder="All Classes"
            value={filters.class || 'All Classes'}
            options={classes}
            onChange={(value) =>
              handleChange('class', value)
            }
          />
        </div>

        <div className="status-dropdown-wrapper">
          <CommonFilterDropdown
            placeholder="All Status"
            value={filters.status || 'All Status'}
            options={statuses}
            onChange={(value) =>
              handleChange('status', value)
            }
          />
        </div>
      </div>

      {/* 
      <div className="student-dropdowns-row">
        <CommonFilterDropdown
          placeholder="All Boards"
          value={filters.board || 'All Boards'}
          options={boards}
          onChange={(value) =>
            handleChange('board', value)
          }
        />

        <CommonFilterDropdown
          placeholder="All Colleges"
          value={filters.college || 'All Colleges'}
          options={colleges}
          onChange={(value) =>
            handleChange('college', value)
          }
        />

        <CommonFilterDropdown
          placeholder="All States"
          value={filters.state || 'All States'}
          options={[
            'All States',
            ...indianStates,
          ]}
          onChange={(value) =>
            handleChange('state', value)
          }
        />
      </div>
      */}
    </div>
  );
};

export default StudentFilters;