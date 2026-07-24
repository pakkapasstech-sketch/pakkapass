import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineClipboardCopy, HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi';
import { getMenuForUser } from '../../config/menu.config';
import { getIcon } from '../../utils/iconMap';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../auth/AuthProvider';
import { usePermissions } from '../../auth/usePermissions';
import LogoutConfirmModal, { useLogoutConfirm } from '../modals/LogoutConfirmModal';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/sidebar.css';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import partnerService from '../../services/partner.service';
import { useStudentFilterOptions } from '../../hooks/useStudents';

const Tooltip = ({ label, show }) =>
  show ? <span className="sidebar-tooltip">{label}</span> : null;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState('');
  const [isContentExpanded, setIsContentExpanded] = useState(true);
  const { data: filterOptions } = useStudentFilterOptions();
  const grades = filterOptions?.grades || [];

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy referral code');
    }
  };

  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar();
  const { logout } = useAuth();
  const { setIsDark } = useTheme();
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

  const handleLogout = () =>
    confirmLogout(async () => {
      setIsDark(false);
      await logout();
    }, navigate);

  const isActive = (path) =>
    path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(path);

  useEffect(() => {
    if (role !== 'PARTNER') return;
    const loadPartner = async () => {
      try {
        const data = await partnerService.getDashboard();
        setReferralCode(data.partner?.referralCode || '');
      } catch (err) {
        console.error(err);
      }
    };
    loadPartner();
  }, [role]);

  return (
    <>
      {isMobile && isMobileOpen && <div className="sidebar-overlay" onClick={closeMobileSidebar} />}

      <aside className={asideClass}>
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {menuItems.map((item) => {
              const Icon = getIcon(item.icon);
              const isContent = item.path === '/content';

              if (isContent) {
                return (
                  <li key={item.path}>
                    <div
                      onClick={() => {
                        if (shouldCollapse) {
                          navigate('/content');
                        } else {
                          setIsContentExpanded(!isContentExpanded);
                        }
                      }}
                      className={`sidebar-nav-item ${
                        isActive(item.path) ? 'sidebar-nav-item-active' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <Icon className="sidebar-icon" />
                      {!shouldCollapse && (
                        <>
                          <span className="sidebar-item-label">{item.title}</span>
                          {isContentExpanded ? (
                            <HiOutlineChevronDown className="sidebar-chevron" />
                          ) : (
                            <HiOutlineChevronRight className="sidebar-chevron" />
                          )}
                        </>
                      )}
                      <Tooltip show={shouldCollapse} label={item.title} />
                    </div>

                    {!shouldCollapse && isContentExpanded && (
                      <ul className="sidebar-submenu">
                        {grades.map((grade) => {
                          const currentParams = new URLSearchParams(location.search);
                          const isGradeActive =
                            location.pathname.startsWith('/content') &&
                            currentParams.get('gradeId') === String(grade.id);

                          return (
                            <li key={grade.id}>
                              <div
                                onClick={() => {
                                  navigate(
                                    `/content?gradeId=${grade.id}&gradeName=${encodeURIComponent(
                                      grade.name
                                    )}`
                                  );
                                  if (isMobile) closeMobileSidebar();
                                }}
                                className={`sidebar-submenu-link ${
                                  isGradeActive ? 'sidebar-submenu-link-active' : ''
                                }`}
                                style={{ cursor: 'pointer', color: '#ffffff', fontWeight: '600' }}
                              >
                                {grade.name}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    title={shouldCollapse ? item.title : undefined}
                    onClick={() => {
                      setIsContentExpanded(false);
                      if (isMobile) closeMobileSidebar();
                    }}
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

              <div className="sidebar-referral-value">
  <span>{referralCode || '-'}</span>

  <HiOutlineClipboardCopy
    className="sidebar-copy-icon"
    title="Copy referral code"
    onClick={copyReferralCode}
  />
</div>
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
