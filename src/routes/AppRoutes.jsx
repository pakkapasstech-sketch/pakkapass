import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../auth/ProtectedRoute';
import { PERMISSIONS } from '../auth/permissions';
import { ROLES } from '../auth/roles';
import GlobalLoader from '../components/loaders/GlobalLoader';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ContactAdminPage = lazy(() => import('../pages/auth/ContactAdminPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const UnauthorizedPage = lazy(() => import('../pages/shared/UnauthorizedPage'));
const StudentManagementPage = lazy(() => import('../pages/students/StudentManagementPage'));
const StudentDetailsPage = lazy(() => import('../pages/students/StudentDetailsPage'));
const ImportStudentsPage = lazy(() => import('../pages/students/ImportStudentsPage'));
const ReferralManagementPage = lazy(() => import('../pages/referral/ReferralManagementPage'));
const SubscriptionManagementPage = lazy(() => import('../pages/subscription/SubscriptionManagementPage'));
const ContentManagement = lazy(() => import('../pages/ContentManagement/ContentManagement'));
const ParentsManagement = lazy(() => import('../pages/parents/ParentsManagement'));
const SupportCentrePage = lazy(() => import('../pages/SupportCentrePage/SupportCentrePage'));
const NotificationsPage = lazy(() => import('../pages/Notifications/NotificationsPage'));
const PartnersPage = lazy(() => import('../pages/Partners/PartnersPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const ParentDetailsPage = lazy(() => import('../pages/parents/ParentDetailsPage'));
const AddPartnerPage = lazy(() => import('../pages/Partners/AddPartnerPage'));
const PartnerDetailsPage = lazy(() => import('../pages/Partners/PartnerDetailsPage'));
const EditPartnerPage = lazy(() => import('../pages/Partners/EditPartnerPage'));
const PlanDetailsPage = lazy(() => import('../pages/subscription/PlanDetailsPage'));
const CreateEditPlanPage = lazy(() => import('../pages/subscription/CreateEditPlanPage'));
const ContentHierarchyPage = lazy(() => import('../pages/ContentManagement/ContentHierarchyPage'));
const RecentPaymentsPage = lazy(() => import('../pages/payments/RecentPaymentsPage'));
const StudentsData = lazy(() => import('../pages/parentDashboardPages/studentsData'));
const SubscriptionPage = lazy(() => import('../pages/parentDashboardPages/SubscriptionPage'));
const TransactionPage = lazy(() => import('../pages/parentDashboardPages/TransactionPage'));
const PartnerStudentsPage = lazy(() => import('../pages/PartnerDashboardPages/PartnerStudentsPage'));
const PartnerPaymentsPage = lazy(() => import('../pages/PartnerDashboardPages/PartnerPaymentsPage'));
const AppRoutes = () => (
  <Suspense fallback={<GlobalLoader />}>
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
          <Route path="students/import" element={<ImportStudentsPage />} />
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
          <Route
  path="subscriptions/plans/create"
  element={<CreateEditPlanPage />}
/>

<Route
  path="subscriptions/plans/:planId"
  element={<PlanDetailsPage />}
/>

<Route
  path="subscriptions/plans/:planId/edit"
  element={<CreateEditPlanPage />}
/>
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
  </Suspense>
);

export default AppRoutes;
