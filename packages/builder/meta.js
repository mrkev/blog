import { statSync } from "fs";
import { dirname } from "node:path";
import { inspect } from "util";
// const slugify = require("@sindresorhus/slugify");

const headline = /(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i;
export default (page) => {
  const stats = page.path ? statSync(page.path) : null;
  const extend = (extender) => {
    Object.keys(extender).forEach(function (key) {
      page[key] = page[key] || extender[key];
    });
  };

  extend({
    content: "",
    // slug: slugify(page.title),
    title: (page.content.match(headline) || [page.name || ""]).pop().trim(),
    modified: stats ? new Date(inspect(stats.mtime)) : new Date(),
    created: stats ? new Date(inspect(stats.birthtime)) : new Date(),
    tags: new Set(page.tags || []),
    dir: dirname(page.path),
  });
};
