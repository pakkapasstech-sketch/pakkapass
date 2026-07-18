import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services/student.service';
import { useAuth } from '../auth/AuthProvider';
import { ROLES } from '../auth/roles';

const mapStudent = (s) => {
  const now = new Date();
  let status = 'Trial';

  if (s.profile?.plan) {
    const planStart = new Date(s.profile.updatedAt || s.createdAt);
    const planEnd = new Date(planStart.getTime() + (s.profile.plan.durationDays || 0) * 24 * 60 * 60 * 1000);
    status = now > planEnd ? 'Inactive' : 'Active';
  } else {
    const trialStart = s.profile?.freeTrialStartDate ? new Date(s.profile.freeTrialStartDate) : new Date(s.createdAt);
    const trialEnd = new Date(trialStart.getTime() + 14 * 24 * 60 * 60 * 1000);
    status = now > trialEnd ? 'Inactive' : 'Trial';
  }

  return {
    id: s.id,
    name: s.name || 'Unknown',
    email: s.email || '',
    mobile: s.mobile || '',
    class: s.profile?.grade?.name || 'N/A',
    board: s.profile?.board?.name || 'N/A',
    branch: s.profile?.branch?.name || 'N/A',
    referralCode: s.profile?.partner?.referralCode || '',
    institution: s.profile?.institution || 'Not Available',
    state: s.profile?.state || 'Not Available',
    status,
    plan: s.profile?.plan?.name || 'Free Trial',
    photo: s.profilePic,
    createdAt: s.createdAt,
    profile: s.profile,
    deviceModel: s.deviceModel || 'N/A',
    ipAddress: s.ipAddress || 'N/A',
  };
};
export const useStudents = () => {
  const { user } = useAuth();
  const isParent = user?.role === ROLES.PARENT;

  return useQuery({
    queryKey: ['students', user?.role],
    queryFn: async () => {
  const data = isParent
    ? await studentService.getParentStudents()
    : await studentService.getAll();

  const mappedData = data.map(mapStudent);
  return mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
},
  });
};

export const useStudent = (id) =>
  useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      try {
        const data = await studentService.getById(id);
        try {
          const analyticsData = await studentService.getAnalytics(id);
          if (analyticsData) {
            data.analytics = { ...data.analytics, ...analyticsData };
          }
        } catch (analyticsErr) {
          console.error("Failed to fetch dedicated analytics:", analyticsErr);
        }
        return data;
      } catch {
        const student = student.find(
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
    staleTime: 5 * 60 * 1000, // 5 minutes cache duration
  });
// Maps GET /admin/student/:id response to the shape StudentDetailsPage expects
const mapStudentDetail = (data) => {
  const { student, profile, analytics, payments = [], subscriptionHistory = [] } = data;
  const initials = (student?.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const now = new Date();
  let status = 'Trial';
  let startDate = null;
  let endDate = null;
  let isFreeTrial = false;

  if (payments && payments.length > 0) {
    const latestPayment = payments
      .filter((p) => p.status === 'Success')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (latestPayment && profile?.plan) {
      startDate = new Date(latestPayment.createdAt);
      endDate = new Date(startDate.getTime() + (profile.plan.durationDays || 0) * 24 * 60 * 60 * 1000);
      status = now > endDate ? 'Inactive' : 'Active';
    } else if (profile?.plan) {
      startDate = new Date(profile.updatedAt || student?.createdAt);
      endDate = new Date(startDate.getTime() + (profile.plan.durationDays || 0) * 24 * 60 * 60 * 1000);
      status = now > endDate ? 'Inactive' : 'Active';
    } else {
      startDate = profile?.freeTrialStartDate ? new Date(profile.freeTrialStartDate) : new Date(student?.createdAt);
      endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      status = now > endDate ? 'Inactive' : 'Trial';
      isFreeTrial = true;
    }
  } else {
    if (profile?.plan) {
      startDate = new Date(profile.updatedAt || student?.createdAt);
      endDate = new Date(startDate.getTime() + (profile.plan.durationDays || 0) * 24 * 60 * 60 * 1000);
      status = now > endDate ? 'Inactive' : 'Active';
    } else {
      startDate = profile?.freeTrialStartDate ? new Date(profile.freeTrialStartDate) : new Date(student?.createdAt);
      endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      status = now > endDate ? 'Inactive' : 'Trial';
      isFreeTrial = true;
    }
  }

  let daysLeft = 0;
  if (endDate) {
    const timeDiff = endDate.getTime() - now.getTime();
    daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  return {
    id: student?.id,
    name: student?.name || 'Unknown',
    email: student?.email || '',
    mobile: student?.mobile || '',
    initials,
    photo: student?.profilePic,
    class: profile?.grade?.name || 'N/A',
    board: profile?.board?.name || 'N/A',
    branch: profile?.branch?.name || 'N/A',
    gradeId: profile?.gradeId,
    boardId: profile?.boardId,
    branchId: profile?.branchId,
    state: profile?.state ||'N/A',
    institution: profile?.institution || 'Not Available',
    institute: profile?.institution || 'Not Available',
    status,
    plan: profile?.plan?.name || 'Free Trial',
    startDate: startDate ? startDate.toISOString() : null,
    endDate: endDate ? endDate.toISOString() : null,
    daysLeft: daysLeft > 0 ? daysLeft : 0,
    isFreeTrial,
    registeredOn: student?.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN') : '-',
    createdAt: student?.createdAt,
    parentName: profile?.parent?.name || 'Not Available',
    parentMobile: profile?.parent?.mobile || 'Not Available',
    parentEmail: profile?.parent?.email || 'Not Available',
    analytics,
    payments,
    subscriptionHistory: (status === 'Active' && payments && payments.length > 0) 
      ? subscriptionHistory.filter(sub => {
          const latestPayment = payments
            .filter((p) => p.status === 'Success')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          return latestPayment ? sub.date !== latestPayment.createdAt : true;
        })
      : subscriptionHistory,
    totalHours: analytics?.totalHours ? parseFloat(analytics.totalHours).toFixed(1) : '0',
    todayHours: analytics?.todayHours ? parseFloat(analytics.todayHours).toFixed(1) : '0.0',
    subjectWiseUsage: analytics?.subjectsProgress 
      ? analytics.subjectsProgress.map(s => ({ subject: s.name, percentage: s.progress }))
      : (analytics?.subjectWiseUsage || []),
  };
};

export const useStudentActivities = (studentId) =>
  useQuery({
    queryKey: ['student-activities', studentId],
    queryFn: () => studentService.getActivities(studentId),
    enabled: !!studentId,
  });

export const useInactiveStudents = (enabled = true) =>
  useQuery({
    queryKey: ['inactive-students'],
    queryFn: async () => {
      const data = await studentService.getInactiveStudents();
      const mappedData = data.map(mapStudent);
      return mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    enabled,
  });

export default useStudents;
