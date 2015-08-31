--- 
layout: post
title: "Building a developer machine from a script with Chocolatey and BoxStarter"
author: "Robert Bird"
comments: true
tags:
- configuration
- devops
---




## A Rant About Machine Images


## Backing up the boot settings

bcdedit /export c:\bcdbackup



## Setting up a new VM

bcdboot M:\Windows


bcdedit /set {52770d04-0937-11e4-a590-c8d719662ef2} description “Windows 8.1 Enterprise .VHDX”



Computer properties –> Advanced System Settings –> Advaced –>Startup and Recvovery –>Settings button:


bcdedit /displayorder {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx} /addlast


## Removing old entries

bcdedit /delete {UUID}




START http://boxstarter.org/package/nr/url?https://raw.githubusercontent.com/robertbird/robertbird.devenvironment/master/MachineBuilds/Boxstarter-Machine-Build.ps1



http://blogs.msdn.com/b/volkerw/archive/2014/02/04/using-a-vhd-for-development.aspx

http://blogs.msdn.com/b/volkerw/archive/2014/01/24/test4.aspx


