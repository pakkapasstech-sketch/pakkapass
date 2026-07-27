import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconMap';

const StatisticCard = ({
  title,
  value,
  formattedValue,
  iconBg,
  iconColor,
  icon,
  subtext
}) => {


  const Icon = typeof icon === 'string' ? getIcon(icon) : (icon || getIcon('dashboard'));

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

      <div className="stat-value">
        {formattedValue ??
          (typeof value === 'number'
            ? value.toLocaleString('en-IN')
            : value)}
      </div>
      {subtext && (
        <div style={{ width: '100%', fontSize: '13px' }}>
          {subtext}
        </div>
      )}
    </motion.div>
  );
};

export default StatisticCard;