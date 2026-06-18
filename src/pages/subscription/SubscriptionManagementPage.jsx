import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  
} from 'react-icons/hi';
import '../../styles/subscriptionManagement.css';

const mockPlans = [
  {
    id: '1',
    name: 'Class 10 Annual Plan',
    price: '₹4,999',
    duration: '365 Days',
    status: 'Active',
    createdAt: '18 Jun 2026',
    classes: ['10th'],
    boards: ['State'],
    branches: ['All'],
  },
  {
    id: '2',
    name: 'Class 11 MPC Premium Plan',
    price: '₹2,999',
    duration: '180 Days',
    status: 'Active',
    createdAt: '15 Jun 2026',
    classes: ['11th', '12th'],
    boards: ['State'],
    branches: ['MPC'],
  },
  {
    id: '3',
    name: 'Class 12 CBSE Complete Access',
    price: '₹3,999',
    duration: '365 Days',
    status: 'Inactive',
    createdAt: '10 Jun 2026',
    classes: ['12th'],
    boards: ['CBSE'],
    branches: ['MPC', 'BiPC'],
  },
];

const SubscriptionManagementPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] =
    useState('');
  const [selectedBoard, setSelectedBoard] =
    useState('');
  const [selectedBranch, setSelectedBranch] =
    useState('');

  const filteredPlans = useMemo(() => {
    return mockPlans.filter((plan) => {
      const searchMatch = plan.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const classMatch =
        !selectedClass ||
        plan.classes.includes(selectedClass);

      const boardMatch =
        !selectedBoard ||
        plan.boards.includes(selectedBoard);

      const branchMatch =
        !selectedBranch ||
        plan.branches.includes(selectedBranch);

      return (
        searchMatch &&
        classMatch &&
        boardMatch &&
        branchMatch
      );
    });
  }, [
    search,
    selectedClass,
    selectedBoard,
    selectedBranch,
  ]);

  // const handleDelete = (id) => {
  //   console.log('Delete', id);
  // };

  return (
    <div className="subscription-management-page">
      <div className="subscription-header">
        <div>
          <h1>Subscription Plans</h1>

          <p className="subscription-description">
            Manage pricing plans and academic
            mappings.
          </p>
        </div>
      </div>

      <div className="subscription-card">
        <div className="subscription-toolbar">
          <div className="subscription-search">
            <HiOutlineSearch />

            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) =>
              setSelectedClass(e.target.value)
            }
          >
            <option value="">
              All Classes
            </option>
            <option value="10th">
              Class 10
            </option>
            <option value="11th">
              Class 11
            </option>
            <option value="12th">
              Class 12
            </option>
          </select>

          <select
            value={selectedBoard}
            onChange={(e) =>
              setSelectedBoard(e.target.value)
            }
          >
            <option value="">
              All Boards
            </option>
            <option value="State">
              State
            </option>
            <option value="CBSE">
              CBSE
            </option>
            <option value="ICSE">
              ICSE
            </option>
          </select>

          <select
            value={selectedBranch}
            onChange={(e) =>
              setSelectedBranch(e.target.value)
            }
          >
            <option value="">
              All Branches
            </option>
            <option value="MPC">
              MPC
            </option>
            <option value="BiPC">
              BiPC
            </option>
            <option value="MEC">
              MEC
            </option>
            <option value="CEC">
              CEC
            </option>
          </select>

          <button
            className="primary-btn"
            onClick={() =>
              navigate(
                '/admin/subscriptions/plans/create'
              )
            }
          >
            <HiOutlinePlus />
            Create Plan
          </button>
        </div>

        <div className="subscription-table-wrapper">
          <table className="subscription-table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Created Date</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>

            <tbody>
  {filteredPlans.length ? (
    filteredPlans.map((plan) => (
      <tr
        key={plan.id}
        className="clickable-row"
        onClick={() =>
          navigate(
            `/admin/subscriptions/plans/${plan.id}`
          )
        }
      >
        <td>{plan.name}</td>
        <td>{plan.price}</td>
        <td>{plan.duration}</td>

        <td>
          <span
            className={`status-pill ${plan.status.toLowerCase()}`}
          >
            {plan.status}
          </span>
        </td>

        <td>{plan.createdAt}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="5"
        className="empty-table"
      >
        No plans found
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;