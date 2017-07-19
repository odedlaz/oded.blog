title: '{} vs dict(...)'
tags:
  - optimization
  - python
id: 58
updated: 2017-05-19 20:59:53
permalink: vs-dict
categories:
  - programming
  - ''
date: 2016-12-01 23:21:00
---


I just spent a few days of extensive profiling. I got to a point where I had to optimize code snippets so small, that I even looked at the performance impact of creating dictionaries.

I'm going to write a separate post about profiling,  optimization and the techniques I used to get 5x performance compared to the initial version.

First, I'll give you a sneak peek: Using the dict(...) expression is 6 times more expensive than the regular {...} call.

Intrigued? [Read this great post by Doug Hellmann](https://doughellmann.com/blog/2012/11/12/the-performance-impact-of-using-dict-instead-of-in-cpython-2-7-2/)


