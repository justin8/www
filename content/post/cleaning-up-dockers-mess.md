+++
menu = "main"
date = "2015-11-14T00:00:00+10:00"
title = "Cleaning up Docker's mess"
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
If you've been running Docker for any length of time, particularly on machines that don't have multi-terabyte hard drives, you will be aware that it is terrible at house keeping. There are a few quick and (in most cases) safe ways to clean house.

**Remove exited containers**

`docker rm -v $(docker ps -a -q -f status=exited)`

Usually pretty safe, unless you're storing data in exited containers without a durable backup somewhere.

**Remove dangling images**

Whenever you download a new image with the same tag (say a new version with the 'latest' tag) Docker doesn't clean up your old image; it will just remove the tag and leave it 'dangling'. You end up with something like this:

```
REPOSITORY                         TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
justin8/makepkg                    latest              4c4698dea970        10 seconds ago      726.6 MB
<none>                             <none>              ca6f638b4521        48 seconds ago      726.6 MB
<none>                             <none>              17cf5a850494        About an hour ago   726.6 MB
justin8/archlinux                  latest              5ac921edda1c        25 hours ago        289.1 MB
cloud9/elasticsearch               2.0.0               3fcc7a40b99f        10 days ago         347.5 MB

```

With plenty of `<none>` tagged images. The easy solution, which is of course not a single command or flag like you would expect from an application that has seen such widespread use:

`docker rmi $(docker images -f "dangling=true" -q)`

To save your sanity, these two can be fairly safely added to a cron job at whatever schedule you like.
