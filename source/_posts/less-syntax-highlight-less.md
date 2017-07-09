title: less + syntax highlight > less
id: 66
updated: '2017-03-07 19:37:38'
permalink: less-and-syntax-highlighting-it
tags:
  - linux
  - productivity
categories:
  - devops
  - ''
date: 2016-12-23 01:10:00
---


less is a terminal pager program on Unix, Windows, and Unix-like systems used to view (but not change) the contents of a text file one screen at a time.

To add syntax highlighting to less on linux, first install [source-highlight](https://www.gnu.org/software/src-highlite/), then copy the following snippet to your `~/.(bash|zsh|fish|etc)rc` file:

```bash
# The following adds syntax highlighting to various programming languages
# Credit goes to Ter Smitten: https://goo.gl/64YU4u
export LESSOPEN="| /usr/share/source-highlight/src-hilite-lesspipe.sh %s"
export LESS=' -R '

# The following adds syntax highlighting to man pages
# Credit goes to Todd Weed: https://goo.gl/ZSbwZI
export LESS_TERMCAP_mb=$'\e[01;31m'       # begin blinking
export LESS_TERMCAP_md=$'\e[01;38;5;74m'  # begin bold
export LESS_TERMCAP_me=$'\e[0m'           # end mode
export LESS_TERMCAP_se=$'\e[0m'           # end standout-mode
export LESS_TERMCAP_so=$'\E[37;44m'       # begin standout-mode - info box
export LESS_TERMCAP_ue=$'\e[0m'           # end underline
export LESS_TERMCAP_us=$'\e[04;38;5;146m' # begin underline
```

If you're interested in reading about the differences between [more](https://en.wikipedia.org/wiki/More_(command)), [less](https://en.wikipedia.org/wiki/Less_(Unix)) and [most](https://en.wikipedia.org/wiki/Most_(Unix)), read [Evan Teitelman](https://unix.stackexchange.com/users/26112/evan-teitelman)'s answer on [StackExchange](http://unix.stackexchange.com/a/81131).

After reading more about less, I feel I'm just scratching the surface.
I love it that each day I learn how much I don't know!
