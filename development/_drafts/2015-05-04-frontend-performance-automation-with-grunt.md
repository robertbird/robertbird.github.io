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

<iframe src="http://www.webpagetest.org/video/view.php?id=150502_BV_VSC.1.0&embed=1&width=520&height=432" width="520" height="432"></iframe>

http://www.webpagetest.org/result/150502_BV_VSC/
(66 Requests)


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

![Webpage Test Results]({{ site.url }}/assets/perf/PageSpeedInsights-stage1-tn.png)

(I am going to use the Google Pagespeed rankings to show incremental performance improvements as the number rating gives a us a good way to quantify the changes.)

#### Round 2 

The next important step (which I always think makes the biggest difference) is just to minimse the number of HTTP requests. 

So we currently have 12 requests for css files and 9 requests for javascript files. The plan is to combine these files together so that we make only one request for CSS and another single request for javascript. When combining the files we can actually go one step further and minimise the files while we are there. 

http://www.webpagetest.org/result/150503_BA_MG0/1/details/

We've brought the number of requests down slightly, but there are still far too many, the main thing to note with this change is that the 

## Enter front end build automation tooling (Grunt vs Gulp)

If you've not heard of Grunt or Gulp before then they are definitely worth investigating. They allow developers to automate many of the tasks associated with front end programming from running unit tests to running analysis tools such as JSLint. You can also find plenty of tasks to combine and minify assets, so they are perfect for our needs. They both run at the commandline and make use of Node JS. The great thing about them is that you can set them up to watch the file system and run your build pipeline as soon as anything changes. I first came across these tools when I saw Paul Irish presenting a frontend development workflow which is very inspiring and definitely worth watching. 

It seems that Gulp is the new Grunt and as I am into blindly following new trends at the moment (static site generators are the new CMS?) then I thought I would give it a go. However, some of the plugins I was hoping to use, namely imagemin just didn't work out for me because of a path length problem, which I think is just due to an underlying problem with Node Package Manager (NPM) running on windows. 

If you are starting a new project then a great resource to check out is Yeoman. They have a great discussion about plugins for performance optimisations here. They list plugins for both Grunt and Gulp, if you are wondering which one to go for then there is quite a good overview here.

So first things first we need to first install Grunt.

#### Installing Grunt

The first thing we need to do is install Node, you can do this by going to [the node website](https://nodejs.org/download/) and downloading the latest version. Personally find it easier to use [Chocolatey](https://chocolatey.org/) and keep a log of the tools I use so that I can easily install them again. So to install via Chocolatey then you can use:

choco install nodejs.install

Once you have Node JS installed you can browse to the website root and run the following command to install Grunt. 

npm install -g grunt-cli

This will install Grunt globally, we now need to setup grunt within our project folder too. 

First we need to create a package.json file. We can then install node modules (including Grunt) into our project by running:


However, if we know the modules we want we can add them to the package file and install them all at once. So we will do this by adding the following package.json file:

{
  "name": "robertbird.co.uk",
  "version": "1.0.0",
  "dependencies": {},
  "devDependencies": 
  {
    "grunt": "~0.4.1",
    "load-grunt-tasks": "~0.1.0",
    "grunt-contrib-clean": "~0.5.0",
    "grunt-usemin": "~0.1.11",
    "grunt-concurrent": "~0.3.0",
    "grunt-contrib-imagemin": "~0.2.0",
    "grunt-svgmin": "~0.2.0",
    "grunt-contrib-htmlmin": "~0.1.3",
    "grunt-contrib-concat": "~0.3.0",
    "grunt-contrib-copy": "~0.4.1",
    "grunt-contrib-cssmin": "~0.6.0",
    "grunt-contrib-uglify": "~0.2.0",
    "grunt-rev": "~0.1.0"
  }
}

Now we just run 

npm install

And node will initialise our project folder based on this config file. 

The final thing we need to do is create a Grunt build file.



## Automating Minification and Combining of Files.


## Image Crunching


## More advanced optimisations

### Spritesheets


### Using a subdomain and CDN to host static files (with no cookies). 

http://markdalgleish.github.io/presentation-build-wars-gulp-vs-grunt/

[Node's nested node_modules approach is basically incompatible with Windows](https://github.com/joyent/node/issues/6960)



## Final score.



## Useful Links

Here are some links I found useful:

* [Speeding up your site with a build process](http://www.designsuperbuild.com/blog/getting_started_with_grunt/)
* [How to Install Gulp.js on Windows](http://omcfarlane.co.uk/install-gulp-js-windows/)
* [Sample Gulp file](https://gist.github.com/franksmule/9817730)
* [Getting started with gulp](https://markgoodyear.com/2014/01/getting-started-with-gulp/)
* [YEOMAN - Performance Optimisations recommendations](http://yeoman.io/blog/performance-optimization.html)
* [Jekyll Grunt Yeoman Generator](https://github.com/robwierzbowski/generator-jekyllrb/)
* [Install BrowserSync manually to get past errors](https://github.com/robwierzbowski/generator-jekyllrb/issues/145)
* [Getting Started with Grunt - Speeding up your site with a build process](http://www.designsuperbuild.com/blog/getting_started_with_grunt/)
* [“Grunt” your way to frontend performance optimization](http://www.bbinto.me/easy/grunt-your-way-through-frontend-performance-optimization/)
* [Grunt Boilerplate](https://github.com/chriscoyier/My-Grunt-Boilerplate)
* [Supercharging your Gruntfile](http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/)
* [ShowSlow](http://www.showslow.com/details/44581568/http://www.robertbird.co.uk/#webpagetest)
* [Grunt - concat](https://github.com/gruntjs/grunt-contrib-concat)
* [Jekyll configuration options - for excluding content (node modules)](http://jekyllrb.com/docs/configuration/)
* [Gulp documentation](https://github.com/gulpjs/gulp/blob/master/docs/API.md)
* [Gulp - node streams](https://github.com/substack/stream-handbook)
* [Optimizing Images with Grunt & Gulp](https://mijingo.com/blog/optimizing-images-with-grunt-gulp)
* [Grunt Build Control - task for checking in as part of a build](https://github.com/robwierzbowski/grunt-build-control)


Perf Results Pages:
* [Initial](http://www.webpagetest.org/result/150502_BV_VSC/)
* [Round 1](http://www.webpagetest.org/result/150503_BA_MG0/)
* [Round 2](http://www.webpagetest.org/result/150503_WV_V19/)
* [Round 3](http://www.webpagetest.org/result/150503_42_VZ7/)
* []()

npm install -g generator-jekyllrb
yo jekyllrb
npm install --msvs_version=2012
npm install bower -g
bower install
npm install grunt-browser-sync --save-dev --msvs_version=2012
node --version




Use flag  --msvs_version=2012 when installing if you see visual studio errors

{ImageMin problems on Windows](https://github.com/gruntjs/grunt-contrib-imagemin/issues/109)

http://davidcalhoun.me/2013/10/30/migration-to-jekyll-my-journey-to-understanding-yeoman/

[Grunt Auto Prefixer](http://grunt-tasks.com/autoprefixer/)