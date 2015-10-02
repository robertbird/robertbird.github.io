--- 
layout: post
title: Part 3 - Running Our Selenium Tests On A Remote Windows Server
author: "Robert Bird"
comments: true
excerpt_separator: <!--more-->
tags: 
- specflow 
- specbind 
- selenium
---

This is the third part in my [Automated Testing with Specflow and Selenium series](/test-automation/automated-testing-with-specflow-and-selenium). In previous two posts we've seen how to setup a basic framework and then added our first test which is a great start. But automating tests and then only being able to run them from your own machine seems like a waste doesn't it.

The real benefit to test automation can only be achieved when you actually automate! So this means plugging into the continuous integration process the development team are likely to be running. Then every time the application is changed you can have your tests execute and alert everyone if a test case becomes broken. (We will talk more about the benefits this brings in the next post.)

If we were to try to run our current test framework on a build server we would run into problems. This is because selenium is currently running against as the user logged into their machine, but on a build server there is no one logged in and running the selenium process, so the tests won't be able to actually launch the browser. 

To solve this problem, we can instead run our tests against [Selenium Grid](). Selenium Grid also has several other advantages when running your tests:

* advantage 1
* advantage 2

## Getting Started

You will obviously need a server that you are going to use to run your selenium tests on. This could be the same as your build server or separate. Depending on the load

So what are we waiting for, to get started we just need to run through the following steps:

1. Download and configure Selenium Grid on our test server
2. Configure Selenium Grid to run as a Windows Service
3. Create a script to easily keep selenium and browser drivers up to date. 

We will then be able to point our local test framework at this server and see it in action. In the next post we will then configure our build server to actually trigger the tests to run on this server every time the application changes.

### Steps 1 & 2. Setting up Selenium Grid (on Windows Server 2012) as Windows Service.

The first thing to do is download all of the parts we are going to need:

* the [latest version of selenium server](http://www.seleniumhq.org/download/)
* The [latest chrome driver](https://sites.google.com/a/chromium.org/chromedriver/)
* The [latest internet explorer driver](http://selenium-release.storage.googleapis.com/index.html) (if you are using IE)

There are many guides to setting up selenium on the web, in fact I tried quite a few, but the one that worked best for me was [setting up selenium on windows](http://mrbluecoat.blogspot.co.uk/2014/05/set-up-selenium-on-windows-including-ie.html).

Rather than repeat it all here, I will describe the slightly different approach I took on some of the steps:


### Step 3. Keeping Selenium up to date

Download the binaries:
 
 * Selenium jar file and IEDriver: http://selenium-release.storage.googleapis.com/index.html
 * Chrome Driver: https://sites.google.com/a/chromium.org/chromedriver/
 
 



## Tips for running multiple projects. 