/** Assign whole groups once by their full option count, not current selections. */
export function balanceOptionGroups(counts: readonly number[]): number[][] {
  if (counts.length < 2) return [counts.map((_, index) => index)];
  const columns: number[][] = [[], []];
  const heights = [0, 0];
  counts.forEach((count, index) => {
    const column = heights[0] <= heights[1] ? 0 : 1;
    columns[column].push(index);
    // Heading/spacing plus equal-height option rows.
    heights[column] += 50 + count * 51;
  });
  return columns;
}
