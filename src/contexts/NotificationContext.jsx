import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useAuth } from '../auth/AuthProvider';


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { isAuthenticated } = useAuth(); // Assuming useAuth is available or we can just fetch if there's a token
  


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