---
modified: 2024-08-10T02:53:51.448Z
---# Yip

This blog is built with `yip`, a very opinionated static site generator for blogging I put together because I guess that's the rabbit I had to go down before acutally writing. It _is_ a good topic for a first blog post though, so I'll quickly describe some of its interesting parts. `yip` is built on top of [sphido](https://github.com/sphido/sphido), focuses on what I need, and is built for how I think I'll want to blog. I won't release it on `npm` because I built it for me, but I do incorporate some cool ideas and opinions I thought would be worth sharing.

## 1. No filename formats

One thing I dislike about some blogging platforms out there is the reliance on a specific filename format. I don't want my posts to _have_ to be called `2012-09-12-how-to-write-a-blog.md`. It just means I'll have to google it every time before I can start writing something. Moreover, I don't want to relinquish control over what the URL for the blogpost will be; I don't want my url to be `blog.blog/posts/2012/09/12/how-to-write-a-blog.html`.

`yip` generates a site that works just like a static http server; the file path is the URL path, and every directory gets an `index.html`. I don't really see the point to having the creation date on the URL, so for this blog I'll follow a simple structure similar to this:

```
src/
  yip.md
  next-post.md
  midnight-joke.md
```

If you scroll to the bottom you'll see "Created" and "Revised" timestamps at the bottom of each post. If you go to the [blog index](.), you'll notice dates there too. They're automatically generated via the file's createion and modification dates, and not something you've got to type out in a specific format. If you wish to override them, you can via a yaml header at the top of the file.

## 2. `link` variable

Speaking of the yaml header, the one on [this post](./midnight-joke) looks as follows:

```yaml
---
created: 2012-02-12T10:43:27Z
link: https://soundcloud.com/mr-onion/takako-mamiya-yoru-ni
---
```

The `created` variable overrides the creation date rendered at the bottom of the post. In this case, I don't want it to be the timestamp when the post was created. I want it to be the timestamp when the track was posted to Soundcloud.

The `link` variable is something I thought up. Judging by the way I write online today, mostly in Twitter, Youtube, and other forums with comments, I can only assume a lot of my posts will be replies and shares. `link` encodes this. It's meant to signify that this post relates to the content at another URL. In this case it's a Soundcloud track, which it knows to render as an embed at the top of the blog post.

I think this is more valuable than just embedding content inline in the blog post body both semantically and visually. Semantically I can see the possiblity of richer index pages that leverage this information. Currently this blog doesn't, but perhaps in some future it will. Within the post itself, you can also keep a different, consistent style that differentiates a reply/share from an embed. Again, currently this blog's simple styling doesn't, but perhaps in some future it will.

## 3. JSX templating

Speaking of styling and rendering though, it's worth writing about templates. As of the writing of this post, the template for blog posts looks like this:

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

There are plenty of HTML templating languages out there, and I'm sure they are easy to pick up, but I already know JSX. I also _like_ JSX, amongst other things, becuase it's *just javascript*™. There's no need to learn new syntax for for-loops, conditionals, string operations, etc. JavaScript has all those, and uses a syntax I already know. Moreover, it has other features that would be considered advanced in a templating language, such as variables, user-defined functions and a pretty good (and well documented), built-in standard library.

With a little hackery and adaptation I created this very simple JSX templating format (JSXT, or just JSX— there's no case in introducing a new file extension). It's not react, it has no client runtime, it's all static and has a few other limitations, but it's enough for the purpose of this blog. I wanted it to be "template-y" too, akin to Handlebars or Nunjucks. Part of what makes it feel "template-y" is you don't need to import, export, or wrap anything in a function or variable declaration. A normal HTML file is a valid JSXT file<sup>[1]</sup>, no JavaScript required.

## Closing remarks

Take this, put it in a static site genrator, and you've got `yip`. You can check it out on GitHub [here](https://github.com/mrkev/blog/tree/0469d71996a70067e7b6bd411eb615011f6a8a6a/packages/builder). It is and will keep being a tool for my personal use, developed around the needs of this blog —I'm not trying to take over the blogging platform space or anything— but I hope at least the ideas behind it sound interesting to some.

---

[1]: Almost. Not all valid HTML is valid JSX so technically no, but it does feel like it `¯\_(ツ)_/¯`
