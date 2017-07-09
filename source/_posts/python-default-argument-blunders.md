title: 'python: default argument blunders'
tags:
  - python
id: 76
updated: '2017-03-01 08:18:11'
permalink: python-default-argument-blunders
categories:
  - programming
date: 2014-09-07 11:01:00
---
A few minutes ago a friend sent me the following code, and told me its misbehaving:

```python
def foo(l=[]):
   l.append("hello!")
   print(l)

foo()
foo()
```

Instead of printing `["hello"]` twice, it printed `["hello", "hello"]`. Any ideas why?

<!-- more -->

### what's going on?

I'll start of by saying that setting an empty list as a default parameter, is [a common gotcha](http://docs.python-guide.org/en/latest/writing/gotchas/) in python. 


`l` is a list, and **lists are mutable** in python (as opposed to some other languages, like [elixir](http://elixir-lang.org/)). default parameters are initialized at parsing time, so our `l` parameter got initialized once, not on every call. Interesting right? You can read more [here](http://www.deadlybloodyserious.com/2008/05/default-argument-blunders).

The fix is quite trivial, and you'll see it a lot in production code:

```python
def foo(l=None):
   # l might be an empty list
   if l is None:
      l = []
   l.append("hello!")
   print(l)
```

By the way, if you want to avoid common gotchas, likely bugs & design problems in your code, I suggest installing [flake8-bugbear](https://pypi.python.org/pypi/flake8-bugbear). It works out of the box when you've got [flake8](https://pypi.python.org/pypi/flake8) configured with [Neomake](https://github.com/neomake/neomake) or [Syntastic](https://github.com/vim-syntastic/syntastic/).