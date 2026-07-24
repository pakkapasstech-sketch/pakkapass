import { useState } from 'react';
import { HiOutlineDownload, HiOutlineX, HiOutlineCalendar } from 'react-icons/hi';
import { exportToExcel } from '../../utils/exportUtils';
import studentService from '../../services/student.service';

const StudentExportModal = ({ isOpen, onClose, students = [], partnerMap = {}, filterOptions = {} }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  if (!isOpen) return null;

  const setPreset = (type) => {
    const today = new Date();
    let start = new Date();

    if (type === '7days') {
      start.setDate(today.getDate() - 7);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (type === '30days') {
      start.setDate(today.getDate() - 30);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (type === 'thisMonth') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (type === 'allTime') {
      setStartDate('');
      setEndDate('');
    }
  };

  const formatDecimalHours = (val, minutes) => {
    if (val != null && val !== '' && !isNaN(Number(val))) {
      return `${Number(val).toFixed(1)}h`;
    }
    if (minutes != null && minutes !== '' && !isNaN(Number(minutes))) {
      return `${(Number(minutes) / 60).toFixed(1)}h`;
    }
    return '0.0h';
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case 'LOGIN':
        return 'Login';
      case 'CREATE_PROFILE':
        return 'Profile Created';
      case 'PROFILE_UPDATED':
        return 'Profile Updated';
      case 'STUDY_SESSION':
        return 'Study Session';
      case 'TOPIC_COMPLETED':
        return 'Topic Completed';
      case 'PLAN_SELECTED':
        return 'Plan Selected';
      case 'TRIAL_STARTED':
        return 'Free Trial Started';
      case 'PAYMENT_SUCCESS':
        return 'Subscription Purchased';
      default:
        return type?.replace('_', ' ') || 'Activity';
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportProgress(0);

      const columns = [
        { header: 'Student ID', key: 'studentId' },
        { header: 'Full Name', key: 'fullName' },
        { header: 'Email', key: 'email' },
        { header: 'Mobile Number', key: 'mobile' },
        { header: 'Class', key: 'class' },
        { header: 'Board', key: 'board' },
        { header: 'Branch', key: 'branch' },
        { header: 'Institution', key: 'institution' },
        { header: 'State', key: 'state' },
        { header: 'Parent Name', key: 'parentName' },
        { header: 'Parent Mobile', key: 'parentMobile' },
        { header: 'Parent Email', key: 'parentEmail' },
        { header: 'Subscription Plan', key: 'plan' },
        { header: 'Account Status', key: 'status' },
        { header: 'REFCODE', key: 'referralCode' },
        { header: 'Registered Date', key: 'registeredDate' },
        { header: 'Device Model', key: 'deviceModel' },
        { header: 'IP Address', key: 'ipAddress' },
        { header: 'Total Study Hours', key: 'totalHours' },
        { header: 'Today\'s Study Hours', key: 'todayHours' },
        { header: 'Activity Date & Time', key: 'activityDate' },
        { header: 'Activity Type', key: 'activityType' },
        { header: 'Activity Description', key: 'activityDesc' },
      ];

      const startTimestamp = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
      const endTimestamp = endDate ? new Date(`${endDate}T23:59:59`).getTime() : null;

      const exportRows = [];
      const totalCount = students.length;

      for (let index = 0; index < students.length; index++) {
        const student = students[index];
        setExportProgress(Math.round(((index + 1) / totalCount) * 100));

        let activities = [];
        try {
          const res = await studentService.getActivities(student.id);
          activities = Array.isArray(res) ? res : res?.activities || [];
        } catch {
          activities = [];
        }

        const filteredActivities = activities.filter((act) => {
          const actTime = new Date(act.createdAt).getTime();
          if (startTimestamp && actTime < startTimestamp) return false;
          if (endTimestamp && actTime > endTimestamp) return false;
          return true;
        });

        let fullDetail = null;
        try {
          fullDetail = await studentService.getById(student.id);
        } catch {
          fullDetail = null;
        }

        const prof = fullDetail?.profile || student.profile || {};
        const parentObj = prof.parent || fullDetail?.parent || student.parent || {};

        const gradeName = filterOptions?.grades?.find(g => String(g.id) === String(prof.gradeId || student?.gradeId))?.name || prof.grade?.name || student?.class || '—';
        const boardName = filterOptions?.boards?.find(b => String(b.id) === String(prof.boardId || student?.boardId))?.name || prof.board?.name || student?.board || '—';
        const branchName = filterOptions?.branches?.find(br => String(br.id) === String(prof.branchId || student?.branchId))?.name || prof.branch?.name || (student?.branch !== 'N/A' && student?.branch !== '—' ? student?.branch : '') || '—';

        const parentNameVal = parentObj.name || parentObj.fullName || (student.parentName && student.parentName !== 'Not Available' ? student.parentName : '') || prof.parentName || '—';
        const parentMobileVal = parentObj.mobile || parentObj.phone || (student.parentMobile && student.parentMobile !== 'Not Available' ? student.parentMobile : '') || prof.parentMobile || '—';
        const parentEmailVal = parentObj.email || (student.parentEmail && student.parentEmail !== 'Not Available' ? student.parentEmail : '') || prof.parentEmail || '—';

        const studentProfileObj = {
          studentId: prof.studentId || student.profile?.studentId || student.id || '—',
          fullName: student.name || '—',
          email: student.email || '—',
          mobile: student.mobile || '—',
          class: gradeName,
          board: boardName,
          branch: branchName,
          institution: prof.institution || student.institution || '—',
          state: prof.state || student.state || '—',
          parentName: parentNameVal,
          parentMobile: parentMobileVal,
          parentEmail: parentEmailVal,
          plan: student.plan || 'Free Trial',
          status: student.status || 'Active',
          referralCode: student.referralCode || (prof.partnerId && partnerMap[String(prof.partnerId)]) || student.refCode || 'Null',
          registeredDate: student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN') : '—',
          deviceModel: student.deviceModel || 'N/A',
          ipAddress: student.ipAddress || 'N/A',
          totalHours: formatDecimalHours(
            fullDetail?.analytics?.totalHours ?? student.totalHours,
            fullDetail?.analytics?.totalMinutes ?? student.totalMinutes
          ),
          todayHours: formatDecimalHours(
            fullDetail?.analytics?.todayHours ?? student.todayHours,
            fullDetail?.analytics?.todayMinutes ?? student.todayMinutes
          ),
        };

        const blankProfileObj = {
          studentId: '',
          fullName: '',
          email: '',
          mobile: '',
          class: '',
          board: '',
          branch: '',
          institution: '',
          state: '',
          parentName: '',
          parentMobile: '',
          parentEmail: '',
          plan: '',
          status: '',
          referralCode: '',
          registeredDate: '',
          deviceModel: '',
          ipAddress: '',
          totalHours: '',
          todayHours: '',
        };

        if (filteredActivities.length > 0) {
          filteredActivities.forEach((act, actIdx) => {
            const rowBase = actIdx === 0 ? { ...studentProfileObj } : { ...blankProfileObj };
            rowBase.activityDate = new Date(act.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            rowBase.activityType = getActivityLabel(act.actionType);
            rowBase.activityDesc = act.description ? act.description.replace(/^[Yy]ou\s+/, '') : '—';

            exportRows.push(rowBase);
          });
        } else {
          exportRows.push({
            ...studentProfileObj,
            activityDate: '—',
            activityType: '—',
            activityDesc: 'No activity in selected date range',
          });
        }
      }

      exportToExcel(exportRows, columns, 'students_activity_log.xlsx');
      onClose();
    } catch (err) {
      console.error('Failed to export students:', err);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-card, #ffffff)',
          color: 'var(--color-text-primary, #111827)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid var(--color-border, #e5e7eb)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineCalendar style={{ color: 'var(--color-primary, #6653AF)' }} />
            Export Students & Activity Log
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary, #6b7280)',
              padding: '4px',
              borderRadius: '8px',
            }}
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '20px' }}>
          Select a date range to filter the activity log timeline for all exported student records.
        </p>

        {/* Presets */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Presets
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setPreset('7days')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #e5e7eb)',
                background: 'var(--color-bg-secondary, #f9fafb)',
                color: 'var(--color-text-primary, #1F2937)',
                cursor: 'pointer',
              }}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setPreset('30days')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #e5e7eb)',
                background: 'var(--color-bg-secondary, #f9fafb)',
                color: 'var(--color-text-primary, #1F2937)',
                cursor: 'pointer',
              }}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => setPreset('thisMonth')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #e5e7eb)',
                background: 'var(--color-bg-secondary, #f9fafb)',
                color: 'var(--color-text-primary, #1F2937)',
                cursor: 'pointer',
              }}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setPreset('allTime')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #e5e7eb)',
                background: 'var(--color-bg-secondary, #f9fafb)',
                color: 'var(--color-text-primary, #1F2937)',
                cursor: 'pointer',
              }}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Date Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #d1d5db)',
                background: 'var(--color-bg, #ffffff)',
                color: 'var(--color-text-primary, #111827)',
                fontSize: '14px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #d1d5db)',
                background: 'var(--color-bg, #ffffff)',
                color: 'var(--color-text-primary, #111827)',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        {/* Progress Bar */}
        {isExporting && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
              <span>Generating Excel export...</span>
              <span>{exportProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${exportProgress}%`,
                  height: '100%',
                  background: 'var(--color-primary, #6653AF)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--color-border, #d1d5db)',
              background: 'transparent',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--color-primary, #6653AF)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isExporting ? 0.7 : 1,
            }}
          >
            <HiOutlineDownload size={18} />
            {isExporting ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentExportModal;
