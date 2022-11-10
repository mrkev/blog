// index { pages, title }
const index = page;
const isRoot = index.title === "/";
const title = isRoot ? "Index" : `Directory listing for ${index.title}`;

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={`Listing of ${index.title}`} />
    <link
      rel="stylesheet"
      type="text/css"
      href={page.ROOT_PATH + "/css/main.css"}
    />

    <title>Directory listing for {index.title}</title>
  </head>
  <body>
    <h2>{title}</h2>
    {!isRoot && (
      <div>
        <a href={".."}>&lt; back</a>
      </div>
    )}
    {index.subdirectories.map((dir) => (
      <div>
        <a href={dir}>{dir}</a>
      </div>
    ))}
    <hr />
    <ul>
      {index.pages.map((page) => (
        <li>
          <i>{page.modified.toISOString().split("T")[0]}</i>
          <a href={page.outputBasename}>{page.title}</a>
        </li>
      ))}
    </ul>
    <hr />
  </body>
</html>;
