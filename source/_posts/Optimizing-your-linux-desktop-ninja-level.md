title: Optimizing your linux desktop - ninja level
tags:
  - linux
  - productivity
id: 53
updated: '2017-03-07 20:13:16'
permalink: optimizing-your-linux-distro-ninja-level
categories:
  - devops
  - ''
date: 2016-10-30 21:11:00
---
I just got a shiny [Lenovo T450s](http://shop.lenovo.com/us/en/laptops/thinkpad/t-series/t450s/), installed [my favorite distro](https://ubuntugnome.org/) and started configuring it to squeeze every bit of battery life I can, while optimizing it to extend the SSD lifetime.

The following post describes different methods I used to do so.

<!-- more -->

## Benchmarks

Before carrying out these hacks, I suggest you benchmark your system.

[Phoronix Test Suite](http://www.phoronix-test-suite.com) is a good benchmarking tool.

## Disk Block Alignment

Legacy hard disks used 512 byte sectors. Partitions and logical volumes could potentially start on any sector boundary. Newer disks typically have block sizes larger than 512 bytes. For example, Advanced Format drives have a 4096 byte block size. If the offset of a partition is inconsistent with the underlying disk performance can suffer dramatically.

Follow these steps to check if your disk is aligned:

```lanaguage-bash
 # Replace sdX with your drive, for example: sda  
 $ sudo parted /dev/sdX print all  
 Number Start End Size Type File system Flags  
 1 1049kB 524MB 523MB primary ext4 boot  
 2 524MB 248GB 247GB primary ext4  
 3 248GB 256GB 8535MB primary linux-swap(v1)  
 # N is the partition number  
 $ sudo parted /dev/sdX align-check opt N  
 N is aligned  
```

if your partition is not aligned, you can follow [this lifehacker guide](https://lifehacker.com/5837769/make-sure-your-partitions-are-correctly-aligned-for-optimal-solid-state-drive-performance) to align your partitions.

Read more about disk alignment [here](https://wiki.debian.org/DiskBlockAlignment).

## Power Management

### TLP

[TLP](http://linrunner.de/en/tlp/tlp.html) brings you the benefits of advanced power management for Linux without the need to understand every technical detail. TLP comes with a default configuration already optimized for battery life, so you may just install and forget it.

Installation instructions can be found [here](http://linrunner.de/en/tlp/docs/tlp-linux-advanced-power-management.html#installation).

### PowerTOP

[PowerTOP](https://wiki.archlinux.org/index.php/powertop) is a tool that makes it easy to carry out power optimization tweaks on most Linux systems.  You can read more about its effectiveness [here](https://www.phoronix.com/scan.php?page=news_item&px=PowerTOP-2016-Try).

**!** PowerTOP doesn't monitor your system for changes, while TLP does. There's not need to use PowerTOP if you have TLP.

After you've installed PowerTOP, Edit `/etc/rc.local` and add the following before `exit 0`:

```bash 
 powertop -auto-tune  
```

If your distribution uses [systemd](https://en.wikipedia.org/wiki/Systemd), use the following unit:

```
[Unit]
Description=PowerTOP
Documentation=https://01.org/powertop

# If TLP is installed, uncomment the following line.
# Before=tlp.service

[Service]
Type=oneshot
ExecStart=/usr/sbin/powertop --auto-tune

[Install]
WantedBy=multi-user.target
```

## **Memory & Paging**

Moving data around means more writes. The more you write, the more you decrease the lifetime of your HDD. Here are a few hacks that can reduce disk I/O.

### **Optimize your swap**

[Swap](https://www.linux.com/news/all-about-linux-swap-space) is a [paging](https://en.wikipedia.org/wiki/Paging) mechanism which is used by linux and other OS's. Basically, it allows the operation system to consume more memory than is physically installed. It is a common misconception that a [swap partition](http://www.linuxjournal.com/article/10678) would somehow slow down your system. I suggest [reading more about Swap](http://blog.scoutapp.com/articles/2015/04/10/understanding-page-faults-and-memory-swap-in-outs-when-should-you-worry) before tweaking it.

#### Swappiness

Swappiness is a tunable that controls the relative weight given to swapping out runtime memory, as opposed to dropping pages from the system page cache. Swappiness can be set to values between 0 and 100 inclusive. A low value causes the kernel to avoid swapping, a higher value causes the kernel to try to use swap space. The default value in most distributions is 60 [read [this](https://unix.stackexchange.com/questions/88693/why-is-swappiness-set-to-60-by-default) to understand why]

if you have <span style="text-decoration:underline;">a lot of RAM</span>, I suggest using zswap or zram to reduce swapping to disk, and to tune swappiness to your needs. Another option is to turn off swap completely.

Linux Swap FAQ [suggests tuning swappiness to 10](https://help.ubuntu.com/community/SwapFaq#What_is_swappiness_and_how_do_I_change_it.3F), but you should really [read this](http://archive.ec/uARlz) before you tweak it.

Follow these steps to change swappiness to `10`:

```bash
 $ echo "vm.swappiness = 10" | sudo tee -a /etc/sysctl.d/10-swap.conf  
```

Follow these steps to turn of swap:

```bash  
 $ sudo swapoff -a  
 # Now edit /etc/fstab and comment out the swap partition  
 $ sudo reboot  
```

### Disable OOM Killer Full Scan on Out of Memory

Linux has a mechanism that protects the OS when both RAM and Swap are exhausted - called **OOM Killer** (Out Of Memory Killer).

*OOM Killer* is triggered when *vm.panic_on_oom* is set to `0`. The default value for the *vm.oom_kill_allocating_task* flag is `0`, which means the *OOM Killer* will perform a full memory scans to find the best task to kill.  

This is costly, and in many cases the system doesn't have enough resources to perform a full scan - which means it won't do anything. if *vm.oom_kill_allocating_task* is set to `1`, it will kill the task that caused out of memory. You can read more about these flags and others in the `/sys/proc/vm` [documentation page](https://www.kernel.org/doc/Documentation/sysctl/vm.txt).

Follow these steps to change** OOM Killer **parameters:

```bash 
 # make sure the computer doesn't panic on out of memory  
 $ echo "vm.panic_on_oom = 0" | sudo tee -a /etc/sysctl.d/10-oom.conf  
 # change oom_killer behavior to kill the task that caused the out of memory  
 $ echo "vm.oom_kill_allocating_task = 1" | sudo tee -a /etc/sysctl.d/10-oom.conf  
```

#### Taming the OOM killer

One of the problems associated with the *OOM Killer* is that it might kill a process that shouldn't be killed. For instance, you probably don't want the *OOM Killer* to kill you ssh daemon!

An article called [Taming the OOM Killer](https://lwn.net/Articles/317814/) explains how to hint the *OOM Killer* to avoid killing specific processes. For instance:
```bash 
$ echo "-17" > /proc/`cat /var/run/sshd.pid`/oom_adj  
```

### Compressing paging candidates

A few interesting paging optimizations started appearing in the last few years. The most noticeable are [zram](https://en.wikipedia.org/wiki/Zram) and [zswap](https://en.wikipedia.org/wiki/Zswap). Both serve the same purpose - instead of paging data, they compress it and save it back to RAM. When the RAM is exhausted, the data is swapped to disk.

This is a VERY interesting concept that can drastically improve your systems performance, because decompressing data takes less time than loading data from disk.

If you have a swap partition, I'd pick  zswap, otherwise - choose zram. The reason is that zswap performs better in choosing which pages to swap. Read [this post](https://askubuntu.com/questions/471912/zram-vs-zswap-vs-zcache-ultimate-guide-when-to-use-which-one) to understand more.

Follow these steps to turn on zswap:

```bash  
$ sudo vi /etc/default/grub  
# add zswap.enabled=1 to GRUB_CMDLINE_LINUX  
# after the change it should look similar to:  
# GRUB_CMDLINE_LINUX="zswap.enabled=1"  
$ sudo update-grub  
$ sudo reboot  
# after reboot, grep for zswap. you should get the following output  
$ dmesg | grep "zswap: loaded"  
[ 1.996141] zswap: loaded using pool lzo/zbud  
```

Follow these steps to turn on zram (on ubuntu):

```bash   
$ sudo apt-get install zram-config  
$ reboot  
# after reboot  
$ cat /proc/swaps  
Filename Type Size Used Priority  
/dev/zram0 partition 1499588 0 5  
/dev/zram1 partition 1499588 0 5  
/dev/zram2 partition 1499588 0 5  
/dev/zram3 partition 1499588 0 5  
```

make sure you [read the docs](https://www.kernel.org/doc/Documentation/blockdev/zram.txt) to configure zram correctly.

You can stress test your system to see paging in action -

Open one terminal and type:

```bash   
# if 15% of ram is allocated zram, the following stress test checks that
$ stress --vm-keep -m 1 --vm-bytes $(awk '/MemFree/{printf "%d\
", $2 * 1.15;}' > /proc/meminfo)
stress: info: [11211] dispatching hogs: 0 cpu, 0 io, 1 vm, 0 hdd
```

Open a second terminal and type:

```bash
$ watch -n 1 free -m  
```

Open a third terminal and type:

```bash  
$ watch -n 1 cat /proc/swaps  
```

### **Mounting directories on tmpfs**

[tmpfs](https://en.wikipedia.org/wiki/Tmpfs) is a memory-mapped filesystem. Once mounted, every file written to it is stored on RAM. When the partition overflows, the extra data is paged.

Mounting a directory on tmpfs has two big upsides:

- It removes redundant I/O from the HDD
- It boosts performance for file access

Follow these steps to mount `DIR` on tmpfs:

```bash
$ echo "tmpfs DIR tmpfs rw,nosuid,nodev" | sudo tee -a /etc/fstab  
$ sudo reboot  
```

#### Mounting `/tmp` on tmpfs

`/tmp` is a directory that applications use for temporary data, and it's considered a best practice to mount it on tmpfs.

You can read more about tmps and mounting `/tmp` on it [here](https://insights.ubuntu.com/2016/01/20/data-driven-analysis-tmp-on-tmpfs).

! do not mistake `/tmp` and `/var/tmp`, the latter is used for __persistent__ temporary storage and should not be mounted on tmpfs.

! you can consider adding the *noexec* flag to `/tmp` to harden your systems security. read more [here](https://debian-administration.org/article/57/Making_/tmp_non-executable).

**Mounting /var/log on tmpfs**

`/var/log` is a directory that applications used to store logs. If you run a server, it would probably be a bad idea to mount it on tmpfs, because all the logs would get lost between reboots. But, for ordinary day-to-day usage, mounting `/var/log` would reduce I/O for logs you don't use anyway.

To mount `/var/log` on tmpfs, you'll need to add it to *fstab*, __and__ create all necessary directories on boot. Some applications don't behave as expected (like [CUPS](https://en.wikipedia.org/wiki/CUPS))  if their directories are missing from `/var/log`.

**!** Mounting `/var/log` on tmpfs is a problematic practice, because once a problem occurs and your system crashes, you can't trace back the problem.

Edit `/etc/rc.local` (in debian) and add the following before *exit 0*:

```bash  
# Restore tmpfs directories for logs.  
# Extend the following directories to your needs according to installed packages  
for dir in apparmor apt cups dist-upgrade fsck gdm3 hp installer speech-dispatcher samba unattended-upgrades ;
do  
   if [ ! -e /var/log/$dir ] ; then  
      mkdir /var/log/$dir  
   fi  
done

# Restore syslog files  
for file in debug mail.err mail.log mail.warn syslog ; do
   if [ ! -f /var/log/$file ] ; then  
      touch /var/log/$file  
      chown syslog:adm /var/log/$file  
   fi  
done

# Set owners for the newly created log directories  
chown root:adm /var/log/samba  
chown root:lp /var/log/cups  
chown root:gdm /var/log/gdm3  
```

you can read more about mounting `/var/log` on it [here](https://askubuntu.com/questions/592589/no-var-log-syslog-file-after-moving-var-log-to-tmpfs).

### **Mount browser cache on tmpfs**

Once you have ***/tmp*** mounted on tmpfs, you might consider moving your browser cache to ***/tmp***. Browsers write many temporary files that aren't used once the browser shuts down, so moving these files to a volatile storage can boost performance and reduce HDD I/O.

#### **Google Chrome**

Google Chrome has a command line argument called **disk-cache-dir**  
 You can use it to specify a directory to use as a cache:

```bash
$ mkdir -p /tmp/google-chrome-cache  
$ chmod -R 777 /tmp/google-chrome-cache  
# edit /usr/share/applications/google-chrome.desktop  
$ sed -i €” €˜s/%U/-disk-cache-dir="\/tmp\/google-chrome-cache" %U/g' \  
/usr/share/applications/google-chrome.desktop  
$ sudo reboot # you can also just restart the shell  
```

Read more [here](http://www.insanitybit.com/2012/09/25/move-chromes-cache-to-ram-guide-for-linux-users).

#### **Mozilla Firefox**

Mozilla Firefox can be configured to change the disk cache through its configuration page - **about:config**.

1. Open up Firefox and enter **about:config** in the address bar
2. Type **browser.cache.disk.enable** and set it to **true**
3. Type **browser.cache.disk.parent_directory** and set it to  ***/tmp/firefox-cache***
4. Type **browser.cache.memory.enable** and set it to **true**
5. Right click -> New -> String
6. Enter **browser.cache.memory.capacity **as preference name
7. Enter **-1** as the value

Read more [here](https://lifehacker.com/5687850/speed-up-firefox-by-moving-your-cache-to-ram-no-ram-disk-required).


## Optimizing the filesystem table

**[/etc/fstab](https://en.wikipedia.org/wiki/Fstab)** is a file that's in charge of partition mounting configuration.  
 There are several configurations that you should add to ***fstab*** that increase the HDD performance:

- **noatime** - Linux saves the last access time for each file and directory, which causes significant I/O. Turning it off can improve performance, but might have a negative impact on processes that rely on this timestamp. Read more [here](http://tldp.org/LDP/solrhe/Securing-Optimizing-Linux-RH-Edition-v1.3/chap6sec73.html).
- **nodiratime** - a subset of **noatime**, only for directories. [This is redundant](https://lwn.net/Articles/245002/) if **noatime** is set.
- **lazytime** - atime is too expensive, noatime is probelmatic and relatime has its own drawbacks. lazytime tries to be the best of all worlds - it writes the last accessed timestamp, but only when there's a reason to do so. **I HIGHLY RECOMMEND** turning on [lazytime](https://lwn.net/Articles/621046/) instead of the previous flags.
- **commit=N** - Linux caches writes and flushes them to disk every x seconds. This means that if your computer crashes, the last N seconds of data is lost. You can change this number to reduce I/O. read more [here](https://unix.stackexchange.com/questions/155784/advantages-disadvantages-of-increasing-commit-in-fstab).
- **discard** - A flag to turn on continuous [TRIM](https://en.wikipedia.org/wiki/Trim_(computing)). while continuous TRIM is not recommended, periodic TRIM is. read more [here](https://wiki.archlinux.org/index.php/Solid_State_Drives#TRIM).
- **barrier=0** - Most file systems send write barriers to disk after fsync or during transaction commits. Write barriers enforce proper ordering of writes, making volatile disk write caches safe to use (at some performance penalty). If your **<span style="text-decoration:underline;">disks are battery-backed</span>** in one way or another (UPS and Laptops don't battery back the HDD), disabling barriers may safely improve performance. otherwise, <span style="text-decoration:underline;">**do not use this option**!</span>**.** ***barrier=0*** mount option is compatible with **ext3**, **ext4**, and **reiserfs**. Further reading about write barriers in the [ArchWiki](https://wiki.archlinux.org/index.php/Ext4#Barriers_and_performance), and [StackExchange](https://unix.stackexchange.com/questions/37696/is-disabling-barriers-for-ext4-safe-on-a-laptop-with-battery).


## Switching IO Schedulers

The default I/O scheduler queues data to minimize seeks on HDDs, which is not necessary for SSDs. Thus, use the *deadline* scheduler that just ensures bulk transactions won't slow down small transactions.

The dumb *noop* scheduler may be a little faster in benchmarks that max out the throughput, but this scheduler causes noticeable delays for other tasks while large file transfers are in progress.

anyhow, picking a scheduler is a hot topic, and if you don't understand the implications of choosing one scheduler over another, I'd choose **deadline**. mainly because that's what [debian recommends](https://wiki.debian.org/SSDOptimization#Low-Latency_IO-Scheduler).

Edit `/etc/rc.local` and add the following lines before *exit 0*:

```python
# X is the drive you use (sda, sdb€¦)  
$ echo "deadline" > /sys/block/sdX/queue/scheduler  
$ echo "1" > /sys/block/sdX/queue/iosched/fifo_batch  
```

If you're interested in this topic, read more [here](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/tree/Documentation/block/switching-sched.txt?id=HEAD) and [here](https://blog.pgaddict.com/posts/postgresql-io-schedulers-cfq-noop-deadline).


## Hardware Video Acceleration

[VA-API (by Intel)](https://en.wikipedia.org/wiki/Video_Acceleration_API) and [VDPAU](https://en.wikipedia.org/wiki/VDPAU) are API's that give access to hardware video acceleration.  
 They can dramatically reduce the CPU usage when playing HD videos.

You'll need to install VA-API and VDPAU drivers for your GPU, then enable it on your favorite video player.

### VideoLAN media player

VLC supports VA-API and VDPAU out of the box.  
 You'll need to configure it, read more [here](https://wiki.videolan.org/VLC_GPU_Decoding/).

### Google Chrome

1. Open Google Chrome and type **chrome://flags** in the address: - **Override software rendering list** - Enable
- **GPU rasterization** - Enabled
- **GPU rasterization MSAA sample count** - 2
- **Zero-copy rasterizer** - Enable
- **Number of raster threads** - run ***nproc***** **in your shell and set the output number
- **Display list 2D canvas** - Enabled
- **LCD text antialiasing** - Enabled
- **Fast tab/window close** - Enabled
2. Add `--enable-native-gpu-memory-buffers` to the chrome shortcut at `/usr/share/applications/google-chrome.desktop`.
3. Install **h264ify** chrome extension. follow [these](https://github.com/erkserkserks/h264ify) instructions.

**!** if you're using chromium, you might want to use [customizations](http://askubuntu.com/a/832595).

# comments are highly appreciated!