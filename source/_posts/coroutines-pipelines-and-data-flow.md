title: 'coroutines: pipelines and data flow'
tags:
  - python
  - ''
  - concurrency
  - ''
id: 104
updated: '2017-07-05 19:49:10'
permalink: python-coroutines-pipelines-and-data-flow
categories:
  - programming
date: 2017-04-11 10:04:00
---

This part of the series will introduce the concept of "pipes" using coroutines. We'll write a naive implementation of `tail -f`, and enhance it with a filter, then broadcast the results.

<!-- more -->

### Prerequisites

1. You're using python 2.7.x
2. You're familiar with coroutines. otherwise, read - [coroutines: introduction](/2017/04/11/python-coroutines-introduction/).


### Pipelines

coroutines can be used to set up pipes, by chaining multiple coroutines together and pushing data from a producer to consumers.

`[producer] --> [consumer coroutine] --> [consumer coroutine] --> ...`


The producer has an end-point consumer (sink), which consumes the produced data: 

```python
def producer(target):
   while True:
      item = produce_an_item()
      if not item:
         target.close()
         break

      target.send(item)

@coroutine
def consumer():
   try:
      while True:
         item = (yield) # receive an item
         ...
   except GeneratorExit: # handle .close()
      ...

# now, run the producer and send the consumer.
producer(consumer())
```

### tail -f

[tail](http://man7.org/linux/man-pages/man1/tail.1.html) is a program on Unix and Unix-like systems used to display the tail end of a text file or piped data.

The `--follow` flag (`-f` for short) cause *tail* to output appended data as the file grows.

We will emulate the same behavior with a line producer. The producer will read lines from a given file, and send each line to a consumer that prints them.

```python
from io import SEEK_END
from time import sleep

def follow(fd, target):
    fd.seek(0, SEEK_END) # read to the end of the file
    while True:
        line = fd.readline().strip()

        if not line:
            sleep(0.1) # wait a little bit before trying again
            continue

        target.send(line)
```

Now, we'll define a coroutine decorator that bootstraps coroutines:

```python
from functools import wraps

def coroutine(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        cr = f(*args, **kwargs)
        cr.next()
        return cr
    return wrapper
```

Then create a print coroutine that consumes lines and prints them to stdout:
```python
@coroutine
def printer():
    while True:
        print((yield))
```

And now lets hook everything together:
```python
from sys import argv

# read path from argv
with open(argv[1], 'r') as f:
   follow(f, printer())
```

Here we go. we've got a nice implementation of `tail -f`.

#### Adding a filter

Let's say we want to add a filter to our solution that behaves like `grep`.

```python
from re import compile
# in python 2.x, there's no "re type" import.
re_type = type(compile(""))

@coroutine
def filter(expression, target):
   if isinstance(expression, basestring):
      expression = compile(expression)

   if not isinstance(expression, re_type):
      raise ValueError("expression should be a string or a compiled regex")
      
   while True:
      # this is called on every .send() call
      text = (yield)
      if expression.search(text):
         target.send(text)
```

We'll leverage the current design and only print lines that start with the word `hello`.

```python
from sys import argv

# read path from argv
with open(argv[1], 'r') as f:
   follow(f, filter("^hello", printer()))
```

The former works like so: `[follow] --> [filter] --> [printer]`

#### Broadcasting

Lets say we want to broadcast produced results, we can create a broadcast coroutine:

```python
@coroutine
def broadcast(*targets):
    while True:
        text = (yield)
        for target in targets:
            target.send(text)
```

Now, we'll create another coroutine that cleans nasty words:

```python
from re import compile

@coroutine
def cleaner(pattern, target):
    expression = compile(pattern)

    def clean(match):
        text = match.group(0)
        # transform fuck -> f**k
        return text[0] + ('*' * (len(text) - 2)) + text[-1]

    while True:
        text = expression.sub(clean, (yield))
        target.send(text)
```

And hook everything together:
```python
with open(argv[1], 'r') as f:
    follow(f, broadcast(filter("^hello", printer()),
                        filter("fuck", cleaner("fuck", printer()))))
```

You've probably noticed we've created our filter multiple times. Maybe a better approach would be to send a compiled expression to both `cleaner` and `filter` coroutines.

Moreover, we're creating multiple `printer` coroutines. Instead of creating separate pipes for each filter, we can create one instance of `printer` and branch back when we need to print.

Let's fix these issues -

```python
printer_routine = printer()
nasty_regex = re.compile("fuck")

with open(argv[1], 'r') as f:
    follow(f, broadcast(filter("^hello",
                               printer_routine),
                        filter(nasty_regex,
                               cleaner(nasty_regex,
                                       printer_routine))))
```

All the code you've seen in this blog is available as a [GitHub Gist](https://gist.github.com/odedlaz/fc65e0903dc23dff7ea0096773b6e8dc) as well.

### Final thoughts

coroutines provide more powerful data routing possibilities than simple iterators.

If you've built a collection of simple data processing components, you can glue them together into complex arrangements of pipes, branches, merging, etc.



### What's next?

Go ahead and read the next part of the series, [coroutines: basic building blocks for concurrency](/2017/07/05/python-coroutines-basic-building-blocks-for-concurrency/).