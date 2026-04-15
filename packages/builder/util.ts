export function partition<T>(array: T[], getBucket: (elem: T) => string) {
  const result: Record<string, T[]> = {};

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
  extender: Record<string, any>,
) {
  Object.keys(extender).forEach(function (key) {
    page[key] = page[key] || extender[key];
  });
}
