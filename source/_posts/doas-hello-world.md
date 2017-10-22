title: Everything that is wrong with sudo, and how I'm planning to fix it
tags:
  - c++
  - project
permalink: doas-linux
categories:
  - programming
date: 2017-10-21 00:37:00
---

<h1 align="center">
  <a href="https://github.com/odedlaz/suex"><img src="/images/2017/10/suex_xkcd.png" alt="suex" width="256" height="256"/></a><br>
  <a href="https://github.com/odedlaz/suex">suex</a>
</h1>

The last few weeks have been a bit crazy.

I found myself re-implementing [`gosu`](https://github.com/tianon/gosu) because it lacked features I needed: [sick of sudoers NOPASSWD?](/2017/08/30/runas-tool/).

Then, Even when I was done, I felt something was missing. `runas`, the tool I wrote, was half-way into becoming a `sudo` replacement and it bugged me I stopped mid way.

I looked around the web and found an amazing project called `doas` that is basically `runas` on steroids.

## What is doas

*doas* is a utility that is aimed to replace *sudo* for most ordinary use cases.
Ted Unagst's, an OpenBSD developer, explained why He originally wrote it in his blog post: [doas - dedicated openbsd application subexecutor](https://www.tedunangst.com/flak/post/doas).

The gist is that `sudo` is hard to configure and does a lot more then the standard user needs. `doas` was created in order to replace `sudo` for regular folks like me and you.  
Moreover, `sudo` lacks 'blacklist' behaviour which is extremely useful at times.

`doas` is relatively easy to configure, and an absolute joy compared to `sudo`. It's also powerful enough for most daily use-cases.
IMO, the `permit` / `deny` concept of `doas` is so powerful that it's enough to make the switch.

## Implementing doas from scratch

The problem was that `doas` was written for [OpenBSD](https://www.openbsd.org/).
I'm not running OpenBSD, so I looked around for a port.

All ports I found were half baked and poorly written.

Then I looked at the original source code, and decided I'm not going to port it.

Why? because it's written in `C`, and I really don't want to maintain `C` code.  
Furthermore, the original code base lacked feature I introduced in `runas` which I really loved.

Instead, I decided to start this project. A complete re-implementation of `doas`.

This is my first attempt at writing a production quality, open source project from scratch.  

I'm not there yet, but I'm determined on pushing this project into the main repositories of both `ubuntu` and `fedora`. More work has to be done in order to get there. for instance: Adding system tests & Getting the code audited.

Feel free to reach out if you want to contribute!

## Project Goals

* ***Secure***. User's shouldn't be able to abuse the utility, and it should protect the user from making stupid mistakes.

* **Easy**. The utility should be easy to audit, to maintain, to extend and to contribute to.

* ***Friendly***. Rule creation should be straight forward. Rule should be easy to understand and easy to debug.

* ***Powerful***. Rules should be short, concise and allow find-grained control.

* ***Feature Parity***. This project should have *complete* feature parity with the original utility.

To achieve these goals, the following design decisions were made:

1. The whole project was implemented in modern C++.
2. Explicit is better then implicit (for instance, rule commands must be absolute paths)
3. Prefer using the standard library when possible - for the sake of security and maintainability.
5. Commands are globs, which allows to use the same rule for many executables.
1. Arguments are PCRE-compliant regular expressions, which allows to create fine-grained rules.

## Getting started

You can find pre-compiled `.deb` and `.rpm` packages in the project's [GitHub Releases Page](https://github.com/odedlaz/suex/releases).

**[!]** [Ubuntu PPA](https://help.ubuntu.com/community/PPA) & [Fedora Copr](https://docs.pagure.org/copr.copr/)  are coming soon.

You can also build from source. more information found at [`odedlaz/suex`](https://github.com/odedlaz/suex).

## Changes compared to the original

### Security checks

`doas` doesn't check the owners & permissions of the binary and configuration file.
`sudo` checks those, but only warns the user.

This version ensures the binary and configuration file are owned by `root:root`.  
It also ensures the binary has [setuid](https://en.wikipedia.org/wiki/Setuid), and that the configuration file has only read permissions.

Furthermore, only full paths of commands are allowed in the configuration file.  
The idea is that privileged users (i.e: members of the *wheel* group) need to explicitly set the rule instead of depending on the running user's path.

### Edit mode

```bash
suex -E
```

`suex` allows any privileged user (i.e: members of the *wheel* group) to edit the configuration file safely.
Furthermore, if the configuration file is corrupted, privileged users can still access it and edit it.

The edit option is similar to `visudo`, it creates a copy of the configuration and updates the real configuration only when the copy is valid.

Non-privileged users are not allowed to edit the configuration.

### Verbose mode

```
suex -V
```

`suex` allows to show logging information to privileged users. That information shows which rules are being loaded & how they are processed.  

Non-privileged users are not allowed to turn on verbose mode.

###  Dump mode

```
suex -D
```

`suex` allows the user to dump the permissions it loaded to screen.  
group permissions and command globs are expanded into individual rules as well.

privileged users see the permissions of all users instead of only their own.

## Examples

Ted Unagst's wrote a great blog post called [doas mastery](https://www.tedunangst.com/flak/post/doas-mastery). Because the project has *complete feature parity* with the OpenBSD version, the mentioned post should be a good starting point.

Never the less, there are some powerful enhancments in this release that deserve special attention.

### fine-grained package management

```
deny odedlaz as root cmd /usr/bin/dnf args (autoremove|update|upgrade).+
permit keepenv nopass odedlaz as root cmd /usr/bin/dnf args (autoremove|update|upgrade)$
```

The first rule denies `odedlaz` of running `dnf` as `root` with any arguments that start with `autoremove`, `update` & `upgrade` and have other arguments as well.

The second rule allows `odedlaz` to run `dnf` as `root` only with `autoremove`, `update`, `upgrade` and no other arguments.

These protect `odedlaz` from  from accidentally running `dnf autoremove -y` or `dnf upgrade -y`, even if He's a privileged user (a member of the `wheel` group).

On the other hand, it allows `odedlaz` to run these commands without a password (`nopass`) if they are executed without any trailing arguments.

### rm -rf protection

```
deny odedlaz as root cmd /bin/rm args .*\s+/$
```

The above rule protects `odedlaz` from accidentally running `rm -rf /` and the like.

### one rule, multiple executables

```
permit keepenv nopass odedlaz as root cmd /home/odedlaz/Development/suex/tools/* args .*
```

The above rule allows `odedlaz` to run any executable found at `/home/odedlaz/Development/suex/tools` with any arguments, as `root` without requiring a password.
