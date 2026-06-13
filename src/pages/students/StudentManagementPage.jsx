import { useState } from "react";
import StudentFilters from "./StudentFilters";
import StudentStatsCards from "./StudentStatsCards";
import StudentTable from "./StudentTable";
import "../../styles/student-management.css";
import { students } from "../../data/students";

const StudentManagementPage = () => {

  const [filters, setFilters] = useState({});

  const filteredStudents = students.filter(student => {

    const searchMatch =
      !filters.search ||
      student.name
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||

      student.mobile
        .includes(filters.search);

    const classMatch =
      !filters.class ||
      filters.class === "All Classes" ||
      student.class === filters.class;

    const boardMatch =
      !filters.board ||
      filters.board === "All Boards" ||
      student.board === filters.board;

    const stateMatch =
      !filters.state ||
      filters.state === "All States" ||
      student.state === filters.state;

    const statusMatch =
      !filters.status ||
      filters.status === "All" ||
      student.status === filters.status;

    return (
      searchMatch &&
      classMatch &&
      boardMatch &&
      stateMatch &&
      statusMatch
    );
  });

  return (
    <div className="student-management-page">
  <div className="page-header">
    <h1>Student Management</h1>
    <p>Manage and view all registered students.</p>
  </div>

  <StudentFilters onFilterChange={setFilters} />

  <StudentStatsCards />

  <StudentTable students={filteredStudents} />
</div>
  );
};

export default StudentManagementPage;