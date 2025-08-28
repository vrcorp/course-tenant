import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 ml-60 mt-16 p-6 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
