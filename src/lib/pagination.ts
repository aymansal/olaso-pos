export function visiblePageIndexes(page: number, pageCount: number) {
  const count = Math.min(3, Math.max(0, pageCount));
  const start = pageCount <= 3
    ? 0
    : Math.min(Math.max(0, page - 2), pageCount - 3);
  return Array.from({ length: count }, (_, index) => start + index);
}
