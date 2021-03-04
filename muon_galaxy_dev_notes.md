# Notes on Muon Galaxy development

## Galaxy Installation

### Installing in Docker container

I tried to install Galaxy in a Docker container on my local machine. My local machine is
Windows 10 and the Docker container was based off the `python:3` image on Docker Hub (which uses
Linux).

Initially, I mounted my local copy of `muon-galaxy` as a volume on the container rather than cloning
the repo fresh. This turned out to be a mistake for 2 reasons:
* I had to be careful about my
[Git config for line endings](https://docs.github.com/en/github-ae@latest/github/using-git/configuring-git-to-handle-line-endings)
(bash scripts in particular need to have LF or they won't run on Linux containers)
* None of the symbolic links worked
With this setup, the Galaxy installation ran extremely slowly in the container. The NPM plugin build
alone took 39 minutes, and compiling the client took so long that the process ran out of heap
memory (which is limited to ~1GB by default). Starting from a fresh container it took the `run.sh`
script over 1.5 hours to reach this failure point. The build absolutely should not take this long.
I believe the problem was with the symbolic links not working, as Galaxy relies heavily on these.

Cloning the repository directly onto the container avoided the issues above, and installation
subsequently only took about ten minutes – though the client build did still run out of heap memory.

After increasing the heap memory available to Node using
`export NODE_OPTIONS=--max_old_space_size=2048`, the build was eventually successful.

I also had to change my config file so that `uwsgi` listened to `0.0.0.0:8080` rather than the
default `127.0.0.1:8080`. This is because Docker Desktop for Windows listens to the `0.0.0.0` IP on
the container by default when publishing ports (at least on my machine).

### Installing on Cloud VM

On a fresh VM, you will need to install `git`, `python3` and `bzip2` before cloning the repository
or running `run.sh`.

If using the 'Remote – SSH' VS Code extension to develop on the VM, you should make a couple of
settings changes before running `run.sh`:

1. Prevent VS Code from trying to track every file that gets installed in the Galaxy virtualenv.
Add `/absolute/path/to/galaxy/virtualenv/**` to the VS Code Watcher Exclude
(`files.watcherExclude`) setting for the workspace - if using the default virtualenv this path will
look like `/absolute/path/to/muon-galaxy/.venv/**`. Using `**/.venv/**` may also work. The
`**/node_modules/*/**` path should be excluded by default, but if not you should add this too.
2. Increase the number of watches available on the VM. The default value is 8192, but the Galaxy
project needs ~50000 watches due to the large number of files. Run
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf` followed by
`sudo sysctl -p` to enable VS Code to track up to 524288 files at once on the VM (the maximum
permitted value for this option).

If you don't do this, VS Code may not be able to open the folder on the remote due to the number of
files that need to be tracked. See the
[VS Code on Linux](https://code.visualstudio.com/docs/setup/linux#_visual-studio-code-is-unable-to-watch-for-file-changes-in-this-large-workspace-error-enospc)
page for more info.

I found installation on the VM to run pretty quickly – around 10 minutes to complete the build and
start Galaxy. I did not need to increase the heap memory available to Node.