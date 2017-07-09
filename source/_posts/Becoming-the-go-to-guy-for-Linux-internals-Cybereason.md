title: Becoming the go-to guy for Linux internals
tags:
  - cybereason
id: 136
updated: '2017-07-03 22:27:22'
permalink: mastering-linux-performance-debugging-monitoring
categories:
  - general
  - ''
date: 2017-07-03 19:21:00
---
7 months ago I made a new years resolution to master vim: [The Road to Mastering Vim](/2016/12/12/the-road-to-mastering-vim/).
I'm not a master just yet, it's going to take a few years. After 7 months of exclusively editing text & code with vim, I can honestly say that I'm feeling at home and I can't go back.

A few days ago I [told the world that I'm moving to Cybereason](/2017/06/22/goodbye-gartner-hello-cybereason/). I didn't say that I'm going as hard core as it gets - joining the team that develops the agent on Linux endpoints.

<h3><center> New Role → New Challenges. </center></h3>

<center>![](/images/2017/06/cybereason.png)</center>

<!-- more -->

## What am I going to do there?

Honestly, I don't know much. I'll probably know more once I'm done with [Cybereason](https://cybereason.com)'s "Boot Camp".

What I do know at this point is that:
- I'm going to write a lot of C++
- I'll need to dive deep into linux internals


## Reconnaissance

If you know me, or read my blog, you probably guessed that I'm not the passive kind. I want my ramp up session to be as quick as possible, and I want to provide value as fast as possible. I want to become the go-to guy at the company for everything Linux internals related.

In order to achieve that, I contacted my soon-to-be team leader, [Gal Kaplan](https://www.linkedin.com/in/gal-kaplan-8ba6b62/), and asked him for some reading materials and pointers, which He gladfully provided.

[Gal](https://www.linkedin.com/in/gal-kaplan-8ba6b62/) told me I would be doing a lot of linux monitoring & performance, so it would be best to read about the subject.

## Reconnaissance, Continued.

Now that I talked to my team leader and had the basic idea of what I'm looking for, I reached out to my own go-to guy for anything performance, debugging and monitoring related - [Sasha Goldstein](https://www.linkedin.com/in/sashag/).

Sasha is a wizard when it comes to windows internals, and lately he has started to dive into linux internals. I've been following his [blog](http://blogs.microsoft.co.il/sasha/) for a few years now, and I'm a huge fan.

Sasha gave a talk about performance at a recruiting event a few days ago, and I went there to chat a bit. Long story short, I found myself chatting with him for more than an hour. He's awesome. 

I asked him about relevant material I might need. That was his answer:

> Pretty much everything that Brendan wrote in the last few years is relevant for Linux performance investigation and debugging. His older posts have a bunch of stuff about dtrace and Solaris, which isn't that hot anymore, but the last couple of years he's 100% hardcore Linux.

> You should absolutely look into the following building blocks, which serve as the foundation for a bunch of other tools: **uprobes**/**kprobes**, **ftrace**, **perf_events** and **perf**. Also, some good familiarity with **gdb** can't hurt -- it's still the debugger of choice.

I also sent a similar query on a Facebook group, and more go-to guys of mine for anything Linux related, [Amit Serper](https://www.linkedin.com/in/aserper/) & [Nati Cohen](https://www.linkedin.com/in/natict/), said pretty much the same as well.


Recap: Three people I trust told me the same thing. read [Brendan's stuff](http://www.brendangregg.com/).

### Who is this Brendan guy?

Basically, He's the guy you go to when you want to read about anything related to linux monitoring, performance and related internals in linux.

His work is incredible. I can't believe I've never heard of him up to this point.

You can read more about him on [his bio page](http://www.brendangregg.com/bio.html).


## Asking Brendan for Mentoring

This might sound crazy, but what do I have to lose?
If Brendan doesn't respond or doesn't care, nothing happens.
Otherwise, I get to talk to an industry expert, get a few pointers and maybe even mentoring!

TL;DR: I never talked to him. from [his about page](http://www.brendangregg.com/email.html):

> I get a lot of emails, which build up into the hundreds when I've been traveling for a number of weeks. I do eventually read all the emails I'm sent, and while I want to reply to them all, I don't have the time to do so. If I didn't reply to you, sorry, it's likely because I'm just busy.

> ... I can't currently offer individual mentoring outside of my work. If you'd like to learn from me, I have shared a lot of content online, much of which is linked from this homepage. This includes over twenty hours of video presentations. There are also my books....

Ok, got it. No mentoring.

## Steps to Mastering Linux Performance & Monitoring


1. Brendan created a [portfolio](http://www.brendangregg.com/portfolio.html) page with a selection of his most useful and popular material. I need to go through all of it.
2. Read Brendan's [Systems Performance: Enterprise and the Cloud](http://www.brendangregg.com/sysperfbook.html) book.
3. Get acquainted with the tools that Sasha talked about.
4. Understand the internals that these tools use to operate. from [Brendan Gregg](http://www.brendangregg.com)'s website, [LWN.net](https://lwn.net/), [linux-insides](https://github.com/0xAX/linux-insides) and general googling.
5. Step up my game and get good familiarity with *gdb*.

Sounds like a great challenge for 2017, and probably 2018 as well 😅