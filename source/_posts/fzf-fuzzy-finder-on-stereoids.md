title: fzf - fuzzy finder on stereoids
tags:
  - linux
  - productivity
id: 96
updated: 2017-03-28 08:24:30
permalink: fzf-fuzzy-finder-on-stereoids
categories:
  - devops
  - ''
date: 2017-03-26 13:45:00
---

Every once in a while I find a new tool that boosts my productivity so much, that I don't understand how I managed to work without it up to this point.

Today I want to introduce you to a general-purpose command-line fuzzy finder, called [fzf](https://github.com/junegunn/fzf) -

- No dependencies.
- Blazingly fast.
- Works out of the box, but also extremely configurable.
- Flexible layout [using tmux panes](https://github.com/junegunn/fzf/blob/master/README.md#fzf-tmux-script).
- Batteries included:
    - [vim & neovim plugin](https://github.com/junegunn/fzf.vim) - I see it as [ctrlp.vim](https://github.com/kien/ctrlp.vim) on steroids.
    - Key bindings (bash, zsh & fish)
       - **CTRL-T** paste the selected files and directories onto the command line.
       - **CTRL-R** paste the selected command from history onto the command line.
       - **ALT-C** cd into the selected directory.
    - Fuzzy auto-completion for bash, zsh & [fish](https://github.com/fisherman/fzf).

But hey, why listen to me when you can just see it in action?
![](https://raw.github.com/junegunn/i/master/fzf.gif)
