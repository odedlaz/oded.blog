title: Implementing python 3.6 print in < 3.6
tags:
  - python
  - optimization
  - ''
id: 61
updated: '2017-05-19 21:00:07'
permalink: implementing-python-3-6-print-in-older-version
categories:
  - programming
date: 2016-12-05 18:11:00
---


One of the neat features python < 3.6 is missing is statement evaluation is strings.  
 In this blog post we'll use eval, exec and compile to implement a print function with statement evaluation.

After we're done, we'll be able to write the following code:

```python
name = "oded"
age = 26
print("My name is: {name}, my age is: {age} and 2*3={2*3}!")
# My name is oded, my age is: 26 and 2*3=6!
```

**TL;DR**: The new print statement is 1.33x slower than the regular print when evaluating statements, and 1.09x slower for regular print operations. The whole snippet can be found [here](https://gist.github.com/odedlaz/c425fbc256edd692c1f540481c6a7ac7).

<!-- more -->

**A WORD OF WARNING**: <span style="text-decoration:underline;">THIS IS NOT PRODUCTION READY CODE</span>: Parsing statement and accessing parent functions is a dangerous practice * The caching key is not deterministic and might return invalid results if multiple identical format strings exist in the same scope.

First of all, since python 3, print is now a function, which means it can be replaced!  
 This behavior has been backported to python 2.7 using the **future** module.

Second, we need to check the performance of our solution compared to the standard print function. The following gist takes** 0.113 seconds** to run:

```python
from time import time
import os

devnull = open(os.devnull, 'w')

name = "oded"
t = time()
for _ in range(50000):
  print("my name is {} & 2*3={}".format(name, 2*3),
        file=devnull)
print("block took {0:.3f} seconds".format(time() - t))
```
Now that we have a number to compare to, we can start writing code.

# eval

[eval](https://docs.python.org/3/library/functions.html#eval) takes a string, and evaluates it. we can pass context in the form of locals and globals. The code will extract the keywords from the text, then evaluate them using ***eval:***

```python
import os
import six
from time import time
from inspect import currentframe
from string import Formatter

string_formatter = Formatter()

devnull = open(os.devnull, 'w')

six.moves.builtins.std_print = print

def print(text, **kwargs):
    caller = currentframe().f_back
    keywords = {kw for _, kw, _, _
                in string_formatter.parse(text) if kw}

    for keyword in keywords:
        value = eval(keyword, caller.f_globals, caller.f_locals)
        text = text.replace("{{{}}}".format(keyword), str(value))

    std_print(text, **kwargs)


name = "oded"
t = time()
for _ in range(50000):
  print("my name is {name} & 2*3={2*3}",
        file=devnull)
std_print("block took {0:.3f} seconds".format(time() - t))
```

The ***eval*** gist took **1.612 seconds** to run, which is **14.26x** **slower** than regular print! That's pretty expensive!

Can we do better?

# exec

[exec](https://docs.python.org/3/library/functions.html#exec) takes a block of code and evaluates it. It too can get context to run in.  
 In many cases, printing a line is a repeating task, which means that we can cache  
 most of the calculations we do and run the code once!

We're going to dynamically create the code we evaluated, then feed it to ***exec.***

The code will looks similar to:

```python
__keywords = {}
__keywords[GENERATED_NAME] = STATEMENT
__keywords[ANOTHER_GENERATED_NAME] = ANOTHER_STATEMENT
```

We'll also create an object that'll hold the parsed text and code, then pull it on every print call:

```python
from __future__ import print_function
import os
import sys
import six
from time import time
from random import choice
from string import Formatter
from string import ascii_letters
from inspect import currentframe

string_formatter = Formatter()

six.moves.builtins.std_print = print

def random_string(length=20):
    """
    generate a random string of given length
    """
    return "".join(choice(ascii_letters)
                   for _ in range(length))

class TextObject(object):
    __slots__ = ["code", "text"]

    def __init__(self, text, code):
        self.text = text
        self.code = code

    @classmethod
    def from_text(cls, text):
        keywords = {random_string(): kw for _, kw, _, _
                    in string_formatter.parse(text) if kw}

        code = ["__keywords={}"]
        line_code = "__keywords[\"{kw_name}\"] = {kw_statement}"
        for key, value in six.iteritems(keywords):
            code.append(line_code.format(kw_name=key,
                                         kw_statement=value))
            text = text.replace("{{{}}}".format(value),
                                "{{{}}}".format(key))

        return cls(text=text,
                   code="\
".join(code))


memoize = {}


def print(text, **kwargs):
    caller = currentframe().f_back

    text_obj = memoize.get(text)
    if not text_obj:
        memoize[text] = text_obj = TextObject.from_text(text)

    exec(text_obj.code, caller.f_globals, caller.f_locals)
    std_print(text_obj.text.format(**caller.f_locals["__keywords"]), **kwargs)


devnull = open(os.devnull, 'w')

name = "oded"
t = time()
for _ in range(50000):
  print("my name is {name} & 2*3={2*3}", file=devnull)
std_print("block took {0:.3f} seconds".format(time() - t))
```

***exec*** gist took **1.880 seconds**, which is actually worse than eval! It's **16.63x slower** than regular print.

That means that no only we optimized the wrong thing, we added a dictionary overhead to the print call. exec and eval are extremely expensive because they parse the code string every time. Can we remove that overhead?


# compile

Instead of parsing the code over and over again, we'll parse it once and store the function code object. The following code is similar to the previous one, except from the part that compiles the code string using [compile](https://docs.python.org/3/library/functions.html#compile):

```python
from __future__ import print_function
import os
import sys
import six
from time import time
from random import choice
from string import Formatter
from string import ascii_letters
from inspect import currentframe

string_formatter = Formatter()

six.moves.builtins.std_print = print


def random_string(length=20):
    """
    generate a random string of given length
    """
    return "".join(choice(ascii_letters)
                   for _ in range(length))

class TextObject(object):
    __slots__ = ["code", "text"]

    def __init__(self, text, code):
        self.text = text
        self.code = code

    @classmethod
    def from_text(cls, text):
        keywords = {random_string(): kw for _, kw, _, _
                    in string_formatter.parse(text) if kw}

        code = ["__keywords={}"]
        line_code = "__keywords[\"{kw_name}\"] = {kw_statement}"
        for key, value in six.iteritems(keywords):
            code.append(line_code.format(kw_name=key,
                                         kw_statement=value))
            text = text.replace("{{{}}}".format(value),
                                "{{{}}}".format(key))

        return cls(text=text,
                   code="\
".join(code))

    @classmethod
    def compile(cls, text):
        obj = cls.from_text(text)
        compiled = compile(obj.code, '<string>', 'exec')
        return cls(code=compiled, text=obj.text)


memoize = {}


def print(text, **kwargs):
    caller = currentframe().f_back

    text_obj = memoize.get(text)
    if not text_obj:
        memoize[text] = text_obj = TextObject.compile(text)

    exec(text_obj.code, caller.f_globals, caller.f_locals)
    std_print(text_obj.text.format(**caller.f_locals["__keywords"]), **kwargs)
    

devnull = open(os.devnull, 'w')

name = "oded"
t = time()
for _ in range(50000):
  print("my name is {name} & 2*3={2*3}", file=devnull)
std_print("block took {0:.3f} seconds".format(time() - t))
```

***compile*** took **0.192 seconds** to run, or **1.75x slower** than regular print. That's a major improvement compared to our best result!

Can we do better?


#  optimizing compiled code

python has a neat locals optimization called €œfast locals€, which makes locals access faster than regular dictionaries. When in local scope, python keeps track of the names of variables it knows about. Each of that variable is assigned an index. That index is used in an array of python objects instead of a dictionary. More about that: [here](http://lucumr.pocoo.org/2011/2/1/exec-in-python/#performance-characteristics).

We'll rewrite our `TextObject.to_text` function to generate code that will hint python to use fast locals:

The code will looks similar to:

```python
def awesome_print(text, **kwargs):
   text = "a format with {GENERATED_NAME} and {ANOTHER_GENERATED_NAME}"
   std_print(text.format(GENERATED_NAME=(STATEMENT), ANOTHER_GENERATED_NAME=(ANOTHER_STATEMENT), **kwargs))
```

We'll now cache the function code instead of the code object.

```python
import os
import six
from time import time
from random import choice
from string import Formatter
from string import ascii_letters
from inspect import currentframe

string_formatter = Formatter()

six.moves.builtins.std_print = print


def random_string(length=20):
    """
    generate a random string of given length
    """
    return "".join(choice(ascii_letters)
                   for _ in range(length))


class TextObject(object):
    __slots__ = ["code", "locals", "globals"]

    def __init__(self, caller, code):
        self.code = code
        self.locals = caller.f_locals
        self.globals = caller.f_globals

    @staticmethod
    def get_keywords(text):
        return {random_string(): kw for _, kw, _, _
                in string_formatter.parse(text) if kw}

    @classmethod
    def from_text(cls, caller, text):
        keywords = cls.get_keywords(text)

        code = ["def awesome_print(text, **kwargs):"]
        line_code = "   {kw_name} = {kw_statement}"
        for key, value in six.iteritems(keywords):
            text = text.replace("{{{}}}".format(value),
                                "{{{}}}".format(key))

        code.append("   text = \"{}\"".format(text))
        args = ", ".join("{0}=({1})".format(key, val)
                         for key, val in six.iteritems(keywords))

        print_line = "   std_print(text.format({}), **kwargs)".format(args)
        code.append(print_line)
        return cls(caller=caller,
                   code="\
".join(code))

    @classmethod
    def compile(cls, caller, text):
        # optimize for the trivial case where no formatting is done
        if not cls.get_keywords(text):
            return cls(code=std_print, caller=caller)
        
        obj = cls.from_text(caller, text)
        exec(obj.code, caller.f_locals, caller.f_locals)
        return cls(code=caller.f_locals.pop("awesome_print"), caller=caller)


memoize = {}

def print(text, **kwargs):
    text_obj = memoize.get(text)
    if not text_obj:
        frame = currentframe()
        text_obj = TextObject.compile(text=text,
                                      caller=frame.f_back)
        memoize[text] = text_obj
        # why delete the frame?
        # https://docs.python.org/3/library/inspect.html#the-interpreter-stack
        del frame
    text_obj.code(text, **kwargs)

devnull = open(os.devnull, 'w')

name = "oded"
t = time()
for _ in range(50000):
  print("my name is {name} & 2*3={2*3}", file=devnull)
std_print("block took {0:.3f} seconds".format(time() - t))
```

This time it took **0.150 seconds **to run, or **1.33x slower** than regular print.  
 You probably noticed we pass the locals twice instead of the globals. Any idea why?

Optimizations are highly appreciated. My next step would probably be byte-code rewriting. I want to use replace specific line calls to the compiled print object, so we won't need a cache at all. Stay tuned!