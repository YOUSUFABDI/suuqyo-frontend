export const isStorageCapacity = (name: string) => {
  if (!name) return false;

  // matches: 120GB, 120 GB, 1.5 TB, 512mb, 64 KiB, etc.
  return /\b\d+(\.\d+)?\s*(k|m|g|t)i?b\b/i.test(name);
};
