title: Boost productivity with virtualenv
tags:
  - python
id: 3
updated: '2017-03-04 20:36:59'
permalink: python-developer-you-must-work-with-virtualenv
categories:
  - programming
date: 2014-07-09 07:15:00
---
*"A Virtual Environment is a tool to keep the dependencies required by different projects in separate places, by creating virtual Python environments for them. It solves the “Project X depends on version 1.x but, Project Y needs 4.x” dilemma, and keeps your global site-packages directory clean and manageable."* - [The Hitchhiker's Guide to Python](http://docs.python-guide.org/en/latest/)

In this blog post I'll explain about virtualenv, venv, and how I use both.

<!-- more -->

### virtualenv

[virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/) gives the user the ability to use virtual environments for their python 2.x and 3.x projects. It completely isolates your projects and their dependencies from each other which makes **IT AWESOME** and really simple to use.

### venv

**TL;DR** virtualenv re-implemented inside python 3.6

*"The [venv](https://docs.python.org/3/library/venv.html) module provides support for creating lightweight virtual environments with their own site directories, optionally isolated from system site directories. Each virtual environment has its own Python binary (allowing creation of environments with various Python versions) and can have its own independent set of installed Python packages in its site directories."* - [docs.python.org](https://docs.python.org/3/library/venv.html)

### how I use it

Most of the time, I use [direnv](https://direnv.net/) to handle my virtualenvs. It works flawlessly and completely transparent.

Otherwise, I use my own custom made functions to create venvs (I not a fan of [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/)):

```bash
# source the virtualenv in the current directory
# the first argument is the name of the virtualenv
# if it's not supplied, it'll try to use .venv directory
# or a sub-directory with the same name as this directory.
function venvon() {

   venv="$1"
   if [ -z "$venv" ]; then
      if [ -d "$(pwd)/.venv" ]; then
         venv=".venv"
      else
         venv=$(basename $(pwd))
      fi
   fi

   if ! source "$(pwd)/$venv/bin/activate" &> /dev/null; then
      echo "./$venv dir is missing"
      return 1
   fi
}

function __mkvenv() {
   version="$1"
   venvtype="$2"
   venv="$3"

   if [ -z "$venv" ]; then
      venv=".venv"
   fi

   if [ -d "$(pwd)/$venv" ]; then
      echo "venv already exist"
      return 1
   fi

   python$version -m $venvtype $venv
   venvon $venv
}

# create a python2 virtualenv
function mkvenv2() {
   __mkvenv "2" "virtualenv" "$1"
}

# create a python3 virtualenv
function mkvenv3() {
   __mkvenv "3" "venv" "$1"
}
```