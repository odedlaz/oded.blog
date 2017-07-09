title: Peculiar uses for python's 'else' keyword
tags:
  - python
id: 124
updated: '2017-06-05 11:08:01'
permalink: python-else-keyword
categories:
  - programming
date: 2017-06-01 17:00:00
---
I've been asked by a few people recently to explain the different uses for the `else` keyword in python. 
python, for a reasons I do not understand, decided to overload the `else` keyword in ways most people never think of.

The spec isn't too friendly to beginners either. This is a partial piece of the [python grammar specification](https://docs.python.org/3/reference/grammar.html#full-grammar-specification), for symbols that accept the `else` keyword, as it is read by the parser generator and used to parse Python source files:

```l
if_stmt: 'if' test ':' suite ('elif' test ':' suite)* ['else' ':' suite]

while_stmt: 'while' test ':' suite ['else' ':' suite]

for_stmt: 'for' exprlist 'in' testlist ':' suite ['else' ':' suite]

try_stmt: ('try' ':' suite
           ((except_clause ':' suite)+
            ['else' ':' suite]
            ['finally' ':' suite] |
           'finally' ':' suite))

test: or_test ['if' or_test 'else' test] | lambdef
```

That's kind of cryptic, right?

This blog post is primarily aimed at beginners, and covers:
* [if...else one liner](/2017/06/02/python-else-keyword#if--else--one-liner-)
* [for...else & while...else](/2017/06/02/python-else-keyword#for--while--else)
* [try-catch-else-finally](/2017/06/02/python-else-keyword#try-catch-else-finally)

The post has no ordering. You can pick-n-choose the ones you're not familiar with.

<!-- more -->

## if ... else [ one liner ]
```python
<value> if <condition> else <value if condition is False>
```

for example, instead of writing this:
```python
age = 27

if age >= 18;
   print("adult")
else:
   print("kid")

# adult
```

we can do the same in one line:

```python
age = 27
print("adult" if age >= 18 else "kid")
# adult
```

## for | while ... else

`for` and `while` loops take an optional else suite, which executes if the loop iteration completes normally. In other words, the `else` block will be executed only if no `break` & `return` were used, and no exception has been raised.

```python
for <value> in <iterable>:
   # a code block with things
else:
  # runs only if the iteration finished without interruption (no break)
```

The following code randomizes five numbers, and prints them if they are not divisible by three. If that was the case for **all** of the numbers, it also print a message saying so.

```python
from random import randint

for _ in range(5):
    n = randint(0, 10)
    if not n % 3:
        break
    print(n, end=' ')
else:
    print("non of the numbers are divisible by three")

# 1 5 10
```

### what is 'for..else' good for?

A common use case is to implement search loops:

```python
condition_is_met = False

for value in data:
    if meets_condition(value):
        condition_is_met = True
        break

if not condition_is_met:
    # condition did not meet. do something about it.
```

Using the `else` keyword, we can cut a few lines. It makes the code slimmer and more concise. I like it.

```python
for value in data:
    if meets_condition(value):
        break
else:
    # condition did not meet. do something about it. 
```

Because many people aren't aware of the `for...else` syntax, I usually add a comment that explains when the `else` block is executed.

### what is 'while...else' good for?

Lets recap on the syntax first -
```python
while <condition>:
   # a code block with things
else:
  # runs only if the iteration finished without interruption (no break)
```


A common skeleton for code processing code: 
```python

ran_to_completion = True

while value < threshold:
    if not process_value(value):
        # something went wrong 
        ran_to_completion = False
        break
    value = update(value)

if ran_to_completion:
    # loop ended naturally, value passed threshold. 
    handle_threshold_reached()
```

Again, we can remove the flag by leveraging the `else` keyword:
```python
while value < threshold:
    if not process_value(value):
        # something went wrong 
        break
    value = update(value)
else:
    # loop ended naturally, value passed threshold. 
    handle_threshold_reached()
```

## try-catch-else-finally

`try-catch-finally` take an optional else suite, which executes if no exception were raised inside the try block -

```python
try:
    # a code block that might raise an exception
except <exception-type>:
    # a code block that executes if an exception of type <exception-type> is raised
else:
    # a code block that executes if no exceptions were raised in the try block
finally:
    # a code block that always executes
```

### what is it good for?

The following code is, unfortunately, common-place:

```python
no_error = False
try:
    # do something
    no_error = True
except ...:
    # error handling

if no_error:
    # do something if no error has occurred
```

Adding a flag at the end of the `try` block is weird and non pythonic in my opinion. The `else` keyword really shines here and makes the code more readable:

```python
try:
    # do something
except ...:
    # error handling
else:
    # do something if no error has occurred
```