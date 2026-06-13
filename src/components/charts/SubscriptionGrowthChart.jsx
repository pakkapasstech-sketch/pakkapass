import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartSkeleton } from '../loaders/LoadingSkeleton';
import { formatDate } from '../../utils/formatters';

const TooltipContent = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="tooltip-card">
      <p className="mb-1 text-xs text-[var(--color-text-secondary)]">
        {payload?.[0]?.payload?.date
          ? formatDate(payload[0].payload.date)
          : '-'}
      </p>

      {payload.map((e) => (
        <p
          key={e.name}
          className="text-xs"
          style={{ color: e.color }}
        >
          {e.name}: {e.value.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

const SubscriptionGrowthChart = ({
  data = [],
  isLoading,
}) => {
  if (isLoading) return <ChartSkeleton />;

  const chartData = (data || []).map((d) => {
    const parsedDate = new Date(d?.date);

    return {
      ...d,
      label:
        d?.date && !isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString('en-IN', {
              weekday: 'short',
            })
          : '-',
    };
  });

  return (
    <div className="chart-card">
      <h3 className="chart-title">
        Subscription Growth
      </h3>

      <div className="chart-body">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: '#9ca3af',
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: '#9ca3af',
              }}
              tickFormatter={(v) =>
                v >= 1000 ? `${v / 1000}k` : v
              }
            />

            <Tooltip content={<TooltipContent />} />

            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: '11px',
                paddingTop: '12px',
              }}
            />

            <Line
              type="monotone"
              dataKey="newSubscriptions"
              name="New Subscriptions"
              stroke="#1e3a8a"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="activeSubscriptions"
              name="Active Subscriptions"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubscriptionGrowthChart;