import { getPages } from "@sphido/core";
import { frontmatter } from "@sphido/frontmatter";
import { markdown } from "@sphido/markdown";
import fs from "fs-extra";
import { globby } from "globby";
import path from "path";
import basenameSlug from "sphido-basename-as-slug";
import { renderToFile } from "sphido-jsx-templates";
import {
  linkFieldToEmbed,
  preprocessSpecialEmbeds,
} from "./linkFieldToEmbed.js";
import meta from "./meta.js";
import { partition } from "./util.js";
// import meta from "@sphido/meta";
// import { renderToFile } from "@sphido/nunjucks";
// TODO: rename ROOT_PATH to PATH_TO_ROOT

// if the path contains /-ignore (ie, /src/ignore-test-page.md), it isn't processed

function findRelative(child, parent) {
  if (child.indexOf(parent) !== 0) {
    throw new Error(`${child} is not child of ${parent}`);
  }

  const childDir = path.dirname(child);
  const components = childDir
    .replace(parent, "")
    .split("/")
    .filter((part) => part.length > 0)
    .map(() => "..");
  const relativePath = components.length > 0 ? components.join("/") : ".";

  return relativePath;
}

function include(dirent) {
  if (
    dirent.name.startsWith("_") ||
    dirent.name.startsWith(".") ||
    dirent.name.startsWith("ignore-")
  ) {
    return false;
  }

  if (dirent.isFile()) {
    // Accept *.md, *.html
    const res = dirent.name.endsWith(".md") || dirent.name.endsWith(".html");
    return res;
  }

  // Ignore dirs
  return false;
}

export default {
  /** Builds the blog */
  async build(options = {}) {
    const OUTPUT_DIR = options.out || "docs";
    const SOURCE_DIR = options.src || "src";
    const THEME_DIR = options.themeDir;

    // if (SOURCE_DIR.slice(-1) !== path.sep) {
    //   throw new Error(`Plase include a trailing ${path.sep} on the "src" dir`);
    // }

    // if (OUTPUT_DIR.slice(-1) !== path.sep) {
    //   throw new Error(`Plase include a trailing ${path.sep} on the "out" dir`);
    // }

    if (!THEME_DIR) {
      throw new Error("No theme to render with!");
    }

    const extenders = [
      frontmatter,
      preprocessSpecialEmbeds,
      markdown,
      // require("@sphido/marked"),
      meta,
      basenameSlug,
      linkFieldToEmbed,
      (page) => {
        // page.indexed is true by default, even if not included
        page.indexed = page.indexed === undefined ? true : page.indexed;
        // for SRC/posts/a/foo.md
        // => foo.html
        page.outputBasename = page.slug + ".html";
        // => DOCS/posts/a/foo.html
        page.outputFile = path.join(
          page.dir.replace(SOURCE_DIR, OUTPUT_DIR),
          page.outputBasename
        );
        // => DOCS/posts/a
        page.outputDir = page.dir.replace(SOURCE_DIR, OUTPUT_DIR);
        // => /posts/a/foo.md
        // page.canonicalSrc = page.file.replace(SOURCE_DIR, "");
        // => /posts/a/foo.html
        page.canonicalOut = page.outputFile.replace(OUTPUT_DIR, "");
        // => /posts/a
        page.canonicalDir = page.dir.replace(SOURCE_DIR, "");
        // => ../../
        page.ROOT_PATH = findRelative(page.outputFile, OUTPUT_DIR);

        // console.log(page.outputFile, OUTPUT_DIR);

        // root by default is '', make it '/'. All other paths are already prepended by '/'
        if (page.canonicalDir === "") {
          page.canonicalDir = "/";
        }
      },
    ];

    // 1. Process all md files
    const pages = await getPages({ path: SOURCE_DIR, include }, ...extenders);
    // process.exit(0);

    // 2. save pages
    for await (const page of pages) {
      const contents = fs.readdirSync(THEME_DIR).filter((x) => x[0] === ".");
      // console.log("stats", contents);

      /*
      theme
        post.jsx
        foo.jsx
        footer.jsx
        index.jsx
      post
        a.md
        b.md
      foo
        a.md
        b.md
        */
      // TODO: generate index.html from index.md file by passing "index" vars

      const template = path.join(THEME_DIR, "post.jsx");
      renderToFile(page.outputFile, template, { vars: page });
    }

    // 3. Handle other static content
    const statics = await globby("src/**/*.{css,html,js,png}");
    for await (const st of statics) {
      fs.copySync(st, st.replace("src", OUTPUT_DIR));
    }

    // used for index page generation
    const pagesInAnIndex = pages.filter((page) => page.indexed);
    const pagesByCanonicalDir = partition(
      pagesInAnIndex,
      (page) => page.canonicalDir
    );

    // 4. Generate index pages
    const canonicalDirs = Object.keys(pagesByCanonicalDir);

    // 5. Always include '/' as a canonical dir, since we always want a root index page
    if (canonicalDirs.indexOf("/") === -1) {
      canonicalDirs.push("/");
    }

    // {canonicalDir: [pages.html]}
    const canonicalDirToGendPages = Object.fromEntries(
      canonicalDirs.map((dir) => [
        dir,
        fs.readdirSync(path.join(OUTPUT_DIR, dir)),
      ])
    );

    const canonicalDirsMissingIndex = Object.entries(canonicalDirToGendPages)
      .filter(([_, files]) => files.indexOf("index.html") === -1)
      .map(([dir, _]) => dir);

    for (const canonicalDir of canonicalDirsMissingIndex) {
      const indexOutput = path.join(OUTPUT_DIR, canonicalDir, "index.html");
      const subdirectories = canonicalDirs
        .filter(
          (dir) =>
            // we prepend (ie, /post /post/articles)
            dir.indexOf(canonicalDir) === 0 &&
            // we are not the cannonical dir (no circular references)
            dir !== canonicalDir &&
            // direct decendants only (ie, /post no /post/articles/test)
            dir.replace(canonicalDir, "").indexOf("/") === -1
        )
        // make all paths relative
        .map((dir) => "./" + dir.replace(canonicalDir, ""));

      // console.log("relll", path.relative(canonicalDir, "/"));
      const index = {
        pages:
          pagesByCanonicalDir[canonicalDir]?.sort(
            (a, b) => b.modified - a.modified
          ) ?? [],
        title: canonicalDir,
        subdirectories,
        ROOT_PATH: findRelative(canonicalDir, "/"),
      };
      const template = path.join(THEME_DIR, "index.jsx");
      renderToFile(indexOutput, template, {
        vars: index,
      });
    }

    // copy over other folders
    // fs.copySync("src/css", path.join(OUTPUT_DIR, "css"));
    // fs.copySync("src/js", path.join(OUTPUT_DIR, "js"));
    fs.copySync("src/images", path.join(OUTPUT_DIR, "images"));
  },
};
