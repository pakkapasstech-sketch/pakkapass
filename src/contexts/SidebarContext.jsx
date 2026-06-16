import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({
  children,
}) => {
  const [isCollapsed, setIsCollapsed] =
    useState(false);

  const [isMobileOpen, setIsMobileOpen] =
    useState(false);

  const [expandedMenus, setExpandedMenus] =
    useState({
      content: true,
    });

  useEffect(() => {
    const handleResize = () => {
      const isMobile =
        window.innerWidth < 1024;

      if (isMobile) {
        setIsCollapsed(false);
      } else {
        setIsMobileOpen(false);
      }
    };

    handleResize();

    window.addEventListener(
      'resize',
      handleResize
    );

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      );
  }, []);

  const toggleSidebar = () =>
    setIsCollapsed((prev) => !prev);

  const toggleMobileSidebar = () =>
    setIsMobileOpen((prev) => !prev);

  const closeMobileSidebar = () =>
    setIsMobileOpen(false);

  const toggleMenu = (id) =>
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        expandedMenus,

        toggleSidebar,
        toggleMobileSidebar,
        closeMobileSidebar,
        toggleMenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context =
    useContext(SidebarContext);

  if (!context) {
    throw new Error(
      'useSidebar must be used within SidebarProvider'
    );
  }

  return context;
};