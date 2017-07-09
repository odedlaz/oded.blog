---
title: Linux access permissions & ownership
id: 33
updated: '2017-03-26 16:40:48'
permalink: chmod-chown-what-are-they-really
tags:
---

Take a look at the following snippet:


```langauge-bash
$ ls -ld /tmp
drwxrwxrwt. 27 root root 660 Mar 23 09:02 /tmp
```

Some word or something that needs explaining[^1].

[^1]: The explanation.

- [ ] a task list item
- [ ] list syntax required
- [ ] normal **formatting**, @mentions, #1234 refs
- [ ] incomplete
- [x] completed

If you don't know how access permissions work (`rwx`), never heard of sticky bits (`t` or `T`), or don't understand why `root` is written twice, this blog post is for you.
![]
<!-- more -->

Lets take a look at the output of the former, and break it down:
- [x] asas  
- [] asa

| h1    |    h2   |      h3 |
|:------|:-------:|--------:|
| d   | [a][1]  | ![b][2] |
| *foo* | **bar** | ~~baz~~ |


d — a directory

- (dash) — a regular file (rather than directory or link)

l — a symbolic link to another program or file elsewhere on the system</td>
  </tr>
  <tr>
    <td>February</td>
    <td>$80</td>
  </tr>
</table>

The first item, which specifies the file type, will probably be one of the following:

d — a directory

- (dash) — a regular file (rather than directory or link)

l — a symbolic link to another program or file elsewhere on the system

Others are possible, but are beyond the scope of this manual. Refer to the Red Hat Enterprise Linux System Administration Guide for more information.

Beyond the first item, in each of the following three sets, you may see one of the following:

r — file can be read

w — file can be written to

x — file can be executed (if it is a program)

- (dash) — specific permission has not been assigned


First, if you don't undertsnf


r — file can be read

w — file can be written to

x — file can be executed (if it is a program)


If you work with linux and ran `ls`, you probably wondered what all the weird â€œ-rwxr-xr-xâ€ meant.

Well, say hello to permission bits! Go ahead and read [this article](http://www.perlfect.com/articles/chmod.shtml) to understand what they are, and how they work. Once you're done, read [this article](http://www.linuxnix.com/2011/12/chown-command-linuxunix-explained-examples.html)Â to understand how ownership works!