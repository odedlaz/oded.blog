title: 'The Guts n’ Glory of Database Internals'
tags:
  - databases
permalink: the-guts-n-glory-of-database-internals 
categories:
  - devops
  - programming
date: 2017-11-7 12:16:37
---

A year ago [Oren Eini](https://ayende.com) (a.k.a [@ayende](https://twitter.com/ayende)) wrote a series dubbed [*"The Guts n’ Glory of Database Internals"*](https://ayende.com/blog/posts/series/174337/the-guts-n-glory-of-database-internals).

Instead of just explaining how databases work, He incrementally builds a database from scratch. He goes over most database essentials, so once done you'll be able to understand how databases actually work. If you haven't taken any database courses at Uni, this is a must in my opinion.

The series is built around a "book keeping' system. The problem? We need to keep track of users and how often they log into the system

He begins at persisting the data to a simple csv file, and then raises issues with this solution. The next part in the series addresses those issues and raises new ones: from selection time, concurrency, durability, logging and more.

Each part builds upon the previous and most parts take around 5 minutes to read.  
The series is made up of 20 parts and takes ~ 1.5hrs to read from start to finish. Not so bad, right? 

By the way, [@ayende](https://twitter.com/ayende) writes *really* well, so it's also fun to read:

1. [Persisting information](https://ayende.com/blog/174337/the-guts-n-glory-of-database-internals-persisting-information) | 6 minutes
2. [Searching information and file format](https://ayende.com/blog/174369/the-guts-n-glory-of-database-internals-searching-information-and-file-format) | 4 minutes
3. [The LSM option](https://ayende.com/blog/174370/the-guts-n-glory-of-database-internals-the-lsm-option) | 3 minutes
4. [B+ Tree](https://ayende.com/blog/174402/the-guts-n-glory-of-database-internals-b-tree) | 11 minutes
5. [Seeing the forest for the trees](https://ayende.com/blog/174465/the-guts-n-glory-of-database-internals-seeing-the-forest-for-the-trees) | 4 minutes
6. [Managing Records](https://ayende.com/blog/174561/the-guts-n-glory-of-database-internals-managing-records) | 7 minutes
7. [Managing Concurrency](https://ayende.com/blog/174562/the-guts-n-glory-of-database-internals-managing-concurrency) | 6 minutes
8. [Understanding durability with hard disks](https://ayende.com/blog/174563/the-guts-n-glory-of-database-internals-understanding-durability-with-hard-disks) | 6 minutes
9. [Durability in the real world](https://ayende.com/blog/174564/the-guts-n-glory-of-database-internals-durability-in-the-real-world) | 4 minutess
10. [Getting durable, faster](https://ayende.com/blog/174565/the-guts-n-glory-of-database-internals-getting-durable-faster) | 3 minutes
11. [Writing to a data file](https://ayende.com/blog/174566/the-guts-n-glory-of-database-internals-writing-to-a-data-file) | 3 minutes
12. [The enemy of thy database is…](https://ayende.com/blog/174593/the-guts-n-glory-of-database-internals-the-enemy-of-thy-database-is) | 4 minutes
13. [The communication protocol](https://ayende.com/blog/174594/the-guts-n-glory-of-database-internals-the-communication-protocol) | 4 minutes
14. [Backup, restore and the environment…](https://ayende.com/blog/174625/the-guts-n-glory-of-database-internals-backup-restore-and-the-environment) | 4 minutes
15. [The curse of old age…](https://ayende.com/blog/174657/the-guts-n-glory-of-database-internals-the-curse-of-old-age) | 5 minutes
16. [What the disk can do for you](https://ayende.com/blog/174659/the-guts-n-glory-of-database-internals-what-the-disk-can-do-for-you) | 2 minutes
17. [What goes inside the transaction journal](https://ayende.com/blog/174916/the-guts-n-glory-of-database-internals-what-goes-inside-the-transaction-journal) | 8 minutes
18. [Log shipping and point in time recovery](https://ayende.com/blog/174917/the-guts-n-glory-of-database-internals-log-shipping-and-point-in-time-recovery) | 3 minutes
19. [Merging transactions](https://ayende.com/blog/174945/the-guts-n-glory-of-database-internals-merging-transactions) | 4 minutes
20. [Early lock release](https://ayende.com/blog/174946/the-guts-n-glory-of-database-internals-early-lock-release) | 2 minutes