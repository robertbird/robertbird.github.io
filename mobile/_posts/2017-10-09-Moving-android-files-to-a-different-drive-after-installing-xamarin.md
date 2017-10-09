--- 
layout: post
title: "Moving Android files to a different drive after installing Xamarin"
author: "Robert Bird"
comments: true
tags:
- Xamarin
- Android
---

![Moving Android SDK and Xamarin files to a different drive]({{ site.url }}/assets/xamarin/Xamarin.png)

If you are a .NET developer using Visual Studio and looking to build Android apps then [Xamarin](https://www.xamarin.com/getting-started/android) is fantastic. Visual Studio does a great job of installing all the necessary SDK's, components and emulators needed to get started.

However after installing Xamarin for Visual Studio you may notice you now have a lot less disk space. If like me you struggle with spae on your C drive then the good news is that it is possible to move the Android files over to a different drive.

## Moving the Android SDK from Program Files

Moving the Android SDK saved me over 18Gb of disk space. To move the files you will need to do the following:

1. Open the Visual Studio Options and then look under Xamarin -> Android Settings, this will show the current locations.
![Xamarin SDK Options]({{ site.url }}/assets/xamarin/vs-android-options-before.PNG)

2. I found the trick was to copy the files over to the new location before clicking change in the options.
![Xamarin SDK Options]({{ site.url }}/assets/xamarin/vs-android-options-after.PNG)

3. Remember to delete the old files and update shortcuts to the SDK Manager in your Start Menu

## Moving the Android AVD location from under your User folder

By default the Android Virtual Device (AVD) files will be stored in a .android folder under your user account. For me this folder started out at 14Gb and will grow as you target more Android versions. 

To move the AVD files, you will need to do the following:

1. Move the foler to the new location. For example from C:\Users\user.name\.android to  D:\Android\.android.

2. Right-click on My Computer and choose "Properties"

3. In the system window, click "Advanced system settings" in the left hand side, then the "Environment Variables" button at the bottom. 

4. Click "New..." to add a new variable. Give it the name *ANDROID_SDK_HOME* and the value of the new location *D:\Android*

![Xamarin SDK Options]({{ site.url }}/assets/xamarin/environment-variable.PNG)
