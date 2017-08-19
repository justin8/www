---

title: "Portinus"
date: 2017-07-19T12:42:01+10:00
Tags:
    - Development
    - Automation
    - Docker

---

If you've ever tried to run various apps or services on a Linux distro you'll have found that keeping things managed in a repository of some kind with configuration management makes life a million times easier. However using these methods on a smaller scale of 1 or 2 servers, for example on a home system, is a little more challenging as a lot of these tools are created to service entire fleets of machines in an enterprise environment.

Anyone who has managed even a single Linux server for any length of time will be able to attest to how much easier things are when you have a reproducible configuration and everything is in some kind of package management or equivalent. Maintaining a system with `make && sudo make install` as the "recommended" installation method for many things these days will cause a mess of a system in no time at all.

Sadly, most distros don't make it particularly easy to manage applications in the context of their package manager. If you've ever tried to make an RPM or deb package you'll know what I'm talking about. Arch Linux with its AUR is the only distro that comes close to being able to support random new applications easily within the context of the system package manager, with deb's `check-install` being a distant second. There are tools like [FPM](https://github.com/jordansissel/fpm) that make this a little better, but they don't produce very nice packages and aren't the easiest to maintain.

In recent years I've been slowly moving all of these things in to Docker containers and using [Docker Compose](https://github.com/docker/compose) to create various linked services. This has let me offload the package management/creation side of things to someone else while still being able to keep an up-to-date system without fear of breaking any applications. It also made rolling back to previous versions of applications a piece of cake since you can just specify the specific versioned tag you want.

However, as I started to move things in to compose stacks I found a huge gap in the landscape of Docker. All of the tools for managing stacks are created to manage hundreds of containers, or lots of instances of a single service, or clusters of Docker hosts. Nothing seemed to be a good solution for me to use on a home server with only one or two hosts. What I essentially wanted was to say "here is a compose file, run it and keep it running healthily". Seems like a simple request right?

Well it turns out nothing I could find at the time would support this, so I had to make my own. I ended up creating [Portinus](https://github.com/justin8/portinus) to do exactly this. I wanted to make something simple that I wouldn't have to mess with again for a long time and that would keep a service running while I'm away. I travel a lot for work these days and it can mean I may not be home for several weeks, or have time or internet to access my home server and fix something over SSH, so it needed to be reliable and maintain the healthy state of a service.

I made sure to use systemd services to run the service itself, as it's stable, simple, solid and available on every mainstream distro these days by default, making it super painless and not requiring any additional services to run like supervisord or other alternatives. In order to make sure that a service stayed healthy it also supports using the new compose v3 health checks, if a health check is defined and it gets to an unhealthy state the whole stack will be bounced.

Some (dodgy) applications also don't stand well to being online for a long period of time, so you can also specify in systemd timer notation a restart schedule for the service using a single flag, e.g. `--restart daily`. It also allows you to control the service directly for e.g. start/stop/restart commands as well as being able to use the CLI `portinus` command to pass through any docker-compose commands if you want to inspect the stack manually; none of this cd'ing to the right directory to run docker-compose and having to set up your environment to pull in the right variables you've defined in your compose file, it all just works.

So if you're looking for a way to run a few docker containers somewhat permanently, I'd recommend checking out [Portinus](https://github.com/justin8/portinus)
