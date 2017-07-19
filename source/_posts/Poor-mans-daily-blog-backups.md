title: Poor mans daily blog backups
tags:
  - linux
  - ghost
id: 92
updated: '2017-05-23 11:47:48'
permalink: poor-mans-daily-blog-backups
categories:
  - devops
date: 2017-03-04 19:40:00
---
A few weeks ago [I outlined the steps I took](/2017/02/10/from-wordpress-com-to-ghost/) to migrate from WordPress.com to a self hosted ghost-powered blog on DigitalOcean.

One of the key highlights to self hosting is the ability to control everything.
That also means I need to configure everything by myself, including daily backups.

DigitalOcean [provide a backup service](https://www.digitalocean.com/help/technical/backup/ ) for 20% of the droplet price. That's only 2$ a month in my case.
But where's the fun in that? I want to do that myself!


In this blog post I'll show you how easy it is to backup your [Ghost blog](https://ghost.org/) to Google Drive.

**!** Even if you don't have a ghost blog, I really recommend reading this one, just to marvel the awesomeness of the [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy).

<!-- more -->

### Storage
I already told you guys I decided to put my backups in Google Drive. but why?

Probably the best candidate would be [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html), [Google Cloud Storage](https://cloud.google.com/storage/), or [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/). 
But honestly, I already have a 100gb plan in [Google Drive](https://www.google.com/drive/) and the compressed blog size is only ~7mb.

### How do I upload?
Now that I've selected Google Drive as my storage, I need to find a way to upload stuff.

S3 has [s3](https://docs.aws.amazon.com/cli/latest/reference/s3/), Google Cloud Storage has [gsutil](https://cloud.google.com/storage/docs/gsutil), Azure has [Azure Xplat-CLI](https://github.com/azure/azure-xplat-cli). What about Google Drive?

After some googling, I found out that Google doesn't offer an offical cli client. No worries, because there's an unofficial one - [drive](https://github.com/odeke-em/drive). It's mature, robust and It's written in Go :)

Setup is simple:

1. Follow [these steps](https://github.com/odeke-em/drive#installing) to install.
2. Type `drive init /path/to/drive/dir` and follow the on screen instructions

I configured it at the same directory where my backup script is.

### Migrating from MySQL to SQLite

Ghost is self-contained in one directory, except for the database. Backing up ghost is really easy:

1. stop ghost
2. backup its directory
3. backup the database
4. start ghost

DigitalOcean's droplet is pre-configured to use [MySQL](https://www.mysql.com/), which is an overkill at the moment. 
I decided to move to [SQLite](https://www.sqlite.org) - a self-contained, high-reliability, embedded, full-featured, public-domain, SQL database engine. 

SQLite's data is stored in one file, which makes it easy to backup. Furthermore, according to the [Appropriate Uses For SQLite](https://www.sqlite.org/whentouse.html) article, its performance is good enough at the moment:
```
SQLite works great as the database engine for most low to medium traffic websites (which is to say, most websites). The amount of web traffic that SQLite can handle depends on how heavily the website uses its database. Generally speaking, any site that gets fewer than 100K hits/day should work fine with SQLite. The 100K hits/day figure is a conservative estimate, not a hard upper bound. SQLite has been demonstrated to work with 10 times that amount of traffic.
```

I migrated the database using [mysql2sqlite](https://github.com/dumblob/mysql2sqlite), and put it inside ghosts content directory --> No need for `step 3`.

### Security considerations

[drive](https://github.com/odeke-em/drive) requires full access to my Google Drive directory. I don't like the idea that my Drive credentials are laying around on a remote server.

The only solution I feel comfortable with is to setup `drive` on my laptop, then backup the ghost directory remotely and upload it from my machine.


### Lets go!

The conventional way to backup the blog:

1. Compress the directory remotely
2. Download the compressed copy from the remote server
3. Upload the compressed file to Google Drive

But where's the fun in that? why not do all these stuff on the fly?
The following script shows the power of the [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) -

* `ssh` establishes an encrypted tunnel to the remote host
* `tar` compresses the *ghost* directory on the fly
* `ssh` forwards the compressed bytes, securely, to my local machine
* `drive` takes the compressed byte stream, and uploads it to Google Drive

everything is done on the fly, without disk access, with only three tools. Isn't that amazing?

#### Compression

First, I created a *compress* script at */var/www/compress* -

```bash
#!/usr/bin/env bash

# http://www.yoone.eu/articles/2-good-practices-for-writing-shell-scripts.html
set -euo pipefail

DIR="/var/www/.backup"

function create_dirs() {
   mkdir -p "$DIR"/{ghost,nginx}

   ln -s /etc/nginx/{sites-available,snippets} "$DIR"/nginx
   ln -s /usr/share/nginx/html/.well-known "$DIR"/nginx/well-known

   mkdir -p "$DIR"/ghost/data
   ln -s /var/www/ghost/content/{images,apps} "$DIR"/ghost/
   ln -s /var/www/ghost/content/data/static "$DIR"/ghost/data
}

# create all necessary directories to backup
if ! test -d "$DIR"; then
   create_dirs
fi

# remove old db backup
rm -rf "$DIR"/ghost/data/ghost.db

# backup the database
sqlite3 /var/www/ghost/content/data/ghost.db <<EOF
.backup $DIR/ghost/data/ghost.db
EOF

# compress and spit bytes to stdout
tar --absolute-names \
    --create \
    --dereference \
    --gzip \
    --preserve-permissions \
    --directory $DIR \
    --file - .
```

#### Backup

Then, I created a local backup script that uploads the compressed bytes to Google Drive:

```bash
#!/usr/bin/env bash

# http://www.yoone.eu/articles/2-good-practices-for-writing-shell-scripts.html
set -euo pipefail

REMOTE_PATH="Backups/blog/backup-$(date +"%m-%d-%Y-%T").tar.gz"

# cd to current directory, where `drive` is set up
cd "$(dirname "${BASH_SOURCE[0]}")"

echo "backing up ghost blog to Drive"

ssh -i ~/.ssh/digitalocean_rsa root@blog "/var/www/compress" | \
   pv  | drive push -verbose -piped "$REMOTE_PATH"

echo "backup uploaded, you can find it at: ${REMOTE_PATH}"

echo "done"
```

Cool, right?
