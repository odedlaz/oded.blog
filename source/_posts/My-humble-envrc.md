title: My humble direnv .envrc
tags:
  - linux
  - direnv
  - productivity
id: 95
updated: '2017-03-16 10:13:57'
permalink: my-humble-envrc
categories:
  - devops
date: 2017-03-14 13:45:00
---

This one is dedicated to all the lazy productivity enthusiasts out there. First, If you haven't read my [direanv](/2016/12/29/direnv) blog post go ahead and read it.

`.envrc` is the dotfile that [direnv](https://direnv.net/) uses to to do its magic. I usually split my `.envrc` into two parts:

#### .envrc
A script that is tailored to the project at hand:
```bash
source_env .pyenv
export NAME=odedlaz
```

I put all my exports there.

#### .pyenv
A script that bootstraps anything my python app needs:
```bash
layout python python3
if [ ! -f ".direnv/direnv.lock" ]; then

   for req in requirements requirements-test; do
      if [ -f $req.txt ]; then
         echo "direnv: installing project $req"
         pip install -r $req.txt 1> /dev/null
      fi
   done

   for package in ipython bumpversion; do
      echo "direnv: installing $package"
      pip install --upgrade $package 1> /dev/null
   done

   date +%FT%TZ > .direnv/direnv.lock
fi
```

Did you see what I did there? If a user has *direnv* installed, all the needed project requirements are installed once he enters the projects directory.

I've also added a lock file to make sure *direnv* doesn't perform unneeded, lengthy, installations every time a user enters the directory. If you want to update the requirements, you just need to run
```bash
rm -f .direnv/direnv.lock && direnv reload
```

The ideal solution would be to create a custom alias, but [aliases aren't supported at the moment](https://github.com/direnv/direnv/issues/73).

####security model
If you're worried of unwanted loading of unvetted `.envrc` files, look at the following screencast:

<script type="text/javascript" src="http://asciinema.org/a/4416.js" id="asciicast-4416" async></script>





