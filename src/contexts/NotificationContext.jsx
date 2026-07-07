import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useAuth } from '../auth/AuthProvider';
import notificationService from '../services/notificationsService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { isAuthenticated } = useAuth(); // Assuming useAuth is available or we can just fetch if there's a token
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await notificationService.getNotifications();
        const mapped = data.map((item) => ({
          ...item,
          date: new Date(item.createdAt).toLocaleDateString(),
          read: item.read || false,
        }));
        setNotifications(mapped);
      } catch (err) {
        console.error('Failed to fetch notifications in context:', err);
      }
    };

    // We check if user is authenticated (or just try fetching)
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token || isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications =
  () =>
    useContext(
      NotificationContext
    );