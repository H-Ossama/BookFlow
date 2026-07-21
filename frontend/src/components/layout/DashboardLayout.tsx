import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { NotificationBell } from '../notifications/NotificationBell';
import { Menu } from 'lucide-react';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell flex h-screen overflow-hidden">
      <video className="dashboard-video" autoPlay loop muted playsInline aria-hidden="true">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
      </video>
      <div className="dashboard-glass-overlay" aria-hidden="true" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
        <header className="dashboard-mobile-header lg:hidden flex items-center justify-between px-4 py-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-bold text-white font-serif tracking-tight">BookFlow<span className="text-[#86d6c8]">.</span></h1>
          <NotificationBell />
        </header>
        <div className="hidden lg:flex items-center justify-end px-6 py-3 shrink-0">
          <NotificationBell />
        </div>
        <main className="dashboard-main flex-1 overflow-y-auto">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
