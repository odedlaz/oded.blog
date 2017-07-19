title: The production killer file descriptor
tags:
  - linux
id: 128
updated: '2017-06-20 08:49:16'
permalink: docker-log-incident
categories:
  - devops
  - ''
date: 2017-06-13 06:46:00
---
A few days ago one of our ([Gartner Innovation Center](https://gici.co.il)) productions servers died as a result of a log file that wasn't properly rotated. This might sound like an easy problem to figure out and fix, but the situation was a bit more complex!

This blog post walks through all the steps we took to investigate and fix the issue. I find it extremely interesting & [hope you would too](/2017/06/13/docker-log-incident#investigating-the-issue)!

![](/images/2017/06/fixing_problems.png)

<!-- more -->

## Investigating the issue

We connected to the server and ran a few "checklist" commands - 
```console
$ df -alh
Filesystem      Size  Used Avail Use% Mounted on
...
/dev/sda3       225G  225G     0 100% /var/lib/docker
```

As you can see, `/var/lib/docker`, got filled up. But which part?
```console
$ du -ahd 1 /var/lib/docker

du: cannot read directory '/var/lib/docker': Permission denied
4.0K	/var/lib/docker
```

Snap! We can't get statistics on `/var/lib/docker` because we don't have the right privileges. We don't have `root` either. Ideas?

IT messed up and we can  run `docker` in [privileged mode](https://blog.docker.com/2013/09/docker-can-now-run-within-docker/):

>  "*When the operator executes docker run --privileged, Docker will enable access to all devices on the host as well as set some configuration in AppArmor or SELinux to allow the container nearly all the same access to the host as processes running outside containers on the host*" - Docker docs

So we fired up docker, mounting `/var` to `/host_var`:

```console
$ docker run -t -i --privileged -v /var:/host_var alpine sh
# inside the container, running sh
$ du -ahd 1 /host_var/lib/docker
72K     /host_var/lib/docker/network
4.2G    /host_var/lib/docker/overlay2
1.7G    /host_var/lib/docker/volumes
32M     /host_var/lib/docker/image
4.0K    /host_var/lib/docker/tmp-old
4.0K    /host_var/lib/docker/swarm
20K     /host_var/lib/docker/plugins
4.0K    /host_var/lib/docker/trust
4.0K    /host_var/lib/docker/tmp
219.1G  /host_var/lib/docker/containers
225G    /host_var/lib/docker
```

Interesting. `du` says `/var/lib/docker/containers` is full.
Let's try and find out which container is the problematic one:
```console
$ docker run -t -i --privileged -v /var:/host_var alpine sh
# inside the container...
$ du -hs /host_/lib/docker/containers/* | sort -hr | head -n 1
218.3G	/host_var/lib/docker/containers/11bcb8ab547d177
```

Back to the host, we ran:
```console
docker ps -a | grep 11bcb8ab547d177
```

and found out who was the trouble maker. But that doesn't solve anything!
Back to the docker container:
```console
$ du -hs /host_var/lib/docker/containers/11bcb8ab547d177/*
4.0K/host_var/lib/docker/containers/11bcb8ab547d177/checkpoints
4.0K/host_var/lib/docker/containers/11bcb8ab547d177/config.v2.json
4.0K/host_var/lib/docker/containers/11bcb8ab547d177/hostconfig.json
4.0K/host_var/lib/docker/containers/11bcb8ab547d177/hostname
4.0K/host_var/lib/docker/containers/11bcb8ab547d177/hosts
4.0K/host_var/lib/docker/containers/11bcb8ab547d177/resolv.conf
4.0K/host_var/lib/docker/containers/11bcb8ab547d177/resolv.conf.hash
4.0K/host_var/lib/docker/containers/11bcb8ab547d177/shm
```

We suspected that the problem is logging, because our docker log driver rotates logs after they reach a certain size. We should've see the file at the following location, but didn't:
`/var/lib/docker/containers/11bcb8ab547d177/11bcb8ab547d177.json`

What if a log wasn't rotated properly? what if the container holds a file descriptor to a log file that already got deleted?

It's really easy to find out! lets fire up `lsof` and search for deleted files.
```console
$ lsof
lsof: WARNING: can't stat() overlay file system /var/lib/docker/overlay2/9ce66914ee2bbfcaa7646a87c74c772d5a90b7236fb1e84cfcc4a410e544afa4/merged
      Output information may be incomplete.
lsof: WARNING: can't stat() tmpfs file system /var/lib/docker/containers/66ab0db40286ff7964fa0770d1dd660c611c2025be72067dea5d8982d73ec071/shm
      Output information may be incomplete.
lsof: WARNING: can't stat() nsfs file system /run/docker/netns/594e57d254a8
      Output information may be incomplete.
COMMAND     PID   TID     USER   FD      TYPE             DEVICE  SIZE/OFF       NODE NAME
systemd       1           root  cwd   unknown                                         /proc/1/cwd (readlink: Permission denied)
systemd       1           root  rtd   unknown                                         /proc/1/root (readlink: Permission denied)
systemd       1           root  txt   unknown                                         /proc/1/exe (readlink: Permission denied)
systemd       1           root NOFD                                                   /proc/1/fd (opendir: Permission denied)
...
```

Snap! we're not running as root, which means we can only see output for our own processes. Some information about a process, such as its current directory, its root directory, the location of its executable and its file descriptors can only be viewed by the user running the process (or root).


You know the drill, right? we can mount `/proc` and run `lsof`. well, not exactly.
`lsof` will list open files inside a container, and not the files in the host.

We can, on the other hand, search for deleted files manually:

```console
$ docker run -t -i --privileged -v /proc:/host_proc alpine sh
# inside the container...
$ find /host_proc/*/fd -ls | grep '(deleted)' | grep /var/ | grep -v /var/lib/docker
952833633    0 l-wx------   1 root     root           64 Jun  3 08:39 /host_proc/991/fd/4 -> /var/log/docker.log-20170530 (deleted)

$ stat -Lc %s /host_proc/991/fd/4
102362472879
```

Awesome. We found that pid 991 holds a reference to a ~102GB log file. That means that the file wasn't rotated properly and filled up the disk. But why is the file descriptor pointing to `/var/log`? we'll discuss that later.

## Fixing the issue

That's easy - Save the log & release the file descriptor by truncating it!

```console
$ docker run -t -i --privileged -v /proc:/host_proc \
                                -v /var/log:/host_log alpine sh
# inside the container...
$ cp /host_proc/991/fd/4 /host_log/docker.log-20170530

# this one truncates the file
$ : > /host_proc/991/fd/4
```

And voila!

```console
$ df -alh /var/lib/docker
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda3       227M  225G   99%   1% /var/lib/docker
```
Problem fixed. 

### Permanent fix

Why did the issue occur in the first place? We use docker's stock [JSON File logging driver](https://docs.docker.com/engine/admin/logging/json-file), which also rotates the files. Is that a bug?

It looks like our IT department messed up again, and set up *logrotate* in parallel to json logging:

```
$ cat /etc/logrotate.d/docker
/var/log/docker.log {
    rotate 2
    compress
    missingok
    notifempty
    size 100M
}
```

There was a race between docker's log rotation and *logrotate*. But still, that means files could've been rotated twice, but not deleted.

The problem? *logrotate* moved the old log file, instead of copying it and truncating the original. That caused the docker daemon to keep writing to a file descriptor that points to a file that doesn't exist anymore!

The fix? disable either *logrotate* or the stock logging driver.

We chose to disable the stock driver, but the problem wasn't fixed just yet - the daemon can still leak file descriptors. That's where *copytruncate* come in:

> Truncate the original log file to zero size in place after creating a copy, instead of moving the old log file and optionally creating a new one. It can be used when some program cannot be told to close its logfile and thus might continue writing (appending) to the previous log file forever. Note that there is a very small time slice between copying the file and truncating it, so some logging data might be lost. When this option is used, the create option will have no effect, as the old log file stays in place.

All we had to do is add a `copytruncate` line to our configuration and the issue was resolved. Tada!
