title: Byobu + Vim = <3
tags:
  - byobu
  - ''
  - vim
  - screen
  - tmux
id: 65
updated: '2017-03-07 19:44:45'
permalink: byobu-plus-vim-equals-love
categories:
  - devops
date: 2016-12-20 13:23:00
---
A few days ago [I blogged about my move to vim](/2016/12/12/the-road-to-mastering-vim/). When setting up my `vimrc` I wanted to use [Byobu's](http://byobu.co/) native keybindings with it. 

This post explains what Byobu is, Why use it and how to integrate it with Vim.

<!-- more -->

## What is Byobu?

[Byobu](http://byobu.co) is an enhancement for the [tmux terminal multiplexer](https://tmux.github.io/) that can be used to provide on-screen notification or status, and tabbed multi-window management. It is intended to improve terminal sessions when users connect to remote servers.

<iframe allowfullscreen="" frameborder="0" height="295" src="https://www.youtube.com/embed/NawuGmcvKus?feature=oembed" width="525"></iframe>


## Why not just use tmux?

I just migrated from [Terminator](https://gnometerminator.blogspot.co.il/p/introduction.html) to [tmux](https://tmux.github.io/) and decided that until I wrap my head around vim, I'll postpone learning a new tool, which is where [Byobu](http://byobu.co/) come into play. Byobu's author, Dustin Kirkland, provided [a very detailed answer](http://superuser.com/a/423397) on the subject.


## Integrating Byobu with Vim

Byobu provides comfortable keybindings for split navigation out-of-the-box. You can set up your vim to integrate with Byobu's keybindings easily:

Install [vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator), then edit your `vimrc` and add these lines:

```vim
let g:tmux_navigator_no_mappings = 1
nnoremap   :TmuxNavigateUp
nnoremap   :TmuxNavigateDown
nnoremap   :TmuxNavigateLeft
nnoremap   :TmuxNavigateRight
nnoremap  <c-\> :TmuxNavigatePrevious

nnoremap  :wincmd +
nnoremap  :wincmd -
nnoremap  :wincmd <
nnoremap  :wincmd >
```

Now edit `/usr/share/byobu/keybindings/f-keys.tmux` and comment out:

```
bind-key -n S-Up display-panes \; select-pane -U
bind-key -n S-Down display-panes \; select-pane -D
bind-key -n S-Left display-panes \; select-pane -L
bind-key -n S-Right display-panes \; select-pane -R
```

Then add the following lines:

```
is_vim="ps -o state= -o comm= -t '#{pane_tty}' \
 | grep -iqE '^[^TXZ ]+ +(\\S+\\/)?g?(view|n?vim?x?)(diff)?$'"
bind-key -n S-Up if-shell "$is_vim" "send-keys S-Up" "display-panes; select-pane -U"
bind-key -n S-Down if-shell "$is_vim" "send-keys S-Down" "display-panes; select-pane -D"
bind-key -n S-Left if-shell "$is_vim" "send-keys S-Left" "display-panes; select-pane -L"
bind-key -n S-Right if-shell "$is_vim" "send-keys S-Right" "display-panes; select-pane -R"
bind-key -n C-\ if-shell "$is_vim" "send-keys C-\\" "display-panes; select-pane -l"

bind-key -n C-Up if-shell "$is_vim" "send-keys C-Up"
bind-key -n C-Down if-shell "$is_vim" "send-keys C-Down"
bind-key -n C-Left if-shell "$is_vim" "send-keys C-Left"
bind-key -n C-Right if-shell "$is_vim" "send-keys C-Right"
```
