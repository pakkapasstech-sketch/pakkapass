import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartSkeleton } from '../loaders/LoadingSkeleton';

const COLORS = [
  '#4f46e5',
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
];

const PieChartCard = ({
  title,
  data = [],
  nameKey = 'name',
  valueKey = 'value',
  isLoading,
}) => {
  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: '11px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartCard;