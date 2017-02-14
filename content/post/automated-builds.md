+++
Categories = ["Development","Build"]
Tags = ["Development","Build", "Shippable"]
Description = "Comparisons between a few cloud based build/test tools"
date = "2017-02-03T16:36:38+10:00"
title = "Automated builds"
menu = "main"

+++

I've been using all kinds of build and deployment systems over the years, and used different self-hosted and cloud based deployment systems for both work and my own personal projects as well. 

## The Old
I've been primarily using Jenkins for things for many years as it's open source, has a huge amount of plugins and community support around it as well. Admittedly things like TeamCity have a better UI, but Jenkins can do all the things TeamCity can do and isn't closed source so it gets the thumbs up from me.

## The Problem
The problem is, that unless you build your own build templates to run things within the repo itself, your build process isn't versioned along with your code. In fact it isn't versioned at all usually. Which admittedly has been the status quo for many years, but is hardly best practice in this day and age.

## The New
I'm not sure if the new wave of cloud based build services is the solution to all build system issues, but they certainly have an edge in many regards. In the case of having versioned and more repeatable builds at least many of the cloud based services have the edge. Usually you define the build process for your repository in some service-dependent fashion, in a yaml file most often, then the service will build on all commits. In these config files you also get to (usually) define things like requirements or specific build environments. Many of the more recent ones are Docker based and allow you to define either a custom container or a Docker build file to define your own container

## The Landscape
Admittedly, it's taken me a while to get around to writing this blog post, and now AWS has Code Build released (and I'll be investigating it in the near future as well), but disregarding that, the services I looked in to were drone.io (which is now shutting down their online service, so good thing I didn't choose it), Travis, Shippable and CodeShip. For my purposes I'm looking for free or very cheap. I've had plenty of experience keeping a Jenkins server running, and the setup, maintenance, backups and reliability are pretty hard to beat. Maybe a couple hours of setup initially including automated S3 backups of configuration, and starting a new jenkins server from config backups isn't too bad. A $5/mo server can run quite a few jobs, so services that cost more than $10 or $20 per month for casual/infrequent use are out of the question for me for the most part.

### Drone.io
Drone.io I almost totally disregarded due to their price and the lack of cusomtizability in their build process, the competition had them beat in many ways, and now they only provide a self-hosted platform anyway.

### Travis
Travis is the oldest of the hosted build services that I'm aware of, and they have a huge amount of support and features. The UI is great, and the amount of build services supported is great. However, it is free only during a trial period, then starts at $69/mo for a single job at a time, which is exorbitant compared to their competitors.

### CodeShip
CodeShip has some good reviews, and supports most of the features you could want. The service is split between basic and pro versions. The basic plan starts at $0 and allows 100 builds per month, with the next level being unlimited builds per month for $49. The basic plan is limited to pre-built container types, although there is a good list of supported types, you can't make your own without going to the pro plan starting at $75. For the most part this isn't a big issue for me, and CodeShip is a pretty good choice. Handling [credentials in CodeShip](https://documentation.codeship.com/pro/getting-started/handling-secrets/) builds is less than ideal however. It is only supported in the pro version, and it just gives you a key to encrypt with, and makes that key available to decrypt inside the build. You have to commit the encrypted credentials in each repository you want to use them in, e.g. if you have 10 repos building docker images, you need 10 copies of your credentials, one in each repository. This alone was a deal breaker for myself.

### Shippable
Shippable supports unlimited builds for open source repositories on their free plan and 150 for private repositories. It has very good support for Docker containers, allowing them to be created per build, or to run with the provided containers for each supported language. It also makes creating and pushing docker images simple, it has options to enter post-build steps such as pushing to a docker repository or even any kind of shell scripts you wish. The handling of credentials is (in my opinion) better than how the competition works. Currently it supports 29 different types of these 'integrations' as they call them. You set up an 'integration' via the web UI, give it a name and whatever authorization is required, and then you can reference them in the YAML build file by name. For example, for an SSH key integration, you enter the private and public keys along with a name used to reference it within Shippable, then it can be referenced within the config file, and is available at `/tmp/ssh/$NAME`. You can use this across multiple repositories, and update it in a single place. The one thing it notably doesn't cover that I would like is scheduled builds, e.g. a self-updating build that you would want to run once a day. The only real alternative is to run a scheduled job elsewhere and hit the Shippable API to call a manual build.

## What I'm using today
So, as you might have been able to guess, I'm using Shippable for things now, it had the better feature set for a lower price. I have it building Docker images, running python pip package unit tests and coverage reports and in fact updates to this blog are written out in markdown and a Shippable job is used to generate the HTML output and publish it to a github pages repository. I plan to try out the new AWS CodeBuild in the near future, prices are pretty cheap (~half a cent per build minute), but I might wait for it to mature a bit, in the mean time Shippable is covering almost everything I want to do so far.
