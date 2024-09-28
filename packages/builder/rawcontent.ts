// export async function frontmatter(page, dirent) {
//   if (dirent.isFile()) {
//     if (!page?.content && page?.path) {
//       page.content = await readFile(page.path);
//     }

//     // Process Front Matter
//     if (page?.content.startsWith("---") || page?.content.startsWith("<!--")) {
//       let meta = {};
//       page.content.replace(
//         /^<!--([\s\S]+?)-->|^---([\s\S]+?)---/,
//         (frontMatter, html, md) => {
//           meta = yaml.load((html || md).trim());
//           page = Object.assign(page, meta);
//           page.content = page.content.slice(frontMatter.length).trim();
//         }
//       );
//     }
//   }
// }
