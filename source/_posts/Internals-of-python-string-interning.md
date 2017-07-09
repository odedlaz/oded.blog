title: Internals of python string interning
id: 12
updated: '2017-03-05 10:51:33'
permalink: internals-of-python-string-interning
tags:
  - python
categories:
  - programming
date: 2014-07-14 10:45:00
---


[String interning](https://en.wikipedia.org/wiki/String_interning) is an implementation of the [Flyweight design pattern](https://en.wikipedia.org/wiki/Flyweight_pattern):
```
In computer programming, flyweight is a software design pattern. A flyweight is an object that minimizes memory usage by sharing as much data as possible with other similar objects; it is a way to use objects in large numbers when a simple repeated representation would use an unacceptable amount of memory. Often some parts of the object state can be shared, and it is common practice to hold them in external data structures and pass them to the flyweight objects temporarily when they are used.
```

Almost every language has an implementation of string interning and python is no exception.

I just read a [The internals of Python string interning](http://guilload.com/python-string-interning/) and found it very interesting!