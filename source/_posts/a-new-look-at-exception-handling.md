title: a new look at exception handling
tags:
  - python
id: 13
updated: '2017-03-05 14:43:43'
permalink: a-new-look-at-exception-handling
categories:
  - programming
date: 2014-07-14 13:40:00
---
I was taught that good exception handing means:

- Don't catch all exceptions -> only catch exceptions you know how to handle
- If your application needs to raise an exception, create a unique exception and raise it.
- Never silently ignore exceptions (it's even part of the[ zen of python](http://legacy.python.org/dev/peps/pep-0020/))

I strongly believe in these rules. they, in my opinion, make your code more readable, testable and easier to debug. Anyway, I just read a [nice article](http://northconcepts.com/blog/2013/01/18/6-tips-to-improve-your-exception-handling/) with nice tips about exception handling.

By the way, I also add the locals ([it's really easy in python](https://docs.python.org/2/library/functions.html#locals)) of the exception I just raised. It helped a few times!