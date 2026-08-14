import React from 'react';
import getVisiblePages from '../utils/getVisiblePages';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  itemsPerPage,
  totalItems,
}) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
      <p className="text-sm text-gray-600 shrink-0">
        Zeige {startIndex + 1} bis {Math.min(startIndex + itemsPerPage, totalItems)} von {totalItems} Einträgen
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${currentPage === 1 ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        >
          Zurück
        </button>
        <div className="flex flex-wrap gap-1">
          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-sm text-gray-500"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded border text-sm font-medium transition-colors ${currentPage === page ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                {page}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${currentPage === totalPages ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        >
          Nächste
        </button>
      </div>
    </div>
  );
}
