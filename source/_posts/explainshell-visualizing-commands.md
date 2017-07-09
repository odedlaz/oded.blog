title: explainshell - visualizing commands
tags:
  - linux
  - productivity
id: 78
updated: '2017-03-13 22:16:18'
permalink: explainshell
categories:
  - devops
  - ''
date: 2014-08-24 12:53:00
---

I find myself, every now and then, staring at a really long command, trying to figure it out. Here's a good example:

```bash
ssh user@remote "tar czpf - /path/on/remote" | tar xzpf - -C /path/on/local
```

If you get the gist, but don't remember all the knobs by heart, don't worry. none of us do. that's what man pages are for!
![](https://imgs.xkcd.com/comics/tar.png)



*explainshell* greatly simplifies things - It give you an easy, readable, visual representation of the command (click to open):

[![](/images/2017/03/explainshell.png)](http://explainshell.com/explain?cmd=ssh+user%40remote+%22tar+czpf+-+%2Fpath%2Fon%2Fremote%22+%7C+tar+xzpf+-+-C+%2Fpath%2Fon%2Flocal)

*explainshell* currently contains 29761 parsed manpages from sections 1 and 8 found in Ubuntu's manpage repository. According to its author, [Idan Kamara](https://github.com/idank),  A lot of heuristics were used to extract the arguments of each program, and there are errors here and there, especially in manpages that have a non-standard layout.

The project is [available on GitHub](https://github.com/idank/explainshell) and licensed under [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/).
