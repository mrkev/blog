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
    <header>
      <h1>
        <a href={page.ROOT_PATH}>Midnight Joke</a>
      </h1>
      <div style={{ flexGrow: 1 }}></div>
      <a href=".">&lt; back</a>
      <a href="http://twitter.com/aykev">twitter</a>
      <a href="http://aykev.dev/">www</a>
      <a href={page.ROOT_PATH + "/about"}>about</a>
    </header>
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
