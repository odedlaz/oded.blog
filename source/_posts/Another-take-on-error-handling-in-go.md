title: Another take on error handling in go
tags:
  - golang
id: 88
updated: '2017-02-27 15:10:49'
permalink: another-take-on-error-handling-in-go
categories:
  - programming
date: 2017-02-18 10:03:00
---
A lot has been written about [error handling in go](https://blog.golang.org/error-handling-and-go).

It's a hot topic, and for a good reason.Coming from an object oriented language, errors as return values seem awkward to say the least. Most developers I know, including myself, dislike errors codes.

In this blog post I'll outline my take on error handling in general, and go's error handling in particular.

<!-- more -->

### My take on error codes

I HATE error codes. I used to write a lot of C back in the day, and one of the things I missed is error handling. I'm not a fond of the whole *"return an error code and pass object references to change state"*. I'm a big fan of functional programming and such patterns are a big no-no in functional programming land.

I think that the biggest problem with error codes is that they are easy to dismiss, especially for novice developers.

### My take on exceptions

Exceptions are as beautiful as they are ugly: They can make your code clean and concise, and give you the power to handle errors deterministically. But they are often misused as control flows, which, IMO, do more harm then good.

There are two big problems with exceptions:

**The first** - using exceptions for flow control. If you do that, I highly recommend reading [this](http://wiki.c2.com/?DontUseExceptionsForFlowControl) article.

**The second** - broad exception handling. The following is a snippet I see a lot in production code:
```python
try:
   ...
except:
   logger.exception("something bad happened!")
```

Why is it problematic? because you're silencing errors you have no idea about. Catching unknown errors is very risky: Once an unexpected error corrupts the state of your program, you can't recover. The only way to catch it is via logging.

I'm a big of catching exceptions you know how to handle, throwing the rest and crashing gracefully. That might sound obvious, but many programmers don't do that.

```python
try:
   ...
except IOError:
   # handle a known error
except:
   logger.exception("something bad happened!")
   # add some recovery code here, if possible, and raise.
   raise 
```

### A bit on error handling in go 
As I said, errors are a hot topic. At first, I hated go's  verbose error handling. It's very similar to the C style of handling errors. I started changing my mind after reading [Go's Error Handling is Elegant](https://davidnix.io/post/error-handling-in-go/) & [Errors are values](https://blog.golang.org/errors-are-values).

I believe that if used correctly, error handling in go can be as beautiful as exceptions, without their added overhead. There are a couple of extremely powerful libraries / tools that make the above easy achievable.

#### stacktrace

Stack traces are a necessary evil when you need to debug an error. [Palantir](https://www.palantir.com/about/) wrote an awesome library called [stacktrace](https://github.com/palantir/stacktrace) that makes stack traces easier to debug.

This is difficult to debug:
```go
Inverse tachyon pulse failed
```

While this gives the full story and is easier to debug:
```go
Failed to register for villain discovery
 --- at github.com/palantir/shield/agent/discovery.go:265 (ShieldAgent.reallyRegister) ---
 --- at github.com/palantir/shield/connector/impl.go:89 (Connector.Register) ---
Caused by: Failed to load S.H.I.E.L.D. config from /opt/shield/conf/shield.yaml
 --- at github.com/palantir/shield/connector/config.go:44 (withShieldConfig) ---
Caused by: There isn't enough time (4 picoseconds required)
 --- at github.com/palantir/shield/axiom/pseudo/resource.go:46 (PseudoResource.Adjust) ---
 --- at github.com/palantir/shield/axiom/pseudo/growth.go:110 (reciprocatingPseudo.growDown) ---
 --- at github.com/palantir/shield/axiom/pseudo/growth.go:121 (reciprocatingPseudo.verify) ---
Caused by: Inverse tachyon pulse failed
 --- at github.com/palantir/shield/metaphysic/tachyon.go:72 (TryPulse) ---
```

The library's intent is not to capture the exact state of the stack when an error happens (look at [go-errors](https://github.com/go-errors/errors) for a library that does that), but to attach relevant contextual information at strategic places along the call stack, keeping stack traces compact and maximally useful.


#### panicparse

[panicparse](https://github.com/maruel/panicparse) parses panic stack traces, densifies and deduplicates goroutines with similar stack traces. Helps debugging crashes and deadlocks in heavily parallelized process.

![](https://raw.githubusercontent.com/wiki/maruel/panicparse/parse.gif)

### errcheck

[errcheck](https://github.com/kisielk/errcheck) checks for unchecked errors in go programs.

You can use it from the command line:
```
errcheck github.com/<user|org>/<repo>/...
```

or, integrate it into your code editor. I use [vim-go](https://github.com/fatih/vim-go).