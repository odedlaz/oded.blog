title: direnv -- Unclutter your .profile
tags:
  - linux
  - productivity
  - direnv
id: 68
updated: '2017-03-28 08:25:14'
permalink: direnv
categories:
  - devops
  - ''
date: 2016-12-29 11:59:00
---


Many of my projects need specific environment variables to run. Usually I create a `export.sh` script that I source when I `cd` into the directory, or add them into my [docker compose](https://docs.docker.com/compose/) file.

There's a better way, which I highly recommend: [direnv](https://github.com/direnv/direnv).

`direnv` is an environment switcher for the shell. It knows how to hook into bash, zsh, tcsh and fish shell to load or unload environment variables depending on the current directory. This allows project-specific environment variables without cluttering the `~/.profile` file.

Before each prompt, direnv checks for the existence of a `.envrc` file in the current and parent directories. If the file exists (and is authorized), it is loaded into a **bash** sub-shell and all exported variables are then captured by direnv and then made available to the current shell.

It also has a robust standard library which even allows activating [virtualenv's](https://virtualenv.pypa.io/en/stable/) automatically!

## screencasts

All these screencasts were taken from the projects [screencasts doc](https://github.com/direnv/direnv/blob/master/docs/screencasts.md).

### direnv installation on OS X with Homebrew

<script type="text/javascript" src="http://asciinema.org/a/4413.js"
id="asciicast-4413" async></script>

### The direnv security model

<script type="text/javascript" src="http://asciinema.org/a/4416.js"
id="asciicast-4416" async></script>

## Handling ruby versions with direnv

<script type="text/javascript" src="http://asciinema.org/a/4415.js" id="asciicast-4415" async></script>
