import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
}

/** Status badge */
export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
      {children}
    </span>
  );
}
export default Badge;
