--- 
layout: post
title: "Building my development machine from a script with Chocolatey and BoxStarter"
author: "Robert Bird"
comments: true
tags:
- automation
- devops
- windows
- development-machine
---

![Boot Manager]({{ site.url }}/assets/choco-boxstarter.png)

So it's that time of year again; you are starting to realise that your Windows machine is running more slowly than it used to. At least you think so, but is it enough to overcome the feeling of dread at the thought of repaving your machine? It's because you know that you will never be able to remember the complete list of software & tools or the custom windows settings that you've acquired over time. Not to mention the time it will take to sit there installing visual studio or waiting for Windows updates to apply.

But we live in a world of automation now, so surely there must be a better way? 

This blog post continues from my post about [Managing Development Machine Builds](/devops/managing-development-machine-builds/) in which I describe how to boot from a VHD file in Windows 8. In this post I will show how we can script the installation of windows updates and software installation to automate the build of a development machine.

## First a Rant about Machine Images

Machine images are commonly used to allow a machine to be restored to a known state. Whilst this works well in some situations, it has many limitations:

* **Images go out of date very quickly** - Not just in terms of Windows patching but the versions of software installed. Sometimes on a developer machine, major version changes of software like visual studio is a big deal, so un-installing the old and installing the new version after re-imaging is far from ideal. 
* **They're not granular enough** - They don't allow you to pick and choose the software that is installed. They are simply another machine at a point in time.
* **They are large and cumbersome** - Essentially backing up the entire drive takes up a lot of disk space.

Basically this seems to me like a very basic solution. My main problem is that the world is constantly evolving and every time it does you will need to recreate the image. 

## Introducing Chocolatey (and One-Get) 

To a .Net developer, Chocolatey is a bit like a Nuget package manager for your Windows programs (In fact it uses Nuget under the covers). With Chocolatey you can just execute a command like  **_choco install notepadplusplus -y_** and the next minute you have NotePad++ installed on your machine. No more browsing to find the download page, searching for the right type of installer and then running through tedious installation wizards. One simple command and you are done!

Getting started with Chocolatey is simple, just head over to [https://chocolatey.org/](https://chocolatey.org/) and copy the command from the homepage: 

{% highlight bat lineanchors %}
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
{% endhighlight %}

Whilst you are on the site use the search bar at the top to find your favourite programs. I've been using Chocolatey for quite a while now and I generally find that most of the software is listed on there, probably about 90% of what I need. 

After installing chocolatey you now have several commands available to install, update and remove software packages. When installing there are also parameters that you can use:
There are some parameters to be aware of

> Chocolatey gets us a long way towards our goal of automated machine builds from a script

One great feature is that you can install a specific version of a package. So for example my license for Resharper doesn't cover the latest version, no problem I just install the version I need:

{% highlight powershell lineanchors %}
choco install resharper -version 8.2.3000.5176
{% endhighlight %}

Also, depending on the package there may be additional install options that I can use. So as another example, Visual Studio 2013 will let me choose the modules I am interested and provide a license key:

{% highlight powershell lineanchors %}
cinstm visualstudio2013premium -InstallArguments "/Features:'WebTools SQL' /ProductKey:XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
{% endhighlight %}

Interestingly the creator of Chocolatey is called Rob Reynolds (AKA ferventcoder), who happens to also be the guy behind the [ChuckNorris framework](https://github.com/chucknorris). (which includes the classic [RoundhousE](https://github.com/chucknorris/roundhouse) for database automation)

### One-Get for Windows 10.

With Windows 10 Microsoft have introduced something called One-Get, which is being referred to as a package manager manager. This is to say that it provides the commands to install packages and lets you configure which package managers you want to connect to. So this is a more generic _infrastructure_ for packages of any kind not just software, another example would be Powershell Modules. One-get has a provider for Chocolatey, so if you are on Windows 10 you can start using this to install your Chocolatey modules instead.

There are some great blog posts available on this subject including a couple by Scott Hanselman:

* [10 things about OneGet that are completely different than you think.](http://blogs.technet.com/b/packagemanagement/archive/2015/05/05/10-things-about-oneget-that-are-completely-different-than-you-think.aspx)
* [Is The Windows User Ready For apt-get?](http://www.hanselman.com/blog/IsTheWindowsUserReadyForAptget.aspx)
* [Apt-Get For Windows - OneGet And Chocolatey On Windows 10](http://www.hanselman.com/blog/AptGetForWindowsOneGetAndChocolateyOnWindows10.aspx)

## Boxstarter for Unattended Installations and Windows Configuration

So we've seen what Chocolatey can do for us, and of course this could all be put into a nice Powershell script to install our development machine. However Chocolatey doesn't do everything we need to things setup just the way we like it. There are still many other things to do with a freshly paved machine including:

* Installing the numerous windows updates, which will probably require many restarts along the way
* Setting up Windows Features such as IIS
* Customising Explorer options - like showing file extensions
* Setting up our start bar and task bar by 'pinning' commonly used programs. 

[Boxstarter](http://boxstarter.org/) to the rescue! It extends the power of Chocolatey to cover exactly these requirements and more by providing additional Powershell commands.

So you do in fact create a Powershell script that is responsible for installing your machine. Boxstarter can then be used to run it in one of two ways:

1. By installing Boxstarter locally (using choco install boxstarter -y) which will add modules to Powershell. This is great for developing and testing a script.
2. By simply entering *START http://boxstarter.org/package/nr/url?https://{URL-TO-YOUR-SCRIPT}* into Internet Explorer (other browsers will need a ClickOnce extension adding). This is great for quickly running a setup script on a freshly paved machine. 

So given a fresh build of Windows I can easily run [the full script that I have been evolving to install my machine](https://github.com/robertbird/robertbird.devenvironment/blob/master/MachineBuilds/Boxstarter-Machine-Build.ps1) by just opening up Internet Explorer and navigating to:

{% highlight bat lineanchors %}
START http://boxstarter.org/package/nr/url?https://raw.githubusercontent.com/robertbird/robertbird.devenvironment/master/MachineBuilds/Boxstarter-Machine-Build.ps1
{% endhighlight %}

Below are some snippets from this script showing examples of what can be done with Boxstarter:

**Managing Windows Updates**

{% highlight powershell lineanchors %}

# Boxstarter options
$Boxstarter.RebootOk=$true # Allow reboots?
$Boxstarter.NoPassword=$false # Is this a machine with no login password?
$Boxstarter.AutoLogin=$true # Save my password securely and auto-login after a reboot

# Update Windows and reboot if necessary
Install-WindowsUpdate -AcceptEula
if (Test-PendingReboot) { Invoke-Reboot }

{% endhighlight %}

Here we first set some Boxstarter options to allow reboots and let Boxstarter manage the user's password. We will then start the (long and tedious) process of installing any outstanding updates, rebooting along the way when necessary.

**Installing Software**

{% highlight powershell lineanchors %}
# Install Visual Studio 2013 Premium 
cinstm visualstudio2013premium -InstallArguments "/Features:'WebTools SQL'"
if (Test-PendingReboot) { Invoke-Reboot }

# VS 2013 extensions
Install-ChocolateyVsixPackage WebEssentials2013 http://visualstudiogallery.msdn.microsoft.com/56633663-6799-41d7-9df7-0f2a504ca361/file/105627/31/WebEssentials2013.vsix
Install-ChocolateyVsixPackage SpacFlow https://visualstudiogallery.msdn.microsoft.com/90ac3587-7466-4155-b591-2cd4cc4401bc/file/112721/7/TechTalk.SpecFlow.Vs2013Integration.v2015.1.2.vsix
choco install resharper -version 8.2.3000.5176

#Other dev tools
cinst fiddler4 -y
cinst brackets -y
cinst notepadplusplus -y
cinst nodejs.install -y
cinst sourcetree -y

#Browsers
cinst googlechrome -y
cinst firefox -y

#Other essential tools
cinst winrar -y
cinst adobereader -y
cinst skype -y

{% endhighlight %}

This is really just Chocolatey commands to install a list of software. Note that we are also installing extensions into Visual Studio which is very cool.

**Configuring Windows Features**

{% highlight powershell lineanchors %}
cinst Microsoft-Hyper-V-All -source windowsFeatures
cinst IIS-WebServerRole -source windowsfeatures
cinst IIS-HttpCompressionDynamic -source windowsfeatures
cinst IIS-ManagementScriptingTools -source windowsfeatures
cinst IIS-WindowsAuthentication -source windowsfeatures
cinst DotNet3.5 # Not automatically installed
if (Test-PendingReboot) { Invoke-Reboot }
{% endhighlight %}

Here are some examples of windows features I am turning on, including not just IIS but all of the additional IIS options I need to be enabled.

**Customising Windows Explorer**

{% highlight powershell lineanchors %}
Update-ExecutionPolicy Unrestricted
Set-ExplorerOptions -showHidenFilesFoldersDrives -showProtectedOSFiles -showFileExtensions
Enable-RemoteDesktop
Disable-InternetExplorerESC #useful to get rid of the annoying IE security on Windows server - better still just install Chrome!
Disable-UAC
Set-TaskbarSmall
{% endhighlight %}

[Boxstarter provides many additional commands to customise Windows](http://boxstarter.org/WinConfig). You may not want to run commands such as *Enable-RemoteDesktop* or *Disable-UAC* of these for security reasons, but the option is there if you need it.

**Pin a program to the task bar**

{% highlight powershell lineanchors %}
Install-ChocolateyPinnedTaskBarItem "$($Boxstarter.programFiles86)\Google\Chrome\Application\chrome.exe"
Install-ChocolateyPinnedTaskBarItem "$($Boxstarter.programFiles86)\Microsoft Visual Studio 12.0\Common7\IDE\devenv.exe"
{% endhighlight %}

Finally we are using one of the [many Chocolatey helpers](https://github.com/chocolatey/choco/wiki/HelpersReference) to pin the programs we want to the task bar.

## What’s next?

Microsoft recently [announced a preview of container support in Windows Server 2016]( https://weblogs.asp.net/scottgu/announcing-windows-server-2016-containers-preview). This is something that I have been keeping an eye on for some time because I think it will completely change the way that ASP.Net applications are deployed, hosted and managed. (In fact this was one of the areas highlighted in a [technology radar I produced for Adactus](https://www.adactus.co.uk/radar/Adactus-Technology-Radar-2015.pdf) in June)
 
Another tool I have been meaning to play with for some time is [Vagrant]( https://www.vagrantup.com/) which since the 1.6 release in May, now gives us a way to quickly spin up Windows virtual machines based on scripted specifications. Combining this with Boxstarter is something that looks very compelling.

Docker and the preview of container support is definitely an area I intend to research. Docker and Vagrant combined with ASP.Net 5’s cross platform support could be very interesting indeed, so expect more posts in this area soon.




