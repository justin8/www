+++
menu = "main"
date = "2016-01-03T00:00:00+10:00"
title = "Gnome sleep behaviour"
Description = ""
Tags = [
    "Development",
    "Linux",
    "Gnome",
]
Categories = [
    "Development",
    "Linux",
    "Gnome",
]
+++
By default Gnome lets you set a period of inactivity after which the system should suspend/hibernate/etc. This is fine for a desktop where you're actively using it, but I also use Gnome on my media center where this is less than ideal.

The use case I have is that I might play a 20-180 minute long video throughout which I don't want any power saving features like screen dimming, sleep, etc. I use Plex's web UI mostly currently, and it tells the browser which tells Gnome to not suspend while a video is playing and overall works really well.

But some websites don't do this. Notably youtube. If I have a 15 minute timeout to sleep, it will sleep 15 minutes in to any full screen youtube video anyway. I tried to find a solution already out there and couldn't find much, so if anyone else is annoyed by this, then I've written the script below that will prevent any power actions from occurring while an audio device is in use. You just need to run it within your user's crontab or any other method you wish that will run it periodically as the user gnome and pulseaudio are running as.

```
#!/bin/bash
export $(cat /proc/$(pgrep -u $(whoami) ^gnome-shell$)/environ | grep -z DBUS_SESSION_BUS_ADDRESS)
export XDG_RUNTIME_DIR=/run/user/$UID

audio=$(pactl list | grep -A2 '^Sink' | grep RUNNING)

for i in {1..60}; do
	if [[ $audio ]]; then
		dconf write /org/gnome/settings-daemon/plugins/power/sleep-inactive-ac-type "'nothing'"
		exit 0
	fi
	sleep 1
done

dconf write /org/gnome/settings-daemon/plugins/power/sleep-inactive-ac-type "'suspend'"
```

It's also available on one of my github repos here: https://github.com/justin8/scripts/blob/master/audio-monitor
