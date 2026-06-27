import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../auth/ProtectedRoute';
import { PERMISSIONS } from '../auth/permissions';
import { ROLES } from '../auth/roles';
import LoginPage from '../pages/auth/LoginPage';
import ContactAdminPage from '../pages/auth/ContactAdminPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UnauthorizedPage from '../pages/shared/UnauthorizedPage';
import StudentManagementPage from '../pages/students/StudentManagementPage';
import StudentDetailsPage from '../pages/students/StudentDetailsPage';
import ReferralManagementPage from '../pages/referral/ReferralManagementPage';
import SubscriptionManagementPage from '../pages/subscription/SubscriptionManagementPage';
import ContentManagement from '../pages/ContentManagement/ContentManagement';
import ParentsManagement from '../pages/parents/ParentsManagement';
import SupportCentrePage from '../pages/SupportCentrePage/SupportCentrePage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import PartnersPage from '../pages/Partners/PartnersPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import ParentDetailsPage from '../pages/parents/ParentDetailsPage';
import AddPartnerPage from '../pages/Partners/AddPartnerPage';
import PartnerDetailsPage from '../pages/Partners/PartnerDetailsPage';
import EditPartnerPage from '../pages/Partners/EditPartnerPage';
import PlanDetailsPage from '../pages/subscription/PlanDetailsPage';
import CreateEditPlanPage from '../pages/subscription/CreateEditPlanPage';
import ContentHierarchyPage from '../pages/ContentManagement/ContentHierarchyPage';
import RecentPaymentsPage from '../pages/payments/RecentPaymentsPage';
import StudentsData from '../pages/parentDashboardPages/studentsData';
import SubscriptionPage from '../pages/parentDashboardPages/SubscriptionPage';
import TransactionPage from '../pages/parentDashboardPages/TransactionPage';
import PartnerStudentsPage from '../pages/PartnerDashboardPages/PartnerStudentsPage';
import PartnerPaymentsPage from '../pages/PartnerDashboardPages/PartnerPaymentsPage';
const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    <Route path="/contact-admin" element={<ContactAdminPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route element={<ProtectedRoute permission={PERMISSIONS.STUDENT_VIEW} />}>
          <Route path="students" element={<StudentManagementPage />} />
          <Route path="students/:id" element={<StudentDetailsPage />} />
        </Route>

        <Route
          element={<ProtectedRoute permission={PERMISSIONS.STUDENT_VIEW} roles={[ROLES.ADMIN]} />}
        >
          <Route path="parents" element={<ParentsManagement />} />
          <Route path="parents/:id" element={<ParentDetailsPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute permission={PERMISSIONS.INSTITUTION_VIEW} roles={[ROLES.ADMIN]} />
          }
        >
          <Route path="partners" element={<PartnersPage />} />

          <Route path="partners/add" element={<AddPartnerPage />} />

          <Route path="partners/:id" element={<PartnerDetailsPage />} />

          <Route path="partners/:id/edit" element={<EditPartnerPage />} />
        </Route>

        <Route element={<ProtectedRoute permission={PERMISSIONS.RESOURCE_VIEW} />}>
          <Route path="content" element={<ContentManagement />} />
          <Route path="/admin/content-hierarchy" element={<ContentHierarchyPage />} />
          <Route path="/payments" element={<RecentPaymentsPage />} />
        </Route>

        <Route
          element={<ProtectedRoute permission={PERMISSIONS.COUPON_VIEW} roles={[ROLES.ADMIN]} />}
        >
          <Route path="subscriptions" element={<SubscriptionManagementPage />} />
          <Route path="/admin/subscriptions/plans/:planId" element={<PlanDetailsPage />} />

          <Route path="/admin/subscriptions/plans/create" element={<CreateEditPlanPage />} />

          <Route path="/admin/subscriptions/plans/:planId/edit" element={<CreateEditPlanPage />} />
          <Route path="coupons" element={<ReferralManagementPage />} />
        </Route>

        <Route element={<ProtectedRoute permission={PERMISSIONS.COMMISSION_VIEW} />}>
          <Route path="commissions" element={<ReferralManagementPage />} />
        </Route>
          <Route
  element={
    <ProtectedRoute roles={[ROLES.PARENT]} />
  }
>
  <Route path="parent/student" element={<StudentsData />} />

  <Route
    path="parent/subscription"
    element={<SubscriptionPage />}
  />

  <Route
    path="parent/transactions"
    element={<TransactionPage />}
  />
</Route>
<Route
  element={
    <ProtectedRoute roles={[ROLES.PARTNER]} />
  }
>
  <Route
    path="partner/students"
    element={<PartnerStudentsPage />}
  />

  <Route
    path="partner/payments"
    element={<PartnerPaymentsPage />}
  />
</Route>
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="support" element={<SupportCentrePage />} />
        <Route path="settings" element={<SettingsPage />} />

        <Route path="payments" element={<Navigate to="/dashboard" replace />} />
        <Route path="referrals" element={<Navigate to="/coupons" replace />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
