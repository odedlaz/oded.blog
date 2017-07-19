title: Regular Expressions
tags:
  - productivity
  - regex
  - ''
id: 28
updated: 2017-03-30 09:56:51
permalink: master-regular-expressions
categories:
  - programming
date: 2017-03-07 08:41:00
---


[Regular Expressions](https://en.wikipedia.org/wiki/Regular_expression) are one of the most important tools in a programmer's toolbox.  
A regex master can achieve magical string manipulation with a few characters!

![](https://imgs.xkcd.com/comics/regular_expressions.png)

If you've never heard about regular expressions, now is time. [RegexBuddy](https://www.regexbuddy.com/regex.html) can help get you started.

Most languages that have a standard library, also have their own implementation of regular expressions. python has [re](http://pymotw.com/2/re/), go has [regexp](https://golang.org/pkg/regexp/), elixir has [:re](https://hexdocs.pm/elixir/Regex.html), rust has [regex](https://doc.rust-lang.org/regex) (which [has go bindings](https://github.com/BurntSushi/rure-go) too!) etc'.

Those Implementations are not the only ones though, there are numerous regex engines in the wild. I gathered the interesting ones for you in this blog post.

<!-- more -->

### PCRE

The PCRE library is a set of functions that implement regular expression pattern matching using the same syntax and semantics as Perl 5. PCRE has its own native API, as well as a set of wrapper functions that correspond to the POSIX regular expression API. The PCRE library is free, even for building proprietary software.

[PCRE](http://www.pcre.org/) powers [nginx](https://nginx.org) and is used as the regular expression engine for [Julia](http://julialang.org/), and [Perl](https://en.wikipedia.org/wiki/Perl) of course.

You can grab the C++ library [here](http://www.pcre.org/), and there are bindings for many other languages.

### RE2

Google has its own implementation of regex, called **[RE2](https://github.com/google/re2)**.

RE2 is a fast, safe, thread-friendly alternative to backtracking regular expression engines like those used in PCRE, Perl, and Python. It's used internally by Google and in under constant development.

You can grab the C++ library [here](https://github.com/google/re2). There are bindings for other languages, such as: [python](https://github.com/facebook/pyre2), [ruby](https://github.com/mudge/re2/), [erlang](https://github.com/tuncer/re2/), [nodejs](https://github.com/uhop/node-re2).

### Oniguruma

[Oniguruma](https://github.com/kkos/oniguruma) supports a variety of character encodings. It used to be the default regular expression engine for Ruby.

[Oniguruma](https://github.com/kkos/oniguruma) powers popular tools such as: [Atom](https://atom.io/), [Sublime Text](https://www.sublimetext.com/), and [jq](https://stedolan.github.io/jq/).

There are bindings various languages, such as: [rust](https://github.com/defuz/oniguruma), [ruby](https://github.com/geoffgarside/oniguruma), [nodejs](https://github.com/atom/node-oniguruma), [golang](https://github.com/moovweb/rubex).

#### Onigmo

[Onigmo](https://github.com/k-takata/Onigmo) is a fork of *Oniguruma*, which includes some features introduced in Perl 5.10+. It is also the default regular expression engine for Ruby since version 2.0.

### RE3

**re3** tries to re-invent the syntax of regular expressions to make them more readable, and thus easier to learn and maintain.

According to its creator, [Aur Saraf](https://github.com/SonOfLilit): *Regular Expressions are one of the best ideas in the programming world. However, Regular Expression syntax is a ^#.\*! accident from the 70s. Lets fix it.*

You can grab re3 from [here](https://github.com/SonOfLilit/re2), and watch the "Reasons to Switch to re3" slideshare [here](https://www.slideshare.net/AurSaraf/re3-modern-regex-syntax-with-a-focus-on-adoption).


**!** re3 is only implemented in python


