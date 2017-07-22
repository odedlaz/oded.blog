title: forgot to sudo? use 'fuck'
tags:
  - linux
  - productivity
id: 50
updated: '2017-06-05 11:10:35'
permalink: fuck-alias
categories:
  - devops
  - ''
  - ''
date: 2015-02-06 10:13:00
---


We all forget to *sudo* when we need to:
![](/images/2017/05/sudo_sandwich.png)

But how many of you have `fuck` at your disposal?

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Favourite thing in my .bashrc remains: <br>alias fuck=&#39;sudo $(history -p \!\!)&#39; <a href="http://t.co/gCRF9RLvHL">pic.twitter.com/gCRF9RLvHL</a></p>&mdash; Liam O (@liamosaur) <a href="https://twitter.com/liamosaur/status/506975850596536320">September 3, 2014</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## How

### bash
```bash 
 alias fuck='sudo $(history -p \!\!)'
```

### zsh  
```bash 
 alias fuck='sudo $(fc -ln -1)'
```

### fish
```bash 
 alias fuck='eval sudo $history[1]'
```

## thefuck

A command line tool that corrects the previous console command, inspired by [@liamosaur](https://twitter.com/liamosaur/)'s tweet. 
It does much more then adding `sudo`, take a look:
![](/images/2017/05/thefuck_example.gif)


Installation is as easy as:
```bash
$ pip install thefuck
```

And like most good things nowadays, it's hosted on GitHub: [nvbn/tehfuck](https://github.com/nvbn/thefuck)
