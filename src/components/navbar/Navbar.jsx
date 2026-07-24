import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
//import { DateRange } from 'react-date-range';
import {
  //HiOutlineMenu,
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
import LogoutConfirmModal, { useLogoutConfirm } from '../modals/LogoutConfirmModal';
//import 'react-date-range/dist/styles.css';
//import 'react-date-range/dist/theme/default.css';
import { useNavigate } from 'react-router-dom';

import '../../styles/navbar.css';
import SidebarLogo from "../../assets/sidebarlogo.svg"
import partnerService from '../../services/partner.service';

const Navbar = ({ title = 'Dashboard Overview', subtitle, breadcrumbs = [] }) => {
  const { toggleMobileSidebar, toggleSidebar, isCollapsed,isMobileOpen } = useSidebar();
  const navigate =
  useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 6000); // updates every second

  return () => clearInterval(timer);
}, []);

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { open, loading, showLogoutConfirm, hideLogoutConfirm, confirmLogout } = useLogoutConfirm();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [partnerLogo, setPartnerLogo] = useState(null);

  useEffect(() => {
    if (user?.role?.toLowerCase() === 'partner') {
      partnerService.getDashboard().then((data) => {
        if (data?.partner?.logo) {
          setPartnerLogo(data.partner.logo);
        }
      }).catch(() => {});
    }
  }, [user?.role]);
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
  {/* Logo Section */}
<div className="navbar-logo">

  {/* Mobile Toggle */}
  <button
    onClick={toggleMobileSidebar}
    className="navbar-icon-btn navbar-mobile-btn"
    aria-label="Toggle mobile menu"
  >
    {isMobileOpen ? (
      <HiOutlineChevronLeft className="navbar-icon" />
    ) : (
      <HiOutlineChevronRight className="navbar-icon" />
    )}
  </button>

  <div className="navbar-brand-logos" style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
    {partnerLogo && (
      <img
        src={partnerLogo}
        alt="Partner"
        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', border: '1px solid var(--color-border)' }}
      />
    )}

    <img
      src={SidebarLogo}
      alt="PakkaPass"
      className="navbar-logo-image"
      fetchPriority="high"
      loading="eager"
      width="140"
      height="36"
    />
  </div>

  {/* Desktop Sidebar Toggle */}
  <button
    className="navbar-sidebar-toggle"
    onClick={toggleSidebar}
    aria-label="Toggle sidebar"
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
      aria-label="Toggle theme"
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
      aria-label="Notifications"
    >
      <HiOutlineBell className="navbar-icon" />

      
    </button>

    {/* Profile */}

    <div className="navbar-profile" ref={profileRef}>

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
              onClick={() => setProfileOpen(false)}
            >
              Settings
            </Link>

            <button
              onClick={() => {
                setProfileOpen(false);
                showLogoutConfirm();
              }}
              className="navbar-dropdown-link"
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: '#dc2626' }}
            >
              Logout
            </button>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  </div>

  <LogoutConfirmModal
    isOpen={open}
    loading={loading}
    onClose={hideLogoutConfirm}
    onConfirm={() => confirmLogout(logout, navigate)}
  />
</header>
  );
};

export default Navbar;
