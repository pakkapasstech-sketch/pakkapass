import axiosInstance from '../api/axiosInstance';

export const dashboardService = {
  getStats: async () => {
    const { data } =
      await axiosInstance.get(
        '/admin/dashboard'
      );

    const stats =
      data.stats || {};

    return {
      cards: [
        {
          id: 1,
          title:
            'Total Students',
          value:
            stats.totalStudents ||
            0,
          icon: 'users',
          iconBg:
            'bg-blue-100',
          iconColor:
            'text-blue-600',
        },
        {
          id: 2,
          title:
            'Total Parents',
          value:
            stats.totalParents ||
            0,
          icon: 'users',
          iconBg:
            'bg-green-100',
          iconColor:
            'text-green-600',
        },
        {
          id: 3,
          title:
            'Institutes',
          value:
            stats.totalInstitutes ||
            0,
          icon:
            'office-building',
          iconBg:
            'bg-purple-100',
          iconColor:
            'text-purple-600',
        },
        {
          id: 4,
          title:
            'Chapters',
          value:
            stats.totalChapters ||
            0,
          icon: 'book-open',
          iconBg:
            'bg-yellow-100',
          iconColor:
            'text-yellow-600',
        },
        {
          id: 5,
          title:
            'Topics',
          value:
            stats.totalTopics ||
            0,
          icon: 'collection',
          iconBg:
            'bg-pink-100',
          iconColor:
            'text-pink-600',
        },
      ],

      recentRegistrations:
        data.recentRegistrations ||
        [],

      recentPayments:
        data.recentPayments ||
        [],

      referralConversions:
        data.referralConversions ||
        [],
    };
  },
};