title: Everything that is wrong with sudo, and how I'm planning to fix it
tags:
  - c++
  - project
permalink: doas-linux
categories:
  - programming
date: 2017-10-21 00:37:00
---

what i did?


fedora said you can't:
https://slack-redir.net/link?url=https%3A%2F%2Fdocs.fedoraproject.org%2Ff26%2Finstall-guide%2Finstall%2FBooting_the_Installation.html

well, I don't think so.


create a livecd

change to uefi only mode in bios

boot livecd

open terminal, install gparted, gdisk.
use gparted to convert to gpt.
use gpated 
creat a 10 gb empty slot in the beginning
create 100 mb slot in the end

install another fedora instance as uefi. .add uefi aprtition of 1 gb at the
 beginning.

 this will save you a lot of time IMO, because EFI will be installed correctly.

   then chroot: 
   mount /dev/real-fedora /mnt/real-fedora
   mount /dev/efi-thing /mnt/real-fedora/boot/efi
# mount -t proc proc proc/
# mount --rbind /sys sys/
# mount --rbind /dev dev/

run:

grep "/boot/efi" /etc/fstab >> >> /mnt/real-fedora/etc/fstab

then chroot:

chroot /mnt/real-fedora /bin/bash


now, edit fstab and make sure it looks ok.
remove old /boot if it exists.

now run:


dnf reinstall grub2-efi grub2-efi-modules shim
sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg

I ran these steps and grbu2-mkconfig failed because I was already mounted.
Instead, I re-rean it from the host ->
sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg

now, I restarted my pc, opened up the real fedora, removed the partition of the
"new fedora", resized the partitions and re-ran grub2-mkconfig. done.
