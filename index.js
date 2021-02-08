import { join, dirname, basename } from "path";
import globby from "globby";
import { getPages } from "@sphido/core";
import frontmatter from "@sphido/frontmatter";
import meta from "@sphido/meta";
import { copySync, outputFile } from "fs-extra";
import { markdown } from "@sphido/markdown";
import { renderToFile } from "@sphido/nunjucks";

const OUTPUT_DIR = "docs";

const TAKEN_NAMES = {};
function registerName(name) {
  if (TAKEN_NAMES[name]) {
    throw new Error("Duplicate posts!");
  } else {
    TAKEN_NAMES[name] = true;
  }
}

(async function () {
  // 1. get list of pages
  const pages = await getPages(
    // source
    await globby("src/**/*.md"),

    frontmatter,
    markdown,
    require("@sphido/marked"),
    meta,

    // add custom page extender
    (page) => {
      // console.log(page);
      registerName(page.base);
      page.slug = page.base;
      // page.toFile = join(
      //   page.dir.replace("src", OUTPUT_DIR),
      //   page.base,
      //   "index.html"
      // );
    },

    {
      save(dir, template) {
        return renderToFile(join(dir, this.slug + ".html"), template, {
          page: this,
        });
      },
    }
  );

  // 2. save pages
  for await (const page of pages) {
    // outputFile(page.toFile, page.getHtml());
    page.save(page.dir.replace("src", OUTPUT_DIR), "theme/post.html");
  }

  const statics = await globby("src/**/*.{css,html,js,png}");
  for await (const st of statics) {
    copySync(st, st.replace("src", OUTPUT_DIR));
  }

  // copy over other folders
  // copySync("src/css", join(OUTPUT_DIR, "css"));
  // copySync("src/js", join(OUTPUT_DIR, "js"));
  copySync("src/images", join(OUTPUT_DIR, "images"));
})();
