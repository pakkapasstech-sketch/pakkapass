import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [expandedMenus, setExpandedMenus] = useState({
    content: true,
  });

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 1024
  );

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');

    const handleChange = (e) => {
      const mobile = e.matches;

      setIsMobile(mobile);

      if (mobile) {
        setIsMobileOpen(false);
        setIsCollapsed(false);
      } else {
        setIsMobileOpen(false);
      }
    };

    handleChange(media);

    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
    } else {
      media.addListener(handleChange);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsCollapsed((prev) => !prev);
    }
  };

  const toggleMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const toggleMenu = (id) =>
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobile,
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
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      'useSidebar must be used within SidebarProvider'
    );
  }

  return context;
};