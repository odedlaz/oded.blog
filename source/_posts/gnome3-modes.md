title:  GNOME Shell Modes  
tags:
  - linux
  - gnome
permalink: gnome3-shell-modes 
categories:
  - devops
date: 2017-08-20 20:39:00
---

A few days ago I installed PulseSecure's client to gain access to the corporate VPN.  
For reasons comepletely unknown to me, these guys are stuck in the past, providing only a [32bit client](https://kb.pulsesecure.net/articles/Pulse_Secure_Article/KB40571) for linux. WTF.

Anyway, I got everything working with [Open Connect](http://www.infradead.org/openconnect/) so I could safely remove all 32bit dependencies I added to my system.

How? I ran `dpkg --remove-architecture i386 && apt-get purge ".*:i386"`. BIG. BIG MISTAKE.

**TL;DR**: many parts of the system broke, but I got everything up and running after an hour or so.

There were only two things that stayed broken:
1. The date/time clock, which is usually centered at the top bar, moved to the right.
2. I had a window list bar stuck at the bottom of the screen.

I couldn't find solutions to either. It seemed that everyone online were trying to move the clock to the right, not to the middle.  
Moreover, every time I tried to disable the [Window List](https://extensions.gnome.org/extension/25/window-list/) extension, it came back.

While trying to remove the extension, I found a small configuration file at `/usr/share/gnome-shell/modes` called `classic.json`, with the following content:
```json
{
    "parentMode": "user",
    "stylesheetName": "gnome-classic.css",
    "enabledExtensions": ["apps-menu@gnome-shell-extensions.gcampax.github.com",
                          "places-menu@gnome-shell-extensions.gcampax.github.com",
                          "alternate-tab@gnome-shell-extensions.gcampax.github.com",
                          "launch-new-instance@gnome-shell-extensions.gcampax.github.com",
                          "window-list@gnome-shell-extensions.gcampax.github.com"],
    "panel": { "left": ["activities", "appMenu"],
               "center": [],
               "right": ["a11y", "dateMenu", "keyboard", "aggregateMenu"]
             }
}
```

Neat! All I had to do is move the "dateMenu" item to center, and remove "window-list".

P.S: also answered on [askubuntu.com](https://askubuntu.com/questions/927663/move-clock-to-center-in-gnome-shell-3-24)
