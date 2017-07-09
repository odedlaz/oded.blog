title: Scraping websites with Scrapy
tags:
  - python
  - web-scraping
id: 46
updated: '2017-02-28 19:01:36'
permalink: scraping-anonymously-with-scrapy
categories:
  - programming
date: 2014-11-26 15:37:00
---


I found myself in need of scraping a few sites recently.
Normally I would've use [requests](http://docs.python-requests.org/en/master/)*, but this time I needed a robust framework.

Scraping on a massive scale is not a trivial task, specifically if you're targeting websites that don't want to be scraped. I started looking into various scraping frameworks and bumped into Scrapy.

[Scrapy](https://scrapy.org/) is an open source and collaborative framework for extracting data from websites, in a fast, simple, yet extensible way. It's widely used and extremely hackable!

Now, as I said, scraping a website that doesn't want to get scraped is not easy, and that's exactly what I needed. Why is that so hard? mainly because you can caught and blocked rather quickly. Scraping such sites is like playing catch.

I started by reading Scrapy's tutorial, [avoid-getting-banneed](http://doc.scrapy.org/en/latest/topics/practices.html#avoiding-getting-banned), and moved over to [scrapying over](http://pkmishra.github.io/blog/2013/03/18/how-to-run-scrapy-with-TOR-and-multiple-browser-agents-part-1-mac/) [TOR](https://www.torproject.org/).  This wasn't the ideal solution. Honestly, the best solution IMO is using a proxy like [Luminati](https://luminati.io/)**, but I needed a quick win, and TOR gave me exactly that.


*** *The only Non-GMO HTTP library for Python, safe for human consumption.*

**** Lumintai is a "business proxy network" built by [Hola](https://hola.org/). They use their [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) users as proxies, which gives them ~20 million proxies worldwide!