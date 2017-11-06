title: My take on Modern C++ 
tags:
  - c++
permalink: modern-cpp
categories:
  - programming
date: 2017-11-06 09:27:12
---

C++ is a big language that has evolved tremendously since it's inception way back in the 1980's.

Throughout the years, many million lines of code have been written in the language and a big portion of that code is using legacy features that aren't considered good practice anymore.

![](/images/2017/11/xkcd-goto.png)

## Replacing C++?

There were *many* attempts to replace the lanaguage. All of them failed as far as I know.

Some attempts were made to subset the language in order to get rid of code & language dept, which hurt speed and portability.

The most recent hype is around [rust](https://www.rust-lang.org/), which is a blazing fast, memory safe systems programming language. I see a promising future for `rust`, and I'm actually learning it myself. But like Bjarne said in his talk [Writing Good C++14](https://www.youtube.com/watch?v=1OEu9C51K2A), it would take ~10 years for a good language to make it to the mainstream.

C++ is already here. We need to find a way for people to write good C++ now.

## Subset of Superset

Simply sub-setting the language won't work. This is backed by previous, failed, attempts. In order to maintain the speed of C++ we need the low-level / tricky / close-to-the-hardware / error-prone / expert-only features. Those feature are the building blocks of for higher-level facilitiese & libraries.

Bjarne talked about the subject at CPPCon a few years back:
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/1OEu9C51K2A?rel=0&amp;start=1063" frameborder="0" allowfullscreen></iframe>


Bjarne said we first need to create a superset of the langauge, then subset it in order to get rid of the crud. In order to do so, we need supporting facilities to make the transition: from guidelines on how to write modern C++, to libraries that enpasulate the usage of messy & dangerous things so most programmers won't need to use them.

## What is Modern C++

What is modern C++? Put simply, C++ that is based on C++1x and uses modern best practices.

To really grasp the essence of Modern C++, read the [Core Guidelines](https://github.com/isocpp/CppCoreGuidelines). But nobody does that right? 

### Talks & Books

I really liked Bjarne's [Writing Good C++14](https://www.youtube.com/watch?v=1OEu9C51K2A), Neil MacIntosh's [The Guideline Support Library: One Year Later](https://www.youtube.com/watch?v=_GhNnCuaEjo), Herb Sutter's [Writing Good C++ by Default](https://www.youtube.com/watch?v=hEx5DNLWGgA) & [Modern C++: What You Need to Know](https://www.youtube.com/watch?v=TJHgp1ugKGM).

I've also read parts of [Effective Modern C++](http://www.amazon.com/dp/1491903996) by Scott Meyes and found it useful.

#### C++ Seasoning

I find [Sean Parent](http://sean-parent.stlab.cc)'s C++ Seasoning talk so good that I think you have to see it. I wrote about it in my previous post: [C++ algorithm Series #0](/2017/11/03/cpp-algorithm-series-0).

The talk takes a look at many of the new features in C++ and a couple of old features you may not have known about. With the goal of correctness in mind, Sean shows how to utilize these features to create simple, clear, and beautiful code. 

TL;DR: No Raw Loops, No Raw Syntonization Primitives, No Raw Pointers.

<iframe src="https://channel9.msdn.com/Events/GoingNative/2013/Cpp-Seasoning/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

Sean also gave another talk on the subject at [Amazon's A9](https://www.a9.com) Programming Converstaions course.

<iframe width="560" height="315" src="https://www.youtube.com/embed/IzNtM038JuI" frameborder="0" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/vxv74Mjt9_0" frameborder="0" allowfullscreen></iframe>

## Writing Modern C++

These are my do's and don'ts regarding modern c++. There are also other things I do in order to make sure my project's are written well:
- Use CMake to build your project
- Use memcheck to detect memory leaks
- Run fuzzers to validate input
-  and more ...

**[!]** Are you using a package manager? please let me know.

### Follow Well-Known Guidelines

First, follow [C++ Core Guidlines](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md). You don't need to actually read it, there are tools like `Clang-Tidy` that have the core guidelines pre-baked. Once you get a warning please go ahead and read the whole guideline. It's important to understand *Why* the guideline exists.

Second, consider following well-known coding conventions and guidelines. On many occasions you can find tooling that help you follow guidelines created by big projects / corporations.

For instance, `Clang-Format` has pre-baked support for LLVM, Google, Chromium, Mozilla & WebKit. `Clang-Tidy` has pre-baked checks that follow Boost, Google, LLVM and more.

### Use Popular Libraries 

Use standard / popular libraries as much as possible. I use:

- [Guidelines Support Library](https://github.com/Microsoft/GSL)
- Google's [Abseil](https://abseil.io)
- [Adobe's Standard Library](http://stlab.adobe.com)
- [Boost](https://boost.org)

I try to use the [[Standard Library](http://www.cplusplus.com/reference/stl/) as much as possible.

### Compiler Flags

Turn on warnings, and preferebly warnings as errors. I usually turn on `Wall` and `Werror`. They are anoyying, but a neccessery evil IMO.

### RAII

A few days ago I watched a talk called "Modernizing Legacy C++ Code" where they suggested to use [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) everywhere:

<iframe width="560" height="315" src="https://www.youtube.com/embed/LDxAgMe6D18?start=1641" frameborder="0" allowfullscreen></iframe>

I'm not suprised, I'm a huge fan of RAII. Not only it makes code cleaner, thus reducing bugs and memory leaks, it also has an extremely low performance impact (compared to golang's [defer](https://lk4d4.darth.io/posts/defer/), which is used for the same purpose)

If Your'e interfacing C code, consider creating a scope guard. I use my home-baked [defer](https://oded.blog/2017/10/05/go-defer-in-cpp/)-clone for that purpose.

### Const-Qualify Everything

On "Modernizing Legacy C++ Code" they also talked about using `const` everywhere. At first it sounded weird, but it actually made a lot of sense once they showed a few examples:

<iframe width="560" height="315" src="https://www.youtube.com/embed/LDxAgMe6D18?start=2195" frameborder="0" allowfullscreen></iframe>

This is a rolling release. That is, I'll keep updating this post with new insights.