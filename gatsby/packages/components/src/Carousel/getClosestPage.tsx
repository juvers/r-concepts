/**
 * Find the index of a value in `pageOffsets`
 * that is closest to the given `toOffset`.
 */
export const getClosestPage = (
  /** The offset to which page offsets will be compared. */
  toOffset: number,
  /** An ordered list of child offsets. */
  pageOffsets: number[],
  /** An optional index to start searching from. */
  index = Math.floor(pageOffsets.length / 2),
): number => {
  let min = 0;
  let max = pageOffsets.length;
  // Normalize starting index to be between min and max - 1, inclusive.
  index = Math.max(0, Math.min(index, max - 1));
  while (index < max) {
    const offset = pageOffsets[index];
    if (toOffset === offset) {
      // If `toOffset` matches the offset at this index, return the index.
      return index;
    } else if (toOffset < offset) {
      // If we've converged on a min index, this must be the closest offset.
      if (index === min) {
        return index;
      }
      // If `toOffset` is less than the offset at this index, check if it
      // is between this offset and the offset at the previous index.
      const indexLeft = index - 1;
      const offsetLeft = pageOffsets[indexLeft];
      // If `toOffset` is between the offset at this index and the offset
      // at the previous index, return the index of the closest of the offsets.
      if (toOffset > offsetLeft) {
        if (offset - toOffset < toOffset - offsetLeft) {
          return index;
        } else {
          return indexLeft;
        }
      }

      // Bisect the set of previous offsets and check against that index.
      max = index;
      index = Math.floor(index / 2);
    } else {
      // If we've converged on a max index, this must be the closest offset.
      if (index === max - 1) {
        return index;
      }
      // If `toOffset` is greater than the offset at this index, check if it
      // is between this offset and the offset at the next index.
      const indexRight = index + 1;
      const offsetRight = pageOffsets[indexRight];
      // If `toOffset` is between the offset at this index and the offset
      // at the next index, return the index of the closest of the offsets.
      if (toOffset < offsetRight) {
        if (toOffset - offset < offsetRight - toOffset) {
          return index;
        } else {
          return indexRight;
        }
      }

      // Bisect the set of next offsets and check against that index.
      min = index + 1;
      index = Math.floor(min + (max - min) / 2);
    }
  }
  // We didn't find any offsets closer than the offset at this index.
  return index;
};
