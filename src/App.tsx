import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

import Programs from "./pages/Programs";
import Analytics from "./pages/Analytics";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import MyOrders from "./pages/MyOrders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Documentation from "./pages/Documentation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Affiliate from "./pages/Affiliate";
import AffiliateFAQ from "./pages/affiliate/FAQ";
import AffiliateRegister from "./pages/affiliate/Register";

import TenantLanding from "./pages/tenant/TenantLanding";
import TenantLogin from "./pages/tenant/TenantLogin";
import TenantRegister from "./pages/tenant/TenantRegister";
import TenantPackages from "./pages/tenant/TenantPackages";
import TenantCart from "./pages/tenant/TenantCart";
import TenantOrders from "./pages/tenant/TenantOrders";
import TenantProfile from "./pages/tenant/TenantProfile";
// Newly added pages

import LiveClasses from "./pages/LiveClasses";
import Quizzes from "./pages/Quizzes";
import Assignments from "./pages/Assignments";
import Certificates from "./pages/Certificates";
import Forum from "./pages/Forum";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Notifications from "./pages/Notifications";
import Webhooks from "./pages/Webhooks";
// Affiliator subpages under /affiliatr
import AffiliatorDashboard from "./pages/affiliatr/Dashboard";
import AffiliatorLinks from "./pages/affiliatr/Links";
import AffiliatorCommissions from "./pages/affiliatr/Commissions";
import AffiliatorPayouts from "./pages/affiliatr/Payouts";
import AffiliatorAssets from "./pages/affiliatr/Assets";
// Admin pages under /admin/baruisi (role-based wrappers)
// Removed: AdminTenants, AdminApiKeys, AdminAuditLogs, AdminConfig - not needed for core user roles
import AdminDashboard from "./pages/admin/baruisi/Dashboard";
import AdminUsers from "./pages/admin/baruisi/users/Users";
import AdminInstructors from "./pages/admin/baruisi/instructors/Instructors";
import AdminAffiliators from "./pages/admin/baruisi/affiliators/Affiliators";

import AdminCourses from "./pages/tenant/admin/AdminCourses";
import AdminQuizzes from "./pages/admin/baruisi/quizzes/Quizzes";
import AdminClasses from "./pages/admin/baruisi/classes/Classes";
import AdminCertificates from "./pages/admin/baruisi/certificates/Certificates";
import AdminAssignments from "./pages/admin/baruisi/assignments/Assignments";


import AdminVouchers from "./pages/admin/baruisi/Vouchers";
import AdminOrders from "./pages/admin/baruisi/Orders";



import AdminSiteSettings from "./pages/admin/baruisi/SiteSettings";
import AdminApiSettings from "./pages/admin/baruisi/ApiSettings";
import AdminReports from "./pages/admin/baruisi/Reports";
import AdminAffiliatorPayouts from "./pages/admin/baruisi/AffiliatorPayouts";
import AdminAffiliatorAnalytics from "./pages/admin/baruisi/AffiliatorAnalytics";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoutes from "./routes/AdminRoutes";
import AffiliatorRoutes from "./routes/AffiliatorRoutes";


// Tenant Admin pages (for LMS tenant owners)
import TenantAdminOverview from "./pages/tenant-admin/Overview";
import TenantAdminCourses from "./pages/tenant-admin/Courses";
import TenantAdminStudents from "./pages/tenant-admin/Students";
import TenantAdminInstructors from "./pages/tenant-admin/Instructors";
import TenantAdminClasses from "./pages/tenant-admin/Classes";
import TenantAdminQuizzes from "./pages/tenant-admin/Quizzes";
import TenantAdminAssignments from "./pages/tenant-admin/Assignments";
import TenantAdminCertificates from "./pages/tenant-admin/Certificates";
import TenantAdminSettings from "./pages/tenant-admin/Settings";
import TenantAdminRoute from "./routes/TenantAdminRoute";

import AffiliatorReports from "./pages/affiliatr/Reports";
import AffiliatorAnalytics from "./pages/affiliatr/Analytics";
import { TenantAuthProvider } from "./contexts/TenantAuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { useGuestTransfer } from "./hooks/useGuestTransfer";
import TenantLayout from "./components/tenant/TenantLayout";

const queryClient = new QueryClient();

// Component to handle guest transfer logic
const AppWithTransfer = () => {
  useGuestTransfer();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute allow={["user"]} element={<Dashboard />} />}
        />

        <Route path="/programs" element={<Programs />} />
        <Route path="/live-classes" element={<LiveClasses />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/affiliate/faq" element={<AffiliateFAQ />} />
        <Route path="/affiliate/register" element={<AffiliateRegister />} />

        {/* Tenant Routes - Public Authentication Pages (must come before wildcard) */}
        <Route path="/t/:tenantSlug/login" element={<TenantLogin />} />
        <Route path="/t/:tenantSlug/register" element={<TenantRegister />} />
        
        {/* Tenant Isolated Routes with TenantAuthProvider */}
        <Route path="/t/:tenantSlug" element={
          <TenantAuthProvider>
            <TenantLayout>
              <TenantLanding />
            </TenantLayout>
          </TenantAuthProvider>
        } />
        
        <Route path="/t/:tenantSlug/packages" element={
          <TenantAuthProvider>
            <TenantLayout>
              <TenantPackages />
            </TenantLayout>
          </TenantAuthProvider>
        } />
        
        <Route path="/t/:tenantSlug/cart" element={
          <TenantAuthProvider>
            <TenantLayout>
              <TenantCart />
            </TenantLayout>
          </TenantAuthProvider>
        } />
        
        <Route path="/t/:tenantSlug/orders" element={
          <TenantAuthProvider>
            <TenantLayout>
              <TenantOrders />
            </TenantLayout>
          </TenantAuthProvider>
        } />
        
        <Route path="/t/:tenantSlug/profile" element={
          <TenantAuthProvider>
            <TenantLayout>
              <TenantProfile />
            </TenantLayout>
          </TenantAuthProvider>
        } />

        {/* Protected Routes */}
        <Route
          path="/orders"
          element={<ProtectedRoute allow={["user"]} element={<Orders />} />}
        />
        <Route
          path="/cart"
          element={<Cart />}
        />
        <Route
          path="/checkout"
          element={<Checkout />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute allow={["user"]} element={<Profile />} />}
        />
        <Route
          path="/my-courses"
          element={<ProtectedRoute allow={["user"]} element={<MyCourses />} />}
        />
        <Route
          path="/my-orders"
          element={<ProtectedRoute allow={["user"]} element={<MyOrders />} />}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute allow={["user"]} element={<Settings />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={<ProtectedRoute allow={["admin"]} element={<AdminRoutes />} />}
        />

        {/* Affiliator Routes */}
        <Route
          path="/affiliator/*"
          element={<ProtectedRoute allow={["affiliator"]} element={<AffiliatorRoutes />} />}
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <WishlistProvider>
        <BrowserRouter>
        <TenantAuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute allow={["user"]} element={<Dashboard />} />}
            />

            <Route path="/programs" element={<Programs />} />
            <Route path="/live-classes" element={<LiveClasses />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/affiliate/faq" element={<AffiliateFAQ />} />
            <Route path="/affiliate/register" element={<AffiliateRegister />} />

            {/* Tenant Routes - Public Authentication Pages (must come before wildcard) */}
            <Route path="/t/:tenantSlug/login" element={<TenantLogin />} />
            <Route path="/t/:tenantSlug/register" element={<TenantRegister />} />
            
            {/* Tenant Isolated Routes with TenantAuthProvider */}
            <Route path="/t/:tenantSlug" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantLanding />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/packages" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantPackages />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/cart" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantCart />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/orders" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantOrders />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/profile" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantProfile />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            {/* Tenant Admin Routes */}
            <Route path="/t/:tenantSlug/admin" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminOverview />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/admin/courses" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminCourses />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/admin/instructors" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminInstructors />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/admin/students" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminStudents />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/admin/classes" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminClasses />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/admin/quizzes" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminQuizzes />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/admin/assignments" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminAssignments />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/admin/certificates" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminCertificates />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />
            
            <Route path="/t/:tenantSlug/admin/settings" element={
              <TenantAuthProvider>
                <TenantLayout>
                  <TenantAdminRoute element={<TenantAdminSettings />} />
                </TenantLayout>
              </TenantAuthProvider>
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/orders"
              element={<ProtectedRoute allow={["user"]} element={<Orders />} />}
            />
            <Route path="/products" element={<Products />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/cart" element={<ProtectedRoute allow={["user"]} element={<Cart />} />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<ProtectedRoute allow={["user"]} element={<Profile />} />} />
            <Route path="/my-courses" element={<ProtectedRoute allow={["user"]} element={<MyCourses />} />} />
            <Route path="/my-orders" element={<ProtectedRoute allow={["user"]} element={<MyOrders />} />} />
            <Route path="/settings" element={<ProtectedRoute allow={["user"]} element={<Settings />} />} />

            <Route path="/notifications" element={<Notifications />} />
            <Route path="/webhooks" element={<Webhooks />} />
            <Route path="/affiliatr/dashboard" element={<ProtectedRoute allow={["affiliator"]} element={<AffiliatorDashboard />} />} />
            <Route path="/affiliatr/links" element={<ProtectedRoute allow={["affiliator"]} element={<AffiliatorLinks />} />} />
            <Route path="/affiliatr/commissions" element={<ProtectedRoute allow={["affiliator"]} element={<AffiliatorCommissions />} />} />
            <Route path="/affiliatr/payouts" element={<ProtectedRoute allow={["affiliator"]} element={<AffiliatorPayouts />} />} />
            <Route path="/affiliatr/assets" element={<ProtectedRoute allow={["affiliator"]} element={<AffiliatorAssets />} />} />
            <Route path="/affiliatr/reports" element={<ProtectedRoute allow={["affiliator"]} element={<AffiliatorReports />} />} />
            <Route path="/affiliatr/analytics" element={<ProtectedRoute allow={["affiliator"]} element={<AffiliatorAnalytics />} />} />
            {/* Admin routes under /admin - Core user roles only */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminDashboard />} />} />
            
            {/* Core user management routes */}
            <Route path="/admin/users" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminUsers />} />} />
            <Route path="/admin/affiliators" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminAffiliators />} />} />
            <Route path="/admin/instructors" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminInstructors />} />} />


            {/* Core content routes */}
            <Route path="/admin/courses" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminCourses />} />} />
            <Route path="/admin/quizzes" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminQuizzes />} />} />
            <Route path="/admin/classes" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminClasses />} />} />
            <Route path="/admin/certificates" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminCertificates />} />} />
            <Route path="/admin/assignments" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminAssignments />} />} />
            
            
            {/* Commerce routes */}
            <Route path="/admin/vouchers" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminVouchers />} />} />
            <Route path="/admin/orders" element={<ProtectedRoute allow={["admin", "super_admin"]} element={<AdminOrders />} />} />

            <Route path="/tenant-admin/instructors" element={<ProtectedRoute allow={["user"]} element={<TenantAdminRoute element={<TenantAdminInstructors />} />} />} />
            <Route path="/tenant-admin/classes" element={<ProtectedRoute allow={["user"]} element={<TenantAdminRoute element={<TenantAdminClasses />} />} />} />
            <Route path="/tenant-admin/quizzes" element={<ProtectedRoute allow={["user"]} element={<TenantAdminRoute element={<TenantAdminQuizzes />} />} />} />
            <Route path="/tenant-admin/assignments" element={<ProtectedRoute allow={["user"]} element={<TenantAdminRoute element={<TenantAdminAssignments />} />} />} />
            <Route path="/tenant-admin/certificates" element={<ProtectedRoute allow={["user"]} element={<TenantAdminRoute element={<TenantAdminCertificates />} />} />} />
            <Route path="/tenant-admin/settings" element={<ProtectedRoute allow={["user"]} element={<TenantAdminRoute element={<TenantAdminSettings />} />} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        </TenantAuthProvider>
        </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
