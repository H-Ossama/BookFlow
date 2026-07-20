import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

/** Public-facing layout */
export function PublicLayout() {
  return (
    <div className="site-shell flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default PublicLayout;
