title: how to create a local PyPI mirror
tags:
  - python
id: 24
updated: '2017-03-05 14:42:55'
permalink: how-to-create-a-local-pypi-mirror
categories:
  - devops
  - ''
date: 2014-07-15 11:06:00
---

PyPI is amazing, but it does have its drawbacks:

* If PyPI is down, you can't download any packages or run any tests
* PyPI can be extremely slow at times
* PyPI doesn't offer private package support

The solution? set up a local PyPI mirror of course.

Python already has a PEP that describes the mirroring infrastructure for PyPI: [PEP 381](https://www.python.org/dev/peps/pep-0381), and the tooling that implements it.

I started by [looking at my options](https://bitofcheese.blogspot.co.il/2013/05/local-pypi-options.html), and at the end decided to follow these articles to do so:

- I read [Create a local PyPI mirror](http://aboutsimon.com/2012/02/24/create-a-local-pypi-mirror/). Instead of using [pep381client](https://pypi.python.org/pypi/pep381client/), I used [bandersnatch](https://pypi.python.org/pypi/bandersnatch)..
- I used [this tutorial](http://nginx.org/en/docs/beginners_guide.html) to setup nginx. I tried [pypiserver](https://pypi.python.org/pypi/pypiserver), but the performance wasn't good enough.
- Then I read [pip's configuration guide](http://pip.readthedocs.org/en/latest/user_guide.html#configuration) to make it use my local mirror.

During my search endeavours, I found out that [Artifactory](https://www.jfrog.com/confluence/display/RTF/PyPI+Repositories) provides support for PyPI repositories. If you already have it installed, I suggest using it instead.