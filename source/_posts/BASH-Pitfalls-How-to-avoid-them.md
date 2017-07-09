title: BASH Pitfalls & How to avoid them
tags:
  - productivity
  - bash
  - linux
id: 101
updated: '2017-05-10 20:25:35'
permalink: bash-pitfalls-how-to-avoid-them
categories:
  - devops
  - ''
date: 2017-04-01 18:23:00
---

**Disclaimer**: I'm using [fish shell](https://fishshell.com/) on my laptop. It solves everything that's wrong with Bash, and is much more fun.

A few days ago I posted [Test your terminal skills #1](/2017/03/29/test-terminal-skills-1/) to [reddit](https://www.reddit.com/r/bash/comments/62espj/test_your_terminal_skills_1/). A few folks opened my eyes regarding the quality of my solutions, and directed me to two great resources.

### Bash Pitfalls

[Greg's Bash Guide](http://mywiki.wooledge.org/BashGuide) - A guide tht aims to aid people interested in learning to work with BASH. It aspires to teach good practice techniques for using BASH, and writing simple scripts.

Also, There's a whole section for [Bash Pitfalls](http://mywiki.wooledge.org/BashPitfalls), which is worth a read.

### "Strict Mode"


Your bash scripts will be more robust, reliable and maintainable if you start them like this:

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
```

Why? Read Aaron Maxwell's excellent blog post: [Use the Unofficial Bash Strict Mode](http://redsymbol.net/articles/unofficial-bash-strict-mode/).

### ShellCheck

[ShellCheck](https://github.com/koalaman/shellcheck) finds bugs in your bash shell scripts.
![](https://raw.githubusercontent.com/koalaman/shellcheck/master/doc/terminal.png)


You can grab it from [here](https://github.com/koalaman/shellcheck), or just paste your script to its [website](https://www.shellcheck.net).
It integrates well with [syntastic](https://github.com/vim-syntastic/syntastic) & [neomake](https://github.com/neomake/neomake), which makes it extremely powerful.
![](https://raw.githubusercontent.com/koalaman/shellcheck/master/doc/vim-syntastic.png)

If you know of any other resources for common pitfalls, please comment below!
