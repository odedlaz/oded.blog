title: >-
  Accidentally destroyed production database on first day of a job, how screwed
  am I?
tags: []
id: 126
updated: '2017-06-06 13:36:39'
permalink: destroy-db-rant
categories:
  - thoughts
  - general
date: 2017-06-03 16:57:00
---
I just read a post on reddit titled: *"[Accidentally destroyed production database on first day of a job, and was told to leave, on top of this I was told by the CTO that they need to get legal involved, how screwed am I?](https://np.reddit.com/r/cscareerquestions/comments/6ez8ag/accidentally_destroyed_production_database_on/)"*

![](/images/2017/06/stress.jpg)

## TL;DR

- Guy get a document detailing how to setup a local development environment.
- Guy sets up a development database
- Guy runs a tool that performs tests on the application. accidentally, pointed the tool against the production database.
 - The credentials for the production database were in the development document
 - The tool clears the database between tests
- Guy gets fired

I'm completely pissed! The guy made *an honest mistake* that can happen to anyone, and gets fired!

<!-- more -->

## Thoughts

The guy to blame is the CTO. Why? here's partial list of my thoughts:

1. There document should have never had the production password in it.
2. Actually, there shouldn't be "a production" password in the first place.
3. Developers shouldn't have write privileges for production databases. Only read privileges. Only ops and/or a certain subset of the team should have write privileges.
5. You should ALWAYS have TESTED backups.
6. You should always be prepared for a "total fuck up" and be able to recover quickly.


I can keep going, but the point is that **the company's CTO "fucked up"** - not just because He failed technically, but also because **He created an environment that kills innovation**.

## What the CTO should've done

He should have rolled back the database, then assemble key personnel that would investigate the issue and figure out why it happened.

Then, He should have told the guy that "shit happens" and that he expects him to be more careful next time.

Also, I would've appreciated a company-wide email or a public blog post that details what exactly happened, joke about the mistake the new guy did and clarify that they're job is to make sure such incidents don't happen again.

Here's a few examples of companies that "fucked up" miserably, and handled them gracefully:

- A few months ago someone at GitLab *completely fucked up* and made them lose six hours of database data ([GitLab.com Database Incident](https://about.gitlab.com/2017/02/01/gitlab-dot-com-database-incident/)). You know what they did to him? NOTHING. 

 Instead, they were completely transparent about the incident, and even wrote a blog post, [Postmortem of database outage of January 31](https://about.gitlab.com/2017/02/10/postmortem-of-database-outage-of-january-31/),  detailing how they'll make sure such thing won't happen again.

- Remember [Azure's Service Disruption 5 years ago](https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/)? They had a leap year bug that caused their whole infrastructure to crash. You know what they did? fixed their tooling, and helped others learn from their mistakes: [Is your code ready for the leap year?](https://azure.microsoft.com/en-us/blog/is-your-code-ready-for-the-leap-year/)


- Remember [AWS's 4 hour outage a few months ago](https://aws.amazon.com/message/41926/)?  It caused a loss of a few hundred million dollars of revenue for S&P 500 companies alone. Why? An engineer debugged an issue with S3's billing system and accidentally mistyped a command. Was the guy fired? NO.

Non of these companies should get a medal for dealing with incidents like they did. That's the way our industry is supposed to handle things. Making mistakes is human, our job is to learn from them and make our processes better.
