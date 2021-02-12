import path from "path";
import globby from "globby";
import { getPages } from "@sphido/core";
import frontmatter from "@sphido/frontmatter";
// import meta from "@sphido/meta";
import { copySync, outputFile } from "fs-extra";
import { markdown } from "@sphido/markdown";
// import { renderToFile } from "@sphido/nunjucks";
import { renderToFile } from "sphido-jsx-templates";
import basenameSlug from "sphido-basename-as-slug";

const { statSync } = require("fs");
const { inspect } = require("util");
const slugify = require("@sindresorhus/slugify");

const headline = /(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i;

const meta = (page) => {
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

export default {
  /** Builds the blog */
  async build(options = {}) {
    const OUTPUT_DIR = options.out || "docs";
    const SOURCE_DIR = options.src || "src";
    const THEME_DIR = options.themeDir;

    if (!THEME_DIR) {
      throw new Error("No theme to render with!");
    }

    const paths_md = await globby(`${SOURCE_DIR}/**/*.md`);
    const extenders = [
      frontmatter,
      markdown,
      require("@sphido/marked"),
      meta,
      basenameSlug,
      (page) => {
        console.log(page);
      },
    ];

    // 1. Process all md files
    const pages = await getPages(paths_md, ...extenders);

    // 2. save pages
    for await (const page of pages) {
      // outputFile(page.toFile, page.getHtml());
      const output = path.join(
        page.dir.replace("src", OUTPUT_DIR),
        page.slug + ".html"
      );
      renderToFile(output, path.join(THEME_DIR, "post.jsx"), { page });
    }

    const statics = await globby("src/**/*.{css,html,js,png}");
    for await (const st of statics) {
      copySync(st, st.replace("src", OUTPUT_DIR));
    }

    // copy over other folders
    // copySync("src/css", path.join(OUTPUT_DIR, "css"));
    // copySync("src/js", path.join(OUTPUT_DIR, "js"));
    copySync("src/images", path.join(OUTPUT_DIR, "images"));
  },
};
