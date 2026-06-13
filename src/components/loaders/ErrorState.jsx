import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-[var(--shadow-card)] dark:bg-[var(--color-card)]">
    <HiOutlineExclamationCircle className="h-12 w-12 text-red-500" />
    <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">Failed to load data</h3>
    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        <HiOutlineRefresh className="h-4 w-4" />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
