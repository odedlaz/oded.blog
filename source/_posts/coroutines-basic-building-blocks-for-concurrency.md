title: 'coroutines: basic building blocks for concurrency'
tags:
  - python
  - concurrency
id: 106
updated: '2017-07-07 16:22:14'
permalink: python-coroutines-basic-building-blocks-for-concurrency
categories:
  - programming
date: 2017-07-05 11:27:00
---
This part of the series explains the basic building block that allow writing concurrent programs in python.

Later in the series I'll show how to use different async paradigms using the new async syntax that was (finally) introduced in Python 3.5.

## Prerequisites

1. You're using python 3.6.x
2. You're familiar with coroutines. otherwise, read - [coroutines: Introduction](/2017/04/11/python-coroutines-introduction/).
  * You might also want to read the previous blog post: [coroutines: Pipelines & Data flow](/2017/04/11/python-coroutines-pipelines-and-data-flow/)

<!-- more -->
## A bit of history

* **2002** Generators were introduced in [PEP 255](https://www.python.org/dev/peps/pep-0255/) and [added to Python 2.2](https://docs.python.org/2/whatsnew/2.2.html#pep-255-simple-generators). They were optional until finally being part of the language a year later, in [Python 2.3](https://docs.python.org/2/whatsnew/2.3.html#pep-255-simple-generators).

* **2005** Generator Expressions (comprehensions) were introduced in [PEP289](https://www.python.org/dev/peps/pep-0289/) and [added to Python 2.4](https://docs.python.org/2/whatsnew/2.4.html#pep-289-generator-expressions).

* **2006** *coroutines* (the ability to send values *into* a generator) were introduced in [PEP342](https://www.python.org/dev/peps/pep-0342) and [added to Python 2.5](https://docs.python.org/2/whatsnew/2.5.html#pep-342-new-generator-features).
* **2012** `yield from` was introduced in [PEP 380](https://docs.python.org/3/whatsnew/3.3.html#pep-380) and [added to Python 3.3](https://docs.python.org/3/whatsnew/3.3.html#pep-380-syntax-for-delegating-to-a-subgenerator).

* **2014** A new framework for asynchronous I/O called "[asyncio](https://docs.python.org/3/library/asyncio.html#module-asyncio)" was described in [PEP 3156](https://www.python.org/dev/peps/pep-3156/) and [added in Python 3.4](https://docs.python.org/3/whatsnew/3.4.html#asyncio).

* **2015** New `async` & `await` keywords came into existence in [PEP 492](https://www.python.org/dev/peps/pep-0492/) which introduced *real* coroutines and made async programming a breeze. [Those were added to Python 3.5](https://docs.python.org/3/whatsnew/3.5.html#pep-492-coroutines-with-async-and-await-syntax).

* **2016** [PEP 492](https://www.python.org/dev/peps/pep-0492) & [PEP 530](https://www.python.org/dev/peps/pep-0530/) added [async generators](https://docs.python.org/3/whatsnew/3.6.html#whatsnew36-pep525), [async comprehensions](https://docs.python.org/3/whatsnew/3.6.html#pep-530-asynchronous-comprehensions) to [Python 3.6](https://docs.python.org/3/whatsnew/3.6.html).

## How does `async` & `await` work?

I'm not a fan of duplicate work, and a colleague of mine told me that [Brett Cannon](https://twitter.com/brettsky), a Python core developer, already wrote a great post on the subject - [How the heck does async/await work in Python 3.5?](https://snarky.ca/how-the-heck-does-async-await-work-in-python-3-5/)

**I HIGHLY RECOMMEND READING ALL OF IT**. It's beautifully written and explains all the new things that were added to the language in the past few years.


## What’s New In Python 3.6

Python 3.6 is considered by many the first release that makes sense to move over from Python 2.x.

There (no very long) list of features that were added in Python 3.6 can be found [here](https://docs.python.org/3/whatsnew/3.6.html).

You can also watch Brett's talk on the subject:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/hk85RUtQsBI?rel=0" frameborder="0" allowfullscreen></iframe>

Anyhow, the following are the new features related to async. 

### PEP 525: Asynchronous Generators

[PEP 492](https://www.python.org/dev/peps/pep-0492) introduced support for native coroutines and `async` / `await` syntax to Python 3.5. A notable limitation of the Python 3.5 implementation is that it was not possible to use `await` and `yield` in the same function body. In Python 3.6 this restriction has been lifted, making it possible to define asynchronous generators:

```python
async def ticker(delay, to):
    """Yield numbers from 0 to *to* every *delay* seconds."""
    for i in range(to):
        yield i
        await asyncio.sleep(delay)
```

The new syntax allows for faster and more concise code.


### PEP 530: Asynchronous Comprehensions
[PEP 530](https://www.python.org/dev/peps/pep-0530/) adds support for using `async for` in list, set, dict comprehensions and generator expressions:

```python
result = [i async for i in aiter() if i % 2]
```

Additionally, `await` expressions are supported in all kinds of comprehensions:

```python
result = [await fun() for fun in funcs if await condition()]
```

## The death of Twisted and such

There are a bunch of async frameworks in the wild, the most noticeable being [Twisted](https://twistedmatrix.com/) and [Tornado](http://www.tornadoweb.org/). All of them use Python's awesome generators & coroutines that were introduced into the language more than 15 years ago! 

I'm not a fan of both. I've worked with Twisted a lot at my last work place. We wrote our generic crawler using [Scrapy](https://scrapy.org/), which is based on Twisted.

These frameworks work great. until something breaks that is. Then you get the worst errors imaginable, and debugging them is a nightmare. 

I was ecstatic when python introduced `asyncio`, then `async` & `await`. Many in the developer community, including myself, believed that was the end for Twisted, but we were wrong - [The report of Twisted’s death was (and still is) an exaggeration](https://glyph.twistedmatrix.com/2014/05/the-report-of-our-death.html).
