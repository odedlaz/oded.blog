title: 'C++ <algorithm> Series #0'
tags:
  - c++
permalink: cpp-algorithm-series-0
categories:
  - programming
date: 2017-11-3 14:43:00
---

![](/images/2017/11/xkcd-algo.png)

The more I learn about an eco-system, the more I understand how little I know about it.  
I'm a master of nothing. There's always something new to know, and the list only grows.

This time around it's C++ that haunts me.

I recently "binge-watched" a few CPPCon talks:

- [Modernizing Legacy C++ Code](https://www.youtube.com/watch?v=LDxAgMe6D18)
- [Writing Good C++14](https://www.youtube.com/watch?v=1OEu9C51K2A)
- [Inheritance Is The Base Class of Evil](https://www.youtube.com/watch?v=bIhUE5uUFOA)
- [extern c: Talking to C Programmers about C++](https://www.youtube.com/watch?v=D7Sd8A6_fYU&list=PLHTh1InhhwT7J5jl4vAhO1WvGHUUFgUQH)

They were awesome, but one talk really got my attention - [C++ Seasoning](https://channel9.msdn.com/Events/GoingNative/2013/Cpp-Seasoning) by [Sean Parent](http://sean-parent.stlab.cc/papers-and-presentations).

I have this *"I don't know anything about programming"* feeling every time I watch a [Rich Hickey](https://changelog.com/posts/rich-hickeys-greatest-hits) talk.  
Sean's *C++ Seasoning* (then Programming Converstaions [#1](https://www.youtube.com/watch?v=IzNtM038JuI) & [#2](https://www.youtube.com/watch?v=vxv74Mjt9_0)) made me feel the same.  
His talk reminded me, again, that I *have a lot to learn*.

One of the key points of his talk is that developers need to be familiar with the [algorithm](http://www.cplusplus.com/reference/algorithm/) library,  
and be able to extend it. During his talk, He magically transformed a few-dozen-lines of complex code into two, using {% raw %}&lt;algorithm&gt;{% endraw %}.

I'm used to seeing python code refactoring that turn huge pieces of code into a few, which are easy to read and reason about. But in C++? wow.  

Anyway, one of my takeaways is that I don't use {% raw %}&lt;algorithm&gt;{% endraw %} enough. It's time to change that.

## The {% raw %}&lt;algorithm&gt;{% endraw %} series

I'll go through every algorithm in \[ C++'s [stl](http://www.cplusplus.com/reference/algorithm/), Adobe's [asl](https://github.com/stlab/adobe_source_libraries), Google's [abseil](https://github.com/abseil/abseil-cpp) & [Boost](http://www.boost.org/doc/libs/1_65_1/libs/algorithm/doc/html/index.html) \] and will provide examples for each. I might even throw in some [Introduction to Algorithms](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-046j-introduction-to-algorithms-sma-5503-fall-2005/) references.

This is a big project which will take a very (very) long time to finish, but it's worth it.

**Stay tuned.**
