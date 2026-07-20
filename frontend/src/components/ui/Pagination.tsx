
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

/** Pagination controls */
export function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex gap-2 justify-center items-center py-4">
      {/* TODO: Add pagination controls */}
      <span>Page {currentPage} of {totalPages}</span>
    </div>
  );
}
export default Pagination;
