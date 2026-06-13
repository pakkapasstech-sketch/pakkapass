const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || 'default';

  const label = status
    ? status.charAt(0).toUpperCase() +
      status.slice(1)
    : 'Unknown';

  return (
    <span
      className={`status-badge status-${key}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
