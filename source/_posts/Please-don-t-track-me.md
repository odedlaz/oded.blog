title: 'Please, don''t track me.'
tags:
  - fingerprint
  - tor
id: 89
updated: '2017-02-28 19:40:18'
permalink: please-dont-track-me
categories:
  - thoughts
  - infosec
date: 2017-02-28 13:24:00
---
I recently gave a talk about the "Dark Web" at the [Technion](http://www.technion.ac.il/en). A big portion of the talk was dedicated to privacy / anonymity, and the forces who try to break it. During the talk, I was asked if one can be tracked when using [TOR](https://www.torproject.org/).

**TL;DR**: [fingerprintjs2](https://github.com/Valve/fingerprintjs2) easily breaks [TOR](https://www.torproject.org/) anonymity.

In this post I'll explain a bit about fingerprinting and how fingerprintjs2 was able to fingerprint me behind TOR. I'll also outline my own *do's and don'ts* when surfing the web.

<!-- more -->

#### Fingerprinting

Fingerprinting is a technique, outlined in a [research paper by the EFF](https://panopticlick.eff.org/static/browser-uniqueness.pdf), of anonymously identifying a web browser with accuracy of up to 94%.

A few days ago, a friend introduced me to [fingerprintjs2](https://github.com/Valve/fingerprintjs2), the successor of...wait for it...[fingerprintjs](https://github.com/Valve/fingerprintjs).

fingerprintjs2 utilizes many techniques to generate a unique hash of your browser. Currently, there are 26 unique sources, and [the list is growing](https://github.com/Valve/fingerprintjs2#list-of-fingerprinting-sources).

[According to it's creators](https://valve.github.io/blog/2013/07/14/anonymous-browser-fingerprinting/), during a test period of 4 months, 89% of fingerprints were unique, and 20% of their users had more than one fingerprint.

#### Breaking anonymity

I was curious how good fingerprintjs2 performs, and decided to take it for a test run.

First, I injected the following snippet to the blogs header:
```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/1.5.0/fingerprint2.min.js"></script>
<script>
    new Fingerprint2().get(function(result, components){
  console.log("fingerprintjs2 hash: %s", result);
});
</script>
``` 

Then I fire up [TOR Browser](https://www.torproject.org/projects/torbrowser.html.en) and checked the generated *fingerprintjs2* hash. 

Afterwards, I created a new Tor Circuit with a new exit node, then checked the hash. I ran that test 10 times, and every time it gave me the same result.

Even though the test was manual, and there were very few test cases, the results are still intriguing.

Takeaways? It might sound obvious, but disabling javascript would render this test useless. It would also make your surfing experience horrible. 

P.S: You probably wonder why Tor Browser doesn't disable JavaScript by default. [The answer is here](https://www.torproject.org/docs/faq.html.en#TBBJavaScriptEnabled).

#### What now?

You want to surf the web. Disabling JavaScript would make your surfing experience horrible, so disabling it is not an option.

So what can you do?

During my talk, I laid out my privacy *do's and don'ts* when surfing the web. Here's the gist of it:

* Try to avoid surfing in non-secured sites, and always use secured endpoints when available. [HTTPS Everywhere](https://www.eff.org/https-everywhere) can help with that.
* don't shop at non-secured websites & prefer paying with PayPal instead of entering your credit card information.
* Use a dedicated credit card when shopping online.
* Avoid sharing your Geo-Location. I use [Location Guard](https://github.com/chatziko/location-guard#location-guard).
* Use ad & tracker blockers such as [Ghostery](https://www.ghostery.com/) & [uBlock Origin](https://github.com/gorhill/uBlock)
* Use cookie-managers to prevent unwanted websites from tracking you. I use [Vanilla Cookie Manager](https://github.com/laktak/vanilla-chrome).
* Use different password for different websites. specifically, your e-mail, bank & PayPal accounts should have unique passwords.
* Consider using password managers like [KeePass](http://keepass.info/).
* Turn on 2-Step-Authentication where possible.

Do you have your own set of *do's and don'ts*? Tell me!
