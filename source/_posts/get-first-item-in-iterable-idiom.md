title: get first item in iterable
tags:
  - python
  - idiom
id: 48
updated: '2017-03-07 20:19:00'
permalink: get-first-item-in-iterable-idiom
categories:
  - programming
date: 2015-01-08 10:39:00
---


Honestly, this is definitely not the best idiom around, but I still find it useful.
 
If you ever find yourself writing the following code:

```python  
candidate = [x for x in iterable if "text" in x]  
if len(candidate) == 1:  
   text = candidate[0]  
```

you can use the following method to make the code a bit cleaner:

```python  
def get_first(iterable, predicate=None, default=None):  
   if not iterable:
      return default
  
   for item in iterable:  
      if not predicate:
         return item  
      if predicate(item):  
         return item  
      return default

text = get_first(iterable, lambda x: "text" in x)  
```


