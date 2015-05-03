--- 
layout: post
title: Front End Performance Automation With Grunt
author: "Robert Bird"
comments: true
excerpt_separator: <!--more-->
tags:
- development
- blogging
---

[In my last post](/development/building-my-blog-with-jekyll-and-ruby/) I described how I set up this blog using a static site generator called [Jekyll](http://jekyllrb.com/). 

Jekyll allows me complete control over the HTML and for this site I am using a template that I bought online. Templates are a great way to get a very polished design and can be very cheap, one of my favourite template sites is [Wrap Bootstrap]() and templates only cost arount $20. However, many templates just throw together a lot of javascript controls and the many layout options they come with mekes for bluky CSS files. Unfortunately this can result in terrible front end performance!

There is lots of research as to why page speed is important, in [this article](http://www.websiteoptimization.com/speed/tweak/psychology-web-performance/) there are some great examples:

> Google found that moving from a 10-result page loading in 0.4 seconds to a 30-result page loading in 0.9 seconds decreased traffic and ad revenues by 20% (Linden 2006)... Tests at Amazon revealed similar results: every 100 ms increase in load time of Amazon.com decreased sales by 1% (Kohavi and Longbotham 2007)

If Front-End Performance Optimisaion is new to you then you need to stop reading and go and buy this book:

[![High Performance Websites](http://ecx.images-amazon.com/images/I/5169mD4idJL._SL250_.jpg)](http://www.amazon.co.uk/gp/offer-listing/0596529309/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=0596529309&linkCode=am2&tag=robbirsblo-21&linkId=UXT3PZXEMUA7KVKG)
![Amazon Link](http://ir-uk.amazon-adsystem.com/e/ir?t=robbirsblo-21&l=as2&o=2&a=0596529309)

[High Performance Web Sites by Steve Souders is a timeless classic](http://www.amazon.co.uk/gp/offer-listing/0596529309/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=0596529309&linkCode=am2&tag=robbirsblo-21&linkId=UXT3PZXEMUA7KVKG) and won't take long to read but if you practice the techniques described in the book you will be on to a winner and keep page load times to a minimum. 

[Steve Souders](http://www.stevesouders.com) also points out that page loads times often follow the [80/20 golden rule](http://www.stevesouders.com/blog/2012/02/10/the-performance-golden-rule/) whereby 80% of the load time is actually in the browser, so no matter how fast you make the code on your server, you may be missing some of the easiest wins.

![The 80/20 Rule of Web Performance Optimisation](http://stevesouders.com/images/golden-waterfall.png)

Most of these techniques are now just common sense, but in this post I am going to walk through how I've applied them to this blog. 

## Perofrmance Benchmarking Tools

There are great free resources and tools available to help, so the first step is to benchmark the current status of our site.

#### [Webpage Test](http://www.webpagetest.org/)
This tool should be your starting point. It lets you choose a browser version and location and then measures the speed of your site for both first load and repeat view performance. There is loads of useful data in the results as well as recommendations. I personally like the video showing what users see when your site is loading which can really highlight how front end performance can impact rendering times.

#### [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
This started out as a browser plugin (which is still available) but the great thing about the web based version is that it also tests your site for mobile devices. There are lots of links to more information telling you how to fix any of the problems highlighted.

#### [YSlow](http://yslow.org/)
YSlow was the first front end performance tool I came across and started out as a firefox plugin. To be honest I usually tend to use PageSpeed these days as it contains more information.

#### [ShowSlow](http://www.showslow.com/)
ShowSlow is great because it brings together many of the other tools out there and uses them to monitor your sites performance over time. This is a perfect tool to make sure that once you have optimised your site you don't let things slip as development continues!

#### [3PO (3rd Party Optimisations)](http://www.phpied.com/3po/)
This is an extension on top of YSlow to try to help us developers optimise 3rd party widgets like Facebook, Twitter and Google Analytics.

## Our Starting Score

**Webpage Test**

[![Webpage Test Results]({{ site.url }}/assets/perf/WebPagetestResult-tn2.png)]({{ site.url }}/assets/perf/WebPagetestResult.png)

**Google PageSpeed Insights**

[![Webpage Test Results]({{ site.url }}/assets/perf/PageSpeedInsights-tn.png)]({{ site.url }}/assets/perf/PageSpeedInsights-mobile.png)

So the results are in and they are not good. This is typical for many websites - so far I have taken the path of least resistance and just used an off the shelf template which isn't following any of the rules outlined in Steve's book *High Performance Web Sites*. 

Luckily for me, the site is hosted on [GitHub Page](https://pages.github.com/) so most of the server side improvements like keep alives, use of a CSN and GZip compression are already being done for me. Also the fact that my site is just returning pre generated static HTML files coupled with the fact that GitHub use a reasonably fast CDN for the content means the time to first byte is also very good.

But we can do so much better and just by making some very easy changes to the way we are working.

## Front-End Automation with Yeoman, Grunt and Gulp.

Let's review the [14 basic Rules outlined by Steve Souders](http://cs-server.usc.edu:45678/resources/web_performance/souders_steve.pdf):

1. Make fewer HTTP requests
2. <del>Use a CDN</del>
3. Add an Expires header
4. <del>Gzip components</del>
5. Put CSS at the top
6. Move JS to the bottom
7. Avoid CSS expressions
8. <del>Make JS and CSS external</del>
9. <del>Reduce DNS lookups</del>
10. Minify JS
11. <del>Avoid redirects</del>
12. <del>Remove duplicate scripts</del>
13. <del>Turn off ETags</del>
14. Make AJAX cacheable and small

The items crossed through are either already being done for us by GitHub pages or are beyond our control . Whilst there are many positives (mostly the price), there are also [some downsides to using GitHub pages](http://www.kevinsweet.com/pros-cons-github-pages/) which means we will not be able to address every single issue, namely the caching headers.

#### Round 1

So if we review the items left then the following actions seem like an obvious starting point:
 - Move CSS to the top.
 - Move javascript to the top. 

While I was there I also removed the use of redundant javascript files which came with the template but I am not actually using. After these improvement the result is:


(I am going to use the Google Pagespeed rankings to show incremental performance improvements as the number rating gives a us a good way to quantify the changes.)

## Round 2 

The next important step (which I always think makes the biggest difference) is just to minimse the number of HTTP requests. 

So we currently have XXXXXXXXXXX requests for css files and YYYYYYYYY requests for javascript files. The plan is to combine these files together so that we make only one request for CSS and another single request for javascript. When combining the files we can actually go one step further and minimise the files while we are there. 




Some more advanced performance improvements include

- Image compression
- Spritesheets
- Using a different domain for images and cookies ??
- Using a CDN - setting up Azure as a cdn on a different sub.domain for images and static resources



http://markdalgleish.github.io/presentation-build-wars-gulp-vs-grunt/

[Node's nested node_modules approach is basically incompatible with Windows](https://github.com/joyent/node/issues/6960)



## Final score.


