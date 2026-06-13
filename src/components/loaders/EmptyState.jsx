import { HiOutlineInbox } from 'react-icons/hi';

const EmptyState = ({ title = 'No data found', description = 'There is nothing to display yet.', action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-[var(--shadow-card)] dark:bg-[var(--color-card)]">
    <HiOutlineInbox className="h-12 w-12 text-[var(--color-text-muted)]" />
    <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
