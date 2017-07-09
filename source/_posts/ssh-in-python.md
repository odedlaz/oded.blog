title: ssh in python
tags:
  - python
id: 38
updated: '2017-03-05 15:47:06'
permalink: ssh-in-python-client-server-mocking-a-suprise
categories:
  - programming
date: 2014-08-10 07:24:00
---


I needed to write some code that involves [ssh](https://en.wikipedia.org/wiki/Secure_Shell), and like always, I took the time to research the state of ssh in the python kingdom before writing code. 

what did I find?

- there are two main packages that handle ssh in python: [paramiko](https://github.com/paramiko/paramiko) and [conch](https://twistedmatrix.com/trac/wiki/TwistedConch) (twisted)
- there's a cool package that mocks ssh connections, called [MockSSH](https://github.com/ncouture/MockSSH).
- there's a super awesome utility/package/you-name-it that creates an ssh [honeypot](https://en.wikipedia.org/wiki/Honeypot_(computing)) in python, called [kippo](https://github.com/desaster/kippo).

