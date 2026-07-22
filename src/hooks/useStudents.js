import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services/student.service';
import { useAuth } from '../auth/AuthProvider';
import { ROLES } from '../auth/roles';

const mapStudent = (s) => {
  const now = new Date();
  let status = '-';
  let planName = '-';
  let isFreeTrial = false;

  const hasPlan = Boolean(s.profile?.plan || s.profile?.currentPlanId);
  const hasFreeTrial = Boolean(s.profile?.freeTrialStartDate);

  if (hasPlan) {
    let planEnd = null;
    if (s.profile?.planExpiryDate) {
      planEnd = new Date(s.profile.planExpiryDate);
    } else if (s.profile?.plan?.durationDays) {
      const planStart = new Date(s.profile.updatedAt || s.createdAt);
      planEnd = new Date(planStart.getTime() + (s.profile.plan.durationDays || 0) * 24 * 60 * 60 * 1000);
    }

    const isExpired = planEnd ? now > planEnd : false;
    status = isExpired ? 'Inactive' : 'Active';
    planName = s.profile?.plan?.name || 'Subscribed';
    isFreeTrial = false;
  } else if (hasFreeTrial) {
    const trialStart = new Date(s.profile.freeTrialStartDate);
    const trialEnd = new Date(trialStart.getTime() + 14 * 24 * 60 * 60 * 1000);
    status = now > trialEnd ? 'Inactive' : 'Trial';
    planName = 'Free Trial';
    isFreeTrial = true;
  } else {
    status = '-';
    planName = '-';
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
    plan: planName,
    isFreeTrial,
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
      let data = [];
      if (isParent) {
        data = await studentService.getParentStudents();
      } else {
        data = await studentService.getAll();
      }

      if (Array.isArray(data)) {
        return data.map(mapStudent).sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
      }

      return [];
    },
  });
};

export const useStudent = (id) =>
  useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const data = await studentService.getById(id);
      return mapStudentDetail(data);
    },
    enabled: !!id,
  });

export const useStudentFilterOptions = () =>
  useQuery({
    queryKey: ['student-filter-options'],
    queryFn: () => studentService.getFilterOptions(),
  });

// Maps GET /admin/student/:id response to the shape StudentDetailsPage expects
const mapStudentDetail = (data) => {
  const { student, profile, analytics, payments = [], subscriptionHistory = [] } = data;
  const initials = (student?.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const now = new Date();
  let status = '-';
  let startDate = null;
  let endDate = null;
  let isFreeTrial = false;
  let planName = '-';

  const hasPlan = Boolean(profile?.plan || profile?.currentPlanId);
  const hasFreeTrial = Boolean(profile?.freeTrialStartDate);

  if (hasPlan) {
    let latestPayment = null;
    if (payments && payments.length > 0) {
      latestPayment = payments
        .filter((p) => p.status === 'Success')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    }

    if (latestPayment) {
      startDate = new Date(latestPayment.createdAt);
    } else {
      startDate = new Date(profile?.updatedAt || student?.createdAt || new Date());
    }

    if (profile?.planExpiryDate) {
      endDate = new Date(profile.planExpiryDate);
    } else if (profile?.plan?.durationDays) {
      endDate = new Date(startDate.getTime() + (profile.plan.durationDays || 0) * 24 * 60 * 60 * 1000);
    }

    if (endDate) {
      status = now > endDate ? 'Inactive' : 'Active';
    } else {
      status = 'Active';
    }
    planName = profile?.plan?.name || 'Subscribed';
    isFreeTrial = false;
  } else if (hasFreeTrial) {
    startDate = new Date(profile.freeTrialStartDate);
    endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    status = now > endDate ? 'Inactive' : 'Trial';
    planName = 'Free Trial';
    isFreeTrial = true;
  } else {
    status = '-';
    planName = '-';
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
    plan: planName,
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
    totalMinutes: analytics?.totalMinutes || 0,
    todayHours: analytics?.todayHours ? parseFloat(analytics.todayHours).toFixed(1) : '0',
    todayMinutes: analytics?.todayMinutes || 0,
    deviceModel: student?.deviceModel || 'N/A',
    ipAddress: student?.ipAddress || 'N/A',
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
      return mappedData.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
    },
    enabled,
  });

export default useStudents;
