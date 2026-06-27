import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services/student.service';
import { useAuth } from '../auth/AuthProvider';
import { ROLES } from '../auth/roles';
//import { mockStudents } from '../mock/students';
//import { students } from '../data/students';
const mapStudent = (s) => ({
  id: s.id,
  name: s.name || 'Unknown',
  email: s.email || '',
  mobile: s.mobile || '',
  class: s.profile?.grade?.name || 'N/A',
  board: s.profile?.board?.name || 'N/A',
  institution: s.profile?.institution || 'Not Available',
  state: s.profile?.state || 'Not Available',
  status: s.profile?.plan ? 'Active' : 'Trial',
  plan: s.profile?.plan?.name || 'Free Trial',
  photo: s.profilePic,
  createdAt: s.createdAt,
  profile: s.profile,
});
export const useStudents = () => {
  const { user } = useAuth();
  const isParent = user?.role === ROLES.PARENT;

  return useQuery({
    queryKey: ['students', user?.role],
    queryFn: async () => {
  const data = isParent
    ? await studentService.getParentStudents()
    : await studentService.getAll();

  return data.map(mapStudent);
},
  });
};

export const useStudent = (id) =>
  useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      try {
        return await studentService.getById(id);
      } catch {
        const student = students.find(
          (s) => String(s.id) === String(id)
        );

        return {
          student,
          profile: {},
          analytics: {
            totalHours: 12,
            subjectWiseUsage: [],
          },
          payments: [],
          subscriptionHistory: [],
        };
      }
    },
    enabled: !!id,
    select: (data) => mapStudentDetail(data),
  });
export const useStudentFilterOptions = () =>
  useQuery({
    queryKey: ['student-filter-options'],
    queryFn: () =>
      studentService.getFilterOptions(),
  });
// Maps GET /admin/student/:id response to the shape StudentDetailsPage expects
const mapStudentDetail = (data) => {
  const { student, profile, analytics, payments = [], subscriptionHistory = [] } = data;
  const initials = (student?.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return {
    id: student?.id,
    name: student?.name || 'Unknown',
    email: student?.email || '',
    mobile: student?.mobile || '',
    initials,
    class: profile?.grade?.name || 'N/A',
    board: profile?.board?.name || 'N/A',
    state: profile?.partner?.organizationName ? 'Telangana' : 'N/A',
    institution: profile?.partner?.organizationName || 'Not Available',
    status: profile?.plan ? 'Active' : 'Trial',
    plan: profile?.plan?.name || 'Free Trial',
    registeredOn: student?.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN') : '-',
    createdAt: student?.createdAt,
    fatherName: profile?.parent?.name || 'Not Available',
    motherName: 'Not Available',
    parentMobile: profile?.parent?.mobile || 'Not Available',
    parentEmail: profile?.parent?.email || 'Not Available',
    analytics,
    payments,
    subscriptionHistory,
    totalHours: analytics?.totalHours || '0',
    subjectWiseUsage: analytics?.subjectWiseUsage || [],
  };
};

export default useStudents;
