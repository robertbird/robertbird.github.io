--- 
layout: post
title: Docker for Windows - Networking Tips and Tricks
author: "Robert Bird"
comments: true
excerpt_separator: <!--more-->
tags:
- development
- docker
---

![Docker for Windows]({{ site.url }}/assets/docker/docker-container.jpg)

Following on from my previous post outlining some [General Docker Tips and Tricks](/development/docker-general-tips-and-tricks) this post covers some of the networking issues I have experienced and how I managed to fix this. I imagine this post will be a work in progress as I definitely have a lot still to learn when it comes to Docker networks. 

There are some very useful guides to networking, including the general [Docker networking documentation](https://docs.docker.com/engine/userguide/networking/) and the Docker for Windows specific [Microsoft networking documentation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/container-networking).

If you are having networking issues, one way to inspect the Docker network is to run the following. 

{% highlight powershell lineanchors %}
docker network inspect nat
{% endhighlight %}

There is also another handy [script to clean up the container networking here](https://github.com/MicrosoftDocs/Virtualization-Documentation/tree/master/windows-server-container-tools/CleanupContainerHostNetworking)

Using this script you can try resetting your container network stack with the -Cleanup switch or going further, force deletion of switches with the -ForceDeleteAllSwitches flag. Restarting Docker will then recreate all required settings which worked for me.

{% highlight powershell lineanchors %}
.\WindowsContainerNetworking-LoggingAndCleanupAide.ps1 -Cleanup -ForceDeleteAllSwitches
{% endhighlight %}

### Unable to access the internet from a container

When developing an application that communicates amongst internal nodes and doesn't need external access, this may not crop up. But if you need to call out to external services or if in my case if you are building an image and want to download and install files you may run into problems. 

For me the problem was due to DNS within the container. To verify this, you can try the following command:

{% highlight Powershell lineanchors %}
docker run --rm -ti microsoft/nanoserver ping google.com
{% endhighlight %}

This will start a new Windows container running nanoserver and run the ping command against Google. If you are having DNS issues, this will fail saying that google.com can't be resolved.

To check that the container has connectivity, but the issue is due to DNS lookup, try pinging the Google DNS server using an IP address:

{% highlight powershell lineanchors %}
docker run --rm -ti microsoft/nanoserver ping 8.8.8.8
{% endhighlight %}

If this works and you get a response then like me you have a DNS issue. Thanks to [this blog post](https://robinwinslow.uk/2016/06/23/fix-docker-networking-dns/#the-permanent-system-wide-fix) for providing the answer.

#### Setting a DNS server address

To fix this issue you just need to tell Docker to use a specific DNS server. You can do this by going to the Docker settings, clicking the Daemon tab and then switching to advanced mode. You will then be able to edit the settings and enter an additional _dns_ entry as an array of DNS servers. It is a good idea to check your machine using *ipconfig /all* and add the local DNS server as the first entry, you can then add others such as the Google DNS server on 8.8.8.8

{% highlight powershell lineanchors %}
{
  "registry-mirrors": [],
  "insecure-registries": [],
  "debug": true,
  "experimental": true,
  "dns": [
    "8.8.8.8"
  ]
}
{% endhighlight %}

![Docker Settings]({{ site.url }}/assets/docker/docker-settings-dns.png)

Now try the first command again and it should resolve the domain name this time.
