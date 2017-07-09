title: exclude grep on ps a | grep
tags:
  - linux
id: 54
updated: '2017-03-07 20:10:02'
permalink: exclude-grep-on-ps-a-grep
categories:
  - devops
date: 2016-11-01 22:41:00
---


Have you ever tried to grep for a process, and saw grep show up too? annoying, right?

```bash 
$ ps aux | grep "python"  
8714 pts/2 S+ 0:00 python  
8716 pts/1 S+ 0:00 grep -color python  
```

Well, turns out [Wayne Werner](https://unix.stackexchange.com/users/5788/wayne-werner) [found a cool solution](https://www.ibm.com/developerworks/library/l-keyc3/#code10)!

```bash  
$ ps aux | grep "[p]ython"  
8714 pts/2 S+ 0:00 python  
```

How does it work? By putting the brackets around the letter and quotes around the string, you search for a regex which says - *"Find the character 'p' followed by 'ython'"*

But since you put the brackets in the pattern `p` is now followed by `]`, **grep** won't show up in the results list. Why? because its text is *"grep -color [p]ython"* **and not** *"grep -color python".*


