import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({ content: true });

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
      else if (window.innerWidth >= 1280) setIsCollapsed(false);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleMenu = (id) => setExpandedMenus((p) => ({ ...p, [id]: !p[id] }));

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        expandedMenus,
        setIsCollapsed,
        toggleSidebar: () => setIsCollapsed((p) => !p),
        toggleMobileSidebar: () => setIsMobileOpen((p) => !p),
        closeMobileSidebar: () => setIsMobileOpen(false),
        toggleMenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
