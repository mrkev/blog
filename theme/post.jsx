const created = page.created.toISOString().split("T")[0];
const modified = page.modified.toISOString().split("T")[0];

<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={page.title} />

    <title>{page.title}</title>
    <style type="text/css">{`
    body {
      margin: 40px auto;
      max-width: 650px;
      line-height: 1.6;
      font-size: 18px;
      color: #444;
      padding: 0 10px
    }
    footer {
      line-height: 1;
    }
    h1,h2,h3 { line-height:1.2 }
    `}</style>
  </head>

  <body>
    <a href=".">back</a>
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
    </footer>
  </body>
</html>;
