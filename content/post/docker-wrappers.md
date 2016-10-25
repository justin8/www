+++
menu = "main"
date = "2015-10-14T00:00:00+10:00"
title = "The benefits of Docker for CLI tools"
Description = ""
Tags = [
  "Development",
  "Docker",
]
Categories = [
  "Development",
  "Docker",
]

+++

So I've been using docker for a couple years now and still finding new ways to use it (as well as new bugs). Recently I've been finding two use cases in particular that are very useful, and hard to replicate with any existing tools.

Firstly there is the ability to create a command-line tool that might need a large or specific environment, but you don't want to make sure it will work cleanly on Debian and Ubuntu and Fedora and RHEL and the list goes on. Docker provides a great way to make not just web and server applications portable, but also command line tools themselves.

I've been using Arch Linux for the past 3 years and started maintaining a few packages here and there. In order to make more replicable builds and ensuring I would never fall in to the 'works on my machine' mentality I tried to do clean builds of packages. Starting with chroots, eventually moving on to using nspawn and then later adapting the Arch devtools package to handle some of the nspawn parts itself, just wrapping it to allow multiple builds at the same time as one user and other nice things.

I started having more and more issues with it, and eventually decided I would give it a go making it work in Docker. So I ended up with this [justin8/makepkg](https://hub.docker.com/r/justin8/makepkg/) docker image ([Github link here](https://github.com/justin8/docker-makepkg)). I'm using an Arch Linux docker image, with all the `base-devel` packages installed, and a small wrapper for `makepkg` itself inside of the image, as well as a `dmakepkg` (docker makepkg) script to run locally. The `dmakepkg` script is the key part that makes the docker image so useful. Putting it in your path, you can call it in place of `makepkg` and it lets you use the tool on any other OS as well. It also lets you completely trash your build environment and have it blown away as soon as it's finished. Leveraging Docker for the parallelism, cleanup and storage of images makes this amazingly useful.

The default flags it runs with are: `--force --syncdeps --noconfirm` which although it is different from the default of no flags at all for makepkg, it lets you run it with no options and have a completed package output in the current directory (or `$PKGDEST` if it is set in your `pacman.conf`). It is also possibly to use any standard `makepkg` flags as well by using them as arguments to `dmakepkg` and it passes them through as well. I've tried to make it support as many of the regular makepkg features as I can by passing through the required information in to the container. things like LOGDEST, SRCPKGDEST, PKGDEST and SRCDEST are supported, as well as using the host's package cache for faster builds and optionally the host's pacman.conf.

The two things it does not currently support is the `updpkgsums` function (which isn't technically makepkg anyway) and `mksrcinfo` (which again, not technically makepkg either). But this may change in the future. The [Github](https://github.com/justin8/docker-makepkg) page will always have an up-to-date readme for what is supported.

The second use case I'm quite fond of is similar, but slightly different. I've also been using Docker to do kernel builds for Debian machines. I don't have a Debian laptop, only a lot of servers to maintain that are utilizing it. For large builds such as kernels it can be a bit of a pain using the standard deb-pkg make option. Using a Dockerfile for the actual build process, instead of using it for a replicable build environment allows the layered caching mechanism to be used for each step of the build process. So long as the steps are ordered in a sane manner, it allows for very quick changes to an image, built from and for any particular OS version, regardless of your host machine.
