
/**
 * Reusable pagination component.
 *
 * Props:
 * - page: zero‑based current page number
 * - totalPages: total number of pages (>= 0)
 * - onPageChange: function(page: number) => void
 * - pageSize?: optional, not used internally but kept for future extensions
 */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // nothing to paginate

  const handlePageClick = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  // Determine which page numbers to show – show current ±2, plus first/last when far away
  const visiblePages = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }
  // Add first page if not already included
  if (start > 0) visiblePages.unshift(0);
  // Add last page if not already included
  if (end < totalPages - 1) visiblePages.push(totalPages - 1);

  // Helper to render a button for a page number
  const renderPageButton = (pageNum) => (
    <button
      key={pageNum}
      onClick={() => handlePageClick(pageNum)}
      disabled={pageNum === page}
      aria-current={pageNum === page ? 'page' : undefined}
      className={`mx-1 px-3 py-1 rounded min-h-touch min-w-touch transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
        pageNum === page
          ? 'bg-cyan-600 text-white cursor-default'
          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
      }`}
    >
      {pageNum + 1}
    </button>
  );

  // Keyboard navigation – Left/Right arrows, Home/End
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handlePageClick(page - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlePageClick(page + 1);
        break;
      case 'Home':
        e.preventDefault();
        handlePageClick(0);
        break;
      case 'End':
        e.preventDefault();
        handlePageClick(totalPages - 1);
        break;
      default:
        break;
    }
  };

  return (
    <nav
      className="flex items-center justify-center flex-wrap gap-2 mt-6"
      aria-label="Page navigation"
      onKeyDown={handleKeyDown}
    >
      {/* Previous */}
      <button
        onClick={() => handlePageClick(page - 1)}
        disabled={page <= 0}
        aria-label="Previous page"
        className="px-3 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      >
        ‹
      </button>

      {/* Page numbers */}
      {visiblePages.map(renderPageButton)}

      {/* Next */}
      <button
        onClick={() => handlePageClick(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next page"
        className="px-3 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      >
        ›
      </button>
    </nav>
  );
};

export default Pagination;
