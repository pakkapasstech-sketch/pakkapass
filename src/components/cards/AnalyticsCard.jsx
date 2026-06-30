import { motion } from 'framer-motion';
//import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import { getIcon } from '../../utils/iconMap';
//import SparklineChart from '../charts/SparklineChart';

const AnalyticsCard = ({ title, value,   color, icon}) => {
  

  const Icon = getIcon(icon);

  return (
    <motion.div
  whileHover={{ y: -2 }}
  className="analytics-card"
>
  <div className="analytics-header">
    <div
      className="icon-box icon-box-sm"
      style={{
        backgroundColor: `${color}15`,
      }}
    >
      <Icon
        className="icon"
        style={{ color }}
      />
    </div>

    <div className="analytics-content">
      <p className="analytics-title">
        {title}
      </p>

      <p className="analytics-value">
        {typeof value === 'number'
          ? value.toLocaleString(
              'en-IN'
            )
          : value}
      </p>
    </div>
  </div>

</motion.div>
  );
};

export default AnalyticsCard;
