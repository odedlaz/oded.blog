title: Scriptable tmux status line
tags:
  - linux
  - tmux
  - project
id: 73
updated: '2017-03-07 19:26:46'
permalink: tmux-status-variables-plugin
categories:
  - devops
  - ''
date: 2017-01-23 22:59:00
---


[tmux](https://tmux.github.io/) is awsome, but creating scripts for the status line is a lot of work. I've looked into different scripts at the [tmux-plugins](https://github.com/tmux-plugins) repo and saw a recurring pattern. Or dare I say, a lot of copy-n-pasting of the same code from one plugin to another. Many of them lay the same groundwork:

- Add utils function to get or set tmux options
- Add code that transforms the status line and calls the scripts
- Add a caching layer to make sure no redudant calls are made

I've taken the liberty to [create a plugin](https://github.com/odedlaz/tmux-status-variables), *tmux-status-variables*, that helps creating and using status line scripts extremely easy.

<!-- more -->

A regular plugin only needs to have execution priviledges.  
 For instance, lets look at this `hello world` plugin:

```bash
#!/bin/bash  
echo "hello world!"  
```

If `hello world` takes a lot of time, we might want to cache the result.  
 Results are cached for `status-interval` seoconds. lets look at the following plugin:

```bash  
 #!/bin/bash  
 PLUGIN_DIR=$(tmux show-option -gqv "@status_variables_dir")  
 source "$PLUGIN_DIR/utils/sdk.sh"

on_cache_miss() {  
  echo "hello world!"  
  sleep 1  
}

echo "$(get_cached_value on_cache_miss)"  
```

`on_cache_miss` will run only when `status-interval` seconds have passed.  
 This is important because tmux might refreshes the status line when redrawing the pane.  
 Every time you press or create a new pane, the status line is refreshed which causes many script calls.

Now all that's left is to run it:

* Dump the content of the script to the `scripts_directory`, and name it `hello.tmux`
* Add `set -g status-left "#{hello}"` to your `tmux.conf` and your good to go!


