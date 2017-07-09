title: tiny os.getenv idiom
tags:
  - python
  - idiom
id: 71
updated: '2017-03-07 19:29:57'
permalink: getenv-idiom
categories:
  - programming
date: 2017-01-15 20:41:00
---
Many times I add the possibility to control constant values via environment variables, and add a default value when no such variable is set. for instance:

```python  
import os  
A_CONSTANT_NUMBER = int(os.getenv(CONSTANT_NUMBER, 10))  
```

I find myself writing this code again and again. IMO, a more idiomic solution would be:

```python
import os

def getenv(varname, default=None, typecast_fn=None):
    """
    Return the value of the environment variable varname if it exists, or default if it doesn't.
    default defaults to None.
    
    :typecast_fn: a function that performs the typecast. if not supplied, defaults to type(value)
    """
    
    if not typecast_fn:
        typecast_fn = type(default) if default else lambda x: x
        
    assert callable(typecast_fn), "typecast_fn is not callable!"
    
    value = os.getenv(varname)
    
    return typecast_fn(value) if value else default
```

Now, you can write the following:

```python
A_NUMBER = getenv(A_NUMBER)  
```

the above code will behave just like os.getenv.

```python  
A_NUMBER = getenv(A_NUMBER, typecast_fn=int)  
```

Now the code will lookup the environment variable `A_NUMBER` . if successful, will cast it to int and return it. otherwise, will return None (just like [os.getenv](https://docs.python.org/2/library/os.html#os.getenv)):
```python  
A_NUMBER = getenv(A_NUMBER, 10)  
```

the above code will lookup the environment variable `A_NUMBER`.  
if successful, will cast it to int and return it. otherwise, will return the default.