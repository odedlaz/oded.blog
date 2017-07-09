title: Hettinger's iterator-with-sentinel
tags:
  - python
  - idiom
id: 47
updated: '2017-03-07 20:18:12'
permalink: hettingers-iterator-with-sentinel-idiom
categories:
  - programming
date: 2015-01-06 08:34:00
---


I just came across a beautiful technique to transform a function call to an iterator - [Hettinger's iterator-with-sentinel idiom](http://stackoverflow.com/a/25611913).

most developers will probably write the following lines of code (including myself):

```python
with open("file.data") as f:  
   while True:  
      char = f.read(1)  
      if not char:  
         break  
      else:  
         # ...  
```

A different, more elegant approach which uses Hettinger's iterator-with-sentinel idiom:

```python
from functools import partial

with open("file.data") as f:  
for char in iter(partial(f.read, 1), ""):  
   # ...  
```

- The [with-statement](http://preshing.com/20110920/the-python-with-statement-by-example/) opens the file and unconditionally closes it when you're finished.
- The usual way to [read one character](https://docs.python.org/2.7/library/stdtypes.html#file.read) is f.read(1).
- The [partial](https://docs.python.org/2.7/library/functools.html#functools.partial) creates a function of zero arguments by always calling f.read with an argument of 1.
- The two argument form of [iter()](https://docs.python.org/2.7/library/functions.html#iter) creates an iterator that loops until you see the empty-string end-of-file marker

checkout [this answer on stackoverflow](http://stackoverflow.com/a/26564798) that uses this idiom to decompress a gzip stream.


