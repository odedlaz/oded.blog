title: How does printf really work?
tags:
  - c
  - assembly
id: 122
updated: '2017-06-05 11:12:03'
permalink: printf
categories:
  - programming
date: 2017-05-23 08:48:00
---
`printf` is magical. Did you ever stop and ask yourself how it works?

Contrary to most functions, it accepts a variable number of arguments, and somehow transforms them into a formatted string! The [GNU code of printf](https://sourceware.org/git/?p=glibc.git;a=blob;f=stdio-common/printf.c;h=4c8f3a2a0c38ab27a2eed4d2ff3b804980aa8f9f;hb=3321010338384ecdc6633a8b032bb0ed6aa9b19a) is pretty simple:
```c
printf (const char *format, ...) {
   va_list arg;
   int done;

   va_start (arg, format);
   done = vfprintf (stdout, format, arg);
   va_end (arg);

   return done;
}
```
if you look closely, it uses a weird `...` syntax, performs a couple of `va_` calls and one [vfprint](https://sourceware.org/git/?p=glibc.git;a=blob;f=stdio-common/vfprintf.c;h=fc370e8cbc4e9652a2ed377b1c6f2324f15b1bf9;hb=3321010338384ecdc6633a8b032bb0ed6aa9b19a) call.

to understand `printf`, we first need to understand how `va_` works, then move to `printf`.

If you're ready for some hard-core `c` and `assembly`, [start by reading how va_ works!](/2017/05/24/printf#va_)

![](/images/2017/05/printf_seg_fault.jpg)


<!-- more -->


## VA_

The `va_` family of macros manipulate a stack pointer, which points to the beginning of variable argument "list". This stack pointer is calculated from the argument passed to `va_start`, and then `va_arg` "pops" values from the "stack" as it iterates.

That was a lot to process. Let's look at a concrete example to see what's really going on.

```c
#include <stdarg.h>
#include <stdio.h>

int sum(int numOfArgs, ...) {
  va_list args;
  va_start(args, numOfArgs);

  int sum = 0;
  for (int i = 0; i < numOfArgs; i++) {
    sum += va_arg(args, int);
  }
  va_end(args);

  return sum;
}

int main() {
  sum(3, 14, 29, 46);
  return 0;
}
```

First, the main is be called. The following is a simplified main assembly code:

```
push   46
push   29
push   14
push   3
call   sum
```

Those *push* operations fill up the stack:

```
      +------+
      |  46  |
      |  29  |
      |  14  |
      |   3  |
      | ret  |
sp -> +------+
```

- `sp` is the real stack pointer.
- 14, 29 and 46 are the arguments.
- `ret` is the return address: where to jump to when the function is done.

Next, `va_start(args, numOfArgs)` takes the address of `numOfArgs` and uses it to calculates the position of the first argument.

```
      +------+
      |  46  |
      |  29  |
ap -> |  14  |
      |   3  |
      | ret  |
sp -> +------+
```

Next, `va_arg(args, int)` returns what the `ap` stack pointer points to, and increments it to point at the next argument.

```
      +------+
      |  46  |
ap -> |  29  |
      |  14  |
      |   3  |
      | ret  |
sp -> +------+
```

And so on, until we're done. Of course this is simplified, and the real code is more complex.


### Dangers

You've probably noticed that `va_` relies on the programmer to provide a way to figure out how many arguments were passed. Users can easily misuse use a variadic function, and introduce a security vulnerability if they continue calling `va_arg` to access excess data. 

### Assembly

Lets re-cap on the code we're talking about -
```c
#include <stdarg.h>
#include <stdio.h>

int sum(int numOfArgs, ...) {
  va_list args;
  va_start(args, numOfArgs);

  int sum = 0;
  for (int i = 0; i < numOfArgs; i++) {
    sum += va_arg(args, int);
  }
  va_end(args);

  return sum;
}

int main() {
  sum(3, 14, 29, 46);
  return 0;
}
```

Done reading? awesome. The following assembly is a simplified version of the above, without unnecessary boilerplate.

It was generated using gcc:
```bash
gcc -m32 -S sum.c
```

```
####################
# the sum assembly #
####################

< a bunch of boilerplate instructions>

movl   $0,-4(R8) # sum = 0
movl   $0,-8(R8) # i = 0
jmp    0x8048439 # goto loop condition

# loop body
mov    -12(R8),R1 # extract arg address, put in R1
lea    4(R1),R4 # go to address of arg + sizeof(int)
mov    R4,-12(R8) # increase the pointer from this arg, to the next
mov    (R1),R1 # put the value adressed in R1 inside R1
add    R1,-4(R8) # add the arg to sum
addl   $1,-8(R8) # i++

# loop condition
mov    -8(R8),R1 # i
cmp    8(R8),R1 # numOfArgs
jl     0x8048427 # i < numOfArgs -> goto loop body
mov    -4(R8),R1 # return sum

#####################
# the main assembly #
#####################

< a bunch of boilerplate instructions>

push   $46
push   $29
push   $14
push   $3
call   <sum>

< a bunch of boilerplate instructions>
```

Now that we understand how `va_` works, we can talk about `printf`.

## printf

Again, let's recap:

```c
printf (const char *format, ...) {
   va_list arg;
   int done;

   va_start (arg, format);
   done = vfprintf (stdout, format, arg);
   va_end (arg);

   return done;
}
```

See those `va_` calls? in our `sum` function, we used the first argument as an indicator to how many arguments we have. `printf` uses the format argument as an indicator.

Actually, most of the magic is done in `vprintf`. `printf` is only a wrapper for `vprintf` which write the output string to `stdout`. I suggest you read [vprint's GNU implementation](https://sourceware.org/git/?p=glibc.git;a=blob;f=stdio-common/vfprintf.c;h=fc370e8cbc4e9652a2ed377b1c6f2324f15b1bf9;hb=3321010338384ecdc6633a8b032bb0ed6aa9b19a), it only has 2278 line of code ;)

I said earlier that the format string is used as an indicator to the amount of variables. Actually, it serves two more purposes:
 
1. figure out the type of the argument in order to calculate the position of the next argument.
2. figure out the type in order to understand how to transform it to a character

So when parsing the format, `vprintf` recognizes the `%` tokens, and for each token it loads one more argument from the stack. Then it does some magical transformation code, and keeps going. That's it basically.

__P.S__: remember we talked about the dangers of variadic functions? well, the [Format String Attack](https://cwe.mitre.org/top25/#CWE-134) is considered one of the [Top 25 Most Dangerous Software Errors](https://cwe.mitre.org/top25) a programmer can make.