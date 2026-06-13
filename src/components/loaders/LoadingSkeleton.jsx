const Box = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} />
);

export const StatCardSkeleton = () => (
  <div className="rounded-xl bg-white p-5 shadow-[var(--shadow-card)] dark:bg-[var(--color-card)]">
    <Box className="h-10 w-10 rounded-lg" />
    <Box className="mt-4 h-3 w-32" />
    <Box className="mt-2 h-7 w-24" />
    <Box className="mt-2 h-3 w-20" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="rounded-xl bg-white p-5 shadow-[var(--shadow-card)] dark:bg-[var(--color-card)]">
    <Box className="h-5 w-40" />
    <Box className="mt-4 h-[240px] w-full" />
  </div>
);

export const TableSkeleton = () => (
  <div className="rounded-xl bg-white p-5 shadow-[var(--shadow-card)] dark:bg-[var(--color-card)]">
    <div className="mb-4 flex justify-between">
      <Box className="h-5 w-36" />
      <Box className="h-4 w-16" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <Box key={i} className="mb-3 h-10 w-full" />
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <TableSkeleton />
      <TableSkeleton />
      <TableSkeleton />
    </div>
  </div>
);

export default Box;
