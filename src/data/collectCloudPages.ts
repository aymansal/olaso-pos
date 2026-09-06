import type { PaginationOptions } from 'convex/server';

export type CloudPage<T> = {
  page: T[];
  isDone: boolean;
  continueCursor: string;
  pageStatus?: 'PageReady' | 'SplitRequired' | 'SplitRecommended' | null;
  splitCursor?: string | null;
};

export async function collectCloudPages<T>(
  queryPage: (options: PaginationOptions) => Promise<CloudPage<T>>,
  isCancelled: () => boolean = () => false,
): Promise<T[]> {
  const rows: T[] = [];
  const continuationCursors = new Set<string>();
  const splitCursors = new Set<string>();

  const throwIfCancelled = () => {
    if (isCancelled()) {
      throw new Error('Snapshot loading was cancelled.');
    }
  };

  // Resolves one cursor interval, replacing incomplete SplitRequired pages
  // with their two ordered halves so every row is aggregated exactly once.
  // An interval is complete when the query reports isDone or its returned
  // cursor reaches the interval's own endCursor.
  async function collectInterval(paginationOpts: PaginationOptions): Promise<void> {
    throwIfCancelled();
    const page = await queryPage(paginationOpts);
    if (page.pageStatus === 'SplitRequired') {
      if (!page.splitCursor || splitCursors.has(page.splitCursor)) {
        throw new Error('Snapshot page split did not return a usable split cursor.');
      }
      splitCursors.add(page.splitCursor);
      await collectInterval({ ...paginationOpts, endCursor: page.splitCursor });
      await collectInterval({
        ...paginationOpts,
        cursor: page.splitCursor,
        endCursor: paginationOpts.endCursor ?? page.continueCursor,
      });
      if (page.isDone) return;
      if (!page.continueCursor) {
        throw new Error('Snapshot pagination did not return a continuation cursor.');
      }
      if (continuationCursors.has(page.continueCursor)) {
        throw new Error('Snapshot pagination repeated a continuation cursor.');
      }
      continuationCursors.add(page.continueCursor);
      await collectInterval({ ...paginationOpts, cursor: page.continueCursor });
      return;
    }
    rows.push(...page.page);
    if (page.isDone) return;
    if (!page.continueCursor) {
      throw new Error('Snapshot pagination did not return a continuation cursor.');
    }
    if (paginationOpts.endCursor !== undefined
      && page.continueCursor === paginationOpts.endCursor) {
      return;
    }
    if (continuationCursors.has(page.continueCursor)) {
      throw new Error('Snapshot pagination repeated a continuation cursor.');
    }
    continuationCursors.add(page.continueCursor);
    await collectInterval({ ...paginationOpts, cursor: page.continueCursor });
  }

  await collectInterval({ numItems: 60, cursor: null });
  throwIfCancelled();
  return rows;
}
