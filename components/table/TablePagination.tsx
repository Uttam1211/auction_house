interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
