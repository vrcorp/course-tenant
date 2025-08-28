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
import AdminCourses from '../pages/admin/baruisi/courses/Courses';
import AdminQuizzes from '../pages/admin/baruisi/quizzes/Quizzes';
import AdminClasses from '../pages/admin/baruisi/classes/Classes';
import AdminCertificates from '../pages/admin/baruisi/certificates/Certificates';
import AdminAssignments from '../pages/admin/baruisi/assignments/Assignments';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/tenants" element={<AdminTenants />} />
      <Route path="/admin/api-keys" element={<AdminApiKeys />} />
      <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
      <Route path="/admin/config" element={<AdminConfig />} />
      <Route path="/admin/vouchers" element={<AdminVouchers />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/site-settings" element={<AdminSiteSettings />} />
      <Route path="/admin/api-settings" element={<AdminApiSettings />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/affiliators" element={<AdminAffiliators />} />
      <Route path="/admin/affiliator-payouts" element={<AdminAffiliatorPayouts />} />
      <Route path="/admin/affiliator-analytics" element={<AdminAffiliatorAnalytics />} />
      <Route path="/admin/instructors" element={<AdminInstructors />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/certificates" element={<AdminCertificates />} />
        <Route path="/admin/assignments" element={<AdminAssignments />} />
          </Route>
    </Routes>
  );
};

export default AdminRoutes;
