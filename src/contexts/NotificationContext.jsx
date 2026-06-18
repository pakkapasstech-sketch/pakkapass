import {
  createContext,
  useContext,
  useState,
} from 'react';

const NotificationContext =
  createContext();

const initialNotifications = [
  {
    id: 1,
    title:
      'Platform Maintenance',
    message:
      'Platform maintenance scheduled on Sunday at 2:00 AM.',
    audience:
      'All Students',
    priority:
      'warning',
    date:
      '16 Jul 2025',
    read: false,
  },
  {
    id: 2,
    title:
      'New Physics Videos',
    message:
      'New Physics videos have been uploaded for Class 10.',
    audience:
      'Class 10',
    priority:
      'info',
    date:
      '15 Jul 2025',
    read: true,
  },
];

export const NotificationProvider =
  ({ children }) => {
    const [
      notifications,
      setNotifications,
    ] = useState(
      initialNotifications
    );

    const unreadCount =
      notifications.filter(
        (n) => !n.read
      ).length;

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