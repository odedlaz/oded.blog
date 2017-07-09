title: From WordPress.com to Ghost on DigitalOcean
tags:
  - ghost
  - digitalocean
id: 86
updated: '2017-02-27 15:21:27'
permalink: from-wordpress-com-to-ghost
categories:
  - announcement
  - blog
date: 2017-02-09 23:59:00
---
After ~3 years of managed hosting at [WordPress.com](https://wordpress.com) I decided to self host my blog.

In this blog post I'll outline all the steps I took to migrate.

<!-- more -->

### Why WordPress.com?

Three years ago I decided I want to create a blog, but didn't have any specific platform in mind. WordPress was easy to setup, so I just rolled with it.

### Why Move?

Managed WordPress is problematic for a programmer.
Many  times I find myself wanting to install a specific plugin or theme, but can't.
To gain all the features WordPress can offer, I need to pay. a lot.

I don't mind setting up everything. [like I said before](/2017/01/09/developers-must-have-sysadmin-experience/), I believe that having strong sysadmin skills (and being able to administer your servers) is a must have.

### Where should I move?

This question has two parts:

* Should I stay with WordPress or move to a different platform?
* Where should I host my blog?

#### Server Hosting

I started looking into my options. and they were so expensive.
At WordPress I paid ~2$ a month for a managed blog, while most other providers I considered wanted at least 15$. 

Then I found out that [DigitalOcean has a WordPress Droplet](https://www.digitalocean.com/community/tutorials/how-to-use-the-wordpress-one-click-install-on-digitalocean) but also a [Ghost Droplet](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-ghost-application). Both cost 10$ a month.

#### Platform

WordPress is much more than a blogging platform, while Ghost is just that.

Ghost is a fully open source, hackable platform for building and running a modern online publication. I read a lot about Ghost during its [Kickstarter campaign](https://www.kickstarter.com/projects/johnonolan/ghost-just-a-blogging-platform), and decided to give it a go.

I fired up a [ghost docker container](https://hub.docker.com/_/ghost/) and started playing with it. It was awesome!

### Migration

#### Step 1 - Move all the data

Sounds like an easy task, right? Theoretically, Ghost has you covered.

All you need is to install [Ghost plugin for WordPress](https://fuc.wordpress.org/plugins/ghost/) and in a few minutes you'll have a dump of your entire blog in Ghost format.

Well, I couldn't install this plugin because I'm on a managed WordPress account with limited plugin availability. Did I Give up? **HELL NO!**

First, I fired up a local copy of wordpress, using [docker-compose](https://docs.docker.com/compose/):
```yaml
version: '2'

services:

  wordpress:
    image: wordpress
    networks:
      - wordpress
    ports:
      - 8080:80
    volumes:
      - /path/to/volume:/vol
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: dev
      WORDPRESS_DB_PASSWORD: dev
    depends_on:
      - mysql

  mysql:
    image: mariadb:10.0
    container_name: db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_ROOT_USER: root
      MYSQL_USER: dev
      MYSQL_PASSWORD: dev
      MYSQL_DATABASE: wordpress
    networks:
      - wordpress

networks:
  wordpress:
```
Actually, I had major issues with the database, until I figured out that the latest [mariadb](https://mariadb.org/) image is broken.

Once I had WordPress up and running, I migrated my blog. thankfully, WordPress also migrates all the photos for you which makes things really easy!

Then, I installed the Ghost plugin and exported all the data to my local ghost instance.

I also needed to manually move all the media, because ghost doesn't support that at the moment. You can read more WordPress -> Ghost migration [here](https://www.ghostforbeginners.com/migrating-your-wordpress-blog-to-ghost/).

#### Step 2 - Rewrite all the posts

Ghost uses [Markdown](https://daringfireball.net/projects/markdown/), while WordPress uses a proprietary, non-conformant syntax language.  

The Ghost plugin did an OK job at migrating my posts, but I had to manually correct them. This took a while, but I also fixed many old posts and added proper tags to all of them.

I also had to add support for `<!-- more -->` tag in Ghost, because [they wouldn't do that now](https://github.com/TryGhost/Ghost/issues/4933). They're looking into finding [a better solution](https://github.com/TryGhost/Ghost/issues/5060).

Hacking into Ghost to add support for `<!-- more -->` was really easy! 

#### Step 3 - Setup Ghost on DigitalOcean

DigitalOcean are really awesome. They've got tutorials for everything.

1. It took me five minutes to setup my vanilla ghost blog, using this [tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-ghost-application).
2. Then another five minutes to setup SSL certificates with Let's Encrypt, using [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04). I also added [Cloudflare](https://www.cloudflare.com/).
3. Another minute or two to update my DNS records on [namecheap](https://www.namecheap.com)
4. Transferring my domain name was easy too. I followed [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-host-name-with-digitalocean).
5. Setting up MailGun, was again, [a trivial task](http://code.krister.ee/mailgun-digitalocean/).
6. Finally, I uploaded the blog to my droplet (how? there's a [tutorial](https://www.digitalocean.com/community/tutorials/how-to-connect-to-your-droplet-with-ssh) for that)


And that's it! I'm writing this blog post on my new, shiny, Ghost-powered blog, served through Cloudflare to my tiny DigitalOcean droplet :)

#### Aftermath

Ghost doesn't have a plugin infrastructure to trigger updates to social profiles on new posts. 

There are many solutions online, but most of them required hard-coding support to ghost core or my theme.

I went on a different approach: leverage [IFTTT](ifttt.com). It's extremely easy to write a new applet, and there are hundreds (if not thousands) of pre-baked recipes you can use.

I ended up writing my own applet: **If** new feed item from [my blog](https://oded.ninja), **Then** post a tweet [on my behalf](https://twitter.com/odedlaz).