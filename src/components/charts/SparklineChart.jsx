import { LineChart, Line, ResponsiveContainer } from 'recharts';

const SparklineChart = ({ data = [], color = '#4f46e5' }) => {
  const chartData = (data || []).map((value, index) => ({
    index,
    value,
  }));

  if (!chartData.length) {
    return <div className="h-full w-full" />;
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={60}
      minWidth={0}
    >
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparklineChart;