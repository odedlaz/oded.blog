title: 'sh: ''subprocess.Popen'' for humans'
tags:
  - ''
  - python
id: 87
updated: '2017-03-04 20:35:25'
permalink: sh-subprocess-popen-for-humans
categories:
  - programming
date: 2017-02-13 16:37:00
---
[sh](https://github.com/amoffat/sh) is a full-fledged subprocess replacement for Python 2.6 - 3.5, PyPy and PyPy3 that allows you to call any program as if it were a function.

It handles many tasks that make working with 'Popen' tedious:

* Easy, and concise way of passing arguments
* Handling of exit codes
* Output redirection (!)
* Piping
* Background processing

and much more! for example: 

```python
from sh import ifconfig
print(ifconfig("wlan0"))

wlan0   Link encap:Ethernet  HWaddr 00:00:00:00:00:00
        inet addr:192.168.1.100  Bcast:192.168.1.255  Mask:255.255.255.0
        inet6 addr: ffff::ffff:ffff:ffff:fff/64 Scope:Link
        UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
        RX packets:0 errors:0 dropped:0 overruns:0 frame:0
        TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
        collisions:0 txqueuelen:1000
        RX bytes:0 (0 GB)  TX bytes:0 (0 GB)
```

Note that these aren't Python functions, these are running the binary commands on your system by dynamically resolving your `$PATH`, much like Bash does, and then wrapping the binary in a function. In this way, all the programs on your system are easily available to you from within Python.

### Installation

```bash
$ pip install sh
```
Docs & more: [amoffat.github.io/sh](https://amoffat.github.io/sh/)

### Disclaimer

I didn't write *sh*, I'm just a fan :)