title: My two cents on OpenPGP
tags:
  - pgp
id: 94
updated: '2017-03-13 22:19:02'
permalink: my-two-cents-on-openpgp
categories:
  - thoughts
  - infosec
date: 2017-03-09 18:05:00
---
**TL;DR** As of today, *March 10, 2017*, all my git commits will be cryptographically signed. I've also [configured GitHub to verify them](https://github.com/blog/2144-gpg-signature-verification). You can access them either from [Keybase](https://keybase.io/odedlaz) or on the blog's [Keys page](https://oded.ninja/crypto-keys/).

![](https://imgs.xkcd.com/comics/pgp.png)
 
If you want to know why I started to do so, read on.

<!-- more -->

### OpenPGP

[OpenPGP](http://openpgp.org) is a non-proprietary protocol for encrypting email communication using [public key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography). It is based on the original [PGP (Pretty Good Privacy)](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) software. The OpenPGP protocol defines standard formats for encrypted messages, signatures, and certificates for exchanging public keys.

As an IETF Proposed Standard [RFC 4880](https://tools.ietf.org/html/rfc4880), OpenPGP can be implemented by any company without paying any licensing fees to anyone. One of the most common implementations is [GnuPG](https://www.gnupg.org/).

#### GnuPG

[GnuPG](https://www.gnupg.org/) is a complete and free implementation of the [OpenPGP](http://openpgp.org) standard as defined by [RFC4880](https://tools.ietf.org/html/rfc4880) (also known as PGP). GnuPG allows to encrypt and sign your data and communication, features a versatile key management system as well as access modules for all kinds of public key directories. 

##### Versions

There are three version in the wild: *classic*, *stable* & *modern*. All versions implement the [OpenPGP]([OpenPGP](http://openpgp.org)) protocol, so it doesn't really matter which one you use to generate keys. 

**classic (1.4)** is the old, single binary version which may build even on ancient Unix platforms. It has no dependencies like the newer versions. However, it lacks many modern features.

**stable (2.0)** is the modularized version of GnuPG *classic*, supporting OpenPGP, S/MIME, and Secure Shell.

**modern (2.1)** is the brand new version with enhanced features like support for Elliptic Curve Cryptography. It will eventually replace the current *stable*.

#### Keybase

A public directory of publicly auditable public keys. All paired, for convenience, with unique usernames. [Keybase](https://keybase.io) is built upon the venerable and battle-hardened [GNU Privacy Guard](https://www.gnupg.org/).

Keybase allows users to easily encrypt, decrypt and share messages within a tried-and-tested encryption standard. Furthermore, all public keys are tied to user accounts on the Keybase websites, in addition to Twitter and Github accounts.

**!** If you've never heard about [Keybase](https://keybase.io/), go ahead and read [Playing with Keybase.io](http://nishanttotla.com/blog/playing-with-keybase-io/).

### Why sign my git commits?

A person with enough privileges can alter any git commit, including my own.
Also, It’s entirely possible that someone could compromised my account and commit malicious code on my behalf. I want to verify my work to avoid such incidents.

If you think that's an exaggeration, you should definitely read [Mike Gerwitz](https://mikegerwitz.com/)'s [Git Horror Story](https://mikegerwitz.com/papers/git-horror-story). For the impatient, here's the summary:

* [Be careful of who you trust](https://mikegerwitz.com/papers/git-horror-story#trust). Is your repository safe from harm/exploitation on your PC? What about the PCs of those whom you trust?
 * [Your host is not necessarily secure](https://mikegerwitz.com/papers/git-horror-story#trust-host). Be wary of using remotely hosted repositories as your primary hub.
* [Using GPG to sign your commits](https://mikegerwitz.com/papers/git-horror-story#trust-ensure) can help to assert your identity, helping to protect your reputation from impostors.

* For large merges, you must develop a security practice that works best for your particular project. Specifically, you may choose to [sign each individual commit](https://mikegerwitz.com/papers/git-horror-story#merge-3) introduced by the merge, [sign only the merge commit](https://mikegerwitz.com/papers/git-horror-story#merge-2), or [squash all commits](https://mikegerwitz.com/papers/git-horror-story#merge-1) and sign the resulting commit.
* If you have an existing repository, there is [little need to go rewriting history to mass-sign commits](https://mikegerwitz.com/papers/git-horror-story#commit-history).

* Once you have determined the security policy best for your project, you may [automate signature verification](https://mikegerwitz.com/papers/git-horror-story#automate) to ensure that no unauthorized commits sneak into your repository.

### How do I start?

Once you decide to sign your commits, go through the following:

* [Signing Git Commits & Tags with GPG2 and Verified on GitHub](https://w3guy.com/sign-git-commits-tags-gpg-github-verified/)
* [Submitting your GPG key to a keyserver](https://debian-administration.org/article/451/Submitting_your_GPG_key_to_a_keyserver)
* [On Keybase.io & Encrypted Private Key Uploading](https://blog.filippo.io/on-keybase-dot-io-and-encrypted-private-key-sharing/)

**!** Please don't upload your private key to [Keybase](https://keybase.io), ok?  
**!** Don 't forget to submit your key to a public key server: [OpenPGP](http://keys.gnupg.net/), [MIT](https://pgp.mit.edu/), [SKS](https://sks-keyservers.net/), etc.

If you really want to go the extra mile, consider buying a [YubiKey](https://www.yubico.com/) (I'm not there yet)
