--- 
layout: post
title: "Automating Xamarin iOS Builds with TeamCity"
author: "Robert Bird"
comments: true
tags:
- Xamarin
- Continuous Delivery
- Continuous Integration
- iOS
- TeamCity
- TFS
---

![My helpful screenshot]({{ site.url }}/assets/post-image-1.jpg)


We use TeamCity to build all of our projects, so the first thing I wanted to do when starting out with Xamarin was create a solid build pipeline for our mobile apps.

Ideally I wanted exactly the same flexibility we have got used to when building websites, namely:

- As soon as code is checked into Team Foundation Server (TFS) a build is kicked off.
- As part of this build all tests, both unit and integration are run. If a test fails the build can flag this to the team on a dashboard
- Allow a tester to publish any successful build to testing environment
- Allow any build that passes testing to be pushed out, live to the world, at any time.

So over the last few evenings I have been attempting to get a build up and running by connecting a build server running TeamCity to a mac mini which has Xamarin installed.

In this post I will run through the initial steps needed to build the ipa file:

1. Install Eclipse and Team Foundation Everywhere to allow us to get the latest code from source control
2. Install the TeamCity build agent on the mac
3. Create a build script to compile the code

In a follow up post we will build our Android project, run the tests and then publish the build the build to a test environment.

## Getting the latest source code from TFS

I have to admit that using Team Foundation Server on a mac is slightly painful compared with Git, but it's definitely possible. If you are actually going to be developing on the mac I would recommend using Git via SourceTree (or just the Git command line if you are familiar) but if you are primarily working in Visual Studio and like in our case use TFS for other projects then it is a decent choice. 

To use TFS on a mac you will need to do the following:

1.  Install Eclipse
2.  Install Team Explorer Everywhere
3.  Map a local folder to the project using the Eclipse IDE.

At this point you should have the source code locally which you could build with Xamarin Studio if needed.

## Installing the TeamCity build agent

The next step is to connect the mac to TeamCity so that the TC portal can detect changes to source code in TFS and then use the mac to compile the iOS project. To do this we need to install an agent on the mac. 

**Note:** I am assuming that you already have a TeamCity portal up and running, if this is not the case then see this useful guide to setting up TC.

Installing the agent is a fairly manual process, luckily there is a great guide in the teamcity documentation here, however before starting I would add the following tips:

*   To change the file permissions open the folder in Finder and then right click and select file info. Then under permissions if you click the padlock sign it will allow you to change the permissions type drop down next to each group or user.
*   You can test how the startup will work by executing XXXXXXXXXXXXXXXXXXX
*   Also, don't execute the final step XXXXXXXXXXX. You only need to do this if you want to stop the agent from running
*   You will need to authorize the agent in teamcity.
*   Useful commands which aren't listed on the article are XXXXXXX stop kill
*   I had to change the port number in the config from 9090 to 9091 but i've no idea why. It initially connected but when I went into the agent properties in teamcity it showed the port number as 9091. Then at some point it showing as online and I found by changing the port in the config to the same number it started connecting again.

Hopefully you now have an agent running which shows up in the list of agents in teamcity, even after a reboot.

## Creating a build script

Now that we have all of the pieces in place we can create a build script to compile our iOS app. There are several ways to go about this, I chose to create a mac build script that would run in the Terminal for several reasons:

1.  Because I am using TFS for source control, the TC agent isn't able to get the latest source code onto the mac, so I needed to do this at the command line anyway.
2.  Although TeamCity recognised Mono as being available to the build agent, I couldn't get Mono to compile my iOS Xamarin project and instead found that XXXX worked well. This is the same command that Xamarin Studio uses.
3.  I generally prefer to have a build script instead which can be put into source control and run locally on a machine instead of having all of the build steps within TeamCity configuration. That way if the build server dies the build process is safe in source control where it should be. (I know what you are thinking, but If source control dies we are all doomed!)

I will talk you through the script step by step

Step 1: Print as much useful debug information as possible, you will need it at some point.

Step 2: Make sure we have the latest source code on the machine

Step 3 Download the nuget packages if needed

Step 4 Build the project

This script can be tested by executing 

at a terminal window. It should result in the project being built and a .ipa file being produced. 

## Configuring TeamCity Build Steps

Now that we have a build script, we just need to configure TeamCity to run the build script. 

[Set agent configuration property to allow mac requirement]

The final thing I needed to do was configure the location of the resulting .ipa file in the build artifacts in TeamCity. This will mean that TC stores the .ipa file on the server, allowing you to use it in subsequent build steps if required or download it later if needed. 