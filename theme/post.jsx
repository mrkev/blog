const created = page.created.toISOString().split("T")[0];
const modified = page.modified.toISOString().split("T")[0];

const description = "a post by Kevin Chavez";
const previewImage = "http://aykev.dev/favicon/apple-touch-icon.png";

<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={page.title} />
    <meta name="author" content="Kevin Chavez" />
    {/* twitter */}
    <meta name="twitter:site" content="@aykev" />
    <meta name="twitter:domain" content="aykev.dev" />
    <meta name="twitter:card" content="summary" />
    {/* Facebook */}
    <meta property="og:site_name" content="Midnight Joke" />
    <meta property="og:type" content="article" />
    {/* Both */}
    <meta
      name="twitter:title"
      property="og:title"
      itemprop="name"
      content={page.title}
    />
    <meta
      name="twitter:description"
      property="og:description"
      itemprop="description"
      content={description}
    ></meta>
    <meta
      property="og:image"
      itemprop="image primaryImageOfPage"
      content={previewImage}
    />
    {/* Site */}
    {/* <link
      href="https://davidrzs.github.io/latexcss/latex.css"
      rel="stylesheet"
    /> */}

    {/* <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
    /> */}
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/ysegor256/tacit@gh-pages/tacit-css-1.8.1.min.css"
    />
    {/* <link rel="stylesheet" href="https://unpkg.com/normalize.css"/ /> */}
    {/* <link rel="stylesheet" href="https://unpkg.com/magick.css" /> */}
    {/* <link rel="stylesheet" href="https://cdn.simplecss.org/simple-v1.css" /> */}

    <link
      rel="stylesheet"
      type="text/css"
      href={page.ROOT_PATH + "/css/main.css"}
    />
    <title>{page.title}</title>
    <script>
      {`
      const preference = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "dark" : "light";
      let theme = localStorage.getItem("data-theme") ?? preference;
      document.documentElement.setAttribute("data-theme", theme);
      function toggleTheme(){
        const newTheme = theme === "light" ? "dark" : "light";
        localStorage.setItem("data-theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        theme = newTheme;
      }
      `}
    </script>
  </head>

  <body>
    <script type="text/javascript">
      {`(function(window, document, dataLayerName, id) {
window[dataLayerName]=window[dataLayerName]||[],window[dataLayerName].push({start:(new Date).getTime(),event:"stg.start"});var scripts=document.getElementsByTagName('script')[0],tags=document.createElement('script');
function stgCreateCookie(a,b,c){var d="";if(c){var e=new Date;e.setTime(e.getTime()+24*c*60*60*1e3),d="; expires="+e.toUTCString()}document.cookie=a+"="+b+d+"; path=/"}
var isStgDebug=(window.location.href.match("stg_debug")||document.cookie.match("stg_debug"))&&!window.location.href.match("stg_disable_debug");stgCreateCookie("stg_debug",isStgDebug?1:"",isStgDebug?14:-1);
var qP=[];dataLayerName!=="dataLayer"&&qP.push("data_layer_name="+dataLayerName),isStgDebug&&qP.push("stg_debug");var qPString=qP.length>0?("?"+qP.join("&")):"";
tags.async=!0,tags.src="https://aykev.containers.piwik.pro/"+id+".js"+qPString,scripts.parentNode.insertBefore(tags,scripts);
!function(a,n,i){a[n]=a[n]||{};for(var c=0;c<i.length;c++)!function(i){a[n][i]=a[n][i]||{},a[n][i].api=a[n][i].api||function(){var a=[].slice.call(arguments,0);"string"==typeof a[0]&&window[dataLayerName].push({event:n+"."+i+":"+a[0],parameters:[].slice.call(arguments,1)})}}(i[c])}(window,"ppms",["tm","cm"]);
})(window, document, 'dataLayer', 'ce45e582-b6aa-4577-b686-f1ed3ea78e81');`}
    </script>
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
