import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/baruisi/Dashboard';
import AdminTenants from '../pages/admin/baruisi/Tenants';
import AdminApiKeys from '../pages/admin/baruisi/ApiKeys';
import AdminAuditLogs from '../pages/admin/baruisi/AuditLogs';
import AdminConfig from '../pages/admin/baruisi/Config';
import AdminVouchers from '../pages/admin/baruisi/Vouchers';
import AdminOrders from '../pages/admin/baruisi/Orders';
import AdminUsers from '../pages/admin/baruisi/users/Users';
import AdminSiteSettings from '../pages/admin/baruisi/SiteSettings';
import AdminApiSettings from '../pages/admin/baruisi/ApiSettings';
import AdminReports from '../pages/admin/baruisi/Reports';
import AdminAffiliators from '../pages/admin/baruisi/affiliators/Affiliators';
import AdminAffiliatorPayouts from '../pages/admin/baruisi/AffiliatorPayouts';
import AdminAffiliatorAnalytics from '../pages/admin/baruisi/AffiliatorAnalytics';
import AdminInstructors from '../pages/admin/baruisi/instructors/Instructors';
import AdminLayout from '../components/admin/AdminLayout';
import AdminCourses from '../pages/admin/baruisi/courses/AdminCourses';
import CourseQuizzes from '../pages/admin/baruisi/courses/CourseQuizzes';
import QuizQuestions from '../pages/admin/baruisi/courses/QuizQuestions';
import AdminQuizzes from '../pages/admin/baruisi/quizzes/Quizzes';
import AdminClasses from '../pages/admin/baruisi/classes/Classes';
import AdminCertificates from '../pages/admin/baruisi/certificates/Certificates';
import AdminAssignments from '../pages/admin/baruisi/assignments/Assignments';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="tenants" element={<AdminTenants />} />
      <Route path="api-keys" element={<AdminApiKeys />} />
      <Route path="audit-logs" element={<AdminAuditLogs />} />
      <Route path="config" element={<AdminConfig />} />
      <Route path="vouchers" element={<AdminVouchers />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="site-settings" element={<AdminSiteSettings />} />
      <Route path="api-settings" element={<AdminApiSettings />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="affiliators" element={<AdminAffiliators />} />
      <Route path="affiliator-payouts" element={<AdminAffiliatorPayouts />} />
      <Route path="affiliator-analytics" element={<AdminAffiliatorAnalytics />} />
      <Route path="instructors" element={<AdminInstructors />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="courses/:courseId/quizzes" element={<CourseQuizzes />} />
        <Route path="courses/:courseId/quizzes/:quizId/questions" element={<QuizQuestions />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="assignments" element={<AdminAssignments />} />
          </Route>
    </Routes>
  );
};

export default AdminRoutes;
