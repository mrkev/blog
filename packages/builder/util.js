export function partition(array, getBucket) {
  const result = {};

  for (let elem of array) {
    const bucket = getBucket(elem);

    if (!result[bucket]) {
      result[bucket] = [];
    }

    result[bucket].push(elem);
  }

  return result;
}
