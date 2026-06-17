import {
  HiOutlineSearch,
  HiOutlineDownload,
} from "react-icons/hi";
import "../../styles/ParentsManagement.css"
const parents = [
  {
    id: "P001",
    name: "Ramesh Kumar",
    email: "ramesh@gmail.com",
    phone: "+91 9876543210",
    students: 2,
    status: "Active",
  },
  {
    id: "P002",
    name: "Priya Sharma",
    email: "priya@gmail.com",
    phone: "+91 9123456780",
    students: 1,
    status: "Active",
  },
  {
    id: "P003",
    name: "Sunil Verma",
    email: "sunil@gmail.com",
    phone: "+91 9988776655",
    students: 3,
    status: "Inactive",
  },
];

const ParentsManagement = () => {
  return (
    <div className="parents-page">
      {/* Header */}
      <div className="parents-header">
        {/*<div>
          <h1>Parents Management</h1>
          <p>Manage parent accounts and student associations.</p>
        </div>

        <button className="primary-btn">
          <HiOutlinePlus />
          Add Parent
        </button>*/}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h2>1,248</h2>
          <p>Total Parents</p>
        </div>

        <div className="stat-card">
          <h2>1,090</h2>
          <p>Active Parents</p>
        </div>

        <div className="stat-card">
          <h2>158</h2>
          <p>Inactive Parents</p>
        </div>

        <div className="stat-card">
          <h2>1.8</h2>
          <p>Avg Students / Parent</p>
        </div>
      </div>

      {/* Filters */}
      <div className="table-toolbar">
        <div className="search-box">
          <HiOutlineSearch />
          <input
            type="text"
            placeholder="Search parents..."
          />
        </div>

        <div className="toolbar-actions">
          <select>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button className="secondary-btn">
            <HiOutlineDownload />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="parents-table">
          <thead>
            <tr>
              <th>Parent ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {parents.map((parent) => (
              <tr key={parent.id}>
                <td>{parent.id}</td>
                <td>{parent.name}</td>
                <td>{parent.email}</td>
                <td>{parent.phone}</td>
                <td>{parent.students}</td>

                <td>
                  <span
                    className={`status-badge ${
                      parent.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {parent.status}
                  </span>
                </td>

                <td>
                  <button className="action-btn">
                    View
                  </button>

                  <button className="action-btn">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParentsManagement;