import { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
//import { DateRange } from 'react-date-range';
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
} from "react-icons/hi";
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../common/Avatar';
//import 'react-date-range/dist/styles.css';
//import 'react-date-range/dist/theme/default.css';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../styles/navbar.css';
import SidebarLogo from "../../assets/sidebarlogo.svg"

const Navbar = ({ title = 'Dashboard Overview', subtitle, breadcrumbs = [] }) => {
  const { toggleMobileSidebar, toggleSidebar, isCollapsed } = useSidebar();
  const navigate =
  useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 6000); // updates every second

  return () => clearInterval(timer);
}, []);
const {
  unreadCount,
} =
  useNotifications();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  // const [showCalendar, setShowCalendar] = useState(false);

  // const [dateRange, setDateRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: 'selection',
  //   },
  // ]);
  
  return (
   <header className="navbar">
  {/* Logo Section */}
  <div className="navbar-logo">
  <img
    src={SidebarLogo}
    alt="PakkaPass"
    className="navbar-logo-image"
  />

  {/* Desktop Sidebar Toggle */}
  <button
    className="navbar-sidebar-toggle"
    onClick={toggleSidebar}
  >
    {isCollapsed ? (
      <HiOutlineChevronRight />
    ) : (
      <HiOutlineChevronLeft />
    )}
  </button>
</div>

  {/* Left */}
  <div className="navbar-left">

    {/* Mobile menu only */}
    <button
      onClick={toggleMobileSidebar}
      className="navbar-icon-btn navbar-mobile-btn"
    >
      <HiOutlineMenu className="navbar-icon" />
    </button>

    <div className="navbar-title-wrapper">

      {breadcrumbs.length > 0 && (
        <nav className="navbar-breadcrumbs">
          {breadcrumbs.map((crumb, i) => (
            <span
              key={`${crumb.label}-${i}`}
              className="navbar-breadcrumb-item"
            >
              {i > 0 && (
                <HiOutlineChevronRight className="navbar-breadcrumb-icon" />
              )}

              <Link
                to={crumb.path}
                className="navbar-breadcrumb-link"
              >
                {crumb.label}
              </Link>
            </span>
          ))}
        </nav>
      )}

    </div>
  </div>

  {/* Right */}
  <div className="navbar-right">

    {/* Theme */}

    <button
      onClick={toggleTheme}
      className="navbar-icon-btn"
    >
      {isDark ? (
        <HiOutlineSun className="navbar-icon" />
      ) : (
        <HiOutlineMoon className="navbar-icon" />
      )}
    </button>

    {/* Time */}

    <div className="navbar-date-btn">
      <HiOutlineClock className="navbar-small-icon" />

      <span className="navbar-date-text">
        {format(currentTime, 'MMM dd, yyyy • hh:mm a')}
      </span>
    </div>

    {/* Notification */}

    <button
      className="navbar-icon-btn"
      onClick={() => navigate('/notifications')}
    >
      <HiOutlineBell className="navbar-icon" />

      {unreadCount > 0 && (
        <span className="navbar-notification-count">
          {unreadCount}
        </span>
      )}
    </button>

    {/* Profile */}

    <div className="navbar-profile">

      <button
        onClick={() =>
          setProfileOpen((prev) => !prev)
        }
        className="navbar-profile-btn"
      >
        <Avatar
          initials={user?.initials || 'SA'}
          size="sm"
        />

        <span className="navbar-user-name">
          {user?.name}
        </span>

        <HiOutlineChevronDown />
      </button>

      <AnimatePresence>

        {profileOpen && (

          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            className="navbar-dropdown"
          >
            <p className="navbar-dropdown-name">
              {user?.name}
            </p>

            <p className="navbar-dropdown-email">
              {user?.email}
            </p>

            <Link
              to="/settings"
              className="navbar-dropdown-link"
            >
              Settings
            </Link>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  </div>
</header>
  );
};

export default Navbar;
