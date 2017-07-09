title: python & the global interpreter lock
id: 20
updated: '2017-03-05 10:44:15'
permalink: python-the-global-interpreter-lock-gil
tags:
  - python
categories:
  - programming
date: 2014-07-07 08:30:00
---


I'm an internals guy. I read [CLR via C#](https://www.goodreads.com/book/show/7121415-clr-via-c) to understand the inner workings of C# (and I highly recommend it!)

After learning python's syntax, I started digging into the fun stuff.
I just found out the python has a global interpreter lock (GIL) that basically makes python a single threaded language (not really).

In upcoming posts I'll share links that explain how to bypass/handle this limitation (hint: [multiprocessing](https://docs.python.org/2/library/multiprocessing.html)). But for now, take a look at these articles:

* [Python's Hardest Problem](http://www.jeffknupp.com/blog/2012/03/31/pythons-hardest-problem/)
* [Python's Hardest Problem, Revisited](http://www.jeffknupp.com/blog/2013/06/30/pythons-hardest-problem-revisited/)
* [Exciting Progress Made on Python's Hardest Problem](http://www.jeffknupp.com/blog/2014/07/07/exciting-progress-made-on-pythons-hardest-problem/)


