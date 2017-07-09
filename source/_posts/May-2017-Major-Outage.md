title: May 2017 Major Outage
tags:
  - digitalocean
  - ghost
id: 118
updated: '2017-05-22 21:26:07'
permalink: may-2017-major-outage
categories:
  - announcement
  - blog
date: 2017-05-21 21:03:00
---

The blog suffered a major outage today - it was offline for around six hours. It took me around 90 minutes to get it working once I had time to do so. 

## Why

A few days ago I created a new [droplet](https://www.digitalocean.com/community/questions/i-m-new-and-inexperienced-what-is-a-droplet-and-how-do-i-point-godaddy-to-digitalocean) for a homebrew scraping project I've been working on lately.

Today I decided its time to throw it, and pressed the big, red, destroy button. Then I noticed **I deleted the wrong droplet** and accidentally deleted my blog!

![](/images/2017/05/doh.jpeg)

## Disaster Recovery Plan

I had daily backups setup already (remember [Poor mans daily blog backups](/2017/03/04/poor-mans-daily-blog-backups/)?) which were almost up to date. 

All I needed to do is to add a few updates to the latest post. Fortunately, every time I post to LinkedIn, they cache my posts at *"oded-ninja.cdn.**ampproject.org**/c/s/oded.ninja/..."*

Up until now I kind of hated that cache. Every time I updated a blog post, it took forever to refresh, which was a real pain. Only this time I was actually grateful that cache existed.

Anyway, have you ever heard of the [AMP Project](https://www.ampproject.org/)?  

> *The AMP Project is an open-source initiative aiming to make the web better for all. The project enables the creation of websites and ads that are consistently fast, beautiful and high-performing across devices and distribution platforms.*

Ghost [has pre-baked AMP support](http://support.ghost.org/amp-support/), Which I've set up to automatically redirect mobile clients.

### Snapshots

DigitalOcean [provide a droplet snapshot service](https://www.digitalocean.com/community/tutorials/digitalocean-backups-and-snapshots-explained) for only 20% of the cost of the virtual server. 

The problem is that **snapshots** wouldn't help me at this point, because they **get deleted with the droplet**. Good thing I created that backup service.


### Restore

I forked Ghost a few months ago, and instead of testing my changes on production, I put all my configuration in a private git repository.

That proved really useful for local testing, but especially for restoration. I had a habit of checking changes on up-to-date backups, which meant I restored the blog locally every few days.


## Plan Execution

1. Create a new Droplet
2. Create new [Read-only Deploy Keys](https://github.com/blog/2024-read-only-deploy-keys)
3. Clone the repository, and build it.
4. Restore the backup from Google Drive
5. [Pause Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200169176-How-do-I-temporarily-deactivate-Cloudflare-)
6. Check the website is working
5. Setup [Lets Encrypt](https://letsencrypt.org/) 
6. Resume Cloudflare
7. Re-create [my Keybase](https://keybase.io/odedlaz) website proof.

### Issues I Encountered

1. I forgot to update the new droplet's IP at [namecheap](https://www.namecheap.com/), my DNS provider.
2. When checking the website, before turning on SSL, I kept getting redirected to the https endpoint. That's because it was saved in the browsers HSTS set. Fix? [clear my browser's HSTS settings](http://classically.me/blogs/how-clear-hsts-settings-major-browsers)
3. Chrome has an internal DNS cache which needed to be refreshed. Fix? flush DNS records and sockets at [chrome://net-internals/#dns](chrome://net-internals/#dns) and [chrome://net-internals/#sockets](chrome://net-internals/#sockets) respectively.
5. I didn't read the Lets Encrypt setup instructions thoroughly and got blocked for an hour after several failed attempts to set it up. Conclusion? [RTFM!](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04)
5. I forgot to update my website proof on [Keybase](https://keybase.io).

## Lessons Learned

First of all, **DON'T PRESS THE BIG, RED, DESTROY BUTTON BEFORE MAKING SURE YOU ARE REMOVING THE RIGHT DROPLET!**

Second, I need to make a few adjustments -
* Enhance my backup script to include nginx's configuration as well. 
* Setup a mechanism to perform backup after every update, or at least reduce the interval between backups. 
* Automate recovery steps, or at least document them. When I'm under pressure (or drunk), I forget steps :|




 



