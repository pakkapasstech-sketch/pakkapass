import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../auth/ProtectedRoute';
import { PERMISSIONS } from '../auth/permissions';
import { ROLES } from '../auth/roles';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import UnauthorizedPage from '../pages/shared/UnauthorizedPage';
import StudentManagementPage from '../pages/students/StudentManagementPage';
import StudentDetailsPage from '../pages/students/StudentDetailsPage';
import ReferralManagementPage from '../pages/referral/referralManagementPage';
import SubscriptionManagementPage from '../pages/subscription/SubscriptionManagementPage';
import ContentManagement from '../pages/ContentManagement/ContentMangement';
import ParentsManagement from '../pages/parents/ParentsManagement';
import SupportCentrePage from '../pages/SupportCentrePage/SupportCentrePage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import PartnersPage from '../pages/Partners/PartnersPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import ParentDetailsPage from '../pages/parents/ParentDetailsPage';
const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route element={<ProtectedRoute permission={PERMISSIONS.STUDENT_VIEW} />}>
          <Route path="students" element={<StudentManagementPage />} />
          <Route path="students/:id" element={<StudentDetailsPage />} />
        </Route>

        <Route element={<ProtectedRoute permission={PERMISSIONS.STUDENT_VIEW} roles={[ROLES.ADMIN]} />}>
          <Route path="parents" element={<ParentsManagement />} />
          <Route path="parents/:id" element={<ParentDetailsPage/>}/>
        </Route>

        <Route element={<ProtectedRoute permission={PERMISSIONS.INSTITUTION_VIEW} roles={[ROLES.ADMIN]} />}>
          <Route path="partners" element={<PartnersPage />} />
        </Route>

        <Route element={<ProtectedRoute permission={PERMISSIONS.RESOURCE_VIEW} />}>
          <Route path="content" element={<ContentManagement />} />
        </Route>

        <Route element={<ProtectedRoute permission={PERMISSIONS.COUPON_VIEW} roles={[ROLES.ADMIN]} />}>
          <Route path="subscriptions" element={<SubscriptionManagementPage />} />
          <Route path="coupons" element={<ReferralManagementPage />} />
        </Route>

        <Route element={<ProtectedRoute permission={PERMISSIONS.COMMISSION_VIEW} />}>
          <Route path="commissions" element={<ReferralManagementPage />} />
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
