import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import { useSidebar } from '../contexts/SidebarContext';
import { NAV_ITEMS } from '../constants/navigation';

import '../styles/layout.css';

const getPageMeta = (pathname) => {
  for (const item of NAV_ITEMS) {
    if (item.path === pathname) {
      if (item.path === '/') {
        return {
          title: item.label,
          breadcrumbs: [
            { label: item.label, path: '/' }
          ]
        };
      }

      return {
        title: item.label,
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: item.label, path: item.path }
        ]
      };
    }
  }

  return {
    title: 'Dashboard Overview',
    breadcrumbs: [{ label: 'Home', path: '/' }]
  };
};

const DashboardLayout = () => {
  const {
    isCollapsed,
    isMobileOpen,
    closeMobileSidebar
  } = useSidebar();

  const { pathname } = useLocation();

  const {
    title,
    breadcrumbs
  } = getPageMeta(pathname);

  return (
    <div className="dashboard-layout">
      {isMobileOpen && (
        <div
          className="dashboard-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      <Sidebar />

      <Navbar
        title={title}
        breadcrumbs={breadcrumbs}
      />

      <main
        className={`dashboard-main ${
          isCollapsed
            ? 'dashboard-main-collapsed'
            : 'dashboard-main-expanded'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;