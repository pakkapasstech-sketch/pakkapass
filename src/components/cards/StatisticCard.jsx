import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconMap';
import { StatCardSkeleton } from '../loaders/LoadingSkeleton';

const StatisticCard = ({
  title,
  value,
  formattedValue,
  iconBg,
  iconColor,
  icon,
  isLoading,
}) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  const Icon = getIcon(icon);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="stat-card"
    >
      <div
        className={`icon-box icon-box-md ${iconBg}`}
      >
        <Icon
          className={`icon ${iconColor}`}
        />
      </div>

      <p className="stat-title">
        {title}
      </p>

      <p className="stat-value">
        {formattedValue ??
          (typeof value === 'number'
            ? value.toLocaleString('en-IN')
            : value)}
      </p>
    </motion.div>
  );
};

export default StatisticCard;