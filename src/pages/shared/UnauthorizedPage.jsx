import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div className="unauthorized-page">
    <h2>Access Denied</h2>
    <p>You don&apos;t have permission to view this page.</p>
    <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
  </div>
);

export default UnauthorizedPage;
