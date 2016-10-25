+++
menu = "main"
date = "2016-03-30T00:00:00+10:00"
title = "IoT Deployments and Resin.io"
Description = ""
Tags = [
    "Development",
    "IoT",
    "resin.io",
]
Categories = [
    "Development",
    "IoT",
    "resin.io",
]
+++
I started using resin.io recently for a few small projects and love the idea of using docker as a deployment method. It lets you define your application and requirements quite nicely and in a relatively standardized way at that. But currently where it falls a little short is the ability to run multiple applications on a single node, although from what I've been seeing it is one of the most requested features and hopefully isn't too far away. In the mean time I needed a solution that would work for me and be generic and extensible enough to apply to other projects later.

The guys over at resin.io actually asked me to write a guest post for their blog as well, so you can also see this article over on https://resin.io/blog/multi-container-with-docker-compose-on-resin-io Impractical solutions
Sure, there are a few ways to get around this, but none of them are particularly great and for the most part have large downsides.

It's possible to make your startup script run a few processes and background them with a `wait ` at the end of your script, but you lose the ability to restart a failing process or an easy way to differentiate log output from `appX` versus `appY`.

You could instead enable systemd with `ENV INITSYTEM on` in your docker file, then write a few simple systemd service files and enable them. You can then make the services auto restart with a simple `Restart=always`, but then you've lost the ability to view logs from your applications and to easily see if any errors occur from the Resin console.

Even after all that, the largest downside if you've attempted this with even a relatively small set of applications (even just 2-3 300-500MB apps), you'll quickly find that making a small change to a line at the top of your docker file means having to rebuild the entire thing even when lines below are for entirely different apps.

Therefore, what I really wanted to have was a typical docker multi-container deployment where I could re-use some components but not rebuild the entire world for a minor change.

# How is everyone else solving this?
When writing dockerized applications the mantra preached by Docker themselves is 'One application per container'; in fact it's right near the top of their [best practices guide](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/). Currently that is slightly difficult while staying within the Resin framework since it only allows one active container and uses it more as an entire OS image to layer on top of the device.

![](/content/images/2016/03/Compose.png)

One of the most common ways to handle multi-container deployments in docker is with [Docker compose](https://docs.docker.com/compose/overview/). If you haven't heard much about it before, it is essentially a YAML file that defines multiple containers and how they interact with each other: what ports should be open, what volumes should be mounted, which containers should share the same network stack or the same volumes, which containers depend on other ones to be online first, etc.

# Can this work within the Resin framework?
In order for this to work, you need to be executing on a host that is running Docker. Thankfully Resin's deployment system is super flexible and lets you do practically anything you want and almost entirely stays out of the way. I found the existing project from Resin's own [blog post](https://resin.io/engineering/our-first-experiments-with-multi-container-apps/) late last year. However this did not include many things and was very much just a super basic proof of concept as far as docker-compose is concerned. It also touches on using a Resin node as a Kubernetes node but that required an AWS server as the master node since at least one of them needs to be somewhat stateful, so I focused on docker-compose for my use case.

The problems I immediately faced was that the image wouldn't even build in it's current state. After fixing up a few small issues I found that it was running a very old version of Docker using the v1 API which is now deprecated and decided I should start from scratch.

# Docker in Docker
I had been working with some other [docker-in-docker](https://github.com/jpetazzo/dind) applications during work hours and was reasonably comfortable trying to get this to work on an ARM based system. The first step was to make sure we pulled in the latest versions of Docker and docker-compose, the best source currently appears to be from the [Hypriot repositories](https://github.com/hypriot/arm-compose). Once I got those in to the Dockerfile everything started to take shape pretty quickly. I could run some docker-compose commands from the virtual terminal on the Resin dashboard.

# Polishing it up
The only problem, is I want something I can use as a framework to deploy multi-container images and not just a basic proof of concept. In order to do that I had to define few basic objectives:
- The ability to make a small change and not have to rebuild a huge image and pull the whole thing down on a minor change
- Persistent storage of images built by docker-compose
- Clear logging of each application on the Resin dashboard
- Error checking and some basic auto-recovery
- auto-cleanup of old versions of images (so we don't run out of space or need to manually purge /data often)

After playing around for a while I managed to meet all of these objectives. In no particular order:

## Clear logging
Making logs clear as to which application is providing what information is super easy with docker-compose. By default it will prefix log lines with the name of the application. I just had to ensure this was printing to stdout while running everything else in the background.

## Persistent storage
Resin already provides /data as a persistent docker volume. Bind mounting it to /var/lib/docker solves the persistent storage issue. But introduces the problem of docker-compose not being very good at cleaning up after itself.
```
mount -o bind /data /var/lib/docker
```


## Automatic cleanup

I ended up finding the cleanest solution to this was to clean up old docker images before starting up the docker-compose stack on startup. It adds a few seconds of delay on boot of a new version but leaves us with much more free space on the SD card. Just clearing dangling and exited containers should recover most of the space:
```
docker rm -v $(docker ps -a -q -f status=exited 2>/dev/null) &>/dev/null || :
docker rmi $(docker images -f "dangling=true" -q 2>/dev/null) &>/dev/null || :

```

## Error checking/recovery
This one actually took a little while to come up with something that wouldn't be too flaky and wouldn't need any changes depending on the docker-compose configuration since I wanted this to be as re-usable as possible. It's obviously up to the user as to what they would like, but for most of the apps I run in docker-compose I want all of the containers online. Why else would I have defined them if I didn't want to have them running, right? This boiled down to a few lines of bash to check every few minutes if all the containers were online.
```
keep_alive() {
	if [[ $(docker-compose ps 2>&1 | tail -n+3 | grep -v Up | wc -l) -ne 0 ]]; then
		echo "A container has exited. Restarting docker stack."
		docker-compose down
		docker-compose up &
	fi
}

while true; do
	sleep 5m
	keep_alive
done
```

## Not having to rebuild the World
And the most useful part of this whole endeavour, for me at least, was not having to re-download a 1-2GB image from the Resin docker registry each time I made a one line change near the top of a docker file. Admittedly this was made worse by the fact that I'm in Australia and Resin's servers do not appear to be anywhere near close to me :). Now when a small change is made to one application, the `docker-compose.yml` file is re-added, a sub-10kb change is pulled down, the app restarted, then docker-compose uses the local cache as a starting point to make the changes. Better still, unrelated applications do not get touched at all or add to the rebuild time.


# Conclusion
In the end I came up with [this repository](https://github.com/justin8/resin-multi-container) with a simple mutli-container example of a torrent client and a basic web server utilizing transmission and a Ruby static server to giving a directory listing and the ability to download any files in the downloads folder. It's persistent and any torrents can be added/removed from the UI to show up in the downloads folder.

I had lots of fun playing around with this and making something I can use in the future. Hopefully some of you find it useful and can allow you to do some more advanced multi-container deployments with Resin. Feel free to fork the project on Github: https://github.com/justin8/resin-multi-container
