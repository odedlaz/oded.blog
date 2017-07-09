title: 1st place @ HackIDC 2017
tags:
  - hackathon
id: 108
updated: '2017-05-06 10:15:52'
permalink: 1st-place-hackidc
categories:
  - general
  - ''
date: 2017-04-29 06:52:00
---

![](/images/2017/04/hackidc_2017_logo.png)

Yesterday, after 24 hours of hard work, zero sleep & a lot of fun, We won first place at [HackIDC](https://2017.hackidc.com/)!

![](/images/2017/04/hackidc_team.jpg)[The team by order of appearance: [Carmel Rabinovitz](https://www.linkedin.com/in/carmel-rabinovitz/), [Nadav Eliyahu](https://www.linkedin.com/in/nadav-eliyahu-b2b892125/), [Amir Livne](https://www.linkedin.com/in/amirlivne/), [Inbal Ben Yehuda](https://www.linkedin.com/in/inbal-ben-yehuda-08a248a2/) & [Me](https://www.linkedin.com/in/odedlaz/)]


### What is HackIDC

[HackIDC](https://2017.hackidc.com/) is Israel’s leading student [Hackathon](https://en.wikipedia.org/wiki/Hackathon), held annually at [IDC Herzliya](https://www.idc.ac.il/en). It is a great opportunity to build something new and exciting, together with coding and design enthusiasts. Students work in teams of up to five people for 24 hours to create a web, mobile, or hardware product.

### What we did 

Our team crafted a smart bracelet for conferences that swaps contact details between participants using a regular handshake. The match is done by monitoring acceleration data gathered from the bracelet's [Red Amber](http://gemsense.cool/#anc-prod) chip, and processing it in real-time by a learning algorithm that we developed. 

The data that we collected could help conference organizers gain tremendous knowledge about the participants, and that's only the beginning. We're planning on continuing the project by adding more insightful features.

**!** All the sensor related tools were written in C++, MatLab helped us make sense of them. The data crunching part was written in python, and the website using [WiX](https://www.wix.com/).

![](/images/2017/04/bracelet_prototype.jpg)[The prototype we used during development]

### Electra Challenge

![](/images/2017/04/electra_logo.jpg)

HackIDC introduced a new "Challenge" section this year. Some of the sponsors had their own challenges for the teams: [Bank Leumi](https://www.leumi.co.il/), [Murata](http://www.murata.com/) & [Electra](http://www.electra.co.il/).

We decided to participate in Electra's challenge in parallel to our "main" solution - hook into an air conditioner unit to provide alerts to operation teams when interesting events occur:

* A unit installation failed
* Compressor gas had reached a critical point

We extracted all the sensor data straight from the unit, sent it to a server at the backend that crunched it, and raised alerts when they matched a pattern.

**!** The entire project was written in python. The frontend used flask, bootstrap and JS.

![](/images/2017/04/electra_challenge.png)[The website showed real alerts raised by the data that was simulated by Electra's air condition unit]

