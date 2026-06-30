import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import { useSidebar } from '../contexts/SidebarContext';
import { MENU_ITEMS } from '../config/menu.config';

import '../styles/layout.css';

const getPageMeta = (pathname) => {
  const item = MENU_ITEMS.find(
    (m) =>
      m.path === pathname ||
      (m.path !== '/dashboard' && pathname.startsWith(m.path))
  );

  if (item) {
    return {
      title: item.title,
      breadcrumbs:
        pathname === '/dashboard'
          ? [{ label: item.title, path: '/dashboard' }]
          : [
              { label: 'Dashboard', path: '/dashboard' },
              { label: item.title, path: item.path },
            ],
    };
  }

  if (pathname.startsWith('/students/')) {
    return {
      title: 'Student Details',
      breadcrumbs: [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Students', path: '/students' },
        { label: 'Details' },
      ],
    };
  }

  return {
    title: 'Dashboard',
    breadcrumbs: [{ label: 'Dashboard', path: '/dashboard' }],
  };
};

const DashboardLayout = () => {
  
  const {
  isCollapsed,
  //isMobile,
  isMobileOpen,
  closeMobileSidebar,
} = useSidebar();

  const { pathname } = useLocation();

  const { title, breadcrumbs } = getPageMeta(pathname);
  

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      );
  }, []);

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
    isMobile
      ? ''
      : isCollapsed
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