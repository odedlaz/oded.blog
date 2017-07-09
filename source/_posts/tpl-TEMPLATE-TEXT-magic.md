title: 'tpl: TEMPLATE | TEXT -> magic'
tags:
  - golang
  - project
id: 63
updated: '2017-03-07 19:53:52'
permalink: tpl-announcement
categories:
  - programming
date: 2016-12-15 09:36:00
---


***tpl*** is small utility that transforms templates to text - a bare-bone [confd](http://confd.io/) alternative, that follows the unix philosophy of **"Do One Thing and Do It Well"**.

In other words, it just transforms template files to text, and spits the output to stdout. 

It's small, fast and is only one binary! grab it from [here](https://github.com/odedlaz/tpl).


##### Why?

I needed a small binary that can consume dynamic data from different sources.  
[confd](http://confd.io/) is awesome, but it does much more than just transform templates.  
 plus, many times specific filters are missing and I needed a way to add new filters easily


##### How?

The trivial, piping case would be:
```bash
# pipe your template
$ NAME=Oded
$ echo 'Hello {{ "NAME" | getenv }}.' | bin/tpl
# or get it from a file
$ bin/tpl /path/to/template/file
Hello Oded
```

but having a full blown templating engine at your fingertips is quite useful.
what if you want to create several [Dockerfile](https://docs.docker.com/engine/reference/builder/)(s) for different [Elasticsearch](https://www.elastic.co/) versions, and even specific plugins?
```docker
FROM elasticsearch:{{"VERSION" | getenv:"latest" }}
MAINTAINER Oded odedlaz@example.com
{% if "PLUGINS" | getenv:"" != "" %}
# install all the plugins
{% for plugin in "PLUGINS" | getenv | stringsplit:"," %}
RUN usr/share/elasticsearch/bin/plugin install {{ plugin }}
{% endfor %}
{% endif %}
```
now run it:
```bash
# without any arguments
$ bin/tpl /path/to/Dockerfile.tpl
FROM elasticsearch:latest
MAINTAINER Oded odedlaz@example.com

# with VERSION env variable
$ VERSION="1.7" bin/tpl /path/to/Dockerfile.tpl
FROM elasticsearch:1.7
MAINTAINER Oded odedlaz@example.com

# with the kopf and marvel plugins
$ VERSION="1.7" PLUGINS="kopf,marvel" bin/tpl /path/to/Dockerfile.tpl
FROM elasticsearch:1.7
MAINTAINER Oded odedlaz@example.com

# install all the plugins
RUN usr/share/elasticsearch/bin/plugin install kopf
RUN usr/share/elasticsearch/bin/plugin install marvel
```
