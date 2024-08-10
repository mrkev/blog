import { readFile } from "@sphido/core";
import yaml from "js-yaml";

// like "@sphido/frontmatter" but instead of dumping into page, dumps into page.meta
export async function frontmatterRaw(page, dirent) {
  if (!dirent.isFile()) {
    return;
  }

  if (!page?.content && page?.path) {
    page.content = await readFile(page.path);
  }

  // Process Front Matter
  if (page?.content.startsWith("---") || page?.content.startsWith("<!--")) {
    let meta = {};
    page.content.replace(
      /^<!--([\s\S]+?)-->|^---([\s\S]+?)---/,
      (frontMatter, html, md) => {
        // page.metaRaw = html || md;
        meta = yaml.load((html || md).trim(), { schema: yaml.JSON_SCHEMA });
        page.meta = meta;
        page.content = page.content.slice(frontMatter.length);
      }
    );
  }
}
