title: 'Running, Editing & Debugging .NET Core Apps Inside a Container'
tags:
  - linux
  - docker
  - vscode
  - .netcore
  - ''
id: 135
updated: '2017-06-26 16:58:21'
permalink: dotnet-core-vscode-docker
categories:
  - devops
  - ''
date: 2017-06-25 16:04:00
---

Today I needed to add a few features to an existing .NET Core application. I'm running Fedora 25, but that shouldn't be an issue, right? because -

![](/images/2017/06/ms_love_linux.jpg)

It appears that it doesn't love Fedora 25, because it's still not officially supported. Instead of hacking around and trying to get this thing working, and wasting my whole day doing so, I thought - why not use Docker?

The idea was simple - create a container that fires up [Visual Studio Code](https://code.visualstudio.com/) inside a container that has [.NET Core](https://www.microsoft.com/net/core) installed.

![](/images/2017/06/docker-net.png)

<!-- more -->

The Dockerfile is pretty straight forward - 

```docker
FROM microsoft/dotnet

RUN apt update && apt install -y wget \
                                 libnotify4 \
                                 libgconf-2-4 \
                                 libnss3 \
                                 libgtk2.0-0 \
                                 libxss1 \
                                 libgconf-2-4 \
                                 libasound2 \
                                 libxtst6 \
                                 libcanberra-gtk-dev \
                                 libxkbfile1 \
                                 libgl1-mesa-glx \
                                 libgl1-mesa-dri && \
   rm -rf /var/lib/apt/lists/* && \
   wget https://go.microsoft.com/fwlink/?LinkID=760868 -O vscode.deb && \
   dpkg -i vscode.deb && \
   rm vscode.deb && \
   useradd -m vscode -s /bin/bash

USER vscode

VOLUME [ "/home/vscode" ]
CMD [ "code", "--verbose" ]
```

Just build it, and you're half way there:
```bash
docker build --rm -t vscode -f /path/to/Dockerfile
```

Now comes the fun part. Figuring out how to fire up Visual Studio Code from inside a container, as if it's running natively in the host. Challenges:
- Making Visual Studio Code connect to my running x server
- Giving Visual Studio Code all the privileges it needs to run & debug an app
- Running with the current user's id, to avoid ownership issues

I googled some, figure out the rest, and came out with following script. It's a little sharp on the edges, and I probably could've used [Docker Compose](https://docs.docker.com/compose/), but it does the job! 

```bash
#!/usr/bin/env bash

# lookup the path where vscode files would reside
VSCODEPATH="${VSCODEPATH:-$HOME/Dev/vscode}"

if [ ! -d "$VSCODEPATH" ]; then
   echo "\$VSCODEPATH env isn't set!"
   exit 1
fi

# create a directory that'll hold projects
# it'll be mounted to the containers home directory
# so all fetched packages and vscode configuration will be loaded between sessions
mkdir -p "$VSCODEPATH/dev"


# add docker to X server access control list (acl)
xhost +local:docker 2> /dev/null

docker run \
       --rm \ # to remove the container when exiting the app
       --detach \ # run detached from the console
       --net=host \ # use the hosts network stack
       --user "$(id -u)" \ # use the running user's id
       --privileged \ # enable access to all devices on the host
       --hostname "$(hostname -s)" \ # use the hosts name
       -e DISPLAY="$DISPLAY" \ # connect to the hosts display
       -v "/tmp/.X11-unix:/tmp/.X11-unix" \ # mount X's Unix-domain socket.
       -v "$VSCODEPATH/dev:/home/vscode" \ # mount the containers dir in the host
       vscode 2> /dev/null # the name of the container that was built
```

and viola..!

![](/images/2017/06/hello_world.png)