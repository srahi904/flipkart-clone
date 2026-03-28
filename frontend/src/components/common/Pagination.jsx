import Button from './Button';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 6);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="secondary"
        className="px-3 py-2"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
            currentPage === page
              ? 'bg-[var(--brand-blue)] text-white'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300'
          }`}
        >
          {page}
        </button>
      ))}
      <Button
        variant="secondary"
        className="px-3 py-2"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
