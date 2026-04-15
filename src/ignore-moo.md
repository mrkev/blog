---
Created: 2026-04-10 02:08:31
---

# moo: a little scripting tool

I wrote this little script called `moo` to more easily create and edit bash scripts. It's a couple hundred lines of shell. You can install it by copying it and running it from anywhere in your machine:

    curl -sL <url> -o /tmp/moo && zsh /tmp/moo

When first run, it'll create a `~/.scripts/` directory where all your moo scripts will go and configure your `$PATH` for you.

## Usage

Let's say you find a useful one-liner, such as this one to hide all icons on your desktop: `defaults write com.apple.finder CreateDesktop false; killall Finder`. You've copied it, tried it, and want to save it. Create a moo script:

    moo desktop-hide

This will start your editor. Paste it, save and close. Your script now lives in `~/.scripts/desktop-hide`, chmod-ed, in your `$PATH`, and ready to go. Run it:

    desktop-hide

To edit it just run this again:

    moo desktop-hide

Beyond creating and editing scripts, `moo` also includes some other useful utilities to help with common operations:

    moo --delete desktop-hide       # delete a script
    moo --move desktop-hide hide    # rename a script
    moo --list                      # list all scripts
    moo --dir                       # print scripts directory

Since scripts are just files in `~/.scripts/`, you can also choose to skip `moo` altogether:

    rm ~/.scripts/desktop-hide
    mv ~/.scripts/desktop-hide ~/.scripts/hide
    ls ~/.scripts/
    echo "~/.scripts/"

## Arguments and langauges

It's just scripts. Use any language:

```typescript
#!/usr/bin/env bun

console.log("Running with Bun!");
```

Use parameters. A refresher:

- _$1, $2, ..._: Positional arguments
- _$#_: Total number of arguments passed to the script.
- _$@_: All arguments as separate strings
- \*$\*\*: All arguments as a single string

```bash
#!/bin/bash

git commit -m "$1"
git push
```

Usage:

    send "implement fix"

## Why not aliases?

I used to reach for aliases, but they're a bit more awkward to write since they're quoted:

    alias multi="echo 'They said \"hey\"'
    echo 'We said \"world\"'"

Not to mention they can only be shell scripts, I have to navigate to my alias file to add one, and source it after I'm done so my shell is aware of it. Writing scirpt files more convenient, especailly if you abstract away the little bit of file management there is to it.

Moo isn't that complex. You can view and edit moo using `moo`:

    moo moo

Happy `moo`-ing!

PD: I'm not sure why I called it `moo`. Some combination of being memorable, not coliding with anything in my system, and probably `cowsay`.

```
 _____
< moo >
 -----
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
