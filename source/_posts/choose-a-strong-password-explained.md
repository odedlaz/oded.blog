title: choose a strong password (explained)
tags: []
id: 43
updated: '2017-03-07 20:15:11'
permalink: choose-a-strong-password-explained
categories:
  - thoughts
  - infosec
date: 2014-08-05 12:52:00
---


The media is packed with articles about hackers that got access to pc's because they had weak passwords. It seems these problems are huge, most people use Password[0-9] as their password. really smart people even use `P@$$w0rd[0-9]`:

-  [This article](http://www.bu.edu/infosec/howtos/how-to-choose-a-password/) will explain how to choose a good password.
- I use [Password Chameleon](https://www.passwordchameleon.com/) as my chrome "password manager" (the password is a hash of a website's domain and a password. so every site gets a different hash, which makes it a very good solution IMO)
- Try to crack your own password to see if it's weak. use[ john the ripper](http://www.openwall.com/john/) to do this: [installation instructions](http://www.breakthesecurity.com/2011/08/how-to-install-john-ripper-in-ubuntu.html), [how to use](http://www.cyberciti.biz/faq/unix-linux-password-cracking-john-the-ripper/), [compiling error I had to deal with](http://www.question-defense.com/2013/09/02/jtr-john-the-ripper-compile-error-sha-h425-fatal-error-opensslsha-h-no-such-file-or-directory).
- Understand [/etc/passwd ](http://www.cyberciti.biz/faq/understanding-etcpasswd-file-format/)and [/etc/shadow](http://www.cyberciti.biz/faq/understanding-etcshadow-file/).


