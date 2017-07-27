---
title: Making Hexo Blazing Fast
tags: 'optimization,hexo'
categories:
  - devops
date: 2017-07-26 17:24:13
---

A week ago I migrated my blog from [Ghost to Hexo](/2017/07/11/From-Ghost-to-Hexo/) to gain better performance and save money.

Hexo is said to be "Blazing Fast", but while I did "feel" that my [Hexo](https://hexo.io/) based site was snappier than its predecessor, it was far from "Blazing Fast".

Performance is extremely important. There are a lot of articles on the subject, most of which point out that website performance & uptime are key to user satisfaction. WebpageFX wrote a nice summary of the subject - [Why Website Speed is Important](https://www.webpagefx.com/blog/web-design/why-website-speed-is-important/).

I'm not a web developer, and have almost zero knowledge in website optimizations. Nonetheless, I've optimized more then a few apps in my career and know how to approach such problems.

All I need is to figure out the tooling to find the bottlenecks and fix them to gain **good enough** performance. That is, I'm not looking into optimizing every single piece of the website, only making it fast enough so it'll feel snappy.

This blog post explains the steps I took in order to dramatically decrease the average page size to less then 350k.

![](/images/2017/07/xkcd-optimization.png)

<!-- more -->

## Benchmarks

First of all, I need to figure what what to test. I had Google Analytics set up for as long as I can remember, so my first step was figuring out what my users are doing.
My conclusion was that most users will find my blog either by organically searching for a specific topic, or by finding the content on social networks. On either case, they'll land directly to one of my posts. 

I saw a lot of traffic to my main page as well, and after some digging I figured out that most main page accesses were after a user landed on one of my posts and not direct access.

Honestly, none of the above was a suprise, but a good performance investigation is always based on *real data*. 

### Chrome DevTools

The [Chrome Developer Tools](https://developer.chrome.com/devtools) are a set of web authoring and debugging tools built into Google Chrome. I've used them before so that was my first step.

I fired them up, disabled caching and surfed to one of my posts. I saw a few things:
- a lot of [Render Blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css)
- a lot of content was loaded sequentially
- a lot of external javascript
- around 100 requests per page, many to ad relates websites.

I also looked at the source of several pages and noticed that -
- Nothing is minified / optimized
- There are a lot of duplicate code blocks
- There are a several css and js calls in the header (render blocking)

Ok, now what?

- I need to figure out how to decrease the amount of requests.
- I need to remove all render blocking things
- I need to understand what all of these scripts are used for
- I need to optimize the html, js and css.

### Pingdom Website Speed Test

Pingdom has a [neat benchmark tool](https://tools.pingdom.com/) that gives a lot of insight into your websites performance.

I fired it up, entered a url and gained a few new insights:
- My fonts are really big, as in 800k big.
- My images are REALLY big, as in 1mb+ big.
- My scripts & css are REALLY big, as in 500k+ big.
- There are A LOT of redirects

Ok, now what?

- I need to optimize images and fonts.
- I need to figure out what's causing all the requests and decrease that number.

### Google PageSpeed Insights

Google has its [own benchmarking tool](https://developers.google.com/speed/pagespeed/insights) which helped me gain a few more insights in addition to the former:
1. I already knew I had render blocking content, but this tool explained extacly which.
1. The server response time wasn't fast enough.
2. I had landing page redirects.
3. All redirect chains were caused by disqus.

Ok, now what?

- I need to figure out how to decrease the response time
- I need to understand why I have so many landing page redirects

### Conclusion

Recap -  
1. I need to figure out how to decrease the amount of requests.
2. I need to remove all render blocking things
3. I need to understand what all of these scripts are used for
4. I need to optimize the html, js and css
5. I need to optimize images and fonts
6. I need to figure out what's causing all the requests and decrease that number
7. I need to figure out how to decrease the response time
8. I need to understand why I have so many landing page redirects

The former can be divided into three groups:
1. perforance problems that were caused by the [theme I used](https://github.com/ppoffice/hexo-theme-icarus). 
2. performance problems that were caused by my own content.
3. performance problems that were "caused by" Github Pages caching strategy.

Thankfully, with enough effort, I can fix all of the above. How?
1. I have the source code for the theme, I need get my hands dirty and optimize it.
2. I can alter my content and/or run optimizers to make serving my content faster.
3. I actually had Cloudflare set up, but wrongly configured.

## Experiments

I needed to conduct experiments to figure out the best course of action of each problem.
It needed to be easy to conduct them, that is - automate deploy steps.

I did some googling and eventually decided to use [Gulp](https://gulpjs.com).  
Gulp is a toolkit for automating painful or time-consuming tasks in the development workflow.

Gulp was easy to understand and tinker with. I started by building the workflow I needed, then adding all optimizations I needed.

I found out that I can run Google PageSpeed Insights locally, using a tool called [psi](https://github.com/addyosmani/psi), which made the whole process really easy.

After each phase I checked to see the results. At some point I started deploying the blog to make sure my CDN changes didn't break anything. plus, I wanted to run bench tools I couldn't run locally.

## Optimizations

All the steps detailed below are [part of my Gulpfile](https://github.com/odedlaz/oded.blog/blob/master/Gulpfile.js). Feel free to look at it & even offer suggestions. Remember, I'm not a WebDev so I'm probably doing some things wrong!

### Minify html, js and css

I tried different tools and different configurations to gain the best result.

### Optimize images

I tried different tools and eventually settled on a few.  
I actually use two jpeg optimizers to achieve compress the images further.

A side note: I also used lossy compression mechanism.

### Fix Render Blocking things 

I Removed render blocking css by inlining the critical path and moving the rest to load asynchronously. Furthermore, I removed render blocking css, concatenated scripts and inlined others.

### Fix Redirects 

Disqus is the comment system I use. It looked like it was the reason I had so many (50+) redirect on each post. The solution was simple, all I needed was to  [disable anonymous cookie targeting](https://disqus.com/home/channel/discussdisqus/discussion/channel-discussdisqus/bug_reports_feedback_redirect_chain_from_rlcdn_idsync_loadus_and_many_others/)

### Remove unused or duplicate code paths.

The original theme had a lot of plugins that I didn't use. Removing them made the theme a lot slimmer and readable.

### Replace slow plugins
 
I replaced the custom share button with [AddToAny](https://www.addtoany.com/). Actually, [Icarus](https://github.com/ppoffice/hexo-theme-icarus) already supported AddToAny, but it didn't really work.
 
I also replaced [MathJax](https://www.mathjax.org/) with [KateX](https://khan.github.io/KaTeX/) which is [significantly faster](http://www.intmath.com/cg5/katex-mathjax-comparison.php).
 
### Optimize search

The theme came with custom search functionality which works really well. The problem was that it downloaded a json representation of all my posts (including text!), which was redudant.

I removed everything except the bare minimum and updated the code to only search titles, categories and tags.

### Optimize fonts

I used [IcoMoon](https://icomoon.io/) to remove unused [FontAwesome](http://fontawesome.io/) icons. FontAwesome went from 500k to 40k (!). I also removed unused Source Code Pro & Open Sans fonts.

### Tune Cloudflare Performance

Cloudflare was my CDN of choice. Not because it's the best (it might be), but because it's free :)

Anyhow, I configured Cloudflare to [cache my entire website](https://support.cloudflare.com/hc/en-us/articles/200172366-How-do-I-cache-everything-on-a-URL-), and as a result, added a Gulp task to invalidate Cloudflares cache on deploy.

I also turned on [Rocket Loader](https://blog.cloudflare.com/56590463/). Rocket Loader is a general-purpose asynchronous JavaScript loader coupled with a lightweight virtual browser that almost always improves a web page's window.onload time.

### Remove Disqus

Most of my posts take around 500k. 200k for content, and 300k to load Disqus (!).  

I decided to remove Disqus and replace it with [Gitment](https://github.com/imsun/gitment), a comment system based on GitHub Issues, which can be used in the frontend without any server-side implementation.

Gitment takes around 90kb after compression, which is 60% less then Disqus!
Moreover, it's completely based on GitHub issues which is pretty cool IMO.

Oh, right. It's not perfect either -

### gh-oauth-server

Every login request to gitment is proxied through `gh-oauth.imsun.net`.  
*gh-auth* is needed because GitHub does't attach a [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header to the logging requests.

The service doesn't record or store anything (I checked) but I still didn't like
it. Instead, I set up [my own](https://github.com/odedlaz/gh-oauth-server) gh-auth instance on DigitalOcean.


### Public client secret

Gitment uses OAuth authentication from the client side to pull comments.  
It needs the client secret to do so, which is considered a bad practice.

Although GitHub makes sure the client id and secret are only used for the
configured callback, I still didn't like that.

Instead, I used my "dummy" GitHub account to generate the token. At least if it
gets compromised somehow, that won't affect my real account.

## Fixes

During my experiments I also found out that I broke some parts of my website when migrating from Ghost.

### AMP

One of the reasons I moved to Hexo was to stop using [Accelerated Mobile Pages](https://www.ampproject.org/).  
Unfortunately, some people posted links pointing to AMP content on my blog, which lead to a 404.

I added a custom [URL Forwarding rule](https://blog.cloudflare.com/introducing-pagerules-url-forwarding/) in Cloudflare to redirect AMP content to the right page.

I also added a custom 404, because why not?

### Broken Links

I had a feeling some links would break after migrating from Ghost. What I didn't know is that I had broken links inside my posts!

TL;DR: I used a neat tool called [broken-link-checker](https://github.com/stevenvachon/broken-link-checker) that crawls a given website and checks for broken links.

#### Why were links broken?

Some were broken because of a mirgration error that caused some posts to get the wrong dates, leading to unreachable posts.

Others were broken as a result of differences from Ghost's Markdown rendering engine and Hexo's. For example, look at the following *valid* markdown:
```
[Ajax](http://en.wikipedia.org/wiki/Ajax_(programming))
```

Ghost would create a link named `Ajax` pointing to
```html
http://en.wikipedia.org/wiki/Ajax_(programming)
```

While Hexo would create link named `Ajax` pointing to
```html
http://en.wikipedia.org/wiki/Ajax_(programming
```

There's an [issue on the subject](https://github.com/chjj/marked/issues/366) with a solution.

## SEO Optimizations

I'm not an SEO wizard, but I do know that submitting your sitemap to search engines is a good idea, so I did that.

I also added a robots.txt file, which is completely redudnant in my opinion, but why not?

## Automatic Deployment

All the steps I outlined are really manual. I hate manual work. Instead, I set up [CircleCI](https://circleci.com) to do all the manual work for me.

Now every time I push something to the blog's github repository ([oded.blog](https://github.com/odedlaz/oded.blog)) the follwoing happens:
1. CircleCI checks out the code from GitHub
2. CircleCI installs all the dependencies Hexo needs to build the website
3. CircleCI runs gulp, which in turn -
    - generates the static website
    - runs all the optimization steps
    - deploys the blog to [odedlaz.github.io](https://github.com/odedlaz/odedlaz.github.io)
    - invalidates Cloudflares cache to make sure the content is up to date.
    - fires a webhook that tells IFTTT to send me an update

## Further work

### Remove unused CSS

I tried to run [uncss](https://github.com/giakki/uncss) to remove unused css, but it broke most of the website.  
Nevertheless, I'm pretty sure there are a lot of unused css selectors that I can safetly remove.

### Search

Currently I'm using a custom search "engine" that works on the client side.  
I might replace that with [Algolia](https://www.algolia.com/) at some point, but currently that's not an issue.
