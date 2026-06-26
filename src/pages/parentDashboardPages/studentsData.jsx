import StatisticCard from '../../components/cards/StatisticCard';
import '../../styles/StudentData.css';

const StudentsData = () => {
  const isLoading = false;

  const student = {
    studentId: 'STU1001',
    name: 'Rahul Sharma',
    class: '10',
    section: 'A',
    board: 'CBSE',
    school: 'Delhi Public School',
    parent: 'Mr. Sharma',
    email: 'rahul@example.com',
    phone: '+91 9876543210',
    attendance: '96%',
    studyStreak: 18,
    monthlyHours: 72,
    todayHours: 3.5,
  };

  const statCards = [
    {
      id: 'attendance',
      title: 'Attendance',
      formattedValue: student.attendance,
      trend: 2,
      trendLabel: 'overall',
      trendUp: true,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: 'students',
    },
    {
      id: 'streak',
      title: 'Study Streak',
      formattedValue: `${student.studyStreak} Days`,
      trend: 6,
      trendLabel: 'this week',
      trendUp: true,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      icon: 'students',
    },
    {
      id: 'today',
      title: "Today's Study",
      formattedValue: `${student.todayHours} hrs`,
      trend: 10,
      trendLabel: 'today',
      trendUp: true,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      icon: 'dashboard',
    },
    {
      id: 'month',
      title: 'Monthly Study',
      formattedValue: `${student.monthlyHours} hrs`,
      trend: 8,
      trendLabel: 'this month',
      trendUp: true,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: 'dashboard',
    },
  ];

  const subjects = [
    { subject: 'Mathematics', progress: 82 },
    { subject: 'Science', progress: 75 },
    { subject: 'English', progress: 68 },
    { subject: 'Social Studies', progress: 91 },
  ];

  return (
    <div className="studentsdata-page">

      <div className="studentsdata-header">
        <h2>Student Details</h2>
        <p>View your child's academic information.</p>
      </div>

      <div className="studentsdata-profile-card">

        <div className="studentsdata-avatar">
          {student.name.charAt(0)}
        </div>

        <div className="studentsdata-profile-info">

          <h3>{student.name}</h3>

          <div className="studentsdata-grid">

            <div>
              <span>Student ID</span>
              <strong>{student.studentId}</strong>
            </div>

            <div>
              <span>Class</span>
              <strong>{student.class}</strong>
            </div>

            <div>
              <span>Section</span>
              <strong>{student.section}</strong>
            </div>

            <div>
              <span>Board</span>
              <strong>{student.board}</strong>
            </div>

            <div>
              <span>School</span>
              <strong>{student.school}</strong>
            </div>

            <div>
              <span>Parent</span>
              <strong>{student.parent}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{student.email}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{student.phone}</strong>
            </div>

          </div>

        </div>

      </div>

      <div className="studentsdata-stats">
        {statCards.map((card) => (
          <StatisticCard
            key={card.id}
            {...card}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="studentsdata-card">

        <h3>Subject Progress</h3>

        {subjects.map((item) => (
          <div
            key={item.subject}
            className="studentsdata-progress-item"
          >

            <div className="studentsdata-progress-header">
              <span>{item.subject}</span>
              <strong>{item.progress}%</strong>
            </div>

            <div className="studentsdata-progress-bar">
              <div
                className="studentsdata-progress-fill"
                style={{ width: `${item.progress}%` }}
              />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default StudentsData;