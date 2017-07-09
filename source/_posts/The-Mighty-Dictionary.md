title: The Mighty Dictionary
tags:
  - python
  - data-structures
id: 123
updated: '2017-05-31 15:25:51'
permalink: the-mighty-dictionary
categories:
  - programming
date: 2017-05-30 15:29:00
---

One of pythons strongest built-in data type is the [dictionary](https://docs.python.org/3/library/stdtypes.html#dict). You can find it everywhere - from a simple key-value store, to a piece of a complex data structure, and all the way down to one of the basic building block of python's attribute access mechanism.

It's probably one of the most important data structures in python, and as such, one needs to understand it.

![](/images/2017/05/hashtable.jpg)

## The Mighty Dictionary

How do dictionaries work? What do they do better than other container types, and where, on the other hand, are their weaknesses?

This talk, given at [PyCon 2010](http://pyvideo.org/events/pycon-us-2010.html),  aims to train the Python developer's mind to picture what the dictionary is doing in just enough detail to make good decisions -
- As data sets get larger
- About when to use dictionaries
- When other data structures might be more appropriate


<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/C4Kc8xzcA68" frameborder="0" allowfullscreen></iframe>


## The Dictionary Even Mightier

A follow up to "The Mighty Dictionary” talk from [PyCon 2010](http://pyvideo.org/events/pycon-us-2010.html). Since that talk was given, the dictionary has evolved dramatically.

This talk, given at [PyCon 2017](https://speakerdeck.com/pycon2017), aims to teach about all of the the improvements, up to and including the re-architecture that has landed with Python 3.6 -
- Iterable views: the dictionary’s dedicated comprehension syntax
- Random key ordering: the special key-sharing dictionary designed to underlie object collections, 
- The new [“compact dictionary”](https://docs.python.org/3/whatsnew/3.6.html#new-dict-implementation) that cuts dictionary storage substantially — and carries a fascinating side-effect - ordered insertions.

Each new feature that the talk discusses is motivated by considering the trade-offs inherent in hash table data structure design, and followed up with hints about how one can use the dictionary even more effectively in his own code.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/66P5FMkWoVU" frameborder="0" allowfullscreen></iframe>

## Modern Python Dictionaries

Python's dictionaries are stunningly good. Over the years, many great ideas have combined together to produce the modern implementation in Python 3.6.

This fun talk, given at [PyCon 2017](https://speakerdeck.com/pycon2017), uses pictures and little bits of pure python code to explain all of the key ideas and how they evolved over time.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/npw4s1QTmPg" frameborder="0" allowfullscreen></iframe>

## Good Reads

[Python Attributes and Methods](http://www.cafepy.com/article/python_attributes_and_methods/) is the second part of a series that explains about python's type system (the first is [Python Types and Objects](http://www.cafepy.com/article/python_types_and_objects/)). It covers the mechanics of attribute access for new-style Python objects:

* How functions turn into methods
* How descriptors & properties work
* Class method resolution order

I also recommend reading:

* [The Performance Impact of Using dict() Instead of {} in CPython 2.7](https://doughellmann.com/blog/2012/11/12/the-performance-impact-of-using-dict-instead-of-in-cpython-2-7-2/)
* [Generating 64 bit hash collisions to DOS Python](https://medium.com/@robertgrosse/generating-64-bit-hash-collisions-to-dos-python-5b21404a5306)
* [What happens when you mess with hashing in python](http://www.asmeurer.com/blog/posts/what-happens-when-you-mess-with-hashing-in-python/)
* [Efficiently Implementing Python Objects With Maps](https://morepypy.blogspot.co.il/2010/11/efficiently-implementing-python-objects.html) - PyPy
* [Faster, more memory efficient and more ordered dictionaries on PyPy](https://morepypy.blogspot.co.il/2015/01/faster-more-memory-efficient-and-more.html) - PyPy
* [Saving 9 GB of RAM with Python’s \__slots__](http://tech.oyster.com/save-ram-with-python-slots/)
* [Exposing Python 3.6's Private Dict Version](https://jakevdp.github.io/blog/2017/05/26/exposing-private-dict-version/)