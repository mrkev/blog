const created = page.created.toISOString().split("T")[0];
const modified = page.modified.toISOString().split("T")[0];

<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={page.title} />
    <link
      rel="stylesheet"
      type="text/css"
      href={page.ROOT_PATH + "/css/main.css"}
    />
    <title>{page.title}</title>
  </head>

  <body>
    <header
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <h1>aykev.dev/blog</h1>
      <a href="http://aykev.dev/">about</a>
    </header>
    <a href=".">&lt; back to index</a>
    <hr />
    {page.embed}
    {page.content}
    <hr />
    <footer>
      <small>
        <i>
          Created: {created}
          {modified !== created && ", Revised: " + modified}
        </i>
      </small>
      <br />
      <a href=".">&lt; back to index</a>
    </footer>
  </body>
</html>;
