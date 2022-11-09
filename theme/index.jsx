// index { pages, title }
const index = page;
const isRoot = index.title === "";
const title = isRoot ? "Index" : `Directory listing for ${index.title}`;

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
