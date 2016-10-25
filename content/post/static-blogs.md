+++
menu = "main"
Description = ""
Tags = [
  "Blog",
  "Hugo",
  "Jekyll",
  "Octopress",
]
Categories = [
  "Blog",
  "Hugo",
  "Jekyll",
  "Octopress",
]
date = "2016-10-25T16:24:52+10:00"
title = "Static Blogs"

+++

I previously had my blog hosted using Ghost, which if you aren't aware of it is a node application that is similar to a lighter-weight Wordpress. The downside is that you need to run the node process to use it, so you need a server or VPS somewhere to run it. For a low traffic blog it's a bit overkill, and particularly since the content is static, why would you want to have to run an active service for this?

I'm just using github pages since you can deploy with a git push and it's free. You can just as easily make any of these static generators work via S3, GCS, etc, but I went down the path of least resistance, no point doing extra work for no benefit right?

So I recently started to investigate what static blog generators would be useful and fit my requirements. Basically I was looking for:

- Doesn't require a program running to serve the blog
- Something that I could remember how to use when I write another blog post in 3 months time
- Themes that are easy to manage/modify/swap-out and readily available
- Support for markdown in posts (in particular things like code blocks, lists, etc)
- Supports drafts (I like to write down ideas at the time then flesh it out later)
- Not too slow

Most of the things I wanted are supported by almost every tool available, but in particular ease of use, theme support and speed vary greatly between various products.

The tools I tried in the end after some quick research were:

- [Jekyll](https://jekyllrb.com/)
- [Octopress](http://octopress.org/)
- [Hugo](http://gohugo.io/)

I started off looking in to Jekyll since it's one of the biggest static site generators around and is very popular, has lots of community support in the form of plugins/examples/themes/etc. After playing with it for an hour or so I quickly eliminated it as they have only just recently added support for easy to manage themes. The process for changing themes in most cases is to clone a copy of the theme repo, then manually merge in your posts and change metadata as appropriate until it's all working. They support git based theme modules now, but I was unable to find a single theme that worked with it. The themes also broke between versions, if you used a newer Jekyll with an old theme it would entirely break at times.

Octopress is based off of Jekyll but more directed at simple blog usage, which happens to be exactly what I was looking for. But it still includes many of the issues of Jekyll, and the theme support is very limited in comparison.

I kept looking and found more comparisons for Hugo, Metalsmith, Middleman, Hexo and Pelican. I only got to trying Hugo, since I found that it ticked all of the boxes (including being one of the [fastest generators around](https://fredrikloch.me/post/2014-08-12-Jekyll-and-its-alternatives-from-a-site-generation-point-of-view/) supposedly). It also supports themes as seperate folders, so they can be managed inside the repo or as submodules quite easily, and supports all the expected markdown features. And best of all, it's a single Go binary that is in many package managers, so it's ahrd to forget how to use it if I don't post in a long time. It also supports live-reload in dev mode, so you can press save in your editor and it re-renders any changed pages/files in under 20ms currently on my laptop

I'll hopefully write a blog post in the near future about setting up Hugo.
