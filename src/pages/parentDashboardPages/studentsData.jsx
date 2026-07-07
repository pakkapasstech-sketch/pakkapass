import { useEffect, useState } from 'react';
import StatisticCard from '../../components/cards/StatisticCard';
import studentService from '../../services/student.service';
import '../../styles/StudentData.css';
import { useLoading } from '../../contexts/LoadingContext';

const StudentsData = () => {
  const [studentsData, setStudentsData] = useState([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const linkedStudents = await studentService.getParentStudents();

        if (linkedStudents.length === 0) {
          setStudentsData([]);
          return;
        }

        const dataPromises = linkedStudents.map(async (student) => {
          const profile = await studentService.getProfile(student.id);
          const analyticsData = await studentService.getAnalytics(student.id);
          return {
            id: student.id,
            profile,
            analytics: analyticsData,
          };
        });

        const results = await Promise.all(dataPromises);
        setStudentsData(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [setLoading]);

  return (
    <div className="studentsdata-page">
      <div className="studentsdata-header">
        <div>
          <h2>Student Details</h2>
          <p>View your children's academic information.</p>
        </div>
      </div>

      {studentsData.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
          No students linked to your account.
        </div>
      ) : (
        studentsData.map((data, index) => {
          const student = data.profile;
          const analytics = data.analytics;
          const subjects = analytics?.subjectsProgress || [];

          const statCards = [
            {
              id: 'streak',
              title: 'Study Streak',
              formattedValue: `${analytics?.streak ?? 0} Days`,
              icon: 'students',
            },
            {
              id: 'today',
              title: "Today's Study",
              formattedValue: `${analytics?.todayHours ?? 0} hrs`,
              icon: 'dashboard',
            },
            {
              id: 'month',
              title: 'Monthly Study',
              formattedValue: `${analytics?.monthlyHours ?? 0} hrs`,
              icon: 'dashboard',
            },
            {
              id: 'completion',
              title: 'Completion',
              formattedValue: `${analytics?.completionPercent ?? 0}%`,
              icon: 'dashboard',
            },
          ];

          return (
            <div key={data.id} style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: index < studentsData.length - 1 ? '48px' : '0', borderBottom: index < studentsData.length - 1 ? '1px dashed var(--color-border)' : 'none' }}>
              <div className="studentsdata-profile-card">
                <div className="studentsdata-avatar">
                  {student?.user?.profilePic ? (
                    <img 
                      src={student.user.profilePic} 
                      alt={student?.user?.name} 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    (student?.user?.name || '?').charAt(0)
                  )}
                </div>

                <div className="studentsdata-profile-info">
                  <h3>{student?.user?.name}</h3>

                  <div className="studentsdata-grid">
                    <div>
                      <span>Student ID</span>
                      <strong>{student?.user?.id}</strong>
                    </div>

                    <div>
                      <span>Grade</span>
                      <strong>
                        {student?.profile?.grade?.name}
                      </strong>
                    </div>

                    <div>
                      <span>Board</span>
                      <strong>
                        {student?.profile?.board?.name}
                      </strong>
                    </div>

                    <div>
                      <span>School</span>
                      <strong>{student?.profile?.institution}</strong>
                    </div>

                    <div>
                      <span>Parent</span>
                      <strong>
                        {student?.profile?.parent?.name ?? '-'}
                      </strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{student?.user?.email}</strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>{student?.user?.mobile}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="studentsdata-stats">
                {statCards.map((card) => (
                  <StatisticCard
                    key={`${data.id}-${card.id}`}
                    {...card}
                    isLoading={false}
                  />
                ))}
              </div>

              <div className="studentsdata-card">
                <h3>Subject Progress</h3>

                {subjects.length === 0 ? (
                  <p>No subject progress available.</p>
                ) : (
                  subjects.map((item) => (
                    <div
                      key={item.name}
                      className="studentsdata-progress-item"
                    >
                      <div className="studentsdata-progress-header">
                        <span>{item.name}</span>
                        <strong>{item.progress}%</strong>
                      </div>

                      <div className="studentsdata-progress-bar">
                        <div
                          className="studentsdata-progress-fill"
                          style={{
                            width: `${item.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
              
            </div>
          );
        })
      )}
    </div>
  );
};

export default StudentsData;