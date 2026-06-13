import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineCalendar,
  HiOutlineBell,
  HiOutlineDownload,
  HiOutlineChevronDown,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../common/Avatar';

import '../../styles/navbar.css';

const Navbar = ({ title = 'Dashboard Overview', subtitle, breadcrumbs = [] }) => {
  const { toggleMobileSidebar, toggleSidebar, isCollapsed } = useSidebar();

  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className={`navbar ${isCollapsed ? 'navbar-collapsed' : 'navbar-expanded'}`}>
      <div className="navbar-left">
        <button onClick={toggleMobileSidebar} className="navbar-icon-btn navbar-mobile-btn">
          <HiOutlineMenu className="navbar-icon" />
        </button>

        <button onClick={toggleSidebar} className="navbar-icon-btn navbar-desktop-btn">
          <HiOutlineMenu className="navbar-icon" />
        </button>

        <div className="navbar-title-wrapper">
          {breadcrumbs.length > 0 && (
            <nav className="navbar-breadcrumbs">
              {breadcrumbs.map((crumb, i) => (
                <span key={`${crumb.label}-${crumb.path}-${i}`} className="navbar-breadcrumb-item">
                  {i > 0 && <HiOutlineChevronRight className="navbar-breadcrumb-icon" />}

                  <Link to={crumb.path} className="navbar-breadcrumb-link">
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}

          <h1 className="navbar-title">{title}</h1>

          {subtitle && <p className="navbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="navbar-right">
        <button onClick={toggleTheme} className="navbar-icon-btn navbar-theme-btn">
          {isDark ? (
            <HiOutlineSun className="navbar-icon" />
          ) : (
            <HiOutlineMoon className="navbar-icon" />
          )}
        </button>

        <button className="navbar-date-btn">
          <HiOutlineCalendar className="navbar-small-icon" />

          <span className="navbar-date-text">May 20 – May 26, 2025</span>
        </button>

        <button className="navbar-icon-btn navbar-bell-btn">
          <HiOutlineBell className="navbar-icon" />

          <span className="navbar-notification-count">12</span>
        </button>

        <div className="navbar-profile">
          <button onClick={() => setProfileOpen((prev) => !prev)} className="navbar-profile-btn">
            <Avatar initials={user?.initials || 'SA'} size="sm" />

            <span className="navbar-user-name">{user?.name}</span>

            <HiOutlineChevronDown className="navbar-chevron" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="navbar-dropdown"
              >
                <p className="navbar-dropdown-name">{user?.name}</p>

                <p className="navbar-dropdown-email">{user?.email}</p>

                <Link to="/settings" className="navbar-dropdown-link">
                  Settings
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="navbar-download-btn">
          <HiOutlineDownload className="navbar-small-icon" />

          <span className="navbar-download-text">Download Report</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
