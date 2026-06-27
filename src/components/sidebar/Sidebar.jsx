import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { getMenuForUser } from '../../config/menu.config';
import { getIcon } from '../../utils/iconMap';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../auth/AuthProvider';
import { usePermissions } from '../../auth/usePermissions';
import LogoutConfirmModal, { useLogoutConfirm } from '../modals/LogoutConfirmModal';

import '../../styles/sidebar.css';

const Tooltip = ({ label, show }) =>
  show ? <span className="sidebar-tooltip">{label}</span> : null;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isCollapsed, isMobileOpen, closeMobileSidebar, toggleSidebar } = useSidebar();

  const { logout, user } = useAuth();

  const { hasPermission, role } = usePermissions();

  const { open, loading, showLogoutConfirm, hideLogoutConfirm, confirmLogout } = useLogoutConfirm();

  const menuItems = getMenuForUser(role, hasPermission);

  const isMobile = window.matchMedia('(max-width:1024px)').matches;

  const shouldCollapse = !isMobile && isCollapsed;

  const asideClass = `
    sidebar
    ${shouldCollapse ? 'sidebar-collapsed' : 'sidebar-expanded'}
    ${isMobile ? (isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed') : ''}
  `;

  const handleLogout = () => confirmLogout(logout, navigate);

  const isActive = (path) =>
    path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(path);

  return (
    <>
      {isMobile && isMobileOpen && <div className="sidebar-overlay" onClick={closeMobileSidebar} />}

      <aside className={asideClass}>
        {/* Collapse Button */}

        {/* {!isMobile && (
          <button
            className="sidebar-toggle-btn"
            onClick={
              toggleSidebar
            }
          >
            {shouldCollapse ? (
              <HiOutlineChevronRight />
            ) : (
              <HiOutlineChevronLeft />
            )}
          </button>
        )} */}

        {/* Navigation */}

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {menuItems.map((item) => {
              const Icon = getIcon(item.icon);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    title={shouldCollapse ? item.title : undefined}
                    onClick={isMobile ? closeMobileSidebar : undefined}
                    className={`sidebar-nav-item ${
                      isActive(item.path) ? 'sidebar-nav-item-active' : ''
                    }`}
                  >
                    <Icon className="sidebar-icon" />

                    {!shouldCollapse && <span className="sidebar-item-label">{item.title}</span>}

                    <Tooltip show={shouldCollapse} label={item.title} />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}

        <div className="sidebar-footer">
          {role === 'PARTNER' && !shouldCollapse && (
            <div className="sidebar-referral-card">
              <span className="sidebar-referral-label">Referral Code</span>

              <div className="sidebar-referral-value">{user?.referralCode || 'PARTNER2026'}</div>
            </div>
          )}
          <button className="sidebar-logout-btn" onClick={showLogoutConfirm}>
            <HiOutlineLogout className="sidebar-icon" />

            {!shouldCollapse && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <LogoutConfirmModal
        isOpen={open}
        loading={loading}
        onClose={hideLogoutConfirm}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar;
