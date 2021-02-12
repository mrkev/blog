/**
 * A little extender that makes post slugs be file basename
 */

const TAKEN_NAMES = new Set();

export default function basenameAsSlug(page) {
  const name = page.base;
  if (TAKEN_NAMES.has(name)) {
    throw new Error("Duplicate posts!");
  } else {
    TAKEN_NAMES.add(name);
  }
  page.slug = page.base;
}
