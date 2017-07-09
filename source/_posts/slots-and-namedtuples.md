title: __slots__ and namedtuples
tags:
  - python
id: 59
updated: '2017-03-28 08:41:12'
permalink: __slots__-and-namedtuples
categories:
  - programming
date: 2016-11-30 23:36:00
---


Lets talk about object "optimizations":  [__slots__](https://docs.python.org/2/reference/datamodel.html#slots) and [namedtuples](https://docs.python.org/2/library/collections.html#collections.namedtuple).


## **__slots__**

[__slots__](https://docs.python.org/2/reference/datamodel.html#slots) have two important effects:

- performance: A class that utilizes slots gains ~30% faster attribute access. [Guido wrote about](https://python-history.blogspot.co.il/2010/06/inside-story-on-new-style-classes.html) that a few years ago.
- Memory Consumption: A class that utilizes slots doesn't have an underlying dict or weakref. The "problem" with dicts is that when initialized,they get a default size, which can be bigger than the amount of attributes you have. If the number of attributes is bigger than the initial dict size, the dict grows 2x, which is a huge waste of memory.

If your app performance or memory consumption is important, consider adding **slots**.  Do make sure you benchmark your code before making such a change!

> By default, instances of both old and new-style classes have a dictionary for attribute storage. This wastes space for objects having very few instance variables. The space consumption can become acute when creating large numbers of instances. 
>
 The default can be overridden by defining **slots** in a new-style class definition. The **slots** declaration takes a sequence of instance variables and reserves just enough space in each instance to hold a value for each variable. Space is saved because **dict** is not created for each instance.


## namedtuples

[namedtuples](https://docs.python.org/2/library/collections.html#collections.namedtuple), like the name suggests - is a tuple that has a type and named attributes. tuples memory fingerprint is small and attribute access is fast. The beauty with namedtuples is that they unpack like regular tuples, but also have named attributes.

The only "downside" is that they are immutable (like regular tuples), which might pose a problem. A possible solution is to create a class with slots, or use [recordclass](http://intellimath.bitbucket.org/blog/posts/what_is_recordclass.html) which is a mutable namedtuples implementation.

> **namedtuple** Returns a new tuple subclass named typename. The new subclass is used to create tuple-like objects that have fields accessible by attribute lookup as well as being indexable and iterable. Instances of the subclass also have a helpful docstring (with typename and field_names) and a helpful **repr**() method which lists the tuple contents in a name=value format.

