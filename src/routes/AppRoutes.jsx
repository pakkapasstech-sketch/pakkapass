import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import PlaceholderPage from '../pages/shared/PlaceholderPage';
import StudentManagementPage from '../pages/students/StudentManagementPage';
import StudentDetailsPage from '../pages/students/StudentDetailsPage';
import VideoManagementPage from '../pages/content/videoManagement';
import PdfManagementPage from '../pages/content/pdfManagement';
import ReferralManagementPage from '../pages/referral/referralManagementPage';
import SubscriptionManagementPage from '../pages/subscription/SubscriptionMangementPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="students/:id" element={<StudentDetailsPage />} />
        <Route path="parents" element={<PlaceholderPage title="Parent Management" />} />
        <Route path="content" element={<PlaceholderPage title="Content Management" />} />
        <Route path="content/videos" element={<VideoManagementPage/>} />
        <Route path="content/pdfs" element={<PdfManagementPage />} />
        <Route path="analytics" element={<PlaceholderPage title="Analytics Center" />} />
        <Route path="subscriptions" element={<SubscriptionManagementPage/>} />
        <Route path="payments" element={<PlaceholderPage title="Payments & Revenue" />} />
        <Route path="referrals" element={<ReferralManagementPage/>} />
        <Route path="partners" element={<PlaceholderPage title="Partner Management" />} />
        <Route path="downloads" element={<PlaceholderPage title="App Downloads" />} />
        <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
        <Route path="support" element={<PlaceholderPage title="Support Center" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
