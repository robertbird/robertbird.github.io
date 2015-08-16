--- 
layout: post
title: Choosing a test automation strategy
author: "Robert Bird"
comments: true
excerpt_separator: <!--more-->
tags: [strategy testing]
---

I've recently been thinking a lot more about testing strategy and test automation. This is an area that I have been interested in for some time so I thought it was about time I wrote about it.

###Why automate?

The first question you need to answer is why automate your testing in the first place. There are many [well documented]() benefits to automation including: 
* 
*

But you also have to bear in mind that automating your tests can be a serious undertaking. Automation is just the same as software development, so plan it as you would any other project.

In my opinion test automation has to be justified with the ROI you are getting based on the manual regression testing time saved. So obvious factors would be project size and lifetime. 

To me it would seem to be more easily justified for companies building a product (I.e. long lifetime). However it may not be as clear for smaller projects when there is not so much time spent on manual regression tests.

###What to test?

There is a [well known theory]() about the cost associated with testing at different levels of an application. First of all, I am already assuming that you are already doing unit testing. (If you're not then stop reading this and plan your unit testing instead!)

So the next question to answer is do you really need to automate against the user interface, or is there a lower level you can test against instead? 

> Where possible try to find a way to execute a feature end to end without using a browser. There is often another way. 

For example if the user interface is backed by some kind of API then it will be easier to write tests against that then it will the UI. 

### Which tests should I automate?
The next thing to think about is which test cases do you automate? **You should not try to automate all of your test cases** 

Unless you are working on the simplest of applications there will be some test cases that are just too complicated and won't be worth the cost of automation. For example think about test cases involving receiving emails or SMS messages.

It again comes back to ROI. The way I have tackled this before is create a table
check for ROI by creating table of test cases. 

### What tool to use?

### Separate the "what" from the "how"
i.e. test cases vs test framework. 
i.e. enter gherkin. 

### How to manage test data?

### Summary

Remember: automation is software development. 