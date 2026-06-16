import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineChevronDown,
  HiOutlineLogout,
} from 'react-icons/hi';

import { NAV_ITEMS } from '../../constants/navigation';
import { getIcon } from '../../utils/iconMap';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';

import Avatar from '../common/Avatar';
import '../../styles/sidebar.css';

const Tooltip = ({ label, show }) =>
  show ? (
    <span className="sidebar-tooltip">
      {label}
    </span>
  ) : null;

const Sidebar = () => {
  const location = useLocation();

  const {
    isCollapsed,
    isMobileOpen,
    expandedMenus,
    closeMobileSidebar,
    toggleMenu,
  } = useSidebar();

  const { user, logout } = useAuth();

  const isMobile = window.matchMedia(
    '(max-width: 1024px)'
  ).matches;

  /*
   * Allow collapse only on desktop
   */
  const shouldCollapse =
    !isMobile && isCollapsed;

  const asideClass = `
    sidebar
    ${
      shouldCollapse
        ? 'sidebar-collapsed'
        : 'sidebar-expanded'
    }
    ${
      isMobile
        ? isMobileOpen
          ? 'sidebar-mobile-open'
          : 'sidebar-mobile-closed'
        : ''
    }
  `;

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  const renderItem = (item) => {
    const Icon = getIcon(item.icon);

    const active = isActive(item.path);
    const hasChildren =
      item.children?.length > 0;

    if (hasChildren) {
      return (
        <li key={item.id}>
          <button
            type="button"
            onClick={() =>
              !shouldCollapse &&
              toggleMenu(item.id)
            }
            title={
              shouldCollapse
                ? item.label
                : undefined
            }
            className={`
              sidebar-nav-item
              ${
                expandedMenus[item.id]
                  ? 'sidebar-nav-item-active'
                  : ''
              }
              ${
                shouldCollapse
                  ? 'sidebar-nav-item-collapsed'
                  : ''
              }
            `}
          >
            <Icon className="sidebar-icon" />

            {!shouldCollapse && (
              <>
                <span className="sidebar-item-label">
                  {item.label}
                </span>

                <HiOutlineChevronDown
                  className={`sidebar-chevron ${
                    expandedMenus[item.id]
                      ? 'sidebar-chevron-open'
                      : ''
                  }`}
                />
              </>
            )}

            <Tooltip
              label={item.label}
              show={shouldCollapse}
            />
          </button>

          <AnimatePresence>
            {!shouldCollapse &&
              expandedMenus[item.id] && (
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
                  transition={{
                    duration: 0.2,
                  }}
                  className="sidebar-submenu"
                >
                  {item.children.map(
                    (child) => (
                      <li key={child.id}>
                        <NavLink
                          to={child.path}
                          onClick={
                            isMobile
                              ? closeMobileSidebar
                              : undefined
                          }
                          className={({
                            isActive,
                          }) =>
                            `
                              sidebar-submenu-link
                              ${
                                isActive
                                  ? 'sidebar-submenu-link-active'
                                  : ''
                              }
                            `
                          }
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    )
                  )}
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
          onClick={
            isMobile
              ? closeMobileSidebar
              : undefined
          }
          title={
            shouldCollapse
              ? item.label
              : undefined
          }
          className={`
            sidebar-nav-item
            ${
              active
                ? 'sidebar-nav-item-active'
                : ''
            }
            ${
              shouldCollapse
                ? 'sidebar-nav-item-collapsed'
                : ''
            }
          `}
        >
          <Icon className="sidebar-icon" />

          {!shouldCollapse && (
            <span className="sidebar-item-label">
              {item.label}
            </span>
          )}

          <Tooltip
            label={item.label}
            show={shouldCollapse}
          />
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {isMobile &&
        isMobileOpen && (
          <div
            className="sidebar-overlay"
            onClick={
              closeMobileSidebar
            }
          />
        )}

      <aside className={asideClass}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <HiOutlineAcademicCap className="sidebar-logo-icon" />
            </div>

            {!shouldCollapse && (
              <div className="sidebar-brand-text">
                <p className="sidebar-brand-title">
                  PakkaPass
                </p>

                <p className="sidebar-brand-subtitle">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {NAV_ITEMS.map(renderItem)}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <Avatar
              initials={
                user?.initials || 'SA'
              }
              size="md"
            />

            {!shouldCollapse &&
              user && (
                <div className="sidebar-user-info">
                  <p className="sidebar-user-name">
                    {user.name}
                  </p>

                  <p className="sidebar-user-email">
                    {user.email}
                  </p>

                  <button
                    type="button"
                    className="sidebar-status-btn"
                  >
                    <span className="sidebar-status-dot" />
                    {user.status}

                    <HiOutlineChevronDown className="sidebar-status-icon" />
                  </button>
                </div>
              )}
          </div>

          <button
            type="button"
            onClick={logout}
            className="sidebar-logout-btn"
          >
            <HiOutlineLogout className="sidebar-icon" />

            {!shouldCollapse && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;