title: Can you spot the bug?
tags:
  - python
  - ''
id: 98
updated: '2017-03-20 15:01:33'
permalink: can-you-spot-the-bug
categories:
  - programming
date: 2017-03-19 18:45:00
---

Take a look at the following snippet:

```python
def foo(flag):
   return "hello", "world" if flag else "friend"
```

Now, here are two possible evaluations. which one is correct?

```python
> foo(True)
("hello", "world")

> foo(False)
"friend"
```

```python
> foo(True)
("hello", "world")

> foo(False)
("hello", "friend")
```

In python the `"hello", "world"` statement is implicitly evaluated as a tuple, which causes the confusion. `foo`'s statement can be interpreted in two different ways:

```python
# option A
("hello", "world") if flag else "friend"
# option B
"hello", ("world" if flag else "friend")
```
So which one is correct? *Option B* -
```python
> foo(True)
("hello", "world")

> foo(False)
("hello", "friend")
```

**Takeaways?**
[Explicit is better than implicit](https://www.python.org/dev/peps/pep-0020/) , and of course:
![](/images/2017/03/TestAllTheThings.jpg)