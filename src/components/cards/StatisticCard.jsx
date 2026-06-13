import { motion } from 'framer-motion';
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import { getIcon } from '../../utils/iconMap';
import { StatCardSkeleton } from '../loaders/LoadingSkeleton';

const StatisticCard = ({
  title,
  formattedValue,
  trend,
  trendLabel,
  trendUp,
  iconBg,
  iconColor,
  icon,
  isLoading,
}) => {
  if (isLoading) return <StatCardSkeleton />;

  const Icon = getIcon(icon);
  const trendStr = `${trendUp ? '+' : ''}${trend}%`;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="stat-card"
    >
      <div className={`icon-box icon-box-md ${iconBg}`}>
  <Icon className={`icon ${iconColor}`} />
</div>

<p className="stat-title">
  {title}
</p>

<p className="stat-value">
  {formattedValue}
</p>

<div className="stat-trend">
  {trendUp ? (
    <HiOutlineTrendingUp
      className="icon-trend stat-trend-positive"
    />
  ) : (
    <HiOutlineTrendingDown
      className="icon-trend stat-trend-negative"
    />
  )}

  <span
    className={`stat-trend-value ${
      trendUp
        ? 'stat-trend-positive'
        : 'stat-trend-negative'
    }`}
  >
    {trendStr}
  </span>

  <span className="stat-trend-label">
    {trendLabel}
  </span>
</div>
    </motion.div>
  );
};

export default StatisticCard;