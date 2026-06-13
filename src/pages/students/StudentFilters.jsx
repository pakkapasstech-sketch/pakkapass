import { useState } from "react";
import { indianStates } from "../../data/states";
import "../../styles/student-filters.css";

const classes = [
  "All Classes",
  ...Array.from({ length: 12 }, (_, i) => `${i + 1}th`)
];

const boards = [
  "All Boards",
  "CBSE",
  "ICSE",
  "State Board"
];

const statuses = [
  "All",
  "Active",
  "Inactive"
];

const StudentFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    class: "",
    board: "",
    state: "",
    status: ""
  });

  const handleChange = (field, value) => {
    const updated = {
      ...filters,
      [field]: value
    };

    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="student-filters">
      <input
        type="text"
        placeholder="Search by Name..."
        onChange={(e) =>
          handleChange("search", e.target.value)
        }
      />

      <select
        onChange={(e) =>
          handleChange("class", e.target.value)
        }
      >
        {classes.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        onChange={(e) =>
          handleChange("board", e.target.value)
        }
      >
        {boards.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        onChange={(e) =>
          handleChange("state", e.target.value)
        }
      >
        <option>All States</option>

        {indianStates.map((state) => (
          <option key={state}>{state}</option>
        ))}
      </select>

      <select
        onChange={(e) =>
          handleChange("status", e.target.value)
        }
      >
        {statuses.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
    </div>
  );
};

export default StudentFilters;