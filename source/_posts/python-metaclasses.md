title: python metaclasses
id: 16
updated: '2017-03-05 15:42:24'
permalink: python-metaclasses-what-why-when-how
tags:
  - python
categories:
  - programming
date: 2014-07-15 06:19:00
---

Ever heard about python metaclasses?

A metaclass is the class of a class. Like a class defines how an instance of the class behaves, a metaclass defines how a class behaves. A class is an instance of a metaclass.

metaclasses make a lot of magic possible. [This article](http://eli.thegreenplace.net/2011/08/14/python-metaclasses-by-example/) describes:
- What metaclasses are
- Why they exists
- How to use them (with code snippets!)
- Why use them

after reading this you'll be able to understand the magic behind [abstract python classes](https://docs.python.org/2/library/abc.html).

P.S: If you've ever missed interfaces in python, [zope.interfaces](http://wiki.zope.org/zope3/WhatAreInterfaces) uses ABC's achieve that. twisted blog has a post about that - [Why Interfaces Are Great](http://glyph.twistedmatrix.com/2009/02/explaining-why-interfaces-are-great.html)



