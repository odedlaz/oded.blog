title: safe method invocation
tags:
  - python
  - idiom
  - ''
id: 51
updated: '2017-03-07 20:20:27'
permalink: safe-method-invocation
categories:
  - programming
date: 2015-02-18 13:00:00
---


The standard json library provides doesn't have a *check json is valid* function. [I've done a bit of researching ](http://stackoverflow.com/questions/5508509/how-do-i-check-if-a-string-is-valid-json-in-python) and it turns out the best approach to check if a json text is to try-except with [json.loads](https://docs.python.org/2/library/json.html#json.loads).

I came up with a generic solution to this problem which I think you'll like.

<!-- more -->

lets start from the beginning - probably most of us will write something like that:

```python
def is_valid_json(text):  
   try:  
      json.loads(text)  
      return True  
   except:  
      return False  
```

that's fine, but it's not to efficient. take a look at the following snippet:

```python 
text = "{'foo':'bar'}"  
if is_valid_json(text):  
   item = json.loads(text)  
```

that's a bit ugly, right? we're forced to load the text twice. a better solution might be:

```python  
def safe_loads(text):  
   try:  
      return json.loads(text)  
   except:  
      return None

text = "{'foo':'bar'}"  
item = safe_loads(text)  
   if item:  
      # do something  
```

that's great, but not generic at all. it only works for loading json text!:

```python 
class SafeInvocator(object):  
   def __init__(self, module):  
     self._module = module

   def _safe(self, func):  
      def inner(*args, **kwargs):  
         try:  
            return func(*args, **kwargs)  
         except:  
            return None
      return inner

   def __getattr__(self, item):  
      obj = getattr(self._module, item)  
      return self._safe(obj) if hasattr(obj, '__call__') else obj  
```

the usage is pretty simple -> if you want to safely invoke a method from the json module, all you need to do is:

```python 
safe_json = SafeInvocator(json)  

text = "{'foo':'bar'}"  
item = safe_json.loads(text)  
if item:  
   # do something  
```