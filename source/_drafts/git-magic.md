


https://stackoverflow.com/questions/29050251/how-can-i-get-git-log-to-print-the-full-hash-and-short-stats-of-each-commit-on-o

We have two repositories:

- repo MASTER
- repo FORK


first, go to the fork and find the right commit.


```
git log --pretty=tformat:"%H %ci %cn %s" --since '2017-07-30' --until '2017-08-01'
```

once found, extract the relativk


```
git log --pretty=fuller
```




