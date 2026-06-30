import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StatisticCard from '../../components/cards/StatisticCard';
import studentService from '../../services/student.service';
import '../../styles/StudentData.css';
import { useLoading } from '../../contexts/LoadingContext';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';


const StudentsData = () => {
  const { state } = useLocation();

const [linkedStudents, setLinkedStudents] = useState([]);
const [selectedStudentId, setSelectedStudentId] = useState(
  state?.studentId || null
);

const [student, setStudent] = useState(null);
const [analytics, setAnalytics] = useState(null);
  const [loading, setLoadingState] = useState(true);
const { setLoading } = useLoading();
 useEffect(() => {
  const loadStudents = async () => {
    try {
      const students = await studentService.getParentStudents();

      setLinkedStudents(students);

      if (students.length > 0) {
        setSelectedStudentId((prev) => prev || students[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadStudents();
}, []);
  useEffect(() => {
  const fetchStudent = async () => {
    try {
      setLoading(true);
      setLoadingState(true);

      const profile = await studentService.getProfile(selectedStudentId);
      const analyticsData = await studentService.getAnalytics(selectedStudentId);

      setStudent(profile);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingState(false);
    }
  };

  if (selectedStudentId) {
    fetchStudent();
  }
}, [selectedStudentId, setLoading]);

  

  

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

  const subjects = analytics?.subjectsProgress || [];
  const studentOptions = linkedStudents.map((student) => ({
  label: student.name,
  value: student.id,
}));
  return (
    <div className="studentsdata-page">
      <div className="studentsdata-header">
  <div>
    <h2>Student Details</h2>
    <p>View your child's academic information.</p>
  </div>

  <div style={{ width: '260px' }}>
    <CommonFilterDropdown
      placeholder="Select Student"
      value={
        studentOptions.find(
          (s) => String(s.value) === String(selectedStudentId)
        )?.label || 'Select Student'
      }
      options={studentOptions.map((s) => s.label)}
      onChange={(selectedLabel) => {
        const selected = studentOptions.find(
          (s) => s.label === selectedLabel
        );

        if (selected) {
          setSelectedStudentId(selected.value);
        }
      }}
    />
  </div>
</div>

      <div className="studentsdata-profile-card">
        <div className="studentsdata-avatar">
          {(student?.user?.name || '?').charAt(0)}
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
            key={card.id}
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
};

export default StudentsData;