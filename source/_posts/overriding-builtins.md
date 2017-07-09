title: overriding builtins
tags:
  - python
id: 49
updated: '2017-02-11 14:33:40'
permalink: overriding-builtins
categories:
  - programming
date: 2015-02-01 10:31:00
---


I fired up python and wrote following code:

```python
sum(range(5))  
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'int' object is not callable
```

why did this happen? Well, I accidentally overwritten the [sum builtin](https://docs.python.org/2/library/functions.html#sum):  

```python 
sum = 0  
```

The fix is quite trivial: reload the builtin :)

```python
from __builtin__ import sum  
```

