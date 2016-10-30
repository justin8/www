+++
title = "Hugo"
Description = "Setting up a Hugo blog"
Tags = [
  "Blog",
  "Hugo",
]
Categories = [
  "Blog",
  "Hugo",
]
menu = "main"
date = "2016-10-30T16:36:09+10:00"

+++

Since I recently moved my blog to Hugo, I figured it's a good time to write up a few bits about it.

In the setup I went with, there are a few key pieces:

- Hugo
- Github pages
- Cloudflare

There are alternatives to each, but these are the one's I've found to be simple to use and maintain, as well as being 100% free for personal use.

Let's start at setting up Hugo. You can install it from your package manager n many cases, it's available on OSX, Archlinux and Ubuntu at the very least; other distros may vary.

## Create the new site
`hugo new site myblog`

This will generate a relatively empty basic site config with a `config.toml` file for setting up site-wide settings. Most of it is pretty self explanatory.

## Create a first post
`hugo new post/foo.md`

This will generate a templated post in `content/post/foo.md`. There is a small blob of toml format metadata at the top, and anything written below the `+++` will be included in the posts, it doesn't get much simpler.

## Git repo
Github pages are great for small static sites, they're free, they're version controlled, it's easy to edit git repos since it's available almost everywhere.

After creating a new repo you can just push your Hugo site to it.
From the root of the new Hugo site, run `git init`, add the files and make your first commit `git commit -a -m "Initial commit"`.


## Hugo themes
Since hugo has easy to manage themes, and they're almost all git based, this means it's easier to manage themes without downloading them to your repo or including all sorts of excess stuff in there. I'll use the (hugo-uno theme)[https://github.com/fredrikloch/hugo-uno] for the example. From the root of the hugo site, it's as simple as:

`git submodule add https://github.com/fredrikloch/hugo-uno themes/hugo-uno`

Then change the `theme =` line in config.toml to `theme = "hugo-uno"`. No additional space taken up in your repo, and changes from upstream can be pulled in with a `git pull` and a `git commit`.

## Saving out static files to be served
This part is a little bit more complicated than I would like, but this lets you keep your master branch and working files seperate from the public files, as well as keeping the 2 source trees seperate but within the same repo. I use a git worktree to checkout an alternative branch from the same `.git` in to a seperate subfolder. Hugo builds to a folder named `public` in the root of the checkout by default, so lets work with that. Adding `public` to the `.gitignore` is the first step, then create and checkout the `gh-pages` branch in to the public folder: `git worktree add -b gh-pages public`. When you run `hugo` with no parameters it will build the static files to the public folder, then you can do the usual git add/commit/push dance. But that is tedious and repetetive, so I just wrote a (script for it here)[https://github.com/justin8/www/blob/master/deploy.sh]. Feel free to use it, you just provide the commit message as the first parameter and it will commit, build the static files and push them to the gh-pages branch if there are any changes. After making the first push to the `gh-pages` branch you can then set this as the branch to use on Github.

## Github pages
In the settings tab for the repo on github, go to settings in the top bar, then scroll down to the `GitHub Pages` header and set the source to `gh-pages` branch and set a custom domain to your website.

## Cloudflare
So, who on earth still has a site without SSL in this day and age? Cloudflare lets you do this in a few seconds and can cache things closer to users and make your site even faster. Just add the 2 (or 4 if you want an apex domain as well) records to cloudflare, and make sure it's set to cache and that's it. If you have problems finding the right page with the IPs to use for Github pages it's (here)[https://help.github.com/articles/setting-up-an-apex-domain/] (I had trouble finding it at first myself). All done, a static site, hosted for free, with SSL and caching at PoPs all over the world that requires zero maintenance.

