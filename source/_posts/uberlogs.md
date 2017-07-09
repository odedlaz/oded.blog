title: uberlogs
tags:
  - python
  - ''
  - project
id: 60
updated: '2017-03-07 19:59:24'
permalink: uberlogs-announcement
categories:
  - programming
date: 2016-11-30 23:46:00
---
Writing good, usable logs is not an easy task.

**[uberlogs](https://github.com/odedlaz/uberlogs)** does all the dumb work you have to do, to make your logs easy to parse.

- Drop-in replacement for logging - fully backwards compatible with logging.
- Human Readable, parsable log lines (with or without color)
- Machine readable parsable log lines for your favorite data cruncher (json)
- Variable formatting, so you don't have to write .format(...) or % (...) ever again
- Statement evaluation like in Ruby, Koltin, Python 3.6, etc'
- Handler to violently kill the process when a log on a specific level has been written
- Automatic twisted log rewriting to python.logging

you can find it on [github](https://github.com/odedlaz/uberlogs). Feel free to open issues or submit pull requests!

**Performance**

I was extremely performance aware while writing this library. It does a lot of **magic**, and most of the time python magic is expensive. I had to use every trick I could come up with (including ahead of time compilation!)  to make the performance overhead as low as I can. My work isn't done, but I reached an acceptable overhead:

```bash 
 $ ITERATIONS=10000 python profile.py 1> /dev/null  
 Profiling 10000 iterations [python 3.5.2] 
  
 block took 0.666 seconds, 0.00% faster than 'std %' [std %]  
 block took 0.655 seconds, 0.02% faster than 'std %' [std .format()]  
 block took 0.851 seconds, 0.30% slower than 'std .format()' [uber .format()]  
 block took 0.863 seconds, 0.01% slower than 'uber .format()' [uber complex .format()]  
 block took 0.842 seconds, 0.28% slower than 'std .format()' [uber .format() with statement]  
 block took 0.881 seconds, 0.05% slower than 'uber .format() with statement' [uber complex .format() with statement]  
```

**Why did I write uberlogs?**

I rarely use any other logging appenders than the console one. Most of the time I send my logs to a data cruncher and write horrible regular expressions to parse the data.

To ease the pain, I started formatting my logs, so they'll be easy to parse: `arg1=arg1val; arg2=arg2val` But that meant I had to write the same format **everywhere**, and I found myself writing long, long log lines:

```python
 import logging  
 from collections import namedtuple  
 Eatable = namedtuple('Eatable', ['name', 'flavor', 'location'])

logger = logging.getLogger("test")

eatable = Eatable(name="bagel", flavor="salty", location="tel-aviv")

logger.info("I'm eating a {thing}; location: {location}; flavor: {flavor}".format(thing=eatable.name,  
 location=eatable.location,  
 flavor=eatable.flavor))

# 1970-01-01 18:24:17,578 - test - INFO - I'm eating a bagel; flavor: salty; location: tel-aviv  
```

I had to find a better, more concise way of doing the same - that way is uberlogs:

```python 
 import uberlogs  
 from collections import namedtuple  
 Eatable = namedtuple('Eatable', ['name', 'flavor', 'location'])

uberlogs.install()

logger = uberlogs.getLogger("test")

eatable = Eatable(name="bagel", flavor="salty", location="tel-aviv")

logger.info("I'm eating a {eatable.name}", flavor=eatable.flavor, location=eatable.location)  
 # 1970-01-01 18:26:17,578 - test - INFO - I'm eating a bagel; flavor: salty; location: tel-aviv  
```