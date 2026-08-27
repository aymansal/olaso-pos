import type { ManagedProductSize } from './productManagementTypes.ts';

function sizeChanged(size: ManagedProductSize, saved: ManagedProductSize[]) {
  if (!size.id) return true;
  const original = saved.find((item) => item.id === size.id);
  return !original
    || original.name !== size.name
    || original.priceCentimes !== size.priceCentimes
    || original.sortOrder !== size.sortOrder
    || original.status !== size.status
    || original.isDefault !== size.isDefault;
}

export function queueProductSizeSaves(
  drafts: ManagedProductSize[],
  saved: ManagedProductSize[],
) {
  const dirty = drafts.filter((size) => sizeChanged(size, saved));
  return [...dirty.filter((size) => !size.isDefault), ...dirty.filter((size) => size.isDefault)];
}
