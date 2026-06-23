import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineSearch,
} from 'react-icons/hi';
import '../../styles/subscriptionManagement.css';
import { getPlans } from '../../services/SubscriptionServices';

const SubscriptionManagementPage = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] =
    useState('');
  const [selectedBoard, setSelectedBoard] =
    useState('');
  const [selectedBranch, setSelectedBranch] =
    useState('');
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);

      const data =
        await getPlans();

      console.log(
        'Plans API Response:',
        data
      );

      setPlans(data || []);
    } catch (err) {
      console.error(
        'Failed to load plans:',
        err
      );
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const searchMatch =
        plan.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const classMatch =
        !selectedClass ||
        plan.grade?.name?.toLowerCase() ===
          selectedClass.toLowerCase();

      const boardMatch =
        !selectedBoard ||
        plan.board?.name?.toLowerCase() ===
          selectedBoard.toLowerCase();

      const branchMatch =
        !selectedBranch ||
        plan.branch?.name?.toLowerCase() ===
          selectedBranch.toLowerCase();

      return (
        searchMatch &&
        classMatch &&
        boardMatch &&
        branchMatch
      );
    });
  }, [
    plans,
    search,
    selectedClass,
    selectedBoard,
    selectedBranch,
  ]);

  return (
    <div className="subscription-management-page">
      <div className="subscription-header">
        <div>
          <h1>Subscription Plans</h1>

          <p className="subscription-description">
            Manage pricing plans and
            academic mappings.
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
                setSearch(
                  e.target.value
                )
              }
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) =>
              setSelectedClass(
                e.target.value
              )
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
              setSelectedBoard(
                e.target.value
              )
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
              setSelectedBranch(
                e.target.value
              )
            }
          >
            <option value="">
              All Branches
            </option>
            <option value="PCM">
              PCM
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
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-table"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredPlans.length >
                0 ? (
                filteredPlans.map(
                  (plan) => (
                    <tr
                      key={plan.id}
                      className="clickable-row"
                      onClick={() =>
                        navigate(
                          `/admin/subscriptions/plans/${plan.id}`
                        )
                      }
                    >
                      <td>
                        {plan.name}
                      </td>

                      <td>
                        ₹
                        {Number(
                          plan.price || 0
                        ).toLocaleString(
                          'en-IN'
                        )}
                      </td>

                      <td>
                        {
                          plan.durationDays
                        }{' '}
                        Days
                      </td>

                      <td>
                        <span className="status-pill active">
                          Active
                        </span>
                      </td>

                      <td>
                        {plan.createdAt
                          ? new Date(
                              plan.createdAt
                            ).toLocaleDateString(
                              'en-IN'
                            )
                          : '-'}
                      </td>
                    </tr>
                  )
                )
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