--- 
layout: post
title: Planning a test automation strategy
author: "Robert Bird"
comments: true
excerpt_separator: <!--more-->
tags: 
- testing
- specflow
- selenium
- strategy
---

DevOps and Continuous Deployment are important trends in allowing your business to react and adapt to meet the needs of your customers. However, in my experience, it's common to see teams that have automated their build and deployment process only to find that they are not able to test releases quickly enough. 

![Test Automation]({{ site.url }}/assets/test-automation/testAutomationScenario.png)

But that's ok, an important part of DevOps is identifying your bottlenecks and improving on them one by one. It's important to plan your testing strategy carefully and in this post I outline some of the choices and considerations you may face along the way.

##Why automate?

The first question you need to answer is why automate your testing in the first place. There are many benefits to automation including:

 * Increased regression test speed meaning shorter release cycles
 * Increased confidence in builds
 * Reduce time spent on mundane repetitive testing and allow your test team more time for exploratory testing

But you also have to bear in mind that automating your tests can be a serious undertaking. Automation is just another form of software development, so plan it as you would any other project.

In my opinion test automation should always be justified by the ROI you will see based on the time saved from manual regression testing. So obvious factors to consider would be project size and lifetime. 

To me it would seem to be more easily justified for companies building a product (i.e. long lifetime). However it may not be as clear for smaller projects when there is not so much time spent on manual regression tests.

##What to test against?

There is a [well known theory](http://martinfowler.com/bliki/TestPyramid.html) about the cost associated with testing at different levels of an application. First of all, I am already assuming that you are already doing unit testing. (If you're not then stop reading this and plan your unit testing instead!)

The next question to answer is do you really need to automate against the user interface, or is there a lower level you can test against instead? 

>Wherever possible, try to find a way to execute a feature end to end without using the browser.

For example if the user interface is backed by some kind of API then it will be easier to write tests against that then it will the UI. 


## What tool to use?

The biggest decision to be made is choosing the right tooling. When it comes to testing a web based user interface there are two main types of tools available:

1. Record and playback
2. Writing code using an automation Library.

My experience with the record/playback tools started with [Selenium IDE](http://www.seleniumhq.org/projects/ide/). The problem with this approach is that each test is recorded individually and common steps cannot be reused. This means if an element that appears on every page changes, you may find yourself needing to change every test manually or re-record them. This is a major drawback and means you need to be very careful with free record/playback tooling.

However, paid for record and playback options have come on a long way in recent times. [Telerik Test Studio](http://www.telerik.com/teststudio) for example understands your page structures and creates a library of page models which are shared between tests. This makes it easy when a page changes to find the affected controls and update them in a single place.

The second category of tooling generally come in the form of libraries that can be built upon with your own code. This includes libraries such as [Selenium](http://www.seleniumhq.org/projects/webdriver/) and [Watin](http://watin.org/). The advantage here is that you are in complete control, however you also need a lot of discipline to make sure you structure your code for a reliable and maintainable solution.

When deciding to write code yourself, you need to consider the development language of any tooling. Presumably you already have a development team producing the software to be tested, so depending on the size of the test team, it would make sense to use a tool that has support for a language the development team are familiar with. That way they can lend a hand or potentially some of the work load can be split with the developers.

## Separate the "what" from the "how"

Another important thing to consider when choosing an automation tool is who will actually be writing the tests? 

If you need business users or customers to help write the tests then you should consider a tool that uses natural language to specify the test case. Tools derived from the Gherkin syntax are very popular, namely [Cucumber](https://cucumber.io/) in Ruby or [Specflow](http://www.specflow.org/) in .Net. These tools will translate from a human readable specifications in Given-When-Then format into a code 'binding' which will execute an automation library such as Selenium. 

Separating the test case from the test framework like this has several advantages:

* Users writing the tests do not need to be technical
* The bindings you create can be re-used across tests, over time forming your own domain specific language (DSL)
* If you have a test team that are not technical, it provides a nice separation of work between the test team writing the test cases (the what) and the development team making them pass by writing the mappings (the how)
 
 
## Which tests should I automate?
The next thing to think about is which test cases do you automate? 

>Don't try to automate all of your test cases

Unless you are working on the simplest of applications there will be some test cases that are just too complicated and won't be worth the cost of automation. For example think about test cases involving receiving emails or SMS messages.

It again comes back to ROI. The way I like to approach this is to maintain a table of test cases to help you prioritise based on the following columns:

* **Test case name**
* **Risk** - What is the probability and impact of failure. i.e. the higher the risk the more it will be keeping you awake at night! (High/Med/Low)
* **Manual test cost** - how long does it take to manually execute? (hours)
* **Frequency** - how often is this test case executed (High/Med/Low)
* **Automation cost** - how much effort is involved in automating? (story points)

Obviously test cases that take a lot of manual time and are easily automated are the ones to prioritise, but there may be other factors to consider such as automating high risk areas of the system first.

## How to manage test data?

One common complication with test automation, especially with larger applications, is how do you test scenarios that rely on previous state.

For example imagine you are building a website that takes a customer's order; it goes through a series of screens in the checkout process, the final one being to take a payment. How do you test each of the different payment methods efficiently?

First off, you should never rely on your tests to run a certain order, so no matter how tempting it may seem, you can't chain tests together. Even if you could this would become very complicated and restrictive. Being able to run any subset of your tests will become very important as the number of test cases grows. 

Purists would say that each test needs to first create its own test data, so in our example it would need to create a new order and run it all the way to the point of making a payment. The problem is that doing this via the user interface will soon lead to very slow long running tests.

So what is the best approach? Well I have found success with either of the following approaches:

1. **Each test creating its own test data** and setting the system state it needs in the quickest way possible. This could be by accessing the database directly or via an API. This approach has the advantage that tests are easily repeatable, but the disadvantage that the test suite is likely to need access levels that a normal user wouldn't have. For example if you want to run your tests against a production system then it may not be (read definitely shouldn't be) possible to get direct access to the database.
2. **By putting the application into a known starting state** and making sure that test each operate on their own data. So in our example, each test would have its own order already in the starting state needed for the given test case. For complex systems this is my preferred approach and can be achieved by restoring a testing database as long as the application can be triggered to run under a test account or test mode that will run against this database. This has the advantage that the tests execute quickly and as long as you can automate the deployment of the database it can be possible to run against production systems. 

The subject of test data could easily fill a blog post of its own, but it shows that this is something that needs to be considered right from the start.


## Summary

We've seen that there is a lot to think about when planning your automation strategy and a lot of decisions to make along the way. 

So far I'm very happy with the tools that we are using and in future posts I intend to dig deeper and show how to setup a basic test automation framework using Specflow and Selenium to test a web application. 

I'm keen to hear what routes other people have taken and the decisions they made along the way. Please let me know in the comments!










