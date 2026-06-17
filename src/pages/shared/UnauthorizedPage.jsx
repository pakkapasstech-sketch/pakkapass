import { useNavigate } from 'react-router-dom';
import {
  HiOutlineLockClosed,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

import '../../styles/unauthorized.css';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          <HiOutlineLockClosed />
        </div>

        <span className="unauthorized-badge">
          Error 403
        </span>

        <h1>
          You don't have permission to
          access this page
        </h1>

        <p>
          The page you're trying to
          access requires permissions
          that are not assigned to your
          account. Please contact the
          administrator if you think
          this is a mistake.
        </p>

        <div className="unauthorized-actions">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <HiOutlineArrowLeft />
            Go Back
          </button>

          <button
            className="dashboard-btn"
            onClick={() =>
              navigate('/dashboard')
            }
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;