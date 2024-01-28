/**
 * A little extender that makes post slugs be file basename
 */

const TAKEN_NAMES = new Set();

export default function basenameAsSlug(page) {
  const name = page.name;
  if (TAKEN_NAMES.has(name)) {
    throw new Error(`Duplicate posts! Two posts named: ${name}`);
  } else {
    TAKEN_NAMES.add(name);
  }
  page.slug = page.name;
}
