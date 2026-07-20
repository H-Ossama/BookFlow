import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title = 'No data', description = 'Nothing to display yet.', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-[#121620] border border-white/5 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Inbox className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {action && (
        <button onClick={action.onClick} className="px-4 py-2 rounded-lg bg-[#c5a880] text-[#0a0c10] text-sm font-semibold hover:bg-[#d6ba93] transition-colors cursor-pointer">
          {action.label}
        </button>
      )}
    </div>
  );
}
export default EmptyState;
