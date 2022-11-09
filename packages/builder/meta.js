import { statSync } from "fs";
import { inspect } from "util";
// const slugify = require("@sindresorhus/slugify");

const headline = /(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i;
export default (page) => {
  const stats = page.file ? statSync(page.file) : null;
  const extend = (extender) => {
    Object.keys(extender).forEach(function (key) {
      page[key] = page[key] || extender[key];
    });
  };

  extend({
    content: "",
    // slug: slugify(page.title),
    title: (page.content.match(headline) || [page.base || ""]).pop().trim(),
    modified: stats ? new Date(inspect(stats.mtime)) : new Date(),
    created: stats ? new Date(inspect(stats.birthtime)) : new Date(),
    tags: new Set(page.tags || []),
  });
};
