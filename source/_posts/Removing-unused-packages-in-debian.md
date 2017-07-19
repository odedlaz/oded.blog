title: Removing unused packages in debian
tags:
  - linux
  - debian
id: 72
updated: '2017-03-07 19:35:01'
permalink: removing-unused-packages
categories:
  - devops
  - ''
date: 2017-01-15 23:02:00
---
Until [flatpak](http://flatpak.org/) | [snaps](http://snapcraft.io/) become the de-facto standard, we'll have to cleanup our system from time to time (I'm not talking about `apt-clean`!)

anyway, linux is not windows, so figuring out which packages haven't been used in a long time can be automated without a lot of effort. specifically, with apt and yum you can fetch the timetsamp of all installed binaries and figure out their corresponding packages.

But why work so hard when you've got an open source project who does all that?

<!-- more -->

*"UnusedPkg is a diagnostic tool to find the unused packages in Linux systems, sorted by their idle time. This helps to find unused packages which could be manually removed to free some space in the filesystem. It supports any apt-based distribution (tested on Debian and Ubuntu), Slackware and blackPanther OS's" - [Emilio Pinna](http://disse.cting.org/)*

#### Installation

1. [clone UnusedPkgs repository](https://github.com/epinna/Unusedpkg)
2. run `./unusedpkg`
3. get a nice diagnosis on all installed packages
