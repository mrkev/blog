// index { pages, title }
const index = page;

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={`Listing of ${index.title}`} />

    <title>Directory listing for {index.title}</title>
    <style type="text/css">{`
    body {
      margin: 40px auto;
      max-width: 650px;
      line-height: 1.8;
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
    <h2>Directory listing for {index.title}</h2>
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
