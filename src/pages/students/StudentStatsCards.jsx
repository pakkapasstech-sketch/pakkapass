import {
    HiOutlineUsers,
    HiOutlineUserGroup,
    HiOutlineUserRemove,
    HiOutlineAcademicCap,
  } from 'react-icons/hi';
  const stats = [
    {
      title: 'Total Students',
      value: '125,680',
      growth: '+16.4%',
      icon: HiOutlineUsers,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Active Students',
      value: '98,432',
      growth: '+14.8%',
      icon: HiOutlineUserGroup,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Inactive Students',
      value: '14,568',
      growth: '+3.8%',
      icon: HiOutlineUserRemove,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'New This Week',
      value: '3,256',
      growth: '+12.1%',
      icon: HiOutlineAcademicCap,
      color: 'bg-blue-100 text-blue-600',
    },
  ];
  
  const StudentStatsCards = () => {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
  
          return (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
  
                <div>
                  <p className="text-xs text-gray-500">
                    {item.title}
                  </p>
  
                  <h3 className="text-xl font-bold">
                    {item.value}
                  </h3>
  
                  <p className="text-xs text-green-600">
                    ↑ {item.growth} vs last week
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default StudentStatsCards;