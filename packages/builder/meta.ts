import type { Page } from "@sphido/core";
import { extend } from "./util.ts";
import { statSync } from "fs";
import { dirname } from "node:path";
import { inspect } from "util";
// const slugify = require("@sindresorhus/slugify");

const headline = /(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i;

export async function dates(page: Page) {
  const stats = page.path ? statSync(page.path) : null;
  extend(page, {
    modified: stats ? new Date(inspect(stats.mtime)) : new Date(),
    created: stats ? new Date(inspect(stats.birthtime)) : new Date(),
  });
}

export default (page: Page) => {
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

function titleifyKebabCase(s: string) {
  // https://stackoverflow.com/questions/64489395/converting-snake-case-string-to-title-case
  return s.replace(/^-*(.)|-+(.)/g, (s, c, d) =>
    c ? c.toUpperCase() : " " + d.toUpperCase(),
  );
}
