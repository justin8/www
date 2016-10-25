+++
menu = "main"
date = "2015-11-23T00:00:00+10:00"
title = "Thoughts on Keybase.io"
Description = ""
Tags = [
  "Development",
]
Categories = [
  "Development",
]
+++
GPG has always been a bit of a double-edged sword. It's fantastic in terms of security, reliability and ubiquity, sure. But it's never been particularly easy to use and finding the correct key for a person is not very reliable. Once you get used to the CLI it's not bad, but it has a bit of a learning curve, and finding the right person and the right key can require a bit of luck.

As for the second problem, most people don't know others online by their GPG key ID any more than they can remember their ICQ number. This is where keybase comes in. They greatly simplify identifying a person and finding their key. They provide the ability to prove you own various social media accounts (github, reddit, twitter, hackernews, websites, etc) and a nice web UI to look it all up. With pure GPG, people can create a key and put in any email they want, and upload it with no verification. Which makes it possible to download a key using a keyserver fine, but actually looking one up via an email address or name is futile at best.

The command line client integrates with GPG as well so everything that supports GPG can use keybase with only a little work. You can find a person's public key by searching for their username, and see what other accounts it links to. All the proof provided is publicly available and verifiable by any third party as well, so you're not placing all your trust in an opaque system to send you the correct keys for you to use.

I see some criticism of the system online, but the only one I would agree with currently is that you can upload your private key to keybase, or potentially use their javascript (client side) key generator to create a new key pair if you do not already have one. But it isn't mandatory! Keybase is a directory for keys, and an easy way to use gpg, and it succeeds at both.

I first signed up for an account over a year ago, but only recently had a chance to play around with it, and I really like it so far. The two main problems I've found working with GPG in the past (hard to use and hard to find the right users) are both solved by the keybase.io platform, so I see myself using it a lot more in the future.
