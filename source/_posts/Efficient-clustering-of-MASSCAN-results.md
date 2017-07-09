title: Efficient clustering of MASSCAN results
tags:
  - python
  - bash
  - project
id: 67
updated: '2017-03-07 19:36:36'
permalink: efficient-clustering-of-masscan-results
categories:
  - programming
date: 2016-12-27 13:41:00
---


[MASSCAN](https://github.com/robertdavidgraham/masscan) is an incredibly fast [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) port scanner, that with the right equipment, can scan the entire Internet in under five  minutes.

MASSCAN does a wonderful job at scanning the entire internet randomly, but it doesn't cluster its results by port, which is a feature I need.

**TL;DR**: I wrote [MASSCAN-Cluster](https://github.com/odedlaz/masscan-cluster) to classify the results efficiently.


## Motivation

When scanning multiple ports, MASSCAN dumps all the data into one file. It can also rotate the output file by time or size. In order to efficiently process results and extract banners, I need to classify each results by port.

The naive approach would be to read each result file, classify,  and run the proper banner extraction / [DPI](https://en.wikipedia.org/wiki/Deep_packet_inspection) algorithm.

My approach is to classify the results on the fly, to avoid unnecessary  I/O and waste of CPU cycles.


## How does it work?

1. Configures MASSCAN to write all its output to one output file.
2. Creates a [named pipe](https://en.wikipedia.org/wiki/Named_pipe) as MASSCAN's output-file.
3. Runs MASSCAN & a script that feeds of the named pipe, classifies the results by port and rotates them.
