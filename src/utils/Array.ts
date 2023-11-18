export const arraySliceIntoChunks = (
  arr: unknown[],
  chunkSize: number
): Array<unknown[]> => {
  const res = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }

  return res;
};
