import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

      <p className="text-xs font-semibold text-blue-600">
        ₹ {payload[0].value.toLocaleString('en-IN')}
      </p>
    </div>
  );
};

const RevenueTrendChart = ({ data = [], isLoading }) => {
  if (isLoading) return <ChartSkeleton />;

  const chartData = (data || []).map((d) => ({
    ...d,
    label: d?.date
      ? new Date(d.date).toLocaleDateString('en-IN', {
          weekday: 'short',
        })
      : '-',
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">
        Revenue Trend
      </h3>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="revenueGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3b82f6"
                  stopOpacity={0.2}
                />

                <stop
                  offset="95%"
                  stopColor="#3b82f6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

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
                `₹${(v / 100000).toFixed(0)}L`
              }
            />

            <Tooltip content={<TooltipContent />} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueTrendChart;