import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#c5a880] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-colors">
          <Home className="h-4 w-4" /> Go Home
        </Link>
      </div>
    </div>
  );
}
export default NotFoundPage;
