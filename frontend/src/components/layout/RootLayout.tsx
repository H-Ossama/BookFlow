import { Outlet } from 'react-router-dom';

/** App shell */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">
      <Outlet />
    </div>
  );
}
export default RootLayout;
