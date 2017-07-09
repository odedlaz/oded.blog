title: Password for every occasion
tags:
  - project
  - python
id: 56
updated: '2017-03-07 20:05:55'
permalink: password-for-every-occasion
categories:
  - thoughts
  - infosec
  - ''
date: 2016-11-17 08:35:00
---


Every geek talks about how strong his passwords are, how he\she read this and that article that talks about strong password generation, and why strong passwords are important.

I'll tell you what the problem is, geek to geek, I believe in strong passwords, but I honestly don't remember them!

Of course I can use password managers like [Keepass](http://keepass.info/), [LastPass](http://lastpass.com), [SplashID](https://www.splashid.com/), or any other, but I find this approach problematic:

- **THERE'S A FILE THAT STORES MY NON-HASHED PASSWORDS**. That's insane!
- Furthermore, I need a way to access all these passwords on the go, so I would probably use a cloud provider, which means that **THERE'S A CLOUD THAT STORES MY NON-HASHED PASSWORDS.** That's really insane!

I hope you get my point. The solution? [Password Chameleon](http://passwordchameleon.com).

Password Chameleon handles this issue in a really simple and clever way:

1. <span style="text-decoration:underline;">Remember</span> one master password - <span style="text-decoration:underline;">never save it anywhere.</span>
2. Surf to some random website
3. Enter your master password & The domain name of the website
4. Password Chameleon will generate a strong password out of both

This solution is awesome - one password that generates different, unique password for each website I surf to.

Now that I got you on board, I think you should subscribe to [Have i been pwned?](https://haveibeenpwned.com/), and If you believe in it like I do, please [donate](https://haveibeenpwned.com/Donate).

By the way, If you want a command line version of Password Chameleon, I've taken the liberty [to port it to python](https://gist.github.com/odedlaz/2f590e3c870fb941370179526804237b).


