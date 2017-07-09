title: multiprocessing with python
tags:
  - python
id: 40
updated: '2017-03-05 10:47:25'
permalink: multiprocessing-with-python
categories:
  - programming
date: 2014-07-08 14:56:00
---


if you [read my post](/2014/07/07/python-the-global-interpreter-lock-gil/) about the GIL, you probably understand that multi-threading isn't a good practice in python. multiprocessing is.

why? because every process has a different interpreter and thus a different GIL! here's a few good articles that will get you going:

* [python's multiprocessing page](https://docs.python.org/2/library/multiprocessing.html)
* [Multiprocessing with Python
](http://www.ibm.com/developerworks/aix/library/au-multiprocessing/) by Noah Gift
*  PyMOTW multiprocessing series: [part one](http://broadcast.oreilly.com/2009/04/pymotw-multiprocessing-part-1.html),  [part two](http://broadcast.oreilly.com/2009/04/pymotw-multiprocessing-part-2.html)

have fun!


