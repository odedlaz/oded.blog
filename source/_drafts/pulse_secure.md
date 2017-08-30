A few weeks ago I joined Cybereasson, and one of the first things I did was to setup vpn access to the company's network.

Cybereason, like many others, uses PulseSecure to achieve the above.

Installation on Debian/RHEL based disto's is pretty straight forward:
1. You [sign up](https://www.pulsesecure.net/trynow/client-download/) to download their client software
2. You get an email with download links
3. You download the *.deb* or *.rpm* package and install it.
4. You press the PulseSecure icon and you're good to go.

At least that's what I thought. Steps 1-3 went as expected.
Step 4... no so much -> I fired up PulseSecure from GNOME, but nothing happened.

This post explains the steps I took to figure out why PulseSecure didn't work, and fix that.

<!-- more -->

First, I extracted PulseSecure's run command using [Alacarte, a menu editor for GNOME](https://en.wikipedia.org/wiki/Alacarte):
```
/usr/bin/env LD_LIBRARY_PATH=/usr/local/pulse:$LD_LIBRARY_PATH /usr/local/pulse/pulseUi
```

Then I opened up the terminal and ran it:

```bash
$ /usr/bin/env LD_LIBRARY_PATH=/usr/local/pulse:$LD_LIBRARY_PATH /usr/local/pulse/pulseUi
/usr/local/pulse/pulseUi: error while loading shared libraries: libwebkitgtk-1.0.so.0: cannot open shared object file: No such file or directory
```

Ok, there's an unmet dependency. Let's install it:
```bash
$ apt search libwebkitgtk-1.0
Sorting... Done
Full Text Search... Done
libwebkitgtk-1.0-0/zesty,now 2.4.11-3 amd64 [installed]
  Web content engine library for GTK+
```

That's weird, `apt` says it's already installed -

```
$ locate libwebkitgtk-1.0.so
/usr/lib/x86_64-linux-gnu/libwebkitgtk-1.0.so.0
/usr/lib/x86_64-linux-gnu/libwebkitgtk-1.0.so.0.22.17
```


$ /usr/bin/env LD_LIBRARY_PATH=/usr/local/pulse:/usr/lib/x86-64-linux-gnu/$LD_LIBRARY_PATH /usr/local/pulse/pulseUi
/usr/local/pulse/pulseUi: error while loading shared libraries: libwebkitgtk-1.0.so.0: wrong ELF class: ELFCLASS64

$ file /usr/local/pulse/pulseUi
pulseUi: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.18, BuildID[sha1]=2ae1cc5e8b7621956e1a8aee014705c316766d79, not stripped
/usr/bin/env LD_LIBRARY_PATH=/usr/local/pulse:$LD_LIBRARY_PATH /usr/local/pulse/pulseUi

$ sudo dpkg --add-architecture i386 && sudo apt update

$ sudo apt install libwebkitgtk-1.0:i386

(pulseUi:31977): Gtk-WARNING **: Unable to locate theme engine in module_path: "adwaita"

https://askubuntu.com/questions/774664/gtk-warning-unable-to-locate-theme-engine-in-module-path-adwaita-error-o

(pulseUi:31977): Gtk-WARNING **: Unable to locate theme engine in module_path: "pixmap"

(pulseUi:31977): Gtk-WARNING **: Unable to locate theme engine in module_path: "murrine"

Gtk-Message: Failed to load module "canberra-gtk-module"

apt install \
   lib32z1 \
   libc6-i386 \
   libdconf1:i386 \
   libgnome-keyring0:i386 \
   libdconf1:i386 \
   libproxy1-plugin-webkit:i386 \
   libproxy1-plugin-gsettings:i386 \
   gnome-themes-standard:i386 \
   gtk2-engines-murrine:i386 \
   gtk2-engines-pixbuf:i386 \
   libcanberra-gtk-module:i386 \
   libwebkitgtk-1.0:i386 \
   dconf-gsettings-backend:i386 \
   libgnome-keyring0:i386 \
   libwebkitgtk-1.0-0:i386
