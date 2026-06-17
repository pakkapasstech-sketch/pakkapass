import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineChevronDown, HiOutlineLogout } from 'react-icons/hi';
import { getMenuForUser } from '../../config/menu.config';
import { getIcon } from '../../utils/iconMap';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../auth/AuthProvider';
import { usePermissions } from '../../auth/usePermissions';
import { ROLES } from '../../auth/roles';
import Avatar from '../common/Avatar';
import LogoutConfirmModal, { useLogoutConfirm } from '../modals/LogoutConfirmModal';
import '../../styles/sidebar.css';

const ROLE_LABELS = { [ROLES.ADMIN]: 'Admin Panel', [ROLES.PARTNER]: 'Partner Portal', [ROLES.PARENT]: 'Parent Portal' };

const Tooltip = ({ label, show }) => (show ? <span className="sidebar-tooltip">{label}</span> : null);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, isMobileOpen, expandedMenus, closeMobileSidebar, toggleMenu } = useSidebar();
  const { user, logout } = useAuth();
  const { hasPermission, role } = usePermissions();
  const { open, loading, showLogoutConfirm, hideLogoutConfirm, confirmLogout } = useLogoutConfirm();

  const menuItems = getMenuForUser(role, hasPermission);
  const isMobile = window.matchMedia('(max-width: 1024px)').matches;
  const shouldCollapse = !isMobile && isCollapsed;

  const asideClass = `sidebar ${shouldCollapse ? 'sidebar-collapsed' : 'sidebar-expanded'} ${
    isMobile ? (isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed') : ''
  }`;

  const isActive = (path) =>
    path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(path);

  const handleLogout = () => confirmLogout(logout, navigate);

  const renderItem = (item) => {
    const Icon = getIcon(item.icon);
    const active = isActive(item.path);

    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          onClick={isMobile ? closeMobileSidebar : undefined}
          title={shouldCollapse ? item.title : undefined}
          className={`sidebar-nav-item ${active ? 'sidebar-nav-item-active' : ''} ${shouldCollapse ? 'sidebar-nav-item-collapsed' : ''}`}
        >
          <Icon className="sidebar-icon" />
          {!shouldCollapse && <span className="sidebar-item-label">{item.title}</span>}
          <Tooltip label={item.title} show={shouldCollapse} />
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {isMobile && isMobileOpen && <div className="sidebar-overlay" onClick={closeMobileSidebar} />}

      <aside className={asideClass}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <HiOutlineAcademicCap className="sidebar-logo-icon" />
            </div>
            {!shouldCollapse && (
              <div className="sidebar-brand-text">
                <p className="sidebar-brand-title">PakkaPass</p>
                <p className="sidebar-brand-subtitle">{ROLE_LABELS[role] || 'Dashboard'}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">{menuItems.map(renderItem)}</ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <Avatar initials={user?.initials || 'U'} size="md" />
            {!shouldCollapse && user && (
              <div className="sidebar-user-info">
                <p className="sidebar-user-name">{user.name}</p>
                <p className="sidebar-user-email">{user.email || user.mobile}</p>
                <button type="button" className="sidebar-status-btn">
                  <span className="sidebar-status-dot" />
                  {user.status || role}
                </button>
              </div>
            )}
          </div>

          <button type="button" onClick={showLogoutConfirm} className="sidebar-logout-btn">
            <HiOutlineLogout className="sidebar-icon" />
            {!shouldCollapse && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <LogoutConfirmModal isOpen={open} onClose={hideLogoutConfirm} onConfirm={handleLogout} loading={loading} />
    </>
  );
};

export default Sidebar;
