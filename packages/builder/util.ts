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

export function extend<T extends {}, U>(
  page: Record<string, any>,
  extender: Record<string, any>
) {
  Object.keys(extender).forEach(function (key) {
    page[key] = page[key] || extender[key];
  });
}
