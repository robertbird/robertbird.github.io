--- 
layout: post
title: Docker for Windows - General Tips and Tricks
author: "Robert Bird"
comments: true
excerpt_separator: <!--more-->
tags:
- development
- docker
---

![Docker Settings]({{ site.url }}/assets/docker/docker.png)

I have been playing with [Docker for Windows](https://www.docker.com/docker-windows) a lot recently and I can see how much potential it has to change the development process. Now with [.NET Core v2.0](https://github.com/dotnet/core) being released and Docker coming out of beta, it seems like this is finally coming of age! 

However along the way I have also run into various issues with networking or permissions, sometimes more than once, so in this post I am keeping a list of tips and tricks for issues you may run into.

## How to find the IP address of my container

So you've [installed Docker](https://docs.docker.com/docker-for-windows/install/) and started a container successfully. But how can you now connect to this image?

{% highlight powershell lineanchors %}

# For example we can run IIS in a Windows container with the following command which will map port 80
docker run -d -p 80:80 --name mywebserver microsoft/iis

# To see our running container 
docker ps

# The following command will inspect the container which lists properties such as networking, ports etc, the filter will just return the IP address
{% raw %}docker inspect --format="{{.NetworkSettings.Networks.nat.IPAddress}}" mywebserver{% endraw %}

# Alternatively we could also execute a command within our running container, such as ipconfig to get the IP address
docker exec mywebserver ipconfig

# clear up - stop and remove the container
docker stop mywebserver
docker rm mywebserver

{% endhighlight %}

![Docker Settings]({{ site.url }}/assets/docker/iis-running.png)


## Having problems? Try this handy Docker health check

If you are having any problems with Docker and commands not running as you think they should, then try the following command from a Powershell command prompt:

{% highlight powershell lineanchors %}
Invoke-WebRequest https://aka.ms/Debug-ContainerHost.ps1 -UseBasicParsing | Invoke-Expression
{% endhighlight %}

This will download and run a script from Microsoft which will check the state of your installation to help you spot problems with your configuration. It runs a series of checks to check you have the right components installed and your networking is configured properly. 

## Help I'm running out of disk space!

One problem with Docker for Windows compared to Linux, is that the Docker images tend to be much larger. Anything relying on a full Windows server (microsoft/windowsservercore) will build on the base image of 10Gb. As an example Mongo for windows is 8Gb compared to the 130Mb Linux counterpart. 

At one point by C:\ProgramData\Docker\windowsfilter folder was over 60Gb in size. At this point I looked for a way to move these files from their default location on my C:\ drive to another drive.

### Cleaning out old images
To cleanup some space you can try:

{% highlight powershell lineanchors %}
docker system prune -a
{% endhighlight %}

This will remove unused images and is the recommended way to cleanup old files. However, for me cleaning up old files is not enough. I found that Docker was using up too much space on my C: drive, so was desperate to relocate these files to a different drive.

### Moving the Docker installation directory

Luckily this is possible by adding to the Docker for Windows daemon.json settings file. As it turns out you cannot edit this file directly, instead you need to do it through the Settings screen. 

To do this right click on the Docker system tray icon and then select settings. In the screen that appears select the Daemon tab on the left and then in the right hand you will need to toggle to Advanced mode. This will bring up a textbox with the current JSON settings. Add a graph value with the location you want to move the Docker files to:

{% highlight powershell lineanchors %}
{
  "registry-mirrors": [],
  "insecure-registries": [],
  "debug": true,
  "experimental": true,
  "graph": "D:\\Docker"
}
{% endhighlight %}

![Docker Settings]({{ site.url }}/assets/docker/docker-settings-directory.png)

Clicking 'Apply' will restart the Docker service and you are all set! 

### Removing files manually (this isn't as easy as you might imagine!)

Docker should manage the files itself, but I have found myself needing to manually clean up files on several occasions. But this isn't easy, the files under C:\ProgramData\Docker are locked so even with an elevated command prompt you are not able to delete them. 

The only way I was able to clean up these files was to download a small [commandline utility called docker zap](https://github.com/jhowardmsft/docker-ci-zap). This comes with a lot of warnings, so only do this if you are comfortable with the risks. Once downloaded you can run it like this:

{% highlight powershell lineanchors %}
 .\docker-ci-zap.exe -folder "C:\ProgramData\Docker"
{% endhighlight %}

I hope this helps someone, in a future post I will share some of tips for debugging Docker networking issues. 