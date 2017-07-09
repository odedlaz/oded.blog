title: Updating neovim python client automatically in Ubuntu
tags:
  - python
  - neovim
id: 75
updated: '2017-03-04 20:40:46'
permalink: updating-neovim-python-client-automatically
categories:
  - devops
date: 2017-01-29 11:21:00
---

First of all, I've been using vim exclusively since my [The Road to Mastering Vim](/2016/12/12/the-road-to-mastering-vim/) blog post! Actually I'm not using vim at all. I decided to use [neovim](https://neovim.io/), which is literally the future of [vim](http://www.vim.org/), instead. I've also decided to donate a monthly sum to their [Bountysource](https://salt.bountysource.com/teams/neovim).

anyway, neovim has a [python client](https://github.com/neovim/python-client) that implements support for python plugins in neovim. It also serves as a library for connecting to and scripting neovim processes through its msgpack-rpc API.

That poses an issue: pip doesn't have an auto update mechanism. So how do I update the client packages every time neovim is updated, automatically?

<!-- more -->

## The solution

This is a three step solution. We'll be hooking into dpkg install process and run a script that updates neovim client libraries when neovim is being installed / updated.

### Create a dedicated virtualenv for neovim

First, install and configure: [virtualenv](https://pypi.python.org/pypi/virtualenv), [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io).  
 Then, create *python2* and *python3* virtualenvs for neovim:

1. Run: `mkvirtualenv -p python2 neovim2`
2. Run:Â `pip install neovim`
3. Repeat step 1-2 for python 3

Now, edit your vimrc file and add the following:

```vim
let g:python_host_prog = $WORKON_HOME."/neovim2/bin/python"
let g:python3_host_prog = $WORKON_HOME."/neovim3/bin/python"
```

### Create a script that updates the client library

The following script updates all the packages inside neovims virtualenvs.  
 You'll probably need to change it a little bit to suite your needs:

- It uses zsh, you might be using bash.
- It configures virtualenvwrapper to `$HOME/.virtualenvs`, yours might be different.
- It configures virtualenvwrapper python to `/usr/bin/python3`, yours might be different.

```bash

#!/usr/bin/zsh

function update_python_packages {
   USERNAME=$(logname)
   # run command as the user who logged in. see: https://goo.gl/akX2eo
   echo "Updating neovim python$1 libraries ..."

   source /opt/nvim/python$1/bin/activate
   pip install -u --upgrade pip &> /dev/null
   packages_to_install=$(pip list --outdated --format=legacy)
   if [ ! -z "$packages_to_install" ]; then
      echo $packages_to_install | awk '{print $1}' | \
         xargs -n1 pip install -U
   fi
   deactivate
}

while IFS= read -r line; do
   # check if neovim is being installed. if so, update the client libraries!
   if ! echo "$line" | grep "[n]eovim" &>/dev/null; then
      continue
   fi

   update_python_packages "2"
   update_python_packages "3"
done
```

### Configure dpkg to call the script

[dpkg](https://en.wikipedia.org/wiki/Dpkg) has a neat feature that allows hooking scripts into various dpkg actions. The `Pre-Install-Pkgs` hook is exactly what we need.

This hook runs after a set of packages has been downloaded, and before they are installed. The list of packages is passed to [standard input (stdin)](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_.28stdin.29).

First, copy the update script to a directory of your choosing (We'll be using `/opt/nvim`), then configure dpkg:

```bash
 sudo bash -c "echo 'DPkg::Pre-Install-Pkgs {\"/opt/nvim/update-nvim.zsh\";};' > /etc/apt/apt.conf.d/99update-nvim"  
```

and we're done!


```bash
$ sudo apt install neovim

Reading package lists...
Building dependency tree...
Reading state information...
The following NEW packages will be installed:
 neovim
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 4,201 kB of archives.
After this operation, 19.6 MB of additional disk space will be used.
Get:1 http://ppa.launchpad.net/neovim-ppa/unstable/ubuntu yakkety/main amd64 neovim amd64 0.1.7ubuntu1+git201701281330+3091+23~ubuntu16.10.1 [4,201 kB]
Updating neovim python libraries ... # that's our script!!!
Fetched 4,201 kB in 6s (630 kB/s)
Selecting previously unselected package neovim.
(Reading database ... 309781 files and directories currently installed.)
Preparing to unpack .../neovim_0.1.7ubuntu1+git201701281330+3091+23~ubuntu16.10.1_amd64.deb ...
Unpacking neovim (0.1.7ubuntu1+git201701281330+3091+23~ubuntu16.10.1) ...
Setting up neovim (0.1.7ubuntu1+git201701281330+3091+23~ubuntu16.10.1) ...
Processing triggers for man-db (2.7.5-1) ...
```
