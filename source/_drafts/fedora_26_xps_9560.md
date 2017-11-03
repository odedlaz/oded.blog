title: Everything that is wrong with sudo, and how I'm planning to fix it
tags:
  - c++
  - project
permalink: doas-linux
categories:
  - programming
date: 2017-10-21 00:37:00
---

https://amp-reddit-com.cdn.ampproject.org/c/s/amp.reddit.com/r/Dell/comments/5y3rii/xps_9560_battery_life_optimization_and_fan/

https://www.if-not-true-then-false.com/2015/fedora-nvidia-guide/#nvidia-install

### Replace NVIDIA with 

#### Blacklist nouveau driver

Append ‘blacklist nouveau’

```bash
echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf
```

Append `rd.driver.blacklist=nouveau i915.modeset=1` to end of `GRUB_CMDLINE_LINUX="..."`
```bash
## Example row ##
GRUB_CMDLINE_LINUX="rd.lvm.lv=fedora/swap rd.lvm.lv=fedora/root rhgb quiet rd.driver.blacklist=nouveau i915.modeset=1"
```

Update grub2
```bash
## BIOS ##
grub2-mkconfig -o /boot/grub2/grub.cfg

## UEFI ##
grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
```
Remove xorg-x11-drv-nouveua
```bash
dnf remove xorg-x11-drv-nouveau
```

Install xorg-x11-drv-intel:
```bash
dnf install xorg-x11-drv-intel
```

If you have following row on /etc/dnf/dnf.conf file, then you can remove it:
```bash
exclude=xorg-x11*
```

Generate initramfs
```bash
## Backup old initramfs nouveau image ##
mv /boot/initramfs-$(uname -r).img /boot/initramfs-$(uname -r)-nouveau.img
 
## Create new initramfs image ##
dracut /boot/initramfs-$(uname -r).img $(uname -r)
```

disable 
cmdline
```
GRUB_CMDLINE_LINUX= ... rd.driver.blacklist=nouveau i915.modeset=1

$ echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf

```

install this shit
```bash
$ dnf install http://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-stable.noarch.rpm
$ dnf install dnf install http://repo.linrunner.de/fedora/tlp/repos/releases/tlp-release.fc26.noarch.rpm
$ dnf install tlp tlp-rdw akmod-tp_smapi akmod-acpi_call kernel-devel
$ systemctl enable tlp
```

```bash
#!/bin/bash

if ! lsmod | grep -q acpi_call; then
	echo "The acpi_call module is not loaded, try running 'modprobe acpi_call' or 'insmod acpi_call.ko' as root"
    exit 1
fi

methods="
\_SB.PCI0.P0P1.VGA._OFF
\_SB.PCI0.P0P2.VGA._OFF
\_SB_.PCI0.OVGA.ATPX
\_SB_.PCI0.OVGA.XTPX
\_SB.PCI0.P0P3.PEGP._OFF
\_SB.PCI0.P0P2.PEGP._OFF
\_SB.PCI0.P0P1.PEGP._OFF
\_SB.PCI0.MXR0.MXM0._OFF
\_SB.PCI0.PEG1.GFX0._OFF
\_SB.PCI0.PEG0.GFX0.DOFF
\_SB.PCI0.PEG1.GFX0.DOFF
\_SB.PCI0.PEG0.PEGP._OFF
\_SB.PCI0.XVR0.Z01I.DGOF
\_SB.PCI0.PEGR.GFX0._OFF
\_SB.PCI0.PEG.VID._OFF
\_SB.PCI0.PEG0.VID._OFF
\_SB.PCI0.P0P2.DGPU._OFF
\_SB.PCI0.P0P4.DGPU.DOFF
\_SB.PCI0.IXVE.IGPU.DGOF
\_SB.PCI0.RP00.VGA._PS3
\_SB.PCI0.RP00.VGA.P3MO
\_SB.PCI0.GFX0.DSM._T_0
\_SB.PCI0.LPC.EC.PUBS._OFF
\_SB.PCI0.P0P2.NVID._OFF
\_SB.PCI0.P0P2.VGA.PX02
\_SB_.PCI0.PEGP.DGFX._OFF
\_SB_.PCI0.VGA.PX02
\_SB.PCI0.PEG0.PEGP.SGOF
\_SB.PCI0.AGP.VGA.PX02
"

for m in $methods; do
    echo $m > /proc/acpi/call
    result=$(cat /proc/acpi/call | tr '\0' ' ')
    case "$result" in
        Error*)
        ;;
        *)
            echo "$m"
            exit 0
        ;;
    esac
done
```
To automate on startup, do the following as root:
```bash
echo acpi_call > /etc/modules-load.d/acpi_call.conf
```


Create a systemd service that turns of the nvidia gpu:

```bash
$ systemctl edit --full --force dgpu-off.service
```

Copy the following content:


```bash
[Unit]
Description=Power-off dGPU
After=graphical.target

[Service]
Type=oneshot
ExecStart=/bin/sh -c "echo '\\_SB.PCI0.PEG0.PEGP._OFF' > /proc/acpi/call; cat /proc/acpi/call > /tmp/nvidia-off"

[Install]
WantedBy=graphical.target
```

then enable it
```bash
systemctl enable /usr/lib/systemd/user/dgpu-off.service
```