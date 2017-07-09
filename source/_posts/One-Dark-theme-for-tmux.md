title: One Dark theme for tmux
tags:
  - linux
  - tmux
  - project
id: 74
updated: '2017-03-07 19:26:25'
permalink: one-dark-tmux-theme
categories:
  - devops
  - ''
date: 2017-01-25 15:04:00
---
I've created a dark [tmux](http://tmux.github.io) color scheme for terminals that support [True Color](https://en.wikipedia.org/wiki/Color_depth#True_color_.2824-bit.29), based on [onedark.vim](https://github.com/joshdick/onedark.vim).

One Dark is an extremely popular theme for the [Atom text editor](https://atom.io/).

### Why?

I wanted both vim and tmux to share the same color scheme.  
 I tried [tmuxline.vim](https://github.com/edkolev/tmuxline.vim) but it didn't render the colors correctly.  
 Furthermore, with `tmuxline.vim`, you can't control the widgets on right status bar, which is a key feature IMO.

### How?

Installation is extremely easy, and you can customize the widgets on the right status bar by setting the `@onedark-widgets` tmux variable.

Interested? head over to [tmux-onedark-theme](https://github.com/odedlaz/tmux-onedark-theme) and follow the instructions.

![preview-terminal](/images/2017/01/preview-terminal.png)
