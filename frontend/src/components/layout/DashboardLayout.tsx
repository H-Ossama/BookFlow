import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  return (
    <div className="dashboard-shell flex h-screen overflow-hidden bg-[#0a0c10]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="dashboard-main flex-1 overflow-y-auto p-6 bg-[#0a0c10]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
