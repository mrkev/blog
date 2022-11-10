# Yip

This blog is written in yip, a very opinionated blogging platform I put together because I guess that's a rabbit hole I guess I had to go down. It's built on top of [sphido](https://github.com/sphido/sphido), and focuses on what I need and how I think I'll like to blog. I do incorporate some cool ideas and opinions I thought would be worth a blog post about.

## 1. Filename is irrelevant

One thing I dislike about some blogging platforms out there is the reliance on a specific filename format. I don't like this, because it the first thing one has to do when writing something new is to remember a format. Moreover, I don't want to relinquish control over what the URL for the blogpost will be.

Yip works just like a static http server. In this blog, I think I'll follow a file structure similar to:

```
content/
  2022/
    yip.md
    next-post.md
  2023/
    new-year.md
    etc.md
```

To mantain a year in my URL. The "Created" and "Revised" dates at the bottom of each post are automatically generated via the file's createion and modification dates, and can be modified via a yaml header if necessary.

## 2. `link` variable

Speaking of the yaml header, the one on [this post](TODO) looks as follows:

```yaml
---
created: 2012-02-12T10:43:27Z
link: https://soundcloud.com/mr-onion/takako-mamiya-yoru-ni
---
```

The `created` variable overrides the creation date rendered at the bottom of the post— I want it to be the date when the soundcloud track I shared was posted.

The `link` variable is interesting— something I thought up. Judging by the way I write online today, mostly in Twitter, Youtube, and other forums with comments, I can only assume a lot of my posts will be conversationalist, as a reply to content or to share content. `link` encodes this. It not only creates the embed at the top of the blog post automatically, it also represents that that post is meant and a response to whatever is linked to.

I think this is valuable as compared to just embedding content inline in the blog post body. I can see the possibility of more descriptive page structure and styling, but also for richer index pages.

## 3. JSX templating

As of the writing of this post, the template for blog posts looks like this:

```jsx
// post.jsx
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
```

That's it, that's the whole thing. It's a simple theme, but also... it's JSX?

There's plenty of HTML templating languages out there, and I'm sure they're easy to pick up, but I already know JSX. I also _like_ JSX, becuase it's "just javascript"(TM TODO), so there's no need to learn new syntax for for-loops, if's etc. JavaScript has variables, a pretty good "standard library", and (IMO) a clean syntax already— why learn a completley new templating language?

With a little hackery and adaptation I creating this very simple JSX templating format (JSXT, or just JSX since there's no case in introducing a new file extension). I wanted it to be simple and "template-y" too, akin to Handlebars or Nunjucks. Part of what makes it feel "template-y" is you don't need to import, export, or wrap anything in a function or variable declaration. An normal HTML file is a valid JSXT file\*\*[1], no JavaScript required.

## Closing remarks

Take this, put it in a static site genrator, and you've got `yip`. You can check it out on GitHub [here](TODO). It is and will keep being a tool for my personal use, developed around the needs of this blog —I'm not trying to take over the blogging platform space or anything— but I hope at least the ideas behind it sound interesting to some.

--- Footer: reach me via twitter.

[1]: Almost. Not all valid HTML is valid JSX so technically no, but it does feel like one!
