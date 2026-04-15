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

export function extend(
  page: Record<string, unknown>,
  extender: Record<string, unknown>,
) {
  for (const key in extender) {
    page[key] = page[key] || extender[key];
  }
}
