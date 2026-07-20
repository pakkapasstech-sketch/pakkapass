import axiosInstance from '../api/axiosInstance';

const getBaseUrl = () => {
  try {
    const rawUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      const role = user?.role?.toUpperCase();
      if (role === 'ADMIN') return '/admin/notifications';
      if (role === 'PARENT') return '/parent/notifications';
      if (role === 'PARTNER' || role === 'INSTITUTE') return '/partner/notifications';
      if (role === 'STUDENT') return `/student/${user.id}/notifications`;
    }
  } catch (err) {}
  return '/unauthorized-notifications-path';
};

const getReadUrl = () => {
  try {
    const rawUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      const role = user?.role?.toUpperCase();
      if (role === 'ADMIN') return '/admin/notifications/read';
      if (role === 'PARTNER' || role === 'INSTITUTE') return '/partner/notifications/read';
      if (role === 'PARENT') return '/parent/notifications/mark-read';
      if (role === 'STUDENT') return `/student/${user.id}/notifications/read`;
    }
  } catch (err) {}
  return '/unauthorized-notifications-read-path';
};

const notificationService = {
  getNotifications: () =>
    axiosInstance.get(getBaseUrl()),

  createNotification: (data) =>
    axiosInstance.post('/admin/notifications', data),

  updateNotification: (id, data) =>
    axiosInstance.put(`/admin/notifications/${id}`, data),

  deleteNotification: (id) =>
    axiosInstance.delete(`/admin/notifications/${id}`),

  markRead: (notificationId) =>
    axiosInstance.post(getReadUrl(), { notificationId }),

  markAllRead: () =>
    axiosInstance.post(getReadUrl(), {}),
};

export default notificationService;