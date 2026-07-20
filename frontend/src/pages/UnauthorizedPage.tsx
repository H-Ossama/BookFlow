import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <span className="text-red-400 text-3xl font-bold">!</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8">You don't have permission to access this page.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Go Home
        </Link>
      </div>
    </div>
  );
}
export default UnauthorizedPage;
