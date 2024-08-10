import { extend } from "./util.ts";
import { statSync } from "fs";
import { dirname } from "node:path";
import { inspect } from "util";
// const slugify = require("@sindresorhus/slugify");

const headline = /(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i;

export function dates(page: Record<string, any>) {
  const stats = page.path ? statSync(page.path) : null;
  extend(page, {
    modified: stats ? new Date(inspect(stats.mtime)) : new Date(),
    created: stats ? new Date(inspect(stats.birthtime)) : new Date(),
  });
}

export default (page: Record<string, any>) => {
  dates(page);
  extend(page, {
    content: "",
    // slug: slugify(page.title),
    title: (
      page.content.match(headline) || [titleifyKebabCase(page.name) || ""]
    )
      .pop()
      .trim(),
    tags: new Set(page.tags || []),
    dir: dirname(page.path),
  });
};

function titleifyKebabCase(s) {
  // https://stackoverflow.com/questions/64489395/converting-snake-case-string-to-title-case
  return s.replace(/^-*(.)|-+(.)/g, (s, c, d) =>
    c ? c.toUpperCase() : " " + d.toUpperCase()
  );
}
