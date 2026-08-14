/**
 * Returns page numbers and 'ellipsis' markers for compact pagination.
 * Example: [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]
 */
export default function getVisiblePages(currentPage, totalPages, siblingCount = 1) {
  if (totalPages <= 0) return [];

  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const totalNumbers = siblingCount * 2 + 5; // siblings + current + first + last + 2 ellipses

  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [...range(1, leftItemCount), 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [1, 'ellipsis', ...range(totalPages - rightItemCount + 1, totalPages)];
  }

  return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', totalPages];
}
