import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import PlaceholderPage from '../pages/shared/PlaceholderPage';
import StudentManagementPage from '../pages/students/StudentManagementPage';
import StudentDetailsPage from '../pages/students/StudentDetailsPage';

import ReferralManagementPage from '../pages/referral/referralManagementPage';
import SubscriptionManagementPage from '../pages/subscription/SubscriptionMangementPage';
import ContentManagement from '../pages/ContentManagement/ContentMangement';
import ParentsManagement from '../pages/parents/ParentsManagement';
import SupportCentrePage from '../pages/SupportCentrePage/SupportCentrePage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="students/:id" element={<StudentDetailsPage />} />
        <Route path="parents" element={<ParentsManagement/>} />
        <Route path="content" element={<ContentManagement/>} />
    
        <Route path="subscriptions" element={<SubscriptionManagementPage/>} />
        <Route path="payments" element={<PlaceholderPage title="Payments & Revenue" />} />
        <Route path="referrals" element={<ReferralManagementPage/>} />
        <Route path="partners" element={<PlaceholderPage title="Partner Management" />} />
        <Route path="notifications" element={<NotificationsPage/>} />
        <Route path="support" element={<SupportCentrePage/>} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
