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

    <title>{index.title}</title>
  </head>
  <body>
    <header>
      <h1>
        <a href={page.ROOT_PATH}>Midnight Joke</a>
      </h1>
      <div style={{ flexGrow: 1 }}></div>
      <a href="http://twitter.com/aykev">twitter</a>
      <a href="http://aykev.dev/">www</a>
      <a href={page.ROOT_PATH + "/about"}>about</a>
    </header>
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
      {index.pages
        .sort((a, b) => {
          return b.created.getTime() - a.created.getTime();
        })
        .map((page) => (
          <li>
            <i>{page.created.toISOString().split("T")[0]}</i>
            <a href={page.outputBasename}>{page.title}</a>
          </li>
        ))}
    </ul>
    <hr />
  </body>
</html>;
