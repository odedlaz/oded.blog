title: A better way to handle multiline strings in python
tags:
  - python
  - ''
id: 91
updated: '2017-03-03 15:41:27'
permalink: python-string-tuple-syntax
categories:
  - programming
date: 2017-03-01 08:19:00
---

I'm a [PEP8](https://www.python.org/dev/peps/pep-0008/) fanatic, which means my code **always** follows the style guidelines.
I've got both [yapf](https://github.com/google/yapf) and [flake8](https://pypi.python.org/pypi/flake8) configured, and they can make my life a living hell if I try to fight them.

One of the guidelines that annoy me the most is the [Maximum Line Length](https://www.python.org/dev/peps/pep-0008/#maximum-line-length) guideline.
I can follow it most of the time, but when I have a REALLY long string, I just can't.

The following example violations the < 80 characters rule:
```python
text = "We hereby declare the establishment of a Jewish state in Eretz-Israel, to be known as the State of Israel."
print(text)
```

A quick fix would be to break the text to multiple lines and add `\`.
Not the prettiest solution, but there's no other  way, right?
```python
text = "We hereby declare the establishment " \
        "of a Jewish state in Eretz-Israel, " \
        "to be known as the State of Israel."
print(text)
```

I just found out that breaking the text and adding parenthesis has the same effect:
```python
text = ("We hereby declare the establishment "
        "of a Jewish state in Eretz-Israel, "
        "to be known as the State of Israel.")
print(text)
```

Not life changing, and I'm a bit embarrassed that it took me five years to figure this out. 
I believe some of you didn't know that either, so I'm taking one for the team :)