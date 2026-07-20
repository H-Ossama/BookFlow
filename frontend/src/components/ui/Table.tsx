
interface TableProps {
  children: React.ReactNode;
}

/** Data table */
export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}
export default Table;
