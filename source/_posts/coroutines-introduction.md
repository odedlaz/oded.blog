title: 'coroutines: introduction'
tags:
  - python
  - concurrency
  - ''
id: 103
updated: '2017-07-05 19:47:09'
permalink: python-coroutines-introduction
categories:
  - programming
date: 2017-04-11 08:05:00
---
This post is the first of a series that will discuss coroutines in python, and how to leverage them to solve data crunching problems elegantly. Later in the series, We'll discuss native asynchronous programming introduced in [PEP 492 (Coroutines with async and await syntax)](https://www.python.org/dev/peps/pep-0492/).

The first post will introduce *coroutines*, and explain a bit about how they work and how to use them.

<!-- more -->

**!** <u>Disclaimer</u>: The first few chapters are dedicated to python 2, and are heavily influenced by [David Beazley](http://www.dabeaz.com/about.html)'s talk - [A Curious Course on Coroutines and Concurrency](http://www.dabeaz.com/coroutines/).

### Prerequisites

1. You're using python 2.7.x
2. You're familiar with generators. otherwise, read either:
  - ['yield' and Generators Explained](https://jeffknupp.com/blog/2013/04/07/improve-your-python-yield-and-generators-explained/) by [Jeff Knupp](https://jeffknupp.com).
  - [Generator Tricks for Systems Programmers](http://www.dabeaz.com/generators/index.html) by [David Beazley](http://www.dabeaz.com/about.html).

### Introduction

In Python 2.5, generators [picked up some new features](https://docs.python.org/2/whatsnew/2.5.html) to allow "coroutines" ([PEP-342](https://www.python.org/dev/peps/pep-0342)). Most notably: new `send()`, `close()` & `throw()` methods, that allowed functions to consume values sent *into* it.

As David mentioned, If Python books are any guide, this is the most poorly documented, obscure, and apparently useless feature of Python.

The following example shows a naive usage of a coroutine:

```python
from re import compile

def filter(pattern):
   expression = compile(pattern) # this is called once
   while True:
      # this is called on every .send() call
      text = (yield)
      if expression.match(text):
         print(text)

co = filter("^hello")
co.next() # bootstrapping the coroutine

co.send("hello")
co.send("world")
```

#### KISS

Although, syntactically, generators and coroutines are similar, they are fundamentally different. You can mix and match both concepts - i.e: cause a function to generate and consume values.

The following example illustrates a *"generator"* that produces **and** receives values:

```python
def countdown(n):
    print ("Counting down from: {}".format(n))
    while n >= 0:
        newvalue = yield n
        n = n - 1 if newvalue is None else newvalue

c = countdown(5)
for n in c:
    if n == 3:
        c.send(n - 1)
    print(n)
```

Although it works, its hard to follow and flaky:

```python
Counting down from: 5
5
4
3
1
0
```

Try to avoid mixing both concepts. remember:
- Generators produce
- Coroutines consume & are not related to iteration.

### Bootstrapping a coroutine

All coroutines need to get "bootstrapped" by first calling `.send(None)` or `.next()`. These calls advance the function execution to the location of the first yield expression.

Remembering to bootstrap the coroutine is easy to forget. This is easily solved by wrapping coroutines with a decorator:

```python
from functools import wraps

def coroutine(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        cr = f(*args, **kwargs)
        cr.send(None)
        return cr
    return wrapper
```

Now, our example will be simpler:
```python
@coroutine
def filter(pattern):
   ...

co = filter("^hello")
co.send("hello")
co.send("world")
```

### Closing  a coroutine

A coroutine might run indefinitely. Use `.close()` to shut it down. otherwise, the garbage collector will do it for you.

```python
co = filter("^hello")
co.send("hello")
co.send("world")
co.close()
```

As opposed to regular functions, when a coroutine is closed, a `GeneratorExit` exception is thrown, and every subsequent `.send()` or `.next()` call raises a `StopIteration` exception.

```python
@coroutine
def printer():
   try:
      while True:
         print((yield))
   except GeneratorExit:
      # close() was called!
      pass
```
A few things to note:
- [GeneratorExit](https://docs.python.org/2/library/exceptions.html#exceptions.GeneratorExit) inherits directly from [BaseException](https://docs.python.org/2/library/exceptions.html#exceptions.BaseException) since it's technically not an error. 
-  [GeneratorExit](https://docs.python.org/2/library/exceptions.html#exceptions.GeneratorExit) is raised when `close()` is called, and is ignored by default.
- [StopIteration](https://docs.python.org/2/library/exceptions.html#exceptions.StopIteration) is derived from [Exception](https://docs.python.org/2/library/exceptions.html#exceptions.Exception) rather than [StandardError](https://docs.python.org/2/library/exceptions.html#exceptions.StandardError), since this is not considered an error in its normal application.


### Error handling

Errors are supported in coroutines, and behave like you expect:
```python
@coroutine
def filter(pattern):
   expression = compile(pattern)
   while True:
      text = (yield)
      if text == "raise":
         raise ValueError("raise was sent")

      if expression.match(text):
         print(text)

co = filter("^hello")
co.send("hello")
co.send("raise")
```

You can also cause a coroutine to raise an exception:

```python
@coroutine
def filter(pattern):
   ...

co = filter("^hello")
# throw(type, value=None, traceback=None)
co.throw(Exception, "something bad happened")
```
`throw()` is used to raise an exception inside the generator; the exception is raised by the yield expression where the generator’s execution is paused. 


### A bit of bytecode

```python
# a generator
def a_generator(n):
    yield n

# a coroutine
def a_coroutine():
    yield

# a coroutine & generator
def a_mix():
    yield (yield)
```

Let's look at the byte code:

```python
>>> from dis import dis
>>> a_generator(0)
>>> <generator object a_generator at ...>
>>> dis(a_generator)
  3           0 LOAD_FAST                0 (n)
              3 YIELD_VALUE
              4 POP_TOP
              5 LOAD_CONST               0 (None)
              8 RETURN_VALUE
>>> a_coroutine()
>>> <generator object a_generator at ...>
>>> dis(a_coroutine)
  6           0 LOAD_CONST               0 (None)
              3 YIELD_VALUE
              4 POP_TOP
              5 LOAD_CONST               0 (None)
              8 RETURN_VALUE
>>> a_mix()
>>> <generator object a_mix at ...>
>>> dis(a_mix)
  9           0 LOAD_CONST               0 (None)
              3 YIELD_VALUE
              4 YIELD_VALUE
              5 POP_TOP
              6 LOAD_CONST               0 (None)
              9 RETURN_VALUE
```

You've probably noticed that the `YIELD_VALUE` opcode is used for both consuming and producing data. Although generators and coroutines are different, they share a lot of code behind the scenes.

That's the reason why the `a_mix` coroutine has two `YIELD_VALUE` opcodes, rather then one for consuming, and one for producing.

In other words, the distinction between generators and coroutines is mostly conceptual.

### What's next?

Go ahead and read the next part of the series, [coroutines: pipelines & data flow](/2017/04/11/python-coroutines-pipelines-and-data-flow/).