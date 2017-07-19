title: processing queued netfilter packets with scapy
tags:
  - python
  - networking
  - ''
  - ''
id: 37
updated: '2017-03-05 15:46:11'
permalink: processing-queued-netfilter-packets-with-scapy
categories:
  - programming
date: 2014-07-28 15:22:00
---


I found myself in need of writing something that filters packets according to their payload,and it had to be fast.

[I wrote a netfilter module](http://www.paulkiddie.com/2009/11/creating-a-netfilter-kernel-module-which-filters-udp-packets/) that filtered the data so it'll meet my performance needs, but I was curious if it's possible to hook nfq to scapy.

A quick query and [I found someone who already did it!](http://5d4a.wordpress.com/2011/08/25/having-fun-with-nfqueue-and-scapy/) cool right? 
 
 You can write an iptables rule that redirects packets to a specific queue and process it with scapy!

by the way, did you know that [iptables](https://netfilter.org/projects/iptables/) is being replaced by the superior [nftables](https://netfilter.org/projects/nftables/)?
