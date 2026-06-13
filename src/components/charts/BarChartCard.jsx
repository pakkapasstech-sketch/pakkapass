import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartSkeleton } from '../loaders/LoadingSkeleton';

const BarChartCard = ({
  title,
  data = [],
  dataKey = 'value',
  labelKey = 'label',
  color = '#4f46e5',
  isLoading,
}) => {
  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              dataKey={labelKey}
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
            />

            <Tooltip />

            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCard;