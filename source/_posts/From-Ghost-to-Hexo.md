title: From Ghost to Hexo
tags:
  - hexo
  - ghost
categories:
  - announcement
  - blog
date: 2017-07-11 12:03:00
---
After a few months of hosting my blog at [DigitalOcean](https://digitalocean.com), I decided to ditch [Ghost](https://ghost.org/).  
Instead, I'm moving my blog to [Hexo](https://hexo.io/), hosted by [GitHub Pages](https://pages.github.com/).


**TL;DR** -

- Ghost doesn't offer any server features, but runs one.
- Ghost wasn't fast enough.
- Unnecessary Server costs.
- To much Maintenance.

![](/images/2017/07/hexo-logo.png)

<!-- more -->


### Why Ghost?

I didn't like WordPress and found Ghost a good alternative.  
A full explanation can be found at - [From WordPress.com to Ghost on DigitalOcean](/2017/02/10/from-wordpress-com-to-ghost).



### Why Move (again)?


#### Server runtime with no server features

Ghost doesn't offer any dynamic features, and honestly - I don't really need any.  
My entire blog is static, except for comments which are provided by [Disqus](https://disqus.com).

That means I needed to setup a server for a (de-facto) static website.

#### Speed

My blog wasn't snappy enough. There are a number of "blame" factors:
- Ghost isn't fast enough (I never checked that)
- The droplet I was paying for didn't supply enough resources for Ghost


I decided to redirect my users to [AMP](https://www.ampproject.org/) to gain extra speed. I set up rules on nginx to only redirect mobile users to AMP, which I didn't like for serveral reasons:

1. AMP removed disqus and mathjax (which made some posts unreadable from mobile)
2. It gives my users two distinct websites, with a completely different design.

Plus, Everything [Alex Kras](https://www.alexkras.com/about/) wrote about the subject - [I decided to disable AMP on my site
](https://www.alexkras.com/i-decided-to-disable-amp-on-my-site/).


#### Maintenance

I found myself doing a lot of work to make sure my blog is working like I except it too, and that I have everything backed up.


#### Price

I felt fine with paying 10$ a month for a droplet, but once I had to pay more to gain performance I went back to the drawing board.


### Hexo?

There are a ton of static page generators out there, but I like [Hexo](https://hexo.io) the most -
- Hexo is fast
- Hexo is simple
- Hexo is powerful
   - It's easy hack
   - It's pluggable, with a huge plugin ecosystem 
   - It has great tooling
   
All you need to do in order to get up and running is to type the following:

```console
$ npm install hexo-cli -g
$ hexo init blog
$ cd blog
$ npm install
$ hexo server
```

Plus, [Elad Zelingher](https://www.linkedin.com/in/elad88/), which is a good friend of mine and a rockstar, migrated his blog to Hexo.

### Gains

Once I move to Hexo I'll gain -
- Better performance
- Zero maintenance - everything is hosted on GitHub
- Free hosting - The site served using GitHub Pages
- Global distribution via GitHub and Cloudflare
- IMO, a better editing experience - I can finally edit with vim!
   - There are also web editors, for instance: [hexo-editor](https://github.com/tajpure/hexo-editor) & [hexo-admin](https://github.com/jaredly/hexo-admin)

### Migration Process

Hexo [provides tooling for migration](https://hexo.io/docs/migration.html) from other platform like: WordPress, Joomla, Jekyll, etc'. 

Unfortunately, there are no "official" tools to migrate from Ghost. Fortunately, a solution is always a google search away: [hexo-migrator-ghost](https://github.com/jasonslyvia/hexo-migrator-ghost).

The process was much easier than last time, but I still had to do some work:

1. Fix Bugs: tags weren't properly migrated & some posts wouldn't pass migration, so I had to fix those in the migrator.
2. Custom Migration: I used [prism.js](http://prismjs.com) to highlight code blocks in Ghost. Hexo uses [highlight.js](https://highlightjs.org) instead. I had to take care of syntax changes.
3. Manual Work: fixing tags, adding categories, etc'

Once I was done, and everything worked locally, I deployed the blog, then followed Cloudflare's [Secure and fast GitHub Pages with CloudFlare](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/).
