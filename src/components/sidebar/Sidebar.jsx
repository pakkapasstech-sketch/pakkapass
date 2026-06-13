import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineChevronDown, HiOutlineLogout } from 'react-icons/hi';
import { NAV_ITEMS } from '../../constants/navigation';
import { getIcon } from '../../utils/iconMap';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../common/Avatar';
import '../../styles/sidebar.css';
const Tooltip = ({ label, show }) =>
  show ? <span className="sidebar-tooltip">{label}</span> : null;

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, expandedMenus, closeMobileSidebar, toggleMenu } = useSidebar();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const asideClass = `
sidebar
${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}
${isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed'}
`;
  const renderItem = (item) => {
    const Icon = getIcon(item.icon);
    const active = isActive(item.path);
    const hasChildren = item.children?.length;

    if (hasChildren) {
      return (
        <li key={item.id}>
          <button
            onClick={() => !isCollapsed && toggleMenu(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={`
            sidebar-nav-item
            ${expandedMenus[item.id] ? 'sidebar-nav-item-active' : ''}
            ${isCollapsed ? 'sidebar-nav-item-collapsed' : ''}
          `}
          >
            <Icon className="sidebar-icon" />

            {!isCollapsed && (
              <>
                <span className="sidebar-item-label">{item.label}</span>

                <HiOutlineChevronDown
                  className={`sidebar-chevron ${
                    expandedMenus[item.id] ? 'sidebar-chevron-open' : ''
                  }`}
                />
              </>
            )}

            <Tooltip label={item.label} show={isCollapsed} />
          </button>

          <AnimatePresence>
            {!isCollapsed && expandedMenus[item.id] && (
              <motion.ul
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                className="sidebar-submenu"
              >
                {item.children.map((child) => (
                  <li key={child.id}>
                    <NavLink
                      to={child.path}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) =>
                        `
                        sidebar-submenu-link
                        ${isActive ? 'sidebar-submenu-link-active' : ''}
                      `
                      }
                    >
                      {child.label}
                    </NavLink>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      );
    }

    return (
      <li key={item.id}>
        <NavLink
          to={item.path}
          onClick={closeMobileSidebar}
          title={isCollapsed ? item.label : undefined}
          className={`
          sidebar-nav-item
          ${active ? 'sidebar-nav-item-active' : ''}
          ${isCollapsed ? 'sidebar-nav-item-collapsed' : ''}
        `}
        >
          <Icon className="sidebar-icon" />

          {!isCollapsed && <span className="sidebar-item-label">{item.label}</span>}

          <Tooltip label={item.label} show={isCollapsed} />
        </NavLink>
      </li>
    );
  };

  return (
    <aside className={asideClass}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <HiOutlineAcademicCap className="sidebar-logo-icon" />
          </div>

          {!isCollapsed && (
            <div className="sidebar-brand-text">
              <p className="sidebar-brand-title">PakkaPass</p>

              <p className="sidebar-brand-subtitle">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">{NAV_ITEMS.map((item) => renderItem(item))}</ul>
      </nav>

      <div className="sidebar-footer">
        <div className={`sidebar-user-card ${isCollapsed ? 'sidebar-user-card-collapsed' : ''}`}>
          <Avatar initials={user?.initials || 'SA'} size="md" />
          {!isCollapsed && user && (
            <div className="sidebar-user-info">
              {' '}
              <p className="sidebar-user-name">{user.name}</p>
              <p className="sidebar-user-email">{user.email}</p>
              <button className="sidebar-status-btn">
                <span className="sidebar-status-dot" />
                {user.status}
                <HiOutlineChevronDown className="sidebar-status-icon" />
              </button>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`sidebar-logout-btn ${isCollapsed ? 'sidebar-user-card-collapsed' : ''}`}
        >
          <HiOutlineLogout className="sidebar-icon" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
